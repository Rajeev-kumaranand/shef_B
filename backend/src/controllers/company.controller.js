import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.findFirst();
    res.status(200).json({ success: true, data: company });
  } catch (err) { next(err); }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.findFirst();
    const updated = await prisma.company.update({
      where: { id: company.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
};
