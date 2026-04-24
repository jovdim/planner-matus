# Ako pridať svadobný plánovač na janveil.sk/planovac (Elementor)

Návod na nasadenie plánovača **priamo pod hlavnou doménou** — výsledná URL bude `janveil.sk/planovac`. Toto je výhodnejšie pre SEO a pôsobí profesionálnejšie ako subdoména.

Celý proces zaberie **20-40 minút**.

---

## 🎯 Prehľad postupu

```
1. Vývojár skompiluje plánovač → build súbory
2. Nahráte build súbory do priečinka /planovac/ vo webovom priestore
3. Upravíte .htaccess aby WordPress neprevzal kontrolu nad /planovac/
4. V Elementore pridáte HTML widget alebo presmerovanie
5. Pridáte odkaz do menu
✓ URL: janveil.sk/planovac
```

Hlavný technický trik: WordPress má v `.htaccess` pravidlo ktoré chytá **všetky** URL a posiela ich cez index.php. My musíme urobiť **výnimku pre `/planovac/`** aby WordPress nechal tento priečinok na pokoji.

---

## ✅ KROK 1: Nechajte si skompilovať plánovač

Pošlite vývojárovi:
- Súbor **`janveil-planner.jsx`**
- Tento návod
- **DÔLEŽITÉ**: povedzte mu že plánovač bude bežať na ceste **`/planovac/`** (nie na root doméne)

**Inštrukcia pre vývojára:**

> _"Skompiluj React aplikáciu z priloženého `janveil-planner.jsx`. Bude bežať na URL `janveil.sk/planovac/`. Použite Create React App alebo Vite. Do `package.json` pridajte `"homepage": "/planovac/"` pred build. Závislosti: `lucide-react`, `xlsx`, `tailwindcss`. Výstup (build priečinok) mi pošlite."_

**Prečo `homepage`?** Bez toho by React súbory hľadali CSS/JS v root (`janveil.sk/static/...`), ale ony sú v `/planovac/static/...`. Toto nastavenie to opraví.

Ak vývojár použije **Vite**, namiesto `homepage` musí nastaviť v `vite.config.js`:
```js
export default { base: '/planovac/' }
```

**Čas:** ~1 hodina · **Cena:** 30-60 €

---

## 📤 KROK 2: Nahrať súbory na hosting

### 2a. Pripojte sa na hosting

Prihláste sa do kontrolného panela hostingu (Webglobe / Websupport / Wedos / WebHouse) a otvorte **File Manager**. Alebo cez FTP klient **FileZilla**.

### 2b. Vytvorte priečinok `planovac/`

V hlavnom webovom priečinku (`public_html/` alebo `www/` — tam kde máte WordPress):

```
public_html/
├── .htaccess          ← existujúci (WordPress)
├── index.php          ← existujúci (WordPress)
├── wp-admin/          ← existujúci (WordPress)
├── wp-content/        ← existujúci (WordPress)
├── wp-includes/       ← existujúci (WordPress)
└── planovac/          ← NOVÝ — vytvorte ho
```

### 2c. Nahrajte obsah `build/` priečinka

Do `planovac/` nahrajte **obsah** build priečinka od vývojára (nie celý priečinok, ale jeho obsah). Výsledok:

```
public_html/planovac/
├── index.html
├── asset-manifest.json
├── favicon.ico
├── manifest.json
├── robots.txt
└── static/
    ├── css/main.xxxxx.css
    ├── js/main.xxxxx.js
    └── media/
```

---

## 🔧 KROK 3: Upraviť .htaccess (KRITICKÝ KROK)

**Toto je najdôležitejší krok** — bez tohto WordPress bude chytať URL `janveil.sk/planovac` a zobrazí 404 chybu.

### 3a. Zálohovať existujúci .htaccess

1. V File Manager-i otvorte `public_html/.htaccess`
2. **Skopírujte jeho obsah** do textového súboru na disku (pre istotu)

Tip: Ak `.htaccess` nevidíte, zapnite v File Manageri "Show hidden files" (zobraziť skryté súbory).

### 3b. Upraviť WordPress .htaccess

Otvorte `public_html/.htaccess` na úpravu. Vyzerá približne takto:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

**Pridajte riadok `RewriteRule ^planovac - [L]`** pred `RewriteRule . /index.php [L]`, takto:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]

