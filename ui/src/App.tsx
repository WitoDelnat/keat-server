import { Spinner } from '@chakra-ui/spinner';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { trpc } from './utils/trpc';

function App() {
  const { isLoading } = trpc.useQuery(['applications']);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="*" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
