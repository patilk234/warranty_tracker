import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataUsage from './pages/DataUsage';
import Dashboard from './pages/Dashboard';
import AddWarranty from './pages/AddWarranty';
import EditWarranty from './pages/EditWarranty';
import { GoogleDriveProvider } from './hooks/GoogleDriveContext';

function App() {
  return (
    <HashRouter>
      <GoogleDriveProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="data-usage" element={<DataUsage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add" element={<AddWarranty />} />
            <Route path="edit/:id" element={<EditWarranty />} />
          </Route>
        </Routes>
      </GoogleDriveProvider>
    </HashRouter>
  );
}

export default App;
