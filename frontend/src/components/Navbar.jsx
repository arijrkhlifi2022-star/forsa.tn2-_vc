import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/orders/sales/')
        .then((res) => {
          const list = res.data.results || res.data;
          setSalesCount(list.length);
        })
        .catch(() => setSalesCount(0));
    } else {
      setSalesCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoWrap}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>FORSA TN</span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Accueil</Link>
          <a href="/#categories" style={styles.link}>Catégories</a>
          <a href="/#annonces" style={styles.link}>Annonces</a>

          {user ? (
            <>
              <Link to="/create-listing" style={styles.link}>Publier</Link>
              <Link to="/my-listings" style={styles.notifLink}>
                Mes annonces
                {salesCount > 0 && (
                  <span style={styles.badge}>🔔 {salesCount}</span>
                )}
              </Link>
              <Link to="/favorites" style={styles.link}>Favoris</Link>
              <Link to="/my-orders" style={styles.link}>Commandes</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.accountBtn}>
              Mon compte
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '0.9rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.95rem',
  },
  logoText: { fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', letterSpacing: '0.5px' },
  links: { display: 'flex', alignItems: 'center', gap: '1.4rem', flexWrap: 'wrap' },
  link: { color: '#334155', fontSize: '0.92rem', fontWeight: '500' },
  notifLink: {
    color: '#334155',
    fontSize: '0.92rem',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  badge: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
  },
  accountBtn: {
    padding: '0.55rem 1.25rem',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: '999px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  logoutBtn: {
    padding: '0.5rem 1.1rem',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    borderRadius: '999px',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Navbar;