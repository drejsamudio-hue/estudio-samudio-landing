# Workflow de GitHub Pages — Instrucción manual (permiso requerido)

El workflow actual debe deployar únicamente desde `main`. Las ramas `arena/*` son ramas de trabajo y no deben publicar al environment protegido `github-pages`.

**Para activar la generación garantizada de `sitemap.xml` / `robots.txt` / `feed.xml`:**

1. En GitHub, andá a `https://github.com/drejsamudio-hue/estudio-samudio-landing` > `Actions` > si te pide habilitar Pages, hacelo.
2. Creá manualmente el archivo `.github/workflows/pages.yml` con este contenido:

```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. También creá `Gemfile` en la raíz (ya está pusheado en la rama):
```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-feed"
gem "jekyll-sitemap"
gem "jekyll-seo-tag"
```

4. En `Settings` > `Pages` > `Build and deployment` > `Source: GitHub Actions`.

Estado actualizado: el workflow ya está limitado a `main`; no vuelvas a agregar `arena/*` salvo que también cambies la protección del environment `github-pages`.
