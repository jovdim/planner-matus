# CHANGELOG

## v1.2 — Final (April 2026)

### Plná podpora angličtiny
- ✅ Kompletný SK/EN toggle v headere
- ✅ Všetkých 200+ UI textov preložených
- ✅ 320+ dátových prekladov (úlohy, fázy, kategórie, dokumenty...)
- ✅ Pri prepnutí jazyka sa automaticky preložia všetky dáta v stave
- ✅ Vlastné úlohy/kategórie nevesty sa nestrácajú pri prepnutí
- ✅ Datepicker má lokalizované mesiace + dni
- ✅ FAQ celý v EN/SK (23 otázok × 6 kategórií)
- ✅ Style quiz preložený (otázky + výsledky)

### UX vylepšenia
- ✅ **Kompaktný rozpočet** — karty v 2-3 stĺpcoch (predtým roztiahnuté riadky)
- ✅ **Kompaktný harmonogram** — karty v 2-3 stĺpcoch
- ✅ **Konfety** — 180 partíc (bolo 80), viditeľnejšie
- ✅ **Zvukový signál** pri splnení úlohy aj dokladu (Web Audio API)

### Nové funkcie
- ✅ **Auto-save** do localStorage (debounced 500ms)
- ✅ **Saved indikátor** v headere (zobrazí sa na 1.5s po uložení)
- ✅ **3 svadobné šablóny** (Classic Chateau, Boho Garden, Modern Urban)
- ✅ **Deadlines** na úlohách (overdue/today/soon badges)
- ✅ **Urgent tasks button** na homepage (vidíš čo je po termíne)

### Marketing
- ✅ **GA4 tracking** s 10+ eventmi (wedding_date_set, template_applied, task_completed, ...)
- ✅ **Open Graph banner** (og-image.svg, 1200×630)
- ✅ **JSON-LD structured data** (LocalBusiness + FAQ + WebApp + BreadcrumbList)
- ✅ **SEO meta tags** optimalizované pre lokálne vyhľadávanie Zlaté Moravce + okolie

### Performance
- ✅ **.htaccess** s gzip kompresiou + cache 1 rok pre statiku
- ✅ **Security headers** (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- ✅ React.StrictMode enabled
- ✅ Tailwind purge pre minimálnu CSS veľkosť

### Opravené v tejto iterácii
- Preklad "Späť na prehľad" cez lang prop v ModuleShell
- 128+ chýbajúcich úloh v dataDictionary doplnené
- Tooltips v pláne sály preložené
- Pill buttons (Adult/Child/Round/Square) majú oboj-jazyčné porovnania
- pushUndo toast notifikácie preložené
- Bulk Confirm/Decline tlačidlá posielajú jazykovo-správny string
- ElegantSelect options sa menia podľa jazyka
- BulkAssignSelect dostáva lang prop
- SeatingModule dostáva lang + t props
- CustomDatePicker dostáva lang prop
- StyleQuizModal dostáva lang prop (otázky + výsledky)

---

## Štatistiky kódu

- **App.jsx**: 4790 riadkov, 282 KB
- **Syntax**: verifikovaná Babel parserom ✓
- **Balance**: braces/parens/brackets všetky OK ✓

---

## Deploy

1. Nahrať balík na server
2. `npm install` → `npm run build`
3. Obsah `build/` nahrať do `/planovac/`
4. Nastaviť GA4 ID v `public/index.html`
5. Overiť v prehliadači

Detailný návod: viď `DEPLOY-GUIDE.md`
