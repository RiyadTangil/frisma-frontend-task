import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '../../../lib/prisma';

// Define the schema for creating a masjid
const createMasjidSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zipCode: z.string().min(1, { message: 'Zip code is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().nullable(),
  website: z.string().url({ message: 'Invalid website URL' }).optional().nullable(),
});

// Define the schema for query parameters
const querySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle GET request
    if (req.method === 'GET') {
      // Validate query parameters
      const queryResult = querySchema.safeParse(req.query);
      
      if (!queryResult.success) {
        return res.status(400).json({
          success: false,
          errors: queryResult.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      
      const { limit, page } = queryResult.data;
      const skip = (page - 1) * limit;
      
      // Get masjids with pagination
      const [masjids, total] = await Promise.all([
        prisma.masjid.findMany({
          take: limit,
          skip,
          orderBy: { name: 'asc' },
          include: {
            banks: {
              include: {
                deposits: {
                  orderBy: { depositDate: 'desc' },
                  take: 1,
                },
              },
            },
          },
        }),
        prisma.masjid.count(),
      ]);
      
      // Process the results to add the latestDeposit property to each bank
      const processedMasjids = masjids.map(masjid => {
        const processedBanks = masjid.banks.map(bank => {
          return {
            ...bank,
            latestDeposit: bank.deposits.length > 0 ? bank.deposits[0] : null,
            deposits: undefined, // Remove the deposits array
          };
        });
        
        return {
          ...masjid,
          banks: processedBanks,
        };
      });
      
      return res.status(200).json({
        success: true,
        data: processedMasjids,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    }
    
    // Handle POST request
    if (req.method === 'POST') {
      // Validate request body
      const validationResult = createMasjidSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          errors: validationResult.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      
      // Create the masjid
      const masjid = await prisma.masjid.create({
        data: validationResult.data,
      });
      
      return res.status(201).json({
        success: true,
        data: masjid,
      });
    }
    
    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
} 