# Skinclair — Thème Shopify premium (Pressed Powder Concealer)

Thème Shopify **Online Store 2.0** complet, construit sur mesure pour **Skinclair**, marque de cosmétiques haut de gamme centrée sur un produit héros : le **Pressed Powder Concealer** (7,99 $ USD, 4 teintes). Zéro dépendance externe, code 100 % natif (Liquid + CSS + JS vanilla), mobile-first, optimisé conversion et SEO. **Tout le site est en anglais** ; seule cette documentation est en français.

> **Éthique intégrée** : aucun faux avis, aucun faux compte à rebours, aucune fausse promotion. L'alerte « plus que X en stock » ne s'affiche que si le stock Shopify réel est sous le seuil. La section Avant/Après utilise des placeholders à remplacer par vos vraies photos.

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

### Configuration après installation (~15 minutes)

| Étape | Où | Quoi |
|---|---|---|
| 1 | Produits | Créer le produit **Pressed Powder Concealer** à 7,99 $ avec une option **Shade** et 4 valeurs : `Light Bisque`, `Warm Bisque`, `Extra Deep Peach`, `Very Deep Beige` (les pastilles de couleur s'affichent automatiquement pour ces noms) |
| 2 | Éditeur de thème → page d'accueil | Sélectionner ce produit dans la section **Shade selector** (« Linked product ») et pointer les boutons « Shop Now » vers sa page |
| 3 | Éditeur de thème | Remplacer les placeholders : image produit du hero, photos **Before/After** (même cadrage), et la liste réelle des **ingrédients** |
| 4 | Navigation | Créer le menu `main-menu` (Home, Shop, About, Contact) et le menu `footer` |
| 5 | Pages | Créer les pages : `About` (template **page.about**), `Contact` (template **page.contact**), `FAQ` (template **page.faq**) |
| 6 | Paramètres → Politiques | Renseigner Privacy, Shipping, Refund, Terms — elles s'affichent automatiquement dans le footer |
| 7 | Paramètres → Expédition | Créer la règle « livraison gratuite dès 50 $ » (seuil de la barre de progression réglable dans **Réglages du thème → Cart & shipping**) |
| 8 | Marketing | Créer le code promo `WELCOME10` (-10 %) promis par le pop-up et la barre d'annonces |
| 9 | Réglages du thème → Social media | Renseigner vos liens Instagram / TikTok / Facebook / Pinterest |

### Métachamps produit recommandés (optionnels)

- `custom.short_description` (texte) — accroche bénéfice sous le prix
- `custom.ingredients` (texte enrichi) — liste INCI, injectée dans l'accordéon « Ingredients »
- `custom.usage` (texte enrichi) — conseils d'application
- `custom.subtitle` (texte) — sous-titre sur les cartes produit

### Avis clients

Le thème ne contient **volontairement aucune section d'avis**. Quand vous aurez de vraies ventes, installez **Judge.me** ou **Loox** pour afficher des avis authentiques — ne publiez jamais de faux témoignages.

---

## Structure de la page d'accueil

1. **Hero** — packshot produit en deux colonnes, titre accrocheur, bouton « Shop Now », animation d'entrée + flottement subtil
2. **Why you'll love it** — 6 cartes bénéfices avec icônes animées (couvre les cernes, fini naturel, texture légère, longue tenue, application facile, tous types de peau)
3. **Before / After** — comparateur interactif à glissière (placeholders à remplacer)
4. **How to use** — 4 étapes numérotées
5. **Shade selector** — les 4 teintes avec pastille de couleur réelle, lien vers le produit
6. **Why choose Skinclair** — valeurs de marque (qualité, confiance, beauté naturelle, résultat pro, confort, tenue)
7. **Ingredients** — cartes premium avec icônes
8. **FAQ** — accordéons animés + données structurées FAQPage
9. **Newsletter** — capture email élégante

## Décisions de design (et leur impact conversion)

**Identité visuelle.** Palette blanc/crème `#FBF7F2` / rose poudré `#D8A7A0` / nude `#F4E8E3` / prune profond `#5E3E47` / rose gold `#C48F7C` — codes du luxe accessible (Rare Beauty, Rhode) sans tomber dans le rose saturé « dropshipping ». Typographie éditoriale : Cormorant Garamond (titres serif = crédibilité) + Jost (corps géométrique léger = modernité). Boutons pilule, coins arrondis 16–24 px, ombres diffuses, beaucoup d'air entre les sections.

**Animations.** Apparition progressive au scroll (IntersectionObserver, décalage en cascade), fade-up d'entrée sur le hero, flottement du packshot, zoom léger des images au survol, élévation des cartes, transitions du drawer panier — le tout respectant `prefers-reduced-motion`.

**Page produit.** Tout ce qui décide l'achat est au-dessus du pli : prix, bénéfices en icônes, sélecteur de teinte avec pastilles de couleur (la teinte choisie s'affiche en toutes lettres), stock honnête, bouton d'achat. Accordéons pour la profondeur d'information. **Barre d'achat fixe sur mobile** : le bouton « Add to Cart » ne disparaît jamais.

**Panier.** Drawer AJAX (on ne quitte jamais la page), **barre de progression vers la livraison gratuite**, ajustement des quantités, bouton checkout premium avec cadenas, badges de réassurance.

**Performance & SEO.** CSS unique, JS vanilla différé, images responsives (`srcset`, lazy loading, `fetchpriority=high` sur le hero), JSON-LD (Product+Offers, FAQPage, Organization), balises OG/Twitter, canonical.

**Accessibilité.** Skip-link, focus visible, `aria-label` sur toutes les icônes, contrastes AA, `prefers-reduced-motion`.

---

## Structure des fichiers

```
layout/theme.liquid          Squelette HTML, tokens couleurs, config JS
config/settings_schema.json  Réglages : couleurs, seuil livraison, stock faible, réseaux
sections/                    Sections modulaires (hero, before-after, how-to-use,
                             shade-selector, ingredients, faq, cart-drawer, footer…)
snippets/                    Carte produit, prix, icônes SVG, shade-swatch,
                             barre livraison, meta-tags
templates/                   JSON OS 2.0 + comptes clients + carte cadeau + password
assets/base.css              Feuille de style unique
assets/global.js             Panier AJAX, variantes, comparateur avant/après, zoom,
                             pop-up, recherche prédictive, animations au scroll
locales/en.default.json      Anglais par défaut
```

### Pastilles de teintes

Le snippet `snippets/shade-swatch.liquid` mappe les noms de teintes vers leur couleur. Pour ajouter une teinte, ajoutez un `when` avec le handle du nom (ex. `medium-sand`) et sa couleur hex — la pastille apparaîtra automatiquement dans le sélecteur de variantes.
