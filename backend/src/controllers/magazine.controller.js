import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// ----------------------------------------------------
// Categories
// ----------------------------------------------------
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } }
    });
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    let slug = req.body.slug || slugify(name, { lower: true, strict: true });
    
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const category = await prisma.category.create({
      data: { name, slug, description, image }
    });
    res.json({ success: true, data: category });
  } catch (error) { next(error); }
};

// ----------------------------------------------------
// Tags
// ----------------------------------------------------
export const getTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { articles: true } } }
    });
    res.json({ success: true, data: tags });
  } catch (error) { next(error); }
};

export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    let slug = req.body.slug || slugify(name, { lower: true, strict: true });
    
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const tag = await prisma.tag.create({
      data: { name, slug }
    });
    res.json({ success: true, data: tag });
  } catch (error) { next(error); }
};

// ----------------------------------------------------
// Authors
// ----------------------------------------------------
export const getAuthors = async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany({
      include: { _count: { select: { articles: true } } }
    });
    res.json({ success: true, data: authors });
  } catch (error) { next(error); }
};

export const createAuthor = async (req, res, next) => {
  try {
    const { name, designation, bio, image, socials } = req.body;
    const author = await prisma.author.create({
      data: { name, designation, bio, image, socials }
    });
    res.json({ success: true, data: author });
  } catch (error) { next(error); }
};

// ----------------------------------------------------
// Articles
// ----------------------------------------------------
export const getArticles = async (req, res, next) => {
  try {
    const { category, tag, status, search, limit } = req.query;
    const where = {};

    if (status) where.status = status;
    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } }
      ];
    }

    const query = {
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } }
      }
    };
    if (limit) query.take = parseInt(limit);

    const articles = await prisma.article.findMany(query);
    res.json({ success: true, data: articles });
  } catch (error) { next(error); }
};

export const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } }
      }
    });

    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    // Increment view count if published
    if (article.status === 'PUBLISHED') {
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } }
      });
    }

    res.json({ success: true, data: article });
  } catch (error) { next(error); }
};

export const createArticle = async (req, res, next) => {
  try {
    const data = req.body;
    let slug = data.slug || slugify(data.title, { lower: true, strict: true });
    
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    // Calculate Read Time (avg 200 words per min)
    const words = data.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readTime = Math.ceil(words / 200);

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        status: data.status || 'DRAFT',
        categoryId: data.categoryId,
        authorId: data.authorId,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        readTime,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        canonicalUrl: data.canonicalUrl,
        schemaMarkup: data.schemaMarkup,
        tags: data.tagIds ? {
          create: data.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      }
    });

    res.json({ success: true, data: article });
  } catch (error) { next(error); }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updateData = { ...data };
    delete updateData.tagIds;

    // Recalculate read time if content changed
    if (data.content) {
      const words = data.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      updateData.readTime = Math.ceil(words / 200);
    }

    // Handle Tags update (delete all and recreate)
    if (data.tagIds) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });
      updateData.tags = {
        create: data.tagIds.map(tagId => ({
          tag: { connect: { id: tagId } }
        }))
      };
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: article });
  } catch (error) { next(error); }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) { next(error); }
};
