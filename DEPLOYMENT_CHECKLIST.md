# 🚀 Deployment Checklist

## Before Deployment

- [ ] Download **GLB with 1k textures (22MB)** from your model source
- [ ] Replace `/public/bmw_m4_f82.glb` with the new optimized file
- [ ] Test locally with `npm start`
- [ ] Verify loading screen appears and works
- [ ] Test all animations (doors, hood)
- [ ] Test all camera views
- [ ] Test on mobile device (or Chrome DevTools mobile emulation)

## Build for Production

- [ ] Run `npm run build`
- [ ] Check build output for errors
- [ ] Verify build size in terminal output
- [ ] Test the production build locally:
  ```bash
  npx serve -s build
  ```

## Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
1. Drag and drop the `build/` folder to Netlify
2. Or connect your GitHub repo

### Option 3: Other Hosting
1. Upload contents of `build/` folder
2. Ensure server is configured for SPA (single-page app)
3. Enable Gzip/Brotli compression

## After Deployment

- [ ] Test on real mobile devices (iPhone, Android)
- [ ] Check loading speed with Google PageSpeed Insights
- [ ] Verify all features work in production
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Check console for any errors

## Performance Targets

- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.5s
- [ ] Model loads and displays correctly
- [ ] Smooth 30+ FPS on mobile

## Optional Enhancements

- [ ] Add Google Analytics
- [ ] Add meta tags for SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Set up custom domain
- [ ] Enable HTTPS (usually automatic on Vercel/Netlify)

---

**All set? Deploy and enjoy your optimized 3D car detailing website! 🎉**
