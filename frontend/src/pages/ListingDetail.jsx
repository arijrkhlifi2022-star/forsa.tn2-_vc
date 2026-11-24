import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    buyer_name: '',
    phone: '',
    address: '',
    city: '',
    payment_method: 'delivery',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}/`);
        setListing(res.data);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (user) {
      setOrderData((prev) => ({
        ...prev,
        buyer_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/orders/', {
        ...orderData,
        payment_method: 'delivery',
        listing: listing.id,
        total_price: listing.price,
      });
      setSuccess('Votre commande a été enregistrée avec succès !');
      setTimeout(() => navigate('/my-orders'), 1500);
    } catch (err) {
      if (!err.response) {
        setError('Impossible de contacter le serveur.');
      } else {
        setError(JSON.stringify(err.response.data));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</p>;
  if (!listing) return <p style={{ textAlign: 'center', padding: '2rem' }}>Annonce introuvable.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* تفاصيل المنتج */}
        <div style={styles.card}>
          <img src={listing.image} alt={listing.name} style={styles.image} />
          <div style={styles.body}>
            <span style={styles.badge}>{listing.condition}</span>
            <h1 style={styles.title}>{listing.name}</h1>
            <p style={styles.price}>{listing.price} DT</p>
            <p style={styles.meta}>📍 {listing.city} | Catégorie : {listing.category}</p>
            {listing.details && <p style={styles.details}><strong>Détails :</strong> {listing.details}</p>}
            <p style={styles.description}>{listing.description}</p>
          </div>
        </div>

        {/* فورم الطلب */}
        <div style={styles.orderBox}>
          <h2>Commander ce produit</h2>
          {listing.is_sold ? (
            <p style={styles.soldBadge}>Ce produit est déjà vendu.</p>
          ) : (
            <>
              {error && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}

              <form onSubmit={handleOrderSubmit} style={styles.form}>
                <input
                  name="buyer_name"
                  placeholder="Nom complet"
                  value={orderData.buyer_name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Téléphone"
                  value={orderData.phone}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <input
                  name="address"
                  placeholder="Adresse de livraison"
                  value={orderData.address}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <input
                  name="city"
                  placeholder="Ville"
                  value={orderData.city}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <div style={styles.deliveryInfo}>
                  💵 Paiement à la livraison uniquement
                </div>

                <button type="submit" disabled={submitting} style={styles.button}>
                  {submitting ? 'Envoi en cours...' : `Confirmer la commande (${listing.price} DT)`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1050px', margin: '2rem auto', padding: '0 1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' },
  card: { border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  image: { width: '100%', maxHeight: '380px', objectFit: 'cover' },
  body: { padding: '1.5rem' },
  badge: { fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: '500' },
  title: { margin: '0.8rem 0 0.4rem', color: '#0f172a' },
  price: { fontSize: '1.5rem', fontWeight: 'bold', color: '#0284c7', margin: '0.5rem 0' },
  meta: { color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' },
  details: { marginBottom: '0.8rem', color: '#334155' },
  description: { lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-line' },
  orderBox: { padding: '1.5rem', border: '1px solid #cbd5e1', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
  deliveryInfo: { padding: '0.75rem', backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', textAlign: 'center' },
  button: { padding: '0.9rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  error: { color: '#ef4444', marginTop: '0.5rem', wordBreak: 'break-word', fontSize: '0.9rem' },
  success: { color: '#16a34a', fontWeight: 'bold', marginTop: '0.5rem' },
  soldBadge: { color: '#dc2626', fontWeight: 'bold', marginTop: '1rem' },
};

export default ListingDetail;