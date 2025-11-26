import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css"
import LitScoutLogo from "../../images/LitScout.png";

export default function Header(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogoClick() {
        navigate('/');
        window.location.reload();
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
                    <>
                        <span className="username">Hi, {user.username}</span>
                        <button onClick={logout} className="logoutBtn">Logout</button>
                    </>
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