import { Box } from '@chakra-ui/layout';
import React from 'react';
import { Layout } from '../components/Layout';

export function ApplicationNotFoundPage() {
  return (
    <Layout title={'Application not found'} applications={[]}>
      <Box>
        <p>This application does not exist.</p>
        <a href="/">Go back home</a>
      </Box>
    </Layout>
  );
}
