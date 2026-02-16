import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Import Peminjaman Pages
import PeminjamanList from './pages/peminjaman/PeminjamanList';
import PeminjamanDetail from './pages/peminjaman/PeminjamanDetail';
import PeminjamanCreate from './pages/peminjaman/PeminjamanCreate';
import PeminjamanEdit from './pages/peminjaman/PeminjamanEdit';

// Import Ruangan Pages
import RuanganList from './pages/ruangan/RuanganList';
import RuanganCreate from './pages/ruangan/RuanganCreate';
import RuanganEdit from './pages/ruangan/RuanganEdit';

import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Redirect root to peminjaman */}
          <Route path="/" element={<Navigate to="/peminjaman" replace />} />
          
          {/* Peminjaman Routes */}
          <Route path="/peminjaman" element={<PeminjamanList />} />
          <Route path="/peminjaman/create" element={<PeminjamanCreate />} />
          <Route path="/peminjaman/:id" element={<PeminjamanDetail />} />
          <Route path="/peminjaman/edit/:id" element={<PeminjamanEdit />} />
          
          {/* Ruangan Routes */}
          <Route path="/ruangan" element={<RuanganList />} />
          <Route path="/ruangan/create" element={<RuanganCreate />} />
          <Route path="/ruangan/edit/:id" element={<RuanganEdit />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
