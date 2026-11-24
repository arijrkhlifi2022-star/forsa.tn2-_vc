import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import MyOrders from './pages/MyOrders';
import MyListings from './pages/MyListings';
import Favorites from './pages/Favorites';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;