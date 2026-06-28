import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Public: Submit a community review
export const submitCommunityReview = async (req, res) => {
  try {
    const { name, email, role, rating, message } = req.body;

    const newReview = await prisma.communityReview.create({
      data: {
        name,
        email,
        role: role || null,
        rating: rating ? parseInt(rating, 10) : 5,
        message,
        approved: false // defaults to false
      }
    });

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error submitting community review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Public: Get all approved community reviews
export const getApprovedCommunityReviews = async (req, res) => {
  try {
    const reviews = await prisma.communityReview.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching approved community reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get all community reviews
export const getAllCommunityReviews = async (req, res) => {
  try {
    const reviews = await prisma.communityReview.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching all community reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Toggle approval status
export const toggleReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const review = await prisma.communityReview.update({
      where: { id },
      data: { approved }
    });

    res.status(200).json({ success: true, review });
  } catch (error) {
    console.error('Error updating review approval:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete review
export const deleteCommunityReview = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.communityReview.delete({
      where: { id }
    });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
