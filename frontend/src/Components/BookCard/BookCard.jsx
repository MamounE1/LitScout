import "./BookCard.css"
import { Link } from "react-router-dom";
import { Heart } from "lucide-react"

export default function BookCard({book, isFavorite, toggleFavorite}){
    return (
        <div className="bookContainer">
            <Heart
                className="heartIcon"
                onClick={() => toggleFavorite(book)}
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