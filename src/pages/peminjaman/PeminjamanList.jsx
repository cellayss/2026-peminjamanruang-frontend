import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { peminjamanService, getStatusName, getStatusClass } from '../../services/peminjamanService';

const PeminjamanList = () => {
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const data = await peminjamanService.getAll();
      setPeminjamanList(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data peminjaman');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peminjaman ini?')) {
      try {
        await peminjamanService.delete(id);
        alert('Peminjaman berhasil dihapus');
        fetchPeminjaman(); // Refresh data
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Memuat data...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Daftar Peminjaman</h2>
        <Link to="/peminjaman/create" className="btn btn-primary">
          + Tambah Peminjaman
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {peminjamanList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">Belum ada data peminjaman</div>
          <Link to="/peminjaman/create" className="btn btn-primary">
            Tambah Peminjaman Pertama
          </Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Peminjam</th>
              <th>Ruangan</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {peminjamanList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.borrowerName}</td>
                <td>{item.ruang?.name || '-'}</td>
                <td>{formatDateTime(item.startTime)}</td>
                <td>{formatDateTime(item.endTime)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {getStatusName(item.status)}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => navigate(`/peminjaman/${item.id}`)}
                      className="btn btn-info btn-small"
                      title="Lihat Detail"
                    >
                      👁
                    </button>
                    <button
                      onClick={() => navigate(`/peminjaman/edit/${item.id}`)}
                      className="btn btn-warning btn-small"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger btn-small"
                      title="Hapus"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PeminjamanList;
