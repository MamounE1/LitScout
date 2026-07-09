// Open Library uses MARC 3-letter language codes; the app's filter UI uses 2-letter codes.
const LANGUAGE_CODE_MAP = {
  en: 'eng',
  es: 'spa',
  fr: 'fre',
  de: 'ger',
  it: 'ita',
  pt: 'por',
  ja: 'jpn',
  zh: 'chi',
};

export function toOpenLibraryLanguage(code) {
  return LANGUAGE_CODE_MAP[code] || code;
}

export const SEARCH_FIELDS = 'key,title,author_name,cover_i,first_publish_year,number_of_pages_median,publisher,subject,language';

export function normalizeBook(doc, coverSize = 'M') {
  return {
    id: doc.key.replace('/works/', ''),
    volumeInfo: {
      title: doc.title,
      authors: doc.author_name,
      imageLinks: doc.cover_i
        ? { thumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-${coverSize}.jpg` }
        : undefined,
      categories: doc.subject ? [doc.subject[0]] : undefined,
      pageCount: doc.number_of_pages_median,
      publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
      publisher: doc.publisher ? doc.publisher[0] : undefined,
      language: doc.language ? doc.language[0] : undefined,
    },
  };
}
