import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Community from './pages/Community'
import PostDetail from './pages/PostDetail'
import WritePost from './pages/WritePost'
import EditPost from './pages/EditPost'
import MusicDiscovery from './pages/MusicDiscovery'
import ArtistDetail from './pages/ArtistDetail'
import SongDetail from './pages/SongDetail'
import AlbumDetail from './pages/AlbumDetail'
import Search from './pages/Search'
import Library from './pages/Library'
import PlaylistDetail from './pages/PlaylistDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/post/:id/edit" element={<EditPost />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/music" element={<MusicDiscovery />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="/song/:id" element={<SongDetail />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
