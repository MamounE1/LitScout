import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { normalizeBook, SEARCH_FIELDS } from "../utils/openLibrary";
import Header from "../Components/Header/Header";
import "./BookDetailsPage.css";

export default function BookDetailsPage() {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const searchParams = new URLSearchParams({
            q: `key:/works/${id}`,
            fields: SEARCH_FIELDS
        });
        Promise.all([
            fetch(`https://openlibrary.org/search.json?${searchParams.toString()}`).then(res => res.json()),
            fetch(`https://openlibrary.org/works/${id}.json`).then(res => res.json())
        ])
            .then(([searchData, workData]) => {
                const doc = searchData.docs?.[0];
                if (!doc) {
                    setBook(null);
                    setLoading(false);
                    return;
                }
                const normalized = normalizeBook(doc, 'L');
                normalized.volumeInfo.description =
                    typeof workData.description === 'string'
                        ? workData.description
                        : workData.description?.value || '';
                setBook(normalized);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching book:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="loadingContainer">
            <Header />
            <p className="loadingText">Loading book details...</p>
        </div>
    );
    if (!book) return (
        <div className="loadingContainer">
            <Header />
            <p className="loadingText">Book not found.</p>
        </div>
    );

    const favorited = isFavorite(book?.id);

    // Strip HTML tags from description
    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const cleanDescription = stripHtml(book.volumeInfo.description);

    return (
        <>
            <Header />
            <div className="bookDetailsContainer">
                <div className="bookDetailsHero">
                    <div className="bookCoverSection">
                        {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                                className="bookCover"
                                src={book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}
                                alt={book.volumeInfo.title}
                            />
                        )}
                    </div>
                    
                    <div className="bookInfoSection">
                        <div className="bookHeader">
                            <div>
                                <h1 className="bookTitle">{book.volumeInfo.title}</h1>
                                {book.volumeInfo.authors && (
                                    <p className="bookAuthors">by {book.volumeInfo.authors.join(", ")}</p>
                                )}
                            </div>
                            <button
                                className="favoriteButton"
                                onClick={() => toggleFavorite(book)}
                                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart
                                    size={28}
                                    className="heartIcon"
                                    style={{
                                        fill: favorited ? "#ef4444" : "none",
                                        stroke: favorited ? "#ef4444" : "currentColor"
                                    }}
                                />
                            </button>
                        </div>

                        <div className="bookMeta">
                            {book.volumeInfo.categories && (
                                <span className="metaBadge">{book.volumeInfo.categories[0]}</span>
                            )}
                            {book.volumeInfo.pageCount && (
                                <span className="metaItem">{book.volumeInfo.pageCount} pages</span>
                            )}
                            {book.volumeInfo.publishedDate && (
                                <span className="metaItem">{new Date(book.volumeInfo.publishedDate).getFullYear()}</span>
                            )}
                        </div>

                        {cleanDescription && (
                            <div className="descriptionSection">
                                <h2 className="sectionTitle">About this book</h2>
                                <p className="bookDescription">{cleanDescription}</p>
                            </div>
                        )}

                        <div className="detailsGrid">
                            {book.volumeInfo.publisher && (
                                <div className="detailItem">
                                    <span className="detailLabel">Publisher</span>
                                    <span className="detailValue">{book.volumeInfo.publisher}</span>
                                </div>
                            )}
                            {book.volumeInfo.publishedDate && (
                                <div className="detailItem">
                                    <span className="detailLabel">Published</span>
                                    <span className="detailValue">{book.volumeInfo.publishedDate}</span>
                                </div>
                            )}
                            {book.volumeInfo.pageCount && (
                                <div className="detailItem">
                                    <span className="detailLabel">Pages</span>
                                    <span className="detailValue">{book.volumeInfo.pageCount}</span>
                                </div>
                            )}
                            {book.volumeInfo.language && (
                                <div className="detailItem">
                                    <span className="detailLabel">Language</span>
                                    <span className="detailValue">{book.volumeInfo.language.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
