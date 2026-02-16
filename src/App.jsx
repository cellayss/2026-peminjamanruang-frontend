
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';

// Temporary placeholder components (akan diganti dengan real components nanti)
const PeminjamanList = () => <div className="page-header"><h2>Daftar Peminjaman</h2></div>;
const PeminjamanDetail = () => <div className="page-header"><h2>Detail Peminjaman</h2></div>;
const PeminjamanCreate = () => <div className="page-header"><h2>Tambah Peminjaman</h2></div>;
const PeminjamanEdit = () => <div className="page-header"><h2>Edit Peminjaman</h2></div>;
const RuanganList = () => <div className="page-header"><h2>Daftar Ruangan</h2></div>;
const RuanganCreate = () => <div className="page-header"><h2>Tambah Ruangan</h2></div>;
const RuanganEdit = () => <div className="page-header"><h2>Edit Ruangan</h2></div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Redirect root to peminjaman */}
          <Route path="/" element={<Navigate to="/peminjaman" replace />} />
          
          {/* Peminjaman Routes */}
          <Route path="/peminjaman" element={<PeminjamanList />} />
          <Route path="/peminjaman/:id" element={<PeminjamanDetail />} />
          <Route path="/peminjaman/create" element={<PeminjamanCreate />} />
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
