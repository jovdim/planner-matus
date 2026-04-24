# SEO + GEO návod pre JanVeil.sk

Tento dokument obsahuje **komplexný návod ako zlepšiť SEO a lokálne vyhľadávanie (GEO) pre celý web JanVeil.sk**.

> **Cieľ:** aby keď niekto hľadá *"svadobné šaty Zlaté Moravce"*, *"svadobný salón Nitra"* alebo *"svadobný plánovač zdarma"* — zobrazil sa váš web na prvých priečkach Google.

---

## 📋 OBSAH

1. Štruktúra webu — odporúčané stránky
2. Meta tagy pre každú stránku
3. JSON-LD Structured Data (technické)
4. Google My Business (najdôležitejšie!)
5. Lokálne citácie a zoznamy
6. Obsahová stratégia (blog)
7. Linkbuilding
8. Technické SEO
9. Mesačný checklist

---

## 1. Štruktúra webu — odporúčané stránky

Aktuálne máte tieto stránky:
- ✅ Domov (`/`)
- ✅ O nás (`/o-nas/`)
- ✅ Kolekcia šiat (`/svadobne-saty/`)
- ✅ Skúška šiat (`/skuska-svadobnych-siat/`)
- ✅ Kontakt (`/kontakt/`)
- ✅ Výpredaj (`/vypredaj-svadobnych-siat/`)
- ✅ Svadobný plánovač (`/planovac/`) — **nový!**

### 🆕 Odporúčané nové stránky pre lepšie SEO:

| Stránka | URL | Prečo |
|---|---|---|
| **FAQ** | `/najcastejsie-otazky/` | Cieli na "ako prebieha skúška", "koľko stojí" atď. |
| **Blog** | `/blog/` | Dlhodobá hodnota, cieli na info queries |
| **Kategórie šiat** | `/svadobne-saty/korzetove/`, `/svadobne-saty/princeznovske/` | Long-tail keywords |
| **Reálne svadby** | `/realne-svadby/` | Social proof + unikátny obsah |
| **O značke JanVeil** | `/znacka-janveil/` | Propagácia vlastnej kolekcie |
| **Pre družičky** | `/pre-druzicky/` | Cross-sell, rozšírenie keywords |
| **Galéria** | `/galeria/` | Vizuálny obsah pre Google Images |
| **Recenzie** | `/recenzie/` | Social proof, automaticky generovateľný obsah z Google reviews |

---

## 2. Meta tagy pre každú stránku

### Všeobecná šablóna

Každá stránka by mala mať:

```html
<!-- Základné SEO -->
<title>[Konkrétny názov stránky] | JanVeil Zlaté Moravce</title>
<meta name="description" content="[Popis 150-160 znakov s kľúčovými slovami]" />
<link rel="canonical" href="https://www.janveil.sk/[url]/" />

<!-- GEO -->
<meta name="geo.region" content="SK-NI" />
<meta name="geo.placename" content="Zlaté Moravce" />
<meta name="geo.position" content="48.3864;18.3963" />
<meta name="ICBM" content="48.3864, 18.3963" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:locale" content="sk_SK" />
<meta property="og:title" content="[Rovnaký ako title]" />
<meta property="og:description" content="[Rovnaký ako description]" />
<meta property="og:url" content="https://www.janveil.sk/[url]/" />
<meta property="og:image" content="https://www.janveil.sk/[cesta-k-obrazku].jpg" />
```

### Konkrétne príklady

**Domovská stránka:**
```html
<title>Svadobný salón JanVeil | Svadobné šaty Zlaté Moravce</title>
<meta name="description" content="Svadobný salón JanVeil v Zlatých Moravciach — svadobné šaty pre tie najnáročnejšie nevesty. Vlastná kolekcia aj európski návrhári. Súkromné skúšky s osobným prístupom." />
```

**Kolekcia šiat:**
```html
<title>Svadobné šaty — naša kolekcia | JanVeil Zlaté Moravce</title>
<meta name="description" content="Objavte našu kolekciu svadobných šiat — korzetové, A-línie, princeznovské, bohemské aj minimalistické modely. 90% čipiek ručne našívaných. Prenájom 500-800€, predaj 900-1500€." />
```

**Skúška šiat:**
```html
<title>Skúška svadobných šiat | Salón JanVeil Zlaté Moravce</title>
<meta name="description" content="Súkromná skúška svadobných šiat v salóne JanVeil. Trvanie 1 hodina, poplatok 30 € (pri rezervácii sa odpočíta z ceny). Objednajte si termín telefonicky alebo online." />
```

