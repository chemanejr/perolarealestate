import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <ScrollToTop />
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/imoveis" element={<Properties />} />
                <Route path="/imoveis/:id" element={<PropertyDetail />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
