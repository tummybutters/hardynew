import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import ServicesPage from './pages/ServicesPage';

import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="*" element={<ServicesPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
