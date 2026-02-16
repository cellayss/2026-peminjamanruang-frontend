import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { peminjamanService } from '../../services/peminjamanService';
import { ruanganService } from '../../services/ruanganService';

const PeminjamanCreate = () => {
  const navigate = useNavigate();
  const [ruanganList, setRuanganList] = useState([]);
  const [loading, setLoading] = useState(false);
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
    fetchRuangan();
  }, []);

  const fetchRuangan = async () => {
    try {
      const data = await ruanganService.getAll();
      setRuanganList(data);
    } catch (err) {
      console.error('Gagal memuat data ruangan:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error saat user mulai mengetik
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

    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal mulai wajib diisi';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Jam mulai wajib diisi';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Tanggal selesai wajib diisi';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Jam selesai wajib diisi';
    }

    // Validasi waktu mulai < waktu selesai
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
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
      setLoading(true);

      // Gabungkan tanggal dan waktu
      const startTime = `${formData.startDate}T${formData.startTime}:00`;
      const endTime = `${formData.endDate}T${formData.endTime}:00`;

      const payload = {
        borrowerName: formData.borrowerName,
        ruangId: parseInt(formData.ruangId),
        startTime: startTime,
        endTime: endTime
      };

      await peminjamanService.create(payload);
      alert('Peminjaman berhasil ditambahkan');
      navigate('/peminjaman');
    } catch (err) {
      alert('Gagal menambahkan peminjaman: ' + (err.response?.data || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/peminjaman" className="back-button">← Kembali</Link>
      
      <div className="page-header">
        <h2>Tambah Peminjaman Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
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
              {errors.startDate && <div className="form-error">{errors.startDate}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
              {errors.startTime && <div className="form-error">{errors.startTime}</div>}
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
              {errors.endDate && <div className="form-error">{errors.endDate}</div>}
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
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Peminjaman'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PeminjamanCreate;
