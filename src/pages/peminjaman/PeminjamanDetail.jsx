import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { peminjamanService, PeminjamanStatus, getStatusName, getStatusClass } from '../../services/peminjamanService';

const PeminjamanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [peminjaman, setPeminjaman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPeminjaman();
  }, [id]);

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const data = await peminjamanService.getById(id);
      setPeminjaman(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data peminjaman');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await peminjamanService.updateStatus(id, newStatus);
      alert('Status berhasil diupdate');
      fetchPeminjaman(); // Refresh data
    } catch (err) {
      alert('Gagal mengupdate status');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peminjaman ini?')) {
      try {
        await peminjamanService.delete(id);
        alert('Peminjaman berhasil dihapus');
        navigate('/peminjaman');
      } catch (err) {
        alert('Gagal menghapus peminjaman');
        console.error(err);
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate - startDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} jam ${minutes} menit`;
  };

  if (loading) {
    return <div className="loading">Memuat data...</div>;
  }

  if (error || !peminjaman) {
    return (
      <div>
        <Link to="/peminjaman" className="back-button">← Kembali</Link>
        <div className="error-message">{error || 'Data tidak ditemukan'}</div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/peminjaman" className="back-button">← Kembali</Link>
      
      <div className="page-header">
        <h2>Detail Peminjaman</h2>
      </div>

      <div className="card">
        <h3 className="card-title">Informasi Peminjaman</h3>
        
        <div className="detail-row">
          <div className="detail-label">ID Peminjaman</div>
          <div className="detail-value">#{peminjaman.id}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Nama Peminjam</div>
          <div className="detail-value">{peminjaman.borrowerName}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Ruangan</div>
          <div className="detail-value">
            {peminjaman.ruang?.name || '-'} 
            {peminjaman.ruang?.capacity && ` (Kapasitas: ${peminjaman.ruang.capacity} orang)`}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Waktu Mulai</div>
          <div className="detail-value">{formatDateTime(peminjaman.startTime)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Waktu Selesai</div>
          <div className="detail-value">{formatDateTime(peminjaman.endTime)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Durasi</div>
          <div className="detail-value">{calculateDuration(peminjaman.startTime, peminjaman.endTime)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <span className={`status-badge ${getStatusClass(peminjaman.status)}`}>
              {getStatusName(peminjaman.status)}
            </span>
          </div>
        </div>

        <div className="status-buttons">
          <strong style={{ width: '100%', marginBottom: '0.5rem', display: 'block' }}>
            Update Status:
          </strong>
          <button 
            onClick={() => handleUpdateStatus(PeminjamanStatus.Pending)}
            className={`btn btn-small ${peminjaman.status === PeminjamanStatus.Pending ? 'btn-warning' : 'btn-secondary'}`}
          >
            🟡 Pending
          </button>
          <button 
            onClick={() => handleUpdateStatus(PeminjamanStatus.Approved)}
            className={`btn btn-small ${peminjaman.status === PeminjamanStatus.Approved ? 'btn-success' : 'btn-secondary'}`}
          >
            🟢 Approved
          </button>
          <button 
            onClick={() => handleUpdateStatus(PeminjamanStatus.Rejected)}
            className={`btn btn-small ${peminjaman.status === PeminjamanStatus.Rejected ? 'btn-danger' : 'btn-secondary'}`}
          >
            🔴 Rejected
          </button>
          <button 
            onClick={() => handleUpdateStatus(PeminjamanStatus.Completed)}
            className={`btn btn-small ${peminjaman.status === PeminjamanStatus.Completed ? 'btn-info' : 'btn-secondary'}`}
          >
            🔵 Completed
          </button>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid #ecf0f1' }}>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑 Hapus Peminjaman
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeminjamanDetail;
