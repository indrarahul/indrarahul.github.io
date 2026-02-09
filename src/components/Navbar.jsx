import { Link, useLocation } from 'react-router-dom'
import { config } from '../data/config'
import './Navbar.css'

const Navbar = () => {
    const location = useLocation()

    return (
        <nav className="navbar">
            <div className="navbar__container container">
                <Link to="/" className="navbar__logo">
                    {config.initials}
                </Link>
                <ul className="navbar__links">
                    <li>
                        <Link to="/writing" className={`navbar__link ${location.pathname.startsWith('/writing') || location.pathname.startsWith('/post/') ? 'active' : ''}`}>
                            Writing
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="navbar__link">
                            About
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
