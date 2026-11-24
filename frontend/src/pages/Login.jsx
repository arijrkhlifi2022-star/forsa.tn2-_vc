import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Adresse e-mail ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <span style={styles.tag}>● LA SECONDE MAIN, AUTREMENT</span>
          <h2 style={styles.leftTitle}>
            Les belles trouvailles commencent par une rencontre.
          </h2>
          <p style={styles.leftSub}>
            Rejoignez une communauté qui donne une nouvelle chance aux objets, partout en Tunisie.
          </p>
          <div style={styles.graphicCards}>
            <div style={styles.miniCard}>🤍</div>
            <div style={{ ...styles.miniCard, marginLeft: '2rem', marginTop: '-1rem' }}>✔️</div>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <span style={styles.welcomeTag}>BIENVENUE DANS LA COMMUNAUTÉ</span>
          <h1 style={styles.title}>Mon compte</h1>
          <p style={styles.subtitle}>Connectez-vous ou créez votre compte FORSA TN.</p>

          <div style={styles.tabs}>
            <Link to="/login" style={{ ...styles.tab, ...styles.tabActive }}>
              J'ai déjà un compte
            </Link>
            <Link to="/register" style={styles.tab}>
              Créer un compte
            </Link>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Adresse e-mail</label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mot de passe</label>
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card: { width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', backgroundColor: '#ffffff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' },
  leftPanel: { background: 'linear-gradient(160deg, #0f172a 0%, #1d4ed8 100%)', color: '#ffffff', padding: '2.8rem 2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' },
  tag: { fontSize: '0.72rem', letterSpacing: '1px', color: '#93c5fd', fontWeight: '700' },
  leftTitle: { fontSize: '1.9rem', fontWeight: '800', lineHeight: 1.2 },
  leftSub: { fontSize: '0.92rem', color: '#dbeafe', lineHeight: 1.6 },
  graphicCards: { display: 'flex', flexDirection: 'column', marginTop: '1rem' },
  miniCard: { width: '180px', height: '68px', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '12px', display: 'flex', alignItems: 'center', paddingLeft: '1.2rem', fontSize: '1.3rem', boxShadow: '0 8px 20px rgba(0,0,0,0.18)' },
  rightPanel: { padding: '2.8rem 2.4rem' },
  welcomeTag: { fontSize: '0.72rem', letterSpacing: '1px', color: '#2563eb', fontWeight: '700' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0.3rem 0' },
  subtitle: { fontSize: '0.9rem', color: '#64748b', marginBottom: '1.4rem' },
  tabs: { display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#f1f5f9', padding: '0.3rem', borderRadius: '10px', marginBottom: '1.5rem' },
  tab: { textAlign: 'center', padding: '0.6rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', color: '#64748b' },
  tabActive: { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#334155' },
  input: { padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' },
  submitBtn: { marginTop: '0.5rem', padding: '0.85rem 1.2rem', backgroundColor: '#1d4ed8', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  error: { color: '#dc2626', fontSize: '0.88rem', marginBottom: '1rem' },
};

export default Login;