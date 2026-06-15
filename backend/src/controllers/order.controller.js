import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper to generate next order number
const generateOrderNumber = async () => {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!lastOrder) return 'SHEF-000001';

  // SHEF-000001 -> extract 000001 -> increment
  const lastNumberStr = lastOrder.orderNumber.replace('SHEF-', '');
  const lastNumber = parseInt(lastNumberStr, 10);
  const nextNumber = lastNumber + 1;
  
  return `SHEF-${nextNumber.toString().padStart(6, '0')}`;
};

export const createOrder = async (req, res) => {
  try {
    const { 
      customerId,
      customerName, 
      customerEmail, 
      customerPhone, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      pincode, 
      subtotal,
      discount = 0,
      couponCode,
      shipping, 
      total, 
      notes, 
      items 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain items' });
    }

    const orderNumber = await generateOrderNumber();

    // Run within a transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // 1. Validate Coupon if provided
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
        if (!coupon || !coupon.active || (coupon.expiresAt && new Date() > coupon.expiresAt) || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)) {
          throw new Error('Invalid or expired coupon');
        }
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }

      // 2. Validate & Decrement Inventory
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product not found: ${item.name}`);
        
        if (product.trackInventory) {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      // 3. Create Order
      return await tx.order.create({
        data: {
          orderNumber,
          customerId: customerId || null,
          customerName,
          customerEmail,
          customerPhone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          subtotal,
          discount,
          couponCode,
          shipping,
          total,
          notes,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          items: {
            create: items.map(item => ({
              productId: item.productId,
              productName: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          }
        },
        include: {
          items: true
        }
      });
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: true },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count()
    ]);

    res.status(200).json({ 
      success: true, 
      data: orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    // Attempt to find by ID or OrderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id }
        ]
      },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber, estimatedDeliveryDate } = req.body;

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (estimatedDeliveryDate !== undefined) {
      updateData.estimatedDeliveryDate = estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true }
    });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.customer.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { orderStatus: 'PENDING' } });
    const deliveredOrders = await prisma.order.count({ where: { orderStatus: 'DELIVERED' } });
    
    // Calculate total revenue (only from delivered/completed orders, or all? Let's use all for now as simple stat)
    const orders = await prisma.order.findMany({
      select: { total: true }
    });
    const revenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    res.status(200).json({ 
      success: true, 
      data: { totalOrders, pendingOrders, deliveredOrders, revenue } 
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
