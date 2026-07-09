import "./BookCard.css"
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"
import { useAuth } from "../../context/AuthContext";

export default function BookCard({book, isFavorite, toggleFavorite}){
    const { user } = useAuth();
    const navigate = useNavigate();

    function handleHeartClick() {
        if (!user) {
            navigate('/login');
            return;
        }
        toggleFavorite(book);
    }

    return (
        <div className="bookContainer">
            <Heart
                className="heartIcon"
                onClick={handleHeartClick}
                style={{ fill: isFavorite ? "red" : "none" }}
            />
            <div className="imageWrapper">
                <Link to={`/book/${book.id}`}>
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                        <img className="imgStyle" src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title}></img>
                    ) : (
                        <div className="imgPlaceholder">No Cover Available</div>
                    )}
                </Link>
            </div>
            <div className="infoWrapper">
                <Link to={`/book/${book.id}`}>
                    <p>{book.volumeInfo.title}</p>
                </Link>
                <div>
                    {book.volumeInfo.authors?.map((author, index) => (
                        <span key={index}>
                            {author}{index + 1 < book.volumeInfo.authors.length ? ", " : ""}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}