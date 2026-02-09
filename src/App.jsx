import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Writing from './components/Writing'
import Footer from './components/Footer'
import Post from './components/Post'

function HomePage() {
  return (
    <>
      <Hero />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/2020/07/24/google-summer-of-code.html" element={<Navigate to="/post/google-summer-of-code" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
