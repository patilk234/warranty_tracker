import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataUsage from './pages/DataUsage';
import Dashboard from './pages/Dashboard';
import AddWarranty from './pages/AddWarranty';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="data-usage" element={<DataUsage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add" element={<AddWarranty />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
