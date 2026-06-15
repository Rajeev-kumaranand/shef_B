import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Customer creates review
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const customerId = req.customer.id;

    // Check if customer actually purchased this product
    const orderWithProduct = await prisma.order.findFirst({
      where: {
        customerId,
        items: {
          some: { productId }
        }
      }
    });

    if (!orderWithProduct) {
      return res.status(403).json({ success: false, message: 'You can only review products you have purchased' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: { productId, customerId }
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerId,
        rating: parseInt(rating),
        title,
        comment,
        approved: false // Requires admin approval
      }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// Public gets approved reviews for a product
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { 
        productId,
        approved: true 
      },
      include: {
        customer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = reviews.length > 0 ? (total / reviews.length).toFixed(1) : 0;

    res.json({ 
      success: true, 
      data: {
        reviews,
        average,
        count: reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true } },
        customer: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    const review = await prisma.review.update({
      where: { id },
      data: { approved }
    });
    
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
