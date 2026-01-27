/**
 * Log routes - CRUD operations for activity logs
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Get all logs for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    const { status } = req.query;
    
    const logs = await prisma.log.findMany({
      where: {
        userId,
        ...(status && { status: status as string }),
      },
      orderBy: { timestamp: 'desc' },
      take: 100, // Limit to last 100 logs
    });
    
    res.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs',
    });
  }
});

// Create log
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    const { contactId, contactName, phone, message, status, error } = req.body;
    
    if (!contactId || !contactName || !phone || !message || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }
    
    const log = await prisma.log.create({
      data: {
        userId,
        contactId,
        contactName,
        phone,
        message,
        status,
        error,
      },
    });
    
    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create log',
    });
  }
});

// Delete all logs
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default';
    
    const result = await prisma.log.deleteMany({
      where: { userId },
    });
    
    res.json({
      success: true,
      message: 'All logs deleted',
      count: result.count,
    });
  } catch (error) {
    console.error('Error deleting logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete logs',
    });
  }
});

export default router;
