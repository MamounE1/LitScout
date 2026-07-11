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
- **Favorites:** Save books to a favorites list that's persisted in the database and tied to your account, so it syncs across devices and browser sessions. Signing in loads your saved favorites automatically.
- **Accounts:** Sign up and sign in with a name, email, and password. Sessions persist across page reloads.

---

## Project Structure

This is a monorepo with the frontend and backend separated into their own folders:

```
LitScout/
├── frontend/   # React + Vite app (deployed to Netlify)
└── backend/    # FastAPI + SQLAlchemy API, backed by Supabase Postgres
```

## Technologies

- **Frontend:** React, Vite, React Router, JavaScript, HTML5 / CSS3, Netlify
- **Backend:** Python, FastAPI, SQLAlchemy, JWT auth (bcrypt-hashed passwords)
- **Database:** Supabase (Postgres)

---

## Future Improvements

- **User Profiles:** Let users customize a profile.
- **Custom Lists:** Allow users to create multiple lists beyond a single favorites collection.
- **Social Login:** Add Google / OAuth sign-in.
- **Responsive Design Enhancements:** Improve layout and styling for smaller screens and various devices.
