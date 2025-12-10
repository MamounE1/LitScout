import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Header.css"
import LitScoutLogo from "../../images/LitScoutLogo.svg";

export default function Header(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    function handleLogoClick() {
        navigate('/');
        window.location.reload();
    }

    function handleLogout() {
        logout();
        setShowDropdown(false);
        navigate('/');
    }

    return (
        <header>
            <img 
                className="title" 
                src={LitScoutLogo} 
                alt="LitScout Logo"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            />
            <div className="authButtons">
                {user ? (
                    <div className="userMenu">
                        <span 
                            className="username" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            Hi, {user.username} ▼
                        </span>
                        {showDropdown && (
                            <div className="dropdown">
                                <Link to="/favorites" onClick={() => setShowDropdown(false)}>
                                    Favorites
                                </Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="loginBtn">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="signupBtn">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}