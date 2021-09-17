import { Box } from '@chakra-ui/layout';
import React from 'react';
import { Layout } from '../components/Layout';

export function IndexPage() {
  return (
    <Layout title={'Welcome'} applications={[]}>
      <Box>
        <p>Get started by adding your first application.</p>
      </Box>
    </Layout>
  );
}
