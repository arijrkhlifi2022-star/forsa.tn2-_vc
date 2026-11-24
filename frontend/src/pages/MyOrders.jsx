import { useState, useEffect } from 'react';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders/');
        setOrders(res.data.results || res.data);
      } catch (err) {
        console.error('Erreur chargement commandes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement de vos commandes...</p>;

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mes commandes</h1>

      {orders.length === 0 ? (
        <p style={{ color: '#64748b' }}>Vous n'avez passé aucune commande pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <div style={styles.header}>
                <strong>Commande #{order.id}</strong>
                <span style={styles.price}>{order.total_price} DT</span>
              </div>
              <p><strong>Client :</strong> {order.buyer_name} ({order.phone})</p>
              <p><strong>Livraison :</strong> {order.address}, {order.city}</p>
              <p>
                <strong>Paiement :</strong>{' '}
                {order.payment_method === 'delivery' ? 'Paiement à la livraison' : 'Carte bancaire'}
              </p>
              <p style={styles.date}>
                Date : {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.2rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '1.1rem' },
  price: { color: '#0284c7', fontWeight: 'bold' },
  date: { fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' },
};

export default MyOrders;