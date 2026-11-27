import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // حالة نافذة التعديل
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    city: '',
    category: 'autres',
    condition: 'Bon état',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // جلب إعلانات البائع
      let myItems = [];
      try {
        const res = await api.get('/listings/my_listings/');
        myItems = res.data.results || res.data;
      } catch {
        const res = await api.get('/listings/');
        const all = res.data.results || res.data;
        myItems = all.filter(
          (item) => item.seller === user?.id || item.seller?.id === user?.id || item.user === user?.id
        );
      }
      setListings(myItems);

      // جلب إشعارات المبيعات (الطلبات الواردة على منتجات البائع)
      try {
        const salesRes = await api.get('/orders/sales/');
        setSales(salesRes.data.results || salesRes.data);
      } catch {
        try {
          const ordersRes = await api.get('/orders/');
          const allOrders = ordersRes.data.results || ordersRes.data;
          const myListingIds = myItems.map((l) => l.id);
          const incoming = allOrders.filter(
            (ord) => myListingIds.includes(ord.listing) || myListingIds.includes(ord.listing?.id)
          );
          setSales(incoming);
        } catch {
          setSales([]);
        }
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // فتح نافذة التعديل
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      price: item.price || '',
      city: item.city || '',
      category: item.category || 'autres',
      condition: item.condition || 'Bon état',
      description: item.description || '',
    });
  };

  // حفظ التعديل
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch(`/listings/${editingItem.id}/`, editForm);
      setListings(listings.map((item) => (item.id === editingItem.id ? { ...item, ...res.data } : item)));
      setEditingItem(null);
      setMessage('✅ Annonce modifiée avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Erreur lors de la modification.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // تفسيخ إعلان
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    try {
      await api.delete(`/listings/${id}/`);
      setListings(listings.filter((item) => item.id !== id));
      setMessage('🗑️ Annonce supprimée avec succès.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Erreur lors de la suppression.');
      console.error(err);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Chargement de votre espace vendeur...</p>;
  }

  return (
    <div style={styles.container}>
      {/* العنوان وزر النشر */}
      <div style={styles.header}>
        <div>
          <span style={styles.tag}>● ESPACE VENDEUR</span>
          <h1 style={styles.title}>Mes annonces & Ventes</h1>
          <p style={styles.subtitle}>Gérez vos produits publiés et suivez vos ventes en temps réel.</p>
        </div>
        <Link to="/create-listing" style={styles.addBtn}>+ Publier une annonce</Link>
      </div>

      {message && <div style={styles.toast}>{message}</div>}

      {/* قسم إشعارات المبيعات */}
      <section style={styles.notifSection}>
        <h2 style={styles.notifTitle}>
          🔔 Notifications de ventes ({sales.length})
        </h2>
        {sales.length === 0 ? (
          <p style={styles.emptyNotif}>Aucune vente pour le moment. Vous serez notifié ici dès qu'un acheteur commande l'un de vos produits.</p>
        ) : (
          <div style={styles.notifList}>
            {sales.map((sale) => (
              <div key={sale.id} style={styles.notifCard}>
                <div>
                  <span style={styles.soldBadge}>🎉 Produit commandé</span>
                  <p style={styles.notifText}>
                    Votre produit <strong>{sale.listing_name || sale.listing?.name || `Annonce #${sale.listing}`}</strong> a été commandé !
                  </p>
                  {sale.phone && <p style={styles.notifMeta}>📞 Client : {sale.phone} {sale.address ? `— 📍 ${sale.address}` : ''}</p>}
                </div>
                <span style={styles.notifPrice}>
                  {sale.total_price || sale.listing?.price || ''} DT
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* قائمة إعلانات البائع */}
      <h2 style={styles.sectionTitle}>Mes produits publiés ({listings.length})</h2>
      {listings.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>Vous n'avez encore publié aucune annonce.</p>
          <Link to="/create-listing" style={styles.addBtn}>Publier ma première annonce</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {listings.map((item) => (
            <div key={item.id} className="forsa-card" style={styles.card}>
              <img src={item.image} alt={item.name} style={styles.image} />
              <div style={styles.cardBody}>
                <span style={styles.badge}>{item.condition}</span>
                <h3 style={styles.cardTitle}>{item.name}</h3>
                <p style={styles.price}>{item.price} DT</p>
                <p style={styles.city}>📍 {item.city}</p>

                <div style={styles.actions}>
                  <button onClick={() => openEditModal(item)} style={styles.editBtn}>
                    ✏️ Modifier
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة التعديل (Modal) */}
      {editingItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '1.3rem', color: '#0f172a' }}>Modifier l'annonce</h2>
              <button onClick={() => setEditingItem(null)} style={styles.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={styles.form}>
              <label style={styles.label}>Titre</label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                style={styles.input}
              />

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Prix (DT)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Ville</label>
                  <input
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Catégorie</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    style={styles.input}
                  >
                    <option value="telephones">Téléphones</option>
                    <option value="informatique">Informatique</option>
                    <option value="vetements">Vêtements</option>
                    <option value="maison">Maison</option>
                    <option value="electromenager">Électroménager</option>
                    <option value="autres">Autres</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>État</label>
                  <select
                    value={editForm.condition}
                    onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                    style={styles.input}
                  >
                    <option value="Neuf">Neuf</option>
                    <option value="Comme neuf">Comme neuf</option>
                    <option value="Bon état">Bon état</option>
                    <option value="Acceptable">Acceptable</option>
                  </select>
                </div>
              </div>

              <label style={styles.label}>Description</label>
              <textarea
                rows="3"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                required
                style={styles.input}
              />

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setEditingItem(null)} style={styles.cancelBtn}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} style={styles.saveBtn}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1180px', margin: '2.5rem auto', padding: '0 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
  tag: { fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', letterSpacing: '1px' },
  title: { fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0' },
  subtitle: { color: '#64748b', fontSize: '0.95rem' },
  addBtn: { padding: '0.75rem 1.4rem', backgroundColor: '#1d4ed8', color: '#fff', borderRadius: '10px', fontWeight: '600', fontSize: '0.92rem' },
  toast: { padding: '0.9rem 1.2rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: '600' },
  notifSection: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '1.5rem', marginBottom: '2.5rem' },
  notifTitle: { fontSize: '1.15rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '1rem' },
  emptyNotif: { color: '#475569', fontSize: '0.92rem' },
  notifList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  notifCard: { backgroundColor: '#ffffff', padding: '1rem 1.2rem', borderRadius: '10px', border: '1px solid #dbeafe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  soldBadge: { fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: '700' },
  notifText: { color: '#0f172a', fontSize: '0.95rem', marginTop: '0.4rem' },
  notifMeta: { color: '#64748b', fontSize: '0.84rem', marginTop: '0.2rem' },
  notifPrice: { fontWeight: '800', fontSize: '1.1rem', color: '#1d4ed8' },
  sectionTitle: { fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.2rem' },
  emptyBox: { textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' },
  image: { width: '100%', height: '185px', objectFit: 'cover', backgroundColor: '#f1f5f9' },
  cardBody: { padding: '1.1rem' },
  badge: { fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: '600' },
  cardTitle: { margin: '0.5rem 0 0.3rem', fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' },
  price: { fontSize: '1.15rem', fontWeight: '800', color: '#1d4ed8', marginBottom: '0.25rem' },
  city: { fontSize: '0.84rem', color: '#64748b', marginBottom: '1rem' },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' },
  editBtn: { padding: '0.55rem', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem' },
  deleteBtn: { padding: '0.55rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '1.8rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.84rem', fontWeight: '600', color: '#334155' },
  input: { padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', width: '100%' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.8rem' },
  cancelBtn: { padding: '0.65rem 1.2rem', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  saveBtn: { padding: '0.65rem 1.4rem', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
};

export default MyListings;