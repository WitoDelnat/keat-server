import { Center } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { trpc } from './utils/trpc';

function App() {
  const { isLoading } = trpc.useQuery(['applications']);

  if (isLoading) {
    return (
      <Center width="100%" height="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Routes>
      <Route path="*" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
