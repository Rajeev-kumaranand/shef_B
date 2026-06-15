import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getContact = async (req, res, next) => {
  try {
    const contact = await prisma.contact.findFirst();
    res.status(200).json({ success: true, data: contact });
  } catch (err) { next(err); }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await prisma.contact.findFirst();
    const updated = await prisma.contact.update({
      where: { id: contact.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
};
