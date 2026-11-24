import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'autres',
    condition: 'Bon état',
    price: '',
    city: '',
    details: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append('image', image);
    }

    try {
      await api.post('/listings/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      setError(err.response ? JSON.stringify(err.response.data) : 'Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Déposer une annonce</h1>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Titre de l'annonce" value={formData.name} onChange={handleChange} required style={styles.input} />

        <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
          <option value="telephones">Téléphones et accessoires</option>
          <option value="informatique">Informatique</option>
          <option value="vetements">Vêtements</option>
          <option value="maison">Maison et décoration</option>
          <option value="electromenager">Électroménager</option>
          <option value="autres">Autres</option>
        </select>

        <select name="condition" value={formData.condition} onChange={handleChange} style={styles.input}>
          <option value="Neuf">Neuf</option>
          <option value="Comme neuf">Comme neuf</option>
          <option value="Bon état">Bon état</option>
          <option value="Acceptable">Acceptable</option>
        </select>

        <input name="price" type="number" step="0.001" placeholder="Prix (DT)" value={formData.price} onChange={handleChange} required style={styles.input} />
        <input name="city" placeholder="Ville (ex: Bizerte, Tunis...)" value={formData.city} onChange={handleChange} required style={styles.input} />
        <input name="details" placeholder="Détails supplémentaires (optionnel)" value={formData.details} onChange={handleChange} style={styles.input} />
        <textarea name="description" placeholder="Description..." rows="4" value={formData.description} onChange={handleChange} required style={styles.input} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required style={styles.input} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Publication...' : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' },
  button: { padding: '0.9rem', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: '#ef4444', marginBottom: '1rem', wordBreak: 'break-word' },
};

export default CreateListing;