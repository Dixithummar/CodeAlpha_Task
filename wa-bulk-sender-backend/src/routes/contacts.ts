/**
 * Contact routes - CRUD operations for contacts
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Get all contacts for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({
      success: true,
      data: contacts,
      count: contacts.length,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts',
    });
  }
});

// Get single contact
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const contact = await prisma.contact.findFirst({
      where: { id, userId },
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }
    
    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact',
    });
  }
});

// Create contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    const { name, phone, customFields, sent, sentAt, error } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone are required',
      });
    }
    
    const contact = await prisma.contact.create({
      data: {
        userId,
        name,
        phone,
        customFields: customFields ? JSON.stringify(customFields) : null,
        sent: sent || false,
        sentAt: sentAt ? new Date(sentAt) : null,
        error,
      },
    });
    
    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create contact',
    });
  }
});

// Bulk create contacts
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    const { contacts } = req.body;
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Contacts array is required',
      });
    }
    
    const data = contacts.map(c => ({
      userId,
      name: c.name,
      phone: c.phone,
      customFields: c.customFields ? JSON.stringify(c.customFields) : null,
      sent: c.sent || false,
      sentAt: c.sentAt ? new Date(c.sentAt) : null,
      error: c.error,
    }));
    
    const result = await prisma.contact.createMany({
      data,
    });
    
    res.status(201).json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    console.error('Error bulk creating contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create contacts',
    });
  }
});

// Update contact
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'default';
    const { name, phone, customFields, sent, sentAt, error } = req.body;
    
    const contact = await prisma.contact.updateMany({
      where: { id, userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(customFields !== undefined && { customFields: JSON.stringify(customFields) }),
        ...(sent !== undefined && { sent }),
        ...(sentAt !== undefined && { sentAt: sentAt ? new Date(sentAt) : null }),
        ...(error !== undefined && { error }),
      },
    });
    
    if (contact.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Contact updated',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact',
    });
  }
});

// Delete contact
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const contact = await prisma.contact.deleteMany({
      where: { id, userId },
    });
    
    if (contact.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Contact deleted',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact',
    });
  }
});

// Delete all contacts
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const result = await prisma.contact.deleteMany({
      where: { userId },
    });
    
    res.json({
      success: true,
      message: 'All contacts deleted',
      count: result.count,
    });
  } catch (error) {
    console.error('Error deleting contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contacts',
    });
  }
});

export default router;
