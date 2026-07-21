# SkinClair — Thème Shopify « Édition rose-doré » (cache-cerne compact)

Thème Shopify **Online Store 2.0** complet, construit sur mesure autour du cache-cerne compact rose-doré SkinClair. Palette prune profonde / rose-doré, typographie Playfair Display + Manrope, animations liées au scroll. Zéro dépendance externe, code 100 % natif (Liquid + CSS + JS vanilla), mobile-first, optimisé conversion et SEO.

## Direction artistique & animations

- **Palette sombre luxueuse** : prune profond `#1c1216`, prune clair `#241820`, rose-doré `#d9b3ab`, rose-doré atténué `#a9807a`, ivoire `#f4ece5`, berry `#7c2e3f` — tout est réglable dans **Réglages du thème → Colors**.
- **Typographie** : Playfair Display (titres serif ; les mots en italique via `<em>` passent automatiquement en rose-doré) + Manrope (corps, 300–500, labels majuscules très espacés).
- **Hero « révélation »** (`sections/hero-reveal.liquid`) : le boîtier part petit, flou et fermé, puis grossit, se précise et s'ouvre (crossfade entre les deux photos détourées) à mesure que la page défile — scroll listener + `getBoundingClientRect`, throttlé par `requestAnimationFrame`, désactivé si `prefers-reduced-motion`. Uploadez les photos **boîtier fermé** et **boîtier ouvert** dans la section ; en attendant, des placeholders SVG rose-doré assurent l'effet.
- **Sections bénéfices numérotées** (`sections/benefit.liquid`) : numéro serif italique en filigrane, zone image (texture / application / packaging) avec placeholder libellé.
- **Grille des 12 teintes** (`sections/shade-grid.liquid`) : pastilles de couleur + noms, éditables bloc par bloc.
- **Fiche produit** : sélecteur de teinte en pastilles de couleur (mappage « Nom : #hex » dans le bloc *Buy buttons* — s'applique aux options nommées Teinte / Shade / Couleur / Color), micro-interaction d'ajout au panier (pop + halo + passage berry).
- **Apparitions au scroll** : `IntersectionObserver` (`.reveal`) sur toutes les sections.

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

### Configuration après installation (10 minutes)

| Étape | Où | Quoi |
|---|---|---|
| 1 | Navigation | Créer le menu `main-menu` (Accueil, Soins visage, Soins corps, À propos, Contact) et le menu `footer` |
| 2 | Pages | Créer les pages : `À propos` (template **page.a-propos**), `Contact` (template **page.contact**), `FAQ` (template **page.faq**) |
| 3 | Paramètres → Politiques | Renseigner remboursement, livraison, confidentialité, CGV — elles s'affichent automatiquement dans le footer |
| 4 | Éditeur de thème | Remplacer les images de démonstration (hero, collections, galerie Instagram) par vos visuels |
| 5 | Réglages du thème → Réseaux sociaux | Renseigner vos liens Instagram / TikTok |
| 6 | Paramètres → Expédition | Créer la règle « livraison gratuite dès 50 € » (le seuil de la barre de progression se règle dans **Réglages du thème → Panier et livraison**) |
| 7 | Marketing | Créer le code promo `BIENVENUE10` (-10 %) promis par le pop-up et la barre d'annonces |

### Métachamps produit recommandés (optionnels)

- `custom.short_description` (texte) — accroche bénéfice sous le prix
- `custom.ingredients` (texte enrichi) — liste INCI, injectée dans l'accordéon « Ingrédients »
- `custom.usage` (texte enrichi) — conseils d'utilisation
- `custom.subtitle` (texte) — sous-titre sur les cartes produit

### Apps conseillées

- **Judge.me ou Loox** (avis produits réels — remplace les témoignages statiques)
- **Klaviyo** (emails — le pop-up et les formulaires taguent les contacts `newsletter`)

---

## Décisions de design (et leur impact conversion)

**Identité visuelle.** Palette ivoire `#FBF7F2` / rose poudré `#D8A7A0` / prune profond `#5E3E47` / doré `#C7A17A` : codes du luxe accessible et de la féminité moderne, sans tomber dans le rose saturé « dropshipping ». Typographie éditoriale : Cormorant Garamond (titres serif = crédibilité de marque établie) + Jost (corps géométrique léger = modernité). Boutons pilule, coins arrondis 16–24 px, ombres diffuses : douceur perçue = confiance.

**Page d'accueil.** Ordre des sections calqué sur le parcours de décision : promesse (hero) → réassurance immédiate (bandeau 4 icônes sous le hero, visible sans scroll sur mobile) → navigation par besoin (collections) → preuve produit (best-sellers avec quick-add) → différenciation (« Pourquoi nous ») → engagements ingrédients → preuve sociale (témoignages « achat vérifié ») → levée du risque (garantie 30 jours) → objections (FAQ avec données structurées) → communauté → capture email.

**Page produit.** Tout ce qui décide l'achat est au-dessus du pli : note, prix avec % d'économie, bénéfices en icônes, stock, bouton d'achat. L'urgence est **honnête** : l'alerte « plus que X en stock » ne s'affiche que si le suivi de stock Shopify est réel et sous le seuil — la fausse rareté détruit la confiance et viole les règles Shopify. Accordéons pour la profondeur d'information sans mur de texte. Barre d'achat fixe sur mobile (le bouton ne disparaît jamais). Cross-sell natif Shopify (« Complétez votre routine »), garantie répétée, FAQ produit.

**Panier.** Drawer AJAX (l'acheteuse ne quitte jamais la page = moins d'abandons), barre de progression livraison offerte (augmente le panier moyen), badges paiement sécurisé/retours à chaque étape, bouton checkout avec cadenas.

**Capture email.** Pop-up retardé (6 s), une seule apparition par semaine (localStorage), jamais par-dessus un panier ouvert, offre claire (-10 %) : capture sans agresser.

**Performance & SEO.** CSS unique ~15 ko gzippé, JS vanilla différé, images responsives (`srcset` + lazy loading, `fetchpriority=high` sur le hero), données structurées JSON-LD (Organization, WebSite+SearchAction, Product+Offers, FAQPage, Article), balises OG/Twitter, canonical, `<html lang>` dynamique.

**Accessibilité.** Skip-link, focus visible, `aria-label` sur toutes les icônes, `prefers-reduced-motion` respecté, contrastes AA.

---

## Structure

```
layout/theme.liquid          Squelette HTML, tokens couleurs, config JS
config/settings_schema.json  Réglages : couleurs, seuil livraison, stock faible, réseaux
sections/                    21 sections modulaires (toutes éditables dans l'éditeur)
snippets/                    Carte produit, prix, icônes SVG, barre livraison, meta-tags
templates/                   JSON OS 2.0 + comptes clients + carte cadeau + password
assets/base.css              Feuille de style unique, organisée en 9 chapitres
assets/global.js             Panier AJAX, variantes, zoom, pop-up, recherche prédictive
locales/fr.default.json      Français par défaut
```
