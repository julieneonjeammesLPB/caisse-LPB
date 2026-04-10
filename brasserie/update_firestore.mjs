// Script de mise à jour Firestore — Les Papas Brasseurs
// Usage : node update_firestore.mjs

const PROJECT_ID = 'gestion-les-papas-brasseurs';
const API_KEY    = 'AIzaSyD9KYULfZ49z2CI7ozPityiXxtqTkxtET4';
const DOC_URL    = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/brasserie/v1?key=${API_KEY}`;

// ── Convertisseurs JS ↔ Firestore REST ───────────────────────────────────
function toFS(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFS) } };
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFS(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFS(val) {
  if (!val) return null;
  if ('nullValue'   in val) return null;
  if ('booleanValue'in val) return val.booleanValue;
  if ('integerValue'in val) return parseInt(val.integerValue);
  if ('doubleValue' in val) return val.doubleValue;
  if ('stringValue' in val) return val.stringValue;
  if ('arrayValue'  in val) return (val.arrayValue.values||[]).map(fromFS);
  if ('mapValue'    in val) {
    const obj = {};
    for (const [k,v] of Object.entries(val.mapValue.fields||{})) obj[k]=fromFS(v);
    return obj;
  }
  return null;
}

// ── Données brassins complètes (PDF Stock 2025-2026) ─────────────────────
const BRASSINS = [
 {id:1, lotBK:"",    recette:"La Pèrilleuse",       volume:460,  statut:"terminé",    dateDebut:"2025-09-19",dateCond:"2025-10-07", fermenteur:"C5",og:1.061,fg:1.020,abv:6,   notes:"pH=4,37",                   mesures:[{date:"2025-09-19",valeur:1.061,temp:20,note:"DI"},{date:"2025-10-07",valeur:1.020,temp:5,note:"DF"}]},
 {id:2, lotBK:"B69", recette:"L'Impèrtinente",      volume:1629, statut:"terminé",    dateDebut:"2025-09-16",dateCond:"2025-10-09", fermenteur:"C1",og:1.049,fg:1.006,abv:6,   notes:"pH=4,31",                   mesures:[{date:"2025-09-16",valeur:1.049,temp:20,note:"DI"},{date:"2025-10-09",valeur:1.006,temp:5,note:"DF"}]},
 {id:3, lotBK:"",    recette:"La Blonde des Papas", volume:1840, statut:"terminé",    dateDebut:"2025-09-25",dateCond:"2025-10-16", fermenteur:"C2",og:1.047,fg:1.011,abv:5,   notes:"",                          mesures:[{date:"2025-09-25",valeur:1.047,temp:20,note:"DI"},{date:"2025-10-16",valeur:1.011,temp:5,note:"DF"}]},
 {id:4, lotBK:"",    recette:"La Supère",           volume:915,  statut:"terminé",    dateDebut:"2025-09-30",dateCond:"2025-10-23", fermenteur:"C3",og:1.070,fg:1.007,abv:8.5, notes:"",                          mesures:[{date:"2025-09-30",valeur:1.070,temp:20,note:"DI"},{date:"2025-10-23",valeur:1.007,temp:5,note:"DF"}]},
 {id:5, lotBK:"",    recette:"La Mamagascar",       volume:1108, statut:"terminé",    dateDebut:"2025-10-03",dateCond:"2025-10-28", fermenteur:"C4",og:1.069,fg:1.018,abv:7,   notes:"",                          mesures:[{date:"2025-10-03",valeur:1.069,temp:20,note:"DI"},{date:"2025-10-28",valeur:1.018,temp:5,note:"DF"}]},
 {id:6, lotBK:"",    recette:"La Pèrchée",          volume:593,  statut:"terminé",    dateDebut:"2025-10-07",dateCond:"2025-10-30", fermenteur:"C5",og:1.036,fg:1.004,abv:4.5, notes:"",                          mesures:[{date:"2025-10-07",valeur:1.036,temp:20,note:"DI"},{date:"2025-10-30",valeur:1.004,temp:5,note:"DF"}]},
 {id:7, lotBK:"",    recette:"La Mary'Stout",       volume:475,  statut:"terminé",    dateDebut:"2025-10-07",dateCond:"2025-11-04", fermenteur:"C1",og:1.071,fg:1.027,abv:6,   notes:"",                          mesures:[{date:"2025-10-07",valeur:1.071,temp:20,note:"DI"},{date:"2025-11-04",valeur:1.027,temp:5,note:"DF"}]},
 {id:8, lotBK:"",    recette:"La Pèrlimpinpin",     volume:1624, statut:"terminé",    dateDebut:"2025-10-17",dateCond:"2025-11-06", fermenteur:"C1",og:1.056,fg:1.008,abv:6.5, notes:"",                          mesures:[{date:"2025-10-17",valeur:1.056,temp:20,note:"DI"},{date:"2025-11-06",valeur:1.008,temp:5,note:"DF"}]},
 {id:9, lotBK:"",    recette:"Papa Noël",           volume:1503, statut:"terminé",    dateDebut:"2025-10-21",dateCond:"2025-11-13", fermenteur:"C2",og:1.053,fg:1.003,abv:7.2, notes:"Coriandre 0.5kg",           mesures:[{date:"2025-10-21",valeur:1.053,temp:20,note:"DI"},{date:"2025-11-13",valeur:1.003,temp:5,note:"DF"}]},
 {id:10,lotBK:"",    recette:"La Pèrilleuse",       volume:974,  statut:"terminé",    dateDebut:"2025-10-28",dateCond:"2025-11-18", fermenteur:"C3",og:1.061,fg:1.021,abv:6,   notes:"",                          mesures:[{date:"2025-10-28",valeur:1.061,temp:20,note:"DI"},{date:"2025-11-18",valeur:1.021,temp:5,note:"DF"}]},
 {id:11,lotBK:"",    recette:"La Pèrchée",          volume:1261, statut:"terminé",    dateDebut:"2025-10-30",dateCond:"2025-11-25", fermenteur:"C4",og:1.037,fg:1.006,abv:4.5, notes:"",                          mesures:[{date:"2025-10-30",valeur:1.037,temp:20,note:"DI"},{date:"2025-11-25",valeur:1.006,temp:5,note:"DF"}]},
 {id:12,lotBK:"",    recette:"La Mèrveilleuse",     volume:475,  statut:"terminé",    dateDebut:"2025-11-03",dateCond:"2025-11-27", fermenteur:"C5",og:1.059,fg:1.015,abv:6,   notes:"",                          mesures:[{date:"2025-11-03",valeur:1.059,temp:20,note:"DI"},{date:"2025-11-27",valeur:1.015,temp:5,note:"DF"}]},
 {id:13,lotBK:"",    recette:"L'Impèrtinente",      volume:1810, statut:"terminé",    dateDebut:"2025-11-13",dateCond:"2025-12-02", fermenteur:"C1",og:1.049,fg:1.006,abv:6,   notes:"",                          mesures:[{date:"2025-11-13",valeur:1.049,temp:20,note:"DI"},{date:"2025-12-02",valeur:1.006,temp:5,note:"DF"}]},
 {id:14,lotBK:"",    recette:"La Pèrlimpinpin",     volume:1789, statut:"terminé",    dateDebut:"2025-11-20",dateCond:"2025-12-09", fermenteur:"C2",og:1.052,fg:1.006,abv:6.5, notes:"",                          mesures:[{date:"2025-11-20",valeur:1.052,temp:20,note:"DI"},{date:"2025-12-09",valeur:1.006,temp:5,note:"DF"}]},
 {id:15,lotBK:"",    recette:"La Mèrlimpinpin",     volume:468,  statut:"terminé",    dateDebut:"2025-11-25",dateCond:"2025-12-11", fermenteur:"C3",og:1.070,fg:1.015,abv:8,   notes:"",                          mesures:[{date:"2025-11-25",valeur:1.070,temp:20,note:"DI"},{date:"2025-12-11",valeur:1.015,temp:5,note:"DF"}]},
 {id:16,lotBK:"",    recette:"La Pèrilleuse",       volume:1008, statut:"terminé",    dateDebut:"2025-12-02",dateCond:"2025-12-16", fermenteur:"C4",og:1.059,fg:1.020,abv:6,   notes:"",                          mesures:[{date:"2025-12-02",valeur:1.059,temp:20,note:"DI"},{date:"2025-12-16",valeur:1.020,temp:5,note:"DF"}]},
 {id:17,lotBK:"",    recette:"La Blonde des Papas", volume:1320, statut:"terminé",    dateDebut:"2025-12-04",dateCond:"2025-12-23", fermenteur:"C1",og:1.040,fg:1.011,abv:5,   notes:"",                          mesures:[{date:"2025-12-04",valeur:1.040,temp:20,note:"DI"},{date:"2025-12-23",valeur:1.011,temp:5,note:"DF"}]},
 {id:18,lotBK:"",    recette:"Single Hop Idaho7",   volume:570,  statut:"terminé",    dateDebut:"2025-12-09",dateCond:"2025-12-29", fermenteur:"C5",og:1.046,fg:1.006,abv:5,   notes:"",                          mesures:[{date:"2025-12-09",valeur:1.046,temp:20,note:"DI"},{date:"2025-12-29",valeur:1.006,temp:5,note:"DF"}]},
 {id:19,lotBK:"",    recette:"La Supère",           volume:975,  statut:"terminé",    dateDebut:"2025-12-17",dateCond:"2026-01-15", fermenteur:"C3",og:1.069,fg:1.009,abv:8.5, notes:"",                          mesures:[{date:"2025-12-17",valeur:1.069,temp:20,note:"DI"},{date:"2026-01-15",valeur:1.009,temp:5,note:"DF"}]},
 {id:20,lotBK:"",    recette:"La Mèrveilleuse",     volume:1453, statut:"terminé",    dateDebut:"2025-12-12",dateCond:"2026-01-16", fermenteur:"C2",og:1.054,fg:1.018,abv:6,   notes:"",                          mesures:[{date:"2025-12-12",valeur:1.054,temp:20,note:"DI"},{date:"2026-01-16",valeur:1.018,temp:5,note:"DF"}]},
 {id:21,lotBK:"",    recette:"La Papa Poule",       volume:534,  statut:"terminé",    dateDebut:"2025-11-21",dateCond:"2026-01-19", fermenteur:"Eau",og:1.045,fg:null, abv:4.5,notes:"Sour",                      mesures:[{date:"2025-11-21",valeur:1.045,temp:20,note:"DI"}]},
 {id:22,lotBK:"",    recette:"Farmère",             volume:1279, statut:"terminé",    dateDebut:"2025-12-19",dateCond:"2026-01-23", fermenteur:"C4",og:1.048,fg:1.012,abv:5,   notes:"",                          mesures:[{date:"2025-12-19",valeur:1.048,temp:20,note:"DI"},{date:"2026-01-23",valeur:1.012,temp:5,note:"DF"}]},
 {id:23,lotBK:"",    recette:"La Mamagascar",       volume:554,  statut:"terminé",    dateDebut:"2025-12-30",dateCond:"2026-01-26", fermenteur:"C5",og:1.069,fg:null, abv:7,   notes:"Poivre 0.75kg",             mesures:[{date:"2025-12-30",valeur:1.069,temp:20,note:"DI"}]},
 {id:24,lotBK:"",    recette:"L'Impèrtinente",      volume:1735, statut:"terminé",    dateDebut:"2026-01-09",dateCond:"2026-02-03", fermenteur:"C1",og:1.049,fg:1.006,abv:6,   notes:"",                          mesures:[{date:"2026-01-09",valeur:1.049,temp:20,note:"DI"},{date:"2026-02-03",valeur:1.006,temp:5,note:"DF"}]},
 {id:25,lotBK:"",    recette:"La Pèrlimpinpin",     volume:1740, statut:"terminé",    dateDebut:"2026-01-19",dateCond:"2026-02-10", fermenteur:"C2",og:1.052,fg:1.008,abv:6.5, notes:"",                          mesures:[{date:"2026-01-19",valeur:1.052,temp:20,note:"DI"},{date:"2026-02-10",valeur:1.008,temp:5,note:"DF"}]},
 {id:26,lotBK:"",    recette:"La Mèrlimpinpin",     volume:879,  statut:"terminé",    dateDebut:"2026-01-14",dateCond:"2026-02-12", fermenteur:"C3",og:1.073,fg:1.016,abv:8,   notes:"",                          mesures:[{date:"2026-01-14",valeur:1.073,temp:20,note:"DI"},{date:"2026-02-12",valeur:1.016,temp:5,note:"DF"}]},
 {id:27,lotBK:"",    recette:"La Mèrcure",          volume:1159, statut:"terminé",    dateDebut:"2026-01-26",dateCond:"2026-02-19", fermenteur:"C4",og:1.034,fg:null, abv:4,   notes:"Session IPA",               mesures:[{date:"2026-01-26",valeur:1.034,temp:20,note:"DI"}]},
 {id:28,lotBK:"",    recette:"La Pèrchée",          volume:600,  statut:"terminé",    dateDebut:"2026-01-29",dateCond:"2026-02-24", fermenteur:"C5",og:1.037,fg:1.005,abv:4.5, notes:"",                          mesures:[{date:"2026-01-29",valeur:1.037,temp:20,note:"DI"},{date:"2026-02-24",valeur:1.005,temp:5,note:"DF"}]},
 {id:29,lotBK:"B61", recette:"La Pèrlimpinpin",     volume:1675, statut:"terminé",    dateDebut:"2026-02-06",dateCond:"2026-03-03", fermenteur:"C1",og:1.055,fg:1.008,abv:6.5, notes:"",                          mesures:[{date:"2026-02-06",valeur:1.055,temp:20,note:"DI"},{date:"2026-03-03",valeur:1.008,temp:5,note:"DF"}]},
 {id:30,lotBK:"B72", recette:"L'Impèrtinente",      volume:1851, statut:"terminé",    dateDebut:"2026-02-13",dateCond:"2026-03-06", fermenteur:"C2",og:1.055,fg:1.008,abv:6,   notes:"pH=4,45",                   mesures:[{date:"2026-02-13",valeur:1.055,temp:20,note:"DI"},{date:"2026-03-06",valeur:1.008,temp:5,note:"DF"}]},
 {id:31,lotBK:"",    recette:"Comère",              volume:947,  statut:"terminé",    dateDebut:"2026-02-19",dateCond:"2026-03-12", fermenteur:"C3",og:1.049,fg:1.007,abv:5,   notes:"pH=4,37. Azacca + Centennial",mesures:[{date:"2026-02-19",valeur:1.049,temp:20,note:"DI"},{date:"2026-03-12",valeur:1.007,temp:5,note:"DF"}]},
 {id:32,lotBK:"",    recette:"La Supère",           volume:0,    statut:"terminé",    dateDebut:"2026-02-26",dateCond:"2026-03-19", fermenteur:"C4",og:1.069,fg:1.009,abv:8.5, notes:"pH=4,4. Coriandre 0.8kg",   mesures:[{date:"2026-02-26",valeur:1.069,temp:20,note:"DI"},{date:"2026-03-19",valeur:1.009,temp:5,note:"DF"}]},
 {id:33,lotBK:"",    recette:"La Pèrilleuse",       volume:470,  statut:"terminé",    dateDebut:"2026-02-27",dateCond:"2026-03-20", fermenteur:"C5",og:1.060,fg:1.020,abv:6,   notes:"pH=4,41",                   mesures:[{date:"2026-02-27",valeur:1.060,temp:20,note:"DI"},{date:"2026-03-20",valeur:1.020,temp:5,note:"DF"}]},
 {id:34,lotBK:"",    recette:"La Blonde des Papas", volume:2000, statut:"terminé",    dateDebut:"2026-03-06",dateCond:"2026-03-27", fermenteur:"C1",og:1.043,fg:1.007,abv:5,   notes:"pH=4,4",                    mesures:[{date:"2026-03-06",valeur:1.043,temp:20,note:"DI"},{date:"2026-03-27",valeur:1.007,temp:5,note:"DF"}]},
 {id:35,lotBK:"B73", recette:"L'Impèrtinente",      volume:1724, statut:"terminé",    dateDebut:"2026-03-13",dateCond:"2026-04-03", fermenteur:"C2",og:1.046,fg:1.013,abv:6,   notes:"pH=4,36",                   mesures:[{date:"2026-03-13",valeur:1.046,temp:20,note:"DI"},{date:"2026-04-03",valeur:1.013,temp:5,note:"DF"}]},
 // ── 5 brassins en cours (cuves C1–C5) ──
 {id:36,lotBK:"V5",  recette:"Chromamatik",         volume:0,    statut:"garde",      dateDebut:"2026-03-17",dateCond:null, fermenteur:"C4",og:1.079,fg:null,abv:8,   notes:"Malts: Pilsen 200kg, Pale 125kg, Blé 50kg. Cascade 2kg",mesures:[{date:"2026-03-17",valeur:1.079,temp:20,note:"DI"}]},
 {id:37,lotBK:"V4",  recette:"BCDC",                volume:0,    statut:"fermentation",dateDebut:"2026-03-25",dateCond:null, fermenteur:"C5",og:1.043,fg:null,abv:5,   notes:"Malts: Pilsen 50kg, Pale 50kg",mesures:[{date:"2026-03-25",valeur:1.043,temp:20,note:"DI"}]},
 {id:38,lotBK:"",    recette:"La Mèrveilleuse",     volume:0,    statut:"fermentation",dateDebut:"2026-03-27",dateCond:null, fermenteur:"C3",og:1.054,fg:null,abv:6,   notes:"Malts: Pilsen 75kg, Pale 50kg, Blé 50kg. Verdant",mesures:[{date:"2026-03-27",valeur:1.054,temp:20,note:"DI"}]},
 {id:39,lotBK:"",    recette:"La Pèrlimpinpin",     volume:0,    statut:"brassage",   dateDebut:"2026-04-02",dateCond:null, fermenteur:"C1",og:1.052,fg:null,abv:6.5, notes:"Malts: Pilsen 262.5kg, Pale 150kg, Cara240 12kg",mesures:[{date:"2026-04-02",valeur:1.052,temp:20,note:"DI"}]},
 {id:40,lotBK:"",    recette:"Foot Montaigu",       volume:0,    statut:"planifié",   dateDebut:"2026-04-10",dateCond:null, fermenteur:"C2",og:null, fg:null,abv:5.5, notes:"Malts: Pilsen 262.5kg. Brassage prévu 10/04",mesures:[]},
];

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('📖 Lecture du document Firestore...');

  // Lire le document existant
  const getRes = await fetch(DOC_URL);
  if (!getRes.ok) {
    const err = await getRes.text();
    throw new Error(`GET échoué (${getRes.status}): ${err}`);
  }
  const doc = await getRes.json();

  // Convertir les champs existants
  const existing = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    existing[k] = fromFS(v);
  }
  console.log(`✅ Document lu. Clés existantes: ${Object.keys(existing).join(', ')}`);
  console.log(`   Brassins existants: ${(existing.brassins||[]).length}`);

  // Remplacer brassins ET locations
  const LOCATIONS = [
   {id:1,client:"Mairie de Clisson",contact:"mairie@clisson.fr",tel:"02 40 54 02 14",
    lieuEvenement:"Mairie de Clisson",nbPersonnes:0,
    dateDebut:"2026-03-08",dateFin:"2026-03-10",tireuses:[1],
    futs:[{tieuseId:1,biere:"L'Impèrtinente",typeFut:"20L",nbFuts:2,volTotal:40}],
    tarif:50,statut:"retournée",notes:"Fête des vins"},
   {id:2,client:"Association Festiv'Clisson",contact:"festiv@gmail.com",tel:"06 12 34 56 78",
    lieuEvenement:"Clisson",nbPersonnes:0,
    dateDebut:"2026-03-21",dateFin:"2026-03-24",tireuses:[2,3],
    futs:[{tieuseId:2,biere:"La Pèrlimpinpin",typeFut:"20L",nbFuts:3,volTotal:60},{tieuseId:3,biere:"La Blonde des Papas",typeFut:"30L",nbFuts:2,volTotal:60}],
    tarif:90,statut:"confirmée",notes:"Printemps festif"},
   {id:3,client:"ESAT Les Papillons",contact:"direction@esat44.fr",tel:"02 40 36 88 00",
    lieuEvenement:"ESAT Les Papillons",nbPersonnes:0,
    dateDebut:"2026-04-05",dateFin:"2026-04-06",tireuses:[4],
    futs:[{tieuseId:4,biere:"La Pèrchée",typeFut:"20L",nbFuts:1,volTotal:20}],
    tarif:45,statut:"confirmée",notes:"Repas de printemps"},
   {id:4,client:"Papas au Zinor",contact:"",tel:"",
    lieuEvenement:"Le Zinor",nbPersonnes:0,
    dateDebut:"2026-04-11",dateFin:"2026-04-12",tireuses:[4],
    futs:[],tarif:0,statut:"confirmée",notes:"Tireuse 2 bec"},
   {id:5,client:"Association St Antoine",contact:"",tel:"",
    lieuEvenement:"Saint-Antoine",nbPersonnes:0,
    dateDebut:"2026-04-25",dateFin:"2026-04-26",tireuses:[4],
    futs:[],tarif:0,statut:"confirmée",notes:"Tireuse 2 bec"},
  ];

  const updated = { ...existing, brassins: BRASSINS, locations: LOCATIONS };

  // Construire le body Firestore
  const fields = {};
  for (const [k, v] of Object.entries(updated)) {
    fields[k] = toFS(v);
  }
  const body = JSON.stringify({ fields });

  console.log(`\n📤 Écriture de ${BRASSINS.length} brassins + ${LOCATIONS.length} locations...`);

  // PATCH pour écraser le document complet
  const patchRes = await fetch(DOC_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!patchRes.ok) {
    const err = await patchRes.text();
    throw new Error(`PATCH échoué (${patchRes.status}): ${err}`);
  }

  const result = await patchRes.json();
  console.log('✅ Firestore mis à jour avec succès!');
  console.log(`   Document: ${result.name}`);
  console.log(`   Timestamp: ${result.updateTime}`);

  // Résumé
  const termines = BRASSINS.filter(b=>b.statut==='terminé').length;
  const actifs   = BRASSINS.filter(b=>b.statut!=='terminé').length;
  console.log(`\n📊 Résumé:`);
  console.log(`   ${termines} brassins terminés`);
  console.log(`   ${actifs} brassins en cours:`);
  BRASSINS.filter(b=>b.statut!=='terminé').forEach(b=>{
    console.log(`     • #${b.id} ${b.recette} (${b.fermenteur}) — ${b.statut}`);
  });
  console.log(`   ${LOCATIONS.length} locations tireuses:`);
  LOCATIONS.forEach(l=>{
    console.log(`     • #${l.id} ${l.client} (${l.dateDebut}→${l.dateFin}) — ${l.statut}`);
  });
}

main().catch(e => {
  console.error('❌ Erreur:', e.message);
  process.exit(1);
});
