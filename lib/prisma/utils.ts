import { Prisma } from '@prisma/client';
import prisma from './index';

/**
 * Type-friendly Prisma utility to find a Masjid with its Banks and their latest Deposits
 * This utility provides perfect autocompletion as if it were a first-class Prisma utility
 */
export const findMasjidWithBanksWithLatestDeposit = async <T extends Prisma.MasjidSelect>(
  params: {
    where: Prisma.MasjidWhereInput;
    select: T;
    include?: Prisma.MasjidInclude;
    orderBy?: Prisma.MasjidOrderByWithRelationInput | Prisma.MasjidOrderByWithRelationInput[];
    skip?: number;
    take?: number;
  }
) => {
  const { where, select, include, orderBy, skip, take } = params;

  // First, find the Masjid with its Banks
  const masjid = await prisma.masjid.findFirst({
    where,
    select: {
      ...select,
      banks: {
        include: {
          deposits: {
            orderBy: {
              depositDate: 'desc',
            },
            take: 1,
          },
        },
      },
    } as any, // Type assertion needed due to dynamic select
    include,
    orderBy,
    skip,
    take,
  });

  // Return the Masjid with type safety
  return masjid as Prisma.MasjidGetPayload<{ select: T }> & {
    banks: (Prisma.BankGetPayload<{
      include: {
        deposits: true;
      };
    }> & {
      latestDeposit: Prisma.DepositGetPayload<{}> | null;
    })[];
  };
};

/**
 * Type-friendly Prisma utility to find multiple Masjids with their Banks and their latest Deposits
 */
export const findManyMasjidsWithBanksWithLatestDeposit = async <T extends Prisma.MasjidSelect>(
  params: {
    where?: Prisma.MasjidWhereInput;
    select: T;
    include?: Prisma.MasjidInclude;
    orderBy?: Prisma.MasjidOrderByWithRelationInput | Prisma.MasjidOrderByWithRelationInput[];
    skip?: number;
    take?: number;
  }
) => {
  const { where, select, include, orderBy, skip, take } = params;

  // Find all Masjids with their Banks and latest Deposits
  const masjids = await prisma.masjid.findMany({
    where,
    select: {
      ...select,
      banks: {
        include: {
          deposits: {
            orderBy: {
              depositDate: 'desc',
            },
            take: 1,
          },
        },
      },
    } as any, // Type assertion needed due to dynamic select
    include,
    orderBy,
    skip,
    take,
  });

  // Process the results to add the latestDeposit property to each bank
  const processedMasjids = masjids.map((masjid: any) => {
    const processedBanks = masjid.banks.map((bank: any) => {
      return {
        ...bank,
        latestDeposit: bank.deposits.length > 0 ? bank.deposits[0] : null,
      };
    });

    return {
      ...masjid,
      banks: processedBanks,
    };
  });

  // Return the Masjids with type safety
  return processedMasjids as (Prisma.MasjidGetPayload<{ select: T }> & {
    banks: (Prisma.BankGetPayload<{
      include: {
        deposits: true;
      };
    }> & {
      latestDeposit: Prisma.DepositGetPayload<{}> | null;
    })[];
  })[];
}; 