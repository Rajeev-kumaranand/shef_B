import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get the global website settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.websiteSettings.findFirst();
    
    // If no settings exist yet, create default
    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: {} // Uses all schema defaults
      });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// Update global website settings (Admin only)
export const updateSettings = async (req, res, next) => {
  try {
    const data = req.body;
    let settings = await prisma.websiteSettings.findFirst();

    const updateData = { ...data };
    
    // Parse decimals
    if (updateData.flatShippingCost !== undefined) updateData.flatShippingCost = parseFloat(updateData.flatShippingCost);
    if (updateData.freeShippingThreshold !== undefined) updateData.freeShippingThreshold = parseFloat(updateData.freeShippingThreshold);
    if (updateData.taxPercentage !== undefined) updateData.taxPercentage = parseFloat(updateData.taxPercentage);

    // Parse booleans
    if (updateData.codEnabled !== undefined) updateData.codEnabled = Boolean(updateData.codEnabled);
    if (updateData.onlinePaymentEnabled !== undefined) updateData.onlinePaymentEnabled = Boolean(updateData.onlinePaymentEnabled);
    if (updateData.announcementEnabled !== undefined) updateData.announcementEnabled = Boolean(updateData.announcementEnabled);

    if (!settings) {
      settings = await prisma.websiteSettings.create({ data: updateData });
    } else {
      settings = await prisma.websiteSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
