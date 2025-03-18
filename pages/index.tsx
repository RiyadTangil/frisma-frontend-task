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

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)',
      padding: '2rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'transparent'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1a202c',
      marginBottom: '1rem',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '600px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '2rem'
    },
    sidebar: {
      gridColumn: '1 / span 4',
      '@media (max-width: 768px)': {
        gridColumn: '1 / span 12'
      }
    },
    content: {
      gridColumn: '5 / span 8',
      '@media (max-width: 768px)': {
        gridColumn: '1 / span 12'
      }
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      backdropFilter: 'blur(5px)'
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #edf2f7',
      background: 'linear-gradient(to right, #4299e1, #3182ce)',
      color: 'white'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    cardTitleIcon: {
      fontSize: '1.25rem'
    },
    cardBody: {
      padding: '1.75rem'  // Increased padding for the card body
    },
    masjidList: {
      margin: 0,
      padding: '0.5rem',  // Added padding to the list
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.25rem',  // Increased gap between items
      maxHeight: '500px',
      overflowY: 'auto' as const,
      paddingRight: '1rem'  // Added more padding on the right
    },
    masjidItem: (isSelected: boolean) => ({
      cursor: 'pointer',
      padding: '1.5rem',  // Increased padding for each item
      borderRadius: '12px',
      backgroundColor: isSelected ? '#ebf8ff' : 'white',
      boxShadow: isSelected 
        ? '0 0 0 2px #3182ce, 0 8px 16px rgba(49, 130, 206, 0.2)' 
        : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      border: isSelected ? 'none' : '1px solid #edf2f7',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      transform: isSelected ? 'translateY(-2px)' : 'none',
      margin: '0.25rem 0'  // Added margin for better spacing
    }),
    masjidItemHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f7fafc'
    },
    masjidName: {
      fontWeight: 600,
      fontSize: '1.125rem',
      marginBottom: '0.75rem',
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.25rem 0'  // Added padding
    },
    masjidIcon: {
      color: '#3182ce',
      fontSize: '1rem'
    },
    masjidLocation: {
      fontSize: '0.875rem',
      color: '#4a5568',
      display: 'flex',
      alignItems: 'center',
      padding: '0.25rem 0'  // Added padding
    },
    locationDot: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#38a169',
      marginRight: '0.5rem',
      boxShadow: '0 0 0 2px rgba(56, 161, 105, 0.2)'
    },
    badge: {
      display: 'inline-block',
      padding: '0.35rem 0.75rem',  // Increased padding
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: '#ebf8ff',
      color: '#3182ce',
      marginTop: '0.75rem',  // Increased margin
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'  // Added subtle shadow
    },
    detailsCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      height: '100%',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      backdropFilter: 'blur(5px)'
    },
    detailsHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #edf2f7',
      background: 'linear-gradient(to right, #4299e1, #3182ce)',
      color: 'white'
    },
    detailsTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    detailsBody: {
      padding: '1.5rem'
    },
    addressSection: {
      marginBottom: '2rem',
      padding: '1.25rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#3182ce',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    sectionIcon: {
      fontSize: '1rem'
    },
    addressText: {
      fontSize: '1rem',
      color: '#2d3748',
      lineHeight: 1.6
    },
    bankSection: {
      marginTop: '2rem'
    },
    bankCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)'
      }
    },
    bankHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem'
    },
    bankName: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    bankIcon: {
      color: '#3182ce',
      fontSize: '1rem'
    },
    accountNumber: {
      fontSize: '0.875rem',
      color: '#718096',
      padding: '0.25rem 0.5rem',
      backgroundColor: '#f7fafc',
      borderRadius: '4px',
      border: '1px solid #e2e8f0'
    },
    depositCard: {
      marginTop: '0.75rem',
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f0fff4',
      border: '1px solid #c6f6d5',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    depositHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    depositAmount: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    depositIcon: {
      color: '#38a169',
      fontSize: '1rem'
    },
    depositDate: {
      fontSize: '0.875rem',
      color: '#718096',
      padding: '0.25rem 0.5rem',
      backgroundColor: 'white',
      borderRadius: '4px',
      border: '1px solid #e2e8f0'
    },
    depositDescription: {
      fontSize: '0.875rem',
      color: '#718096',
      marginTop: '0.75rem',
      padding: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '4px'
    },
    noDeposit: {
      marginTop: '0.75rem',
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f7fafc',
      border: '1px solid #edf2f7',
      fontSize: '0.875rem',
      color: '#718096',
      textAlign: 'center' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      color: '#a0aec0',
      textAlign: 'center' as const
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      color: '#3182ce',
      opacity: 0.5
    },
    emptyStateText: {
      fontSize: '1.125rem',
      maxWidth: '300px',
      lineHeight: 1.6
    },
    scrollbar: {
      '&::-webkit-scrollbar': {
        width: '6px'
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
        borderRadius: '10px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#c1c1c1',
        borderRadius: '10px',
        '&:hover': {
          backgroundColor: '#a8a8a8'
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Masjid Banking System</title>
        <meta name="description" content="A professional banking system for Masjids" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      </Head>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Masjid Banking System</h1>
          <p style={styles.subtitle}>A comprehensive platform for managing masjid finances and banking information</p>
        </div>
        
        <div style={styles.grid}>
          <div style={styles.sidebar}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <i className="fas fa-mosque" style={styles.cardTitleIcon}></i>
                  Masjids Directory
                </h2>
              </div>
              <div style={styles.cardBody}>
                <ul style={{...styles.masjidList, ...styles.scrollbar}}>
                  {masjids.map((masjid) => (
                    <li 
                      key={masjid.id}
                      style={styles.masjidItem(selectedMasjid === masjid.id)}
                      onClick={() => setSelectedMasjid(masjid.id)}
                      onMouseOver={(e) => {
                        if (selectedMasjid !== masjid.id) {
                          Object.assign(e.currentTarget.style, {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#f7fafc'
                          });
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedMasjid !== masjid.id) {
                          Object.assign(e.currentTarget.style, {
                            transform: 'none',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white'
                          });
                        }
                      }}
                    >
                      <div style={styles.masjidName}>
                        <i className="fas fa-building-columns" style={styles.masjidIcon}></i>
                        {masjid.name}
                      </div>
                      <div style={styles.masjidLocation}>
                        <span style={styles.locationDot}></span>
                        {masjid.city}, {masjid.state}
                      </div>
                      <div style={styles.badge}>
                        {masjid.banks.length} {masjid.banks.length === 1 ? 'Bank Account' : 'Bank Accounts'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.detailsCard}>
              {selectedMasjid ? (
                <>
                  <div style={styles.detailsHeader}>
                    <h2 style={styles.detailsTitle}>
                      <i className="fas fa-info-circle"></i>
                      {masjidData?.name} Details
                    </h2>
                  </div>
                  <div style={styles.detailsBody}>
                    <div style={styles.addressSection}>
                      <h3 style={styles.sectionTitle}>
                        <i className="fas fa-map-marker-alt" style={styles.sectionIcon}></i>
                        Address Information
                      </h3>
                      <div style={styles.addressText}>
                        <p>{masjidData?.address}</p>
                        <p>{masjidData?.city}, {masjidData?.state}</p>
                      </div>
                    </div>

                    <div style={styles.bankSection}>
                      <h3 style={styles.sectionTitle}>
                        <i className="fas fa-landmark" style={styles.sectionIcon}></i>
                        Banking Information
                      </h3>
                      {masjidData?.banks.map((bank) => (
                        <div key={bank.id} style={styles.bankCard}>
                          <div style={styles.bankHeader}>
                            <div style={styles.bankName}>
                              <i className="fas fa-university" style={styles.bankIcon}></i>
                              {bank.name}
                            </div>
                            <div style={styles.accountNumber}>Account: {bank.accountNumber}</div>
                          </div>
                          
                          {bank.latestDeposit ? (
                            <div style={styles.depositCard}>
                              <div style={styles.depositHeader}>
                                <div style={styles.depositAmount}>
                                  <i className="fas fa-money-bill-wave" style={styles.depositIcon}></i>
                                  Latest Deposit: ${bank.latestDeposit.amount.toFixed(2)}
                                </div>
                                <div style={styles.depositDate}>
                                  <i className="far fa-calendar-alt"></i> {new Date(bank.latestDeposit.depositDate).toLocaleDateString()}
                                </div>
                              </div>
                              {bank.latestDeposit.description && (
                                <div style={styles.depositDescription}>
                                  <i className="fas fa-quote-left" style={{marginRight: '0.5rem', opacity: 0.5}}></i>
                                  {bank.latestDeposit.description}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={styles.noDeposit}>
                              <i className="fas fa-exclamation-circle"></i>
                              No deposits recorded yet
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyStateIcon}>
                    <i className="fas fa-hand-point-left"></i>
                  </div>
                  <div style={styles.emptyStateText}>
                    Select a masjid from the directory to view detailed information
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Use our custom Prisma utility to fetch masjids with banks and their latest deposits
    const masjids = await findManyMasjidsWithBanksWithLatestDeposit<{
      id: true;
      name: true;
      city: true;
      state: true;
      address: true;
      
    }>({
      select: {
        id: true,
        name: true, // Fixed: This should be true to match the type and HomeProps
        address: true, // Uncommented to match HomeProps
        city: true, // Uncommented to match HomeProps
        state: true,
        // banks: {
        //   select: {
        //     id: true,
        //     name: true,
        //     accountNumber: true,
        //   },
        // },
      },
      orderBy: {
        name: 'asc',
      },
    });
console.log("masjids => ", masjids)
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