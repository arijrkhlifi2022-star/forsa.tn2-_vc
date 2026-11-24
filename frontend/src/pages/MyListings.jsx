import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const res = await api.get('/listings/my-listings/');
      setListings(res.data.results || res.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    try {
      await api.delete(`/listings/${id}/`);
      setListings(listings.filter((item) => item.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Mes annonces</h1>
        <Link to="/create-listing" style={styles.addBtn}>+ Nouvelle annonce</Link>
      </div>

      {listings.length === 0 ? (
        <p style={{ color: '#64748b' }}>Vous n'avez publié aucune annonce pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {listings.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image} alt={item.name} style={styles.image} />
              <div style={styles.body}>
                <span style={item.is_sold ? styles.soldBadge : styles.availBadge}>
                  {item.is_sold ? 'Vendu' : 'Disponible'}
                </span>
                <h3 style={styles.title}>{item.name}</h3>
                <p style={styles.price}>{item.price} DT</p>
                <div style={styles.actions}>
                  <Link to={`/listings/${item.id}`} style={styles.viewBtn}>Voir</Link>
                  <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    Supprimer
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  addBtn: { padding: '0.6rem 1.2rem', backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '6px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  body: { padding: '1rem' },
  availBadge: { fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px' },
  soldBadge: { fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px' },
  title: { margin: '0.5rem 0', fontSize: '1.1rem' },
  price: { fontWeight: 'bold', color: '#0284c7', marginBottom: '0.8rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  viewBtn: { flex: 1, textAlign: 'center', padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', textDecoration: 'none', borderRadius: '6px' },
  deleteBtn: { flex: 1, padding: '0.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default MyListings;