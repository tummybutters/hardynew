import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { googleReviews } from './data/reviews';

const bgColors = ['#FFB375', '#FFD7B5', '#F3F4E6'];
const GOOGLE_URL = "https://www.google.com/maps/place/Hardy's+Wash+N'+Wax/@36.021654,-119.6405944,7z/data=!4m16!1m9!3m8!1s0xb7923c2630ca509:0x5009d49d618f9525!2sHardy's+Wash+N'+Wax!8m2!3d36.021654!4d-119.6405944!9m1!1b1!16s%2Fg%2F11lw10v4qc!3m5!1s0xb7923c2630ca509:0x5009d49d618f9525!8m2!3d36.021654!4d-119.6405944!16s%2Fg%2F11lw10v4qc?entry=ttu";

function ReviewCard({ review, index }) {
  const bg = bgColors[index % bgColors.length];
  return (
    <div
      className="review-card"
      style={{
        minWidth: '320px',
        width: '320px',
        height: '280px',
        margin: '0 8px',
        background: bg,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill="#05060f" color="#05060f" />
          ))}
        </div>
        <div style={{ color: '#05060f', fontSize: '13px', fontWeight: 600 }}>{review.time}</div>
      </div>
      <h4 style={{ color: '#05060f', fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{review.author}</h4>
      <p style={{ color: '#05060f', lineHeight: 1.5, flexGrow: 1, marginBottom: '10px', overflow: 'hidden' }}>
        “{review.content}”
      </p>
      <div style={{ color: '#05060f', fontSize: '13px', fontWeight: 600 }}>Posted on Google</div>
    </div>
  );
}

function AutoScrollRow({ items, speed = 30, reverse = false }) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const effectiveSpeed = reverse ? -Math.abs(speed) : Math.abs(speed);

  useEffect(() => {
    let rafId;
    let lastTs = performance.now();

    const step = (ts) => {
      const el = containerRef.current;
      if (!el) return;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const loopWidth = el.scrollWidth / 2;
      if (!isDragging.current && loopWidth > 0) {
        el.scrollLeft += effectiveSpeed * dt;
        if (el.scrollLeft >= loopWidth) el.scrollLeft -= loopWidth;
        if (el.scrollLeft <= 0) el.scrollLeft += loopWidth;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [effectiveSpeed]);

  const onPointerDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const el = containerRef.current;
    if (!el) return;
    const delta = e.clientX - dragStartX.current;
    el.scrollLeft = dragStartScroll.current - delta;
  };

  const onPointerUp = (e) => {
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = false;
    el.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        overflow: 'hidden',
        cursor: 'grab'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        {items.map((review, idx) => (
          <ReviewCard key={`${review.id}-${idx}`} review={review} index={idx} />
        ))}
      </div>
    </div>
  );
}

const ReviewsSection = () => {
  const { rowOne, rowTwo } = useMemo(() => {
    const midpoint = Math.ceil(googleReviews.length / 2);
    return {
      rowOne: googleReviews.slice(0, midpoint),
      rowTwo: googleReviews.slice(midpoint)
    };
  }, []);

  return (
    <section id="reviews" style={{ background: 'linear-gradient(135deg, #F3F4E6, #FFD7B5)', padding: '80px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            What Our Customers Are Saying
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0f172a' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} fill="#EE432C" color="#EE432C" />
              ))}
            </div>
            <span style={{ fontWeight: 800 }}>5.0</span>
            <span style={{ color: '#374151' }}>on Google Reviews</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <AutoScrollRow items={[...rowOne, ...rowOne]} speed={42} reverse={false} />
          <AutoScrollRow items={[...rowTwo, ...rowTwo]} speed={42} reverse />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <a className="google-review-btn" href={GOOGLE_URL} target="_blank" rel="noreferrer">
            See All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
