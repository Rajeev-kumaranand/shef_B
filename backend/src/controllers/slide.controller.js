import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSlides = async (req, res, next) => {
  try {
    const slides = await prisma.slide.findMany({ orderBy: { order: 'asc' } });
    res.status(200).json({ success: true, data: slides });
  } catch (err) { next(err); }
};

export const getSlide = async (req, res, next) => {
  try {
    const slide = await prisma.slide.findUnique({ where: { id: req.params.id } });
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
    res.status(200).json({ success: true, data: slide });
  } catch (err) { next(err); }
};

export const createSlide = async (req, res, next) => {
  try {
    const { title, order, active, image } = req.body;

    const slide = await prisma.slide.create({
      data: {
        title,
        image: image || '',
        order: order !== undefined ? parseInt(order) : 0,
        active: active !== undefined ? (active === 'true' || active === true) : true
      }
    });
    res.status(201).json({ success: true, data: slide });
  } catch (err) { next(err); }
};

export const updateSlide = async (req, res, next) => {
  try {
    const { title, order, active, image } = req.body;
    
    let updateData = { title, order: order !== undefined ? parseInt(order) : undefined };
    if (active !== undefined) updateData.active = active === 'true' || active === true;
    if (image !== undefined) updateData.image = image;

    const slide = await prisma.slide.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.status(200).json({ success: true, data: slide });
  } catch (err) { next(err); }
};

export const deleteSlide = async (req, res, next) => {
  try {
    await prisma.slide.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};