# DÔLEŽITÉ: Výnimka pre svadobný plánovač
RewriteRule ^planovac - [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

Uložte.

### 3c. Vytvoriť .htaccess v `/planovac/` priečinku

V `public_html/planovac/` vytvorte **nový súbor** `.htaccess` s týmto obsahom:

```apache
# React Router — všetky URL posielať na index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /planovac/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /planovac/index.html [L]
</IfModule>

# Správne MIME typy
<IfModule mod_mime.c>
  AddType text/css .css
  AddType application/javascript .js
  AddType image/svg+xml .svg
</IfModule>

# Komprimácia pre rýchlejšie načítanie
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache pre statické súbory (1 rok)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### 3d. Otestovať

Otvorte v prehliadači: **`https://janveil.sk/planovac/`**

Mal by sa zobraziť plánovač. Ak vidíte:
- ✅ **Plánovač** — skvelé, pokračujte
- ❌ **404 WordPress chybu** — `.htaccess` v `public_html/` nie je správne upravený, vráťte sa na 3b
- ❌ **Bielu stránku** — pravdepodobne chýba `homepage: "/planovac/"` v build procese, vývojár musí prebuildnúť
- ❌ **500 chybu** — chyba v `.htaccess` syntaxi, skontrolujte

---

## 🎨 KROK 4: Vytvoriť stránku v Elementore

Máte **dve možnosti** ako ukázať plánovač v navigácii:

### Možnosť A: Priamy odkaz (odporúčané)

Najjednoduchšie — v menu bude odkaz ktorý vedie priamo na `/planovac/`, čo je samostatná stránka bez WordPress hlavičky/päty.

**Výhody:** Plánovač dostane celú obrazovku, rýchlejšie načítanie.
**Nevýhody:** Nevesta vidí plánovač bez vašej hlavnej navigácie JanVeil.

Preskočte na **KROK 5** (pridanie do menu).

### Možnosť B: Plánovač vnorený v Elementor stránke

Plánovač sa zobrazí v rámci štandardného janveil.sk layoutu (s vašou hlavičkou, pätou, menu).

1. WordPress admin → **Stránky → Pridať novú**
2. Názov: **"Svadobný plánovač"**
3. URL slug: **`svadobny-planovac`** (nie `planovac` — to by konfliktovalo!)
4. Kliknite **"Upraviť pomocou Elementoru"**
5. Vľavo dole ⚙️ **Settings**:
   - Page Layout: **Elementor Full Width**
   - Hide Title: **ON**
6. Pridajte widget **"HTML"** (nie Text Editor)
7. Vložte tento kód:

```html
<style>
  .jv-planner-wrap {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  .jv-planner-wrap iframe {
    width: 100%;
    height: 90vh;
    min-height: 700px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(176, 141, 87, 0.15);
    background: #FBF8F4;
    display: block;
  }
  .jv-planner-fallback {
    text-align: center;
    margin-top: 16px;
    font-size: 13px;
    color: #8A7A62;
    font-family: Georgia, serif;
    font-style: italic;
  }
  .jv-planner-fallback a {
    color: #B08D57;
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    .jv-planner-wrap iframe {
      height: 85vh;
      border-radius: 12px;
    }
  }
</style>

<div class="jv-planner-wrap">
  <iframe
    src="/planovac/"
    title="Svadobný plánovač JanVeil"
    loading="lazy"
    allow="clipboard-write"
  ></iframe>
  <p class="jv-planner-fallback">
    Plánovač sa vám nezobrazuje?
    <a href="/planovac/" target="_blank" rel="noopener">Otvoriť v novom okne →</a>
  </p>
</div>
```

8. **Publikovať**

Teraz je plánovač dostupný na **oboch** URL:
- `janveil.sk/planovac/` — samostatná full-screen verzia
- `janveil.sk/svadobny-planovac/` — vnorená v Elementor layoute

**Moje odporúčanie:** Do menu dajte **odkaz priamo na `/planovac/`** (Možnosť A). Plánovač má vlastný design a Elementor layout okolo neho pôsobí rušivo. Ak chcete navigáciu späť, v plánovači je logo JanVeil ktoré vedie späť na homepage.

---

## 🔗 KROK 5: Pridať do menu

1. WordPress admin → **Vzhľad → Menu**
2. Vyberte hlavné menu
3. Vľavo kliknite na **"Vlastné odkazy"**
4. **URL:** `/planovac/`
5. **Text odkazu:** `Plánovač svadby` (alebo `💍 Plánovač`, `Pre nevesty`, `Plánovanie`)
6. Kliknite **"Pridať do menu"**
7. Potiahnite položku na želanú pozíciu (odporúčam hneď vedľa "Kontakt" alebo "Referencie")
8. **Uložiť menu**

---

## 🎉 Hotovo!

Otvorte `janveil.sk`, kliknite v menu na **"Plánovač svadby"** → mali by ste vidieť plánovač na URL `janveil.sk/planovac/`.

---

## 💎 Marketingový bonus: CTA sekcia na homepage

V Elementore na hlavnej stránke pridajte nad/pod galériou elegantnú sekciu:

```html
<div style="text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #FBF8F4, #F5EDE0); border-radius: 24px; margin: 60px auto; max-width: 900px;">
  <p style="font-size: 11px; letter-spacing: 0.35em; color: #B08D57; text-transform: uppercase; margin-bottom: 24px;">— Novinka 2026 —</p>
  <h2 style="font-family: Georgia, serif; font-weight: 300; font-size: 48px; color: #2C2416; margin: 0 0 24px; line-height: 1.2;">
    <em>Darček pre budúce nevesty</em>
  </h2>
  <p style="font-size: 17px; color: #6B5D4A; max-width: 520px; margin: 0 auto 40px; line-height: 1.7;">
    Bezplatný svadobný plánovač priamo u nás.<br>
    Bez registrácie, bez starostí.<br>
    Všetko na jednom mieste.
  </p>
  <a href="/planovac/" style="display: inline-block; border: 1px solid #B08D57; color: #B08D57; padding: 16px 48px; border-radius: 999px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; font-weight: 500;">
    Vyskúšať plánovač
  </a>
</div>
```

Toto je skvelý **lead magnet** — pritiahne na web budúce nevesty ktoré ešte nevedia o vašich šatách. Plánovač má v sebe CTA tlačidlo "Objednať skúšku" ktoré ich dovedie k vám.

---

## ❓ Problémy a riešenia

**"janveil.sk/planovac zobrazuje WordPress 404"**
→ `.htaccess` v `public_html/` nemá pridanú výnimku. Vráťte sa na KROK 3b.

**"Biela stránka"**
→ Najčastejšia príčina: chýba `homepage: "/planovac/"` v package.json. Vývojár musí upraviť a prebuildnúť.
→ Otvorte v prehliadači F12 → Console. Ak vidíte chyby ako `Failed to load static/js/main.xxx.js` s cestou `janveil.sk/static/...` (bez `/planovac/`), je to tento problém.

**"Stránka funguje, ale po refresh dá 404"**
→ Nemáte `.htaccess` vnútri `/planovac/` (KROK 3c). Vytvorte ho.

**"CSS nefunguje, stránka vyzerá ako tetris"**
→ MIME typ CSS sa nenačítal. Skontrolujte `.htaccess` v `/planovac/` že obsahuje sekciu `AddType text/css .css`.

**"Google Analytics nevidí /planovac/"**
→ Logické — je to React app, nie WordPress stránka. Vývojár musí pridať GA tracking kód priamo do `index.html` v build priečinku, alebo cez React komponentu.

**"Chcem aby /planovac mal aj WordPress menu hore"**
→ Použite Možnosť B z KROKU 4 (iframe v Elementor stránke) a do menu dajte odkaz na `/svadobny-planovac` (Elementor stránka), nie na `/planovac`.

---

## 🔄 Ako aktualizovať plánovač v budúcnosti

Keď chcete zmeniť niečo v plánovači (nová funkcia, oprava, zmena textu):

1. Vývojár upraví `janveil-planner.jsx`
2. Urobí `npm run build`
3. Nahrá **obsah nového build priečinka** do `public_html/planovac/` (prepíše existujúce súbory)
4. Prípadne v prehliadači **Ctrl+F5** pre vyčistenie cache

**Netreba** nič meniť v WordPress, Elementore, menu ani `.htaccess`. Plánovač sa len "prepíše" novou verziou.

---

## 📞 Kde nájsť vývojára

**Skúsení WordPress + React vývojári na Slovensku:**
- Facebook skupiny: **"WordPress Slovensko"**, **"Frontend Slovakia"**, **"React Czech-Slovakia"**
- **Bazos.sk** → Počítače a softvér → Služby
- **Jobdone.sk**, **Freelo.sk**

**Čo mu pošlete:**
1. `janveil-planner.jsx` (zdrojový kód)
2. Tento návod
3. Prístup do:
   - WordPress admin
   - File Manager / FTP na hostingu
4. URL: `janveil.sk`

**Odhadovaná cena:** 80-200 € (celý proces na kľúč)
**Čas:** 3-5 hodín

---

_JanVeil Svadobný plánovač · janveil.sk/planovac_
