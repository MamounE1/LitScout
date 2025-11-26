const API_URL = import.meta.env.VITE_API_URL || 'https://litscout-production.up.railway.app';

export async function getFavorites(token) {
  const res = await fetch(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch favorites');
  return res.json();
}

export async function addFavorite(bookId, token) {
  const res = await fetch(`${API_URL}/favorites/${bookId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

export async function removeFavorite(bookId, token) {
  const res = await fetch(`${API_URL}/favorites/${bookId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
}
