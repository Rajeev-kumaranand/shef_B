import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getHomeContent = async (req, res, next) => {
  try {
    const home = await prisma.homeContent.findFirst();
    if (!home) return res.status(404).json({ success: false, message: 'Home content not found' });
    res.status(200).json({ success: true, data: home });
  } catch (err) { next(err); }
};

export const updateHomeContent = async (req, res, next) => {
  try {
    const home = await prisma.homeContent.findFirst();
    if (!home) return res.status(404).json({ success: false, message: 'Home content not found' });

    const updatedHome = await prisma.homeContent.update({
      where: { id: home.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: updatedHome });
  } catch (err) { next(err); }
};
