import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { TeamPage } from './pages/TeamPage'
import { AnupamSharmaPage } from './pages/AnupamSharmaPage'

function App() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Subtle noise texture overlay */}
      <div className="noise" />

      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/anupam-sharma" element={<AnupamSharmaPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
