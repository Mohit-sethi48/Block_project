import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const blogTags = blog?.tags
    ? blog.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await api.get(`/blogs/published/${slug}`);
        setBlog(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Blog load nahi ho pa raha.');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  return (
    <div className="public-shell">
      <div className="public-article-wrap">
        <Link className="back-link" to="/">
          Back to Home
        </Link>

        {loading ? <p className="muted-text">Blog load ho raha hai...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {blog ? (
          <article className="public-article">
            <p className="brand-kicker">Published Article</p>
            <h1>{blog.title}</h1>
            <p className="blog-meta">
              {new Date(blog.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            {blog.category || blogTags.length ? (
              <div className="public-taxonomy-row">
                {blog.category ? (
                  <span className="blog-category-pill blog-category-pill-public">{blog.category}</span>
                ) : null}
                {blogTags.map((tag) => (
                  <span className="blog-tag-pill blog-tag-pill-public" key={`${blog.id}-${tag}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            {blog.image_data ? (
              <img className="public-article-image" src={blog.image_data} alt={blog.title} />
            ) : null}
            {blog.excerpt ? <p className="public-excerpt">{blog.excerpt}</p> : null}
            <div className="public-content">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={`${blog.id}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
};

export default BlogDetailsPage;
