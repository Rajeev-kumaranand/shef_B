import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getLatestContent = async (req, res, next) => {
  try {
    const content = await prisma.latestContent.findFirst();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.status(200).json({ success: true, data: content });
  } catch (err) { next(err); }
};

export const updateLatestContent = async (req, res, next) => {
  try {
    const content = await prisma.latestContent.findFirst();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    const updatedContent = await prisma.latestContent.update({
      where: { id: content.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: updatedContent });
  } catch (err) { next(err); }
};
