#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "🎀 Setting up Get Well Soon Care Package..."

if [ ! -d .git ]; then
  git init
  git branch -M main
fi

git add .
if git diff --cached --quiet; then
  echo "✅ Already committed — nothing new to add."
else
  git commit -m "Add interactive get well soon care package website"
  echo "✅ Committed!"
fi

if command -v gh &>/dev/null; then
  if ! git remote get-url origin &>/dev/null; then
    echo "Creating GitHub repo and pushing..."
    gh repo create get-well-care-package --public --source=. --remote=origin --push
  else
    echo "Pushing to origin..."
    git push -u origin main
  fi
  echo ""
  echo "🚀 Done! Import this repo on Vercel: https://vercel.com/new"
  gh repo view --web 2>/dev/null || true
else
  echo ""
  echo "⚠️  GitHub CLI (gh) not found. Run these steps manually:"
  echo ""
  echo "  1. Create a new repo at https://github.com/new named 'get-well-care-package'"
  echo "  2. Then run:"
  echo ""
  echo "     git remote add origin https://github.com/YOUR_USERNAME/get-well-care-package.git"
  echo "     git push -u origin main"
  echo ""
  echo "  3. Import on Vercel: https://vercel.com/new"
fi
