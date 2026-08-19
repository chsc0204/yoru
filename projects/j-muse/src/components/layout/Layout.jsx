import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from './MobileNav'
import MusicPlayer from '../music/MusicPlayer'
import ToastContainer from '../common/ToastContainer'
import { usePlayerStore } from '../../store/usePlayerStore'

export default function Layout() {
  const hasPlayer = usePlayerStore((s) => Boolean(s.currentSong))

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className={`flex-1 pb-16 md:pb-6 ${hasPlayer ? 'mb-16 md:mb-20' : ''}`}>
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <MusicPlayer />
      <ToastContainer />
    </div>
  )
}
