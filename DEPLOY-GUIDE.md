# JanVeil Svadobný Plánovač — Developer Deploy Guide

Kompletný návod na nasadenie React plánovača na `janveil.sk/planovac/`.

---

## 📦 Čo dostávaš v tomto balíku

```
janveil-deploy/
├── DEPLOY-GUIDE.md        ← TENTO súbor (návod pre teba)
├── README.md              ← Rýchly prehľad
├── package.json           ← Závislosti (React, Tailwind, Lucide, xlsx)
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── index.html         ← SEO meta + GA4 tracker + JSON-LD schemas
│   ├── og-image.svg       ← Open Graph banner (Facebook náhľad)
│   └── .htaccess          ← Apache config (React Router + cache + gzip)
└── src/
    ├── index.js           ← React entry point
    ├── index.css          ← Tailwind import
    └── App.jsx            ← HLAVNÝ KÓD (4790 riadkov, 9 modulov)
```

---

## 🎯 Aplikácia — čo robí

Bezplatný svadobný plánovač pre klientky bridal salónu JanVeil (Zlaté Moravce). Žiadna registrácia, žiadny backend — všetko v prehliadači (`localStorage`).

### 9 modulov
1. **Zoznam úloh** — 180+ predvyplnených úloh v 10 fázach (12+ mesiacov → Deň D)
2. **Rozpočet** — kategórie výdavkov s progress barmi
3. **Hostia** — RSVP, jedlo, alergie, bulk akcie, search/filtre
4. **Plán sály** — drag & drop canvas pre stoly + prvky sály (DJ, bar, parket...)
5. **Harmonogram dňa D** — časový rozpis hodinu po hodine
6. **Doklady a papierovanie** — 15 pre-filled položiek (matrika, zmena priezviska...)
7. **Denník** — personal textarea pre nevestu
8. **FAQ** — 23 otázok o salóne a plánovači
9. **Homepage** — countdown, štatistiky, teaser na šaty JanVeil

### Kľúčové funkcie
- ✅ **Auto-save** do localStorage (debounced 500ms)
- ✅ **Plne dvojjazyčný** — SK/EN toggle (data sa prekladajú automaticky)
- ✅ **Share link** — zdieľanie plánovača s partnerom cez URL hash
- ✅ **PDF + Excel export** (6 listov: Prehľad, Úlohy, Rozpočet, Hostia, Catering, Stoly)
- ✅ **JSON backup** — manuálny export/import
- ✅ **Konfety + zvuk** pri splnení úlohy/dokladu (180 partíc, Web Audio API)
- ✅ **Šablóny svadieb** — 3 preset konfigurácie (Classic Chateau, Boho Garden, Modern Urban)
- ✅ **Style Quiz** — 5-otázkový kvíz odporučí typ šiat
- ✅ **GA4 event tracking** — vstavané (stačí nasadiť GA4 ID)
- ✅ **SEO + GEO** — optimalizované pre lokálne vyhľadávanie

---

## 🚀 Deploy postup (krok po kroku)

### Predpoklady

- Node.js **18+** (odporúčam 20)
- npm alebo yarn
- SSH/FTP prístup na server janveil.sk (Apache + mod_rewrite)
- Google Analytics účet (voliteľne)

### 1. Inštalácia závislostí

```bash
cd janveil-deploy
npm install
```

Trvá 1-2 minúty. Nainštaluje React 18, Tailwind 3.3, lucide-react, xlsx (SheetJS).

### 2. Nastavenie Google Analytics 4 (ODPORÚČANÉ)

a) Vytvor si účet na https://analytics.google.com
b) Vytvor property pre `janveil.sk/planovac/`
c) Skopíruj si tvoje tracking ID (formát `G-XXXXXXXXXX`)
d) Otvor `public/index.html` a nájdi **2 výskyty** `G-XXXXXXXXXX` (riadky 50 a 55)
e) Nahraď ich tvojím ID

