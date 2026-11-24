import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { value: '', label: 'Toutes', icon: '✨' },
  { value: 'telephones', label: 'Téléphones', icon: '📱' },
  { value: 'informatique', label: 'Informatique', icon: '💻' },
  { value: 'vetements', label: 'Vêtements', icon: '👕' },
  { value: 'maison', label: 'Maison', icon: '🏠' },
  { value: 'electromenager', label: 'Électroménager', icon: '🔌' },
  { value: 'autres', label: 'Autres', icon: '📦' },
];

const Home = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await api.get('/listings/', { params });
      setListings(res.data.results || res.data);
    } catch (err) {
      console.error('Erreur chargement annonces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category]);

  useEffect(() => {
    if (user) {
      api.get('/listings/favorites/').then((res) => {
        const list = res.data.results || res.data;
        setFavIds(list.map((item) => item.id));
      }).catch(() => {});
    } else {
      setFavIds([]);
    }
  }, [user]);

  const toggleFavorite = async (id) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter aux favoris.');
      return;
    }
    try {
      const res = await api.post(`/listings/${id}/favorite/`);
      if (res.data.is_favorite) {
        setFavIds([...favIds, id]);
      } else {
        setFavIds(favIds.filter((favId) => favId !== id));
      }
    } catch (err) {
      console.error('Erreur favori:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <div style={styles.heroLeft}>
            <span style={styles.heroTag}>● LA SECONDE MAIN, AUTREMENT</span>
            <h1 style={styles.heroTitle}>
              Chaque objet mérite <br />
              <span style={styles.heroHighlight}>une nouvelle chance !</span>
            </h1>
            <p style={styles.heroSub}>
              Achetez, vendez, échangez ou donnez vos produits d'occasion facilement partout en Tunisie.
            </p>
            <div style={styles.heroActions}>
              <a href="#annonces" style={styles.primaryBtn}>
                Découvrir les annonces →
              </a>
              <Link to="/create-listing" style={styles.secondaryBtn}>
                Publier une annonce
              </Link>
            </div>
            <div style={styles.communityRow}>
              <div style={styles.avatars}>
                <span style={{ ...styles.avatar, backgroundColor: '#1d4ed8' }}>A</span>
                <span style={{ ...styles.avatar, backgroundColor: '#0284c7', marginLeft: '-8px' }}>M</span>
                <span style={{ ...styles.avatar, backgroundColor: '#0f172a', marginLeft: '-8px' }}>S</span>
              </div>
              <div style={styles.communityText}>
                <strong>Une communauté qui grandit</strong>
                <span>Des objets utiles, de nouvelles histoires.</span>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.illustrationBox}>
              <div style={styles.floatingBadgeTop}>✨ Un geste malin</div>
              <div style={styles.mainGraphic}>🛍️</div>
              <p style={styles.graphicCaption}>Donnez une seconde vie à vos objets</p>
              <div style={styles.floatingBadgeBottom}>📍 Près de chez vous</div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Explorer par catégorie</h2>
          <p style={styles.sectionSub}>Trouvez rapidement ce que vous cherchez</p>
        </div>

        <div style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className="forsa-card"
              style={{
                ...styles.catCard,
                ...(category === cat.value ? styles.catCardActive : {}),
              }}
            >
              <span style={styles.catIcon}>{cat.icon}</span>
              <span style={styles.catLabel}>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="annonces" style={styles.section}>
        <div style={styles.annoncesHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Annonces récentes</h2>
            <p style={styles.sectionSub}>Les dernières trouvailles publiées en Tunisie</p>
          </div>

          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Rechercher un produit, une ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>Rechercher</button>
          </form>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Chargement des annonces...</p>
        ) : listings.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            Aucune annonce trouvée pour le moment.
          </p>
        ) : (
          <div style={styles.grid}>
            {listings.map((item) => (
              <div key={item.id} className="forsa-card" style={styles.card}>
                <div style={styles.imgWrap}>
                  <img src={item.image} alt={item.name} style={styles.image} />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    style={styles.favBtn}
                    title="Ajouter aux favoris"
                  >
                    {favIds.includes(item.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div style={styles.cardBody}>
                  <span style={styles.badge}>{item.condition}</span>
                  <h3 style={styles.cardTitle}>{item.name}</h3>
                  <p style={styles.price}>{item.price} DT</p>
                  <p style={styles.city}>📍 {item.city}</p>
                  <Link to={`/listings/${item.id}`} style={styles.detailsBtn}>
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  hero: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '3.5rem 1.5rem' },
  heroContainer: { maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' },
  heroLeft: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  heroTag: { fontSize: '0.78rem', fontWeight: '700', color: '#2563eb', letterSpacing: '1px' },
  heroTitle: { fontSize: '2.6rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.15 },
  heroHighlight: { color: '#2563eb' },
  heroSub: { fontSize: '1.05rem', color: '#64748b', maxWidth: '480px', lineHeight: 1.6 },
  heroActions: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' },
  primaryBtn: { padding: '0.85rem 1.6rem', backgroundColor: '#1d4ed8', color: '#ffffff', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem' },
  secondaryBtn: { padding: '0.85rem 1.6rem', backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem' },
  communityRow: { display: 'flex', alignItems: 'center', gap: '0.9rem', marginTop: '0.8rem' },
  avatars: { display: 'flex', alignItems: 'center' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', color: '#fff', fontSize: '0.8rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' },
  communityText: { display: 'flex', flexDirection: 'column', fontSize: '0.82rem', color: '#64748b' },
  heroRight: { display: 'flex', justifyContent: 'center' },
  illustrationBox: { position: 'relative', width: '100%', maxWidth: '400px', height: '320px', borderRadius: '24px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' },
  mainGraphic: { fontSize: '5rem', marginBottom: '0.8rem' },
  graphicCaption: { color: '#1e3a8a', fontWeight: '600', fontSize: '0.95rem' },
  floatingBadgeTop: { position: 'absolute', top: '20px', right: '20px', backgroundColor: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', color: '#1e3a8a', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' },
  floatingBadgeBottom: { position: 'absolute', bottom: '20px', left: '20px', backgroundColor: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', color: '#0f172a', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' },
  section: { maxWidth: '1180px', margin: '3rem auto', padding: '0 1.5rem' },
  sectionHeader: { marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' },
  sectionSub: { color: '#64748b', fontSize: '0.92rem', marginTop: '0.2rem' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '1rem' },
  catCard: { padding: '1.1rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#334155' },
  catCardActive: { backgroundColor: '#eff6ff', borderColor: '#2563eb', color: '#1d4ed8' },
  catIcon: { fontSize: '1.6rem' },
  catLabel: { fontSize: '0.88rem', fontWeight: '600' },
  annoncesHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' },
  searchForm: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  searchInput: { padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', minWidth: '240px', fontSize: '0.92rem', backgroundColor: '#fff' },
  searchBtn: { padding: '0.7rem 1.3rem', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' },
  imgWrap: { position: 'relative', height: '195px', backgroundColor: '#f1f5f9' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  favBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
  cardBody: { padding: '1.1rem' },
  badge: { fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: '600' },
  cardTitle: { margin: '0.55rem 0 0.3rem', fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' },
  price: { fontSize: '1.15rem', fontWeight: '800', color: '#1d4ed8', marginBottom: '0.3rem' },
  city: { fontSize: '0.84rem', color: '#64748b', marginBottom: '0.9rem' },
  detailsBtn: { display: 'block', textAlign: 'center', padding: '0.6rem', backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' },
};

export default Home;