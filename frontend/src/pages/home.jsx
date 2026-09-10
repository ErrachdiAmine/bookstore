import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, ShoppingBag, Sparkles, BookOpen, Eye, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import BookCard from '../components/BookCard';
import { DEFAULT_BOOKS } from '../data/defaultBooks';

const API_LINK = import.meta.env.VITE_API_URL || '';

function Home() {
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [previewBook, setPreviewBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${API_LINK}/api/books/`);
        const data = Array.isArray(resp.data) ? resp.data : resp.data.results || [];
        if (data && data.length > 0) {
          setBooks(data);
        }
      } catch (err) {
        // Fallback to rich curated archive
        setBooks(DEFAULT_BOOKS);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const genres = ['All', 'Systems & Architecture', 'Cyberpunk & Sci-Fi', 'Philosophy & Stoicism', 'Speculative Fiction'];

  const filtered = books.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      (book.authors || '').toLowerCase().includes(query.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesQuery && matchesGenre;
  });

  const addToCart = (book) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find((item) => item.id === book.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ id: book.id, title: book.title, price: book.price, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      setNotif(`"${book.title}" added to your reading bag`);
      setTimeout(() => setNotif(null), 2500);
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <Container>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow font-mono">Bibliotech Digital Archive</p>
              <h1 className="display">
                Curated Works for<br />
                <em>Inquiring Minds.</em>
              </h1>
              <p className="hero-text">
                A distinguished collection of architectural computing, classical philosophy, and speculative literature. Designed for distraction-free reading and intellectual depth.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate('/books')} className="button button-primary cursor-pointer">
                  Explore Archive <ArrowRight size={17} />
                </button>
                <button onClick={() => navigate('/books/add')} className="button button-secondary cursor-pointer">
                  Submit a Manuscript
                </button>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-glow"></div>
              <div className="hero-book hero-book-one">
                DATA<br />SYSTEMS
              </div>
              <div className="hero-book hero-book-two">
                NEURO<br />MANCER
              </div>
              <div className="hero-book hero-book-three">
                MEDITA<br />TIONS
              </div>
              <span className="hero-note">
                <Sparkles size={16} /> Precision typography & lossless reading
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Catalog & Filter Section */}
      <Container>
        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow font-mono">Curated Library</p>
              <h2 className="display">Distinguished Titles</h2>
            </div>
            <button className="text-link cursor-pointer" onClick={() => navigate('/books')}>
              View Complete Index <ArrowRight size={16} />
            </button>
          </div>

          {/* Genre Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
            <div className="home-search w-full sm:max-w-md">
              <Search size={19} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, author, or discipline..."
                aria-label="Search books"
              />
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    selectedGenre === g
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {notif && <div className="notice notice-success font-mono">{notif}</div>}
          {loading && <p className="state-text">Arranging the library shelves…</p>}

          <div className="book-grid">
            {filtered.slice(0, 8).map((book) => (
              <div key={book.id} className="book-grid-item group">
                <button className="book-link cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                  <BookCard book={book} />
                </button>

                <div className="flex gap-2 mt-2">
                  <button
                    className="quick-add flex-1 cursor-pointer"
                    onClick={() => addToCart(book)}
                  >
                    <ShoppingBag size={14} /> Add to bag (${book.price})
                  </button>

                  {book.chapter_preview && (
                    <button
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-mono cursor-pointer"
                      onClick={() => setPreviewBook(book)}
                      title="Peek Inside Chapter 1"
                    >
                      <Eye size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!loading && !filtered.length && (
            <div className="empty-state">No manuscripts matched your inquiry.</div>
          )}
        </section>
      </Container>

      {/* Chapter Peek Modal */}
      {previewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-xl w-full bg-[#11131a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="text-amber-400" size={20} />
                <div>
                  <h3 className="text-base font-bold text-white font-serif">{previewBook.title}</h3>
                  <p className="text-xs text-neutral-400 font-mono">By {previewBook.authors}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewBook(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-serif text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
              {previewBook.chapter_preview}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-neutral-400">
                {previewBook.pages} Pages • {previewBook.publisher}
              </span>
              <button
                onClick={() => {
                  addToCart(previewBook);
                  setPreviewBook(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono cursor-pointer"
              >
                Add to Bag (${previewBook.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