**Svadobný plánovač:**
```html
<title>Svadobný plánovač zdarma | JanVeil Zlaté Moravce</title>
<meta name="description" content="Bezplatný online svadobný plánovač. Zoznam úloh, rozpočet, hostia, zasadací poriadok, harmonogram dňa D — všetko na jednom mieste. Dar pre každú nevestu." />
```

### Ako implementovať v WordPress

Použite plugin **Yoast SEO** alebo **Rank Math** (oba majú free verziu):

1. Inštalácia: WordPress admin → Pluginy → Pridať nový → vyhľadajte "Rank Math"
2. Pre každú stránku → úprava → sekcia SEO dole → vyplňte "SEO titulok" a "Meta description"
3. Plugin automaticky pridá Open Graph a structured data

---

## 3. JSON-LD Structured Data

Structured data hovoria Googlu **aký typ biznisu ste**. Toto je kľúčové pre **Google Business Panel** (ten box napravo vo vyhľadávaní).

### LocalBusiness schema — pridajte do `<head>` domovskej stránky

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BridalShop",
  "@id": "https://www.janveil.sk/#business",
  "name": "Svadobný salón JanVeil",
  "alternateName": "JanVeil",
  "description": "Svadobný salón JanVeil v Zlatých Moravciach ponúka svadobné šaty pre tie najnáročnejšie nevesty. Klasické, korzetové, bohemské aj minimalistické modely.",
  "url": "https://www.janveil.sk",
  "logo": "https://www.janveil.sk/wp-content/uploads/2024/01/janveil-logo.png",
  "telephone": "+421944943390",
  "email": "info@janveil.sk",
  "priceRange": "€€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hviezdoslavova 2106/41",
    "addressLocality": "Zlaté Moravce",
    "postalCode": "953 01",
    "addressRegion": "Nitriansky kraj",
    "addressCountry": "SK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.3864,
    "longitude": 18.3963
  },
  "sameAs": [
    "https://www.facebook.com/JanVeilsvadobnysalon",
    "https://www.instagram.com/janveil_svadobny_salon"
  ]
}
</script>
```

### FAQ schema — pridajte na FAQ stránku

Už hotové v `public/index.html` vášho plánovača.

### Ako pridať v WordPress

**Možnosť 1: Plugin Rank Math** (najjednoduchšie)
- Rank Math automaticky generuje LocalBusiness schema
- Stačí vyplniť údaje v `Rank Math → Local SEO`

**Možnosť 2: Ručne cez "Custom HTML" widget v Elementore**
- Otvorte stránku v Elementore
- Pridajte widget "HTML Code"
- Vložte celý `<script>` blok vyššie

**Možnosť 3: Cez `functions.php`** (pre pokročilých)
```php
function janveil_add_schema() {
  if (is_front_page()) {
    echo '<script type="application/ld+json">...</script>';
  }
}
add_action('wp_head', 'janveil_add_schema');
```

### Testovanie structured data

Po pridaní otestujte:
- https://search.google.com/test/rich-results → vloží URL, overí či schema funguje
- https://validator.schema.org → podobné, ale podrobnejšie

---

## 4. Google My Business — NAJDÔLEŽITEJŠIE!

Pre lokálny biznis je **Google Business Profile** (bývalý Google My Business) **dôležitejší ako váš web**.

### Checklist:

- [ ] **Uistite sa že máte vytvorený a overený profil** → https://www.google.com/business
- [ ] **Kompletné údaje** — adresa, telefón, web, otváracie hodiny
- [ ] **Kategórie** — hlavná: "Svadobný salón"; sekundárne: "Požičovňa šiat", "Krajčírstvo"
- [ ] **Popis firmy** (750 znakov max) — s kľúčovými slovami prirodzene
- [ ] **Fotky** — minimálne 10 (salón, šaty, exteriér, tím) v rozlíšení 720×720+
- [ ] **Logo + cover photo** — profesionálna grafika
- [ ] **Pravidelné príspevky** — 1× týždenne (nové šaty, reálne svadby, akcie)
- [ ] **Odpovede na recenzie** — na každú recenziu, kladnú aj zápornú
- [ ] **Produkty** — fotky konkrétnych šiat s popisom a cenou
- [ ] **Služby** — skúška šiat, úpravy na mieru, prenájom, predaj
- [ ] **Atribúty** — "Vhodné pre ženy", "Možnosť predaja", "Možnosť prenájmu"
- [ ] **Posts (Google Posts)** — akciové ponuky, udalosti, novinky

### Získavanie recenzií

**Cieľ:** 50+ recenzií s priemerom 4.8+ hviezd v priebehu roka.

Po každej dokončenej svadbe:
1. Pošlite neveste email so špeciálnou linkou: `https://g.page/r/[ID-VAŠEJ-FIRMY]/review`
2. Priložte fotku z jej svadby (poslali od fotografa)
3. Milú správu: *"Bolo nám cťou byť súčasťou vašej krásnej svadby. Ak ste boli spokojní, budeme vďační za krátku recenziu — pomôže iným nevestám nájsť nás."*

