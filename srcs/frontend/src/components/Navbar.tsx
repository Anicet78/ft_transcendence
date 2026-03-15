import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import SearchBar from '../search/SearchBar'
import orcLogo from '../assets/orc.png'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation()
    logout()
    navigate('/')
  }

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleOutside)
    return () => document.removeEventListener('click', handleOutside)
  }, [])

  return (
    <nav className="dnd-navbar" role="navigation" aria-label="main navigation">
      {/* Brand */}
      <div className="dnd-navbar__brand">
        {/* <NavLink to={user ? '/home' : '/'} className="dnd-navbar__logo">
          <svg className="dnd-navbar__icon" viewBox="0 0 640 512" aria-hidden="true">
            <path fill="currentColor" d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4-43.3-32.5c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0L464 0c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8 0 26.5-21.5 48-48 48l-21.5 0c-17 0-33.3-6.7-45.3-18.7l-13.3-13.3-32 0 0 21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1 0 60.6-49.1 109.8-109.8 109.8L32.3 512c-3.3 0-6.6-.4-9.6-1.4-9.2-2.8-16.7-9.6-20.4-18.6-1.3-3.3-2.2-6.9-2.3-10.7-.2-3.7.3-7.3 1.3-10.7 2.8-9.2 9.6-16.7 18.6-20.4 3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1 0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1l0-102.5z"/>
          
          </svg>
          <span>
            <span style={{ color: 'var(--stone-100)' }}>Dungeon</span>
            <span style={{ color: 'var(--color-primary)' }}>NoDragon</span>
          </span>
        </NavLink> */}
        <NavLink to={user ? '/home' : '/'} className="dnd-navbar__logo">
          <img
            src={orcLogo}
            alt="goblin logo"
            style={{ width: '1.4rem', height: '1.4rem', imageRendering: 'pixelated' }}
          />
          <span>
            <span style={{ color: 'var(--stone-100)' }}>Dungeon</span>
            <span style={{ color: 'var(--color-primary)' }}>NoDragon</span>
          </span>
        </NavLink>

        {/* Mobile burger */}
        <button
          className={`dnd-navbar__burger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Menu */}
      <div className={`dnd-navbar__menu ${menuOpen ? 'is-open' : ''}`}>
        {/* Search — only when logged in */}
        {user && (
          <div className="dnd-navbar__search">
            <SearchBar />
          </div>
        )}

        <div className="dnd-navbar__end">
          {user && (
            <NavLink to="/profile" className="dnd-navbar__profile">
              <i className="fas fa-user" aria-hidden="true" />
              <span>{user.username}</span>
            </NavLink>
          )}

          {/* Dropdown */}
          <div className="dnd-navbar__dropdown" ref={dropdownRef}>
            <button
              className="dnd-navbar__dropdown-trigger"
              onClick={() => setDropdownOpen(p => !p)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <i className="fas fa-bars" aria-hidden="true" />
              <span>Menu</span>
            </button>

            {dropdownOpen && (
              <div className="dnd-navbar__dropdown-menu">
                <NavLink
                  to="/about"
                  className="dnd-navbar__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  About the game
                </NavLink>
                {user && <hr className="dnd-navbar__dropdown-divider" />}
                {user && (
                  <button
                    className="dnd-navbar__dropdown-item dnd-navbar__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar