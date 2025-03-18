import { Prisma, Masjid, Bank, Deposit } from "@prisma/client";
import prisma from "./index";

/**
 * Type definition for the return type of the findMasjidWithBanksWithLatestDeposit function
 */
type MasjidWithBanksAndDeposits<T extends Prisma.MasjidSelect> = 
  Prisma.MasjidGetPayload<{ select: T }> & {
    banks: Array<{
      id: string;
      name: string;
      accountNumber: string;
      deposits: Array<Deposit>;
      latestDeposit: Deposit | null;
    }>;
  };

/**
 * Type definition for bank fields that can be selected
 */
type BankSelect = {
  id?: boolean;
  name?: boolean;
  accountNumber?: boolean;
  routingNumber?: boolean;
  address?: boolean;
  city?: boolean;
  state?: boolean;
  zipCode?: boolean;
  country?: boolean;
};

/**
 * Type definition for deposit fields that can be selected
 */
type DepositSelect = {
  id?: boolean;
  amount?: boolean;
  description?: boolean;
  depositDate?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
};

/**
 * Type-friendly Prisma utility to find a Masjid with its Banks and their latest Deposits
 * This utility provides perfect autocompletion as if it were a first-class Prisma utility
 */
export const findMasjidWithBanksWithLatestDeposit = async <
  T extends Prisma.MasjidSelect
>(params: {
  where: Prisma.MasjidWhereUniqueInput;
  select: T;
  orderBy?:
    | Prisma.MasjidOrderByWithRelationInput
    | Prisma.MasjidOrderByWithRelationInput[];
  skip?: number;
  take?: number;
}): Promise<MasjidWithBanksAndDeposits<T> | null> => {
  const { where, select, orderBy, skip, take } = params;

  // First, find the Masjid with its Banks using findFirst instead of findUnique
  // to support orderBy, skip, and take parameters
  const rawMasjid = await prisma.masjid.findFirst({
    where,
    select: {
      ...(select as any),
      banks: {
        select: {
          id: true,
          name: true,
          accountNumber: true,
          deposits: {
            orderBy: {
              depositDate: "desc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy,
    skip,
    take,
  });

  if (!rawMasjid) return null;

  // Process the results to add the latestDeposit property to each bank
  const processedBanks = rawMasjid.banks.map((bank: any) => ({
    ...bank,
    latestDeposit: bank.deposits.length > 0 ? bank.deposits[0] : null,
  }));

  // Return the Masjid with type safety
  return {
    ...rawMasjid,
    banks: processedBanks,
  } as MasjidWithBanksAndDeposits<T>;
};

/**
 * Type-friendly Prisma utility to find multiple Masjids with their Banks and their latest Deposits
 */
export const findManyMasjidsWithBanksWithLatestDeposit = async <
  T extends Prisma.MasjidSelect,
  B extends BankSelect = { id: true; name: true; accountNumber: true },
  D extends DepositSelect = { id: true; amount: true; depositDate: true; description: true }
>(params: {
  where?: Prisma.MasjidWhereInput;
  select: T;
  bankSelect?: B;
  depositSelect?: D;
  orderBy?:
    | Prisma.MasjidOrderByWithRelationInput
    | Prisma.MasjidOrderByWithRelationInput[];
  skip?: number;
  take?: number;
}): Promise<Array<Prisma.MasjidGetPayload<{ select: T }> & {
  banks: Array<{
    [K in keyof B as B[K] extends true ? K : never]: K extends keyof Bank ? Bank[K] : never
  } & { latestDeposit: D extends Record<string, never> ? null : {
    [K in keyof D as D[K] extends true ? K : never]: K extends keyof Deposit ? Deposit[K] : never
  } | null }>
}>> => {
  const { where, select, bankSelect, depositSelect, orderBy, skip, take } = params;

  // Set default selections if not provided
  const bankSelectFields = bankSelect || { id: true, name: true, accountNumber: true };
  const depositSelectFields = depositSelect || { id: true, amount: true, depositDate: true, description: true };

  // Find all Masjids with their Banks and latest Deposits
  const rawMasjids = await prisma.masjid.findMany({
    where,
    select: {
      ...(select as any),
      banks: {
        select: {
          ...bankSelectFields,
          deposits: {
            select: depositSelectFields,
            orderBy: {
              depositDate: "desc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy,
    skip,
    take,
  });

  // Process the results to add the latestDeposit property to each bank
  const processedMasjids = rawMasjids.map((masjid: any) => ({
    ...masjid,
    banks: masjid.banks.map((bank: any) => ({
      ...bank,
      latestDeposit: bank.deposits.length > 0 ? bank.deposits[0] : null,
      deposits: undefined, // Remove the deposits array as we've extracted what we need
    })),
  }));

  // Return the Masjids with type safety
  return processedMasjids as any;
};
