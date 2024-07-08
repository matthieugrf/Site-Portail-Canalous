import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BasinSelection from './pages/BasinSelection';
import ItineraryPage from './pages/ItineraryPage';
import StorePage from './pages/StorePage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import ReportIssuePage from './pages/ReportIssuePage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import Nord from './basins/Nord'; // Importer les composants des bassins
import Ouest from './basins/Ouest'; // Importer les composants des bassins
import CentreOuest from './basins/CentreOuest';
import Sud from './basins/Sud';
import Seine from './basins/Seine';
import Est from './basins/Est';
import Centre from './basins/Centre';
import SoaneRhone from './basins/SoaneRhone';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
      <Header />
      <div className="container-fluid">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/price-comparison" element={<PriceComparisonPage />} />
        <Route path="/report-issue" element={<ReportIssuePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/basin-details/Nord" element={<Nord />} />
        <Route path="/basin-details/Ouest" element={<Ouest />} />
        <Route path="/basin-details/CentreOuest" element={<CentreOuest />} />
        <Route path="/basin-details/Sud" element={<Sud />} />
        <Route path="/basin-details/Seine" element={<Seine />} />
        <Route path="/basin-details/Est" element={<Est />} />
        <Route path="/basin-details/Centre" element={<Centre />} />
        <Route path="/basin-details/SoaneRhone" element={<SoaneRhone />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
