import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PublicHomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await api.get('/blogs/published');
        setBlogs(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Blogs load nahi ho pa rahe.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <div className="public-shell">
      <header className="public-site-header">
        <div className="public-navbar">
          <Link className="public-brand" to="/">
            <span className="public-brand-mark">IN</span>
            <div>
              <p className="brand-kicker">Editorial House</p>
              <strong>Insight Nest</strong>
            </div>
          </Link>

          <nav className="public-nav-links">
            <a href="#latest">Latest</a>
            <a href="#highlights">Highlights</a>
            <a href="#footer">Contact</a>
          </nav>

          <div className="public-nav-badge">
            <span className="public-nav-badge-dot" />
            Fresh Weekly Dispatch
          </div>
        </div>
      </header>

      <section className="public-hero">
        <div className="public-hero-copy">
          <p className="brand-kicker">Public Blog</p>
          <h1 className="public-title">Stories, strategy and sharp ideas for modern builders.</h1>
          <p className="public-subtitle">
            Premium insights on technology, creativity and digital growth. Fresh articles from the
            admin panel now live in a cleaner, more magazine-style experience.
          </p>

          <div className="public-hero-actions">
            <a className="public-primary-link" href="#latest">
              Explore Articles
            </a>
            <Link className="public-secondary-link" to="/admin/login">
              Publish From Admin
            </Link>
          </div>

          <div className="public-stat-row">
            <article className="public-stat-chip">
              <strong>{blogs.length}</strong>
              <span>Published reads</span>
            </article>
            <article className="public-stat-chip">
              <strong>Premium</strong>
              <span>Header and footer feel</span>
            </article>
            <article className="public-stat-chip">
              <strong>Fast</strong>
              <span>Clean reading flow</span>
            </article>
          </div>
        </div>

        <div className="public-hero-panel">
          <div className="public-panel-card public-panel-featured">
            <p className="brand-kicker">Featured Direction</p>
            <h2>Editorial polish with a stronger first impression.</h2>
            <p>
              Elegant spacing, richer gradients, glass panels and structured blocks now give the
              homepage a more premium landing-page feel.
            </p>

            <div className="public-feature-strip">
              <div>
                <strong>Luxury UI</strong>
                <span>Refined presentation</span>
              </div>
              <div>
                <strong>Fast Reads</strong>
                <span>Clean article journey</span>
              </div>
            </div>

            <div className="public-feature-note">
              Built to make published blogs feel more like an editorial website than a basic list
              page.
            </div>

            <div className="public-feature-footer">
              <div className="public-feature-metrics">
                <div>
                  <strong>02</strong>
                  <span>Polished highlight cards</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>Readable premium layout</span>
                </div>
              </div>

              <div className="public-feature-points">
                <span>Layered visual rhythm</span>
                <span>Sharper story-first presentation</span>
              </div>
            </div>
          </div>

          <div className="public-panel-grid" id="highlights">
            <article className="public-panel-card">
              <span className="public-panel-number">01</span>
              <h3>Magazine Header</h3>
              <p>Layered top navigation with branding and clearer call-to-actions.</p>
            </article>
            <article className="public-panel-card">
              <span className="public-panel-number">02</span>
              <h3>Luxury Footer</h3>
              <p>Premium footer block with polished messaging and quick-access links.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="public-section" id="latest">
        <div className="section-heading public-section-heading">
          <div>
            <p className="brand-kicker">Published Blogs</p>
            <h2>Read Our Articles</h2>
          </div>
          <p className="public-section-note">
            Curated writing cards with cleaner spacing and stronger visual balance.
          </p>
        </div>

        {loading ? <p className="muted-text">Blogs load ho rahe hain...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        {!loading && !error && !blogs.length ? (
          <p className="muted-text">Abhi tak koi published blog available nahi hai.</p>
        ) : null}

        <div className="public-blog-grid">
          {blogs.map((blog) => (
            <article className="public-blog-card" key={blog.id}>
              {blog.image_data ? (
                <img className="public-blog-image" src={blog.image_data} alt={blog.title} />
              ) : (
                <div className="public-blog-image public-blog-placeholder">No Image</div>
              )}
              <div className="public-blog-body">
                <p className="blog-meta">
                  {new Date(blog.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                {blog.category || blog.tags ? (
                  <div className="public-taxonomy-row">
                    {blog.category ? (
                      <span className="blog-category-pill blog-category-pill-public">{blog.category}</span>
                    ) : null}
                    {blog.tags
                      ? blog.tags.split(',').map((tag) => {
                          const trimmedTag = tag.trim();

                          if (!trimmedTag) {
                            return null;
                          }

                          return (
                            <span className="blog-tag-pill blog-tag-pill-public" key={`${blog.id}-${trimmedTag}`}>
                              #{trimmedTag}
                            </span>
                          );
                        })
                      : null}
                  </div>
                ) : null}
                <h3>{blog.title}</h3>
                <p className="muted-text">
                  {blog.excerpt || 'Blog ka short description available nahi hai.'}
                </p>
                <Link className="read-more-link" to={`/blogs/${blog.slug}`}>
                  Read Full Blog
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="public-footer" id="footer">
        <div className="public-footer-grid">
          <div>
            <p className="brand-kicker">Insight Nest</p>
            <h2 className="public-footer-title">A refined front page for your best blog content.</h2>
            <p className="public-footer-copy">
              Publish from admin, showcase on the public site, and give every article a more
              premium digital presence.
            </p>
          </div>

          <div className="public-footer-links">
            <div>
              <p className="brand-kicker">Navigate</p>
              <a href="#latest">Latest Articles</a>
              <a href="#highlights">Why This Design</a>
              <Link to="/admin/login">Admin Access</Link>
            </div>
            <div>
              <p className="brand-kicker">Experience</p>
              <span>Clean typography</span>
              <span>Premium gradients</span>
              <span>Responsive layout</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;
