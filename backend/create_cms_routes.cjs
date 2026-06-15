const fs = require('fs');
const path = require('path');

const models = ['discover', 'shop', 'latest', 'community', 'note'];

models.forEach(model => {
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  const prismaModel = `${model}Content`;

  // Controller
  const controllerContent = `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const get${capModel}Content = async (req, res, next) => {
  try {
    const content = await prisma.${prismaModel}.findFirst();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.status(200).json({ success: true, data: content });
  } catch (err) { next(err); }
};

export const update${capModel}Content = async (req, res, next) => {
  try {
    const content = await prisma.${prismaModel}.findFirst();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    const updatedContent = await prisma.${prismaModel}.update({
      where: { id: content.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: updatedContent });
  } catch (err) { next(err); }
};
`;
  fs.writeFileSync(path.join(__dirname, `src/controllers/${model}.controller.js`), controllerContent);

  // Route
  const routeContent = `import express from 'express';
import { get${capModel}Content, update${capModel}Content } from '../controllers/${model}.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(get${capModel}Content)
  .put(authenticateAdmin, update${capModel}Content);

export default router;
`;
  fs.writeFileSync(path.join(__dirname, `src/routes/${model}.routes.js`), routeContent);
});

console.log('Controllers and Routes created.');
