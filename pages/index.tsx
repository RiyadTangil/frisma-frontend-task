import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { findManyMasjidsWithBanksWithLatestDeposit } from '../lib/prisma/utils';
import { Prisma } from '@prisma/client';

// Define the type for our props
type HomeProps = {
  masjids: Array<{
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    banks: Array<{
      id: string;
      name: string;
      accountNumber: string;
      latestDeposit: {
        id: string;
        amount: number;
        depositDate: string;
        description: string | null;
      } | null;
    }>;
  }>;
};

export default function Home({ masjids }: HomeProps) {
  const [selectedMasjid, setSelectedMasjid] = useState<string | null>(null);

  // Get the selected masjid data
  const masjidData = masjids.find((m) => m.id === selectedMasjid);

  return (
    <div className="min-h-screen p-4">
      <Head>
        <title>Masjid Banking System</title>
        <meta name="description" content="A demo of Prisma with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Masjid Banking System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Masjids</h2>
            <ul className="space-y-2">
              {masjids.map((masjid) => (
                <li 
                  key={masjid.id}
                  className={`p-3 rounded cursor-pointer ${
                    selectedMasjid === masjid.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedMasjid(masjid.id)}
                >
                  <div className="font-medium">{masjid.name}</div>
                  <div className="text-sm text-gray-600">{masjid.city}, {masjid.state}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 bg-white p-4 rounded-lg shadow">
            {selectedMasjid ? (
              <>
                <h2 className="text-xl font-semibold mb-4">{masjidData?.name} Details</h2>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700">Address</h3>
                  <p>{masjidData?.address}</p>
                  <p>{masjidData?.city}, {masjidData?.state}</p>
                </div>

                <h3 className="font-medium text-gray-700 mb-2">Banks & Latest Deposits</h3>
                <div className="space-y-4">
                  {masjidData?.banks.map((bank) => (
                    <div key={bank.id} className="border p-3 rounded">
                      <div className="flex justify-between">
                        <div className="font-medium">{bank.name}</div>
                        <div className="text-sm text-gray-600">Account: {bank.accountNumber}</div>
                      </div>
                      
                      {bank.latestDeposit ? (
                        <div className="mt-2 p-2 bg-green-50 rounded">
                          <div className="flex justify-between">
                            <div className="text-sm">Latest Deposit: ${bank.latestDeposit.amount.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(bank.latestDeposit.depositDate).toLocaleDateString()}
                            </div>
                          </div>
                          {bank.latestDeposit.description && (
                            <div className="text-sm text-gray-600 mt-1">{bank.latestDeposit.description}</div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          No deposits yet
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Select a masjid to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Use our custom Prisma utility to fetch masjids with banks and their latest deposits
    const masjids = await findManyMasjidsWithBanksWithLatestDeposit({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      props: {
        masjids: JSON.parse(JSON.stringify(masjids)), // Serialize dates to strings
      },
    };
  } catch (error) {
    console.error('Error fetching masjids:', error);
    
    // Return empty data if there's an error
    return {
      props: {
        masjids: [],
      },
    };
  }
}; 