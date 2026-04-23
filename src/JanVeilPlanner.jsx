import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Check, Plus, Trash2, Calendar, Wallet, Users, Armchair, Home, ChevronRight, ChevronLeft, Download, Upload, Heart, X, Edit2, ChevronDown, Circle, Square, Baby, User, UtensilsCrossed, AlertCircle, Music, Martini, DoorOpen, LogOut, Cake, Camera, Flower2, Candy, Lightbulb, UtensilsCrossed as Buffet, Layers, Move, RotateCw, Maximize2, FileText, FileSpreadsheet, Search, Copy, Moon, Sun, Mail, Clock, BookOpen, FileCheck, Share2, Undo2, Sparkles as SparklesIcon, ArrowRight, ImageIcon, MessageCircle } from 'lucide-react';

export default function JanVeilPlanner() {
  const [activeModule, setActiveModule] = useState('home');
  const [weddingDate, setWeddingDate] = useState('');
  const [coupleName, setCoupleName] = useState('');

  const [theme, setTheme] = useState('light');
  const [diary, setDiary] = useState('');

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

  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [bulkFamilyName, setBulkFamilyName] = useState('');
  const [bulkFamilyCount, setBulkFamilyCount] = useState(4);

  const [showShareLink, setShowShareLink] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const [undoStack, setUndoStack] = useState([]);
  const [showUndoToast, setShowUndoToast] = useState(null);

  const [showStyleQuiz, setShowStyleQuiz] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeModule]);

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
    { phase: '6-9 mesiacov pred', task: 'Kúpiť / dať ušiť svadobný oblek' },
    { phase: '6-9 mesiacov pred', task: 'Vybrať obrúčky' },
    { phase: '6-9 mesiacov pred', task: 'Objednať obrúčky' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať kaderníčku' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať vizážistku' },
    { phase: '6-9 mesiacov pred', task: 'Rezervovať termín na výrobu torty' },
    { phase: '6-9 mesiacov pred', task: 'Rezervácia termínu - kytica a výzdoba' },
    { phase: '3-6 mesiacov pred', task: 'Kúpiť doplnky k šatám (pančuchy, kabelka, šperky)' },
    { phase: '3-6 mesiacov pred', task: 'Kúpiť svadobné topánky' },
    { phase: '3-6 mesiacov pred', task: 'Finálny zoznam pozvaných hostí' },
    { phase: '3-6 mesiacov pred', task: 'Objednať oznámenia a pozvánky' },
    { phase: '3-6 mesiacov pred', task: 'Poslať oznámenia a pozvánky' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať svadobné menu / detské menu / špeciálne diéty' },
    { phase: '3-6 mesiacov pred', task: 'Objednať svadobnú tortu' },
    { phase: '3-6 mesiacov pred', task: 'Objednať kyticu' },
    { phase: '3-6 mesiacov pred', task: 'Výber a rezervácia svadobného auta' },
    { phase: '3-6 mesiacov pred', task: 'Objednať tanečný kurz' },
    { phase: '3-6 mesiacov pred', task: 'Vybrať pieseň na svadobný tanec' },
    { phase: '3-6 mesiacov pred', task: 'Objednať svadobnú cestu' },
    { phase: '1-3 mesiace pred', task: 'Finálna skúška svadobných šiat' },
    { phase: '1-3 mesiace pred', task: 'Pripraviť zasadací poriadok' },
    { phase: '1-3 mesiace pred', task: 'Potvrdiť účasť hostí (RSVP)' },
    { phase: '1-3 mesiace pred', task: 'Kúpiť darčeky pre hostí' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť víno a pivo' },
    { phase: '1-3 mesiace pred', task: 'Zabezpečiť nealkoholické nápoje' },
    { phase: '1-3 mesiace pred', task: 'Objednať zákusky' },
    { phase: '1-3 mesiace pred', task: 'Objednať Candy bar' },
    { phase: '2-4 týždne pred', task: 'Rozpis svadobného dňa (podrobný časový harmonogram)' },
    { phase: '2-4 týždne pred', task: 'Vytvoriť a objednať menovky' },
    { phase: '2-4 týždne pred', task: 'Platby dodávateľom' },
    { phase: '2-4 týždne pred', task: 'Oznámiť hosťom presné inštrukcie' },
    { phase: '2-4 týždne pred', task: 'Rozlúčka so slobodou' },
    { phase: '1-2 týždne pred', task: 'Skúška svadobného účesu' },
    { phase: '1-2 týždne pred', task: 'Skúška svadobného makeupu' },
    { phase: '1-2 týždne pred', task: 'Poslať zoznam skladieb DJ / kapele' },
    { phase: '1-2 týždne pred', task: 'Skontrolovať doklady' },
    { phase: '1 týždeň pred', task: 'Svadobná manikúra a pedikúra' },
    { phase: '1 týždeň pred', task: 'Skúška svadobných šiat (finálna)' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť šaty' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť torty' },
    { phase: '1-2 dni pred', task: 'Vychladiť alkohol' },
    { phase: '1-2 dni pred', task: 'Vyzdobiť priestory' },
    { phase: '1-2 dni pred', task: 'Vyzdvihnúť kyticu, kvety do vlasov, pierka' },
    { phase: 'Deň D', task: 'Užiť si najkrajší deň života ♡' },
  ].map((t, i) => ({ id: i + 1, ...t, done: false }));

  const [checklist, setChecklist] = useState(defaultChecklist);
  const [newTask, setNewTask] = useState({ phase: '3-6 mesiacov pred', task: '' });
  const [openPhase, setOpenPhase] = useState(null);

  const [budgetTotal, setBudgetTotal] = useState(20000);
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Miesto a catering', planned: 8000, spent: 0 },
    { id: 2, category: 'Svadobné šaty a oblek', planned: 2500, spent: 0 },
    { id: 3, category: 'Fotograf a kameraman', planned: 2000, spent: 0 },
    { id: 4, category: 'Hudba a zábava', planned: 1200, spent: 0 },
    { id: 5, category: 'Kvety a výzdoba', planned: 1500, spent: 0 },
    { id: 6, category: 'Snubné prstene', planned: 1500, spent: 0 },
    { id: 7, category: 'Torta a sladkosti', planned: 500, spent: 0 },
    { id: 8, category: 'Oznámenia a pozvánky', planned: 300, spent: 0 },
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

  const generateShareLink = () => {
    const data = { coupleName, weddingDate, checklist, expenses, budgetTotal, guests, tables, sceneElements, timeline, documents, diary };
    try {
      const json = JSON.stringify(data);
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://janveil.sk/planovac/';
      const link = `${baseUrl}#share=${encoded}`;
      setShareLink(link);
      setShowShareLink(true);
    } catch (err) {
      alert('Zdieľanie sa nepodarilo vytvoriť.');
    }
  };

  const getExportJson = () => {
    const data = { coupleName, weddingDate, checklist, expenses, budgetTotal, guests, tables, sceneElements, timeline, documents, diary };
    return JSON.stringify(data, null, 2);
  };

  const escapeHtml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const daysUntil = weddingDate ? Math.ceil((new Date(weddingDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

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

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showExport) setShowExport(false);
        else if (showImport) setShowImport(false);
        else if (showShareLink) setShowShareLink(false);
        else if (showStyleQuiz) setShowStyleQuiz(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && undoStack.length > 0) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showExport, showImport, showShareLink, showStyleQuiz, undoStack]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`} style={{ backgroundColor: theme === 'dark' ? '#1A1510' : '#F2EDE3', fontFamily: "'Inter', -apple-system, sans-serif", transition: 'background-color 0.4s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; }
        body, html, input, textarea, button, select { font-weight: 500; }
        h1.serif, h2.serif, h3.serif, h4.serif { font-weight: 500; }
        .serif em, em.serif, .serif.italic, em { font-weight: 500; font-style: italic; }
        .serif.font-normal { font-weight: 500 !important; }
        [class*="tracking-"][class*="uppercase"] { font-weight: 500; letter-spacing: 0.15em; }
        p, span, li { font-weight: 500; }
        button, a.inline-block, a.block { font-weight: 600; }
        .pill-btn { font-weight: 600 !important; }

        .hairline { border-color: #E5DFD3; }
        .gold { color: #9B7A45; }
        .bg-gold { background-color: #9B7A45; }
        .border-gold { border-color: #9B7A45; }

        .theme-dark { color-scheme: dark; }
        .theme-dark .hairline { border-color: #3D3528 !important; }
        .theme-dark .gold { color: #D4B176 !important; }
        .theme-dark .bg-gold { background-color: #D4B176 !important; }
        .theme-dark .border-gold { border-color: #D4B176 !important; }
        .theme-dark .bg-white { background-color: #25201A !important; }
        .theme-dark [style*="#F2EDE3"] { background-color: #1A1510 !important; }
        .theme-dark [style*="#F5EFE3"] { background-color: #2A2218 !important; }
        .theme-dark [style*="#EBE1CF"] { background-color: #3D3528 !important; }
        .theme-dark .bg-gray-100 { background-color: #3D3528 !important; }
        .theme-dark .bg-gray-50 { background-color: #2A2218 !important; }
        .theme-dark .bg-red-50 { background-color: #3D1818 !important; }
        .theme-dark .bg-amber-50 { background-color: #3D2F18 !important; }
        .theme-dark [style*="color: rgb(30, 25, 16)"],
        .theme-dark [style*="#1E1910"] { color: #EBE1CF !important; }
        .theme-dark [style*="color: rgb(74, 63, 46)"],
        .theme-dark [style*="#4A3F2E"] { color: #C8B89A !important; }
        .theme-dark [style*="color: rgb(107, 89, 70)"],
        .theme-dark [style*="#6B5946"] { color: #A8987A !important; }
        .theme-dark input, .theme-dark textarea, .theme-dark select {
          color: #EBE1CF !important;
          background-color: transparent !important;
        }
        .theme-dark input::placeholder,
        .theme-dark textarea::placeholder { color: #7A6B52 !important; }
        .theme-dark .text-white { color: #FFFFFF !important; }
        .theme-dark .text-red-500,
        .theme-dark .text-red-600,
        .theme-dark .text-red-700 { color: #F87171 !important; }
        .theme-dark .text-amber-600,
        .theme-dark .text-amber-700 { color: #FBBF24 !important; }
        .theme-dark .pill-group { background-color: #25201A !important; }
        .theme-dark .pill-btn { color: #A8987A; }
        .theme-dark .pill-btn.active { color: #1A1510 !important; }
        .theme-dark .date-picker-trigger { background-color: #25201A !important; color: #EBE1CF !important; }
        .theme-dark .date-picker-trigger.empty { color: #A8987A !important; }
        .theme-dark .budget-input-wrapper { background-color: #2A2218 !important; border-color: #3D3528; }
        .theme-dark .budget-input-wrapper:focus-within { background-color: #25201A !important; }
        .theme-dark .scene-element { background-color: #25201A !important; color: #D4B176 !important; border-color: #D4B176; }
        .theme-dark .venue-canvas {
          background: linear-gradient(rgba(212, 177, 118, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 177, 118, 0.05) 1px, transparent 1px), linear-gradient(135deg, #1A1510 0%, #25201A 100%) !important;
          background-size: 40px 40px, 40px 40px, 100% 100% !important;
          border-color: #3D3528;
        }
        .theme-dark .initial-chip {
          background: linear-gradient(135deg, #2A2218, #3D3528) !important;
          color: #D4B176 !important;
          border-color: #D4B176 !important;
        }
        .theme-dark .hover\\:bg-gray-50:hover { background-color: #2A2218 !important; }
        .theme-dark .hover\\:bg-\\[\\#F5EFE3\\]:hover { background-color: #2A2218 !important; }
        .theme-dark .shimmer { background: linear-gradient(90deg, transparent, rgba(212, 177, 118, 0.12), transparent) !important; }
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
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-9 h-9 flex items-center justify-center gold hover:opacity-70 transition"
              title={theme === 'light' ? 'Tmavý režim' : 'Svetlý režim'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={generateShareLink}
              className="hidden md:flex text-xs tracking-wider uppercase gold hover:opacity-60 transition items-center gap-1.5"
            >
              <Share2 size={14} /> <span className="hidden lg:inline">Zdieľať</span>
            </button>

            <button onClick={() => setShowExport(true)} className="text-xs tracking-wider uppercase gold hover:opacity-60 transition hidden sm:flex items-center gap-1.5"><Download size={14} /> <span className="hidden md:inline">Exportovať</span></button>
            <button onClick={() => setShowImport(true)} className="text-xs tracking-wider uppercase gold hover:opacity-60 transition hidden sm:flex items-center gap-1.5"><Upload size={14} /> <span className="hidden md:inline">Načítať</span></button>
          </div>
        </div>

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
                      <ul className="space-y-1">
                        {items.map(t => (
                          <li key={t.id} className="flex items-center gap-4 py-2 px-2 group rounded hover:bg-[#F5EFE3] transition">
                            <button onClick={() => toggleTask(t.id)}
                              className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center rounded transition-all duration-300 ${t.done ? 'bg-gold border-gold' : 'hairline hover:border-gold'}`}>
                              {t.done && <Check size={12} className="text-white" strokeWidth={2.5} />}
                            </button>
                            <span className={`flex-1 text-sm transition ${t.done ? 'line-through opacity-40' : ''}`} style={{ color: '#1E1910' }}>{t.task}</span>
                            <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100 transition gold hover:text-red-600"><Trash2 size={13} /></button>
                          </li>
                        ))}
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
              <label className="text-[10px] tracking-[0.2em] uppercase gold mb-2 block">Účasť</label>
              <div className="pill-group">
                {['Čaká sa', 'Potvrdená', 'Odmietol'].map(opt => (<button key={opt} className={`pill-btn ${newGuest.rsvp === opt ? 'active' : ''}`} onClick={() => setNewGuest({ ...newGuest, rsvp: opt })}>{opt}</button>))}
              </div>
            </div>
            <button onClick={addGuest} className="border border-gold gold px-6 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition flex items-center gap-2"><Plus size={14} /> Pridať hosťa</button>
          </div>

          {guests.length > 0 ? (
            <div className="space-y-3">
              {guests.map(g => (
                <div key={g.id} className="bg-white border hairline rounded-soft p-5 group hover:border-gold transition-all duration-300">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
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
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => removeGuest(g.id)} className="text-xs tracking-wider uppercase text-red-500 hover:text-red-700 px-3 py-1.5"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 serif italic text-lg" style={{ color: '#6B5946' }}>Zatiaľ nie sú pridaní žiadni hostia</div>
          )}
        </ModuleShell>
      )}

      {activeModule === 'seating' && (
        <ModuleShell title="Plán sály" subtitle="Interaktívna mapa — rozmiestnite stoly a prvky sály" onBack={() => setActiveModule('home')}>
          <div className="text-center py-20">
            <p className="serif italic text-xl mb-4" style={{ color: '#6B5946' }}>
              {guests.length === 0 ? 'Najprv pridajte hostí' : 'Modul Plán sály (full verzia s drag & drop)'}
            </p>
            {guests.length === 0 && (
              <button onClick={() => setActiveModule('guests')} className="border border-gold gold px-8 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition">
                Prejsť na Hostia
              </button>
            )}
          </div>
        </ModuleShell>
      )}

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
              <div className="absolute left-3 md:left-5 top-3 bottom-3 w-px bg-gold opacity-30" />
              <div className="space-y-4">
                {timeline.map((ev) => (
                  <div key={ev.id} className="relative group">
                    <div className="absolute -left-[28px] md:-left-[42px] top-5 w-3 h-3 rounded-full bg-gold border-2 border-white shadow-md" style={{ boxShadow: '0 0 0 3px rgba(176, 141, 87, 0.15)' }} />
                    <div className="bg-white border hairline rounded-card p-5 hover:border-gold transition-all duration-300 hover:shadow-md">
                      <div className="grid md:grid-cols-[90px,1fr,auto] gap-4 items-start">
                        <input type="time" value={ev.time} onChange={e => updateTimelineEvent(ev.id, 'time', e.target.value)} className="serif text-xl gold bg-transparent border-0 py-1 w-24" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                        <div className="flex-1 min-w-0">
                          <input type="text" value={ev.event} onChange={e => updateTimelineEvent(ev.id, 'event', e.target.value)} className="serif text-lg w-full bg-transparent border-0 py-1" style={{ color: '#1E1910' }} />
                          <input type="text" value={ev.notes} onChange={e => updateTimelineEvent(ev.id, 'notes', e.target.value)} placeholder="Poznámka (voliteľná)..." className="w-full text-xs mt-1 bg-transparent border-0" style={{ color: '#6B5946' }} />
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
        </ModuleShell>
      )}

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
        </ModuleShell>
      )}

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

      {showStyleQuiz && <StyleQuizModal onClose={() => setShowStyleQuiz(false)} />}

      {showUndoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in">
          <div className="bg-[#1E1910] text-white rounded-full shadow-2xl px-5 py-3 flex items-center gap-4">
            <span className="text-xs">{showUndoToast.label}</span>
            <button onClick={handleUndo} className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase gold hover:text-white transition border border-gold rounded-full px-3 py-1">
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
              <a href="https://www.janveil.sk/svadobne-saty/" target="_blank" rel="noopener noreferrer" className="bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:opacity-90 transition flex items-center gap-2">
                <ImageIcon size={14} /> Pozrieť kolekciu
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
