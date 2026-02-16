import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { peminjamanService } from '../../services/peminjamanService';
import { ruanganService } from '../../services/ruanganService';

const PeminjamanEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ruanganList, setRuanganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    borrowerName: '',
    ruangId: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [peminjamanData, ruanganData] = await Promise.all([
        peminjamanService.getById(id),
        ruanganService.getAll()
      ]);

      setRuanganList(ruanganData);

      // Parse datetime untuk form
      const startDateTime = new Date(peminjamanData.startTime);
      const endDateTime = new Date(peminjamanData.endTime);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setFormData({
        borrowerName: peminjamanData.borrowerName,
        ruangId: peminjamanData.ruangId.toString(),
        startDate: formatDate(startDateTime),
        startTime: formatTime(startDateTime),
        endDate: formatDate(endDateTime),
        endTime: formatTime(endDateTime)
      });
    } catch (err) {
      alert('Gagal memuat data');
      console.error(err);
      navigate('/peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.borrowerName.trim()) {
      newErrors.borrowerName = 'Nama peminjam wajib diisi';
    }

    if (!formData.ruangId) {
      newErrors.ruangId = 'Ruangan wajib dipilih';
    }

    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      newErrors.general = 'Semua field waktu wajib diisi';
    } else {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (startDateTime >= endDateTime) {
        newErrors.endTime = 'Waktu selesai harus lebih besar dari waktu mulai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const startTime = `${formData.startDate}T${formData.startTime}:00`;
      const endTime = `${formData.endDate}T${formData.endTime}:00`;

      const payload = {
        borrowerName: formData.borrowerName,
        ruangId: parseInt(formData.ruangId),
        startTime: startTime,
        endTime: endTime
      };

      // Note: Backend kamu tidak punya endpoint PUT untuk edit peminjaman
      // Jadi kita perlu delete dan create baru, atau tambahkan endpoint edit di backend
      // Untuk sementara, saya asumsikan ada endpoint edit (tapi perlu ditambahkan di backend)
      
      alert('Fitur edit belum tersedia di backend. Silakan hapus dan buat peminjaman baru.');
      navigate('/peminjaman');
      
      // Uncomment ini jika backend sudah punya endpoint edit:
      // await peminjamanService.update(id, payload);
      // alert('Peminjaman berhasil diupdate');
      // navigate('/peminjaman');
      
    } catch (err) {
      alert('Gagal mengupdate peminjaman: ' + (err.response?.data || err.message));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Memuat data...</div>;
  }

  return (
    <div>
      <Link to="/peminjaman" className="back-button">← Kembali</Link>
      
      <div className="page-header">
        <h2>Edit Peminjaman</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {errors.general && <div className="error-message">{errors.general}</div>}

        <div className="form-group">
          <label>
            Nama Peminjam <span className="required">*</span>
          </label>
          <input
            type="text"
            name="borrowerName"
            value={formData.borrowerName}
            onChange={handleChange}
            placeholder="Masukkan nama peminjam"
          />
          {errors.borrowerName && <div className="form-error">{errors.borrowerName}</div>}
        </div>

        <div className="form-group">
          <label>
            Pilih Ruangan <span className="required">*</span>
          </label>
          <select
            name="ruangId"
            value={formData.ruangId}
            onChange={handleChange}
          >
            <option value="">-- Pilih Ruangan --</option>
            {ruanganList.map(ruang => (
              <option key={ruang.id} value={ruang.id}>
                {ruang.name} (Kapasitas: {ruang.capacity} orang)
              </option>
            ))}
          </select>
          {errors.ruangId && <div className="form-error">{errors.ruangId}</div>}
        </div>

        <div className="form-group">
          <label>
            Waktu Mulai <span className="required">*</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            Waktu Selesai <span className="required">*</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && <div className="form-error">{errors.endTime}</div>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/peminjaman')} 
            className="btn btn-secondary"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Menyimpan...' : 'Update Peminjaman'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PeminjamanEdit;
