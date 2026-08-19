import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import CampaignsPage from './components/campaigns/CampaignsPage';
import CampaignDetailPage from './components/campaigns/CampaignDetailPage';
import CreatorsPage from './components/creators/CreatorsPage';
import CreatorProfilePage from './components/creators/CreatorProfilePage';
import ReportsPage from './components/reports/ReportsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 p-12 pl-16 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/campaigns" replace />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
                <Route path="/creators" element={<CreatorsPage />} />
                <Route path="/creators/:id" element={<CreatorProfilePage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports/:id" element={<ReportsPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
