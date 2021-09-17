import { Box } from '@chakra-ui/layout';
import React from 'react';
import { Layout } from '../components/Layout';

export function NotFoundPage() {
  return (
    <Layout title={'Page not found'} applications={[]}>
      <Box>
        <p>This page was not found.</p>
        <a href="/">Go back home</a>
      </Box>
    </Layout>
  );
}
