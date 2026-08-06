# SkinClair — Thème Shopify minimaliste premium

Thème Shopify **Online Store 2.0** construit sur mesure pour SkinClair, marque de beauté (Waterproof Tubing Mascara, Freckle Pen, Concealer). Design minimaliste et haut de gamme : fond blanc, texte noir, gris très clair en seule couleur secondaire. Zéro dépendance externe (Liquid + CSS + JS vanilla), mobile-first, rapide, optimisé SEO.

**Principe directeur : aucune information fausse.** Pas de faux avis, pas de compteurs, pas de badges inventés, pas d'urgence artificielle, pas de pop-up de réduction. Chaque élément du thème sert la crédibilité de la marque ou la conversion — rien d'autre.

---

## Installation

1. **Créer le ZIP du thème** (à la racine du dépôt) :
   ```bash
   zip -r skinclair-theme.zip layout templates sections snippets assets config locales
   ```
2. Dans l'admin Shopify : **Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier ZIP**.
3. Ou avec la CLI Shopify :
   ```bash
   shopify theme push --store votre-boutique.myshopify.com
   ```

### Configuration après installation

| Étape | Où | Quoi |
|---|---|---|
| 1 | Navigation | Menu `main-menu` : **Shop**, **Contact**. Menu `footer` : Contact, FAQ, et vos pages d'information |
| 2 | Pages | Créer : `Contact` (template **page.contact**), `FAQ` (template **page.faq**), `About` (template **page.a-propos**) |
| 3 | Paramètres → Politiques | Renseigner confidentialité, CGV, remboursement, livraison — elles s'affichent automatiquement dans le bas du footer |
| 4 | Éditeur de thème | Ajouter votre image hero et vérifier la section « Featured products » (3 produits) |
| 5 | Réglages du thème → Réseaux sociaux | Renseigner vos liens (facultatif) |
| 6 | Pages produits | Remplir le bloc « Key details » avec des caractéristiques **réelles** (ex. « Waterproof formula ») |

### Métachamps produit recommandés (optionnels)

- `custom.short_description` (texte) — une phrase honnête sous le prix
- `custom.ingredients` (texte enrichi) — liste d'ingrédients, injectée dans l'accordéon « Ingredients »
- `custom.usage` (texte enrichi) — mode d'emploi, accordéon « How to use »
- `custom.subtitle` (texte) — sous-titre sur les cartes produit (sinon le type de produit est affiché)

---

## Design

- **Palette** : blanc `#FFFFFF`, noir `#111111`, gris texte secondaire `#6E6E6E`, gris clair `#F7F7F6`, filets `#E9E9E7`. Aucune autre couleur.
- **Typographie** : Marcellus (titres serif, luxe intemporel) + Inter (corps, lisibilité maximale). Deux familles, trois graisses au total.
- **Espace** : sections de 72 px (mobile) à 128 px (desktop) — le site respire.
- **Animations** : sobres et performantes uniquement — fade-in au scroll (IntersectionObserver), survols fluides sur boutons et cartes, ouverture douce du panier et des menus, micro-interaction « Added ✓ » sur l'ajout au panier, fondu léger entre les pages. `prefers-reduced-motion` respecté partout.

## Pages

- **Accueil** : hero (image, titre, texte, « Shop Now ») → 3 produits → « Why SkinClair » (Quality, Easy to use, Natural result, Elegant design) → mission → footer.
- **Produit** : grande galerie avec zoom, titre, prix, détails avec icônes discrètes, bouton d'achat très visible (+ barre fixe sur mobile), description et accordéons. JSON-LD Product.
- **Panier** : drawer AJAX discret + page panier propre, bouton de paiement bien visible. Aucun pop-up agressif.

## Performance & SEO

CSS unique léger, JS vanilla différé, images responsives (`srcset`, lazy loading, `fetchpriority=high` sur le hero), données structurées JSON-LD (Organization, WebSite + SearchAction, Product + Offers, FAQPage, Article), balises OG/Twitter, canonical.

## Structure

```
layout/theme.liquid          Squelette HTML, tokens couleurs, config JS
config/settings_schema.json  Réglages : couleurs, largeur, quick add, réseaux sociaux
sections/                    Sections modulaires (toutes éditables dans l'éditeur)
snippets/                    Carte produit, prix, icônes SVG, meta-tags
templates/                   JSON OS 2.0 + comptes clients + carte cadeau + password
assets/base.css              Feuille de style unique, organisée en 10 chapitres
assets/global.js             Panier AJAX, variantes, zoom, recherche prédictive, animations
locales/en.default.json      Anglais par défaut
```
