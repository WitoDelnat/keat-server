import { Spinner } from '@chakra-ui/spinner';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { ApplicationPage } from './pages/Application';
import { trpc } from './utils/trpc';
import { NotFoundPage } from './pages/NotFound';

function App() {
  const { isLoading } = trpc.useQuery(['applications']);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path=":id" element={<ApplicationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
