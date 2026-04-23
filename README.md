# JanVeil — Svadobný plánovač

React aplikácia pre svadobný salón JanVeil (janveil.sk). Cieľová URL: **`janveil.sk/planovac`**.

## 🔧 Rýchly štart

```bash
# 1. Nainštalovať závislosti
npm install

# 2. Spustiť dev server (pre vývoj)
npm start
# → otvorí sa http://localhost:3000

# 3. Vytvoriť produkčný build
npm run build
# → výstup v priečinku build/
```

## 📦 Čo nainštalovať

`npm install` automaticky nainštaluje všetko z `package.json`:

- **React 18.2.0**
- **lucide-react** (ikony)
- **xlsx** (SheetJS pre Excel export)
- **Tailwind CSS 3.3.5** (styling)

## 🚀 Deployment na janveil.sk/planovac

### Krok 1: Build
```bash
npm run build
```

### Krok 2: Nahrať obsah `build/` priečinka

Na hostingu (cez FTP/File Manager) vytvorte priečinok:
```
public_html/planovac/
```

Nahrajte **celý obsah** `build/` priečinka tam (nie samotný priečinok).

### Krok 3: Upraviť WordPress `.htaccess`

V `public_html/.htaccess` pridajte **pred** riadok `RewriteRule . /index.php [L]`:

```apache
# Výnimka pre svadobný plánovač
RewriteRule ^planovac - [L]
```

Výsledok:
```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]

# Výnimka pre svadobný plánovač
RewriteRule ^planovac - [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

### Krok 4: `.htaccess` v `/planovac/`

Priečinok `public/` obsahuje súbor `.htaccess` ktorý sa pri `npm run build` automaticky skopíruje do `build/`. Po nahraní na server bude fungovať React Router (bez neho by F5 refresh dával 404).

### Krok 5: Elementor stránka

V WordPress admin:
1. **Stránky → Pridať novú** → názov "Svadobný plánovač"
2. Upraviť pomocou Elementor
3. Pridať HTML widget s týmto obsahom:

```html
<style>
  .jv-planner-wrap { width: 100%; max-width: 1400px; margin: 0 auto; }
  .jv-planner-wrap iframe {
    width: 100%; height: 90vh; min-height: 700px;
    border: none; border-radius: 20px;
    box-shadow: 0 8px 32px rgba(155, 122, 69, 0.15);
    background: #F2EDE3;
  }
  @media (max-width: 768px) {
    .jv-planner-wrap iframe { height: 85vh; border-radius: 12px; }
  }
</style>
<div class="jv-planner-wrap">
  <iframe src="/planovac/" title="Svadobný plánovač JanVeil" loading="lazy" allow="clipboard-write"></iframe>
</div>
```

4. Menu → pridať odkaz `/planovac/` → "Plánovač svadby"

## 📁 Štruktúra projektu

```
janveil-planner/
├── package.json           # Závislosti
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
├── public/
│   ├── index.html        # Entry HTML
│   └── .htaccess         # Apache rewrite pre React Router
├── src/
│   ├── index.js          # React entry point
│   ├── index.css         # Tailwind import
│   └── App.jsx           # HLAVNÁ KOMPONENTA — celá aplikácia
└── README.md             # Tento súbor
```

Celý plánovač je v **`src/App.jsx`** (~3260 riadkov). Jeden súbor = jednoduchšia údržba.

## 🎨 Dôležité technické detaily

### Farby (premenné pre theming)

V `src/App.jsx` sú použité tieto farby (priamo v CSS):

- **Pozadie**: `#F2EDE3` (teplá krémová)
- **Karty**: `#FFFFFF` (biele)
- **Hover**: `#F5EFE3`
- **Akcent béžový**: `#EBE1CF`
- **Gold primary**: `#9B7A45` (JanVeil branding)
- **Text hlavný**: `#1E1910`
- **Text sekundárny**: `#4A3F2E`
- **Text terciárny**: `#6B5946`

### Dark mode

Prepína sa tlačidlom v hlavičke. Implementované cez CSS triedu `.theme-dark` + override cez `[style*="#1E1910"]`.

### Ukladanie dát

**Bez backendu** — všetko v pamäti prehliadača (React state). Nevesta môže:
- **Exportovať** do Excel/PDF/JSON
- **Importovať** naspäť z JSON súboru
- **Zdieľať** cez URL hash (base64-enkódované dáta)

## 🛠️ Známe technické výzvy

### Fonty
Používam Google Fonts (Cormorant Garamond + Inter). Import je cez `@import url(...)` v `<style>` tagu vnútri komponenty. Funguje všade, ale spomaľuje prvé načítanie o ~200ms. Ak chceš optimalizovať, presuň import do `public/index.html` ako `<link rel="preload">`.

### Veľkosť bundle
Produkčný `build/` má približne **600-800 KB** (gzipped ~200 KB). Pri prvom načítaní je to OK, pri opakovaných návštevách beží z cache okamžite.

### Responsive
Optimalizované pre mobile (360px+) až desktop (1920px+). Sidebar sa skrýva pod 1024px.

## 📋 Testing checklist pred deploymentom

- [ ] `npm run build` prebehne bez chýb
- [ ] Otestované v Chrome / Firefox / Safari
- [ ] Otestované na mobile (375px šírka)
- [ ] Dark mode prepínanie
- [ ] Export do Excel funguje
- [ ] Export do PDF funguje (otvorí HTML súbor)
- [ ] Zdieľací link sa generuje a otvára s dátami
- [ ] Sidebar navigácia funguje na 1024px+
- [ ] Mobile tabs fungujú pod 1024px

## 📞 Kontakt

Majiteľ: JanVeil, Hviezdoslavova 41, Zlaté Moravce
Web: https://janveil.sk
Telefón: +421 944 943 390
