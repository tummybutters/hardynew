import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { formatDate } from '../utils/formatDate';
import Navbar from '../Navbar';

export default function BlogIndexPage() {
  return (
    <div style={{ background: '#F3F4E6', minHeight: '100vh', color: '#0f172a' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(180deg, #FFB375 0%, #FFD7B5 100%)',
        padding: '80px 0 90px',
        borderBottom: '2px solid #0f172a'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '48px', fontWeight: 800, marginBottom: '20px', color: '#1f1f1f' }}>
            Car Detailing Tips & Guides
          </h1>
          <p style={{ fontSize: '20px', lineHeight: 1.5, maxWidth: '820px', margin: '0 auto', color: '#1f2937' }}>
            Expert advice and insights to keep your vehicle looking its best, from Sacramento&apos;s trusted mobile detailing professionals.
          </p>
        </div>
      </section>

      <section style={{ padding: '70px 0' }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}>
          {blogPosts.map((post) => (
            <article key={post.slug} style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '6px 6px 0 #0f172a',
              border: '2px solid #0f172a'
            }}>
              {post.coverImage && (
                <div style={{ height: '160px', overflow: 'hidden', borderBottom: '2px solid #0f172a' }}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              <div style={{ padding: '16px' }}>
                <time dateTime={post.date} style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                  {formatDate(post.date)}
                </time>
                <h2 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.25 }}>
                  <Link to={`/blog/${post.slug}`} style={{ color: '#111827', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h2>
                <p style={{ color: '#374151', lineHeight: 1.4, marginBottom: '12px', fontSize: '14px' }}>
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#FFD7B5',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: '2px solid #0f172a',
                    boxShadow: '3px 3px 0 #0f172a'
                  }}
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{
        background: '#FFB375',
        padding: '60px 0',
        borderTop: '2px solid #0f172a',
        borderBottom: '2px solid #0f172a'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '16px', color: '#111' }}>
            Ready for Professional Car Detailing?
          </h2>
          <p style={{ fontSize: '18px', color: '#1f2937', marginBottom: '24px', lineHeight: 1.5 }}>
            Book your appointment today and experience premium mobile detailing service delivered right to your location.
          </p>
          <Link
            to="/booking"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 24px',
              borderRadius: '14px',
              background: '#EE432C',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 800,
              border: '2px solid #0f172a',
              boxShadow: '5px 5px 0 #0f172a'
            }}
          >
            Book Your Detail
          </Link>
        </div>
      </section>
    </div>
  );
}
