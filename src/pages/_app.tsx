import '@/pages/global.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ReactNode } from 'react';

const customTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps }: AppProps): ReactNode {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
