import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { formatDate } from '../utils/formatDate';
import Navbar from '../Navbar';

function SectionRenderer({ section }) {
  if (section.type === 'paragraph') {
    return <p style={{ marginBottom: '16px', color: '#1f2937', lineHeight: 1.7 }}>{section.content}</p>;
  }
  if (section.type === 'heading') {
    const Tag = `h${section.level}`;
    return (
      <Tag style={{ margin: '22px 0 12px', fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>
        {section.content}
      </Tag>
    );
  }
  if (section.type === 'list') {
    return (
      <ul style={{ margin: '0 0 18px 18px', paddingLeft: '14px', color: '#1f2937', lineHeight: 1.6 }}>
        {section.items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
        ))}
      </ul>
    );
  }
  if (section.type === 'image') {
    return (
      <div style={{ margin: '26px 0' }}>
        <img
          src={section.src}
          alt={section.alt || ''}
          style={{ width: '100%', height: 'auto', borderRadius: '14px', border: '2px solid #0f172a' }}
        />
        {section.caption && (
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '8px' }}>{section.caption}</p>
        )}
      </div>
    );
  }
  if (section.type === 'quote') {
    return (
      <blockquote style={{
        margin: '20px 0',
        padding: '14px 16px',
        borderLeft: '4px solid #EE432C',
        background: '#fff7f3',
        color: '#0f172a',
        fontStyle: 'italic',
        borderRadius: '10px'
      }}>
        {section.content}
        {section.author && (
          <footer style={{ textAlign: 'right', marginTop: '8px', fontWeight: 600 }}>— {section.author}</footer>
        )}
      </blockquote>
    );
  }
  return null;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = useMemo(() => blogPosts.find((p) => p.slug === slug), [slug]);
  const knownRoutes = useMemo(() => new Set(['/', '/blog', '/about', '/contact', '/booking']), []);
  const serviceTarget = post?.serviceLink && knownRoutes.has(post.serviceLink) ? post.serviceLink : '/booking';

  if (!post) {
    return (
      <div style={{ background: '#F3F4E6', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px', textAlign: 'center', color: '#0f172a' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '14px' }}>Blog Post Not Found</h1>
          <p style={{ marginBottom: '20px', color: '#1f2937' }}>
            We couldn&apos;t find the blog post you&apos;re looking for.
          </p>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            style={{
              background: '#FFB375',
              color: '#0f172a',
              border: '2px solid #0f172a',
              borderRadius: '12px',
              padding: '12px 16px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #0f172a'
            }}
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F3F4E6', minHeight: '100vh' }}>
      <Navbar />
      <article style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          {post.coverImage && (
            <div style={{
              border: '2px solid #0f172a',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '6px 6px 0 #0f172a',
              marginBottom: '22px'
            }}>
              <img src={post.coverImage} alt={post.title} style={{ width: '100%', display: 'block' }} />
            </div>
          )}

          <header style={{ marginBottom: '18px' }}>
            <h1 style={{ fontSize: '36px', fontFamily: '"Playfair Display", serif', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', color: '#4b5563', fontSize: '14px' }}>
              <div>📅 {formatDate(post.date)}</div>
              {post.readTime && <div>⏱️ {post.readTime} min read</div>}
              {post.categories && post.categories.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {post.categories.map((cat) => (
                    <span key={cat} style={{
                      background: '#FFD7B5',
                      color: '#0f172a',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid #0f172a',
                      fontWeight: 600
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div style={{
            marginBottom: '40px'
          }}>
            {Array.isArray(post.content) ? (
              post.content.map((section, idx) => <SectionRenderer key={idx} section={section} />)
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          {post.faqSchema && post.faqSchema.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              <h2 style={{ fontSize: '26px', fontFamily: '"Playfair Display", serif', marginBottom: '14px' }}>Frequently Asked Questions</h2>
              <div style={{ display: 'grid', gap: '14px' }}>
                {post.faqSchema.map((faq, idx) => (
                  <div key={idx} style={{
                    background: '#fff',
                    border: '2px solid #0f172a',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '4px 4px 0 #0f172a'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>{faq.question}</h3>
                    <p style={{ color: '#1f2937', lineHeight: 1.5 }}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.serviceLink && (
            <div style={{
              marginTop: '28px',
              background: '#FFB375',
              padding: '22px',
              borderRadius: '14px',
              border: '2px solid #0f172a',
              boxShadow: '6px 6px 0 #0f172a'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
                Ready to Experience Professional Detailing?
              </h2>
              <p style={{ marginBottom: '14px', color: '#111827' }}>
                Turn the knowledge from this article into action. Book your premium detailing service today.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link
                  to="/booking"
                  style={{
                    background: '#EE432C',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    border: '2px solid #0f172a',
                    boxShadow: '4px 4px 0 #0f172a'
                  }}
                >
                  Book a Detail
                </Link>
                <Link
                  to={serviceTarget}
                  style={{
                    background: '#fff',
                    color: '#0f172a',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    border: '2px solid #0f172a',
                    boxShadow: '4px 4px 0 #0f172a'
                  }}
                >
                  Learn About This Service
                </Link>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link
              to="/blog"
              style={{
                textDecoration: 'none',
                color: '#0f172a',
                fontWeight: 700,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '2px solid #0f172a',
                boxShadow: '3px 3px 0 #0f172a',
                display: 'inline-block'
              }}
            >
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
