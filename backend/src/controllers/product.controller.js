import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// Get all products (Public & Admin with pagination)
export const getProducts = async (req, res, next) => {
  try {
    const { category, active, featured, search, page = 1, limit = 20 } = req.query;
    
    let where = {};
    if (category) where.category = category;
    if (active !== undefined) where.active = active === 'true';
    if (featured !== undefined) where.featured = featured === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          reviews: {
            where: { approved: true },
            select: { rating: true }
          }
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({ 
      success: true, 
      data: products,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product (Public)
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Get product by slug (Public)
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({ 
      where: { slug },
      include: {
        reviews: {
          where: { approved: true },
          select: { rating: true }
        }
      }
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Create a new product (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, shortDesc, price, stock, sku, lowStockThreshold, trackInventory, category, featured, active, image, seoTitle, seoDescription, seoKeywords } = req.body;
    let slug = req.body.slug;
    
    // Auto-generate slug if not provided
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        sku: sku || undefined,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        trackInventory: trackInventory !== undefined ? trackInventory : true,
        category,
        featured: featured || false,
        active: active !== undefined ? active : true,
        image,
        seoTitle,
        seoDescription,
        seoKeywords
      }
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'A product with this slug or SKU already exists' });
    }
    next(error);
  }
};

// Update product (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, shortDesc, price, stock, sku, lowStockThreshold, trackInventory, category, featured, active, image, gallery, seoTitle, seoDescription, seoKeywords } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If slug is being updated, ensure uniqueness
    if (slug && slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({ where: { slug } });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'A product with this slug already exists' });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (sku !== undefined) updateData.sku = sku === '' ? null : sku;
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold);
    if (trackInventory !== undefined) updateData.trackInventory = Boolean(trackInventory);
    if (category !== undefined) updateData.category = category;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (active !== undefined) updateData.active = Boolean(active);
    if (image !== undefined) updateData.image = image;
    if (gallery !== undefined) updateData.gallery = gallery;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
