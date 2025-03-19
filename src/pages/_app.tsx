import React from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from '@/contexts/AuthContext';

// Import toast CSS
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Indie+Flower&family=VT323&family=Bubblegum+Sans&family=Roboto:wght@300;400;500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Comic Neue', cursive;
    background-color: #F7FFF7;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </AuthProvider>
  );
}

export default MyApp;