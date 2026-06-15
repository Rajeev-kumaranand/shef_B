import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const getMedia = async (req, res, next) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: media });
  } catch (err) { next(err); }
};

export const uploadMediaFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const media = await prisma.media.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: `/uploads/media/${req.file.filename}`
      }
    });

    res.status(201).json({ success: true, data: media });
  } catch (err) { next(err); }
};

export const deleteMediaFile = async (req, res, next) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.media.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};
