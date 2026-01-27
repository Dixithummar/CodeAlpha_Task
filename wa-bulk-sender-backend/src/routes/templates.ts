/**
 * Template routes - CRUD operations for message templates
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Get all templates for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const templates = await prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
    });
  }
});

// Get single template
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const template = await prisma.template.findFirst({
      where: { id, userId },
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }
    
    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template',
    });
  }
});

// Create template
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    const { name, content } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Name and content are required',
      });
    }
    
    const template = await prisma.template.create({
      data: {
        userId,
        name,
        content,
      },
    });
    
    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create template',
    });
  }
});

// Update template
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'default';
    const { name, content } = req.body;
    
    const template = await prisma.template.updateMany({
      where: { id, userId },
      data: {
        ...(name && { name }),
        ...(content && { content }),
      },
    });
    
    if (template.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Template updated',
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update template',
    });
  }
});

// Delete template
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const template = await prisma.template.deleteMany({
      where: { id, userId },
    });
    
    if (template.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Template deleted',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete template',
    });
  }
});

export default router;
