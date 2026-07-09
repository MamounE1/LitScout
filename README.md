# LitScout

## Summary

LitScout is an interactive book search application built with React. Users can search for and browse books from the Open Library API, view detailed information for each book, and enjoy a seamless, responsive UI. The app features infinite scroll for continuous browsing and a dynamic search bar for filtering results efficiently.

Check out the live app [LitScout Live Demo](https://litscout.netlify.app/)!

---

## Features

- **Search Books:** Users can search for books by title, author, or keyword, with results fetched dynamically from the Open Library API.
- **Filters:** Narrow results by category and language, or sort by relevance/newest.
- **Infinite Scroll:** Automatically loads more books as users scroll, providing a smooth browsing experience without manual pagination.
- **Book Cards:** Displays detailed book information (title, author(s), thumbnail, and description) in reusable, responsive components.
- **Favorites:** Save books to a favorites list, stored locally in your browser.
- **Accounts:** Sign up and sign in with a name, email, and password. Sessions persist across page reloads.

---

## Project Structure

This is a monorepo with the frontend and backend separated into their own folders:

```
LitScout/
├── frontend/   # React + Vite app (deployed to Netlify)
└── backend/    # FastAPI + SQLAlchemy API, backed by Supabase Postgres
```

### Running locally

**Backend** (from `backend/`):
```bash
python -m venv .venv
.venv/Scripts/activate        # Windows;  source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env          # then fill in your Supabase pooler URL + JWT secret
uvicorn main:app --reload --port 8000
```

**Frontend** (from `frontend/`):
```bash
npm install
# create frontend/.env with: VITE_API_URL=http://localhost:8000
npm run dev
```

---

## Technologies

- **Frontend:** React, Vite, React Router, JavaScript, HTML5 / CSS3, Netlify
- **Backend:** Python, FastAPI, SQLAlchemy, JWT auth (bcrypt-hashed passwords)
- **Database:** Supabase (Postgres)

---

## Future Improvements

- **Favorites Sync:** Persist favorites to the backend so they sync across devices (currently local-only).
- **User Profiles:** Let users customize a profile.
- **Custom Lists:** Allow users to create multiple lists beyond a single favorites collection.
- **Social Login:** Add Google / OAuth sign-in.
- **Responsive Design Enhancements:** Improve layout and styling for smaller screens and various devices.
