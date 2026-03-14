import { NavLink, Link } from "react-router-dom";
function Navbar() {
    return (
        <div>
            <nav className="navbar">
                <Link to="/" className="navbar__brand">
                    <span className="navbar__brand-icon">...</span>
                    <span className="navbar__brand-name">AutoConnect</span>
                </Link>

                <ul className="navbar__nav">
                    <li className="navbar__nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "navbar__nav-link navbar__nav-link--active"
                                    : "navbar__nav-link"
                            }
                        >
                            Home
                        </NavLink>
                    </li>

                    <li className="navbar__nav-item">
                        <NavLink
                            to="/cars"
                            className={({ isActive }) =>
                                isActive
                                    ? "navbar__nav-link navbar__nav-link--active"
                                    : "navbar__nav-link"
                            }
                        >
                            Cars
                        </NavLink>
                    </li>

                    <li className="navbar__nav-item">
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                isActive
                                    ? "navbar__nav-link navbar__nav-link--active"
                                    : "navbar__nav-link"
                            }
                        >
                            Contact
                        </NavLink>
                    </li>
                </ul>

                <div className="navbar__actions">
                    <Link to="/login" className="navbar__btn navbar__btn--ghost">
                        Login
                    </Link>
                    <Link to="/register" className="navbar__btn navbar__btn--primary">
                        Register
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;