import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { z } from 'zod';

const prisma = new PrismaClient();

const qrCodeSchema = z.object({
  url: z.string().url(),
  metadata: z.record(z.any()).optional()
});

export const generateStaticQR = async (req: Request, res: Response) => {
  try {
    const { url, metadata } = qrCodeSchema.parse(req.body);
    
    const qrCode = await prisma.qRCode.create({
      data: {
        url,
        metadata,
        userId: req.user.userId,
        isDynamic: false
      }
    });

    const qrImage = await QRCode.toDataURL(url);
    res.json({ qrCode, qrImage });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const generateDynamicQR = async (req: Request, res: Response) => {
  try {
    const { url, metadata } = qrCodeSchema.parse(req.body);
    
    const qrCode = await prisma.qRCode.create({
      data: {
        url,
        metadata,
        userId: req.user.userId,
        isDynamic: true
      }
    });

    // Generate QR code with redirect URL
    const redirectUrl = `${process.env.API_URL}/qr/${qrCode.id}/redirect`;
    const qrImage = await QRCode.toDataURL(redirectUrl);
    
    res.json({ qrCode, qrImage });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const updateDynamicQR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { url } = qrCodeSchema.parse(req.body);
    
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: parseInt(id) }
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    if (qrCode.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!qrCode.isDynamic) {
      return res.status(400).json({ error: 'Cannot update static QR code' });
    }

    // Store URL history
    await prisma.uRLHistory.create({
      data: {
        qrCodeId: qrCode.id,
        oldUrl: qrCode.url,
        newUrl: url
      }
    });

    // Update QR code URL
    await prisma.qRCode.update({
      where: { id: parseInt(id) },
      data: { url }
    });

    res.json({ message: 'QR code updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { location, deviceType, ipAddress, userAgent } = req.body;

    await prisma.event.create({
      data: {
        qrCodeId: parseInt(id),
        location,
        deviceType,
        ipAddress,
        userAgent
      }
    });

    res.json({ message: 'Event tracked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: parseInt(id) }
    });

    if (!qrCode || qrCode.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const events = await prisma.event.findMany({
      where: { qrCodeId: parseInt(id) },
      orderBy: { timestamp: 'desc' }
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const qrCode = await prisma.qRCode.findUnique({
      where: { id: parseInt(id) }
    });

    if (!qrCode || qrCode.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const events = await prisma.event.findMany({
      where: {
        qrCodeId: parseInt(id),
        timestamp: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      }
    });

    // Calculate analytics
    const totalScans = events.length;
    const uniqueIPs = new Set(events.map(e => e.ipAddress)).size;
    const deviceTypes = events.reduce((acc, event) => {
      acc[event.deviceType || 'unknown'] = (acc[event.deviceType || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      totalScans,
      uniqueUsers: uniqueIPs,
      deviceTypes
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserQRCodes = async (req: Request, res: Response) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      where: { userId: req.user.userId },
      include: {
        _count: {
          select: { events: true }
        }
      }
    });

    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};