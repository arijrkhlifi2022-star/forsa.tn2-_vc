import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/listings/favorites/');
        setFavorites(res.data.results || res.data);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await api.post(`/listings/${id}/favorite/`);
      setFavorites(favorites.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mes favoris ❤️</h1>

      {favorites.length === 0 ? (
        <p style={{ color: '#64748b' }}>Vous n'avez aucun favori pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {favorites.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image} alt={item.name} style={styles.image} />
              <div style={styles.body}>
                <h3 style={styles.title}>{item.name}</h3>
                <p style={styles.price}>{item.price} DT</p>
                <p style={styles.city}>📍 {item.city}</p>
                <div style={styles.actions}>
                  <Link to={`/listings/${item.id}`} style={styles.viewBtn}>Voir détails</Link>
                  <button onClick={() => removeFavorite(item.id)} style={styles.removeBtn}>
                    ❌ Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1050px', margin: '2rem auto', padding: '0 1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  body: { padding: '1rem' },
  title: { margin: '0.3rem 0', fontSize: '1.1rem' },
  price: { fontWeight: 'bold', color: '#0284c7', margin: '0.3rem 0' },
  city: { fontSize: '0.85rem', color: '#64748b', marginBottom: '0.8rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  viewBtn: { flex: 1, textAlign: 'center', padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', textDecoration: 'none', borderRadius: '6px' },
  removeBtn: { padding: '0.5rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' },
};

export default Favorites;