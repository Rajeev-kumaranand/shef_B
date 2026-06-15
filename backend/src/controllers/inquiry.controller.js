import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// PUBLIC: Submit a new contact inquiry
export const submitInquiry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'NEW'
      }
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all inquiries with filtering and search
export const getInquiries = async (req, res, next) => {
  try {
    const { status, search, limit = 50 } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } }
      ];
    }

    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ success: true, data: inquiries });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get a specific inquiry
export const getInquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update inquiry (status, notes)
export const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes; // Allow empty string to clear notes

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete inquiry
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.contactInquiry.delete({ where: { id } });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Dashboard Stats
export const getInquiryStats = async (req, res, next) => {
  try {
    const [total, newCount, inProgress, closed] = await Promise.all([
      prisma.contactInquiry.count(),
      prisma.contactInquiry.count({ where: { status: 'NEW' } }),
      prisma.contactInquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.contactInquiry.count({ where: { status: 'CLOSED' } })
    ]);

    res.json({
      success: true,
      data: { total, new: newCount, inProgress, closed }
    });
  } catch (error) {
    next(error);
  }
};
