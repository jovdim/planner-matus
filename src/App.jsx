import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Check, Plus, Trash2, Calendar, Wallet, Users, Armchair, Home, ChevronRight, ChevronLeft, Download, Upload, Heart, X, Edit2, ChevronDown, Circle, Square, Baby, User, UtensilsCrossed, AlertCircle, Music, Martini, DoorOpen, LogOut, Cake, Camera, Flower2, Candy, Lightbulb, UtensilsCrossed as Buffet, Layers, Move, RotateCw, Maximize2, FileText, FileSpreadsheet, Search, Copy, Moon, Sun, Mail, Clock, BookOpen, FileCheck, Share2, Undo2, Sparkles as SparklesIcon, ArrowRight, ImageIcon, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState('home');
  const [weddingDate, setWeddingDate] = useState('');
  const [coupleName, setCoupleName] = useState('');

  // === NOVÉ STATE v1.1 ===
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [diary, setDiary] = useState(''); // denník/poznámky nevesty

  const [timeline, setTimeline] = useState([
    { id: 1, time: '08:00', event: 'Prichádza kaderníčka a vizážistka', notes: '' },
    { id: 2, time: '10:00', event: 'Fotky nevesty a príprav', notes: '' },
    { id: 3, time: '12:30', event: 'Odchod na obrad', notes: '' },
    { id: 4, time: '13:00', event: 'Obrad', notes: '' },
    { id: 5, time: '14:30', event: 'Hostina - príchod hostí', notes: '' },
    { id: 6, time: '15:00', event: 'Obed / Prvý chod', notes: '' },
    { id: 7, time: '17:00', event: 'Prvý tanec novomanželov', notes: '' },
    { id: 8, time: '19:00', event: 'Krájanie torty', notes: '' },
    { id: 9, time: '21:00', event: 'Odhadzovanie kytice', notes: '' },
    { id: 10, time: '00:00', event: 'Polnočné prekvapenie', notes: '' },
  ]);
  const [newTimelineEvent, setNewTimelineEvent] = useState({ time: '', event: '', notes: '' });
  const [documents, setDocuments] = useState([
    { id: 1, task: 'Občiansky preukaz (oboch snúbencov)', done: false },
    { id: 2, task: 'Rodný list (originál, nie starší ako 3 mesiace)', done: false },
    { id: 3, task: 'Žiadosť o uzavretie manželstva (matrika)', done: false },
    { id: 4, task: 'Doklad o štátnom občianstve (ak treba)', done: false },
    { id: 5, task: 'Potvrdenie o spôsobilosti uzavrieť manželstvo (cudzinec)', done: false },
    { id: 6, task: 'Úmrtný list bývalého manžela/ky (ak vdova/vdovec)', done: false },
    { id: 7, task: 'Právoplatný rozsudok o rozvode (ak rozvedení)', done: false },
    { id: 8, task: 'Po svadbe: vybaviť nový občiansky s novým priezviskom', done: false },
    { id: 9, task: 'Po svadbe: nový cestovný pas', done: false },
    { id: 10, task: 'Po svadbe: oznámiť zmenu priezviska zamestnávateľovi', done: false },
    { id: 11, task: 'Po svadbe: zmena v banke (účet, karty)', done: false },
    { id: 12, task: 'Po svadbe: zmena u poisťovní (zdravotná, životná, auto)', done: false },
    { id: 13, task: 'Po svadbe: zmena na daňovom úrade', done: false },
    { id: 14, task: 'Po svadbe: zmena na sociálnej poisťovni', done: false },
    { id: 15, task: 'Po svadbe: zmena v katastri (ak vlastníte nehnuteľnosť)', done: false },
  ]);
  const [newDocument, setNewDocument] = useState('');

  // Search & filter hostia
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('all'); // all | confirmed | pending | rejected | children | allergies
  const [selectedGuests, setSelectedGuests] = useState([]); // pre bulk actions
  const [bulkFamilyName, setBulkFamilyName] = useState('');
  const [bulkFamilyCount, setBulkFamilyCount] = useState(4);

  // Share link modal
  const [showShareLink, setShowShareLink] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // Undo history
  const [undoStack, setUndoStack] = useState([]);
  const [showUndoToast, setShowUndoToast] = useState(null);

  // Quiz / Style finder
  const [showStyleQuiz, setShowStyleQuiz] = useState(false);

  // Scroll to top when switching modules
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeModule]);

  // Load theme preference
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.__janveil_theme : null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') window.__janveil_theme = theme;
  }, [theme]);

  const defaultChecklist = [
    { phase: '12+ mesiacov pred', task: 'Stanoviť termín svadby' },
    { phase: '12+ mesiacov pred', task: 'Informovať o termíne najbližšiu rodinu a priateľov' },
    { phase: '12+ mesiacov pred', task: 'Stanoviť predbežný rozpočet svadby' },
    { phase: '12+ mesiacov pred', task: 'Stanoviť predbežný počet hostí' },
    { phase: '12+ mesiacov pred', task: 'Vytvoriť predbežný zoznam hostí' },
    { phase: '12+ mesiacov pred', task: 'Vybrať štýl a farebnosť svadby' },
    { phase: '12+ mesiacov pred', task: 'Urobiť prieskum svadobných štýlov' },
    { phase: '12+ mesiacov pred', task: 'Naplánovať predbežný program svadby' },
    { phase: '12+ mesiacov pred', task: 'Prieskum miest na svadobnú hostinu' },
    { phase: '12+ mesiacov pred', task: 'Návšteva priestorov hostiny, stretnutie so zodpovednou osobou' },
    { phase: '12+ mesiacov pred', task: 'Rezervácia priestorov hostiny' },
    { phase: '12+ mesiacov pred', task: 'Vybrať miesto obradu (civilný / cirkevný)' },
    { phase: '12+ mesiacov pred', task: 'Nahlásiť termín a čas obradu na matrike' },
    { phase: '12+ mesiacov pred', task: 'Stretnutie s kňazom (cirkevný sobáš)' },
    { phase: '12+ mesiacov pred', task: 'Dohodnúť termín a čas obradu' },
    { phase: '9-12 mesiacov pred', task: 'Prieskum ponuky svadobných salónov' },
    { phase: '9-12 mesiacov pred', task: 'Vybrať štýl a typ svadobných šiat' },
    { phase: '9-12 mesiacov pred', task: 'Dohodnúť termín skúšky šiat (JanVeil ♡)' },
    { phase: '9-12 mesiacov pred', task: 'Rezervovať svadobné šaty a závoj' },
    { phase: '9-12 mesiacov pred', task: 'Prieskum fotografov' },
    { phase: '9-12 mesiacov pred', task: 'Rezervovať fotografa' },
    { phase: '9-12 mesiacov pred', task: 'Prieskum kameramanov' },
    { phase: '9-12 mesiacov pred', task: 'Rezervovať kameramana' },
    { phase: '9-12 mesiacov pred', task: 'Vybrať svedkov' },
    { phase: '9-12 mesiacov pred', task: 'Vybrať družičky' },
    { phase: '9-12 mesiacov pred', task: 'Vybrať štýl svadobného obleku' },
    { phase: '9-12 mesiacov pred', task: 'Preveriť možnosti ubytovania pre hostí' },
    { phase: '9-12 mesiacov pred', task: 'Rezervovať ubytovanie' },
    { phase: '9-12 mesiacov pred', task: 'Preveriť podmienky sobáša (formálne náležitosti)' },
    { phase: '9-12 mesiacov pred', task: 'Podať žiadosť o uzavretie manželstva (matrika)' },
    { phase: '9-12 mesiacov pred', task: 'Naplánovať predmanželskú náuku (cirkevný sobáš)' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum DJ-ov / živých kapiel' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať DJ-ja' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať živú kapelu (ak áno)' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum možností hudby na obrade' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať organistu / speváka / zbor na obrad' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum starejších / moderátorov' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať starejšieho / moderátora' },
    { phase: '6-9 mesiacov pred', task: 'Kúpiť / dať ušiť svadobný oblek' },
    { phase: '6-9 mesiacov pred', task: 'Kúpiť košeľu a doplnky k obleku (kravata, motýlik)' },
    { phase: '6-9 mesiacov pred', task: 'Kúpiť topánky k obleku' },
    { phase: '6-9 mesiacov pred', task: 'Vybrať obrúčky' },
    { phase: '6-9 mesiacov pred', task: 'Objednať obrúčky' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum kaderníčok' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať kaderníčku' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum vizážistiek' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať vizážistku' },
    { phase: '6-9 mesiacov pred', task: 'Vybrať spôsob odobierky / čepčenia (tradičná svadba)' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať súbor na odobierku/odčepčenie' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum cukrárov / pekární' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať termín na výrobu torty' },
    { phase: '6-9 mesiacov pred', task: 'Prieskum kvetinárstiev / dizajnérov výzdoby' },
    { phase: '6-9 mesiacov pred', task: 'Rezervácia termínu - kytica a výzdoba' },
    { phase: '3-6 mesiacov pred', task: 'Kúpiť doplnky k šatám (pančuchy, kabelka, šperky)' },
    { phase: '3-6 mesiacov pred', task: 'Kúpiť svadobné topánky' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať štýl a farbu šiat pre družičky' },
    { phase: '3-6 mesiacov pred', task: 'Kúpiť / dohodnúť šaty pre družičky' },
    { phase: '3-6 mesiacov pred', task: 'Finálny zoznam pozvaných hostí' },
    { phase: '3-6 mesiacov pred', task: 'Výber oznámení a pozvánok' },
    { phase: '3-6 mesiacov pred', task: 'Dodať podklady na tvorbu oznámení (texty, fotky)' },
    { phase: '3-6 mesiacov pred', task: 'Objednať oznámenia a pozvánky' },
    { phase: '3-6 mesiacov pred', task: 'Poslať oznámenia a pozvánky' },
    { phase: '3-6 mesiacov pred', task: 'Zistiť špeciálne diéty pozvaných hostí' },
    { phase: '3-6 mesiacov pred', task: 'Vytvoriť zoznam hostí na ubytovanie' },
    { phase: '3-6 mesiacov pred', task: 'Dohodnúť stretnutie so zodpovednou osobou v priestoroch' },
    { phase: '3-6 mesiacov pred', task: 'Zistiť možnosti uloženia stolov (pre zasadací poriadok)' },
    { phase: '3-6 mesiacov pred', task: 'Dohodnúť výzdobu a časový harmonogram' },
    { phase: '3-6 mesiacov pred', task: 'Dohodnúť catering a podávanie nápojov' },
    { phase: '3-6 mesiacov pred', task: 'Naplánovať ochutnávku svadobného menu (degustácia)' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať svadobné menu / detské menu / špeciálne diéty' },
    { phase: '3-6 mesiacov pred', task: 'Dohodnúť časový harmonogram podávania chodov' },
    { phase: '3-6 mesiacov pred', task: 'Možnosti zábavy pre deti, detský kútik' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať typ svadobnej torty' },
    { phase: '3-6 mesiacov pred', task: 'Objednať svadobnú tortu' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať kyticu' },
    { phase: '3-6 mesiacov pred', task: 'Objednať kyticu' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať štýl a farby svadobnej výzdoby' },
    { phase: '3-6 mesiacov pred', task: 'Dohodnúť výzdobu a osvetlenie' },
    { phase: '3-6 mesiacov pred', task: 'Výber a rezervácia svadobného auta' },
    { phase: '3-6 mesiacov pred', task: 'Objednať výzdobu na auto' },
    { phase: '3-6 mesiacov pred', task: 'Zabezpečiť dopravu (od obradu na miesto hostiny)' },
    { phase: '3-6 mesiacov pred', task: 'Zabezpečiť dopravu pre ubytovaných hostí' },
    { phase: '3-6 mesiacov pred', task: 'Objednať tanečný kurz' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať pieseň na svadobný tanec' },
    { phase: '3-6 mesiacov pred', task: 'Prieskum svadobných hier a súťaží' },
    { phase: '3-6 mesiacov pred', task: 'Naplánovať zábavné aktivity' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať termín rozlúčky so slobodou' },
    { phase: '3-6 mesiacov pred', task: 'Navštíviť cestovné agentúry (svadobná cesta)' },
    { phase: '3-6 mesiacov pred', task: 'Objednať svadobnú cestu' },
    { phase: '1-3 mesiace pred', task: 'Finálna skúška svadobných šiat' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť popolnočné oblečenie pre nevestu aj ženícha' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť doplnky a topánky k popolnočným šatám' },
    { phase: '1-3 mesiace pred', task: 'Pripraviť zasadací poriadok' },
    { phase: '1-3 mesiace pred', task: 'Potvrdiť účasť hostí (RSVP)' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť darčeky pre hostí' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť darček pre družičky' },
    { phase: '1-3 mesiace pred', task: 'Pripraviť poďakovanie pre rodičov' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť / vyrobiť dary pre rodičov' },
    { phase: '1-3 mesiace pred', task: 'Vytvoriť zoznam alkoholu (podľa hostí)' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť víno a pivo' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť tvrdý alkohol / domáci alkohol' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť nealkoholické nápoje' },
    { phase: '1-3 mesiace pred', task: 'Vyrobiť / objednať vlastné etikety na alkohol' },
    { phase: '1-3 mesiace pred', task: 'Objednať zákusky' },
    { phase: '1-3 mesiace pred', task: 'Objednať slané občerstvenie (pagáče, chlebíčky)' },
    { phase: '1-3 mesiace pred', task: 'Objednať Candy bar' },
    { phase: '1-3 mesiace pred', task: 'Objednať kartóny na výslužky' },
    { phase: '1-3 mesiace pred', task: 'Vybrať náramky pre družičky, košík pre malú družičku' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť svadobné doplnky (kniha hostí, vankúšik na obrúčky, konfety)' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť doplnky (poháre, podbradníky, bublifuky, balóny)' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť krabičku/truhlicu na peniaze a dary' },
    { phase: '1-3 mesiace pred', task: 'Naplánovať spôsob rozdávania darčekov' },
    { phase: '1-3 mesiace pred', task: 'Skrášľovacie procedúry (solárium, vlasové kúry, pleť)' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť doklady na vycestovanie (svadobná cesta)' },
    { phase: '1-3 mesiace pred', task: 'Objednať fotostenu a rekvizity na fotenie' },
    { phase: '1-3 mesiace pred', task: 'Naplánovať posedenie na večer pred svadbou' },
    { phase: '2-4 týždne pred', task: 'Rozpis svadobného dňa (podrobný časový harmonogram)' },
    { phase: '2-4 týždne pred', task: 'Vytvoriť a objednať menovky' },
    { phase: '2-4 týždne pred', task: 'Finálny zoznam pre ubytovanie' },
    { phase: '2-4 týždne pred', task: 'Definitívny zoznam hostí (oznámiť prevádzkarovi)' },
    { phase: '2-4 týždne pred', task: 'Konečný program svadby a časový harmonogram' },
    { phase: '2-4 týždne pred', task: 'Vytlačiť program svadby (pre družičky)' },
    { phase: '2-4 týždne pred', task: 'Platby dodávateľom' },
    { phase: '2-4 týždne pred', task: 'Oznámiť hosťom presné inštrukcie' },
    { phase: '2-4 týždne pred', task: 'Oznámiť ubytovaným hosťom adresy a časy' },
    { phase: '2-4 týždne pred', task: 'Oznámiť pokyny svedkom' },
    { phase: '2-4 týždne pred', task: 'Zadeliť presné úlohy družičkám' },
    { phase: '2-4 týždne pred', task: 'Zadeliť presné úlohy rodičom' },
    { phase: '2-4 týždne pred', task: 'Rozlúčka so slobodou' },
    { phase: '1-2 týždne pred', task: 'Skúška svadobného účesu' },
    { phase: '1-2 týždne pred', task: 'Skúška svadobného makeupu' },
    { phase: '1-2 týždne pred', task: 'Poslať zoznam skladieb DJ / kapele' },
    { phase: '1-2 týždne pred', task: 'Spoveď (cirkevný sobáš)' },
    { phase: '1-2 týždne pred', task: 'Skontrolovať doklady' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - fotograf, kameraman' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - priestory a ubytovanie' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - DJ, hudba obrad, hudba hostina' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - svadobné šaty (JanVeil ♡)' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - kostol / matrika' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - kvety a výzdoba' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - kaderníčka, vizážistka' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - starejší, odobierka / čepčenie' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - torty, zákusky, občerstvenie, catering' },
    { phase: '1-2 týždne pred', task: 'Preveriť rezerváciu - doprava, svadobné auto' },
    { phase: '1 týždeň pred', task: 'Svadobná manikúra a pedikúra' },
    { phase: '1 týždeň pred', task: 'Skúška svadobných šiat (finálna)' },
    { phase: '1 týždeň pred', task: 'Zabezpečiť uskladnenie a vychladenie nápojov' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť šaty' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť zákusky' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť torty' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť občerstvenie' },
    { phase: '1-2 dni pred', task: 'Vychladiť alkohol' },
    { phase: '1-2 dni pred', task: 'Pripraviť výslužky' },
    { phase: '1-2 dni pred', task: 'Pripraviť dary pre hostí' },
    { phase: '1-2 dni pred', task: 'Vyzdobiť priestory' },
    { phase: '1-2 dni pred', task: 'Vyzdobiť auto' },
    { phase: '1-2 dni pred', task: 'Výzdoba domu / bytu (interiér, exteriér)' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť kyticu, kvety do vlasov, pierka' },
    { phase: '1-2 dni pred', task: 'Zaniesť všetky veci na miesto konania' },
    { phase: '1-2 dni pred', task: 'Nachystať oblečenie pre nevestu' },
    { phase: '1-2 dni pred', task: 'Nachystať oblečenie pre ženícha' },
    { phase: '1-2 dni pred', task: 'Nachystať popolnočné oblečenie pre nevestu aj ženícha' },
    { phase: '1-2 dni pred', task: 'Pripraviť "veci so sebou" — drogéria (deodorant, lak, parfém)' },
    { phase: '1-2 dni pred', task: 'Pripraviť líčidlá' },
    { phase: '1-2 dni pred', task: 'Pripraviť harmonogram s programom' },
    { phase: '1-2 dni pred', task: 'Pripraviť náhradné topánky' },
    { phase: '1-2 dni pred', task: 'Pripraviť šitie (núdzový set)' },
    { phase: 'Deň D', task: 'Užiť si najkrajší deň života ♡' },
  ].map((t, i) => ({ id: i + 1, ...t, done: false }));

  const [checklist, setChecklist] = useState(defaultChecklist);
  const [newTask, setNewTask] = useState({ phase: '3-6 mesiacov pred', task: '' });
  const [openPhase, setOpenPhase] = useState(null);

  const [budgetTotal, setBudgetTotal] = useState(0);
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Miesto a catering', planned: 0, spent: 0 },
    { id: 2, category: 'Svadobné šaty a oblek', planned: 0, spent: 0 },
    { id: 3, category: 'Fotograf a kameraman', planned: 0, spent: 0 },
    { id: 4, category: 'Hudba a zábava', planned: 0, spent: 0 },
    { id: 5, category: 'Kvety a výzdoba', planned: 0, spent: 0 },
    { id: 6, category: 'Snubné prstene', planned: 0, spent: 0 },
    { id: 7, category: 'Torta a sladkosti', planned: 0, spent: 0 },
    { id: 8, category: 'Oznámenia a pozvánky', planned: 0, spent: 0 },
  ]);
  const [newExpense, setNewExpense] = useState({ category: '', planned: '', spent: '' });

  const emptyGuest = { name: '', side: 'Nevesta', rsvp: 'Čaká sa', type: 'Dospelý', meal: 'Celá porcia', highChair: false, allergies: '' };
  const [guests, setGuests] = useState([]);
  const [editingGuest, setEditingGuest] = useState(null);
  const [newGuest, setNewGuest] = useState(emptyGuest);

  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ name: '', shape: 'Okrúhly', capacity: 8 });
  const [sceneElements, setSceneElements] = useState([]);
  const [seatingView, setSeatingView] = useState('map');
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Undo helper — uloží snapshot a zobrazí toast
  const pushUndo = (label, restoreFn) => {
    setUndoStack(prev => [...prev.slice(-19), { label, restoreFn, timestamp: Date.now() }]);
    setShowUndoToast({ label, timestamp: Date.now() });
    setTimeout(() => {
      setShowUndoToast(prev => (prev && Date.now() - prev.timestamp >= 4900) ? null : prev);
    }, 5000);
  };
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    last.restoreFn();
    setUndoStack(prev => prev.slice(0, -1));
    setShowUndoToast(null);
  };

  const toggleTask = (id) => setChecklist(checklist.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = () => {
    if (!newTask.task.trim()) return;
    setChecklist([...checklist, { id: Date.now(), phase: newTask.phase, task: newTask.task, done: false }]);
    setNewTask({ phase: newTask.phase, task: '' });
  };
  const removeTask = (id) => {
    const task = checklist.find(t => t.id === id);
    if (!task) return;
    const snapshot = [...checklist];
    setChecklist(checklist.filter(t => t.id !== id));
    pushUndo(`Úloha "${task.task.substring(0, 40)}${task.task.length > 40 ? '…' : ''}" zmazaná`, () => setChecklist(snapshot));
  };

  const addExpense = () => {
    if (!newExpense.category.trim()) return;
    setExpenses([...expenses, { id: Date.now(), category: newExpense.category, planned: Number(newExpense.planned) || 0, spent: Number(newExpense.spent) || 0 }]);
    setNewExpense({ category: '', planned: '', spent: '' });
  };
  const updateExpense = (id, field, value) => setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: field === 'category' ? value : Number(value) || 0 } : e));
  const removeExpense = (id) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    const snapshot = [...expenses];
    setExpenses(expenses.filter(e => e.id !== id));
    pushUndo(`Kategória "${expense.category}" zmazaná`, () => setExpenses(snapshot));
  };

  const addGuest = () => { if (!newGuest.name.trim()) return; setGuests([...guests, { id: Date.now(), ...newGuest }]); setNewGuest(emptyGuest); };
  const removeGuest = (id) => {
    const guest = guests.find(g => g.id === id);
    if (!guest) return;
    const guestSnap = [...guests];
    const tableSnap = tables.map(t => ({ ...t, seats: [...t.seats] }));
    setGuests(guests.filter(g => g.id !== id));
    setTables(tables.map(t => ({ ...t, seats: t.seats.filter(s => s !== id) })));
    pushUndo(`Hosť "${guest.name}" zmazaný`, () => { setGuests(guestSnap); setTables(tableSnap); });
  };

  // === BULK ACTIONS ===
  const toggleGuestSelection = (id) => {
    setSelectedGuests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const selectAllGuests = (filteredList) => {
    const ids = filteredList.map(g => g.id);
    setSelectedGuests(prev => prev.length === ids.length ? [] : ids);
  };
  const bulkRemoveGuests = () => {
    if (selectedGuests.length === 0) return;
    if (!window.confirm(`Naozaj zmazať ${selectedGuests.length} ${selectedGuests.length === 1 ? 'hosťa' : 'hostí'}?`)) return;
    const guestSnap = [...guests];
    const tableSnap = tables.map(t => ({ ...t, seats: [...t.seats] }));
    setGuests(guests.filter(g => !selectedGuests.includes(g.id)));
    setTables(tables.map(t => ({ ...t, seats: t.seats.filter(s => !selectedGuests.includes(s)) })));
    pushUndo(`${selectedGuests.length} ${selectedGuests.length === 1 ? 'hosť' : 'hostí'} zmazaných`, () => { setGuests(guestSnap); setTables(tableSnap); });
    setSelectedGuests([]);
  };
  const bulkUpdateRsvp = (rsvp) => {
    if (selectedGuests.length === 0) return;
    setGuests(guests.map(g => selectedGuests.includes(g.id) ? { ...g, rsvp } : g));
    setSelectedGuests([]);
  };
  const bulkAssignToTable = (tableId) => {
    if (selectedGuests.length === 0) return;
    const target = tables.find(t => t.id === tableId);
    if (!target) return;
    const available = target.capacity - target.seats.length;
    const toAssign = selectedGuests.slice(0, available);
    if (toAssign.length < selectedGuests.length) {
      alert(`Stôl má len ${available} voľných miest. Priradím prvých ${toAssign.length} hostí.`);
    }
    setTables(tables.map(t => ({
      ...t,
      seats: t.id === tableId
        ? [...new Set([...t.seats, ...toAssign])]
        : t.seats.filter(s => !toAssign.includes(s)),
    })));
    setSelectedGuests([]);
  };
  const addFamilyGuests = () => {
    if (!bulkFamilyName.trim() || bulkFamilyCount < 1) return;
    const newOnes = Array.from({ length: Math.min(bulkFamilyCount, 12) }, (_, i) => ({
      id: Date.now() + i,
      name: `${bulkFamilyName} `,
      side: 'Nevesta',
      rsvp: 'Čaká sa',
      type: 'Dospelý',
      meal: 'Celá porcia',
      highChair: false,
      allergies: '',
    }));
    setGuests([...guests, ...newOnes]);
    setBulkFamilyName('');
    setBulkFamilyCount(4);
  };

  const addTable = () => {
    if (!newTable.name.trim()) return;
    const count = tables.length;
    const cols = 3;
    const col = count % cols;
    const row = Math.floor(count / cols);
    const x = 80 + col * 240;
    const y = 80 + row * 240;
    setTables([...tables, { id: Date.now(), name: newTable.name, shape: newTable.shape, capacity: Number(newTable.capacity) || 8, seats: [], x, y }]);
    setNewTable({ name: '', shape: 'Okrúhly', capacity: 8 });
  };
  const removeTable = (id) => {
    const table = tables.find(t => t.id === id);
    if (!table) return;
    const snapshot = tables.map(t => ({ ...t, seats: [...t.seats] }));
    setTables(tables.filter(t => t.id !== id));
    pushUndo(`Stôl "${table.name}" zmazaný`, () => setTables(snapshot));
  };
  const updateTablePosition = (id, x, y) => setTables(tables.map(t => t.id === id ? { ...t, x, y } : t));

  const assignGuestToTable = (guestId, tableId) => {
    const target = tables.find(t => t.id === tableId);
    if (target && target.seats.length >= target.capacity) { alert('Stôl je plný. Zvýšte kapacitu alebo zvoľte iný stôl.'); return; }
    setTables(tables.map(t => ({ ...t, seats: t.id === tableId ? (t.seats.includes(guestId) ? t.seats : [...t.seats, guestId]) : t.seats.filter(s => s !== guestId) })));
  };
  const unassignGuest = (guestId) => setTables(tables.map(t => ({ ...t, seats: t.seats.filter(s => s !== guestId) })));

  const addSceneElement = (type) => {
    const count = sceneElements.length;
    setSceneElements([...sceneElements, {
      id: Date.now(),
      type,
      x: 80 + (count * 40) % 500,
      y: 560 + (count * 30) % 140,
      scale: 1,
      rotation: 0,
    }]);
  };
  const removeSceneElement = (id) => setSceneElements(sceneElements.filter(e => e.id !== id));
  const updateScenePosition = (id, x, y) => setSceneElements(sceneElements.map(e => e.id === id ? { ...e, x, y } : e));
  const updateSceneScale = (id, scale) => setSceneElements(sceneElements.map(e => e.id === id ? { ...e, scale } : e));
  const updateSceneRotation = (id, rotation) => setSceneElements(sceneElements.map(e => e.id === id ? { ...e, rotation } : e));

  // === TIMELINE akcie ===
  const addTimelineEvent = () => {
    if (!newTimelineEvent.time || !newTimelineEvent.event.trim()) return;
    setTimeline([...timeline, { id: Date.now(), ...newTimelineEvent }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTimelineEvent({ time: '', event: '', notes: '' });
  };
  const removeTimelineEvent = (id) => {
    const ev = timeline.find(t => t.id === id);
    if (!ev) return;
    const snap = [...timeline];
    setTimeline(timeline.filter(t => t.id !== id));
    pushUndo(`Udalosť "${ev.event}" zmazaná`, () => setTimeline(snap));
  };
  const updateTimelineEvent = (id, field, value) => {
    setTimeline(timeline.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // === DOCUMENTS akcie ===
  const toggleDocument = (id) => setDocuments(documents.map(d => d.id === id ? { ...d, done: !d.done } : d));
  const addDocument = () => {
    if (!newDocument.trim()) return;
    setDocuments([...documents, { id: Date.now(), task: newDocument, done: false }]);
    setNewDocument('');
  };
  const removeDocument = (id) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    const snap = [...documents];
    setDocuments(documents.filter(d => d.id !== id));
    pushUndo(`"${doc.task.substring(0, 40)}${doc.task.length > 40 ? '…' : ''}" zmazané`, () => setDocuments(snap));
  };

  // === SHARE LINK — enkóduje všetky dáta do URL hash ===
  const generateShareLink = () => {
    const data = { coupleName, weddingDate, checklist, expenses, budgetTotal, guests, tables, sceneElements, timeline, documents, diary };
    try {
      const json = JSON.stringify(data);
      // UTF-8 safe base64
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://janveil.sk/planovac/';
      const link = `${baseUrl}#share=${encoded}`;
      setShareLink(link);
      setShowShareLink(true);
    } catch (err) {
      alert('Zdieľanie sa nepodarilo vytvoriť. Skúste skôr Excel / PDF export.');
    }
  };

  // === Load shared link on mount ===
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.substring(7).replace(/-/g, '+').replace(/_/g, '/');
        const pad = encoded.length % 4 ? '='.repeat(4 - (encoded.length % 4)) : '';
        const binary = atob(encoded + pad);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const json = new TextDecoder().decode(bytes);
        const data = JSON.parse(json);
        if (data.coupleName !== undefined) setCoupleName(data.coupleName);
        if (data.weddingDate !== undefined) setWeddingDate(data.weddingDate);
        if (data.checklist) setChecklist(data.checklist);
        if (data.expenses) setExpenses(data.expenses);
        if (data.budgetTotal !== undefined) setBudgetTotal(data.budgetTotal);
        if (data.guests) setGuests(data.guests);
        if (data.tables) setTables(data.tables);
        if (data.sceneElements) setSceneElements(data.sceneElements);
        if (data.timeline) setTimeline(data.timeline);
        if (data.documents) setDocuments(data.documents);
        if (data.diary) setDiary(data.diary);
        
      } catch (err) {
        console.warn('Share link corrupted:', err);
      }
    }
  }, []);

  const getExportJson = () => {
    const data = { coupleName, weddingDate, checklist, expenses, budgetTotal, guests, tables, sceneElements, timeline, documents, diary };
    return JSON.stringify(data, null, 2);
  };

  // ====== EXCEL EXPORT ======
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const today = new Date().toISOString().split('T')[0];
      const title = coupleName ? `Svadba ${coupleName}` : 'Môj svadobný plánovač';

      // === Sheet 1: Prehľad ===
      const overview = [
        ['JANVEIL — SVADOBNÝ PLÁNOVAČ'],
        [],
        ['Mladomanželia', coupleName || '—'],
        ['Dátum svadby', weddingDate ? new Date(weddingDate).toLocaleDateString('sk-SK') : '—'],
        ['Dní do svadby', daysUntil !== null && daysUntil >= 0 ? daysUntil : '—'],
        [],
        ['ŠTATISTIKY'],
        ['Splnené úlohy', `${completedTasks} / ${checklist.length} (${completedPct}%)`],
        ['Celkový rozpočet', `${budgetTotal.toLocaleString('sk-SK')} €`],
        ['Naplánované', `${totalPlanned.toLocaleString('sk-SK')} €`],
        ['Minuté', `${totalSpent.toLocaleString('sk-SK')} €`],
        ['Počet hostí celkom', guests.length],
        ['Potvrdení hostia', confirmedGuests],
        ['Počet stolov', tables.length],
        [],
        ['Vygenerované', new Date().toLocaleString('sk-SK')],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(overview);
      ws1['!cols'] = [{ wch: 25 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, ws1, 'Prehľad');

      // === Sheet 2: Úlohy ===
      const tasksData = [['Fáza', 'Úloha', 'Stav']];
      phases.forEach(phase => {
        const items = checklist.filter(t => t.phase === phase);
        items.forEach(t => tasksData.push([phase, t.task, t.done ? '✓ Splnené' : 'Čaká']));
      });
      const ws2 = XLSX.utils.aoa_to_sheet(tasksData);
      ws2['!cols'] = [{ wch: 22 }, { wch: 60 }, { wch: 14 }];
      XLSX.utils.book_append_sheet(wb, ws2, 'Úlohy');

      // === Sheet 3: Rozpočet ===
      const budgetData = [['Kategória', 'Naplánované (€)', 'Minuté (€)', 'Zostatok (€)', 'Využitie (%)']];
      expenses.forEach(e => {
        const remaining = e.planned - e.spent;
        const pct = e.planned ? Math.round((e.spent / e.planned) * 100) : 0;
        budgetData.push([e.category, e.planned, e.spent, remaining, `${pct}%`]);
      });
      budgetData.push([]);
      budgetData.push(['CELKOM', totalPlanned, totalSpent, budgetTotal - totalSpent, `${budgetTotal ? Math.round((totalSpent / budgetTotal) * 100) : 0}%`]);
      budgetData.push(['Celkový rozpočet', budgetTotal]);
      const ws3 = XLSX.utils.aoa_to_sheet(budgetData);
      ws3['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 14 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Rozpočet');

      // === Sheet 4: Hostia ===
      const guestsData = [['Meno', 'Strana', 'Typ', 'Účasť', 'Porcia jedla', 'Detská stolička', 'Alergény / Poznámky', 'Stôl']];
      guests.forEach(g => {
        const tableName = tables.find(t => t.seats.includes(g.id))?.name || '—';
        guestsData.push([
          g.name,
          g.side,
          g.type,
          g.rsvp,
          g.meal,
          g.highChair ? 'Áno' : '',
          g.allergies || '',
          tableName,
        ]);
      });
      const ws4 = XLSX.utils.aoa_to_sheet(guestsData);
      ws4['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 16 }, { wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws4, 'Hostia');

      // === Sheet 5: Pre catering ===
      const cateringData = [
        ['SÚHRN PRE CATERING — Potvrdení hostia'],
        [],
        ['Celá porcia', mealCounts['Celá porcia'] || 0],
        ['Polovičná porcia', mealCounts['Polovičná porcia'] || 0],
        ['Bez jedla', mealCounts['Bez jedla'] || 0],
        [],
        ['Dospelí (potvrdení)', guests.filter(g => g.rsvp === 'Potvrdená' && g.type === 'Dospelý').length],
        ['Deti (potvrdené)', guests.filter(g => g.rsvp === 'Potvrdená' && g.type === 'Dieťa').length],
        ['Detské stoličky potrebné', guests.filter(g => g.highChair && g.rsvp === 'Potvrdená').length],
        [],
        ['ALERGÉNY A ŠPECIÁLNE DIÉTY'],
      ];
      guests.filter(g => g.allergies).forEach(g => cateringData.push([g.name, g.allergies]));
      const ws5 = XLSX.utils.aoa_to_sheet(cateringData);
      ws5['!cols'] = [{ wch: 30 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, ws5, 'Catering');

      // === Sheet 6: Zasadací poriadok ===
      const seatingData = [['Stôl', 'Tvar', 'Kapacita', 'Obsadené', 'Hostia']];
      tables.forEach(t => {
        const tableGuests = guests.filter(g => t.seats.includes(g.id));
        const names = tableGuests.map(g => g.type === 'Dieťa' ? `${g.name} (dieťa)` : g.name).join(', ');
        seatingData.push([t.name, t.shape, t.capacity, tableGuests.length, names || '—']);
      });
      const ws6 = XLSX.utils.aoa_to_sheet(seatingData);
      ws6['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws6, 'Zasadací poriadok');

      // Download
      XLSX.writeFile(wb, `${title.replace(/[^a-zA-Z0-9]/g, '-')}-${today}.xlsx`);
    } catch (err) {
      alert('Export do Excelu zlyhal. Skúste to znova alebo použite PDF export.');
      console.error(err);
    }
  };

  // ====== PDF EXPORT (via browser print) ======
  const exportToPDF = () => {
    const title = coupleName || 'Svadobný plánovač';
    const weddingDateStr = weddingDate ? new Date(weddingDate).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

    const phaseBlocks = phases.map(phase => {
      const items = checklist.filter(t => t.phase === phase);
      if (items.length === 0) return '';
      const done = items.filter(x => x.done).length;
      const pct = items.length ? Math.round((done / items.length) * 100) : 0;
      const rows = items.map(t => `
        <tr>
          <td style="width: 24px; padding: 6px 4px; vertical-align: top;">
            <span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid #9B7A45; border-radius: 3px; ${t.done ? 'background: #9B7A45;' : ''} text-align: center; line-height: 11px; color: white; font-size: 10px;">${t.done ? '✓' : ''}</span>
          </td>
          <td style="padding: 6px 4px; ${t.done ? 'text-decoration: line-through; color: #999;' : 'color: #1E1910;'}">${escapeHtml(t.task)}</td>
        </tr>
      `).join('');
      return `
        <div style="margin-bottom: 28px; page-break-inside: avoid;">
          <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid #E5DFD3; padding-bottom: 6px; margin-bottom: 8px;">
            <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300; font-size: 18px; color: #1E1910; margin: 0;">${phase}</h3>
            <span style="font-size: 11px; color: #9B7A45; letter-spacing: 0.15em; text-transform: uppercase;">${done}/${items.length} · ${pct}%</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">${rows}</table>
        </div>
      `;
    }).join('');

    const budgetRows = expenses.map(e => {
      const remaining = e.planned - e.spent;
      const over = e.spent > e.planned;
      return `
        <tr style="border-bottom: 1px solid #F0EAD8;">
          <td style="padding: 10px 8px; font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #1E1910;">${escapeHtml(e.category)}</td>
          <td style="padding: 10px 8px; text-align: right; color: #4A3F2E;">${e.planned.toLocaleString('sk-SK')} €</td>
          <td style="padding: 10px 8px; text-align: right; color: ${over ? '#DC2626' : '#1E1910'};">${e.spent.toLocaleString('sk-SK')} €</td>
          <td style="padding: 10px 8px; text-align: right; color: ${over ? '#DC2626' : '#6B5946'}; font-size: 11px;">${remaining >= 0 ? `Zostáva ${remaining.toLocaleString('sk-SK')} €` : `Prekročené o ${Math.abs(remaining).toLocaleString('sk-SK')} €`}</td>
        </tr>
      `;
    }).join('');

    const guestRows = guests.map(g => {
      const tableName = tables.find(t => t.seats.includes(g.id))?.name || '—';
      const badges = [
        `<span style="background: ${g.rsvp === 'Potvrdená' ? '#EBE1CF' : g.rsvp === 'Odmietol' ? '#FEE2E2' : '#F3F4F6'}; color: ${g.rsvp === 'Potvrdená' ? '#9B7A45' : g.rsvp === 'Odmietol' ? '#DC2626' : '#6B7280'}; padding: 2px 8px; border-radius: 999px; font-size: 10px;">${g.rsvp}</span>`,
        `<span style="color: #4A3F2E; font-size: 11px;">${g.meal}</span>`,
        g.highChair ? `<span style="color: #9B7A45; font-size: 11px;">+ Detská stolička</span>` : '',
        g.allergies ? `<span style="color: #B45309; font-size: 11px;">⚠ ${escapeHtml(g.allergies)}</span>` : '',
      ].filter(Boolean).join(' · ');
      return `
        <tr style="border-bottom: 1px solid #F0EAD8;">
          <td style="padding: 10px 8px; font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #1E1910;">${escapeHtml(g.name)} ${g.type === 'Dieťa' ? '<span style="color: #9B7A45; font-size: 10px;">(dieťa)</span>' : ''}</td>
          <td style="padding: 10px 8px; font-size: 11px; color: #6B5946;">${g.side}</td>
          <td style="padding: 10px 8px;">${badges}</td>
          <td style="padding: 10px 8px; font-size: 11px; color: #4A3F2E;">${escapeHtml(tableName)}</td>
        </tr>
      `;
    }).join('');

    const tableBlocks = tables.map(t => {
      const tableGuests = guests.filter(g => t.seats.includes(g.id));
      const guestList = tableGuests.length
        ? tableGuests.map(g => `<li style="padding: 3px 0; font-size: 12px; color: #1E1910;">${escapeHtml(g.name)}${g.type === 'Dieťa' ? ' <span style="color: #9B7A45; font-size: 10px;">(dieťa)</span>' : ''}</li>`).join('')
        : '<li style="color: #6B5946; font-style: italic; font-size: 12px;">Prázdny stôl</li>';
      return `
        <div style="border: 1px solid #E5DFD3; border-radius: 12px; padding: 14px; margin-bottom: 10px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
            <h4 style="font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 16px; color: #1E1910; margin: 0;">${escapeHtml(t.name)}</h4>
            <span style="font-size: 10px; color: #9B7A45; letter-spacing: 0.15em; text-transform: uppercase;">${t.shape} · ${tableGuests.length}/${t.capacity}</span>
          </div>
          <ul style="list-style: none; padding: 0; margin: 0;">${guestList}</ul>
        </div>
      `;
    }).join('');

    const cateringBlock = guests.some(g => g.rsvp === 'Potvrdená') ? `
      <div style="page-break-inside: avoid; margin-bottom: 28px;">
        <h3 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 18px; color: #1E1910; border-bottom: 1px solid #E5DFD3; padding-bottom: 6px; margin-bottom: 12px;">Pre catering — Potvrdení hostia</h3>
        <div style="display: flex; gap: 24px; margin-bottom: 12px;">
          <div><div style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #1E1910;">${mealCounts['Celá porcia'] || 0}</div><div style="font-size: 11px; color: #6B5946;">Celá porcia</div></div>
          <div><div style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #1E1910;">${mealCounts['Polovičná porcia'] || 0}</div><div style="font-size: 11px; color: #6B5946;">Polovičná porcia</div></div>
          <div><div style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #1E1910;">${mealCounts['Bez jedla'] || 0}</div><div style="font-size: 11px; color: #6B5946;">Bez jedla</div></div>
          <div><div style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #1E1910;">${guests.filter(g => g.highChair && g.rsvp === 'Potvrdená').length}</div><div style="font-size: 11px; color: #6B5946;">Detských stoličiek</div></div>
        </div>
      </div>
    ` : '';

    const html = `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)} — Svadobný plánovač</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 40px; color: #1E1910; background: #F2EDE3; line-height: 1.5; }
    .page { max-width: 800px; margin: 0 auto; background: #FFF; padding: 50px 45px; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.05); }
    .hero { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #E5DFD3; margin-bottom: 35px; }
    .hero .mark { width: 48px; height: 48px; border: 1px solid #9B7A45; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #9B7A45; }
    .hero h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 36px; margin: 0 0 8px; color: #1E1910; letter-spacing: 0.02em; }
    .hero .date { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; color: #9B7A45; margin: 0; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 28px; color: #1E1910; margin: 0 0 6px; }
    .section-subtitle { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: #6B5946; margin: 0 0 20px; }
    .section-rule { height: 1px; width: 40px; background: #9B7A45; margin-bottom: 20px; }
    .stats-row { display: flex; gap: 20px; margin-bottom: 24px; }
    .stat { flex: 1; border: 1px solid #E5DFD3; border-radius: 12px; padding: 16px; }
    .stat-label { font-size: 10px; color: #9B7A45; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px; }
    .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #1E1910; }
    .tag { display: inline-block; font-size: 10px; color: #9B7A45; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #9B7A45; padding: 8px; border-bottom: 1px solid #E5DFD3; font-weight: 500; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5DFD3; text-align: center; font-size: 10px; color: #6B5946; letter-spacing: 0.15em; text-transform: uppercase; }
    .print-bar { position: fixed; top: 0; left: 0; right: 0; background: #1E1910; color: #FFF; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
    .print-bar p { margin: 0; font-size: 13px; }
    .print-bar button { background: #9B7A45; color: #FFF; border: none; padding: 10px 24px; border-radius: 999px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; font-family: inherit; }
    .print-bar button:hover { background: #9E7D4A; }
    .print-bar button.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.3); }
    body.has-bar { padding-top: 100px; }
    @media print {
      body { padding: 0; background: #FFF; }
      .page { box-shadow: none; padding: 0; max-width: none; border-radius: 0; }
      .print-bar { display: none; }
      body.has-bar { padding-top: 0; }
      .section { page-break-inside: avoid; }
      h3, h4 { page-break-after: avoid; }
    }
  </style>
</head>
<body class="has-bar">
  <div class="print-bar">
    <p>📄 Kliknite na "Tlačiť / Uložiť PDF" a v dialógu zvoľte "Uložiť ako PDF"</p>
    <div>
      <button onclick="window.print()">Tlačiť / Uložiť PDF</button>
    </div>
  </div>

  <div class="page">
    <div class="hero">
      <div class="mark">J</div>
      <span style="font-size: 10px; color: #9B7A45; letter-spacing: 0.3em; text-transform: uppercase;">JanVeil · Svadobný plánovač</span>
      <h1 style="margin-top: 16px;">${escapeHtml(title)}</h1>
      ${weddingDateStr ? `<p class="date">${weddingDateStr}</p>` : ''}
    </div>

    <div class="section">
      <div class="section-rule"></div>
      <h2 class="section-title">Prehľad</h2>
      <p class="section-subtitle">Kde sa momentálne nachádzame</p>
      <div class="stats-row">
        <div class="stat"><div class="stat-label">Splnené úlohy</div><div class="stat-value">${completedPct}%</div><div style="font-size: 11px; color: #6B5946; margin-top: 4px;">${completedTasks} / ${checklist.length}</div></div>
        <div class="stat"><div class="stat-label">Minuté</div><div class="stat-value">${totalSpent.toLocaleString('sk-SK')} €</div><div style="font-size: 11px; color: #6B5946; margin-top: 4px;">z ${budgetTotal.toLocaleString('sk-SK')} €</div></div>
        <div class="stat"><div class="stat-label">Potvrdení hostia</div><div class="stat-value">${confirmedGuests} / ${guests.length}</div></div>
        <div class="stat"><div class="stat-label">Stoly</div><div class="stat-value">${tables.length}</div></div>
      </div>
    </div>

    ${checklist.length > 0 ? `
    <div class="section" style="page-break-before: always;">
      <div class="section-rule"></div>
      <h2 class="section-title">Zoznam úloh</h2>
      <p class="section-subtitle">Každý detail v správny čas</p>
      ${phaseBlocks}
    </div>` : ''}

    ${expenses.length > 0 ? `
    <div class="section" style="page-break-before: always;">
      <div class="section-rule"></div>
      <h2 class="section-title">Rozpočet</h2>
      <p class="section-subtitle">Celkom naplánované: ${totalPlanned.toLocaleString('sk-SK')} € · minuté: ${totalSpent.toLocaleString('sk-SK')} €</p>
      <table>
        <thead><tr><th>Kategória</th><th style="text-align:right;">Naplánované</th><th style="text-align:right;">Minuté</th><th style="text-align:right;">Stav</th></tr></thead>
        <tbody>${budgetRows}</tbody>
      </table>
    </div>` : ''}

    ${guests.length > 0 ? `
    <div class="section" style="page-break-before: always;">
      <div class="section-rule"></div>
      <h2 class="section-title">Hostia</h2>
      <p class="section-subtitle">${guests.length} hostí · ${confirmedGuests} potvrdených</p>
      ${cateringBlock}
      <table>
        <thead><tr><th>Meno</th><th>Strana</th><th>Detail</th><th>Stôl</th></tr></thead>
        <tbody>${guestRows}</tbody>
      </table>
    </div>` : ''}

    ${tables.length > 0 ? `
    <div class="section" style="page-break-before: always;">
      <div class="section-rule"></div>
      <h2 class="section-title">Zasadací poriadok</h2>
      <p class="section-subtitle">${tables.length} ${tables.length === 1 ? 'stôl' : tables.length < 5 ? 'stoly' : 'stolov'}</p>
      <div>${tableBlocks}</div>
    </div>` : ''}

    <div class="footer">
      Vygenerované ${new Date().toLocaleDateString('sk-SK')} · JanVeil · Hviezdoslavova 41, Zlaté Moravce · janveil.sk
    </div>
  </div>
</body>
</html>`;

    try {
      // Stiahneme HTML súbor - užívateľ ho otvorí v prehliadači a vytlačí ako PDF
      // Toto funguje všade (aj v sandboxed iframe kde window.open je blokovaný)
      const safeName = (coupleName || 'svadobny-planovac').replace(/[^a-zA-Z0-9]/g, '-');
      const today = new Date().toISOString().split('T')[0];
      const filename = `${safeName}-${today}.html`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      alert('PDF export zlyhal. Skúste Excel namiesto toho.');
      console.error(err);
    }
  };

  const tryDownload = () => {
    try {
      const json = getExportJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `janveil-planner-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setShowExport(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getExportJson());
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      const ta = document.getElementById('export-textarea');
      if (ta) {
        ta.select();
        try { document.execCommand('copy'); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000); } catch {}
      }
    }
  };

  const loadFromText = (text) => {
    try {
      const data = JSON.parse(text);
      if (data.coupleName !== undefined) setCoupleName(data.coupleName);
      if (data.weddingDate !== undefined) setWeddingDate(data.weddingDate);
      if (data.checklist) setChecklist(data.checklist);
      if (data.expenses) setExpenses(data.expenses);
      if (data.budgetTotal !== undefined) setBudgetTotal(data.budgetTotal);
      if (data.guests) setGuests(data.guests);
      if (data.tables) setTables(data.tables);
      if (data.sceneElements) setSceneElements(data.sceneElements.map(e => ({ scale: 1, rotation: 0, ...e })));
      if (data.timeline) setTimeline(data.timeline);
      if (data.documents) setDocuments(data.documents);
      if (data.diary !== undefined) setDiary(data.diary);
      
      setShowImport(false);
      setImportText('');
      return true;
    } catch (err) {
      alert('Neplatný formát JSON. Skontrolujte údaje.');
      return false;
    }
  };

  const importFromFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { loadFromText(ev.target.result); };
    reader.readAsText(file);
  };

  const daysUntil = weddingDate ? Math.ceil((new Date(weddingDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  // Kontextové správy podľa počtu dní do svadby
  const getCountdownMessage = (days) => {
    if (days === null || days < 0) return null;
    if (days === 0) return 'Dnes je váš deň. Užite si ho ♡';
    if (days === 1) return 'Zajtra je deň D. Hlavne pokojne dýchajte.';
    if (days <= 7) return 'Posledný týždeň — hlavne nezabudnite odpočívať.';
    if (days <= 30) return 'Mesiac do svadby. Posledné úpravy a kontroly.';
    if (days <= 90) return 'Posledná skúška šiat by mala byť čoskoro.';
    if (days <= 180) return 'Čas začať potvrdzovať dodávateľov.';
    if (days <= 365) return 'Máte dosť času. Vychutnajte si plánovanie.';
    return 'Začínate s dostatkom času — krásne obdobie plánovania.';
  };
  const countdownMessage = getCountdownMessage(daysUntil);
  const completedTasks = checklist.filter(t => t.done).length;
  const completedPct = checklist.length ? Math.round((completedTasks / checklist.length) * 100) : 0;
  const totalSpent = expenses.reduce((sum, e) => sum + e.spent, 0);
  const totalPlanned = expenses.reduce((sum, e) => sum + e.planned, 0);
  const confirmedGuests = guests.filter(g => g.rsvp === 'Potvrdená').length;
  const unassignedGuests = guests.filter(g => !tables.some(t => t.seats.includes(g.id)));

  const mealCounts = guests.reduce((acc, g) => {
    if (g.rsvp !== 'Potvrdená') return acc;
    const key = g.meal || 'Celá porcia';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const documentsDone = documents.filter(d => d.done).length;

  const modules = [
    { id: 'checklist', title: 'Zoznam úloh', desc: 'Všetko čo treba stihnúť, po časovej osi', icon: Calendar, stat: `${completedPct}%` },
    { id: 'budget', title: 'Rozpočet', desc: 'Sledujte výdavky a držte sa svojho plánu', icon: Wallet, stat: `${totalSpent.toLocaleString('sk-SK')} €` },
    { id: 'guests', title: 'Hostia', desc: 'Zoznam hostí, stravovanie, alergény', icon: Users, stat: `${confirmedGuests} / ${guests.length}` },
    { id: 'seating', title: 'Plán sály', desc: 'Rozmiestnite stoly, DJ, bar a parket na mape', icon: Armchair, stat: `${tables.length} ${tables.length === 1 ? 'stôl' : 'stolov'}` },
    { id: 'timeline', title: 'Harmonogram dňa D', desc: 'Časový rozpis svadobného dňa — hodinu po hodine', icon: Clock, stat: `${timeline.length}` },
    { id: 'documents', title: 'Doklady a papierovanie', desc: 'Matrika, občiansky, zmena priezviska', icon: FileCheck, stat: `${documentsDone} / ${documents.length}` },
    { id: 'diary', title: 'Môj denník', desc: 'Myšlienky, nápady, čo sa vám páči', icon: BookOpen, stat: diary ? '✓' : '' },
  ];

  const phases = ['12+ mesiacov pred', '9-12 mesiacov pred', '6-9 mesiacov pred', '3-6 mesiacov pred', '1-3 mesiace pred', '2-4 týždne pred', '1-2 týždne pred', '1 týždeň pred', '1-2 dni pred', 'Deň D'];

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Filtrovaní hostia (pre search + filter)
  const filteredGuests = useMemo(() => {
    let list = guests;
    if (guestSearch.trim()) {
      const q = guestSearch.toLowerCase().trim();
      list = list.filter(g => g.name.toLowerCase().includes(q) || (g.allergies && g.allergies.toLowerCase().includes(q)));
    }
    if (guestFilter === 'confirmed') list = list.filter(g => g.rsvp === 'Potvrdená');
    else if (guestFilter === 'pending') list = list.filter(g => g.rsvp === 'Čaká sa');
    else if (guestFilter === 'rejected') list = list.filter(g => g.rsvp === 'Odmietol');
    else if (guestFilter === 'children') list = list.filter(g => g.type === 'Dieťa');
    else if (guestFilter === 'allergies') list = list.filter(g => g.allergies);
    return list;
  }, [guests, guestSearch, guestFilter]);

  // === KEYBOARD SHORTCUTS ===
  useEffect(() => {
    const handler = (e) => {
      // ESC zatvorí modaly
      if (e.key === 'Escape') {
        if (showExport) setShowExport(false);
        else if (showImport) setShowImport(false);
        else if (showShareLink) setShowShareLink(false);
        else if (showStyleQuiz) setShowStyleQuiz(false);
      }
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && undoStack.length > 0) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showExport, showImport, showShareLink, showStyleQuiz, undoStack]);

  const escapeHtml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`} style={{ backgroundColor: theme === 'dark' ? '#1A1510' : '#F2EDE3', fontFamily: "'Inter', -apple-system, sans-serif", transition: 'background-color 0.4s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; }
        body, html, input, textarea, button, select { font-weight: 500; }

        /* === LEPŠIA ČITATEĽNOSŤ === */
        /* Hlavné nadpisy v serif fonte */
        h1.serif, h2.serif, h3.serif, h4.serif { font-weight: 500; }
        /* Italic serif texty (tie čo majú <em> alebo italic) - trocha silnejšie */
        .serif em, em.serif, .serif.italic, em { font-weight: 500; font-style: italic; }
        /* Statové hodnoty a dôležité čísla */
        .serif.font-normal { font-weight: 500 !important; }
        /* Text v uppercase tracking-wider (štítky) - medium */
        [class*="tracking-"][class*="uppercase"] { font-weight: 500; letter-spacing: 0.15em; }
        /* Body text - trocha tmavší pre lepší kontrast */
        p, span, li { font-weight: 500; }
        /* Tlačidlá */
        button, a.inline-block, a.block { font-weight: 600; }
        /* Pill tlačidlá tracking wider */
        .pill-btn { font-weight: 600 !important; }

        .hairline { border-color: #E5DFD3; }
        .gold { color: #9B7A45; }
        .bg-gold { background-color: #9B7A45; }
        .border-gold { border-color: #9B7A45; }

        /* === DARK MODE (prestavané) === */
        .theme-dark { color-scheme: dark; }
        .theme-dark .hairline { border-color: #3D3528 !important; }
        .theme-dark .gold { color: #D4B176 !important; }
        .theme-dark .bg-gold { background-color: #D4B176 !important; }
        .theme-dark .border-gold { border-color: #D4B176 !important; }

        /* Pozadia */
        .theme-dark .bg-white { background-color: #25201A !important; }
        .theme-dark [style*="#F2EDE3"] { background-color: #1A1510 !important; }
        .theme-dark [style*="#F5EFE3"] { background-color: #2A2218 !important; }
        .theme-dark [style*="#EBE1CF"] { background-color: #3D3528 !important; }
        .theme-dark .bg-gray-100 { background-color: #3D3528 !important; }
        .theme-dark .bg-gray-50 { background-color: #2A2218 !important; }
        .theme-dark .bg-red-50 { background-color: #3D1818 !important; }
        .theme-dark .bg-amber-50 { background-color: #3D2F18 !important; }

        /* === TEXTY — dôležité aby bolo vidno === */
        /* Všetky inline "color: '#1E1910'" (hlavný tmavý text) → svetlá */
        .theme-dark [style*="color: rgb(30, 25, 16)"],
        .theme-dark [style*="#1E1910"] { color: #EBE1CF !important; }
        /* Sekundárny text */
        .theme-dark [style*="color: rgb(74, 63, 46)"],
        .theme-dark [style*="#4A3F2E"] { color: #C8B89A !important; }
        /* Terciárny / placeholder text */
        .theme-dark [style*="color: rgb(107, 89, 70)"],
        .theme-dark [style*="#6B5946"] { color: #A8987A !important; }

        /* Inputs */
        .theme-dark input, .theme-dark textarea, .theme-dark select {
          color: #EBE1CF !important;
          background-color: transparent !important;
        }
        .theme-dark input::placeholder,
        .theme-dark textarea::placeholder { color: #7A6B52 !important; }

        /* Tailwind text farby v dark mode */
        .theme-dark .text-white { color: #FFFFFF !important; }
        .theme-dark .text-red-500,
        .theme-dark .text-red-600,
        .theme-dark .text-red-700 { color: #F87171 !important; }
        .theme-dark .text-amber-600,
        .theme-dark .text-amber-700 { color: #FBBF24 !important; }

        /* Pill group v dark */
        .theme-dark .pill-group { background-color: #25201A !important; }
        .theme-dark .pill-btn { color: #A8987A; }
        .theme-dark .pill-btn.active { color: #1A1510 !important; }

        /* Dátum picker v dark */
        .theme-dark .date-picker-trigger { background-color: #25201A !important; color: #EBE1CF !important; }
        .theme-dark .date-picker-trigger.empty { color: #A8987A !important; }

        /* Budget inputs */
        .theme-dark .budget-input-wrapper { background-color: #2A2218 !important; border-color: #3D3528; }
        .theme-dark .budget-input-wrapper:focus-within { background-color: #25201A !important; }

        /* Scene element v mape */
        .theme-dark .scene-element { background-color: #25201A !important; color: #D4B176 !important; border-color: #D4B176; }
        .theme-dark .venue-canvas {
          background: linear-gradient(rgba(212, 177, 118, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 177, 118, 0.05) 1px, transparent 1px), linear-gradient(135deg, #1A1510 0%, #25201A 100%) !important;
          background-size: 40px 40px, 40px 40px, 100% 100% !important;
          border-color: #3D3528;
        }

        /* Initial chip v dark mode */
        .theme-dark .initial-chip {
          background: linear-gradient(135deg, #2A2218, #3D3528) !important;
          color: #D4B176 !important;
          border-color: #D4B176 !important;
        }

        /* Hover states */
        .theme-dark .hover\\:bg-gray-50:hover { background-color: #2A2218 !important; }
        .theme-dark .hover\\:bg-\\[\\#F5EFE3\\]:hover { background-color: #2A2218 !important; }

        /* Rounded cards s shimmer */
        .theme-dark .shimmer { background: linear-gradient(90deg, transparent, rgba(212, 177, 118, 0.12), transparent) !important; }

        /* Modal backdrop tmavší */
        .theme-dark .modal-backdrop { background-color: rgba(0, 0, 0, 0.6) !important; }

        .card-hover { transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.5s ease; will-change: transform; position: relative; }
        .card-hover:hover { transform: translateY(-6px) scale(1.015); box-shadow: 0 24px 48px -16px rgba(176, 141, 87, 0.22), 0 2px 8px rgba(44, 36, 22, 0.04); border-color: rgba(176, 141, 87, 0.4); }
        .card-hover::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(176, 141, 87, 0.08), transparent 60%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; }
        .card-hover:hover::before { opacity: 1; }

        .fade-in { animation: fadeIn 0.7s cubic-bezier(0.23, 1, 0.32, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .stagger > * { opacity: 0; animation: fadeIn 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger > *:nth-child(2) { animation-delay: 0.12s; }
        .stagger > *:nth-child(3) { animation-delay: 0.19s; }
        .stagger > *:nth-child(4) { animation-delay: 0.26s; }

        .shimmer { background: linear-gradient(90deg, transparent, rgba(176, 141, 87, 0.08), transparent); background-size: 200% 100%; animation: shimmer 4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        input, select, textarea, button { font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #9B7A45; }
        .progress-bar { transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1); }

        .pill-group { display: inline-flex; flex-wrap: wrap; gap: 4px; border: 1px solid #E5DFD3; border-radius: 999px; padding: 3px; background: #FFF; }
        .pill-btn { padding: 7px 16px; border-radius: 999px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #6B5946; transition: all 0.3s ease; cursor: pointer; border: none; background: transparent; white-space: nowrap; display: inline-flex; align-items: center; }
        .pill-btn.active { background: #9B7A45; color: #FFF; box-shadow: 0 2px 6px rgba(176, 141, 87, 0.3); }
        .pill-btn:not(.active):hover { color: #1E1910; }

        .rounded-card { border-radius: 20px; position: relative; overflow: hidden; }
        .rounded-soft { border-radius: 14px; }

        .initial-chip { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #FFF, #EBE1CF); border: 1.5px solid #9B7A45; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 12px; font-weight: 500; color: #9B7A45; box-shadow: 0 2px 6px rgba(176, 141, 87, 0.15); transition: all 0.25s ease; cursor: pointer; }
        .initial-chip:hover { transform: scale(1.18); z-index: 20; box-shadow: 0 4px 12px rgba(176, 141, 87, 0.4); }
        .initial-chip.child { background: linear-gradient(135deg, #FFF, #FAF0E3); border-color: #D4AF7B; }

        .modal-backdrop { animation: fadeIn 0.3s ease; }
        .modal-content { animation: modalIn 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .date-picker-trigger { width: 100%; padding: 10px 14px; background: #FFF; border: 1px solid #E5DFD3; border-radius: 999px; color: #1E1910; font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-style: italic; text-align: center; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .date-picker-trigger:hover { border-color: #9B7A45; }
        .date-picker-trigger.empty { color: #6B5946; }

        .budget-input-wrapper { position: relative; display: flex; align-items: center; background: #F5EFE3; border: 1px solid #E5DFD3; border-radius: 10px; padding: 6px 10px; transition: all 0.3s ease; }
        .budget-input-wrapper:focus-within { border-color: #9B7A45; background: #FFF; box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.08); }
        .budget-input-wrapper input { background: transparent; border: 0; outline: none; width: 100%; text-align: right; padding-right: 4px; font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #1E1910; }
        .budget-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #9B7A45; margin-bottom: 6px; display: block; }

        .venue-canvas { position: relative; width: 100%; height: 760px; background: linear-gradient(rgba(176, 141, 87, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(176, 141, 87, 0.04) 1px, transparent 1px), linear-gradient(135deg, #F5EFE3 0%, #EBE1CF 100%); background-size: 40px 40px, 40px 40px, 100% 100%; border-radius: 20px; overflow: hidden; border: 1px solid #E5DFD3; touch-action: none; user-select: none; }

        .draggable-table { position: absolute; cursor: grab; transition: box-shadow 0.3s ease, transform 0.2s ease; }
        .draggable-table.dragging { cursor: grabbing; z-index: 100; }
        .draggable-table:hover { filter: drop-shadow(0 8px 16px rgba(176, 141, 87, 0.25)); }

        .scene-wrap { position: absolute; }
        .scene-element { cursor: grab; background: #FFF; border: 1.5px solid #9B7A45; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #9B7A45; box-shadow: 0 4px 10px rgba(176, 141, 87, 0.15); transition: box-shadow 0.3s ease, border-color 0.2s ease; white-space: nowrap; }
        .scene-element.dragging { cursor: grabbing; z-index: 100; }
        .scene-element.selected { border-color: #9B7A45; box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.2), 0 6px 14px rgba(176, 141, 87, 0.25); }
        .scene-element:hover { filter: drop-shadow(0 6px 14px rgba(176, 141, 87, 0.25)); }

        .handle {
          position: absolute; width: 24px; height: 24px; border-radius: 50%;
          background: #FFF; border: 1.5px solid #9B7A45;
          display: flex; align-items: center; justify-content: center;
          color: #9B7A45; cursor: pointer;
          box-shadow: 0 2px 6px rgba(176, 141, 87, 0.25);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .handle:hover { background: #9B7A45; color: #FFF; transform: scale(1.1); }
        .handle.resize { cursor: nwse-resize; }
        .handle.rotate { cursor: grab; }
        .handle.rotate:active { cursor: grabbing; }
        .handle.remove:hover { background: #DC2626; border-color: #DC2626; }
      `}</style>

      <header className="border-b hairline sticky top-0 z-40 backdrop-blur" style={{ backgroundColor: theme === 'dark' ? 'rgba(26, 21, 16, 0.92)' : 'rgba(251, 248, 244, 0.85)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={() => setActiveModule('home')} className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 border border-gold flex items-center justify-center rounded-full group-hover:bg-gold transition-all duration-500">
              <span className="serif text-lg gold group-hover:text-white transition-colors duration-500">J</span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="serif text-xl tracking-wide" style={{ color: theme === 'dark' ? '#EBE1CF' : '#1E1910' }}>JanVeil</div>
              <div className="text-[10px] tracking-[0.2em] uppercase gold">Svadobný plánovač</div>
            </div>
          </button>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-9 h-9 flex items-center justify-center gold hover:opacity-70 transition"
              title={theme === 'light' ? 'Tmavý režim' : 'Svetlý režim'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Share */}
            <button
              onClick={generateShareLink}
              className="hidden md:flex text-xs tracking-wider uppercase gold hover:opacity-60 transition items-center gap-1.5"
              title="Zdieľať s partnerom / rodinou"
            >
              <Share2 size={14} /> <span className="hidden lg:inline">Zdieľať</span>
            </button>

            <button onClick={() => setShowExport(true)} className="text-xs tracking-wider uppercase gold hover:opacity-60 transition hidden sm:flex items-center gap-1.5"><Download size={14} /> <span className="hidden md:inline">Exportovať</span></button>
            <button onClick={() => setShowImport(true)} className="text-xs tracking-wider uppercase gold hover:opacity-60 transition hidden sm:flex items-center gap-1.5"><Upload size={14} /> <span className="hidden md:inline">Načítať</span></button>
          </div>
        </div>

        {/* Mobile nav — horizontálny scroll tabs */}
        {activeModule !== 'home' && (
          <div className="lg:hidden border-t hairline overflow-x-auto">
            <div className="flex items-center gap-1 px-4 py-2 min-w-max">
              {modules.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${activeModule === m.id ? 'bg-gold text-white' : 'gold'}`}
                  >
                    <Icon size={12} /> {m.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* === SIDEBAR (desktop only, visible when not on home) === */}
      {activeModule !== 'home' && (
        <aside className="hidden lg:block fixed left-0 top-[73px] bottom-0 w-64 border-r hairline overflow-y-auto z-30" style={{ backgroundColor: theme === 'dark' ? '#1A1510' : '#F2EDE3' }}>
          <div className="p-5">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4 px-3">Navigácia</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveModule('home')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-[#EBE1CF]"
                style={{ color: theme === 'dark' ? '#C8B89A' : '#4A3F2E' }}
              >
                <Home size={15} className="gold" />
                <span>Domov</span>
              </button>
              {modules.map(m => {
                const Icon = m.icon;
                const isActive = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-gold text-white shadow-sm' : 'hover:bg-[#EBE1CF]'}`}
                    style={!isActive ? { color: theme === 'dark' ? '#EBE1CF' : '#1E1910' } : {}}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={15} className={isActive ? 'text-white' : 'gold'} />
                      <span>{m.title}</span>
                    </span>
                    {m.stat && (
                      <span className={`text-[10px] tracking-wider ${isActive ? 'text-white opacity-80' : 'gold'}`}>
                        {m.stat}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick actions */}
            <div className="mt-8 pt-6 border-t hairline">
              <p className="text-[10px] tracking-[0.3em] uppercase gold mb-3 px-3">Rýchle akcie</p>
              <div className="space-y-1">
                <button
                  onClick={generateShareLink}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs hover:bg-[#EBE1CF] transition gold"
                >
                  <Share2 size={13} /> Zdieľať s partnerom
                </button>
                <button
                  onClick={() => setShowExport(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs hover:bg-[#EBE1CF] transition gold"
                >
                  <Download size={13} /> Exportovať
                </button>
              </div>
            </div>

            {/* CTA v sidebare */}
            <div className="mt-6 p-4 rounded-card border hairline" style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #2A2218, #3D3528)' : 'linear-gradient(135deg, #F5EFE3, #EBE1CF)' }}>
              <Heart size={16} strokeWidth={1.2} className="gold mb-2" />
              <p className="serif italic text-sm mb-3" style={{ color: theme === 'dark' ? '#EBE1CF' : '#1E1910' }}>
                Hľadáte šaty?
              </p>
              <a
                href="https://www.janveil.sk/svadobne-saty/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[10px] tracking-[0.2em] uppercase border border-gold gold rounded-full py-2 hover:bg-gold hover:text-white transition"
              >
                Naša kolekcia
              </a>
            </div>
          </div>
        </aside>
      )}

      {activeModule === 'home' && (
        <div className="fade-in">
          <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="inline-block mb-8">
              <div className="h-px w-16 bg-gold mx-auto mb-6" />
              <p className="text-[10px] tracking-[0.35em] uppercase gold">Pretože každý detail má význam</p>
            </div>
            <h1 className="serif text-5xl md:text-7xl font-normal leading-tight mb-6" style={{ color: '#1E1910' }}>
              Váš svadobný deň,<br />
              <em className="font-normal">premyslený do posledného detailu</em>
            </h1>
            <p className="max-w-xl mx-auto text-base leading-relaxed mb-12" style={{ color: '#4A3F2E' }}>
              Bezplatný plánovač od svadobného salóna JanVeil. Bez registrácie, bez reklám — len priestor pre vašu lásku a vašu víziu.
            </p>

            <div className="max-w-xl mx-auto bg-white border hairline rounded-card p-8 md:p-10 mb-4" style={{ boxShadow: '0 4px 24px -8px rgba(176, 141, 87, 0.12)' }}>
              {daysUntil !== null && daysUntil >= 0 ? (
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase gold mb-3">Do vášho veľkého dňa</p>
                  <div className="serif text-6xl md:text-7xl font-normal mb-2" style={{ color: '#1E1910' }}>{daysUntil}</div>
                  <p className="text-sm" style={{ color: '#4A3F2E' }}>{daysUntil === 1 ? 'deň' : daysUntil < 5 ? 'dni' : 'dní'}</p>
                  {coupleName && <p className="serif text-xl mt-4 italic" style={{ color: '#1E1910' }}>{coupleName}</p>}
                  {countdownMessage && (
                    <p className="serif italic text-base mt-5 pt-5 border-t hairline" style={{ color: '#6B5946' }}>
                      {countdownMessage}
                    </p>
                  )}
                  <button onClick={() => { setWeddingDate(''); setCoupleName(''); }} className="text-xs tracking-wider uppercase gold hover:opacity-60 mt-4">Upraviť</button>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase gold mb-5">Začnime spolu</p>
                  <div className="space-y-5">
                    <input type="text" value={coupleName} onChange={(e) => setCoupleName(e.target.value)}
                      placeholder="Mená mladomanželov (napr. Anna & Martin)"
                      className="w-full border-b hairline py-2 text-center bg-transparent serif text-lg italic"
                      style={{ color: '#1E1910' }} />
                    <CustomDatePicker value={weddingDate} onChange={setWeddingDate} placeholder="Vyberte dátum svadby" />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 pb-24">
            <div className="text-center mb-12">
              <div className="h-px w-12 bg-gold mx-auto mb-5" />
              <h2 className="serif text-3xl md:text-4xl font-normal" style={{ color: '#1E1910' }}>Vaše nástroje</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5 stagger">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setActiveModule(m.id)}
                    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}
                    className="card-hover rounded-card text-left bg-white border hairline p-8 group">
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 rounded-full border hairline flex items-center justify-center group-hover:border-gold group-hover:rotate-12 transition-all duration-500">
                          <Icon size={20} strokeWidth={1.2} className="gold" />
                        </div>
                        <span className="serif text-2xl font-normal gold">{m.stat}</span>
                      </div>
                      <h3 className="serif text-2xl font-normal mb-2" style={{ color: '#1E1910' }}>{m.title}</h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A3F2E' }}>{m.desc}</p>
                      <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase gold group-hover:gap-3 transition-all duration-300">Otvoriť <ChevronRight size={14} /></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Šaty od JanVeil — gallery teaser + style quiz */}
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="text-center mb-10">
              <div className="h-px w-12 bg-gold mx-auto mb-5" />
              <h2 className="serif text-3xl md:text-4xl font-normal" style={{ color: '#1E1910' }}>Objavte šaty JanVeil</h2>
              <p className="serif italic text-base mt-3" style={{ color: '#6B5946' }}>Ručne šité, z najkrajších látok, pre tie najnáročnejšie nevesty</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <a
                href="https://www.janveil.sk/svadobne-saty/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}
                className="card-hover rounded-card bg-white border hairline p-8 text-left group block"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full border hairline flex items-center justify-center mb-5 group-hover:border-gold group-hover:rotate-12 transition-all duration-500">
                    <ImageIcon size={20} strokeWidth={1.2} className="gold" />
                  </div>
                  <h3 className="serif text-2xl font-normal mb-2" style={{ color: '#1E1910' }}>Naša kolekcia</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A3F2E' }}>
                    Pozrite si výber svadobných šiat — klasické korzetové, A-čkové, bohemské či minimalistické modely.
                  </p>
                  <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase gold group-hover:gap-3 transition-all duration-300">
                    Pozrieť kolekciu <ChevronRight size={14} />
                  </div>
                </div>
              </a>

              <button
                onClick={() => setShowStyleQuiz(true)}
                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}
                className="card-hover rounded-card bg-white border hairline p-8 text-left group"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full border hairline flex items-center justify-center mb-5 group-hover:border-gold group-hover:rotate-12 transition-all duration-500">
                    <SparklesIcon size={20} strokeWidth={1.2} className="gold" />
                  </div>
                  <h3 className="serif text-2xl font-normal mb-2" style={{ color: '#1E1910' }}>Aký štýl svadby vám sadne?</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A3F2E' }}>
                    Krátky kvíz (5 otázok) — zistíme váš svadobný štýl a odporučíme vhodné šaty z našej kolekcie.
                  </p>
                  <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase gold group-hover:gap-3 transition-all duration-300">
                    Začať kvíz <ChevronRight size={14} />
                  </div>
                </div>
              </button>
            </div>
          </section>

          <section className="max-w-4xl mx-auto px-6 pb-24">
            <div className="border hairline rounded-card p-10 md:p-14 text-center relative overflow-hidden bg-white">
              <div className="shimmer absolute inset-0 pointer-events-none" />
              <div className="relative">
                <Heart size={20} strokeWidth={1} className="gold mx-auto mb-5" />
                <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4">Svadobný salón JanVeil</p>
                <h3 className="serif text-3xl md:text-4xl font-normal mb-5 italic" style={{ color: '#1E1910' }}>"Pretože tvoja láska si zaslúži dokonalé šaty."</h3>
                <p className="text-sm leading-relaxed max-w-lg mx-auto mb-8" style={{ color: '#4A3F2E' }}>Keď bude čas vybrať svadobné šaty, radi vás privítame v našom salóne v Zlatých Moravciach.</p>
                <a href="https://www.janveil.sk/skuska-svadobnych-siat/#termin" target="_blank" rel="noopener noreferrer"
                  className="inline-block border border-gold gold px-8 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-500">Objednať skúšku</a>
              </div>
            </div>
          </section>

          <footer className="border-t hairline py-8 text-center text-xs tracking-wider" style={{ color: '#6B5946' }}>
            JanVeil · Hviezdoslavova 41, Zlaté Moravce · janveil.sk
          </footer>
        </div>
      )}

      {activeModule === 'checklist' && (
        <ModuleShell title="Zoznam úloh" subtitle="Každý detail v správny čas" onBack={() => setActiveModule('home')}>
          {/* MAIN PROGRESS with percentage */}
          <div className="mb-10 bg-white border hairline rounded-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-wider uppercase gold">Splnené</span>
              <div className="flex items-baseline gap-3">
                <span className="serif text-4xl font-normal gold">{completedPct}%</span>
                <span className="text-sm" style={{ color: '#6B5946' }}>{completedTasks} / {checklist.length}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 relative overflow-hidden rounded-full">
              <div className="progress-bar absolute inset-y-0 left-0 bg-gold rounded-full" style={{ width: `${completedPct}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {phases.map(phase => {
              const items = checklist.filter(t => t.phase === phase);
              if (items.length === 0) return null;
              const done = items.filter(x => x.done).length;
              const pct = items.length ? Math.round((done / items.length) * 100) : 0;
              const isOpen = openPhase === phase;
              const isComplete = done === items.length && items.length > 0;

              return (
                <div key={phase} className={`bg-white border rounded-card transition-all duration-300 ${isOpen ? 'border-gold shadow-lg' : isComplete ? 'border-gold/50' : 'hairline hover:border-gold'}`}>
                  <button onClick={() => setOpenPhase(isOpen ? null : phase)} className="w-full px-6 py-5 flex items-center justify-between text-left group">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 relative ${isOpen || isComplete ? 'bg-gold' : 'border hairline group-hover:border-gold'}`}>
                        {isComplete ? (
                          <Check size={18} className="text-white" strokeWidth={2.5} />
                        ) : (
                          <span className={`serif text-sm font-medium ${isOpen ? 'text-white' : 'gold'}`}>{pct}%</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="serif text-xl font-normal mb-1.5" style={{ color: '#1E1910' }}>{phase}</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[240px] h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="progress-bar h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs" style={{ color: '#6B5946' }}>{done} / {items.length}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`gold transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 border-t hairline pt-4 fade-in">
                      {/* DRESS COLLECTION TEASER — zobrazí sa v fáze keď sa vyberajú šaty */}
                      {(phase === '9-12 mesiacov pred' || phase === '6-9 mesiacov pred') && (
                        <div className="mb-5 rounded-card overflow-hidden border border-gold" style={{ background: 'linear-gradient(135deg, #F5EFE3, #EBE1CF)' }}>
                          <div className="p-5 md:p-6">
                            <div className="flex items-start gap-4 flex-wrap">
                              <div className="flex-1 min-w-[240px]">
                                <p className="text-[10px] tracking-[0.3em] uppercase gold mb-2 flex items-center gap-2">
                                  <Heart size={11} strokeWidth={1.5} /> Od salónu JanVeil
                                </p>
                                <h4 className="serif text-2xl font-normal mb-2" style={{ color: '#1E1910' }}>
                                  {phase === '9-12 mesiacov pred' ? 'Čas vybrať svadobné šaty' : 'Ešte nie ste rozhodnutá?'}
                                </h4>
                                <p className="text-sm leading-relaxed mb-4" style={{ color: '#4A3F2E' }}>
                                  {phase === '9-12 mesiacov pred'
                                    ? 'V tomto období väčšina neviest rezervuje šaty. Pozrite si našu kolekciu — každý kúsok je ručne šitý a môžete si ho vyskúšať osobne.'
                                    : 'Ak ste ešte nevybrali šaty, nie je neskoro. Pozrite si našu kolekciu alebo si objednajte nezáväznú skúšku.'}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  <a
                                    href="https://www.janveil.sk/svadobne-saty/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase hover:opacity-90 transition"
                                  >
                                    <ImageIcon size={12} /> Naša kolekcia
                                  </a>
                                  <a
                                    href="https://www.janveil.sk/skuska-svadobnych-siat/#termin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 border border-gold gold px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition"
                                  >
                                    Objednať skúšku
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <ul className="space-y-1">
                        {items.map(t => {
                          const isJanVeilTask = t.task.includes('JanVeil');
                          return (
                            <React.Fragment key={t.id}>
                              <li className="flex items-center gap-4 py-2 px-2 group rounded hover:bg-[#F5EFE3] transition">
                                <button onClick={() => toggleTask(t.id)}
                                  className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center rounded transition-all duration-300 ${t.done ? 'bg-gold border-gold' : 'hairline hover:border-gold'}`}>
                                  {t.done && <Check size={12} className="text-white" strokeWidth={2.5} />}
                                </button>
                                <span className={`flex-1 text-sm transition ${t.done ? 'line-through opacity-40' : ''}`} style={{ color: '#1E1910' }}>{t.task}</span>
                                <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100 transition gold hover:text-red-600"><Trash2 size={13} /></button>
                              </li>
                              {isJanVeilTask && !t.done && phase !== '9-12 mesiacov pred' && phase !== '6-9 mesiacov pred' && (
                                <li className="ml-9 mb-2 mt-1">
                                  <div className="border hairline rounded-soft p-4 bg-gradient-to-br from-[#F5EFE3] to-[#EBE1CF]">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                      <div className="flex-1 min-w-[200px]">
                                        <p className="text-[10px] tracking-[0.2em] uppercase gold mb-1">Tip od JanVeil</p>
                                        <p className="serif italic text-base" style={{ color: '#1E1910' }}>Pozrite si našu kolekciu svadobných šiat</p>
                                      </div>
                                      <a
                                        href="https://www.janveil.sk/svadobne-saty/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] tracking-[0.2em] uppercase gold hover:opacity-70 border border-gold rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                                      >
                                        <ImageIcon size={12} /> Naša kolekcia
                                      </a>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white border hairline rounded-card p-6 mt-8">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4">Pridať vlastnú úlohu</p>
            <div className="grid md:grid-cols-[1fr,220px,auto] gap-4 items-end">
              <input type="text" value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                placeholder="Napríklad: Rezervovať hotel pre rodičov" className="border-b hairline py-2 bg-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTask()} />
              <ElegantSelect value={newTask.phase} onChange={(v) => setNewTask({ ...newTask, phase: v })} options={phases.map(p => ({ value: p, label: p }))} />
              <button onClick={addTask} className="border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase hover:bg-gold hover:text-white transition flex items-center gap-2">
                <Plus size={14} /> Pridať
              </button>
            </div>
          </div>
        </ModuleShell>
      )}

      {activeModule === 'budget' && (
        <ModuleShell title="Rozpočet" subtitle="Prehľad vašich investícií do toho najkrajšieho dňa" onBack={() => setActiveModule('home')}>
          <div className="grid md:grid-cols-3 gap-5 mb-10 stagger">
            <StatCard label="Celkový rozpočet" value={`${budgetTotal.toLocaleString('sk-SK')} €`} editable onChange={setBudgetTotal} />
            <StatCard label="Naplánované" value={`${totalPlanned.toLocaleString('sk-SK')} €`} />
            <StatCard label="Minuté" value={`${totalSpent.toLocaleString('sk-SK')} €`} accent={totalSpent > budgetTotal} />
          </div>

          <div className="bg-white border hairline rounded-card p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-wider uppercase gold">Využitie rozpočtu</span>
              <span className="serif text-lg" style={{ color: '#1E1910' }}>{budgetTotal ? Math.round((totalSpent / budgetTotal) * 100) : 0}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 relative overflow-hidden rounded-full">
              <div className="progress-bar absolute inset-y-0 left-0 bg-gold rounded-full" style={{ width: `${budgetTotal ? Math.min(100, (totalSpent / budgetTotal) * 100) : 0}%` }} />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {expenses.map(e => {
              const remaining = e.planned - e.spent;
              const pct = e.planned ? (e.spent / e.planned) * 100 : 0;
              return (
                <div key={e.id} className="bg-white border hairline rounded-card p-6 group hover:border-gold transition-all duration-300">
                  <div className="grid md:grid-cols-[1fr,180px,180px,40px] gap-5 items-end">
                    <div>
                      <label className="budget-label">Kategória</label>
                      <input type="text" value={e.category} onChange={(ev) => updateExpense(e.id, 'category', ev.target.value)} className="w-full bg-transparent border-b hairline py-1.5 serif text-lg" style={{ color: '#1E1910' }} />
                    </div>
                    <div>
                      <label className="budget-label">Naplánované</label>
                      <div className="budget-input-wrapper">
                        <input type="number" value={e.planned || ''} onChange={(ev) => updateExpense(e.id, 'planned', ev.target.value)} placeholder="0" />
                        <span className="gold serif text-lg ml-1">€</span>
                      </div>
                    </div>
                    <div>
                      <label className="budget-label">Minuté</label>
                      <div className="budget-input-wrapper" style={{ borderColor: e.spent > e.planned ? '#DC2626' : undefined }}>
                        <input type="number" value={e.spent || ''} onChange={(ev) => updateExpense(e.id, 'spent', ev.target.value)} placeholder="0" style={{ color: e.spent > e.planned ? '#DC2626' : '#1E1910' }} />
                        <span className={e.spent > e.planned ? 'text-red-600 serif text-lg ml-1' : 'gold serif text-lg ml-1'}>€</span>
                      </div>
                    </div>
                    <button onClick={() => removeExpense(e.id)} className="opacity-0 group-hover:opacity-100 gold hover:text-red-600 transition self-end mb-2"><Trash2 size={14} /></button>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="progress-bar h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: e.spent > e.planned ? '#DC2626' : '#9B7A45' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#6B5946' }}>{remaining >= 0 ? `Zostáva ${remaining.toLocaleString('sk-SK')} €` : `Prekročené o ${Math.abs(remaining).toLocaleString('sk-SK')} €`}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border hairline rounded-card p-6">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4">Pridať kategóriu</p>
            <div className="grid md:grid-cols-[1fr,180px,180px,auto] gap-5 items-end">
              <div>
                <label className="budget-label">Kategória</label>
                <input type="text" value={newExpense.category} onChange={(ev) => setNewExpense({ ...newExpense, category: ev.target.value })} placeholder="Napr. Fotokútik" className="w-full bg-transparent border-b hairline py-1.5" />
              </div>
              <div>
                <label className="budget-label">Naplánované</label>
                <div className="budget-input-wrapper">
                  <input type="number" value={newExpense.planned} onChange={(ev) => setNewExpense({ ...newExpense, planned: ev.target.value })} placeholder="0" />
                  <span className="gold serif text-lg ml-1">€</span>
                </div>
              </div>
              <div>
                <label className="budget-label">Minuté</label>
                <div className="budget-input-wrapper">
                  <input type="number" value={newExpense.spent} onChange={(ev) => setNewExpense({ ...newExpense, spent: ev.target.value })} placeholder="0" />
                  <span className="gold serif text-lg ml-1">€</span>
                </div>
              </div>
              <button onClick={addExpense} className="border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase hover:bg-gold hover:text-white transition flex items-center gap-2"><Plus size={14} /> Pridať</button>
            </div>
          </div>
        </ModuleShell>
      )}

      {activeModule === 'guests' && (
        <ModuleShell title="Hostia" subtitle="Tí, s ktorými chcete zdieľať svoj veľký deň" onBack={() => setActiveModule('home')}>
          <div className="grid md:grid-cols-4 gap-4 mb-8 stagger">
            <StatCard label="Celkom" value={guests.length} />
            <StatCard label="Dospelí" value={guests.filter(g => g.type === 'Dospelý').length} />
            <StatCard label="Deti" value={guests.filter(g => g.type === 'Dieťa').length} />
            <StatCard label="Potvrdení" value={confirmedGuests} />
          </div>

          {guests.some(g => g.rsvp === 'Potvrdená') && (
            <div className="bg-white border hairline rounded-card p-6 mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4 flex items-center gap-2"><UtensilsCrossed size={12} /> Pre catering — potvrdení hostia</p>
              <div className="grid grid-cols-3 gap-4">
                <div><div className="serif text-3xl font-normal" style={{ color: '#1E1910' }}>{mealCounts['Celá porcia'] || 0}</div><div className="text-xs mt-1" style={{ color: '#4A3F2E' }}>Celá porcia</div></div>
                <div><div className="serif text-3xl font-normal" style={{ color: '#1E1910' }}>{mealCounts['Polovičná porcia'] || 0}</div><div className="text-xs mt-1" style={{ color: '#4A3F2E' }}>Polovičná porcia</div></div>
                <div><div className="serif text-3xl font-normal" style={{ color: '#1E1910' }}>{mealCounts['Bez jedla'] || 0}</div><div className="text-xs mt-1" style={{ color: '#4A3F2E' }}>Bez jedla</div></div>
              </div>
            </div>
          )}

          <div className="bg-white border hairline rounded-card p-6 mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-5">Pridať hosťa</p>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Meno</label>
                <input type="text" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} placeholder="Napr. Anna Nováková" className="w-full border-b hairline py-2 bg-transparent" onKeyPress={e => e.key === 'Enter' && addGuest()} />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Strana</label>
                <ElegantSelect value={newGuest.side} onChange={v => setNewGuest({ ...newGuest, side: v })} options={[{ value: 'Nevesta', label: 'Nevesta' }, { value: 'Ženích', label: 'Ženích' }, { value: 'Spoloční', label: 'Spoloční' }]} />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Typ</label>
              <div className="pill-group">
                <button className={`pill-btn ${newGuest.type === 'Dospelý' ? 'active' : ''}`} onClick={() => setNewGuest({ ...newGuest, type: 'Dospelý' })}><User size={12} style={{ marginRight: 6 }} />Dospelý</button>
                <button className={`pill-btn ${newGuest.type === 'Dieťa' ? 'active' : ''}`} onClick={() => setNewGuest({ ...newGuest, type: 'Dieťa' })}><Baby size={12} style={{ marginRight: 6 }} />Dieťa</button>
              </div>
            </div>
            <div className="mb-5">
              <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Porcia jedla</label>
              <div className="pill-group">
                {['Celá porcia', 'Polovičná porcia', 'Bez jedla'].map(opt => (<button key={opt} className={`pill-btn ${newGuest.meal === opt ? 'active' : ''}`} onClick={() => setNewGuest({ ...newGuest, meal: opt })}>{opt}</button>))}
              </div>
            </div>
            {newGuest.type === 'Dieťa' && (
              <div className="mb-5 fade-in">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div onClick={() => setNewGuest({ ...newGuest, highChair: !newGuest.highChair })} className={`w-5 h-5 border rounded flex items-center justify-center transition ${newGuest.highChair ? 'bg-gold border-gold' : 'hairline'}`}>
                    {newGuest.highChair && <Check size={12} className="text-white" strokeWidth={2.5} />}
                  </div>
                  <span className="text-sm" style={{ color: '#1E1910' }}>Potrebuje detskú stoličku (high chair)</span>
                </label>
              </div>
            )}
            <div className="mb-5">
              <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Účasť</label>
              <div className="pill-group">
                {['Čaká sa', 'Potvrdená', 'Odmietol'].map(opt => (<button key={opt} className={`pill-btn ${newGuest.rsvp === opt ? 'active' : ''}`} onClick={() => setNewGuest({ ...newGuest, rsvp: opt })}>{opt}</button>))}
              </div>
            </div>
            <div className="mb-5">
              <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block flex items-center gap-1.5"><AlertCircle size={12} />Alergény a intolerancie</label>
              <input type="text" value={newGuest.allergies} onChange={e => setNewGuest({ ...newGuest, allergies: e.target.value })} placeholder="Napr. lepok, laktóza, orechy..." className="w-full border-b hairline py-2 bg-transparent" />
            </div>
            <button onClick={addGuest} className="border border-gold gold px-6 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition flex items-center gap-2"><Plus size={14} /> Pridať hosťa</button>
          </div>

          {/* BULK ADD — celá rodina naraz */}
          <details className="bg-white border hairline rounded-card p-6 mb-6">
            <summary className="text-[10px] tracking-[0.3em] uppercase gold cursor-pointer hover:opacity-70 select-none">
              Pridať celú rodinu naraz
            </summary>
            <div className="mt-5 grid md:grid-cols-[1fr,120px,auto] gap-4 items-end">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Priezvisko rodiny</label>
                <input type="text" value={bulkFamilyName} onChange={e => setBulkFamilyName(e.target.value)} placeholder="napr. Novákovci" className="w-full border-b hairline py-2 bg-transparent" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Počet členov</label>
                <input type="number" min="2" max="12" value={bulkFamilyCount} onChange={e => setBulkFamilyCount(Number(e.target.value))} className="w-full border-b hairline py-2 bg-transparent" />
              </div>
              <button onClick={addFamilyGuests} className="border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase hover:bg-gold hover:text-white transition flex items-center gap-2">
                <Plus size={14} /> Pridať rodinu
              </button>
            </div>
            <p className="text-xs italic mt-3" style={{ color: '#6B5946' }}>
              Vytvorí sa {bulkFamilyCount} prázdnych záznamov s predvyplneným priezviskom. Doplňte si krstné mená a detaily.
            </p>
          </details>

          {guests.length > 0 ? (
            <>
              {/* SEARCH + FILTER */}
              <div className="bg-white border hairline rounded-card p-4 mb-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Search size={16} className="gold flex-shrink-0 ml-1" />
                  <input
                    type="text"
                    value={guestSearch}
                    onChange={e => setGuestSearch(e.target.value)}
                    placeholder="Hľadať hosťa podľa mena alebo alergie..."
                    className="flex-1 bg-transparent border-0 py-1 text-sm"
                    style={{ color: '#1E1910' }}
                  />
                  {guestSearch && (
                    <button onClick={() => setGuestSearch('')} className="gold hover:opacity-60">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="pill-group">
                  {[
                    { val: 'all', label: `Všetci (${guests.length})` },
                    { val: 'confirmed', label: `Potvrdení (${guests.filter(g => g.rsvp === 'Potvrdená').length})` },
                    { val: 'pending', label: `Čakajúci (${guests.filter(g => g.rsvp === 'Čaká sa').length})` },
                    { val: 'rejected', label: `Odmietli (${guests.filter(g => g.rsvp === 'Odmietol').length})` },
                    { val: 'children', label: `Deti (${guests.filter(g => g.type === 'Dieťa').length})` },
                    { val: 'allergies', label: `Alergiky (${guests.filter(g => g.allergies).length})` },
                  ].map(opt => (
                    <button key={opt.val} className={`pill-btn ${guestFilter === opt.val ? 'active' : ''}`} onClick={() => setGuestFilter(opt.val)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BULK ACTIONS BAR — zobrazí sa keď je niečo vybrané */}
              {selectedGuests.length > 0 && (
                <div className="sticky top-16 z-30 bg-white border-2 border-gold rounded-card p-4 mb-4 shadow-lg fade-in flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="serif text-lg gold">{selectedGuests.length}</span>
                    <span className="text-xs" style={{ color: '#4A3F2E' }}>
                      {selectedGuests.length === 1 ? 'vybraný' : 'vybraných'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => bulkUpdateRsvp('Potvrdená')} className="text-[10px] tracking-[0.15em] uppercase gold hover:bg-[#EBE1CF] px-3 py-1.5 rounded-full border hairline">
                      ✓ Potvrdiť
                    </button>
                    <button onClick={() => bulkUpdateRsvp('Odmietol')} className="text-[10px] tracking-[0.15em] uppercase text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full border hairline">
                      ✕ Odmietol
                    </button>
                    {tables.length > 0 && (
                      <BulkAssignSelect tables={tables} onAssign={bulkAssignToTable} />
                    )}
                    <button onClick={bulkRemoveGuests} className="text-[10px] tracking-[0.15em] uppercase text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full border hairline flex items-center gap-1.5">
                      <Trash2 size={10} /> Zmazať
                    </button>
                    <button onClick={() => setSelectedGuests([])} className="text-[10px] tracking-[0.15em] uppercase gold hover:opacity-60 px-3 py-1.5">
                      Zrušiť výber
                    </button>
                  </div>
                </div>
              )}

              {/* Header s "Select all" */}
              {filteredGuests.length > 0 && (
                <div className="flex items-center justify-between px-5 py-2 text-xs" style={{ color: '#6B5946' }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                      onChange={() => selectAllGuests(filteredGuests)}
                      className="accent-[#9B7A45]"
                    />
                    <span>Vybrať všetkých ({filteredGuests.length})</span>
                  </label>
                </div>
              )}

              {filteredGuests.length === 0 ? (
                <div className="text-center py-12 serif italic text-base" style={{ color: '#6B5946' }}>
                  Žiadni hostia nezodpovedajú filtrom
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGuests.map(g => {
                    const isSelected = selectedGuests.includes(g.id);
                    return (
                      <div key={g.id} className={`bg-white border rounded-soft p-5 group transition-all duration-300 ${isSelected ? 'border-gold shadow-md' : 'hairline hover:border-gold hover:shadow-lg'}`}>
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleGuestSelection(g.id)}
                              className="accent-[#9B7A45] w-4 h-4 flex-shrink-0"
                            />
                            <div className="initial-chip" style={{ position: 'static' }}>{getInitials(g.name)}</div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {g.type === 'Dieťa' ? <Baby size={14} className="gold" /> : <User size={14} className="gold" />}
                                <span className="serif text-lg" style={{ color: '#1E1910' }}>{g.name}</span>
                                <span className="text-xs" style={{ color: '#6B5946' }}>· {g.side}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: '#4A3F2E' }}>
                                <span className={`px-2 py-0.5 rounded-full ${g.rsvp === 'Potvrdená' ? 'bg-[#EBE1CF] gold' : g.rsvp === 'Odmietol' ? 'bg-red-50 text-red-600' : 'bg-gray-50'}`}>{g.rsvp}</span>
                                <span>· {g.meal}</span>
                                {g.highChair && <span className="gold">· Detská stolička</span>}
                                {g.allergies && <span className="text-amber-700">· ⚠ {g.allergies}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingGuest(g)} className="text-xs tracking-wider uppercase gold hover:opacity-60 px-3 py-1.5"><Edit2 size={12} /></button>
                            <button onClick={() => removeGuest(g.id)} className="text-xs tracking-wider uppercase text-red-500 hover:text-red-700 px-3 py-1.5"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 serif italic text-lg" style={{ color: '#6B5946' }}>Zatiaľ nie sú pridaní žiadni hostia</div>
          )}

          {editingGuest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" style={{ backgroundColor: 'rgba(44, 36, 22, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setEditingGuest(null)}>
              <div className="bg-white rounded-card max-w-lg w-full p-8 modal-content max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="serif text-2xl font-normal" style={{ color: '#1E1910' }}>Upraviť hosťa</h3>
                  <button onClick={() => setEditingGuest(null)} className="gold hover:opacity-60"><X size={20} /></button>
                </div>
                <div className="space-y-5">
                  <div><label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Meno</label><input type="text" value={editingGuest.name} onChange={e => setEditingGuest({ ...editingGuest, name: e.target.value })} className="w-full border-b hairline py-2 bg-transparent" /></div>
                  <div><label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Strana</label><ElegantSelect value={editingGuest.side} onChange={v => setEditingGuest({ ...editingGuest, side: v })} options={[{ value: 'Nevesta', label: 'Nevesta' }, { value: 'Ženích', label: 'Ženích' }, { value: 'Spoloční', label: 'Spoloční' }]} /></div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Typ</label>
                    <div className="pill-group">
                      <button className={`pill-btn ${editingGuest.type === 'Dospelý' ? 'active' : ''}`} onClick={() => setEditingGuest({ ...editingGuest, type: 'Dospelý' })}>Dospelý</button>
                      <button className={`pill-btn ${editingGuest.type === 'Dieťa' ? 'active' : ''}`} onClick={() => setEditingGuest({ ...editingGuest, type: 'Dieťa' })}>Dieťa</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Porcia jedla</label>
                    <div className="pill-group">{['Celá porcia', 'Polovičná porcia', 'Bez jedla'].map(opt => (<button key={opt} className={`pill-btn ${editingGuest.meal === opt ? 'active' : ''}`} onClick={() => setEditingGuest({ ...editingGuest, meal: opt })}>{opt}</button>))}</div>
                  </div>
                  {editingGuest.type === 'Dieťa' && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setEditingGuest({ ...editingGuest, highChair: !editingGuest.highChair })} className={`w-5 h-5 border rounded flex items-center justify-center transition ${editingGuest.highChair ? 'bg-gold border-gold' : 'hairline'}`}>
                        {editingGuest.highChair && <Check size={12} className="text-white" strokeWidth={2.5} />}
                      </div>
                      <span className="text-sm" style={{ color: '#1E1910' }}>Potrebuje detskú stoličku</span>
                    </label>
                  )}
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Účasť</label>
                    <div className="pill-group">{['Čaká sa', 'Potvrdená', 'Odmietol'].map(opt => (<button key={opt} className={`pill-btn ${editingGuest.rsvp === opt ? 'active' : ''}`} onClick={() => setEditingGuest({ ...editingGuest, rsvp: opt })}>{opt}</button>))}</div>
                  </div>
                  <div><label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Alergény</label><input type="text" value={editingGuest.allergies} onChange={e => setEditingGuest({ ...editingGuest, allergies: e.target.value })} className="w-full border-b hairline py-2 bg-transparent" /></div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => { setGuests(guests.map(x => x.id === editingGuest.id ? editingGuest : x)); setEditingGuest(null); }} className="flex-1 bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:opacity-90 transition">Uložiť</button>
                    <button onClick={() => setEditingGuest(null)} className="border hairline gold px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition">Zrušiť</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModuleShell>
      )}

      {activeModule === 'seating' && (
        <ModuleShell title="Plán sály" subtitle="Interaktívna mapa — rozmiestnite stoly a prvky sály" onBack={() => setActiveModule('home')}>
          <SeatingModule
            guests={guests}
            tables={tables}
            setTables={setTables}
            newTable={newTable}
            setNewTable={setNewTable}
            addTable={addTable}
            removeTable={removeTable}
            updateTablePosition={updateTablePosition}
            assignGuestToTable={assignGuestToTable}
            unassignGuest={unassignGuest}
            unassignedGuests={unassignedGuests}
            getInitials={getInitials}
            sceneElements={sceneElements}
            setSceneElements={setSceneElements}
            addSceneElement={addSceneElement}
            removeSceneElement={removeSceneElement}
            updateScenePosition={updateScenePosition}
            updateSceneScale={updateSceneScale}
            updateSceneRotation={updateSceneRotation}
            seatingView={seatingView}
            setSeatingView={setSeatingView}
            setActiveModule={setActiveModule}
          />
        </ModuleShell>
      )}

      {/* ============ TIMELINE — Harmonogram dňa D ============ */}
      {activeModule === 'timeline' && (
        <ModuleShell title="Harmonogram dňa D" subtitle="Časový rozpis — hodinu po hodine, aby všetko kĺzalo ako hodinky" onBack={() => setActiveModule('home')}>
          <div className="bg-white border hairline rounded-card p-6 mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4">Pridať udalosť</p>
            <div className="grid md:grid-cols-[120px,1fr,auto] gap-4 items-end">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Čas</label>
                <input type="time" value={newTimelineEvent.time} onChange={e => setNewTimelineEvent({ ...newTimelineEvent, time: e.target.value })} className="w-full border-b hairline py-2 bg-transparent" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Udalosť</label>
                <input type="text" value={newTimelineEvent.event} onChange={e => setNewTimelineEvent({ ...newTimelineEvent, event: e.target.value })} placeholder="Napr. Skupinová fotka rodiny" className="w-full border-b hairline py-2 bg-transparent" onKeyPress={e => e.key === 'Enter' && addTimelineEvent()} />
              </div>
              <button onClick={addTimelineEvent} className="border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase hover:bg-gold hover:text-white transition flex items-center gap-2">
                <Plus size={14} /> Pridať
              </button>
            </div>
          </div>

          {timeline.length > 0 ? (
            <div className="relative pl-10 md:pl-14">
              {/* Vertical line */}
              <div className="absolute left-3 md:left-5 top-3 bottom-3 w-px bg-gold opacity-30" />

              <div className="space-y-4">
                {timeline.map((ev) => (
                  <div key={ev.id} className="relative group">
                    {/* Dot */}
                    <div className="absolute -left-[28px] md:-left-[42px] top-5 w-3 h-3 rounded-full bg-gold border-2 border-white shadow-md" style={{ boxShadow: '0 0 0 3px rgba(176, 141, 87, 0.15)' }} />

                    <div className="bg-white border hairline rounded-card p-5 hover:border-gold transition-all duration-300 hover:shadow-md">
                      <div className="grid md:grid-cols-[90px,1fr,auto] gap-4 items-start">
                        <input
                          type="time"
                          value={ev.time}
                          onChange={e => updateTimelineEvent(ev.id, 'time', e.target.value)}
                          className="serif text-xl gold bg-transparent border-0 py-1 w-24"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={ev.event}
                            onChange={e => updateTimelineEvent(ev.id, 'event', e.target.value)}
                            className="serif text-lg w-full bg-transparent border-0 py-1"
                            style={{ color: '#1E1910' }}
                          />
                          <input
                            type="text"
                            value={ev.notes}
                            onChange={e => updateTimelineEvent(ev.id, 'notes', e.target.value)}
                            placeholder="Poznámka (voliteľná)..."
                            className="w-full text-xs mt-1 bg-transparent border-0"
                            style={{ color: '#6B5946' }}
                          />
                        </div>
                        <button onClick={() => removeTimelineEvent(ev.id)} className="opacity-0 group-hover:opacity-100 gold hover:text-red-600 transition mt-2">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 serif italic text-lg" style={{ color: '#6B5946' }}>Zatiaľ žiadne udalosti</div>
          )}

          <div className="mt-10 bg-white border hairline rounded-card p-6 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-3">Tip od JanVeil</p>
            <p className="serif italic text-base mb-4" style={{ color: '#1E1910' }}>
              "Harmonogram vytlačte a dajte ho družičkám, svedkom, DJ-ovi a fotografovi.<br />
              Keď každý vie čo a kedy, svadba ide ako hodinky."
            </p>
            <button onClick={() => setShowExport(true)} className="text-xs tracking-wider uppercase gold border border-gold rounded-full px-5 py-2 hover:bg-gold hover:text-white transition inline-flex items-center gap-2">
              <FileText size={12} /> Exportovať do PDF
            </button>
          </div>
        </ModuleShell>
      )}

      {/* ============ DOCUMENTS — Doklady a papierovanie ============ */}
      {activeModule === 'documents' && (
        <ModuleShell title="Doklady a papierovanie" subtitle="Všetko okolo matriky, občianskych a zmeny priezviska" onBack={() => setActiveModule('home')}>
          <div className="mb-10 bg-white border hairline rounded-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-wider uppercase gold">Vybavené</span>
              <div className="flex items-baseline gap-3">
                <span className="serif text-4xl font-normal gold">{documents.length ? Math.round((documentsDone / documents.length) * 100) : 0}%</span>
                <span className="text-sm" style={{ color: '#6B5946' }}>{documentsDone} / {documents.length}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 relative overflow-hidden rounded-full">
              <div className="progress-bar absolute inset-y-0 left-0 bg-gold rounded-full" style={{ width: `${documents.length ? (documentsDone / documents.length) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="bg-white border hairline rounded-card p-2 mb-6">
            <ul className="divide-y hairline">
              {documents.map(d => (
                <li key={d.id} className="flex items-center gap-4 py-3 px-4 group rounded hover:bg-[#F5EFE3] transition">
                  <button onClick={() => toggleDocument(d.id)}
                    className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center rounded transition-all duration-300 ${d.done ? 'bg-gold border-gold' : 'hairline hover:border-gold'}`}>
                    {d.done && <Check size={12} className="text-white" strokeWidth={2.5} />}
                  </button>
                  <span className={`flex-1 text-sm transition ${d.done ? 'line-through opacity-40' : ''}`} style={{ color: '#1E1910' }}>{d.task}</span>
                  <button onClick={() => removeDocument(d.id)} className="opacity-0 group-hover:opacity-100 transition gold hover:text-red-600"><Trash2 size={13} /></button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border hairline rounded-card p-6">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4">Pridať vlastný doklad</p>
            <div className="grid grid-cols-[1fr,auto] gap-3 items-end">
              <input type="text" value={newDocument} onChange={e => setNewDocument(e.target.value)} placeholder="Napr. Overený preklad rodného listu" className="border-b hairline py-2 bg-transparent" onKeyPress={e => e.key === 'Enter' && addDocument()} />
              <button onClick={addDocument} className="border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase hover:bg-gold hover:text-white transition flex items-center gap-2">
                <Plus size={14} /> Pridať
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#F5EFE3] to-[#EBE1CF] border hairline rounded-card p-6">
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-3">Kam ísť a kedy?</p>
            <ul className="text-sm space-y-2" style={{ color: '#1E1910' }}>
              <li>• <strong>Matrika</strong> — minimálne 7 dní pred svadbou (ideálne 1-3 mesiace)</li>
              <li>• <strong>Zmena priezviska</strong> — občiansky + pas do 30 dní po svadbe</li>
              <li>• <strong>Banka / poisťovne</strong> — stačí v prvých týždňoch, všade len s kópiou sobášneho listu</li>
              <li>• <strong>Cudzinec ako ženích/nevesta</strong> — vybaviť si potvrdenie o spôsobilosti aspoň 2 mesiace vopred</li>
            </ul>
          </div>
        </ModuleShell>
      )}

      {/* ============ DIARY — Môj denník ============ */}
      {activeModule === 'diary' && (
        <ModuleShell title="Môj denník" subtitle="Vaše myšlienky, inšpirácie, nápady" onBack={() => setActiveModule('home')}>
          <div className="bg-white border hairline rounded-card p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase gold mb-2">Pre vaše oči</p>
                <p className="serif italic text-base" style={{ color: '#6B5946' }}>
                  Napíšte si sem čokoľvek. Nápady, pocity, čo sa vám páči, čo si treba zapamätať.
                </p>
              </div>
              <MessageCircle size={24} strokeWidth={1.2} className="gold opacity-40" />
            </div>
            <textarea
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
              placeholder="Dnes som videla šaty ktoré sa mi páčia..."
              className="w-full min-h-[500px] bg-transparent border-0 text-base leading-relaxed resize-y serif italic"
              style={{ color: '#1E1910', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            />
            <div className="pt-4 border-t hairline flex items-center justify-between text-xs" style={{ color: '#6B5946' }}>
              <span>{diary.length} znakov</span>
              <span>Automaticky uložené v tomto prehliadači</span>
            </div>
          </div>
        </ModuleShell>
      )}

      {/* EXPORT MODAL */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" style={{ backgroundColor: 'rgba(44, 36, 22, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowExport(false)}>
          <div className="bg-white rounded-card max-w-2xl w-full p-8 modal-content max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="serif text-2xl font-normal mb-1" style={{ color: '#1E1910' }}>Exportovať plánovač</h3>
                <p className="text-xs" style={{ color: '#6B5946' }}>Vytvorte si prehľadný dokument — ideálne na vytlačenie alebo zdieľanie.</p>
              </div>
              <button onClick={() => setShowExport(false)} className="gold hover:opacity-60"><X size={20} /></button>
            </div>

            {/* Main actions — PDF + Excel */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => { exportToPDF(); setShowExport(false); }}
                className="group text-left bg-white border-2 border-gold rounded-card p-6 hover:bg-[#F5EFE3] transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <h4 className="serif text-xl font-normal mb-2" style={{ color: '#1E1910' }}>PDF dokument</h4>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#4A3F2E' }}>
                  Krásne formátovaný dokument na vytlačenie. Stiahne sa HTML súbor — otvorte ho v prehliadači a kliknite "Tlačiť → Uložiť ako PDF".
                </p>
                <span className="text-[10px] tracking-[0.2em] uppercase gold flex items-center gap-1.5">
                  Stiahnuť a vytlačiť <ChevronRight size={12} />
                </span>
              </button>

              <button
                onClick={() => { exportToExcel(); setShowExport(false); }}
                className="group text-left bg-white border hairline rounded-card p-6 hover:border-gold hover:bg-[#F5EFE3] transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet size={20} className="gold" strokeWidth={1.5} />
                </div>
                <h4 className="serif text-xl font-normal mb-2" style={{ color: '#1E1910' }}>Excel tabuľka</h4>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#4A3F2E' }}>
                  Kompletné dáta v 6 listoch: Prehľad, Úlohy, Rozpočet, Hostia, Catering, Zasadací poriadok.
                </p>
                <span className="text-[10px] tracking-[0.2em] uppercase gold flex items-center gap-1.5">
                  Stiahnuť Excel <ChevronRight size={12} />
                </span>
              </button>
            </div>

            {/* Advanced — backup JSON */}
            <details className="border-t hairline pt-5">
              <summary className="text-[10px] tracking-[0.3em] uppercase gold cursor-pointer hover:opacity-70 mb-3 select-none">
                Zálohovať pre pokračovanie neskôr (JSON)
              </summary>
              <p className="text-xs mb-3" style={{ color: '#6B5946' }}>
                Tento formát slúži len na obnovenie vašich dát — nie je na tlač. Uložte si text, a neskôr ho vložte cez "Načítať".
              </p>
              <div className="flex gap-2 mb-3 flex-wrap">
                <button onClick={copyToClipboard} className="border border-gold gold px-4 py-2 rounded-full text-xs tracking-wider uppercase hover:bg-gold hover:text-white transition flex items-center gap-2">
                  {copyFeedback ? <><Check size={12} /> Skopírované</> : <><Layers size={12} /> Kopírovať</>}
                </button>
                <button onClick={tryDownload} className="border hairline gold px-4 py-2 rounded-full text-xs tracking-wider uppercase hover:bg-gray-50 transition flex items-center gap-2">
                  <Download size={12} /> Stiahnuť .json
                </button>
              </div>
              <textarea
                id="export-textarea"
                readOnly
                value={getExportJson()}
                className="w-full h-40 border hairline rounded-soft p-3 text-xs font-mono bg-[#F5EFE3] resize-none"
                style={{ color: '#1E1910' }}
                onClick={(e) => e.target.select()}
              />
            </details>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" style={{ backgroundColor: 'rgba(44, 36, 22, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => { setShowImport(false); setImportText(''); }}>
          <div className="bg-white rounded-card max-w-2xl w-full p-8 modal-content max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="serif text-2xl font-normal mb-1" style={{ color: '#1E1910' }}>Načítať dáta</h3>
                <p className="text-xs" style={{ color: '#6B5946' }}>Obnovte uložený plánovač zo súboru alebo z textu.</p>
              </div>
              <button onClick={() => { setShowImport(false); setImportText(''); }} className="gold hover:opacity-60"><X size={20} /></button>
            </div>

            <label className="inline-flex items-center gap-2 border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition cursor-pointer mb-5">
              <Upload size={14} /> Vybrať súbor
              <input type="file" accept=".json,application/json,text/plain" onChange={importFromFile} className="hidden" />
            </label>

            <p className="text-[10px] tracking-[0.2em] uppercase gold mb-2">Alebo vložte text</p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Vložte sem JSON dáta z exportu...'
              className="w-full h-48 border hairline rounded-soft p-4 text-xs font-mono bg-[#F5EFE3] resize-none"
              style={{ color: '#1E1910' }}
            />

            <div className="flex gap-3 pt-5">
              <button
                onClick={() => loadFromText(importText)}
                disabled={!importText.trim()}
                className="flex-1 bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Načítať údaje
              </button>
              <button onClick={() => { setShowImport(false); setImportText(''); }} className="border hairline gold px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition">
                Zrušiť
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SHARE LINK MODAL ============ */}
      {showShareLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" style={{ backgroundColor: 'rgba(44, 36, 22, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowShareLink(false)}>
          <div className="bg-white rounded-card max-w-xl w-full p-8 modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="serif text-2xl font-normal mb-1" style={{ color: '#1E1910' }}>Zdieľať plánovač</h3>
                <p className="text-xs" style={{ color: '#6B5946' }}>Pošlite odkaz partnerovi, rodičom alebo svedkom.</p>
              </div>
              <button onClick={() => setShowShareLink(false)} className="gold hover:opacity-60"><X size={20} /></button>
            </div>

            <div className="bg-[#F5EFE3] border hairline rounded-soft p-4 mb-4">
              <p className="text-[10px] tracking-[0.2em] uppercase gold mb-2">Váš odkaz</p>
              <textarea
                readOnly
                value={shareLink}
                rows={4}
                className="w-full bg-white border hairline rounded-soft p-3 text-xs font-mono resize-none"
                style={{ color: '#1E1910' }}
                onClick={(e) => e.target.select()}
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareLink);
                    alert('Odkaz skopírovaný do schránky!');
                  } catch { alert('Skopírovanie zlyhalo. Označte text ručne a skopírujte.'); }
                }}
                className="border border-gold gold px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition flex items-center gap-2"
              >
                <Copy size={14} /> Kopírovať odkaz
              </button>
              <a
                href={`mailto:?subject=${encodeURIComponent('Náš svadobný plánovač')}&body=${encodeURIComponent(`Ahoj,\n\nposielam ti odkaz na náš svadobný plánovač — môžeš si tu pozrieť úlohy, rozpočet, hostí a všetko ostatné:\n\n${shareLink}\n\n— Pracovali sme na ňom cez salón JanVeil ♡`)}`}
                className="border hairline gold px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Mail size={14} /> Poslať emailom
              </a>
            </div>

            <div className="mt-5 pt-5 border-t hairline">
              <p className="text-xs italic" style={{ color: '#6B5946' }}>
                Pozor: Odkaz obsahuje všetky vaše dáta. Keď niekto otvorí odkaz, vidí presne to isté čo vy.
                Na obnovenie dát stačí vložiť odkaz do prehliadača.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ STYLE QUIZ MODAL ============ */}
      {showStyleQuiz && (
        <StyleQuizModal onClose={() => setShowStyleQuiz(false)} />
      )}


      {/* ============ UNDO TOAST ============ */}
      {showUndoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in">
          <div className="bg-[#1E1910] text-white rounded-full shadow-2xl px-5 py-3 flex items-center gap-4">
            <span className="text-xs">{showUndoToast.label}</span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase gold hover:text-white transition border border-gold rounded-full px-3 py-1"
            >
              <Undo2 size={11} /> Vrátiť
            </button>
            <button onClick={() => setShowUndoToast(null)} className="text-white opacity-50 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ SEATING MODULE ============ */
function SeatingModule({ guests, tables, newTable, setNewTable, addTable, removeTable, updateTablePosition, assignGuestToTable, unassignGuest, unassignedGuests, getInitials, sceneElements, addSceneElement, removeSceneElement, updateScenePosition, updateSceneScale, updateSceneRotation, seatingView, setSeatingView, setActiveModule }) {
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const sceneTypes = [
    { value: 'DJ', label: 'DJ', Icon: Music },
    { value: 'Parket', label: 'Parket', Icon: Users },
    { value: 'Bar', label: 'Bar', Icon: Martini },
    { value: 'CandyBar', label: 'Candy Bar', Icon: Candy },
    { value: 'Svedske', label: 'Švédske stoly', Icon: Buffet },
    { value: 'Vchod', label: 'Vchod', Icon: DoorOpen },
    { value: 'Vychod', label: 'Východ', Icon: LogOut },
    { value: 'Svetelny', label: 'Svetelný nápis', Icon: Lightbulb },
    { value: 'Torta', label: 'Torta', Icon: Cake },
    { value: 'Foto', label: 'Fotokútik', Icon: Camera },
    { value: 'Kvety', label: 'Výzdoba', Icon: Flower2 },
  ];

  // Unified drag handler for tables, scenes, and their controls
  const startInteraction = (e, payload) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (payload.mode === 'move') {
      const item = payload.kind === 'table' ? tables.find(t => t.id === payload.id) : sceneElements.find(s => s.id === payload.id);
      if (!item) return;
      setDragState({
        mode: 'move',
        kind: payload.kind,
        id: payload.id,
        offsetX: clientX - rect.left - item.x,
        offsetY: clientY - rect.top - item.y,
      });
    } else if (payload.mode === 'resize') {
      const item = sceneElements.find(s => s.id === payload.id);
      if (!item) return;
      setDragState({
        mode: 'resize',
        id: payload.id,
        startX: clientX,
        startY: clientY,
        startScale: item.scale || 1,
      });
    } else if (payload.mode === 'rotate') {
      const item = sceneElements.find(s => s.id === payload.id);
      if (!item) return;
      // Get element center
      const el = document.getElementById(`scene-${payload.id}`);
      if (!el) return;
      const elRect = el.getBoundingClientRect();
      const cx = elRect.left + elRect.width / 2;
      const cy = elRect.top + elRect.height / 2;
      setDragState({
        mode: 'rotate',
        id: payload.id,
        centerX: cx,
        centerY: cy,
        startAngle: Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI,
        startRotation: item.rotation || 0,
      });
    }
  };

  useEffect(() => {
    if (!dragState) return;

    const onMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (dragState.mode === 'move') {
        let x = clientX - rect.left - dragState.offsetX;
        let y = clientY - rect.top - dragState.offsetY;
        x = Math.max(0, Math.min(x, rect.width - 50));
        y = Math.max(0, Math.min(y, rect.height - 50));
        if (dragState.kind === 'table') {
          updateTablePosition(dragState.id, x, y);
        } else {
          updateScenePosition(dragState.id, x, y);
        }
      } else if (dragState.mode === 'resize') {
        const dx = clientX - dragState.startX;
        const dy = clientY - dragState.startY;
        const delta = (dx + dy) / 100;
        const newScale = Math.max(0.5, Math.min(2.5, dragState.startScale + delta));
        updateSceneScale(dragState.id, newScale);
      } else if (dragState.mode === 'rotate') {
        const currentAngle = Math.atan2(clientY - dragState.centerY, clientX - dragState.centerX) * 180 / Math.PI;
        const newRotation = dragState.startRotation + (currentAngle - dragState.startAngle);
        updateSceneRotation(dragState.id, newRotation);
      }
    };

    const onUp = () => setDragState(null);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragState, updateTablePosition, updateScenePosition, updateSceneScale, updateSceneRotation]);

  // Click outside scene element to deselect
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-scene-id]') && !e.target.closest('[data-handle]')) {
        setSelectedElement(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (guests.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="serif italic text-xl mb-4" style={{ color: '#6B5946' }}>Najprv pridajte hostí</p>
        <button onClick={() => setActiveModule('guests')} className="border border-gold gold px-8 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition">Prejsť na Hostia</button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border hairline rounded-card p-6 mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase gold mb-5">Pridať stôl</p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Názov stolu</label>
            <input value={newTable.name} onChange={e => setNewTable({ ...newTable, name: e.target.value })} onKeyPress={e => e.key === 'Enter' && addTable()} placeholder="Napr. Rodina nevesty" className="w-full border-b hairline py-2 bg-transparent" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Počet miest</label>
            <input type="number" min="1" max="30" value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: e.target.value })} className="w-full border-b hairline py-2 bg-transparent" />
          </div>
        </div>
        <div className="mb-5">
          <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Tvar stolu</label>
          <div className="pill-group">
            <button className={`pill-btn ${newTable.shape === 'Okrúhly' ? 'active' : ''}`} onClick={() => setNewTable({ ...newTable, shape: 'Okrúhly' })}><Circle size={11} style={{ marginRight: 6 }} />Okrúhly</button>
            <button className={`pill-btn ${newTable.shape === 'Rovný' ? 'active' : ''}`} onClick={() => setNewTable({ ...newTable, shape: 'Rovný' })}><Square size={11} style={{ marginRight: 6 }} />Rovný</button>
          </div>
        </div>
        <button onClick={addTable} className="border border-gold gold px-6 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition flex items-center gap-2"><Plus size={14} /> Pridať stôl</button>
      </div>

      {tables.length > 0 && (
        <div className="bg-white border hairline rounded-card p-6 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4 flex items-center gap-2"><Layers size={12} />Pridať prvky sály</p>
          <div className="flex flex-wrap gap-2">
            {sceneTypes.map(s => {
              const Icon = s.Icon;
              return (
                <button key={s.value} onClick={() => addSceneElement(s.value)}
                  className="inline-flex items-center gap-2 px-4 py-2 border hairline rounded-full text-xs tracking-wider uppercase gold hover:border-gold hover:bg-[#F5EFE3] transition">
                  <Icon size={13} /> {s.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs italic mt-3" style={{ color: '#6B5946' }}>Kliknite na prvok v mape pre zobrazenie ovládačov (posunúť, zväčšiť, otočiť).</p>
        </div>
      )}

      {/* UNASSIGNED GUESTS with fixed-positioned dropdown */}
      {unassignedGuests.length > 0 && (
        <div className="bg-white border hairline rounded-card p-6 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase gold mb-4">Nezaradení hostia ({unassignedGuests.length})</p>
          {tables.length === 0 ? (
            <p className="text-sm italic" style={{ color: '#6B5946' }}>Najprv pridajte aspoň jeden stôl, potom môžete hostí priradiť.</p>
          ) : (
            <div className="space-y-2">
              {unassignedGuests.map((g) => (
                <div key={g.id} className="flex items-center gap-3 p-3 border hairline rounded-soft bg-[#F5EFE3]">
                  <div className="initial-chip" style={{ position: 'static', width: 34, height: 34, fontSize: 12 }}>{getInitials(g.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="serif text-base truncate" style={{ color: '#1E1910' }}>{g.name}</div>
                    <div className="text-xs" style={{ color: '#6B5946' }}>{g.type === 'Dieťa' ? 'Dieťa' : 'Dospelý'} · {g.side}</div>
                  </div>
                  <TableAssignSelect
                    tables={tables}
                    onAssign={(tableId) => assignGuestToTable(g.id, tableId)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tables.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="pill-group">
              <button className={`pill-btn ${seatingView === 'map' ? 'active' : ''}`} onClick={() => setSeatingView('map')}>Mapa sály</button>
              <button className={`pill-btn ${seatingView === 'list' ? 'active' : ''}`} onClick={() => setSeatingView('list')}>Zoznam stolov</button>
            </div>
            <p className="text-xs italic hidden sm:block" style={{ color: '#6B5946' }}>
              {seatingView === 'map' ? 'Klik pre výber · potiahnutie pre posun' : 'Zobrazenie všetkých stolov vedľa seba'}
            </p>
          </div>

          {seatingView === 'map' ? (
            <div ref={canvasRef} className="venue-canvas">
              {/* Tables */}
              {tables.map(t => {
                const tableGuests = guests.filter(g => t.seats.includes(g.id));
                const count = tableGuests.length;
                const size = t.shape === 'Okrúhly' ? 130 : 170;
                const height = t.shape === 'Okrúhly' ? 130 : 80;
                const containerSize = 220;

                const getChipPosition = (index) => {
                  if (t.shape === 'Okrúhly') {
                    const angle = (index / Math.max(count, 1)) * 2 * Math.PI - Math.PI / 2;
                    const radius = 85;
                    const cx = containerSize / 2, cy = containerSize / 2;
                    return { left: `${cx + radius * Math.cos(angle) - 18}px`, top: `${cy + radius * Math.sin(angle) - 18}px` };
                  } else {
                    const perRow = Math.ceil(count / 2);
                    const isTop = index < perRow;
                    const idxInRow = isTop ? index : index - perRow;
                    const totalInRow = isTop ? Math.min(perRow, count) : count - perRow;
                    const spacing = size / (totalInRow + 1);
                    const cx = containerSize / 2 - size / 2;
                    const x = cx + spacing * (idxInRow + 1) - 18;
                    const y = isTop ? (containerSize / 2 - height / 2 - 28) : (containerSize / 2 + height / 2 - 8);
                    return { left: `${x}px`, top: `${y}px` };
                  }
                };

                return (
                  <div
                    key={t.id}
                    className={`draggable-table ${dragState?.id === t.id ? 'dragging' : ''}`}
                    style={{ left: `${t.x}px`, top: `${t.y}px`, width: `${containerSize}px`, height: `${containerSize}px` }}
                    onMouseDown={(e) => startInteraction(e, { mode: 'move', kind: 'table', id: t.id })}
                    onTouchStart={(e) => startInteraction(e, { mode: 'move', kind: 'table', id: t.id })}
                  >
                    <div style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: `${size}px`, height: `${height}px`,
                      borderRadius: t.shape === 'Okrúhly' ? '50%' : '10px',
                      border: '2px solid #9B7A45',
                      background: 'linear-gradient(135deg, #F5EFE3, #EBE1CF)',
                      boxShadow: 'inset 0 2px 8px rgba(176, 141, 87, 0.12), 0 4px 12px rgba(176, 141, 87, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                      pointerEvents: 'none',
                    }}>
                      <span className="serif italic" style={{ color: '#9B7A45', fontSize: '12px', fontWeight: 500 }}>{t.name}</span>
                      <span className="text-[10px] tracking-wider uppercase" style={{ color: '#9B7A45', marginTop: 2 }}>{tableGuests.length} / {t.capacity}</span>
                    </div>

                    {tableGuests.map((g, i) => (
                      <div
                        key={g.id}
                        className={`initial-chip ${g.type === 'Dieťa' ? 'child' : ''}`}
                        style={{ position: 'absolute', ...getChipPosition(i) }}
                        title={`${g.name}${g.type === 'Dieťa' ? ' (dieťa)' : ''} — klik pre odstránenie`}
                        onClick={(e) => { e.stopPropagation(); unassignGuest(g.id); }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {getInitials(g.name)}
                      </div>
                    ))}

                    <button
                      onClick={(e) => { e.stopPropagation(); removeTable(t.id); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute top-0 right-4 w-6 h-6 bg-white border border-gold rounded-full flex items-center justify-center gold hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition"
                      style={{ opacity: 0.7 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}

              {/* Scene elements with resize & rotate */}
              {sceneElements.map(s => {
                const def = sceneTypes.find(x => x.value === s.type);
                const Icon = def?.Icon || Layers;
                const isSelected = selectedElement === s.id;
                const scale = s.scale || 1;
                const rotation = s.rotation || 0;

                return (
                  <div
                    key={s.id}
                    id={`scene-${s.id}`}
                    data-scene-id={s.id}
                    className="scene-wrap"
                    style={{
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      zIndex: isSelected ? 50 : 10,
                    }}
                  >
                    <div
                      className={`scene-element ${dragState?.id === s.id && dragState?.mode === 'move' ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
                      onMouseDown={(e) => { setSelectedElement(s.id); startInteraction(e, { mode: 'move', kind: 'scene', id: s.id }); }}
                      onTouchStart={(e) => { setSelectedElement(s.id); startInteraction(e, { mode: 'move', kind: 'scene', id: s.id }); }}
                      onClick={(e) => { e.stopPropagation(); setSelectedElement(s.id); }}
                    >
                      <Icon size={14} />
                      {def?.label || s.type}
                    </div>

                    {/* Controls when selected */}
                    {isSelected && (
                      <>
                        {/* Remove (top-right) */}
                        <button
                          data-handle="remove"
                          className="handle remove"
                          style={{ top: -12, right: -12 }}
                          onClick={(e) => { e.stopPropagation(); removeSceneElement(s.id); setSelectedElement(null); }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <X size={12} />
                        </button>
                        {/* Rotate (top-left) */}
                        <button
                          data-handle="rotate"
                          className="handle rotate"
                          style={{ top: -12, left: -12 }}
                          onMouseDown={(e) => startInteraction(e, { mode: 'rotate', id: s.id })}
                          onTouchStart={(e) => startInteraction(e, { mode: 'rotate', id: s.id })}
                        >
                          <RotateCw size={11} />
                        </button>
                        {/* Resize (bottom-right) */}
                        <button
                          data-handle="resize"
                          className="handle resize"
                          style={{ bottom: -12, right: -12 }}
                          onMouseDown={(e) => startInteraction(e, { mode: 'resize', id: s.id })}
                          onTouchStart={(e) => startInteraction(e, { mode: 'resize', id: s.id })}
                        >
                          <Maximize2 size={11} />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border hairline rounded-full px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase gold pointer-events-none">
                <Move size={11} className="inline mr-2" />Potiahnite · klikom vyberte prvok
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {tables.map(t => {
                const tableGuests = guests.filter(g => t.seats.includes(g.id));
                const isFull = tableGuests.length >= t.capacity;
                return (
                  <div key={t.id} className="card-hover rounded-card bg-white border hairline p-6 group"
                    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="serif text-xl font-normal mb-1" style={{ color: '#1E1910' }}>{t.name}</h3>
                          <p className="text-[10px] tracking-[0.2em] uppercase gold">{t.shape} · {tableGuests.length} / {t.capacity}</p>
                        </div>
                        <button onClick={() => removeTable(t.id)} className="opacity-0 group-hover:opacity-100 gold hover:text-red-600 transition"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex justify-center my-5">
                        <div style={{
                          width: t.shape === 'Okrúhly' ? '120px' : '150px',
                          height: t.shape === 'Okrúhly' ? '120px' : '70px',
                          borderRadius: t.shape === 'Okrúhly' ? '50%' : '8px',
                          border: '2px solid #9B7A45',
                          background: 'linear-gradient(135deg, #F5EFE3, #EBE1CF)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: 'inset 0 2px 8px rgba(176, 141, 87, 0.12)',
                        }}>
                          <span className="serif italic gold text-sm">{t.capacity}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div className="progress-bar h-full bg-gold" style={{ width: `${(tableGuests.length / t.capacity) * 100}%` }} />
                      </div>
                      {tableGuests.length > 0 ? (
                        <ul className="space-y-1.5">
                          {tableGuests.map(g => (
                            <li key={g.id} className="flex items-center justify-between text-sm py-0.5 group/item" style={{ color: '#1E1910' }}>
                              <span className="flex items-center gap-2 text-sm">
                                {g.type === 'Dieťa' ? <Baby size={11} className="gold" /> : <User size={11} className="gold" />}
                                {g.name}
                              </span>
                              <button onClick={() => unassignGuest(g.id)} className="opacity-0 group-hover/item:opacity-100 gold hover:text-red-600 transition"><X size={12} /></button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm italic text-center py-2" style={{ color: '#6B5946' }}>Prázdny stôl</p>
                      )}
                      {isFull && <p className="text-[10px] tracking-[0.2em] uppercase text-amber-600 mt-3 text-center">Obsadený</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 serif italic text-lg" style={{ color: '#6B5946' }}>Pridajte prvý stôl vyššie</div>
      )}
    </>
  );
}

/* ============ FIXED-POSITIONED DROPDOWN (uses viewport coords, renders via portal) ============ */
function TableAssignSelect({ tables, onAssign }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, direction: 'down' });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = Math.min(320, tables.length * 60 + 40);
    const spaceBelow = window.innerHeight - rect.bottom;
    const direction = spaceBelow < menuHeight + 20 ? 'up' : 'down';
    const menuWidth = 280;
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
    setMenuPos({
      top: direction === 'down' ? rect.bottom + 8 : rect.top - menuHeight - 8,
      left,
      direction,
      width: menuWidth,
    });
  }, [open, tables.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const scrollHandler = () => setOpen(false);
    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', scrollHandler, true);
    window.addEventListener('resize', scrollHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('resize', scrollHandler);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 border border-gold rounded-full text-xs tracking-[0.15em] uppercase gold hover:bg-gold hover:text-white transition-all duration-300 whitespace-nowrap flex-shrink-0"
      >
        <Armchair size={12} /> Priradiť k stolu
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed bg-white border hairline rounded-soft shadow-2xl overflow-hidden max-h-[320px] overflow-y-auto"
          style={{
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            width: `${menuPos.width}px`,
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease',
            boxShadow: '0 20px 40px -10px rgba(44, 36, 22, 0.25), 0 0 0 1px rgba(176, 141, 87, 0.12)',
            borderColor: '#E5DFD3',
            borderRadius: '14px',
          }}
        >
          <div className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase gold border-b hairline bg-[#F5EFE3] sticky top-0">Vyberte stôl</div>
          {tables.map(t => {
            const full = t.seats.length >= t.capacity;
            return (
              <button
                key={t.id}
                type="button"
                disabled={full}
                onClick={() => { onAssign(t.id); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition border-b hairline last:border-b-0 ${full ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F5EFE3]'}`}
                style={{ color: '#1E1910' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="serif text-base">{t.name}</div>
                    <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: '#6B5946' }}>{t.shape} · {t.seats.length} / {t.capacity}</div>
                  </div>
                  {full && <span className="text-[10px] uppercase tracking-wider text-amber-600">Plný</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ============ CUSTOM DATE PICKER ============ */
function CustomDatePicker({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const months = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
  const weekdays = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  let firstWeekday = firstDay.getDay() - 1;
  if (firstWeekday < 0) firstWeekday = 6;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const selectedDate = value ? new Date(value) : null;
  if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

  const formatDate = (dStr) => { if (!dStr) return ''; const d = new Date(dStr); return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const selectDate = (day) => { const d = new Date(year, month, day); const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; onChange(iso); setOpen(false); };

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={`date-picker-trigger ${!value ? 'empty' : ''}`}>
        <Calendar size={14} className="gold" />
        {value ? formatDate(value) : placeholder}
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 bg-white border hairline rounded-card shadow-2xl z-50 p-5 w-[320px]"
          style={{ animation: 'fadeIn 0.25s ease', boxShadow: '0 20px 40px -10px rgba(44, 36, 22, 0.2), 0 0 0 1px rgba(176, 141, 87, 0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5EFE3] transition"><ChevronLeft size={16} className="gold" /></button>
            <div className="text-center">
              <div className="serif text-lg" style={{ color: '#1E1910' }}>{months[month]}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase gold">{year}</div>
            </div>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5EFE3] transition"><ChevronRight size={16} className="gold" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">{weekdays.map(w => (<div key={w} className="text-center text-[10px] tracking-wider uppercase py-1" style={{ color: '#6B5946' }}>{w}</div>))}</div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const thisDate = new Date(year, month, day); thisDate.setHours(0, 0, 0, 0);
              const isSelected = selectedDate && thisDate.getTime() === selectedDate.getTime();
              const isToday = thisDate.getTime() === today.getTime();
              const isPast = thisDate < today;
              return (
                <button key={i} type="button" onClick={() => selectDate(day)} disabled={isPast}
                  className={`w-10 h-10 rounded-full text-sm transition-all duration-200 flex items-center justify-center ${isSelected ? 'bg-gold text-white shadow-md' : ''} ${!isSelected && isToday ? 'border border-gold gold' : ''} ${!isSelected && !isToday && !isPast ? 'hover:bg-[#F5EFE3]' : ''} ${isPast && !isSelected ? 'opacity-30 cursor-not-allowed' : ''}`}
                  style={{ color: isSelected ? '#FFF' : isPast ? '#6B5946' : '#1E1910' }}>
                  {day}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t hairline">
            <button type="button" onClick={() => { const t = new Date(); setViewDate(t); }} className="text-[10px] tracking-[0.2em] uppercase gold hover:opacity-60">Dnes</button>
            <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="text-[10px] tracking-[0.2em] uppercase hover:opacity-60" style={{ color: '#6B5946' }}>Vymazať</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ElegantSelect({ value, onChange, options, compact }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const current = options.find(o => String(o.value) === String(value));
  const displayLabel = current?.label || options[0]?.label || '—';
  return (
    <div ref={ref} className="relative" style={{ minWidth: compact ? 140 : 180 }}>
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 ${compact ? 'py-1.5 px-3 text-sm border hairline rounded-full bg-white' : 'py-2 border-b hairline'} bg-transparent transition hover:opacity-70`}
        style={{ color: '#1E1910' }}>
        <span className={compact ? 'truncate' : 'text-left'}>{displayLabel}</span>
        <ChevronDown size={14} className={`gold transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border hairline rounded-soft shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto"
          style={{ animation: 'fadeIn 0.2s ease', boxShadow: '0 12px 32px -8px rgba(44, 36, 22, 0.18), 0 0 0 1px rgba(176, 141, 87, 0.1)', minWidth: '100%' }}>
          {options.map(opt => (
            <button key={String(opt.value)} type="button" disabled={opt.disabled}
              onClick={() => { if (!opt.disabled) { onChange(opt.value); setOpen(false); } }}
              className={`w-full text-left px-4 py-2.5 text-sm transition ${String(value) === String(opt.value) ? 'bg-[#EBE1CF]' : opt.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F5EFE3]'}`}
              style={{ color: String(value) === String(opt.value) ? '#9B7A45' : '#1E1910' }}>
              <span className="flex items-center justify-between">{opt.label}{String(value) === String(opt.value) && <Check size={12} className="gold" />}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleShell({ title, subtitle, onBack, children }) {
  return (
    <div className="fade-in max-w-6xl mx-auto px-6 py-12 lg:pl-72">
      <button onClick={onBack} className="text-xs tracking-[0.2em] uppercase gold hover:opacity-60 mb-6 flex items-center gap-2 transition lg:hidden"><Home size={12} /> Späť na prehľad</button>
      <div className="mb-12 pb-6 border-b hairline">
        <div className="h-px w-12 bg-gold mb-5" />
        <h1 className="serif text-4xl md:text-5xl font-normal mb-3" style={{ color: '#1E1910' }}>{title}</h1>
        <p className="serif italic text-lg" style={{ color: '#6B5946' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, accent, editable, onChange }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  return (
    <div className="card-hover rounded-card bg-white border hairline p-6"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}>
      <div className="relative z-10">
        <p className="text-[10px] tracking-[0.3em] uppercase gold mb-3">{label}</p>
        {editable && editing ? (
          <input type="number" value={temp} onChange={e => setTemp(e.target.value)}
            onBlur={() => { onChange(Number(temp) || 0); setEditing(false); }}
            onKeyPress={e => e.key === 'Enter' && (onChange(Number(temp) || 0), setEditing(false))}
            autoFocus className="serif text-3xl font-normal bg-transparent border-b hairline w-full" style={{ color: '#1E1910' }} />
        ) : (
          <div className={`serif text-3xl font-normal flex items-center gap-2 ${editable ? 'cursor-pointer hover:opacity-70' : ''}`}
            onClick={() => editable && setEditing(true)} style={{ color: accent ? '#B91C1C' : '#1E1910' }}>
            {value}
            {editable && <Edit2 size={14} className="gold opacity-40" />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ BULK ASSIGN SELECT — zjednodušený dropdown pre bulk actions ============ */
function BulkAssignSelect({ tables, onAssign }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] tracking-[0.15em] uppercase gold hover:bg-[#EBE1CF] px-3 py-1.5 rounded-full border hairline flex items-center gap-1.5"
      >
        <Armchair size={10} /> Priradiť k stolu <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border hairline rounded-soft shadow-2xl overflow-hidden min-w-[220px] max-h-[280px] overflow-y-auto z-50"
          style={{ animation: 'fadeIn 0.2s ease', boxShadow: '0 12px 32px -8px rgba(44, 36, 22, 0.2)' }}>
          {tables.map(t => {
            const full = t.seats.length >= t.capacity;
            return (
              <button
                key={t.id}
                disabled={full}
                onClick={() => { onAssign(t.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition border-b hairline last:border-b-0 ${full ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F5EFE3]'}`}
                style={{ color: '#1E1910' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="serif text-sm">{t.name}</div>
                    <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#6B5946' }}>{t.seats.length} / {t.capacity}</div>
                  </div>
                  {full && <span className="text-[9px] uppercase text-amber-600">Plný</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============ STYLE QUIZ MODAL ============ */
function StyleQuizModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'venue',
      q: 'Kde si predstavujete svadbu?',
      options: [
        { val: 'chateau', label: 'V zámku alebo klasickom sále', style: 'classic' },
        { val: 'garden', label: 'V záhrade alebo prírode', style: 'boho' },
        { val: 'modern', label: 'V modernom priestore / lofte', style: 'minimal' },
        { val: 'rustic', label: 'Na lúke alebo vinici', style: 'rustic' },
      ],
    },
    {
      id: 'feel',
      q: 'Akú atmosféru chcete?',
      options: [
        { val: 'elegant', label: 'Elegantná a klasická', style: 'classic' },
        { val: 'romantic', label: 'Romantická a snová', style: 'boho' },
        { val: 'clean', label: 'Čistá a minimalistická', style: 'minimal' },
        { val: 'warm', label: 'Útulná a rodinná', style: 'rustic' },
      ],
    },
    {
      id: 'dress',
      q: 'Aké šaty vás lákajú najviac?',
      options: [
        { val: 'princess', label: 'Bohatá sukňa, princeznovské', style: 'classic' },
        { val: 'lace', label: 'Čipkované, bohémske', style: 'boho' },
        { val: 'simple', label: 'Čisté línie, jednoduché', style: 'minimal' },
        { val: 'aline', label: 'Klasická A-línia', style: 'rustic' },
      ],
    },
    {
      id: 'palette',
      q: 'Vaša farebná paleta?',
      options: [
        { val: 'white', label: 'Biela + zlaté akcenty', style: 'classic' },
        { val: 'blush', label: 'Púdrové ružové + sušené kvety', style: 'boho' },
        { val: 'mono', label: 'Biela + čierna / sivá', style: 'minimal' },
        { val: 'earth', label: 'Zemské tóny + drevo', style: 'rustic' },
      ],
    },
    {
      id: 'detail',
      q: 'Aký detail je pre vás dôležitý?',
      options: [
        { val: 'veil', label: 'Dlhý závoj a klasická korunka', style: 'classic' },
        { val: 'flowers', label: 'Kvety vo vlasoch', style: 'boho' },
        { val: 'minimal', label: 'Jediný šperk, nič navyše', style: 'minimal' },
        { val: 'ribbon', label: 'Rustikálna stuha, makramé', style: 'rustic' },
      ],
    },
  ];

  const handleAnswer = (qId, option) => {
    const newAnswers = { ...answers, [qId]: option.style };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setStep(questions.length), 300);
    }
  };

  // Vyhodnotenie
  const result = (() => {
    const counts = {};
    Object.values(answers).forEach(s => { counts[s] = (counts[s] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const styles = {
      classic: { name: 'Klasická elegancia', desc: 'Ste žena s nadčasovým vkusom. Cítite sa najlepšie v klasických, dobre strihnutých šatách s korunkou a dlhým závojom.', dress: 'A-línia, princeznovské alebo korzetové šaty s bohatou sukňou' },
      boho: { name: 'Bohémska romantika', desc: 'Ste snová, romantická duša. Milujete prírodné materiály, čipku a voľnejšie siluety.', dress: 'Čipkované šaty, voľnejšie siluety s rukávmi, rustikálne detaily' },
      minimal: { name: 'Moderný minimalizmus', desc: 'Oceníte čisté línie a zámerne skromnú eleganciu. Menej je viac.', dress: 'Hladké saténové šaty, jednoduchý strih, bez prebytočných detailov' },
      rustic: { name: 'Rustikálna pohoda', desc: 'Ste žena, ktorá si cení rodinné hodnoty a teplý, domácky dojem.', dress: 'Klasická A-línia s rustikálnymi detailmi — stuhy, vzory, prírodné čipky' },
    };
    return styles[top[0]];
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" style={{ backgroundColor: 'rgba(44, 36, 22, 0.5)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="bg-white rounded-card max-w-2xl w-full p-8 md:p-10 modal-content max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-2">Štýlový kvíz</p>
            {step < questions.length && (
              <p className="text-xs" style={{ color: '#6B5946' }}>Otázka {step + 1} z {questions.length}</p>
            )}
          </div>
          <button onClick={onClose} className="gold hover:opacity-60"><X size={22} /></button>
        </div>

        {step < questions.length ? (
          <>
            {/* Progress */}
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-8">
              <div className="progress-bar h-full bg-gold rounded-full" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
            </div>

            <h3 className="serif text-3xl font-normal mb-8 text-center" style={{ color: '#1E1910' }}>
              {questions[step].q}
            </h3>

            <div className="grid gap-3">
              {questions[step].options.map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer(questions[step].id, opt)}
                  className="text-left border hairline rounded-soft p-5 hover:border-gold hover:bg-[#F5EFE3] transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="serif text-lg" style={{ color: '#1E1910' }}>{opt.label}</span>
                    <ArrowRight size={16} className="gold opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="text-xs tracking-wider uppercase gold hover:opacity-60 mt-6 flex items-center gap-2">
                <ChevronLeft size={14} /> Späť
              </button>
            )}
          </>
        ) : (
          /* VÝSLEDOK */
          <div className="text-center fade-in">
            <SparklesIcon size={28} strokeWidth={1.2} className="gold mx-auto mb-4" />
            <p className="text-[10px] tracking-[0.3em] uppercase gold mb-3">Váš štýl je</p>
            <h3 className="serif text-4xl font-normal mb-5" style={{ color: '#1E1910' }}>
              <em>{result?.name}</em>
            </h3>
            <p className="text-sm leading-relaxed mb-6 max-w-md mx-auto" style={{ color: '#4A3F2E' }}>
              {result?.desc}
            </p>
            <div className="bg-gradient-to-br from-[#F5EFE3] to-[#EBE1CF] rounded-card p-6 mb-6">
              <p className="text-[10px] tracking-[0.25em] uppercase gold mb-2">Odporúčame vám</p>
              <p className="serif italic text-lg" style={{ color: '#1E1910' }}>{result?.dress}</p>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="https://www.janveil.sk/svadobne-saty/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:opacity-90 transition flex items-center gap-2"
              >
                <ImageIcon size={14} /> Pozrieť kolekciu
              </a>
              <a href="https://www.janveil.sk/skuska-svadobnych-siat/#termin" target="_blank" rel="noopener noreferrer"
                className="border border-gold gold px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition">
                Objednať skúšku
              </a>
              <button onClick={() => { setStep(0); setAnswers({}); }} className="border hairline gold px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition">
                Opakovať kvíz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}