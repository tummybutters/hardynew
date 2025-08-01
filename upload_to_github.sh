#!/bin/bash

echo "Hardy's Wash N' Wax - GitHub Upload Script"
echo "========================================="

# Check if we're already in a git repository
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
else
    echo "Git repository already exists."
fi

# Add all files to git
echo "Adding all files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Hardy's Wash N' Wax mobile car detailing website

Features:
- Full-stack React/Express application
- Dual location support (Sacramento & Orange County)
- Mobile car detailing booking system
- Premium UI with Tailwind CSS and Radix UI
- SEO optimized with structured data
- Google Sheets integration
- Mapbox location services
- Email notifications (EmailJS/SendGrid)
- PostgreSQL database with Drizzle ORM"

echo ""
echo "Git repository initialized and files committed!"
echo ""
echo "NEXT STEPS:"
echo "1. Go to GitHub.com and create a new repository"
echo "2. Copy the repository URL (https://github.com/yourusername/your-repo-name.git)"
echo "3. Run these commands with your actual repository URL:"
echo ""
echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Replace 'yourusername' and 'your-repo-name' with your actual GitHub username and repository name."