**Trackované eventy** (už zabudované v kóde):
- `wedding_date_set` — keď nevesta zadá dátum
- `template_applied` — použitie svadobnej šablóny
- `task_completed` — splnená úloha
- `document_completed` — vybavený doklad
- `language_changed` — prepnutie SK/EN
- `share_link_created` — vytvorený share link
- `style_quiz_completed` — dokončený kvíz

### 3. Lokálne testovanie (voliteľné)

```bash
npm start
```

Otvorí `http://localhost:3000` s live-reload. Testuj všetko — mala by sa ti otvoriť plná stránka s countdown-om a 8 modulmi.

### 4. Build pre production

```bash
npm run build
```

Vytvorí sa zložka `build/` (~2-3 MB). Obsahuje:
- `index.html` (s embedded SEO + GA4)
- `static/js/main.XXXXX.js` (všetok React kód)
- `static/css/main.XXXXX.css` (Tailwind styles)
- `og-image.svg`
- `.htaccess`

### 5. Nahratie na server janveil.sk

**Cieľová cesta**: `/www/janveil.sk/planovac/`

```bash
# Cez SCP (príklad)
scp -r build/* user@janveil.sk:/www/janveil.sk/planovac/

# Alebo cez FTP
# Použi FileZilla / WinSCP a nahraj CELÝ obsah zložky build/
# Priamo do /planovac/ (nie /planovac/build/)
```

**Výsledná štruktúra na servri:**
```
/www/janveil.sk/planovac/
├── index.html
├── .htaccess
├── og-image.svg
├── asset-manifest.json
└── static/
    ├── js/main.XXXXX.js
    └── css/main.XXXXX.css
```

### 6. Overenie po nasadení

Otvor v prehliadači:
- ✅ `https://www.janveil.sk/planovac/` — mala by naskočiť domovská stránka
- ✅ Klikni na "Zoznam úloh" — mala by otvoriť checklist
- ✅ Prepni EN v hlavičke — celá stránka by sa mala preložiť
- ✅ Vyplň dátum svadby — mal by sa objaviť countdown
- ✅ Označ úlohu — mali by vybehnúť konfety + zvuk
- ✅ Klikni "Zdieľať" → mal by sa otvoriť share modal s URL

### 7. Integrácia s WordPress + Elementor (hlavná stránka janveil.sk)

Pridaj do navigácie Elementoru **Menu Item** "Svadobný plánovač" s URL `/planovac/`. Alebo si pridaj **Button** na homepage.

**Detailný návod**: viď `ELEMENTOR-NAVOD.md` v rovnakom priečinku.

---

## 🔧 Apache config (.htaccess) — čo robí

Súbor `public/.htaccess` (kopíruje sa do `build/`):

1. **React Router fallback**: všetky neexistujúce URL posiela na `index.html` (aby SPA fungovala)
2. **MIME types**: správne typy pre `.css`, `.js`, `.svg`
3. **Gzip kompresia**: pre HTML/CSS/JS (rýchlejšie načítanie)
4. **Cache headers**: statické súbory na 1 rok (CSS, JS, SVG, fonty)
5. **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

**Ak hosting nepodporuje `.htaccess`** (napr. Nginx), treba equivalentný config. Daj vedieť.

---

## 💾 Ako funguje ukladanie dát

**Kompletne lokálne** v `localStorage` pod kľúčom `janveil-planner-data`. JSON formát:

```json
{
  "coupleName": "Anna & Martin",
  "weddingDate": "2026-08-15",
  "checklist": [{ "id": 1, "phase": "...", "task": "...", "done": true }, ...],
  "expenses": [...],
  "budgetTotal": 15000,
  "guests": [...],
  "tables": [...],
  "sceneElements": [...],
  "timeline": [...],
  "documents": [...],
  "diary": "...",
  "lang": "sk",
  "theme": "light",
  "lastSaved": 1731234567890
}
```

