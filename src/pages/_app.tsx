import React from 'react';
import AppWalletProvider from '../app/components/AppWalletProvider';
import '../styles/globals.css'

function MyApp({ Component, pageProps }: any) {
  return (
    <AppWalletProvider>
      <Component {...pageProps} />
    </AppWalletProvider>
  );
}

export default MyApp;