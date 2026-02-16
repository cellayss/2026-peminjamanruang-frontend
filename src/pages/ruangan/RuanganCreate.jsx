import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ruanganService } from '../../services/ruanganService';

const RuanganCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: ''
  });
  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) {
      newErrors.name = 'Nama ruangan wajib diisi';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Kapasitas wajib diisi';
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Kapasitas harus berupa angka positif';
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

      const payload = {
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity)
      };

      await ruanganService.create(payload);
      alert('Ruangan berhasil ditambahkan');
      navigate('/ruangan');
    } catch (err) {
      alert('Gagal menambahkan ruangan: ' + (err.response?.data || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/ruangan" className="back-button">← Kembali</Link>
      
      <div className="page-header">
        <h2>Tambah Ruangan Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>
            Nama Ruangan <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: D3 Theater"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label>
            Kapasitas (orang) <span className="required">*</span>
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Contoh: 120"
            min="1"
          />
          {errors.capacity && <div className="form-error">{errors.capacity}</div>}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/ruangan')} 
            className="btn btn-secondary"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Ruangan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RuanganCreate;
