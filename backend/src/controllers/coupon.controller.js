import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin endpoints
export const createCoupon = async (req, res, next) => {
  try {
    const data = req.body;
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      }
    });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (data.expiresAt) {
      data.expiresAt = new Date(data.expiresAt);
    }
    
    const coupon = await prisma.coupon.update({
      where: { id },
      data
    });
    res.json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};

// Public endpoint
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.active) {
      return res.status(400).json({ success: false, message: 'Coupon is no longer active' });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (subtotal < parseFloat(coupon.minimumOrderAmount)) {
      return res.status(400).json({ success: false, message: `Minimum order amount of $${coupon.minimumOrderAmount} required` });
    }

    // Calculate discount
    let discount = 0;
    const value = parseFloat(coupon.discountValue);
    
    if (coupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (value / 100);
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = value;
    }

    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }

    res.json({ 
      success: true, 
      data: {
        code: coupon.code,
        discount: discount,
        type: coupon.discountType,
        description: coupon.description
      } 
    });
  } catch (error) {
    next(error);
  }
};
