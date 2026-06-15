import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getNavigations = async (req, res, next) => {
  try {
    const navs = await prisma.navigation.findMany({ orderBy: { order: 'asc' } });
    res.status(200).json({ success: true, data: navs });
  } catch (err) { next(err); }
};

export const createNavigation = async (req, res, next) => {
  try {
    const nav = await prisma.navigation.create({ data: req.body });
    res.status(201).json({ success: true, data: nav });
  } catch (err) { next(err); }
};

export const updateNavigation = async (req, res, next) => {
  try {
    const nav = await prisma.navigation.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: nav });
  } catch (err) { next(err); }
};

export const deleteNavigation = async (req, res, next) => {
  try {
    await prisma.navigation.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};