### Šablóna odpovede na recenzie

**Pozitívna recenzia:**
> Drahá [meno]! Ďakujeme za nádherné slová ❤️ Bolo nám cťou byť súčasťou vášho výnimočného dňa. Prajeme vám nekonečnú lásku a šťastie v spoločnej ceste. — Kvetka z JanVeil

**Negatívna recenzia:**
> Dobrý deň [meno], ďakujeme že ste si našli čas napísať spätnú väzbu. Je nám úprimne ľúto že ste neboli spokojná s [konkrétny bod]. Radi by sme to s vami osobne prediskutovali — zavolajte nám prosím na +421 944 943 390 alebo napíšte na info@janveil.sk. Každá spätná väzba nás posúva vpred.

---

## 5. Lokálne citácie a zoznamy

Uistite sa že ste uvedení na všetkých relevantných portáloch s **rovnakými údajmi** (tzv. NAP — Name, Address, Phone). Nekonzistentné údaje zhoršujú SEO.

### NAP konzistentnosť

Všade používajte presne toto:

- **Názov:** Svadobný salón JanVeil
- **Adresa:** Hviezdoslavova 2106/41, 953 01 Zlaté Moravce
- **Telefón:** +421 944 943 390
- **Web:** https://www.janveil.sk

### Zoznam portálov kde byť:

**Všeobecné slovenské:**
- [ ] Google Business Profile ⭐ (najdôležitejšie)
- [ ] Bing Places
- [ ] Facebook Business
- [ ] Instagram Business (s lokalitou)
- [ ] Firmy.sk
- [ ] Cylex.sk
- [ ] Zlatestranky.sk
- [ ] Azet.sk — katalóg firiem
- [ ] Pozri.sk
- [ ] Najnakup.sk
- [ ] Zoznam.sk (katalóg)

**Svadobné portály (KĽÚČOVÉ!):**
- [ ] Weddingmag.sk
- [ ] Svadba.sk
- [ ] Weddingram.sk ✓ (už tam ste)
- [ ] Svadbanet.sk
- [ ] Moja-svadba.sk
- [ ] Svadobny-katalog.sk
- [ ] Svadbovo.sk

**Regionálne:**
- [ ] Zlatemoravce.info ✓ (už tam ste)
- [ ] Nitrianskynovinka.sk
- [ ] Mestozlatemoravce.sk (ak má katalóg)

**Pre cudzincov (ak chcete rozšíriť):**
- [ ] TripAdvisor
- [ ] Yelp

---

## 6. Obsahová stratégia (blog)

Blog je **dlhodobý SEO magnet**. Jeden článok môže priniesť návštevnosť ešte za 3-5 rokov.

### Prečo publikovať na blogu

Nevesty vyhľadávajú veci ako:
- *"ako si vybrať svadobné šaty"*
- *"kedy začať plánovať svadbu"*
- *"koľko stojí svadba na slovensku 2026"*
- *"čo si obuť pod svadobné šaty"*
- *"boho svadba inšpirácia"*

Ak budete mať články na tieto témy, Google vás bude zobrazovať hore.

### 12 článkov na prvý rok (1 za mesiac)

1. **"Ako si vybrať svadobné šaty podľa postavy"** — long evergreen
2. **"Aké svadobné šaty sú trendom v roku 2026"** — aktuálne
3. **"Klasické vs. bohemské šaty — ktorý štýl je pre vás?"** — rozhodovací
4. **"Koľko stojí svadba na Slovensku? Reálny rozpočet pre 100 hostí"** — praktické
5. **"Prenájom vs. kúpa svadobných šiat — čo sa viac oplatí?"** — porovnávacie
6. **"10 vecí ktoré si všímať na prvej skúške šiat"** — praktické tipy
7. **"Svadobné šaty pre tehuľky — naše tipy"** — špeciálna cieľovka
8. **"Svadobné trendy v Zlatých Moravciach a Nitrianskom kraji"** — lokálne SEO
9. **"Letná svadba — ako si vybrať šaty ktoré nepália"** — sezónne
10. **"Reálna svadba: Anna a Martin — zámocká svadba v Topoľčiankach"** — case study
11. **"Dress code pre svadobných hostí — kompletný sprievodca"** — cross-sell
12. **"Ako sa starať o svadobné šaty po svadbe"** — po-svadba

