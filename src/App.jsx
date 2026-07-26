import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
            <Header />
            <main style={{ flex:1, paddingBottom:'72px' }} id="main-content">
              <Routes>
                <Route path="/"            element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart"        element={<Cart />} />
                <Route path="/wishlist"    element={<Wishlist />} />
                <Route path="/checkout"    element={<Checkout />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/signup"      element={<Signup />} />
                <Route path="/profile"     element={<Profile />} />
                <Route path="/orders"      element={<Orders />} />
                <Route path="/admin"       element={<AdminPanel />} />
                <Route path="/about"       element={<About />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