**Dôsledky**:
- ✅ Rýchle, žiadny server load
- ✅ GDPR-friendly — žiadne osobné dáta u nás
- ❌ Ak nevesta vymaže cache/použije iné zariadenie → stratí dáta
- ✅ **Share link** (URL hash) umožňuje preniesť dáta medzi zariadeniami

---

## 🎨 Design System — ak budeš upravovať

### Farby
```css
Primary bg:     #F2EDE3   (béžové pozadie)
Beige:          #EBE1CF   (pills, highlights)
Cards:          #FFFFFF
Gold primary:   #9B7A45   (akcenty, tlačidlá, ikony)
Text primary:   #1E1910   (hlavný text)
Text secondary: #4A3F2E
Text tertiary:  #6B5946   (placeholder, meta)
```

### Fonty
- **Cormorant Garamond** (serif) — nadpisy, italic citáty (400-700)
- **Inter** (sans) — body text, UI (400-700, default 500)

Oba sa načítavajú z **Google Fonts** cez `index.css` alebo inline `<link>` v HTML.

### Komponenty — všetky v `src/App.jsx`
- `App()` — hlavný komponent (state + logic)
- `ModuleShell` — wrapper každého modulu (titulok + back button)
- `StatCard` — štatistické karty (editable / read-only)
- `ElegantSelect` — custom dropdown
- `SeatingModule` — plán sály (drag & drop canvas)
- `BulkAssignSelect` — priradenie k stolu (bulk)
- `CustomDatePicker` — vlastný date picker (SK/EN mesiace)
- `StyleQuizModal` — modal so štýlovým kvízom

---

## 🌐 Prepínanie jazykov (SK/EN)

Implementované cez **bidirectional dictionary**:

1. `t(key)` — UI translations (~200 kľúčov, napr. `nav.home`, `budget.total`)
2. `dataDictionary` — dátové preklady (úlohy, fázy, dokumenty, kategórie — 320+ záznamov)
3. `reverseDictionary` — auto-generovaný EN → SK
4. `switchLanguage(newLang)` — pri prepnutí **preloží všetky dáta v stave**:
   - Checklist (fázy + úlohy)
   - Rozpočet (kategórie)
   - Timeline (udalosti)
   - Doklady (tasky)
   - Hostia (side, type, meal, rsvp)
   - Tabuľky (tvary)

**Dôležité**: Vlastné úlohy/kategórie/hostia ktoré si nevesta sama pridá (nie sú v dictionary) ostanú v pôvodnom jazyku. To je zámer — aby sa jej vlastné texty nestratili.

### Ako pridať nový jazyk (napr. nemčinu)
1. V `src/App.jsx` nájdi `const translations = { ... }` (okolo riadku 1380)
2. Pridaj `de: 'Deutsch text'` do každého kľúča
3. V `dataDictionary` pridaj nový jazyk tiež (alebo urob `germanDictionary`)
4. Pridaj DE do language toggle buttonu

---

## 🐛 Troubleshooting

### Problém: Biela stránka po deploy

**Príčina**: React build cesty sú nesprávne.
**Riešenie**: V `package.json` musí byť `"homepage": "/planovac/"`. Ak máš iné URL, uprav to a rebuild.

### Problém: 404 pri obnovení stránky

**Príčina**: Chýba `.htaccess` alebo nepodporovaný server.
**Riešenie**: Over že `.htaccess` je v `/planovac/` na servri. Ak je to Nginx, treba `try_files $uri /planovac/index.html;`.

### Problém: Fonty sa nenačítavajú

**Príčina**: CSP (Content Security Policy) blokuje Google Fonts.
**Riešenie**: V `.htaccess` pridaj:
```apache
Header set Content-Security-Policy "font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
```

### Problém: OG image sa nezobrazuje na Facebooku