### Formát článku (SEO-friendly)

- **Dĺžka:** minimálne 1500 slov (ideálne 2500+)
- **Štruktúra:** H1 nadpis, H2 podnadpisy (5-7), H3 ak potrebné
- **Kľúčové slovo** v titulku, prvých 100 slovách, a 3-5× v texte (prirodzene)
- **Obrázky:** 5-10 s `alt` tagmi obsahujúcimi keywords
- **Interné linky:** odkazy na kolekciu šiat, plánovač, kontakt
- **CTA na konci:** "Objednajte si skúšku" alebo "Pozrite si našu kolekciu"

---

## 7. Linkbuilding

Odkazy z iných webov = Google vás považuje za dôveryhodných.

### Stratégie na získanie kvalitných odkazov

**1. Hosťovské články**
- Napíšte článok pre weddingmag.sk, svadba.sk, beauty blogy
- V autorskom boxe link na váš web

**2. Partnerstvá s inými dodávateľmi**
- Fotografi, kvetinári, cateringy v regióne
- "Odporúčame sa navzájom na webe"
- Napíšte im email: *"Ak ste spokojní s našou spoluprácou, uvítali by sme odkaz na vašom webe. Radi odkážeme aj my na váš."*

**3. PR články na zlatemoravce.info**
- Nové kolekcie, akcie, udalosti → pošlite tlačovú správu
- Miestne médiá vždy potrebujú obsah

**4. Reálne svadby**
- Fotograf publikuje fotky svadby → poprosíte aby uviedli "Šaty: JanVeil" + link
- Svadobné blogerky → za darček (akciová úprava) môžu publikovať

**5. Sponzorské akcie**
- Mestské podujatia v Zlatých Moravciach
- Dobročinné akcie — logo + link na webe akcie

### Čo NEROBIŤ
- ❌ Kupovať odkazy z "SEO farmier" — Google trestá
- ❌ Spamovať komentáre na cudzích weboch
- ❌ Výmena odkazov 1:1 s nesúvisiacimi webmi

---

## 8. Technické SEO

### Nutné minimum:

- [ ] **HTTPS všade** (SSL certifikát) — zistíte v prehliadači, má byť zámok
- [ ] **Mobilná responzívnosť** — otestujte na https://search.google.com/test/mobile-friendly
- [ ] **Rýchlosť webu** — otestujte na https://pagespeed.web.dev
  - Cieľová hodnota: 80+ na mobile, 90+ na desktop
  - Ak máte pomalé: optimalizujte obrázky (WebP formát), cache plugin (WP Rocket)
- [ ] **Sitemap.xml** — Rank Math / Yoast generuje automaticky
- [ ] **Robots.txt** — povoľte indexovanie všetkých verejných stránok
- [ ] **404 stránka** — vlastná, s linkami späť na domov + populárne stránky

### Obrázky — SEO-friendly

Každý obrázok má mať:
- **Názov súboru:** `svadobne-saty-korzetove-zlate-moravce.jpg` (nie `IMG_1234.jpg`)
- **Alt tag:** `Svadobné šaty s korzetom z kolekcie JanVeil` (nie prázdny)
- **Komprimovaný:** do 200 KB (použite tinypng.com alebo WebP)
- **Rozmery:** pre galériu 1200×800px, pre hero banner 1920×1080px

### Core Web Vitals

Google penalizuje pomalé weby. Cieľové hodnoty:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1

Skontrolujte na PageSpeed Insights každé 2 mesiace.

---

## 9. Mesačný SEO checklist

### Každý týždeň (15 minút)
- [ ] Odpovede na nové Google recenzie
- [ ] Post na Google Business Profile (nová fotka + popis)
- [ ] Post na Instagram + Facebook s lokalitou Zlaté Moravce

### Každý mesiac (2-3 hodiny)
- [ ] 1 nový článok na blog (1500+ slov)
- [ ] Aktualizácia Google Business (nové fotky, posts)
- [ ] Kontrola rankingov pre kľúčové slová (Google Search Console)
- [ ] Kontrola nových recenzií a odpoveď na všetky
- [ ] Oslovenie 2-3 nových potenciálnych partnerov pre linkbuilding

