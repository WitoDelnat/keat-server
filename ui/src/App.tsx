import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ApplicationPage } from './pages/Application';
import { ApplicationNotFoundPage } from './pages/ApplicationNotFound';
import { IndexPage } from './pages/Index';

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/404" element={<ApplicationNotFoundPage />} />
      <Route path=":application" element={<ApplicationPage />} />
    </Routes>
  );
}

export default App;
