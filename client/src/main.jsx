import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/mocaemtui-global.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MocaemtuiHome from './pages/MocaemtuiHome'
import Movies from './pages/Movies'
import DetailMovies from './pages/DetailMovies'
import WatchMovie from './pages/WatchMovie'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPage from './pages/AdminPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="mocaemtui" element={<MocaemtuiHome />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/:id" element={<DetailMovies />} />
          <Route path="watch/:slug" element={<WatchMovie />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin/*" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
