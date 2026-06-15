import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getNoteContent = async (req, res, next) => {
  try {
    const content = await prisma.noteContent.findFirst();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.status(200).json({ success: true, data: content });
  } catch (err) { next(err); }
};

export const updateNoteContent = async (req, res, next) => {
  try {
    const content = await prisma.noteContent.findFirst();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    const updatedContent = await prisma.noteContent.update({
      where: { id: content.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: updatedContent });
  } catch (err) { next(err); }
};