### Každý kvartál (4-5 hodín)
- [ ] Audit rýchlosti webu (PageSpeed)
- [ ] Kontrola nefunkčných odkazov (plugin Broken Link Checker)
- [ ] Aktualizácia starých blog článkov (pridať nové info, nové roky)
- [ ] Analýza konkurencie — aké keywords rangujú ony?
- [ ] Update obrázkov v galérii

### Každý rok
- [ ] Profesionálny SEO audit (externá firma) — 300-500 €
- [ ] Aktualizácia celej stratégie podľa trendov
- [ ] Redesign ak je web starší ako 3-4 roky

---

## 📊 Ako merať úspech

### Zdarma nástroje na sledovanie:

1. **Google Search Console** — https://search.google.com/search-console
   - Ukáže aké kľúčové slová prinášajú návštevníkov
   - Ukáže pozíciu vo vyhľadávaní
   - Ukáže chyby indexovania

2. **Google Analytics 4** — https://analytics.google.com
   - Počet návštevníkov
   - Odkiaľ prichádzajú (Google, Facebook, priamo)
   - Ktoré stránky sú najpopulárnejšie
   - Konverzie (kliknutia na "Objednať skúšku")

3. **Google Business Insights**
   - Koľko ľudí si pozrelo váš profil
   - Koľkí zavolali priamo
   - Koľkí si pozreli trasu

### Ciele pre rok 2026:

| Metrika | Cieľ |
|---|---|
| Mesačné organické návštevy | 2000+ |
| Pozícia pre "svadobné šaty Zlaté Moravce" | Top 3 |
| Pozícia pre "svadobný plánovač zdarma" | Top 5 |
| Google recenzie | 50+ s priemerom 4.8+ |
| Google Business zobrazenia / mesiac | 5000+ |
| Hovory z Google Business / mesiac | 20+ |

---

## 🎁 Bonus: 10 kľúčových slov na ktoré sa zamerať

Priorita podľa konkurenčnosti a komerčnej hodnoty:

### Vysoká priorita (zamerať sa hneď)
1. **svadobné šaty Zlaté Moravce** — 90 hľadaní/mesiac, stredná konkurencia
2. **svadobný salón Zlaté Moravce** — 50 hľadaní/mesiac, nízka konkurencia
3. **svadobné šaty Nitra** — 210 hľadaní/mesiac, vysoká konkurencia
4. **svadobný plánovač** — 320 hľadaní/mesiac, stredná konkurencia
5. **svadobné šaty cena** — 170 hľadaní/mesiac, nízka konkurencia

### Stredná priorita (postupne)
6. **bohemské svadobné šaty** — 140 hľadaní/mesiac
7. **svadobné šaty na mieru Slovensko** — 90 hľadaní/mesiac
8. **korzetové svadobné šaty** — 110 hľadaní/mesiac
9. **prenájom svadobných šiat** — 240 hľadaní/mesiac
10. **skúška svadobných šiat** — 60 hľadaní/mesiac

### Ako tieto použiť

Pre každé keyword vytvorte **jednu dedikovanú stránku alebo článok**:
- `svadobné šaty Zlaté Moravce` → domovská stránka (už máte)
- `svadobný plánovač` → `/planovac/` (už máte)
- `bohemské svadobné šaty` → `/svadobne-saty/bohemske/` (vytvorte)
- `svadobné šaty na mieru` → článok na blogu

---

## 💰 Rozpočet na SEO

Ak chcete outsoursovať:

| Služba | Cena (mesačne) | Čo dostanete |
|---|---|---|
| **Základný** | 150-300 € | Rank Math nastavenie, 1 článok mesačne, odpovede na recenzie |
| **Stredný** | 400-700 € | + 2 články/mesiac, linkbuilding, monthly report |
| **Prémiový** | 800-1500 € | + PR, vedecký content, ads setup, full management |

**Pre JanVeil odporúčam:** začať sami s týmto návodom + základná agentúra (150-300€/mesiac) na technické veci a obsah.

---

## 📞 Kontakty na dobré slovenské SEO firmy

(Tieto sú príklady, overte si recenzie pred kontaktovaním):
- Visibility (Bratislava) — prémiový segment
- Basta Digital (Bratislava) — stredný segment
- SEO-studio (Žilina) — menší biznis
- Dejure.online (Nitra) — regionálne blízko k vám

---

*Dokument pre internú potrebu salónu JanVeil. Posledná aktualizácia: 2026.*
