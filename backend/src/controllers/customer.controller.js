import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const customerExists = await prisma.customer.findUnique({ where: { email } });
    if (customerExists) {
      return res.status(400).json({ success: false, message: 'Customer already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        token: generateToken(customer.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        token: generateToken(customer.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.id },
      include: {
        addresses: true,
      }
    });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    // exclude password
    const { password, ...customerData } = customer;
    
    res.json({ success: true, data: customerData });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.customer.id },
      data: { name, phone }
    });
    
    const { password, ...customerData } = customer;
    res.json({ success: true, data: customerData });
  } catch (error) {
    next(error);
  }
};

// ADDRESSES
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { customerId: req.customer.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const data = req.body;
    
    // Check if this is the first address, if so make it default
    const existing = await prisma.address.count({ where: { customerId: req.customer.id } });
    const isDefault = data.isDefault || existing === 0;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId: req.customer.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        customerId: req.customer.id,
        isDefault
      }
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Ensure address belongs to customer
    const addr = await prisma.address.findFirst({ where: { id, customerId: req.customer.id } });
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { customerId: req.customer.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data
    });
    res.json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addr = await prisma.address.findFirst({ where: { id, customerId: req.customer.id } });
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });

    await prisma.address.delete({ where: { id } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};
