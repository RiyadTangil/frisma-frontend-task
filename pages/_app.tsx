import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { initDatadogRUM } from '../lib/datadog';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Initialize Datadog RUM on client-side
  useEffect(() => {
    initDatadogRUM();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 