**Príčina**: Facebook má problém s SVG og-image.
**Riešenie**: Konvertuj `og-image.svg` na PNG (1200×630 px) cez napr. https://cloudconvert.com. Nahraj ako `og-image.png` a v `index.html` zmeň path.

### Problém: Konfety padajú pomaly na starom telefóne

**Príčina**: 180 partíc je veľa pre slabé zariadenie.
**Riešenie**: V `App.jsx` nájdi `Array.from({ length: 180 })` a zníž na 80-120.

### Problém: GA4 nezobrazuje eventy

**Príčina**: GA4 má 24-48h delay pre prvé dáta.
**Riešenie**: Počkaj 2 dni. Medzitým použi GA4 **DebugView** (real-time trace).

---

## 📝 Údržba a budúce úpravy

### Zmena kontaktov / cien / adresy

Hľadaj v `src/App.jsx`:
- `+421 944 943 390` (telefón)
- `info@janveil.sk` (email)
- `Hviezdoslavova 2106/41` (adresa)
- `30 €` (cena skúšky), `500 – 800 €` (prenájom), `900 – 1500 €` (predaj)

Tiež v `public/index.html` v JSON-LD structured data.

### Pridanie novej svadobnej úlohy do checklistu

1. `src/App.jsx` → nájdi `const defaultChecklist = [`
2. Pridaj nový záznam `{ phase: '3-6 mesiacov pred', task: 'Tvoja úloha' }`
3. Pridaj jeho preklad do `dataDictionary`:
   `'Tvoja úloha': 'Your task',`
4. Rebuild a deploy

### Pridanie novej šablóny svadby

1. `src/App.jsx` → nájdi `const weddingTemplates = [`
2. Pridaj nový objekt s `id`, `name`, `desc`, `icon`, `budget`, `expenses`

### Zmena primárnej farby

V `src/App.jsx` nájdi `#9B7A45` (gold) — je to cez ~200 riadkov ako inline štýl. Najjednoduchšie je sed:
```bash
sed -i 's/#9B7A45/#B08D57/g' src/App.jsx
```

---

## 🔒 Bezpečnosť a súkromie

- ✅ **Žiadne cookies** (okrem GA4 ktoré používa localStorage)
- ✅ **Žiadne tracking pixely tretích strán** okrem GA4
- ✅ **Dáta užívateľa** nikam neodchádzajú — sú iba v jeho prehliadači
- ✅ **GDPR compliance**: nič neposielame na server → netreba cookie banner pre plánovač samotný (ale pre GA4 áno — tu sú IP anonymizované cez `anonymize_ip: true`)
- ⚠️ **Share link obsahuje všetky dáta** v URL hash — ak si ho nevesta pošle mailom, vidí všetci kto má link. Tento fakt je v UI hneď spomenutý.

---

## 📞 Kontakt

Pri problémoch s nasadením ma kontaktuj cez klienta (Kvetka — JanVeil).

Pre technické detaily o kóde viď inline komentáre v `src/App.jsx`.

---

## 📋 Checklist pre developera pred go-live

- [ ] `npm install` prešiel bez chyby
- [ ] `npm run build` vytvoril `build/` zložku
- [ ] GA4 ID dosadené v `public/index.html` (2 miesta)
- [ ] Všetky súbory z `build/*` nahrané na `/planovac/`
- [ ] `.htaccess` je prítomný na servri
- [ ] URL `https://www.janveil.sk/planovac/` otvorí homepage
- [ ] Prepnutie EN/SK funguje a prekladá všetko
- [ ] Test na mobile (iPhone + Android)
- [ ] OG preview test na https://developers.facebook.com/tools/debug/
- [ ] Rich results test na https://search.google.com/test/rich-results (JSON-LD)
- [ ] Page speed test na https://pagespeed.web.dev/ (cieľ: 90+ mobile)
- [ ] GA4 real-time trace zobrazuje návštevu
- [ ] Pridaný link na plánovač v hlavičke/footeri janveil.sk
