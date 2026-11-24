import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div style={{ marginTop: '4rem' }}>
      <section style={styles.ctaBanner}>
        <div style={styles.ctaContainer}>
          <div>
            <p style={styles.ctaTag}>VOS AFFAIRES MÉRITENT MIEUX</p>
            <h2 style={styles.ctaTitle}>Un objet à partager ?<br />Il trouvera preneur.</h2>
            <p style={styles.ctaSub}>Publiez votre annonce et faites circuler les bonnes choses.</p>
          </div>
          <Link to="/create-listing" style={styles.ctaBtn}>
            Publier une annonce
          </Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.col}>
            <h3 style={styles.footerLogo}>FORSA TN</h3>
            <p style={styles.footerText}>
              Achetez, vendez, échangez ou donnez vos produits d'occasion facilement partout en Tunisie.
            </p>
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Navigation</h4>
            <Link to="/" style={styles.footerLink}>Accueil</Link>
            <a href="/#categories" style={styles.footerLink}>Catégories</a>
            <a href="/#annonces" style={styles.footerLink}>Annonces</a>
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Comment ça marche</h4>
            <Link to="/create-listing" style={styles.footerLink}>Déposer une annonce</Link>
            <Link to="/login" style={styles.footerLink}>Créer un compte</Link>
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Restons en contact</h4>
            <p style={styles.footerText}>📍 Tunisie</p>
            <p style={styles.footerText}>📧 contact@forsatn.tn</p>
          </div>
        </div>
        <div style={styles.bottom}>
          © {new Date().getFullYear()} FORSA TN — Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

const styles = {
  ctaBanner: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    color: '#fff',
    padding: '3rem 1.5rem',
  },
  ctaContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  ctaTag: { fontSize: '0.75rem', letterSpacing: '1px', color: '#bfdbfe', marginBottom: '0.5rem', fontWeight: '600' },
  ctaTitle: { fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', lineHeight: 1.2 },
  ctaSub: { color: '#dbeafe', fontSize: '0.95rem' },
  ctaBtn: {
    padding: '0.85rem 1.8rem',
    backgroundColor: '#ffffff',
    color: '#1e3a8a',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  footer: { backgroundColor: '#1d4ed8', color: '#e0e7ff', paddingTop: '2.5rem' },
  footerContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  col: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  footerLogo: { color: '#ffffff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.3rem' },
  colTitle: { color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.3rem' },
  footerLink: { color: '#dbeafe', fontSize: '0.88rem' },
  footerText: { color: '#dbeafe', fontSize: '0.88rem', lineHeight: 1.5 },
  bottom: {
    textAlign: 'center',
    padding: '1.2rem',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    fontSize: '0.82rem',
    color: '#bfdbfe',
  },
};

export default Footer;