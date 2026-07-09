from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api.deps import get_current_user
from db.session import get_db
from models.favorite import Favorite
from models.user import User
from schemas.favorite import FavoriteCreate, FavoriteOut

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=list[FavoriteOut])
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Favorite]:
    return (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )


@router.post("", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
def add_favorite(
    payload: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Favorite:
    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.book_id == payload.book_id)
        .first()
    )
    if existing is not None:
        return existing

    favorite = Favorite(user_id=current_user.id, **payload.model_dump())
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    book_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    db.query(Favorite).filter(
        Favorite.user_id == current_user.id, Favorite.book_id == book_id
    ).delete()
    db.commit()
