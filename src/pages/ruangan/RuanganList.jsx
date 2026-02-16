import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ruanganService } from '../../services/ruanganService';

const RuanganList = () => {
  const [ruanganList, setRuanganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRuangan();
  }, []);

  const fetchRuangan = async () => {
    try {
      setLoading(true);
      const data = await ruanganService.getAll();
      setRuanganList(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data ruangan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
      try {
        await ruanganService.delete(id);
        alert('Ruangan berhasil dihapus');
        fetchRuangan(); // Refresh data
      } catch (err) {
        alert('Gagal menghapus ruangan');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Memuat data...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Daftar Ruangan</h2>
        <Link to="/ruangan/create" className="btn btn-primary">
          + Tambah Ruangan
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {ruanganList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏛️</div>
          <div className="empty-state-text">Belum ada data ruangan</div>
          <Link to="/ruangan/create" className="btn btn-primary">
            Tambah Ruangan Pertama
          </Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Ruangan</th>
              <th>Kapasitas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ruanganList.map((ruang) => (
              <tr key={ruang.id}>
                <td>{ruang.id}</td>
                <td>{ruang.name}</td>
                <td>{ruang.capacity} orang</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => navigate(`/ruangan/edit/${ruang.id}`)}
                      className="btn btn-warning btn-small"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(ruang.id)}
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

export default RuanganList;
