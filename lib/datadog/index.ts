import { datadogRum } from '@datadog/browser-rum';

/**
 * Initialize Datadog RUM (Real User Monitoring)
 * This should be called on the client-side only
 */
export const initDatadogRUM = () => {
  if (typeof window === 'undefined') {
    return; // Skip initialization on server-side
  }

  const DD_CLIENT_TOKEN = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
  const DD_APPLICATION_ID = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
  const DD_SITE = process.env.NEXT_PUBLIC_DD_SITE || 'datadoghq.com';
  const DD_SERVICE = process.env.NEXT_PUBLIC_DD_SERVICE || 'nextjs-prisma-demo';
  const DD_ENV = process.env.NEXT_PUBLIC_DD_ENV || 'development';

  if (!DD_CLIENT_TOKEN || !DD_APPLICATION_ID) {
    console.warn('Datadog RUM not initialized: Missing client token or application ID');
    return;
  }

  datadogRum.init({
    applicationId: DD_APPLICATION_ID,
    clientToken: DD_CLIENT_TOKEN,
    site: DD_SITE,
    service: DD_SERVICE,
    env: DD_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  datadogRum.startSessionReplayRecording();
}; 