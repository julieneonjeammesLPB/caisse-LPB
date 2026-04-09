// Les Papas Brasseurs  Application de Gestion Brassicole
// React 18 + Babel Standalone + Firebase Firestore
// G�n�r� automatiquement  ne pas modifier les sections Firebase

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── Design System Stitch ──────────────────────────────────────────────────
// Primary #FFBF00 | Secondary #2E3333 | Tertiary #4E6B4E | Neutral #121212
// Headlines: Manrope | Body/Labels: Inter | Roundedness: moderate
// ─────────────────────────────────────────────────────────────────────────
const FM="'Inter',sans-serif";
const FB="'Manrope',sans-serif";
const FA="'Manrope',sans-serif";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
*{box-sizing:border-box;margin:0;padding:0;max-width:100%}
html{overflow-x:hidden;width:100%;font-size:16px}
body{overflow-x:hidden;width:100%;max-width:100vw;font-family:'Inter',sans-serif;-webkit-text-size-adjust:100%}
img,video,canvas,svg{max-width:100%;height:auto}
table{width:100%;border-collapse:collapse}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#FFBF00;border-radius:3px}
input,textarea,select{font-family:'Inter',sans-serif;font-size:16px!important;border-radius:8px;max-width:100%}
button{-webkit-tap-highlight-color:transparent;cursor:pointer;max-width:100%}
@media(max-width:767px){
 #root>div{flex-direction:column!important}
 .ppb-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%}
}
`;

const C={
  // Fonds (neutral #121212 + secondary #2E3333)
  bg:"#121212", bgCard:"#1E1E1E", bgDark:"#0A0A0A",
  // Textes
  cream:"#F5F0E8", text:"#F5F0E8", textMid:"#A8A090", textLight:"#6A6460",
  // Bordures
  border:"#2E3333",
  // Primary : or vif #FFBF00
  amber:"#FFBF00", amberL:"#FFD033", amberPale:"#2A2500",
  // Tertiary : vert #4E6B4E
  green:"#4E6B4E", greenL:"#6A8F6A", greenPale:"#1A251A",
  // Panneaux secondaires #2E3333
  bgDark2:"#2E3333",
  // Accents complémentaires
  brick:"#B04030", brickPale:"#2A1008",
  hop:"#5A7040",  hopPale:"#1A2010",
  // États
  alert:"#E04040", ok:"#4E6B4E", warn:"#FFBF00",
};
// Palettes dark / light
const C_DARK={
  bg:"#121212", bgCard:"#1E1E1E", bgDark:"#0A0A0A",
  cream:"#F5F0E8", text:"#F5F0E8", textMid:"#A8A090", textLight:"#6A6460",
  border:"#2E3333",
  amber:"#FFBF00", amberL:"#FFD033", amberPale:"#2A2500",
  green:"#4E6B4E", greenL:"#6A8F6A", greenPale:"#1A251A",
  bgDark2:"#2E3333",
  brick:"#B04030", brickPale:"#2A1008",
  hop:"#5A7040",  hopPale:"#1A2010",
  alert:"#E04040", ok:"#4E6B4E", warn:"#FFBF00",
};
const C_LIGHT={
  bg:"#F5F0E8", bgCard:"#FFFFFF", bgDark:"#EDE8E0",
  cream:"#1A1612", text:"#1A1612", textMid:"#4A4540", textLight:"#7A7570",
  border:"#D8D0C5",
  amber:"#C49A00", amberL:"#FFBF00", amberPale:"#FFF5CC",
  green:"#3A5A3A", greenL:"#4E6B4E", greenPale:"#D0E8D0",
  bgDark2:"#E0D8CC",
  brick:"#B04030", brickPale:"#F5E0DC",
  hop:"#5A7040",  hopPale:"#DDE8CC",
  alert:"#D03030", ok:"#3A5A3A", warn:"#C49A00",
};
const CAT_COLORS={Malt:"#C8820A",Houblon:"#4A6741",Levure:"#8B3A2A",Épice:"#7A8B3C",Sucre:"#9B8B6E"};
const CAT_COND_COLORS={Bouteille:"#2A6080",Capsule:"#6B5A3E",Étiquette:"#7A8B3C",Fût:"#8B3A2A",Emballage:"#4A6741",Gaz:"#5A4A7A",Nettoyage:"#9B8B6E"};
const STATUTS={planifié:{label:"Planifié",color:C.textMid,bg:C.cream,dot:"⬜"},brassage:{label:"Brassage",color:C.amber,bg:C.amberPale,dot:"🟡"},fermentation:{label:"Fermentation",color:C.green,bg:C.greenPale,dot:"🟢"},garde:{label:"Garde froide",color:"#2A6080",bg:"#E8F4F8",dot:"🔵"},conditionnement:{label:"Conditionnement",color:C.hop,bg:C.hopPale,dot:"🟣"},terminé:{label:"Terminé",color:C.textLight,bg:C.border,dot:"⚪"}};
const fmt=n=>typeof n==='number'?(n<1?n.toFixed(3):n%1===0?n:n.toFixed(1)):'—';
const fmtDate=d=>d?new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'}):'—';
const alertLvl=(q,s)=>q<0?'error':q<=s*0.5?'critical':q<=s?'warn':'ok';
const alertCol=l=>({error:C.alert,critical:C.alert,warn:C.amber,ok:C.ok}[l]);
const findStock=(stock,nom)=>{
 if(!nom) return null;
 const nl=nom.toLowerCase().trim();
 return stock.find(x=>x.nom.toLowerCase()===nl)
  || stock.find(x=>x.nom.toLowerCase().startsWith(nl.split(' ')[0]))
  || stock.find(x=>x.nom.toLowerCase().includes(nl.split(' ')[0]));
};
const calcPrixCond=(sc)=>{
 const f=n=>(sc||[]).find(x=>x.nom===n)?.prix||0;
 const ce=f('Contre-étiquette');
 return {
  'Bouteille 33cl': f('Bouteille 33cl')+f('Capsule couronne 26mm')+f('Étiquette avant 33cl')+ce,
  'Bouteille 75cl': f('Bouteille 75cl')+f('Bouchon liège 75cl')+f('Étiquette avant 75cl')+ce,
  b33: f('Bouteille 33cl')+f('Capsule couronne 26mm')+f('Étiquette avant 33cl')+ce,
  b75: f('Bouteille 75cl')+f('Bouchon liège 75cl')+f('Étiquette avant 75cl')+ce,
  f20:0, f30:0,
 };
};
const iSt={width:'100%',background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:8,color:C.cream,padding:'10px 13px',fontSize:16,outline:'none',transition:'border-color 0.15s'};
const Btn=({p,children,onClick,style={}})=><button onClick={onClick} style={{padding:'10px 18px',borderRadius:8,border:'none',fontWeight:700,fontSize:14,background:p?C.amber:C.cream,color:p?'#fff':C.text,minHeight:44,...style}}>{children}</button>;
const Label=({t})=><label style={{display:'block',fontSize:11,fontWeight:700,color:C.textMid,marginBottom:5,textTransform:'uppercase',letterSpacing:0.8}}>{t}</label>;
function Tag({text,color=C.amber,bg=C.amberPale}){return <span style={{display:'inline-block',padding:'2px 9px',borderRadius:20,background:bg,color,fontSize:11,fontWeight:600,fontFamily:FM,border:`1px solid ${color}30`}}>{text}</span>;}
function Badge({statut}){const s=STATUTS[statut]||STATUTS.planifié;return <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 9px',borderRadius:20,background:s.bg,color:s.color,fontSize:11,fontWeight:700,fontFamily:FM}}>{s.dot} {s.label}</span>;}
function StatCard({label,value,sub,color=C.amber,icon,onClick}){return(<div onClick={onClick} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:'14px 16px',position:'relative',overflow:'hidden',cursor:onClick?'pointer':'default'}}><div style={{position:'absolute',top:0,left:0,right:0,height:3,background:color}}/><div style={{fontSize:20,marginBottom:4}}>{icon}</div><div style={{fontSize:'clamp(18px,4vw,26px)',fontFamily:FA,color,lineHeight:1}}>{value}</div><div style={{fontSize:10,color:C.textLight,textTransform:'uppercase',letterSpacing:1.2,marginTop:3}}>{label}</div>{sub&&<div style={{fontSize:11,color:C.textMid,marginTop:2}}>{sub}</div>}</div>);}

const Section = ({label,title,color=C.amber,children}) => (
 <div style={{background:C.bgCard,borderRadius:12,padding:'14px',
  marginBottom:12,border:`1px solid ${C.border}`,
  borderLeft:`3px solid ${color}`}}>
  <div style={{fontFamily:FM,fontSize:9,
   fontWeight:700,letterSpacing:2,color,textTransform:'uppercase',
   marginBottom:10}}>{label||title}</div>
  {children}
 </div>
);
const Row = ({label,value,mono}) => (
 <div style={{display:'flex',justifyContent:'space-between',
  alignItems:'center',padding:'5px 0',
  borderBottom:`1px solid ${C.border}`}}>
  <span style={{fontSize:12,color:C.textLight}}>{label}</span>
  <span style={{fontFamily:mono?"'DM Mono',monospace":undefined,
   fontSize:12,fontWeight:600,color:C.cream,textAlign:'right',
   maxWidth:'55%',overflow:'hidden',textOverflow:'ellipsis',
   whiteSpace:'nowrap'}}>{value||'—'}</span>
 </div>
);

function SearchBar({value,onChange,placeholder='Rechercher…'}){
 return (
  <div style={{position:'relative',marginBottom:14}}>
   <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',
    fontSize:14,color:C.textLight,pointerEvents:'none'}}>🔍</span>
   <input
    value={value}
    onChange={e=>onChange(e.target.value)}
    placeholder={placeholder}
    style={{...iSt,paddingLeft:40,paddingRight:value?36:14,
     border:`1.5px solid ${value?C.amber:C.border}`,
     boxShadow:value?`0 0 0 3px ${C.amber}18`:'none'}}
   />
   {value&&(
    <button onClick={()=>onChange('')}
     style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',
      background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:6,
      fontSize:12,color:C.textMid,lineHeight:1,padding:'2px 6px',cursor:'pointer'}}>✕</button>
   )}
  </div>
 );
}

const FOURNISSEURS_INIT=[
 {id:1,nom:"Malteries Franco-Belges",type:"Malt",contact:"commercial@mfb.fr",tel:"03 21 60 90 90",ville:"Isbergues (62)",delai:7,remise:0,notes:"Pilsen, Pale, Tourambre, Blé"},
 {id:2,nom:"Weyermann",type:"Malt",contact:"france@weyermann.de",tel:"—",ville:"Allemagne",delai:14,remise:0,notes:"Cara 240, Cara Vienne, Seigle, Viene10, Chocolat, Black, Flocons"},
 {id:3,nom:"Crisp Malt",type:"Malt",contact:"info@crispmalt.com",tel:"—",ville:"Royaume-Uni",delai:21,remise:0,notes:"Pale, Cara Pils"},
 {id:4,nom:"Hopsteiner",type:"Houblon",contact:"info@hopsteiner.com",tel:"—",ville:"International",delai:10,remise:5,notes:"Cascade, Nugget, Mistral, Centennial, Motueka, Barbe rouge"},
 {id:5,nom:"YCH Hops",type:"Houblon",contact:"sales@ychhops.com",tel:"—",ville:"USA",delai:21,remise:0,notes:"Amarillo, Simcoe, Citra, Azacca, Idaho7, Ekuanot, Mosaic"},
 {id:6,nom:"Barth-Haas",type:"Houblon",contact:"info@barthhaas.com",tel:"—",ville:"International",delai:14,remise:0,notes:"Chinook, Elixir, Sabro, Nectaron, Nelson Sauvin"},
 {id:7,nom:"Lallemand",type:"Levure",contact:"france@lallemand.com",tel:"—",ville:"Montréal (CA)",delai:7,remise:0,notes:"Nottingham, Windsor, NEIPA, Belle Saison, Phily sour, Kveik, Verdant"},
 {id:8,nom:"Fermentis",type:"Levure",contact:"contact@fermentis.com",tel:"03 20 81 05 05",ville:"Marcq-en-Barœul",delai:5,remise:0,notes:"BE256, S-04, WB-06"},
 {id:9,nom:"Brew Lab",type:"Épice",contact:"contact@brewlab.fr",tel:"—",ville:"France",delai:5,remise:0,notes:"Coriandre, Poivre, Écorces agrumes"},
 {id:10,nom:"Grossiste local",type:"Sucre",contact:"—",tel:"—",ville:"Nantes (44)",delai:2,remise:2,notes:"Sucre blanc"},
 {id:11,nom:"Certipaq",type:"Certification",contact:"certipaq@certipaq.fr",tel:"02 41 18 45 00",ville:"Angers (49)",delai:0,remise:0,notes:"Organisme de certification Agriculture Biologique — FR-BIO-09"},
];
const STOCK_INIT=[
 {id:1, nom:"Pilsen",          cat:"Malt",    qte:-177.5, u:"kg",   seuil:80,  prix:1.00, four:"Malteries Franco-Belges", dateAjout:"2026-03-17"},
 {id:2, nom:"Pale",            cat:"Malt",    qte:1362.5, u:"kg",   seuil:100, prix:0.95, four:"Crisp Malt",              dateAjout:"2026-03-17"},
 {id:3, nom:"Cara 240",        cat:"Malt",    qte:151.5,  u:"kg",   seuil:20,  prix:1.32, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:4, nom:"Cara Vienne 55",  cat:"Malt",    qte:62.5,   u:"kg",   seuil:20,  prix:1.30, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:5, nom:"Blé",             cat:"Malt",    qte:-150.0, u:"kg",   seuil:50,  prix:0.90, four:"Malteries Franco-Belges", dateAjout:"2026-03-17"},
 {id:6, nom:"Seigle",          cat:"Malt",    qte:20.0,   u:"kg",   seuil:10,  prix:1.10, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:7, nom:"Viene10",         cat:"Malt",    qte:625.0,  u:"kg",   seuil:50,  prix:1.02, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:8, nom:"Cara Pils",       cat:"Malt",    qte:63.3,   u:"kg",   seuil:20,  prix:1.20, four:"Crisp Malt",              dateAjout:"2026-03-17"},
 {id:9, nom:"Chocolat",        cat:"Malt",    qte:33.3,   u:"kg",   seuil:10,  prix:1.80, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:10,nom:"Black",           cat:"Malt",    qte:19.6,   u:"kg",   seuil:10,  prix:2.00, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:11,nom:"Tourambre",       cat:"Malt",    qte:150.0,  u:"kg",   seuil:30,  prix:1.00, four:"Malteries Franco-Belges", dateAjout:"2026-03-17"},
 {id:12,nom:"Flocon Seigle",   cat:"Malt",    qte:62.5,   u:"kg",   seuil:20,  prix:1.05, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:13,nom:"Flocon Maïs",     cat:"Malt",    qte:60.0,   u:"kg",   seuil:20,  prix:1.00, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:14,nom:"Flocon Avoine",   cat:"Malt",    qte:187.5,  u:"kg",   seuil:30,  prix:1.00, four:"Weyermann",               dateAjout:"2026-03-17"},
 {id:15,nom:"Cascade",         cat:"Houblon", qte:30.9,   u:"kg",   seuil:5,   prix:32.0,  four:"Hopsteiner",  dateAjout:"2026-03-17"},
 {id:16,nom:"Amarillo",        cat:"Houblon", qte:2.4,    u:"kg",   seuil:2,   prix:28.0,  four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:17,nom:"Chinook",         cat:"Houblon", qte:15.8,   u:"kg",   seuil:3,   prix:37.0,  four:"Barth-Haas",  dateAjout:"2026-03-17"},
 {id:18,nom:"Simcoe",          cat:"Houblon", qte:0.0,    u:"kg",   seuil:2,   prix:32.0,  four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:19,nom:"Nugget",          cat:"Houblon", qte:41.3,   u:"kg",   seuil:5,   prix:30.0,  four:"Hopsteiner",  dateAjout:"2026-03-17"},
 {id:20,nom:"Elixir",          cat:"Houblon", qte:0.05,   u:"kg",   seuil:1,   prix:30.0,  four:"Barth-Haas",  dateAjout:"2026-03-17"},
 {id:21,nom:"Mistral",         cat:"Houblon", qte:6.5,    u:"kg",   seuil:2,   prix:18.0,  four:"Hopsteiner",  dateAjout:"2026-03-17"},
 {id:22,nom:"Citra",           cat:"Houblon", qte:35.35,  u:"kg",   seuil:5,   prix:22.54, four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:23,nom:"Centennial",      cat:"Houblon", qte:6.6,    u:"kg",   seuil:2,   prix:24.0,  four:"Hopsteiner",  dateAjout:"2026-03-17"},
 {id:24,nom:"Azacca",          cat:"Houblon", qte:2.0,    u:"kg",   seuil:1,   prix:28.0,  four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:25,nom:"Sabro",           cat:"Houblon", qte:3.75,   u:"kg",   seuil:1,   prix:35.0,  four:"Barth-Haas",  dateAjout:"2026-03-17"},
 {id:26,nom:"Idaho7",          cat:"Houblon", qte:6.85,   u:"kg",   seuil:3,   prix:30.0,  four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:27,nom:"Nectaron",        cat:"Houblon", qte:45.0,   u:"kg",   seuil:5,   prix:38.0,  four:"Barth-Haas",  dateAjout:"2026-03-17"},
 {id:28,nom:"Nelson Sauvin",   cat:"Houblon", qte:5.0,    u:"kg",   seuil:1,   prix:40.0,  four:"Barth-Haas",  dateAjout:"2026-03-17"},
 {id:29,nom:"Motueka",         cat:"Houblon", qte:5.0,    u:"kg",   seuil:1,   prix:28.0,  four:"Hopsteiner",  dateAjout:"2026-03-17"},
 {id:30,nom:"Super delic",     cat:"Houblon", qte:5.0,    u:"kg",   seuil:1,   prix:30.0,  four:"Barth-Haas",  dateAjout:"2026-03-17"},
 {id:31,nom:"Barbe rouge",     cat:"Houblon", qte:-0.1,   u:"kg",   seuil:1,   prix:35.0,  four:"Hopsteiner",  dateAjout:"2026-03-17"},
 {id:32,nom:"Ekuanot",         cat:"Houblon", qte:1.35,   u:"kg",   seuil:1,   prix:30.0,  four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:33,nom:"Mosaic",          cat:"Houblon", qte:56.05,  u:"kg",   seuil:5,   prix:44.38, four:"YCH Hops",    dateAjout:"2026-03-17"},
 {id:34,nom:"Nottingham",      cat:"Levure",  qte:9.5,    u:"sach", seuil:4,   prix:3.50, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:35,nom:"Windsor",         cat:"Levure",  qte:3.5,    u:"sach", seuil:2,   prix:3.50, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:36,nom:"NEIPA",           cat:"Levure",  qte:2.5,    u:"sach", seuil:2,   prix:8.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:37,nom:"CBC1",            cat:"Levure",  qte:1.62,   u:"sach", seuil:2,   prix:4.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:38,nom:"BE256",           cat:"Levure",  qte:2.5,    u:"sach", seuil:2,   prix:3.50, four:"Fermentis",    dateAjout:"2026-03-17"},
 {id:39,nom:"Belle Saison",    cat:"Levure",  qte:0.25,   u:"sach", seuil:1,   prix:4.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:40,nom:"S-04",            cat:"Levure",  qte:4.0,    u:"sach", seuil:2,   prix:3.20, four:"Fermentis",    dateAjout:"2026-03-17"},
 {id:41,nom:"K-97",            cat:"Levure",  qte:0.5,    u:"sach", seuil:1,   prix:3.50, four:"Fermentis",    dateAjout:"2026-03-17"},
 {id:42,nom:"Verdant",         cat:"Levure",  qte:1.5,    u:"sach", seuil:1,   prix:9.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:43,nom:"WB-06",           cat:"Levure",  qte:1.73,   u:"sach", seuil:2,   prix:3.20, four:"Fermentis",    dateAjout:"2026-03-17"},
 {id:44,nom:"Phily sour",      cat:"Levure",  qte:1.85,   u:"sach", seuil:1,   prix:7.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:45,nom:"Best coast hazy", cat:"Levure",  qte:0.0,    u:"sach", seuil:1,   prix:8.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:46,nom:"Nova Lager",      cat:"Levure",  qte:0.5,    u:"sach", seuil:1,   prix:3.50, four:"Fermentis",    dateAjout:"2026-03-17"},
 {id:47,nom:"BRY 97",          cat:"Levure",  qte:0.5,    u:"sach", seuil:1,   prix:3.50, four:"Fermentis",    dateAjout:"2026-03-17"},
 {id:48,nom:"Kveik",           cat:"Levure",  qte:0.5,    u:"sach", seuil:1,   prix:6.00, four:"Lallemand",    dateAjout:"2026-03-17"},
 {id:49,nom:"Coriandre",       cat:"Épice",   qte:2.8,    u:"kg",   seuil:0.5, prix:17.15,four:"Brew Lab",     dateAjout:"2026-03-17"},
 {id:50,nom:"Poivre",          cat:"Épice",   qte:3.75,   u:"kg",   seuil:0.5, prix:15.00,four:"Brew Lab",     dateAjout:"2026-03-17"},
 {id:51,nom:"Écorce de citron",cat:"Épice",   qte:4.0,    u:"kg",   seuil:0.5, prix:18.00,four:"Brew Lab",     dateAjout:"2026-03-17"},
 {id:52,nom:"Écorce d'orange", cat:"Épice",   qte:2.8,    u:"kg",   seuil:0.5, prix:14.30,four:"Brew Lab",     dateAjout:"2026-03-17"},
 {id:53,nom:"Sucre",           cat:"Sucre",   qte:411.07, u:"kg",   seuil:20,  prix:1.79, four:"Grossiste local",dateAjout:"2026-03-17"},
];

const RECETTES_INIT=[
 {id:1,nom:"L'Impèrtinente",style:"APA",abv:6.0,ibu:35,srm:5,og:1.049,fg:1.006,volume:300,permanent:true,prix:{b33:2.80,b75:6.50,f20:85,f30:125},description:"Notre rockstar ! Blonde houblonnée, amertume légère et envoutante.",houblons:["Cascade","Mosaic"],levure:"Nottingham",ingredients:[{nom:"Pale",qte:300,u:"kg"},{nom:"Pilsen",qte:150,u:"kg"},{nom:"Cascade",qte:6,u:"kg"},{nom:"Mosaic",qte:6,u:"kg"},{nom:"Nottingham",qte:0.5,u:"sach"}]},
 {id:2,nom:"La Pèrchée",style:"Blanche",abv:4.5,ibu:15,srm:3,og:1.037,fg:1.004,volume:300,permanent:true,prix:{b33:2.60,b75:6.00,f20:75,f30:110},description:"Brassée sur Terre, notre blanche est dans la Lune.",houblons:["Cascade","Mosaic"],levure:"WB-06",ingredients:[{nom:"Blé",qte:62.5,u:"kg"},{nom:"Pilsen",qte:37.5,u:"kg"},{nom:"Cascade",qte:1,u:"kg"},{nom:"Mosaic",qte:2,u:"kg"},{nom:"WB-06",qte:0.25,u:"sach"}]},
 {id:3,nom:"La Pèrilleuse",style:"Ambrée",abv:6.0,ibu:28,srm:18,og:1.061,fg:1.020,volume:300,permanent:true,prix:{b33:2.80,b75:6.50,f20:85,f30:125},description:"Pleine de rebondissements, parfum caramel et douce amertume.",houblons:["Chinook"],levure:"S-04",ingredients:[{nom:"Pale",qte:275,u:"kg"},{nom:"Cara 240",qte:20,u:"kg"},{nom:"Chinook",qte:4,u:"kg"},{nom:"S-04",qte:0.5,u:"sach"}]},
 {id:4,nom:"La Pèrlimpinpin",style:"IPA",abv:6.5,ibu:60,srm:7,og:1.056,fg:1.008,volume:300,permanent:true,prix:{b33:3.20,b75:7.50,f20:95,f30:140},description:"Laisse-toi ensorceler. Blonde dorée à l'alchimie parfaite.",houblons:["Cascade","Mosaic","Chinook"],levure:"Nottingham",ingredients:[{nom:"Pale",qte:325,u:"kg"},{nom:"Pilsen",qte:87.5,u:"kg"},{nom:"Cascade",qte:9.6,u:"kg"},{nom:"Mosaic",qte:6,u:"kg"},{nom:"Nottingham",qte:0.5,u:"sach"}]},
 {id:5,nom:"La Supère",style:"Triple",abv:8.5,ibu:22,srm:6,og:1.069,fg:1.009,volume:200,permanent:true,prix:{b33:4.00,b75:9.00,f20:110,f30:160},description:"Avec force et courage, cette blonde musclée, épices et puissante rondeur.",houblons:["Cascade"],levure:"BE256",ingredients:[{nom:"Pale",qte:185,u:"kg"},{nom:"Pilsen",qte:50,u:"kg"},{nom:"Flocon Avoine",qte:25,u:"kg"},{nom:"Coriandre",qte:1,u:"kg"},{nom:"BE256",qte:0.25,u:"sach"}]},
 {id:6,nom:"La Blonde des Papas",style:"Blonde",abv:5.0,ibu:25,srm:7,og:1.047,fg:1.011,volume:300,permanent:true,prix:{b33:2.60,b75:6.00,f20:75,f30:110},description:"Notre blonde légère et limpide, douce, maltée, sans amertume.",houblons:["Nugget","Cascade"],levure:"S-04",ingredients:[{nom:"Pilsen",qte:350,u:"kg"},{nom:"Viene10",qte:75,u:"kg"},{nom:"Nugget",qte:0.5,u:"kg"},{nom:"Cascade",qte:2.4,u:"kg"},{nom:"S-04",qte:0.5,u:"sach"}]},
 {id:7,nom:"La Mèrveilleuse",style:"NEIPA",abv:6.0,ibu:45,srm:5,og:1.059,fg:1.018,volume:200,permanent:false,prix:{b33:3.50,b75:8.00,f20:100,f30:150},description:"Éphémère juteuse et trouble, arômes intenses de fruits tropicaux.",houblons:["Mosaic","Citra","Amarillo"],levure:"NEIPA",ingredients:[{nom:"Pale",qte:155,u:"kg"},{nom:"Blé",qte:75,u:"kg"},{nom:"Flocon Avoine",qte:75,u:"kg"},{nom:"Mosaic",qte:7.2,u:"kg"},{nom:"Citra",qte:9.2,u:"kg"},{nom:"NEIPA",qte:0.5,u:"sach"}]},
 {id:8,nom:"La Mèrlimpinpin",style:"DIPA",abv:8.0,ibu:70,srm:6,og:1.073,fg:1.015,volume:200,permanent:false,prix:{b33:4.50,b75:10.00,f20:120,f30:175},description:"Double IPA puissante.",houblons:["Citra","Sabro","Azacca"],levure:"Nottingham",ingredients:[{nom:"Pale",qte:200,u:"kg"},{nom:"Citra",qte:9.75,u:"kg"},{nom:"Sabro",qte:1.4,u:"kg"},{nom:"Nottingham",qte:0.75,u:"sach"}]},
 {id:9,nom:"La Mary'Stout",style:"Brune",abv:6.0,ibu:45,srm:45,og:1.062,fg:1.020,volume:500,permanent:false,prix:{b33:3.00,b75:7.00,f20:90,f30:130},description:"Brune robuste aux notes de café et chocolat — Chinook aromatique, corps dense et torréfié.",houblons:["Chinook"],levure:"Windsor",ingredients:[{nom:"Viene10",qte:75,u:"kg"},{nom:"Pale",qte:12.5,u:"kg"},{nom:"Cara Vienne 55",qte:12.5,u:"kg"},{nom:"Tourambre",qte:12.5,u:"kg"},{nom:"Flocon Avoine",qte:12.5,u:"kg",note:"non concassé"},{nom:"Cara 240",qte:12,u:"kg"},{nom:"Chocolat",qte:6,u:"kg"},{nom:"Black",qte:5,u:"kg"},{nom:"Amèrisant",qte:0.8,u:"kg",note:"60min"},{nom:"Chinook",qte:1.0,u:"kg",note:"aroma 80°C"},{nom:"Windsor",qte:0.25,u:"kg"}]},
 {id:10,nom:"La Mamagascar",style:"Ambrée épicée",abv:7.0,ibu:21,srm:13,og:1.069,fg:1.020,volume:500,permanent:false,prix:{b33:3.20,b75:7.50,f20:95,f30:140},description:"Ambrée au poivre de Madagascar — maltée, caramel, épices chaudes. Version originale 5HL.",houblons:["Nugget","Chinook","Simcoe"],levure:"Windsor",ingredients:[{nom:"Pale",qte:112.5,u:"kg"},{nom:"Cara Vienne 55",qte:12.5,u:"kg"},{nom:"Tourambre",qte:12.5,u:"kg"},{nom:"Cara 240",qte:4.7,u:"kg"},{nom:"Nugget",qte:0.27,u:"kg",note:"60min"},{nom:"Sucre",qte:20,u:"kg",note:"10min"},{nom:"Chinook",qte:0.5,u:"kg",note:"aroma 80°C"},{nom:"Simcoe",qte:0.5,u:"kg",note:"aroma 80°C"},{nom:"Poivre",qte:0.5,u:"kg",note:"aroma 100°C"},{nom:"Windsor",qte:0.25,u:"kg"},{nom:"Poivre",qte:0.3,u:"kg",note:"DH J+5"}]},
 {id:11,nom:"La Chromamatik",style:"NEIPA",abv:8.0,ibu:20,srm:6,og:1.083,fg:1.028,volume:1200,permanent:false,prix:{b33:3.5,b75:8.0,f20:100,f30:150},description:"NEIPA puissante à 8% — double empatage, dry hop massif Citra + Sabro.",houblons:["Citra","Mistral","Sabro"],levure:"Best coast hazy",ingredients:[{nom:"Pale",qte:112.5,"u":"kg",note:"soir"},{nom:"Flocon Avoine",qte:25,"u":"kg",note:"soir"},{nom:"Pale",qte:12.5,"u":"kg",note:"matin"},{nom:"Pilsen",qte:62.5,"u":"kg",note:"matin"},{nom:"Blé",qte:25,"u":"kg",note:"matin"},{nom:"Sucre",qte:15,"u":"kg",note:"15min"},{nom:"Citra",qte:1.0,"u":"kg",note:"aroma 80°C"},{nom:"Mistral",qte:1.0,"u":"kg",note:"aroma 80°C"},{nom:"Best coast hazy",qte:0.5,"u":"kg"},{nom:"Citra",qte:6.0,"u":"kg",note:"DH J+2"},{nom:"Sabro",qte:6.0,"u":"kg",note:"DH J+5"}]},
 {id:12,nom:"La Cold IPA",style:"Cold IPA",abv:5.0,ibu:38,srm:4,og:1.043,fg:1.005,volume:1200,permanent:false,prix:{b33:2.8,b75:6.5,f20:85,f30:125},description:"Cold IPA fermentation froide — dry hop massif Centennial 5kg.",houblons:["Nugget","Centennial"],levure:"Nova Lager",ingredients:[{nom:"Pilsen",qte:87.5,"u":"kg"},{nom:"Flocon Maïs",qte:30,"u":"kg"},{nom:"Nugget",qte:0.5,"u":"kg",note:"60min"},{nom:"Centennial",qte:0.2,"u":"kg",note:"10min"},{nom:"Centennial",qte:1.5,"u":"kg",note:"aroma 80°C"},{nom:"Nova Lager",qte:0.5,"u":"kg"},{nom:"Centennial",qte:5.0,"u":"kg",note:"DH J+4"}]},
 {id:13,nom:"La Daarønn",style:"Kveik IPA",abv:7.0,ibu:74,srm:6,og:1.062,fg:1.011,volume:1200,permanent:false,prix:{b33:3.0,b75:7.0,f20:90,f30:135},description:"Kveik IPA fermentée à 35°C — amertume franche, Centennial + Azacca en dry hop.",houblons:["Simcoe","Centennial","Azacca"],levure:"Kveik",ingredients:[{nom:"Pale",qte:75,"u":"kg"},{nom:"Viene10",qte:25,"u":"kg"},{nom:"Blé",qte:12.5,"u":"kg"},{nom:"Flocon Avoine",qte:25,"u":"kg",note:"non concassé"},{nom:"Simcoe",qte:1.0,"u":"kg",note:"60min"},{nom:"Centennial",qte:0.4,"u":"kg",note:"20min"},{nom:"Simcoe",qte:0.7,"u":"kg",note:"aroma 80°C"},{nom:"Centennial",qte:0.6,"u":"kg",note:"aroma 80°C"},{nom:"Sucre",qte:15,"u":"kg",note:"10min"},{nom:"Kveik",qte:0.5,"u":"kg"},{nom:"Centennial",qte:1.5,"u":"kg",note:"DH"},{nom:"Azacca",qte:2.5,"u":"kg",note:"DH"}]},
 {id:14,nom:"La Daddy Cool Gose",style:"Gose fruitée",abv:4.0,ibu:10,srm:4,og:1.045,fg:1.012,volume:500,permanent:false,prix:{b33:2.8,b75:6.5,f20:85,f30:125},description:"Gose Ananas Kiwi — sour légère, sel et coriandre, 80kg de fruits en dry hop.",houblons:["Nugget","Elixir"],levure:"Phily sour",ingredients:[{nom:"Pilsen",qte:50,"u":"kg"},{nom:"Blé",qte:50,"u":"kg"},{nom:"Nugget",qte:0.1,"u":"kg",note:"60min"},{nom:"Coriandre",qte:0.7,"u":"kg",note:"15min"},{nom:"Elixir",qte:0.1,"u":"kg",note:"10min"},{nom:"Elixir",qte:0.4,"u":"kg",note:"aroma 80°C"},{nom:"Phily sour",qte:0.5,"u":"kg"},{nom:"Ananas purée",qte:40,"u":"kg",note:"DH J+0"},{nom:"Kiwi purée",qte:40,"u":"kg",note:"DH J+0"}]},
 {id:15,nom:"La Habemouss Papa",style:"West Coast IPA",abv:7.0,ibu:50,srm:7,og:1.051,fg:1.0,volume:1200,permanent:false,prix:{b33:3.0,b75:7.0,f20:90,f30:135},description:"West Coast IPA sèche et amère — Mosaic + Idaho7 en dry hop, haute atténuation.",houblons:["Nugget","Simcoe","Mosaic","Idaho7"],levure:"BRY 97",ingredients:[{nom:"Pale",qte:100,"u":"kg"},{nom:"Cara Pils",qte:25,"u":"kg"},{nom:"Flocon Seigle",qte:12.5,"u":"kg",note:"non concassé"},{nom:"Nugget",qte:0.6,"u":"kg",note:"60min"},{nom:"Simcoe",qte:1.5,"u":"kg",note:"aroma 80°C"},{nom:"Mosaic",qte:1.5,"u":"kg",note:"aroma 80°C"},{nom:"BRY 97",qte:0.5,"u":"kg"},{nom:"Mosaic",qte:1.0,"u":"kg",note:"DH"},{nom:"Idaho7",qte:2.0,"u":"kg",note:"DH"}]},
 {id:16,nom:"La Mamagascard",style:"Ambrée épicée",abv:7.0,ibu:21,srm:13,og:1.069,fg:1.02,volume:500,permanent:false,prix:{b33:3.0,b75:7.0,f20:90,f30:135},description:"Ambrée au poivre de Madagascar — maltée, caramel, épices chaudes. Poivre en dry hop J+5.",houblons:["Nugget","Chinook","Simcoe"],levure:"Windsor",ingredients:[{nom:"Pale",qte:112.5,"u":"kg"},{nom:"Cara Vienne 55",qte:12.5,"u":"kg"},{nom:"Tourambre",qte:12.5,"u":"kg"},{nom:"Cara 240",qte:4.7,"u":"kg"},{nom:"Nugget",qte:0.27,"u":"kg",note:"60min"},{nom:"Sucre",qte:20,"u":"kg",note:"10min"},{nom:"Chinook",qte:0.5,"u":"kg",note:"aroma 80°C"},{nom:"Simcoe",qte:0.5,"u":"kg",note:"aroma 80°C"},{nom:"Poivre",qte:0.5,"u":"kg",note:"aroma 100°C"},{nom:"Windsor",qte:0.25,"u":"kg"},{nom:"Poivre",qte:0.3,"u":"kg",note:"DH J+5"}]},
 {id:17,nom:"La Mèrcure",style:"Session IPA",abv:4.0,ibu:25,srm:4,og:1.034,fg:1.006,volume:500,permanent:false,prix:{b33:2.6,b75:6.0,f20:75,f30:115},description:"Session IPA légère — Verdant, dry hop Mistral + Cascade pour finir en douceur.",houblons:["Mistral","Elixir","Cascade"],levure:"Verdant",ingredients:[{nom:"Pale",qte:50,"u":"kg"},{nom:"Blé",qte:25,"u":"kg"},{nom:"Flocon Avoine",qte:12.5,"u":"kg"},{nom:"Mistral",qte:0.65,"u":"kg",note:"60min"},{nom:"Elixir",qte:1.0,"u":"kg",note:"aroma 80°C"},{nom:"Verdant",qte:0.5,"u":"kg"},{nom:"Mistral",qte:2.0,"u":"kg",note:"DH"},{nom:"Cascade",qte:1.0,"u":"kg",note:"DH"}]},
 {id:18,nom:"La Papa Poule",style:"Sour fruitée",abv:3.5,ibu:12,srm:4,og:1.041,fg:1.009,volume:500,permanent:false,prix:{b33:2.8,b75:6.5,f20:85,f30:125},description:"Sour framboise / fruit de la passion — acidulée, légère, 60kg de purée de fruits.",houblons:["Nugget","Mistral"],levure:"Phily sour",ingredients:[{nom:"Pilsen",qte:87.5,"u":"kg"},{nom:"Flocon Avoine",qte:12.5,"u":"kg"},{nom:"Nugget",qte:0.13,"u":"kg",note:"60min"},{nom:"Framboise purée",qte:20,"u":"kg",note:"0min"},{nom:"Mistral",qte:0.5,"u":"kg",note:"aroma 80°C"},{nom:"Phily sour",qte:0.5,"u":"kg"},{nom:"Framboise purée",qte:10,"u":"kg",note:"DH J+0"},{nom:"Passion purée",qte:30,"u":"kg",note:"DH J+0"}]},
 {id:19,nom:"La Queen Bee",style:"Mead-beer",abv:5.5,ibu:30,srm:8,og:1.054,fg:1.013,volume:500,permanent:false,prix:{b33:3.2,b75:7.5,f20:95,f30:140},description:"Bière au miel — maltée douce, 60kg de miel, Sabro aromatique, levure CBC1 en conditionnement.",houblons:["Nugget","Sabro"],levure:"Windsor",ingredients:[{nom:"Pale",qte:37.5,"u":"kg"},{nom:"Cara Pils",qte:25,"u":"kg"},{nom:"Flocon Seigle",qte:12.5,"u":"kg"},{nom:"Nugget",qte:0.25,"u":"kg",note:"60min"},{nom:"Miel",qte:20,"u":"kg",note:"5min"},{nom:"Miel",qte:40,"u":"kg",note:"0min"},{nom:"Sabro",qte:0.6,"u":"kg",note:"aroma 80°C"},{nom:"Windsor",qte:0.25,"u":"kg"}]},
 {id:20,nom:"La Témèraire",style:"Black IPA",abv:5.0,ibu:53,srm:40,og:1.048,fg:1.01,volume:500,permanent:false,prix:{b33:2.8,b75:6.5,f20:85,f30:125},description:"Black IPA — robe noire, amertume tranchante, Sabro + Simcoe en dry hop.",houblons:["Sabro","Simcoe"],levure:"Nottingham",ingredients:[{nom:"Pale",qte:62.5,"u":"kg"},{nom:"Cara Vienne 55",qte:25,"u":"kg"},{nom:"Cara 240",qte:7,"u":"kg"},{nom:"Chocolat",qte:6,"u":"kg"},{nom:"Black",qte:6,"u":"kg"},{nom:"Flocon Avoine",qte:12.5,"u":"kg",note:"non concassé"},{nom:"Amèrisant",qte:0.8,"u":"kg",note:"60min"},{nom:"Sabro",qte:1.0,"u":"kg",note:"aroma 80°C"},{nom:"Nottingham",qte:0.25,"u":"kg"},{nom:"Sabro",qte:1.5,"u":"kg",note:"DH"},{nom:"Simcoe",qte:0.5,"u":"kg",note:"DH"}]},
];
const PRODUCTION_INIT=[
 {id:1,recette:"La Pèrilleuse",volume:460,statut:"terminé",dateDebut:"2025-09-19",dateCond:"2025-10-07",fermenteur:"FV-05",og:1.061,fg:1.020,abv:6,notes:"pH=4,37",mesures:[{date:"2025-09-19",valeur:1.061,temp:20,note:"DI"},{date:"2025-10-07",valeur:1.020,temp:5,note:"DF"}]},
 {id:2,recette:"L'Impèrtinente",volume:1629,statut:"terminé",dateDebut:"2025-09-16",dateCond:"2025-10-09",fermenteur:"FV-01",og:1.049,fg:1.006,abv:6,notes:"pH=4,31",mesures:[{date:"2025-09-16",valeur:1.049,temp:20,note:"DI"},{date:"2025-10-09",valeur:1.006,temp:5,note:"DF"}]},
 {id:3,recette:"La Blonde des Papas",volume:1840,statut:"terminé",dateDebut:"2025-09-25",dateCond:"2025-10-16",fermenteur:"FV-02",og:1.047,fg:1.011,abv:5,notes:"",mesures:[{date:"2025-09-25",valeur:1.047,temp:20,note:"DI"},{date:"2025-10-16",valeur:1.011,temp:5,note:"DF"}]},
 {id:4,recette:"La Supère",volume:915,statut:"terminé",dateDebut:"2025-09-30",dateCond:"2025-10-23",fermenteur:"FV-03",og:1.070,fg:1.007,abv:8.5,notes:"",mesures:[{date:"2025-09-30",valeur:1.070,temp:20,note:"DI"},{date:"2025-10-23",valeur:1.007,temp:5,note:"DF"}]},
 {id:5,recette:"La Mamagascar",volume:1108,statut:"terminé",dateDebut:"2025-10-03",dateCond:"2025-10-28",fermenteur:"FV-04",og:1.069,fg:1.018,abv:7,notes:"",mesures:[{date:"2025-10-03",valeur:1.069,temp:20,note:"DI"},{date:"2025-10-28",valeur:1.018,temp:5,note:"DF"}]},
 {id:6,recette:"La Pèrchée",volume:593,statut:"terminé",dateDebut:"2025-10-07",dateCond:"2025-10-30",fermenteur:"FV-05",og:1.036,fg:1.004,abv:4.5,notes:"",mesures:[{date:"2025-10-07",valeur:1.036,temp:20,note:"DI"},{date:"2025-10-30",valeur:1.004,temp:5,note:"DF"}]},
 {id:7,recette:"La Mary'Stout",volume:475,statut:"terminé",dateDebut:"2025-10-07",dateCond:"2025-11-04",fermenteur:"FV-01",og:1.071,fg:1.027,abv:6,notes:"",mesures:[{date:"2025-10-07",valeur:1.071,temp:20,note:"DI"},{date:"2025-11-04",valeur:1.027,temp:5,note:"DF"}]},
 {id:8,recette:"La Pèrlimpinpin",volume:1624,statut:"terminé",dateDebut:"2025-10-17",dateCond:"2025-11-06",fermenteur:"FV-01",og:1.056,fg:1.008,abv:6.5,notes:"",mesures:[{date:"2025-10-17",valeur:1.056,temp:20,note:"DI"},{date:"2025-11-06",valeur:1.008,temp:5,note:"DF"}]},
 {id:9,recette:"Papa Noël",volume:1503,statut:"terminé",dateDebut:"2025-10-21",dateCond:"2025-11-13",fermenteur:"FV-02",og:1.053,fg:1.003,abv:7.2,notes:"Coriandre 0.5kg",mesures:[{date:"2025-10-21",valeur:1.053,temp:20,note:"DI"},{date:"2025-11-13",valeur:1.003,temp:5,note:"DF"}]},
 {id:10,recette:"La Pèrilleuse",volume:974,statut:"terminé",dateDebut:"2025-10-28",dateCond:"2025-11-18",fermenteur:"FV-03",og:1.061,fg:1.021,abv:6,notes:"",mesures:[{date:"2025-10-28",valeur:1.061,temp:20,note:"DI"},{date:"2025-11-18",valeur:1.021,temp:5,note:"DF"}]},
 {id:11,recette:"La Pèrchée",volume:1261,statut:"terminé",dateDebut:"2025-10-30",dateCond:"2025-11-25",fermenteur:"FV-04",og:1.037,fg:1.006,abv:4.5,notes:"",mesures:[{date:"2025-10-30",valeur:1.037,temp:20,note:"DI"},{date:"2025-11-25",valeur:1.006,temp:5,note:"DF"}]},
 {id:12,recette:"La Mèrveilleuse",volume:475,statut:"terminé",dateDebut:"2025-11-03",dateCond:"2025-11-27",fermenteur:"FV-05",og:1.059,fg:1.015,abv:6,notes:"",mesures:[{date:"2025-11-03",valeur:1.059,temp:20,note:"DI"},{date:"2025-11-27",valeur:1.015,temp:5,note:"DF"}]},
 {id:13,recette:"L'Impèrtinente",volume:1810,statut:"terminé",dateDebut:"2025-11-13",dateCond:"2025-12-02",fermenteur:"FV-01",og:1.049,fg:1.006,abv:6,notes:"",mesures:[{date:"2025-11-13",valeur:1.049,temp:20,note:"DI"},{date:"2025-12-02",valeur:1.006,temp:5,note:"DF"}]},
 {id:14,recette:"La Pèrlimpinpin",volume:1789,statut:"terminé",dateDebut:"2025-11-20",dateCond:"2025-12-09",fermenteur:"FV-02",og:1.052,fg:1.006,abv:6.5,notes:"",mesures:[{date:"2025-11-20",valeur:1.052,temp:20,note:"DI"},{date:"2025-12-09",valeur:1.006,temp:5,note:"DF"}]},
 {id:15,recette:"La Mèrlimpinpin",volume:468,statut:"terminé",dateDebut:"2025-11-25",dateCond:"2025-12-11",fermenteur:"FV-03",og:1.070,fg:1.015,abv:8,notes:"",mesures:[{date:"2025-11-25",valeur:1.070,temp:20,note:"DI"},{date:"2025-12-11",valeur:1.015,temp:5,note:"DF"}]},
 {id:16,recette:"La Pèrilleuse",volume:1008,statut:"terminé",dateDebut:"2025-12-02",dateCond:"2025-12-16",fermenteur:"FV-04",og:1.059,fg:1.020,abv:6,notes:"",mesures:[{date:"2025-12-02",valeur:1.059,temp:20,note:"DI"},{date:"2025-12-16",valeur:1.020,temp:5,note:"DF"}]},
 {id:17,recette:"La Blonde des Papas",volume:1320,statut:"terminé",dateDebut:"2025-12-04",dateCond:"2025-12-23",fermenteur:"FV-01",og:1.040,fg:1.011,abv:5,notes:"",mesures:[{date:"2025-12-04",valeur:1.040,temp:20,note:"DI"},{date:"2025-12-23",valeur:1.011,temp:5,note:"DF"}]},
 {id:18,recette:"Single Hop Idaho7",volume:570,statut:"terminé",dateDebut:"2025-12-09",dateCond:"2025-12-29",fermenteur:"FV-05",og:1.046,fg:1.006,abv:5,notes:"",mesures:[{date:"2025-12-09",valeur:1.046,temp:20,note:"DI"},{date:"2025-12-29",valeur:1.006,temp:5,note:"DF"}]},
 {id:19,recette:"La Supère",volume:975,statut:"terminé",dateDebut:"2025-12-17",dateCond:"2026-01-15",fermenteur:"FV-03",og:1.069,fg:1.009,abv:8.5,notes:"",mesures:[{date:"2025-12-17",valeur:1.069,temp:20,note:"DI"},{date:"2026-01-15",valeur:1.009,temp:5,note:"DF"}]},
 {id:20,recette:"La Mèrveilleuse",volume:1453,statut:"terminé",dateDebut:"2025-12-12",dateCond:"2026-01-16",fermenteur:"FV-02",og:1.054,fg:1.018,abv:6,notes:"",mesures:[{date:"2025-12-12",valeur:1.054,temp:20,note:"DI"},{date:"2026-01-16",valeur:1.018,temp:5,note:"DF"}]},
 {id:21,recette:"La Papa Poule",volume:534,statut:"terminé",dateDebut:"2025-11-21",dateCond:"2026-01-19",fermenteur:"Eau",og:1.045,fg:null,abv:4.5,notes:"Sour",mesures:[{date:"2025-11-21",valeur:1.045,temp:20,note:"DI"}]},
 {id:22,recette:"Farmère",volume:1279,statut:"terminé",dateDebut:"2025-12-19",dateCond:"2026-01-23",fermenteur:"FV-04",og:1.048,fg:1.012,abv:5,notes:"",mesures:[{date:"2025-12-19",valeur:1.048,temp:20,note:"DI"},{date:"2026-01-23",valeur:1.012,temp:5,note:"DF"}]},
 {id:23,recette:"La Mamagascar",volume:554,statut:"terminé",dateDebut:"2025-12-30",dateCond:"2026-01-26",fermenteur:"FV-05",og:1.069,fg:null,abv:7,notes:"Poivre 0.75kg",mesures:[{date:"2025-12-30",valeur:1.069,temp:20,note:"DI"}]},
 {id:24,recette:"L'Impèrtinente",volume:1735,statut:"terminé",dateDebut:"2026-01-09",dateCond:"2026-02-03",fermenteur:"FV-01",og:1.049,fg:1.006,abv:6,notes:"",mesures:[{date:"2026-01-09",valeur:1.049,temp:20,note:"DI"},{date:"2026-02-03",valeur:1.006,temp:5,note:"DF"}]},
 {id:25,recette:"La Pèrlimpinpin",volume:1740,statut:"terminé",dateDebut:"2026-01-19",dateCond:"2026-02-10",fermenteur:"FV-02",og:1.052,fg:1.008,abv:6.5,notes:"",mesures:[{date:"2026-01-19",valeur:1.052,temp:20,note:"DI"},{date:"2026-02-10",valeur:1.008,temp:5,note:"DF"}]},
 {id:26,recette:"La Mèrlimpinpin",volume:879,statut:"terminé",dateDebut:"2026-01-14",dateCond:"2026-02-12",fermenteur:"FV-03",og:1.073,fg:1.016,abv:8,notes:"",mesures:[{date:"2026-01-14",valeur:1.073,temp:20,note:"DI"},{date:"2026-02-12",valeur:1.016,temp:5,note:"DF"}]},
 {id:27,recette:"La Mèrcure",volume:1159,statut:"terminé",dateDebut:"2026-01-26",dateCond:"2026-02-19",fermenteur:"FV-04",og:1.034,fg:null,abv:4,notes:"Session IPA",mesures:[{date:"2026-01-26",valeur:1.034,temp:20,note:"DI"}]},
 {id:28,recette:"La Pèrchée",volume:600,statut:"terminé",dateDebut:"2026-01-29",dateCond:"2026-02-24",fermenteur:"FV-05",og:1.037,fg:1.005,abv:4.5,notes:"",mesures:[{date:"2026-01-29",valeur:1.037,temp:20,note:"DI"},{date:"2026-02-24",valeur:1.005,temp:5,note:"DF"}]},
 {id:29,recette:"La Pèrlimpinpin",volume:1675,statut:"terminé",dateDebut:"2026-02-06",dateCond:"2026-03-03",fermenteur:"FV-01",og:1.055,fg:1.008,abv:6.5,notes:"",mesures:[{date:"2026-02-06",valeur:1.055,temp:20,note:"DI"},{date:"2026-03-03",valeur:1.008,temp:5,note:"DF"}]},
 {id:30,recette:"L'Impèrtinente",volume:1851,statut:"terminé",dateDebut:"2026-02-13",dateCond:"2026-03-06",fermenteur:"C2",og:1.055,fg:1.008,abv:6,notes:"pH=4,45. Lot 72",mesures:[{date:"2026-02-13",valeur:1.055,temp:20,note:"DI"},{date:"2026-03-06",valeur:1.008,temp:5,note:"DF"}]},
 {id:31,recette:"Comère",volume:947,statut:"terminé",dateDebut:"2026-02-19",dateCond:"2026-03-12",fermenteur:"C3",og:1.049,fg:1.007,abv:5,notes:"pH=4,37. Azacca + Centennial",mesures:[{date:"2026-02-19",valeur:1.049,temp:20,note:"DI"},{date:"2026-03-12",valeur:1.007,temp:5,note:"DF"}]},
 {id:32,recette:"La Supère",volume:0,statut:"terminé",dateDebut:"2026-02-26",dateCond:"2026-03-19",fermenteur:"C4",og:1.069,fg:1.009,abv:8.5,notes:"pH=4,4. Coriandre 0.8kg",mesures:[{date:"2026-02-26",valeur:1.069,temp:20,note:"DI"},{date:"2026-03-19",valeur:1.009,temp:5,note:"DF"}]},
 {id:33,recette:"La Pèrilleuse",volume:470,statut:"terminé",dateDebut:"2026-02-27",dateCond:"2026-03-20",fermenteur:"C5",og:1.060,fg:1.020,abv:6,notes:"pH=4,41",mesures:[{date:"2026-02-27",valeur:1.060,temp:20,note:"DI"},{date:"2026-03-20",valeur:1.020,temp:5,note:"DF"}]},
 {id:34,recette:"La Blonde des Papas",volume:2000,statut:"terminé",dateDebut:"2026-03-06",dateCond:"2026-03-27",fermenteur:"C1",og:1.043,fg:1.007,abv:5,notes:"pH=4,4",mesures:[{date:"2026-03-06",valeur:1.043,temp:20,note:"DI"},{date:"2026-03-27",valeur:1.007,temp:5,note:"DF"}]},
 {id:35,recette:"L'Impèrtinente",volume:1724,statut:"terminé",dateDebut:"2026-03-13",dateCond:"2026-04-03",fermenteur:"C2",og:1.046,fg:1.013,abv:6,notes:"pH=4,36. Lot 73",mesures:[{date:"2026-03-13",valeur:1.046,temp:20,note:"DI"},{date:"2026-04-03",valeur:1.013,temp:5,note:"DF"}]},
 // ── 5 brassins en cours (cuves C1–C5) ──
 {id:36,recette:"Chromamatik",volume:0,statut:"garde",dateDebut:"2026-03-17",dateCond:null,fermenteur:"C4",og:1.079,fg:null,abv:8,notes:"Malts: Pilsen 200kg, Pale 125kg, Blé 50kg. Cascade 2kg",mesures:[{date:"2026-03-17",valeur:1.079,temp:20,note:"DI"}]},
 {id:37,recette:"BCDC",volume:0,statut:"fermentation",dateDebut:"2026-03-25",dateCond:null,fermenteur:"C5",og:1.043,fg:null,abv:5,notes:"Malts: Pilsen 50kg, Pale 50kg",mesures:[{date:"2026-03-25",valeur:1.043,temp:20,note:"DI"}]},
 {id:38,recette:"La Mèrveilleuse",volume:0,statut:"fermentation",dateDebut:"2026-03-27",dateCond:null,fermenteur:"C3",og:1.054,fg:null,abv:6,notes:"Malts: Pilsen 75kg, Pale 50kg, Blé 50kg. Verdant",mesures:[{date:"2026-03-27",valeur:1.054,temp:20,note:"DI"}]},
 {id:39,recette:"La Pèrlimpinpin",volume:0,statut:"brassage",dateDebut:"2026-04-02",dateCond:null,fermenteur:"C1",og:1.052,fg:null,abv:6.5,notes:"Malts: Pilsen 262.5kg, Pale 150kg, Cara240 12kg",mesures:[{date:"2026-04-02",valeur:1.052,temp:20,note:"DI"}]},
 {id:40,recette:"Foot Montaigu",volume:0,statut:"planifié",dateDebut:"2026-04-10",dateCond:null,fermenteur:"C2",og:null,fg:null,abv:5.5,notes:"Malts: Pilsen 262.5kg. Brassage prévu 10/04",mesures:[]},
];
const STOCK_COND_INIT=[
 {id:1,nom:"Bouteille 33cl",cat:"Bouteille",qte:4800,u:"unités",seuil:500,prix:0.28,four:"Verallia",dateAjout:"2026-01-15"},
 {id:2,nom:"Bouteille 75cl",cat:"Bouteille",qte:2400,u:"unités",seuil:300,prix:0.55,four:"Verallia",dateAjout:"2026-01-15"},
 {id:3,nom:"Capsule couronne 26mm",cat:"Capsule",qte:8500,u:"unités",seuil:1000,prix:0.04,four:"Brasserie+",dateAjout:"2026-02-01"},
 {id:4,nom:"Bouchon liège 75cl",cat:"Capsule",qte:800,u:"unités",seuil:200,prix:0.18,four:"Brasserie+",dateAjout:"2026-01-20"},
 {id:5,nom:"Étiquette avant 33cl",cat:"Étiquette",qte:4200,u:"unités",seuil:500,prix:0.12,four:"Imprimerie Loir",dateAjout:"2026-02-10"},
 {id:6,nom:"Étiquette avant 75cl",cat:"Étiquette",qte:1800,u:"unités",seuil:300,prix:0.15,four:"Imprimerie Loir",dateAjout:"2026-02-10"},
 {id:7,nom:"Contre-étiquette",cat:"Étiquette",qte:3200,u:"unités",seuil:400,prix:0.08,four:"Imprimerie Loir",dateAjout:"2026-02-10"},
 {id:8,nom:"Fût 20L Inox",cat:"Fût",qte:42,u:"fûts",seuil:5,prix:85.0,four:"KegLand",dateAjout:"2025-10-01"},
 {id:9,nom:"Fût 30L Inox",cat:"Fût",qte:68,u:"fûts",seuil:8,prix:110.0,four:"KegLand",dateAjout:"2025-10-01"},
 {id:10,nom:"Caisse 12×33cl",cat:"Emballage",qte:320,u:"caisses",seuil:50,prix:1.20,four:"Raja",dateAjout:"2026-01-15"},
 {id:11,nom:"Caisse 6×75cl",cat:"Emballage",qte:180,u:"caisses",seuil:30,prix:1.40,four:"Raja",dateAjout:"2026-01-15"},
 {id:12,nom:"Film rétractable",cat:"Emballage",qte:15,u:"rouleaux",seuil:3,prix:28.0,four:"Raja",dateAjout:"2026-02-01"},
 {id:13,nom:"CO₂ alimentaire",cat:"Gaz",qte:3,u:"bouteilles",seuil:1,prix:45.0,four:"Air Liquide",dateAjout:"2026-02-15"},
 {id:14,nom:"Bière de rinçage",cat:"Nettoyage",qte:120,u:"litres",seuil:20,prix:0.50,four:"Interne",dateAjout:"2026-03-01"},
];
const COND_SESSIONS_INIT=[
 {id:1,brassinId:2,brassinNom:"L'Impèrtinente",date:"2025-10-09",lots:[{type:"Bouteille 33cl",volume:556,contenants:1685,lot:"2520409011-A"},{type:"Bouteille 75cl",volume:493,contenants:658,lot:"2520409011-B"}],notes:"pH = 4,31",operateur:"Équipe A"},
 {id:2,brassinId:29,brassinNom:"La Pèrlimpinpin",date:"2026-03-03",lots:[{type:"Bouteille 33cl",volume:1106,contenants:3352,lot:"26-323-A"},{type:"Bouteille 75cl",volume:568,contenants:758,lot:"26-323-B"}],notes:"Lot: 26-323/25-276",operateur:"Équipe B"},
];

const TIREUSES_INIT=[
 {id:1,nom:"1BEC 1",label:"1 Bec",  becs:1,type:"petite", capacite:"1×20L ou 30L",  etat:"disponible",couleur:"#D4920E",notes:"Petite tireuse 1 robinet — froid sec"},
 {id:2,nom:"1BEC 2",label:"1 Bec",  becs:1,type:"petite", capacite:"1×20L ou 30L",  etat:"disponible",couleur:"#D4920E",notes:"Petite tireuse 1 robinet — froid sec"},
 {id:3,nom:"1BEC 3",label:"1 Bec",  becs:1,type:"petite", capacite:"1×20L ou 30L",  etat:"disponible",couleur:"#D4920E",notes:"Petite tireuse 1 robinet — froid sec"},
 {id:4,nom:"2BEC 1",label:"2 Becs", becs:2,type:"petite", capacite:"2×20L ou 30L",  etat:"disponible",couleur:"#3A6830",notes:"Petite tireuse 2 robinets — froid sec"},
 {id:5,nom:"2BEC 2",label:"2 Becs", becs:2,type:"petite", capacite:"2×20L ou 30L",  etat:"disponible",couleur:"#3A6830",notes:"Petite tireuse 2 robinets — froid sec"},
 {id:6,nom:"2BARI", label:"2 Bari", becs:2,type:"barillet",capacite:"2×20L ou 30L",  etat:"disponible",couleur:"#5A6E28",notes:"Puissante & compacte — 2 robinets — froid sec"},
 {id:7,nom:"2BCF",  label:"2 BCF",  becs:2,type:"banc_glace",capacite:"2×20L ou 30L",etat:"disponible",couleur:"#2A5A80",notes:"Grosse tireuse banc de glace — robuste — mise en route longue"},
 {id:8,nom:"2BCG",  label:"2 BCG",  becs:2,type:"banc_glace",capacite:"2×20L ou 30L",etat:"disponible",couleur:"#7A3A6A",notes:"Grosse tireuse banc de glace — robuste — mise en route longue"},
];
const LOCATIONS_INIT=[
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
const TARIFS_LOC={tireuse1j:30,tireuse2j:50,tireuseWE:65,tireuseS:110,};

const TYPE_ICONS={"Bouteille 33cl":"🍺","Bouteille 75cl":"🍾","Fût 20L":"🛢","Fût 30L":"🛢","Fût personnalisé":"🛢"};
const TYPE_COLORS={"Bouteille 33cl":C.green,"Bouteille 75cl":"#2A6080","Fût 20L":C.brick,"Fût 30L":C.brick,"Fût personnalisé":C.hop};

function Modal({onClose,children,wide}){
 return (
  <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:1000,backdropFilter:'blur(6px)',WebkitBackdropFilter:'blur(6px)'}}>
   <div style={{background:C.bgCard,borderRadius:'20px 20px 0 0',borderTop:`2px solid ${C.amber}`,width:'100%',maxWidth:wide?680:520,maxHeight:'92vh',overflowY:'auto',padding:'20px 20px 32px',boxShadow:`0 -8px 40px rgba(0,0,0,0.6),0 -1px 0 ${C.amberPale}`,animation:'fadeUp 0.22s cubic-bezier(0.34,1.56,0.64,1)'}}>
    <div style={{width:40,height:3,background:C.amber,borderRadius:2,margin:'0 auto 18px'}}/>
    {children}
   </div>
  </div>
 );
}

function ModuleDashboard({stock,brassins,fournisseurs,condSessions,recettes,stockCond,stockPF,locations,setModule}){
 const [view,setView]        = useState('dashboard'); // 'dashboard'|'hof'|'scoring'|'tracabilite'
 const [tracLot,setTracLot]  = useState(null);        // lot sélectionné pour tracabilité

 const actifs   = brassins.filter(b=>b.statut!=='terminé');
 const termines = brassins.filter(b=>b.statut==='terminé'&&b.volume>0);
 const totalVol = termines.reduce((s,b)=>s+b.volume,0);
 const alertes  = stock.filter(s=>s.qte<0||s.qte<=s.seuil);
 const critiques= stock.filter(s=>s.qte<0||s.qte<=s.seuil*0.5);
 const totalBt  = (condSessions||[]).reduce((s,cs)=>s+cs.lots.reduce((a,l)=>a+l.contenants,0),0);
 const today    = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});

 const pCond = calcPrixCond(stockCond);
 const fmtKey = {'Bouteille 33cl':'b33','Bouteille 75cl':'b75','Fût 20L':'f20','Fût 30L':'f30'};

 const scoreBieres = recettes.map(r => {
  const brassinRec = termines.filter(b=>b.recette===r.nom);
  const vol        = brassinRec.reduce((s,b)=>s+(b.volume||0),0);
  const nbBrassins = brassinRec.length;
  let cmL = 0;
  r.ingredients.forEach(ing=>{
   const s=findStock(stock,ing.nom);
   if(s) cmL += (ing.qte||0)*(s.prix||0);
  });
  cmL = r.volume>0 ? cmL/r.volume : 0;
  let ca = 0;
  condSessions.forEach(cs=>{
   if(cs.brassinNom!==r.nom&&!cs.brassinNom.includes(r.nom.split(' ')[1]||'')) return;
   cs.lots.forEach(lot=>{
    const pf  = (stockPF||[]).find(x=>x.lotId===`${cs.id}-${lot.lot}`);
    const qty = pf?(lot.contenants-pf.qteDispo):0;
    const pk  = fmtKey[lot.type];
    const pv  = r.prix?.[pk]||0;
    ca += qty*pv;
   });
  });
  const pvL = r.prix?.b33 ? r.prix.b33/0.33 : 0;
  const marge = pvL>0 ? Math.round((pvL-cmL)/pvL*100) : null;
  const maxVol   = 5000; // référence
  const maxFreq  = 10;
  const sVol     = Math.min(100, vol/maxVol*100)*0.4;
  const sFreq    = Math.min(100, nbBrassins/maxFreq*100)*0.3;
  const sMarge   = (marge||0)*0.3;
  const score    = Math.round(sVol+sFreq+sMarge);
  return {r, vol, nbBrassins, ca, marge, score,
   img: BEER_IMAGES[r.nom]||null};
 }).filter(x=>x.nbBrassins>0||x.vol>0)
  .sort((a,b)=>b.score-a.score);

 const hofMedals = ['🥇','🥈','🥉'];
 const hofCats = [
  {label:'⚗️ Plus brassée',     key:'vol',       fmt:v=>`${(v/1000).toFixed(2)} hL`,  desc:'Volume total produit'},
  {label:'🔁 Plus fréquente',   key:'nbBrassins',fmt:v=>`${v} brassins`,              desc:'Nombre de brassins'},
  {label:'💰 Meilleure marge',  key:'marge',     fmt:v=>v!=null?`${v}%`:'—',          desc:'Marge brute estimée'},
  {label:'📈 Meilleur CA',      key:'ca',        fmt:v=>`${v.toLocaleString('fr')}€`,  desc:'CA réalisé'},
 ];

 const buildTracabilite = (cs, lot) => {
  const brassin = brassins.find(b=>b.id===cs.brassinId);
  const recette = recettes.find(r=>r.nom===cs.brassinNom||r.nom===brassin?.recette);
  const ingredients = recette ? recette.ingredients.map(ing=>{
   const s = findStock(stock,ing.nom);
   const f = fournisseurs.find(x=>x.nom===s?.four);
   return {...ing, prixUnit:s?.prix, fournisseur:s?.four, certifBio:f?true:null};
  }) : [];
  return {cs, lot, brassin, recette, ingredients};
 };

 const allLots = condSessions.flatMap(cs=>
  cs.lots.map(lot=>({cs,lot,key:`${cs.id}-${lot.lot}`}))
 ).sort((a,b)=>new Date(b.cs.date)-new Date(a.cs.date));

 const TABS = [
  {id:'dashboard',  label:'Vue générale', icon:'🏠'},
  {id:'hof',        label:'Hall of Fame',  icon:'🏆'},
  {id:'scoring',    label:'Scoring bières',icon:'⭐'},
  {id:'tracabilite',label:'Traçabilité',   icon:'🔍'},
 ];

 return (
  <div style={{paddingBottom:80}}>

   <div style={{background:C.bgDark,borderBottom:`1px solid ${C.border}`,
    display:'flex',overflowX:'auto',scrollbarWidth:'none'}}>
    {TABS.map(t=>{
     const act=view===t.id;
     return (
      <button key={t.id} onClick={()=>setView(t.id)}
       style={{flexShrink:0,padding:'11px 16px',background:'none',border:'none',
        cursor:'pointer',fontSize:12,fontWeight:act?700:400,
        color:act?C.amber:C.textLight,whiteSpace:'nowrap',
        borderBottom:act?`2px solid ${C.amber}`:'2px solid transparent',
        fontFamily:FM,letterSpacing:0.5,
        textTransform:'uppercase',transition:'color 0.15s'}}>
       {t.icon} {t.label}
      </button>
     );
    })}
   </div>

   {view==='dashboard'&&(
    <div style={{padding:'16px'}}>
     <div style={{marginBottom:16}}>
      <h1 style={{fontFamily:FA,
       fontSize:'clamp(22px,6vw,30px)',color:C.text}}>Tableau de bord</h1>
      <p style={{color:C.textLight,fontSize:12,marginTop:3,
       fontFamily:FM,textTransform:'capitalize'}}>{today}</p>
     </div>
     <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
      <StatCard label="En cours" value={actifs.length} icon="⚗️" color={C.amber}
       sub={`${actifs.filter(b=>b.statut==='fermentation').length} en fermentation`}
       onClick={()=>setModule('production')}/>
      <StatCard label="Volume" value={`${(totalVol/1000).toFixed(2)} hL`} icon="🪣" color={C.green}
       sub="Oct.25–Mar.26" onClick={()=>setModule('historique')}/>
      <StatCard label="Alertes stock" value={alertes.length} icon="📦"
       color={critiques.length>0?C.alert:C.warn}
       sub={critiques.length>0?`⚠ ${critiques.length} critique(s)`:'Surveiller'}
       onClick={()=>setModule('stocks')}/>
      <StatCard label="Bouteilles" value={totalBt.toLocaleString('fr')} icon="🍾"
       color={"#2A6080"} sub={`${condSessions.length} sessions`}
       onClick={()=>setModule('conditionnement')}/>
     </div>
     <div style={{background:C.bgCard,border:`1px solid ${C.border}`,
      borderRadius:14,padding:'14px 16px',marginBottom:14}}>
      <div style={{display:'flex',justifyContent:'space-between',
       alignItems:'center',marginBottom:12}}>
       <h3 style={{fontFamily:FA,fontSize:17,color:C.text}}>
        Fermenteurs actifs
       </h3>
       <button onClick={()=>setModule('production')}
        style={{background:'none',border:`1px solid ${C.border}`,
         borderRadius:8,padding:'5px 12px',cursor:'pointer',
         fontSize:12,color:C.textMid}}>Voir →</button>
      </div>
      {actifs.length===0&&<p style={{color:C.textLight,textAlign:'center',
       padding:'12px 0',fontSize:13}}>Aucun brassin en cours</p>}
      {actifs.map(b=>{const j=Math.floor((Date.now()-new Date(b.dateDebut))/86400000);return(
       <div key={b.id} style={{display:'flex',alignItems:'center',gap:10,
        padding:'10px 12px',borderRadius:10,background:C.bg,
        marginBottom:6,border:`1px solid ${C.border}`}}>
        <div style={{width:34,height:34,borderRadius:8,background:C.bgDark,
         display:'flex',alignItems:'center',justifyContent:'center',
         fontFamily:FM,fontSize:9,color:C.amberL,
         flexShrink:0,lineHeight:1,textAlign:'center'}}>{b.fermenteur}</div>
        <div style={{flex:1,minWidth:0}}>
         <div style={{fontWeight:700,color:C.text,fontSize:14,
          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {b.recette}
         </div>
         <div style={{fontSize:11,color:C.textLight,
          fontFamily:FM,marginTop:1}}>
          {fmtDate(b.dateDebut)} · J+{j}
         </div>
        </div>
        <Badge statut={b.statut}/>
       </div>
      );})}
     </div>
     <div style={{background:C.bgCard,
      border:`1.5px solid ${critiques.length>0?C.alert:C.border}`,
      borderRadius:14,padding:'14px 16px'}}>
      <div style={{display:'flex',justifyContent:'space-between',
       alignItems:'center',marginBottom:10}}>
       <h3 style={{fontFamily:FA,fontSize:17,color:C.text}}>
        {critiques.length>0?'⚠ ':''}Alertes stock
       </h3>
       <button onClick={()=>setModule('stocks')}
        style={{background:'none',border:`1px solid ${C.border}`,
         borderRadius:8,padding:'5px 12px',cursor:'pointer',
         fontSize:12,color:C.textMid}}>Gérer →</button>
      </div>
      {alertes.length===0
       ?<div style={{textAlign:'center',padding:'10px 0',color:C.ok}}>
        <span style={{fontSize:22}}>✓</span>
        <p style={{fontSize:13,fontWeight:600,marginTop:4}}>Stocks OK</p>
       </div>
       :alertes.slice(0,5).map(s=>{
        const lv=alertLvl(s.qte,s.seuil);const ac=alertCol(lv);return(
        <div key={s.id} style={{display:'flex',justifyContent:'space-between',
         alignItems:'center',padding:'8px 10px',borderRadius:8,
         background:C.bgDark,marginBottom:5,border:`1px solid ${ac}20`,
         borderLeft:`3px solid ${ac}`}}>
         <div>
          <span style={{fontWeight:600,color:C.text,fontSize:13}}>{s.nom}</span>
          <span style={{fontSize:11,color:C.textLight,marginLeft:6}}>{s.cat}</span>
         </div>
         <div style={{fontFamily:FM,fontWeight:700,
          fontSize:13,color:ac}}>
          {fmt(s.qte)}<span style={{fontSize:10,marginLeft:2}}>{s.u}</span>
         </div>
        </div>
       );})}
      {alertes.length>5&&<p style={{fontSize:11,color:C.textLight,
       textAlign:'center',marginTop:4}}>+{alertes.length-5} autres</p>}
     </div>
    </div>
   )}

   {view==='hof'&&(
    <div style={{padding:'16px'}}>
     <div style={{marginBottom:20}}>
      <h2 style={{fontFamily:FA,
       fontSize:'clamp(22px,6vw,30px)',color:C.amber}}>Hall of Fame</h2>
      <p style={{fontSize:12,color:C.textLight,
       fontFamily:FM,marginTop:3}}>
       Palmarès des recettes · {termines.length} brassins analysés
      </p>
     </div>

     {hofCats.map(cat=>{
      const sorted = [...scoreBieres].sort((a,b)=>{
       const va = a[cat.key]??-1;
       const vb = b[cat.key]??-1;
       return vb-va;
      }).slice(0,3);
      return (
       <div key={cat.label} style={{background:C.bgCard,borderRadius:14,
        padding:'14px 16px',marginBottom:12,border:`1px solid ${C.border}`}}>
        <div style={{fontFamily:FM,fontSize:10,
         fontWeight:700,color:C.amber,textTransform:'uppercase',
         letterSpacing:1.5,marginBottom:12}}>
         {cat.label}
         <span style={{fontWeight:400,color:C.textLight,
          marginLeft:6,fontSize:9}}>{cat.desc}</span>
        </div>
        {sorted.map((s,i)=>{
         const img = s.img;
         const val = s[cat.key];
         const isFirst = i===0;
         return (
          <div key={s.r.nom} style={{display:'flex',alignItems:'center',
           gap:10,padding:'10px 12px',borderRadius:10,marginBottom:6,
           background:isFirst?C.amberPale:C.bgDark,
           border:`1px solid ${isFirst?C.amber:C.border}`,
           borderLeft:`3px solid ${i===0?C.amber:i===1?C.textMid:'#8A6220'}`}}>
           <div style={{fontSize:20,flexShrink:0,width:28,textAlign:'center'}}>
            {hofMedals[i]}
           </div>
           <div style={{width:38,height:38,borderRadius:6,flexShrink:0,
            overflow:'hidden',background:C.bg,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            {img
             ?<img src={img} style={{width:36,height:36,
               objectFit:'contain'}}
               onError={e=>e.target.style.display='none'}/>
             :<span style={{fontSize:18}}>🍺</span>}
           </div>
           <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:FA,fontSize:14,
             color:isFirst?C.amber:C.text,overflow:'hidden',
             textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
             {s.r.nom}
            </div>
            <div style={{fontSize:10,color:C.textLight,
             fontFamily:FM,marginTop:1}}>
             {s.r.style} · {s.r.abv}%
            </div>
           </div>
           <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontFamily:FM,fontWeight:700,
             fontSize:15,color:isFirst?C.amber:C.textMid}}>
             {cat.fmt(val)}
            </div>
            <div style={{fontSize:9,color:C.textLight,
             marginTop:1}}>{s.nbBrassins} brassins</div>
           </div>
          </div>
         );
        })}
       </div>
      );
     })}
    </div>
   )}

   {view==='scoring'&&(
    <div style={{padding:'16px'}}>
     <div style={{marginBottom:16}}>
      <h2 style={{fontFamily:FA,
       fontSize:'clamp(22px,6vw,30px)',color:C.text}}>Scoring bières</h2>
      <p style={{fontSize:12,color:C.textLight,
       fontFamily:FM,marginTop:3}}>
       Score = volume (40%) + fréquence (30%) + marge (30%)
      </p>
     </div>

     {scoreBieres.length===0&&(
      <div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}>
       <div style={{fontSize:40,marginBottom:10}}>⭐</div>
       <div style={{fontWeight:600}}>Pas encore de données</div>
      </div>
     )}

     {scoreBieres.map((s,i)=>{
      const pct = Math.min(100,s.score);
      const col = pct>=70?C.ok:pct>=45?C.amber:C.alert;
      return (
       <div key={s.r.nom} style={{background:C.bgCard,borderRadius:12,
        padding:'12px 14px',marginBottom:8,border:`1px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
         <div style={{width:26,height:26,borderRadius:6,flexShrink:0,
          background:i<3?C.amberPale:C.bgDark,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:FM,fontWeight:700,fontSize:12,
          color:i<3?C.amber:C.textLight,
          border:`1px solid ${i<3?C.amber:C.border}`}}>
          {i+1}
         </div>
         <div style={{width:36,height:36,borderRadius:6,flexShrink:0,
          overflow:'hidden',background:C.bgDark,
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          {s.img
           ?<img src={s.img} style={{width:34,height:34,objectFit:'contain'}}
             onError={e=>e.target.style.display='none'}/>
           :<span style={{fontSize:18}}>🍺</span>}
         </div>
         <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:FA,fontSize:15,
           color:C.text,overflow:'hidden',textOverflow:'ellipsis',
           whiteSpace:'nowrap'}}>{s.r.nom}</div>
          <div style={{fontSize:10,color:C.textLight,
           fontFamily:FM,marginTop:1}}>
           {s.r.style} · {s.r.permanent?'Permanente':'Éphémère'}
          </div>
         </div>
         <div style={{textAlign:'center',flexShrink:0,
          background:col+'18',borderRadius:8,padding:'4px 10px',
          border:`1px solid ${col}40`}}>
          <div style={{fontFamily:FM,fontWeight:900,
           fontSize:18,color:col,lineHeight:1}}>{s.score}</div>
          <div style={{fontSize:8,color:C.textLight,letterSpacing:0.5,
           textTransform:'uppercase',marginTop:2}}>score</div>
         </div>
        </div>

        <div style={{height:4,background:C.bgDark,borderRadius:2,
         overflow:'hidden',marginBottom:8}}>
         <div style={{height:'100%',background:col,
          borderRadius:2,width:`${pct}%`,transition:'width 0.5s ease'}}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
         {[
          ['Vol.',`${(s.vol/1000).toFixed(2)} hL`,C.green],
          ['Brassins',s.nbBrassins,C.amber],
          ['Marge',s.marge!=null?`${s.marge}%`:'—',s.marge>=50?C.ok:s.marge>=30?C.warn:C.alert],
          ['CA',s.ca>0?`${Math.round(s.ca/1000)}k€`:'—',C.textMid],
         ].map(([l,v,col])=>(
          <div key={l} style={{background:C.bgDark,borderRadius:6,
           padding:'5px 6px',textAlign:'center'}}>
           <div style={{fontFamily:FM,fontWeight:700,
            fontSize:12,color:col,lineHeight:1}}>{v}</div>
           <div style={{fontSize:8,color:C.textLight,
            textTransform:'uppercase',letterSpacing:0.5,marginTop:2}}>{l}</div>
          </div>
         ))}
        </div>
       </div>
      );
     })}

     <div style={{background:C.bgDark,borderRadius:10,padding:'10px 14px',
      marginTop:8,border:`1px solid ${C.border}`}}>
      <div style={{fontSize:9,fontFamily:FM,color:C.textLight,
       letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>
       Légende du score
      </div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
       {[[C.ok,'≥ 70 — Excellente'],[C.amber,'45–69 — Bonne'],[C.alert,'< 45 — À développer']].map(([col,l])=>(
        <div key={l} style={{display:'flex',alignItems:'center',gap:5,
         fontSize:10,color:C.textMid}}>
         <div style={{width:10,height:10,borderRadius:2,background:col}}/>
         {l}
        </div>
       ))}
      </div>
     </div>
    </div>
   )}

   {view==='tracabilite'&&(
    <div style={{padding:'16px'}}>
     <div style={{marginBottom:14}}>
      <h2 style={{fontFamily:FA,
       fontSize:'clamp(22px,6vw,30px)',color:C.text}}>Traçabilité</h2>
      <p style={{fontSize:12,color:C.textLight,
       fontFamily:FM,marginTop:3}}>
       Audit complet lot → brassin → ingrédients · Certification Bio FR-BIO-09
      </p>
     </div>

     {!tracLot&&(
      <div>
       <div style={{fontSize:10,fontWeight:700,color:C.textLight,
        fontFamily:FM,letterSpacing:1.5,
        textTransform:'uppercase',marginBottom:10}}>
        Sélectionner un lot
       </div>
       {allLots.map(({cs,lot,key})=>(
        <div key={key} onClick={()=>setTracLot({cs,lot})}
         style={{display:'flex',gap:10,alignItems:'center',
          padding:'12px 14px',borderRadius:10,marginBottom:6,
          background:C.bgCard,border:`1px solid ${C.border}`,
          cursor:'pointer',borderLeft:`3px solid ${C.amber}`}}>
         <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:FM,fontWeight:700,
           fontSize:13,color:C.cream,marginBottom:3}}>
           {lot.lot}
          </div>
          <div style={{fontSize:11,color:C.textLight,
           fontFamily:FM}}>
           {cs.brassinNom} · {lot.type} · {fmtDate(cs.date)}
          </div>
         </div>
         <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontFamily:FM,fontWeight:700,
           fontSize:14,color:C.amber}}>{lot.contenants}</div>
          <div style={{fontSize:9,color:C.textLight}}>
           {lot.type.includes('Fût')?'fûts':'bouteilles'}
          </div>
         </div>
         <span style={{color:C.textLight,fontSize:16}}>›</span>
        </div>
       ))}
       {allLots.length===0&&(
        <div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}>
         <div style={{fontSize:36,marginBottom:8}}>🔍</div>
         <div style={{fontWeight:600}}>Aucun lot conditionné</div>
        </div>
       )}
      </div>
     )}

     {tracLot&&(()=>{
      const {cs,lot} = tracLot;
      const trac = buildTracabilite(cs,lot);
      const {brassin,recette,ingredients} = trac;

      return (
       <div>
        <button onClick={()=>setTracLot(null)}
         style={{display:'flex',alignItems:'center',gap:5,
          background:'none',border:'none',color:C.textMid,
          fontSize:12,fontWeight:700,fontFamily:FM,
          letterSpacing:0.5,marginBottom:16,padding:0,cursor:'pointer'}}>
         ← LISTE DES LOTS
        </button>

        <div style={{background:C.amberPale,borderRadius:12,
         padding:'14px',marginBottom:12,
         border:`1.5px solid ${C.amber}`}}>
         <div style={{fontFamily:FM,fontSize:8,
          letterSpacing:3,color:C.amber,textTransform:'uppercase',
          marginBottom:4}}>N° LOT</div>
         <div style={{fontFamily:"'Bebas Neue',sans-serif",
          fontSize:28,color:C.amber,letterSpacing:2,lineHeight:1,
          marginBottom:6}}>{lot.lot}</div>
         <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <Tag text={lot.type} color={C.amber} bg={C.bgCard}/>
          <Tag text={`${lot.contenants} ${lot.type.includes('Fût')?'fûts':'btl'}`}
           color={C.textMid} bg={C.bgCard}/>
          <Tag text={fmtDate(cs.date)} color={C.textLight} bg={C.bgCard}/>
          <Tag text="FR-BIO-09" color={C.greenL} bg={C.greenPale}/>
         </div>
        </div>

        <Section title="1 — Conditionnement" color={C.amber}>
         <Row label="Date"        value={fmtDate(cs.date)}   mono/>
         <Row label="Opérateur"   value={cs.operateur}/>
         <Row label="Volume"      value={`${lot.volume} L`}  mono/>
         <Row label="Contenants"  value={`${lot.contenants} ${lot.type}`} mono/>
         {cs.notes&&<Row label="Notes" value={cs.notes}/>}
        </Section>

        <Section title="2 — Brassin d'origine" color={C.green}>
         {brassin?(
          <>
           <Row label="Recette"         value={brassin.recette}/>
           <Row label="Fermenteur"      value={brassin.fermenteur} mono/>
           <Row label="Date brassage"   value={fmtDate(brassin.dateDebut)} mono/>
           <Row label="Date cond."      value={fmtDate(brassin.dateCond)}  mono/>
           {brassin.og&&<Row label="Densité Initiale (DI)" value={brassin.og.toFixed(3)} mono/>}
           {brassin.fg&&<Row label="Densité Finale (DF)"   value={brassin.fg.toFixed(3)} mono/>}
           {brassin.abv&&<Row label="ABV"                  value={`${brassin.abv}%`} mono/>}
           {brassin.notes&&<Row label="Notes"              value={brassin.notes}/>}
           {brassin.mesures?.length>0&&(
            <div style={{marginTop:8}}>
             <div style={{fontSize:9,color:C.textLight,
              fontFamily:FM,letterSpacing:1,
              textTransform:'uppercase',marginBottom:6}}>
              Suivi densité
             </div>
             <div style={{display:'flex',gap:5,overflowX:'auto',
              scrollbarWidth:'none'}}>
              {brassin.mesures.map((m,i)=>(
               <div key={`k${i}`} style={{flexShrink:0,textAlign:'center',
                background:C.bgDark,borderRadius:6,padding:'6px 8px',
                border:`1px solid ${C.border}`,minWidth:60}}>
                <div style={{fontFamily:FM,
                 fontWeight:700,fontSize:11,color:C.amber}}>
                 {m.valeur.toFixed(3)}
                </div>
                <div style={{fontSize:8,color:C.textLight,marginTop:1}}>{m.note}</div>
                <div style={{fontSize:7,color:C.textLight}}>{fmtDate(m.date)}</div>
               </div>
              ))}
             </div>
            </div>
           )}
          </>
         ):<div style={{fontSize:12,color:C.textLight}}>Brassin non trouvé</div>}
        </Section>

        <Section title="3 — Recette & ingrédients" color={C.hop}>
         {recette?(
          <>
           <Row label="Recette"  value={recette.nom}/>
           <Row label="Style"    value={`${recette.style} · ${recette.abv}% ABV`}/>
           <Row label="Volume réf." value={`${recette.volume} L`} mono/>
           <div style={{marginTop:10}}>
            <div style={{fontSize:9,color:C.textLight,
             fontFamily:FM,letterSpacing:1,
             textTransform:'uppercase',marginBottom:8}}>
             Matières premières
            </div>
            {ingredients.map((ing,i)=>(
             <div key={`k${i}`} style={{padding:'7px 10px',borderRadius:7,
              marginBottom:5,background:C.bgDark,
              border:`1px solid ${C.border}`,
              display:'flex',justifyContent:'space-between',
              alignItems:'center'}}>
              <div style={{flex:1,minWidth:0}}>
               <div style={{fontWeight:600,color:C.cream,
                fontSize:12}}>{ing.nom}</div>
               <div style={{fontSize:10,color:C.textLight,
                fontFamily:FM,marginTop:1}}>
                {ing.qte} {ing.u}
                {ing.fournisseur&&
                 <span style={{color:C.hop,marginLeft:6}}>
                  · {ing.fournisseur}
                 </span>}
               </div>
              </div>
              <span style={{fontSize:9,fontWeight:700,color:C.greenL,
               background:C.greenPale,padding:'2px 7px',
               borderRadius:4,border:`1px solid ${C.green}30`,
               fontFamily:FM,flexShrink:0,
               marginLeft:8}}>
               🌿 BIO
              </span>
             </div>
            ))}
           </div>
          </>
         ):<div style={{fontSize:12,color:C.textLight}}>Recette non trouvée</div>}
        </Section>

        <Section title="4 — Certification & conformité" color={C.greenL}>
         <Row label="Certification"   value="Agriculture Biologique FR-BIO-09"/>
         <Row label="Organisme"        value="Certipaq — FR-BIO-09"/>
         <Row label="Brasserie"        value="Les Papas Brasseurs"/>
         <Row label="Adresse"          value="4 Rue du Puits de la Grange, 44190 Clisson"/>
         <Row label="Ingrédients"      value="100% issus de l'agriculture biologique"/>
         <Row label="Contient gluten"  value="Oui (malts d'orge, blé)"/>
         <div style={{marginTop:10,padding:'8px 12px',borderRadius:8,
          background:C.greenPale,border:`1px solid ${C.green}30`,
          fontSize:11,color:C.greenL,lineHeight:1.6,
          fontFamily:FM}}>
          ✓ Ce lot est traçable de la matière première au conditionnement.
          Document généré pour audit de certification biologique.
         </div>
        </Section>
       </div>
      );
     })()}
    </div>
   )}
  </div>
 );
}

function ModuleStocks({stock,setStock,fournisseurs}){
 const [fc,setFc]=useState('Tous');
 const [q,setQ]=useState('');
 const [showF,setShowF]=useState(false);
 const [edit,setEdit]=useState(null);
 const today=new Date().toISOString().split('T')[0];
 const EF={nom:'',cat:'Malt',qte:'',u:'kg',seuil:'',prix:'',four:'',dateAjout:today};
 const [form,setForm]=useState(EF);
 const filtered=stock.filter(s=>(fc==='Tous'||s.cat===fc)&&s.nom.toLowerCase().includes(q.toLowerCase()));
 const errs=stock.filter(s=>s.qte<0).length;
 const alertes=stock.filter(s=>s.qte<=s.seuil).length;
 const openEdit=s=>{setEdit(s);setForm({...s,qte:String(s.qte),seuil:String(s.seuil),prix:String(s.prix),dateAjout:s.dateAjout||today});setShowF(true);};
 const save=()=>{const it={...form,id:edit?.id||Date.now(),qte:parseFloat(form.qte)||0,seuil:parseFloat(form.seuil)||0,prix:parseFloat(form.prix)||0};setStock(edit?stock.map(s=>s.id===edit.id?it:s):[...stock,it]);setShowF(false);setEdit(null);setForm(EF);};
 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
    <div>
     <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',color:C.text}}>Stocks</h2>
     <p style={{color:C.textLight,fontSize:12,fontFamily:FM,marginTop:2}}>
      {stock.length} réf.{errs>0&&<span style={{color:C.alert,marginLeft:6}}>⚠{errs}</span>}
      {alertes>0&&<span style={{color:C.amber,marginLeft:4}}>· {alertes} alerte{alertes>1?'s':''}</span>}
     </p>
    </div>
    <button onClick={()=>setShowF(true)} style={{background:C.amber,color:'#fff',border:'none',borderRadius:10,padding:'10px 16px',fontWeight:700,fontSize:14,minHeight:44}}>+ Ajouter</button>
   </div>
   <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:12,scrollbarWidth:'none'}}>
    {['Tous',...Object.keys(CAT_COLORS)].map(cat=>{const active=fc===cat;const color=CAT_COLORS[cat]||C.text;const n=cat==='Tous'?stock.length:stock.filter(s=>s.cat===cat).length;return(
     <button key={cat} onClick={()=>setFc(cat)} style={{flexShrink:0,padding:'7px 14px',borderRadius:20,border:`1.5px solid ${active?(CAT_COLORS[cat]||C.amber):C.border}`,background:active?(CAT_COLORS[cat]||C.amber):C.bgCard,color:active?'#fff':(CAT_COLORS[cat]||C.text),fontWeight:600,fontSize:12,minHeight:36,whiteSpace:'nowrap'}}>{cat}{n>0?` (${n})`:''}</button>
    );})}
   </div>
   <input placeholder="🔍 Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={{...iSt,marginBottom:12}}/>
   <div style={{display:'flex',flexDirection:'column',gap:8}}>
    {filtered.length===0&&<div style={{textAlign:'center',padding:32,color:C.textLight,fontSize:14}}>Aucun résultat</div>}
    {filtered.map(s=>{const lv=alertLvl(s.qte,s.seuil);const ac=alertCol(lv);const cc=CAT_COLORS[s.cat]||C.textMid;return(
     <div key={s.id} style={{background:C.bgCard,border:`1.5px solid ${lv==='error'?C.alert:lv==='warn'?C.amber:C.border}`,borderRadius:12,padding:'12px 14px',borderLeft:`4px solid ${cc}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
       <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:3}}>{s.nom}</div>
        <Tag text={s.cat} color={cc} bg={`${cc}18`}/>
       </div>
       <div style={{textAlign:'right',flexShrink:0,marginLeft:10}}>
        <div style={{fontFamily:FM,fontWeight:700,fontSize:18,color:ac}}>{s.qte<0?'⚠ ':''}{fmt(s.qte)}</div>
        <div style={{fontSize:11,color:C.textLight}}>{s.u}</div>
       </div>
      </div>
      <div style={{display:'flex',gap:16,fontSize:12,color:C.textMid,marginBottom:8,flexWrap:'wrap'}}>
       <span>Seuil: <strong style={{color:C.text}}>{fmt(s.seuil)} {s.u}</strong></span>
       {s.prix>0&&<span>Prix: <strong style={{color:C.text}}>{s.prix}€/{s.u}</strong></span>}
       {s.four&&<span style={{color:C.textLight}}>{s.four}</span>}
      </div>
      <div style={{height:4,background:C.border,borderRadius:2,overflow:'hidden',marginBottom:8}}>
       <div style={{height:'100%',borderRadius:2,background:ac,width:`${Math.min(100,Math.max(0,(s.qte/(s.seuil*2))*100))}%`}}/>
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
       <button onClick={()=>openEdit(s)} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 14px',fontSize:13,minHeight:36,color:C.textMid}}>✏ Modifier</button>
       <button onClick={()=>setStock(stock.filter(x=>x.id!==s.id))} style={{background:C.brickPale,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 14px',fontSize:13,minHeight:36,color:C.alert}}>✕</button>
      </div>
     </div>
    );})}
   </div>
   {showF&&(
    <Modal onClose={()=>{setShowF(false);setEdit(null);setForm(EF);}}>
     <h3 style={{fontFamily:FA,fontSize:20,color:C.text,marginBottom:16}}>{edit?'Modifier':'Ajouter'} un ingrédient</h3>
     <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div><Label t="Nom"/><input value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} style={iSt}/></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
       <div><Label t="Catégorie"/><select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={iSt}>{Object.keys(CAT_COLORS).map(c=><option key={c}>{c}</option>)}</select></div>
       <div><Label t="Unité"/><input value={form.u} onChange={e=>setForm({...form,u:e.target.value})} style={iSt}/></div>
       <div><Label t="Quantité"/><input type="number" value={form.qte} onChange={e=>setForm({...form,qte:e.target.value})} style={iSt}/></div>
       <div><Label t="Seuil alerte"/><input type="number" value={form.seuil} onChange={e=>setForm({...form,seuil:e.target.value})} style={iSt}/></div>
       <div><Label t="Prix/unité €"/><input type="number" value={form.prix} onChange={e=>setForm({...form,prix:e.target.value})} style={iSt}/></div>
       <div><Label t="Date d'ajout"/><input type="date" value={form.dateAjout} onChange={e=>setForm({...form,dateAjout:e.target.value})} style={iSt}/></div>
      </div>
      <div><Label t="Fournisseur"/><select value={form.four} onChange={e=>setForm({...form,four:e.target.value})} style={iSt}><option value="">— Choisir —</option>{fournisseurs.map(f=><option key={f.id} value={f.nom}>{f.nom}</option>)}</select></div>
     </div>
     <div style={{display:'flex',gap:10,marginTop:18,justifyContent:'flex-end'}}>
      <Btn onClick={()=>{setShowF(false);setEdit(null);setForm(EF);}}>Annuler</Btn>
      <Btn p onClick={save}>Enregistrer</Btn>
     </div>
    </Modal>
   )}
  </div>
 );
}

function ModuleRecettes({recettes,setRecettes,stock,stockCond}){
 const [sel,setSel]           = useState(null);
 const [editMode,setEditMode] = useState(false);  // 'prix' | 'recette' | false
 const [pxForm,setPxForm]     = useState({});
 const [editForm,setEditForm] = useState(null);   // form d'édition recette complète
 const [f,setF]               = useState('Toutes');
 const [q,setQ]               = useState('');

 const filtered = recettes.filter(r=>
  (f==='Toutes'||(f==='Permanentes'?r.permanent:!r.permanent))&&
  (r.nom+' '+r.style+' '+(r.description||'')).toLowerCase().includes(q.toLowerCase())
 );

 const SRM = s=>s<=3?'#F5E69A':s<=6?'#E8C84A':s<=10?'#D4A017':s<=16?'#C8820A':s<=22?'#A0520A':s<=30?'#6B3010':'#3A1A0A';

 const coutMatieres = r => {
  let t=0;
  (r.ingredients||[]).forEach(ing=>{
   const s=findStock(stock,ing.nom);
   if(s) t+=(ing.qte||0)*(s.prix||0);
  });
  return t;
 };
 const coutParL = r => r.volume>0 ? coutMatieres(r)/r.volume : 0;
 const pCond = calcPrixCond(stockCond);
 const coutRevient = (r,fmt) => {
  const vol={b33:0.33,b75:0.75,f20:20,f30:30}[fmt]||0;
  return coutParL(r)*vol+(pCond[fmt]||0);
 };
 const marge = (prix,cout) => prix>0 ? Math.round((prix-cout)/prix*100) : null;
 const chk = r => (r.ingredients||[]).map(ing=>{
  const s=findStock(stock,ing.nom);
  return {...ing,sq:s?.qte,px:s?.prix,ok:!s||s.qte>=ing.qte};
 });

 const savePrix = () => {
  const px={b33:parseFloat(pxForm.b33)||0,b75:parseFloat(pxForm.b75)||0,
       f20:parseFloat(pxForm.f20)||0,f30:parseFloat(pxForm.f30)||0};
  setRecettes(recettes.map(r=>r.id===sel.id?{...r,prix:px}:r));
  setSel(prev=>({...prev,prix:px}));
  setEditMode(false);
 };

 const saveRecette = () => {
  const ef = editForm;
  const updated = {
   ...ef,
   abv:            parseFloat(ef.abv)||0,
   ibu:            parseInt(ef.ibu)||0,
   srm:            parseInt(ef.srm)||0,
   og:             parseFloat(ef.og)||0,
   fg:             parseFloat(ef.fg)||0,
   volume:         parseInt(ef.volume)||0,
   ingredients:    ef.ingredients.filter(i=>i.nom?.trim()),
   paliersMash:    ef.paliersMash||[],
   houblonsDetail: ef.houblonsDetail||[],
   correctionEau:  ef.correctionEau||'',
   eauMash:        ef.eauMash||'',
   eauSparge:      ef.eauSparge||'',
   pHMash:         ef.pHMash||'',
   tempFerm:       ef.tempFerm||'',
   dureeFerm:      ef.dureeFerm||'',
   tempColdCrash:  ef.tempColdCrash||'',
   dureeColdCrash: ef.dureeColdCrash||'',
   resucrage:      ef.resucrage||{},
  };
  if(ef.id) {
   setRecettes(recettes.map(r=>r.id===ef.id ? updated : r));
   setSel(updated);
  } else {
   const newR = {...updated, id: Date.now()};
   setRecettes([...recettes, newR]);
   setSel(null);  // ne pas ouvrir la modal après création
  }
  setEditMode(false);
  setEditForm(null);
 };

 const dupliquer = r => {
  const copy = {
   ...r,
   id:             Date.now(),
   nom:            `${r.nom} (copie)`,
   permanent:      false,
   imageUrl:       undefined,
   paliersMash:    (r.paliersMash||[]).map(p=>({...p})),
   houblonsDetail: (r.houblonsDetail||[]).map(h=>({...h})),
   resucrage:      {...r.resucrage||{}},
  };
  setEditForm(copy);
  setEditMode('recette');
  setSel(null);
 };

 const supprimer = r => {
  if(window.confirm(`Supprimer "${r.nom}" ?`)){
   setRecettes(recettes.filter(x=>x.id!==r.id));
   setSel(null);
  }
 };

 const openEdit = r => {
  setEditForm({
   ...r,
   prix:           {...r.prix||{}},
   ingredients:    (r.ingredients||[]).map(i=>({...i})),
   paliersMash:    (r.paliersMash||[]).map(p=>({...p})),
   houblonsDetail: (r.houblonsDetail||[]).map(h=>({...h})),
   resucrage:      {...r.resucrage||{bt:{taux:'5.5'},ecofass:{taux:'3.8'},inox:{taux:'3.5'}}},
   correctionEau:  r.correctionEau||'',
   eauMash:        r.eauMash||'',
   eauSparge:      r.eauSparge||'',
   pHMash:         r.pHMash||'',
   tempFerm:       r.tempFerm||'',
  });
  setEditMode('recette');
 };

 const addIng  = () => setEditForm(ef=>({...ef,
  ingredients:[...ef.ingredients,{nom:'',qte:'',u:'kg'}]}));
 const updIng  = (i,k,v) => setEditForm(ef=>({...ef,
  ingredients:(ef.ingredients||[]).map((x,j)=>j===i?{...x,[k]:v}:x)}));
 const delIng  = i => setEditForm(ef=>({...ef,
  ingredients:ef.ingredients.filter((_,j)=>j!==i)}));

 const PxCell = ({label,prix,cout}) => {
  const mg = marge(prix,cout);
  return(
   <div style={{background:C.bgCard,borderRadius:8,padding:'8px 6px',
    textAlign:'center',border:`1px solid ${C.border}`}}>
    <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',
     letterSpacing:0.8,fontFamily:FM,marginBottom:3}}>{label}</div>
    <div style={{fontFamily:FA,fontSize:16,
     color:prix>0?C.amber:C.textLight,lineHeight:1}}>
     {prix>0?`${prix}€`:'—'}
    </div>
    {mg!=null&&<div style={{fontSize:9,marginTop:2,
     color:mg>=60?C.ok:mg>=40?C.warn:C.alert,
     fontFamily:FM,fontWeight:700}}>
     {mg}% marge
    </div>}
    {cout>0&&<div style={{fontSize:8,color:C.textLight,marginTop:1,
     fontFamily:FM}}>coût {cout.toFixed(2)}€</div>}
   </div>
  );
 };

 if(editMode==='recette'&&editForm) return(
  <div style={{padding:'16px',paddingBottom:80}}>

   <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,
    position:'sticky',top:0,zIndex:10,background:C.bg,padding:'10px 0 10px',
    borderBottom:`1px solid ${C.border}`}}>
    <button onClick={()=>{setEditMode(false);setEditForm(null);setSel(null);}}
     style={{background:'none',border:`1px solid ${C.border}`,borderRadius:20,
      padding:'6px 14px',fontSize:12,fontWeight:700,color:C.textMid,cursor:'pointer',
      flexShrink:0}}>‹ Annuler</button>
    <h2 style={{fontFamily:FA,fontSize:18,color:C.text,
     flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
     {editForm.id&&recettes.find(r=>r.id===editForm.id)
      ?`Modifier — ${recettes.find(r=>r.id===editForm.id).nom}`
      :`Nouvelle recette${editForm.nom?` — ${editForm.nom}`:''}`}
    </h2>
    <Btn p onClick={saveRecette}>✓ Enregistrer</Btn>
   </div>

   <Section label="Identité">
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
     <div style={{gridColumn:'1/-1'}}>
      <Label t="Nom de la recette"/>
      <input value={editForm.nom||''} onChange={e=>setEditForm({...editForm,nom:e.target.value})}
       placeholder="La Nouvelle…" style={iSt}/>
     </div>
     <div>
      <Label t="Style bière"/>
      <input value={editForm.style||''} onChange={e=>setEditForm({...editForm,style:e.target.value})}
       placeholder="IPA, Ambrée, Stout…" style={iSt}/>
     </div>
     <div>
      <Label t="Volume de référence (L)"/>
      <input type="number" value={editForm.volume||''}
       onChange={e=>{
        const rec={...editForm,volume:e.target.value};
        setEditForm(rec);
       }}
       placeholder="300" style={iSt}/>
     </div>
     <div style={{display:'flex',gap:8,alignItems:'center',paddingTop:22}}>
      <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',
       fontSize:13,color:C.textMid}}>
       <input type="checkbox" checked={!!editForm.permanent}
        onChange={e=>setEditForm({...editForm,permanent:e.target.checked})}
        style={{width:16,height:16,accentColor:C.amber}}/>
       Permanente
      </label>
     </div>
     <div style={{gridColumn:'1/-1'}}>
      <Label t="Description"/>
      <textarea value={editForm.description||''}
       onChange={e=>setEditForm({...editForm,description:e.target.value})}
       placeholder="Description poétique…"
       style={{...iSt,height:70,resize:'vertical',lineHeight:1.6}}/>
     </div>
    </div>
   </Section>

   <Section label="Paramètres techniques">
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
     {[['ABV (%)',  'abv',  '0.1', '6.0'],
      ['IBU',      'ibu',  '1',   '35'],
      ['SRM',      'srm',  '1',   '8'],
      ['DI cible', 'og',   '0.001','1.050'],
      ['DF cible', 'fg',   '0.001','1.010'],
     ].map(([label,field,step,ph])=>(
      <div key={field}>
       <Label t={label}/>
       <input type="number" step={step} value={editForm[field]||''}
        onChange={e=>setEditForm({...editForm,[field]:e.target.value})}
        placeholder={ph} style={iSt}/>
      </div>
     ))}
     <div>
      <Label t="Levure principale"/>
      <input value={editForm.levure||''} onChange={e=>setEditForm({...editForm,levure:e.target.value})}
       placeholder="Nottingham…" style={iSt}/>
     </div>
     <div style={{gridColumn:'1/-1'}}>
      <Label t="Houblons aromatiques (virgule)"/>
      <input value={(editForm.houblons||[]).join(', ')}
       onChange={e=>setEditForm({...editForm,
        houblons:e.target.value.split(',').map(h=>h.trim()).filter(Boolean)})}
       placeholder="Cascade, Mosaic" style={iSt}/>
     </div>
    </div>
   </Section>

   <Section label="⚗ Brassage">

    <div style={{marginBottom:10}}>
     <Label t="Correction de l'eau"/>
     <input value={editForm.correctionEau||''}
      onChange={e=>setEditForm({...editForm,correctionEau:e.target.value})}
      placeholder="Ex: 250ml Acide, 50g Sulfate Ca, 30g Chlorure Ca" style={iSt}/>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
     {[['Empâtage (L)','eauMash'],['Rinçage (L)','eauSparge'],['pH mash','pHMash']].map(([l,f])=>(
      <div key={f}>
       <Label t={l}/>
       <input type="number" step={f==='pHMash'?'0.1':'1'}
        value={editForm[f]||''}
        onChange={e=>setEditForm({...editForm,[f]:e.target.value})}
        placeholder={f==='pHMash'?'5.3':f==='eauMash'?'400':'600'} style={iSt}/>
      </div>
     ))}
    </div>

    <div style={{marginBottom:10}}>
     <div style={{display:'flex',justifyContent:'space-between',
      alignItems:'center',marginBottom:8}}>
      <Label t="Paliers d'empâtage"/>
      <div style={{display:'flex',gap:6}}>
       <button onClick={()=>{
         const tmp = {style:editForm.style||'',levure:editForm.levure||'',
          volume:editForm.volume||300,ingredients:editForm.ingredients||[],
          correctionEau:editForm.correctionEau||''};
         const filled = autoFillFromRecette(tmp, editForm.volume||300);
         setEditForm(ef=>({...ef, paliersMash:filled.paliersMash||[]}));
        }}
        style={{fontSize:10,color:C.textMid,background:C.bgDark,
         border:`1px solid ${C.border}`,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>
        ↺ Auto
       </button>
       <button onClick={()=>setEditForm(ef=>({...ef,
         paliersMash:[...(ef.paliersMash||[]),
          {nom:'Nouveau palier',tempCible:'',duree:'',note:'',tempReelle:'',dureeSaisie:''}]}))}
        style={{fontSize:10,color:C.amber,background:C.amberPale,
         border:`1px solid ${C.amber}40`,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>
        + Palier
       </button>
      </div>
     </div>
     <div style={{display:'grid',gridTemplateColumns:'1fr 70px 70px 70px 24px',
      gap:4,marginBottom:4}}>
      {['Nom du palier','Cible °C','Durée min','Note',''].map((h,i)=>(
       <div key={`k${i}`} style={{fontSize:8,color:C.textLight,fontFamily:FM,
        textTransform:'uppercase',letterSpacing:0.5}}>{h}</div>
      ))}
     </div>
     {(editForm.paliersMash||[]).map((p,i)=>(
      <div key={`k${i}`} style={{display:'grid',
       gridTemplateColumns:'1fr 70px 70px 70px 24px',
       gap:4,marginBottom:5,alignItems:'center'}}>
       <input value={p.nom||''}
        onChange={e=>{const pals=[...(editForm.paliersMash||[])];pals[i]={...pals[i],nom:e.target.value};setEditForm({...editForm,paliersMash:pals});}}
        placeholder="Palier maltose…" style={{...iSt,padding:'6px 8px',fontSize:11}}/>
       <input type="number" value={p.tempCible||''}
        onChange={e=>{const pals=[...(editForm.paliersMash||[])];pals[i]={...pals[i],tempCible:parseFloat(e.target.value)||''};setEditForm({...editForm,paliersMash:pals});}}
        placeholder="67" style={{...iSt,padding:'6px 5px',fontSize:12,textAlign:'center'}}/>
       <input type="number" value={p.duree||''}
        onChange={e=>{const pals=[...(editForm.paliersMash||[])];pals[i]={...pals[i],duree:e.target.value};setEditForm({...editForm,paliersMash:pals});}}
        placeholder="30" style={{...iSt,padding:'6px 5px',fontSize:12,textAlign:'center'}}/>
       <input value={p.note||''}
        onChange={e=>{const pals=[...(editForm.paliersMash||[])];pals[i]={...pals[i],note:e.target.value};setEditForm({...editForm,paliersMash:pals});}}
        placeholder="Beta-amylase…" style={{...iSt,padding:'6px 5px',fontSize:10}}/>
       <button onClick={()=>setEditForm(ef=>({...ef,
         paliersMash:(ef.paliersMash||[]).filter((_,j)=>j!==i)}))}
        style={{width:24,height:32,borderRadius:5,border:`1px solid ${C.border}`,
         background:'transparent',color:C.alert,fontSize:13,cursor:'pointer',
         display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
      </div>
     ))}
     {(editForm.paliersMash||[]).length===0&&(
      <div style={{fontSize:11,color:C.textLight,fontStyle:'italic',padding:'6px 0'}}>
       Aucun palier — cliquez "Auto" pour générer selon le style
      </div>
     )}
    </div>
   </Section>

   <Section label="🌿 Houblons & Épices (détaillé)">
    <div style={{display:'flex',justifyContent:'space-between',
     alignItems:'center',marginBottom:8}}>
     <div style={{fontSize:11,color:C.textLight,fontStyle:'italic'}}>
      Avec timing précis pour la fiche de brassage
     </div>
     <div style={{display:'flex',gap:6}}>
      <button onClick={()=>{
        const tmp={style:editForm.style||'',levure:editForm.levure||'',
         volume:editForm.volume||300,ingredients:editForm.ingredients||[]};
        const filled=autoFillFromRecette(tmp,editForm.volume||300);
        setEditForm(ef=>({...ef,houblonsDetail:filled.houblonsDetail||[]}));
       }}
       style={{fontSize:10,color:C.textMid,background:C.bgDark,
        border:`1px solid ${C.border}`,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>
       ↺ Depuis ingrédients
      </button>
      <button onClick={()=>setEditForm(ef=>({...ef,
        houblonsDetail:[...(ef.houblonsDetail||[]),
         {nom:'',qte:'',unite:'g',etape:'',alpha:'',lot:''}]}))}
       style={{fontSize:10,color:C.hop,background:C.hopPale,
        border:`1px solid ${C.hop}40`,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>
       + Ajouter
      </button>
     </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 56px 40px 1fr 40px 24px',
     gap:4,marginBottom:4}}>
     {['Type','Qté','U','Étape / Timing','α%',''].map((h,i)=>(
      <div key={`k${i}`} style={{fontSize:8,color:C.textLight,fontFamily:FM,
       textTransform:'uppercase',letterSpacing:0.5}}>{h}</div>
     ))}
    </div>
    {(editForm.houblonsDetail||[]).map((hop,i)=>(
     <div key={`k${i}`} style={{display:'grid',
      gridTemplateColumns:'1fr 56px 40px 1fr 40px 24px',
      gap:4,marginBottom:5,alignItems:'center'}}>
      <input value={hop.nom||''}
       onChange={e=>{const h=[...(editForm.houblonsDetail||[])];h[i]={...h[i],nom:e.target.value};setEditForm({...editForm,houblonsDetail:h});}}
       placeholder="Cascade…" style={{...iSt,padding:'6px 7px',fontSize:11}}
       list={`eh-list-${i}`}/>
      <datalist id={`eh-list-${i}`}>
       {['Cascade','Amarillo','Chinook','Mosaic','Nugget','Simcoe','Elixir','Mistral',
        'Citra','Centennial','Azacca','Sabro','Idaho7','Nectaron','Nelson Sauvin',
        'Amèrisant','Coriandre','Poivre'].map(h=><option key={h} value={h}/>)}
      </datalist>
      <input type="number" value={hop.qte||''}
       onChange={e=>{const h=[...(editForm.houblonsDetail||[])];h[i]={...h[i],qte:e.target.value};setEditForm({...editForm,houblonsDetail:h});}}
       placeholder="500" style={{...iSt,padding:'6px 4px',fontSize:12,textAlign:'right'}}/>
      <select value={hop.unite||'g'}
       onChange={e=>{const h=[...(editForm.houblonsDetail||[])];h[i]={...h[i],unite:e.target.value};setEditForm({...editForm,houblonsDetail:h});}}
       style={{...iSt,padding:'6px 3px',fontSize:11}}>
       <option value="g">g</option>
       <option value="kg">kg</option>
      </select>
      <input value={hop.etape||''}
       onChange={e=>{const h=[...(editForm.houblonsDetail||[])];h[i]={...h[i],etape:e.target.value};setEditForm({...editForm,houblonsDetail:h});}}
       placeholder="60min / aroma 80°C / DH J+2…"
       style={{...iSt,padding:'6px 7px',fontSize:11}}/>
      <input type="number" step="0.1" value={hop.alpha||''}
       onChange={e=>{const h=[...(editForm.houblonsDetail||[])];h[i]={...h[i],alpha:e.target.value};setEditForm({...editForm,houblonsDetail:h});}}
       placeholder="%" style={{...iSt,padding:'6px 4px',fontSize:11,textAlign:'center'}}/>
      <button onClick={()=>setEditForm(ef=>({...ef,
        houblonsDetail:(ef.houblonsDetail||[]).filter((_,j)=>j!==i)}))}
       style={{width:24,height:32,borderRadius:5,border:`1px solid ${C.border}`,
        background:'transparent',color:C.alert,fontSize:13,cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
     </div>
    ))}
    {(editForm.houblonsDetail||[]).length===0&&(
     <div style={{fontSize:11,color:C.textLight,fontStyle:'italic',padding:'6px 0'}}>
      Cliquez "Depuis ingrédients" pour importer automatiquement
     </div>
    )}
   </Section>

   <Section label="⚗ Fermentation">
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
     <div>
      <Label t="Température fermentation (°C)"/>
      <input type="number" value={editForm.tempFerm||''}
       onChange={e=>setEditForm({...editForm,tempFerm:e.target.value})}
       placeholder="18" style={iSt}/>
      {editForm.levure&&<div style={{fontSize:9,color:C.textLight,marginTop:2,
       fontFamily:FM}}>Levure : {editForm.levure}</div>}
     </div>
     <div>
      <Label t="Durée fermentation (jours)"/>
      <input type="number" value={editForm.dureeFerm||''}
       onChange={e=>setEditForm({...editForm,dureeFerm:e.target.value})}
       placeholder="10" style={iSt}/>
     </div>
     <div>
      <Label t="Temp. cold crash (°C)"/>
      <input type="number" value={editForm.tempColdCrash||''}
       onChange={e=>setEditForm({...editForm,tempColdCrash:e.target.value})}
       placeholder="3" style={iSt}/>
     </div>
     <div>
      <Label t="Durée cold crash (jours)"/>
      <input type="number" value={editForm.dureeColdCrash||''}
       onChange={e=>setEditForm({...editForm,dureeColdCrash:e.target.value})}
       placeholder="7" style={iSt}/>
     </div>
    </div>
   </Section>

   <Section label="🍾 Resucrage (g/L)">
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
     {[['Bouteilles','bt','5.5'],['Ecofass','ecofass','3.8'],['Fûts Inox','inox','3.5']].map(([l,k,def])=>(
      <div key={k}>
       <Label t={l}/>
       <input type="number" step="0.1" value={editForm.resucrage?.[k]?.taux||def}
        onChange={e=>{
         const res={...editForm.resucrage||{}};
         res[k]={...res[k]||{},taux:e.target.value};
         setEditForm({...editForm,resucrage:res});
        }}
        style={iSt}/>
      </div>
     ))}
    </div>
   </Section>

   <Section label="Ingrédients — liste complète">
    <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
     <button onClick={addIng}
      style={{background:C.amberPale,border:`1px solid ${C.amber}40`,
       borderRadius:6,padding:'4px 10px',fontSize:11,fontWeight:700,
       color:C.amber,cursor:'pointer'}}>+ Ajouter</button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 80px 56px 24px',
     gap:4,marginBottom:4}}>
     {['Ingrédient','Qté','U',''].map((h,i)=>(
      <div key={`k${i}`} style={{fontSize:8,color:C.textLight,
       fontFamily:FM,textTransform:'uppercase',
       letterSpacing:0.5}}>{h}</div>
     ))}
    </div>
    {editForm.ingredients.map((ing,i)=>{
     const s=findStock(stock,ing.nom);
     return(
      <div key={`k${i}`}>
       <div style={{display:'grid',gridTemplateColumns:'1fr 80px 56px 24px',
        gap:4,marginBottom:4,alignItems:'center'}}>
        <input value={ing.nom||''}
         onChange={e=>updIng(i,'nom',e.target.value)}
         placeholder="Pale, Cascade…"
         style={{...iSt,padding:'7px 9px',fontSize:12,
          borderColor:s?C.border:ing.nom?C.warn:C.border}}
         list={`ing-list-${i}`}/>
        <datalist id={`ing-list-${i}`}>
         {stock.map(x=><option key={x.id} value={x.nom}/>)}
        </datalist>
        <input type="number" step="0.01" value={ing.qte||''}
         onChange={e=>updIng(i,'qte',parseFloat(e.target.value)||'')}
         placeholder="0"
         style={{...iSt,padding:'7px 8px',fontSize:12,textAlign:'right'}}/>
        <select value={ing.u||'kg'}
         onChange={e=>updIng(i,'u',e.target.value)}
         style={{...iSt,padding:'7px 4px',fontSize:11}}>
         <option>kg</option>
         <option>sach</option>
         <option>g</option>
         <option>L</option>
        </select>
        <button onClick={()=>delIng(i)}
         style={{width:24,height:32,borderRadius:5,border:`1px solid ${C.border}`,
          background:'transparent',color:C.alert,fontSize:13,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
       </div>
       {s&&<div style={{gridColumn:'1/3',fontSize:9,
        color:s.qte>=(ing.qte||0)?C.ok:C.alert,
        fontFamily:FM,marginBottom:3,paddingLeft:4}}>
        Stock: {s.qte} {s.u} {s.qte>=(ing.qte||0)?'✓':'⚠ insuffisant'}
       </div>}
      </div>
     );
    })}
   </Section>

   <Section label="💰 Prix de vente">
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
     {[['33cl','b33'],['75cl','b75'],['Fût 20L','f20'],['Fût 30L','f30']].map(([label,k])=>(
      <div key={k}>
       <Label t={label}/>
       <input type="number" step="0.1" min="0"
        value={editForm.prix?.[k]||''}
        onChange={e=>setEditForm({...editForm,
         prix:{...editForm.prix||{},[k]:parseFloat(e.target.value)||''}})}
        placeholder="0" style={iSt}/>
       {editForm.prix?.[k]>0&&(
        <div style={{fontSize:9,color:C.textLight,marginTop:2,
         fontFamily:FM}}>
         Marge: {marge(parseFloat(editForm.prix[k]),coutRevient({...editForm,volume:parseInt(editForm.volume)||0,ingredients:editForm.ingredients||[]},k))}%
        </div>
       )}
      </div>
     ))}
    </div>
   </Section>

   <div style={{display:'flex',gap:10,marginTop:20}}>
    <Btn onClick={()=>{setEditMode(false);setEditForm(null);setSel(null);}}>Annuler</Btn>
    <Btn p onClick={saveRecette}>✓ Enregistrer la recette</Btn>
   </div>
  </div>
 );

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{display:'flex',justifyContent:'space-between',
    alignItems:'flex-start',marginBottom:14}}>
    <h2 style={{fontFamily:FA,
     fontSize:'clamp(20px,5vw,26px)',color:C.text}}>Recettes</h2>
    <button onClick={()=>{
     setEditForm({nom:'',style:'',abv:'',ibu:'',srm:'',og:'',fg:'',
      volume:300,permanent:false,description:'',houblons:[],levure:'',
      ingredients:[],prix:{b33:'',b75:'',f20:'',f30:''},
      paliersMash:[],houblonsDetail:[],
      correctionEau:'',eauMash:'',eauSparge:'',pHMash:'',tempFerm:'',
      resucrage:{bt:{taux:'5.5'},ecofass:{taux:'3.8'},inox:{taux:'3.5'}}});
     setEditMode('recette');
    }}
     style={{background:C.amber,color:C.bgDark,border:'none',borderRadius:10,
      padding:'9px 14px',fontWeight:700,fontSize:13,minHeight:40,cursor:'pointer'}}>
     + Recette
    </button>
   </div>

   <SearchBar value={q} onChange={setQ} placeholder="Nom, style, description…"/>
   <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,
    marginTop:6,marginBottom:14,scrollbarWidth:'none'}}>
    {['Toutes','Permanentes','Éphémères'].map(x=>(
     <button key={x} onClick={()=>setF(x)}
      style={{flexShrink:0,padding:'7px 14px',borderRadius:20,
       border:`1.5px solid ${f===x?C.amber:C.border}`,
       background:f===x?C.amberPale:C.bgCard,
       color:f===x?C.amber:C.textMid,fontWeight:600,fontSize:12,minHeight:36}}>
      {x}
     </button>
    ))}
   </div>

   <div style={{display:'flex',flexDirection:'column',gap:10}}>
    {filtered.map(r=>{
     const cL = coutParL(r);
     const px = r.prix||{};
     return(
      <div key={r.id}
       style={{background:C.bgCard,border:`1.5px solid ${C.border}`,
        borderRadius:14,padding:'14px 16px',
        borderLeft:`4px solid ${r.permanent?C.amber:C.hop}`}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'flex-start',marginBottom:8}}>
        <div style={{flex:1,minWidth:0,cursor:'pointer'}}
         onClick={()=>setSel(r)}>
         <div style={{fontFamily:FA,fontSize:18,
          color:C.text}}>{r.nom}</div>
         <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>
          <Tag text={r.style} color={r.permanent?C.amber:C.hop}
           bg={r.permanent?C.amberPale:C.hopPale}/>
          {cL>0&&<Tag text={`${cL.toFixed(2)}€/L`}
           color={C.textMid} bg={C.bgDark}/>}
         </div>
        </div>
        <div style={{display:'flex',gap:5,flexShrink:0,marginLeft:8}}>
         <button onClick={()=>dupliquer(r)}
          title="Dupliquer"
          style={{width:32,height:32,borderRadius:7,
           border:`1px solid ${C.border}`,background:C.bgDark,
           fontSize:14,cursor:'pointer',color:C.textMid,
           display:'flex',alignItems:'center',justifyContent:'center'}}>
          ⎘
         </button>
         <button onClick={()=>openEdit(r)}
          title="Modifier"
          style={{width:32,height:32,borderRadius:7,
           border:`1px solid ${C.amber}60`,background:C.amberPale,
           fontSize:14,cursor:'pointer',color:C.amber,
           display:'flex',alignItems:'center',justifyContent:'center'}}>
          ✏
         </button>
        </div>
       </div>

       <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
        gap:8,marginBottom:10,cursor:'pointer'}}
        onClick={()=>setSel(r)}>
        {[['ABV',`${r.abv}%`],['IBU',r.ibu],['DI',r.og]].map(([l,v])=>(
         <div key={l} style={{textAlign:'center',background:C.bgDark,
          borderRadius:8,padding:'6px 4px'}}>
          <div style={{fontFamily:FM,fontWeight:700,
           fontSize:15,color:C.text}}>{v}</div>
          <div style={{fontSize:10,color:C.textLight,
           textTransform:'uppercase',letterSpacing:1}}>{l}</div>
         </div>
        ))}
       </div>

       {(px.b33||px.f20)&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,cursor:'pointer'}}
         onClick={()=>setSel(r)}>
         {[['33cl',px.b33,coutRevient(r,'b33')],
          ['75cl',px.b75,coutRevient(r,'b75')],
          ['Fût 20L',px.f20,coutRevient(r,'f20')],
          ['Fût 30L',px.f30,coutRevient(r,'f30')],
         ].map(([l,p,co])=>p>0?(
          <div key={l} style={{background:C.bgDark,borderRadius:6,
           padding:'5px 4px',textAlign:'center',border:`1px solid ${C.border}`}}>
           <div style={{fontFamily:FM,fontWeight:700,
            fontSize:13,color:C.amber}}>{p}€</div>
           <div style={{fontSize:9,color:C.textLight,marginTop:1}}>{l}</div>
           {marge(p,co)!=null&&<div style={{fontSize:8,marginTop:1,
            color:marge(p,co)>=60?C.ok:marge(p,co)>=40?C.warn:C.alert,
            fontFamily:FM,fontWeight:700}}>
            {marge(p,co)}%
           </div>}
          </div>
         ):null)}
        </div>
       )}
       {!px.b33&&!px.f20&&(
        <button onClick={()=>{setSel(r);setEditMode('prix');
         setPxForm({b33:'',b75:'',f20:'',f30:'',});}}
         style={{fontSize:11,color:C.amber,background:'none',border:'none',
          cursor:'pointer',textDecoration:'underline',padding:0,marginTop:4}}>
         + Définir les prix
        </button>
       )}
      </div>
     );
    })}
   </div>

   {sel&&editMode!=='recette'&&(()=>{
    const r   = recettes.find(x=>x.id===sel.id)||sel;
    const cL  = coutParL(r);
    const cm  = coutMatieres(r);
    const px  = r.prix||{};
    const ings= chk(r);
    return(
     <Modal onClose={()=>{setSel(null);setEditMode(false);}}>
      <div style={{display:'flex',justifyContent:'space-between',
       alignItems:'flex-start',marginBottom:14}}>
       <div>
        <h2 style={{fontFamily:FA,fontSize:22,color:C.text}}>
         {r.nom}
        </h2>
        <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>
         <Tag text={r.style} color={r.permanent?C.amber:C.hop}
          bg={r.permanent?C.amberPale:C.hopPale}/>
         <Tag text={r.permanent?'Permanente':'Éphémère'}
          color={C.textMid} bg={C.bgDark}/>
        </div>
       </div>
       <div style={{display:'flex',gap:6,flexShrink:0}}>
        <button onClick={()=>dupliquer(r)}
         title="Dupliquer"
         style={{display:'flex',alignItems:'center',gap:4,
          background:C.bgCard,border:`1px solid ${C.border}`,
          borderRadius:20,padding:'5px 10px',fontSize:11,
          fontWeight:700,color:C.textMid,cursor:'pointer'}}>
         ⎘ Dupliquer
        </button>
        <button onClick={()=>openEdit(r)}
         style={{display:'flex',alignItems:'center',gap:4,
          background:C.amberPale,border:`1px solid ${C.amber}60`,
          borderRadius:20,padding:'5px 10px',fontSize:11,
          fontWeight:700,color:C.amber,cursor:'pointer'}}>
         ✏ Modifier
        </button>
        <button onClick={()=>{setSel(null);setEditMode(false);}}
         style={{background:'none',border:`1px solid ${C.border}`,
          borderRadius:20,padding:'5px 12px',fontSize:12,
          fontWeight:700,color:C.textMid,cursor:'pointer'}}>
         ‹ Retour
        </button>
       </div>
      </div>

      <p style={{color:C.textMid,fontSize:13,marginBottom:16,lineHeight:1.6}}>
       {r.description}
      </p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',
       gap:8,marginBottom:16}}>
       {[['ABV',`${r.abv}%`],['IBU',r.ibu],['SRM',r.srm],['DI',r.og],['DF',r.fg]].map(([l,v])=>(
        <div key={l} style={{textAlign:'center',background:C.bgDark,
         borderRadius:10,padding:'10px 4px',
         borderBottom:`2px solid ${C.amber}40`}}>
         <div style={{fontFamily:FM,fontWeight:700,
          fontSize:15,color:C.amber}}>{v}</div>
         <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',
          letterSpacing:1,marginTop:2}}>{l}</div>
        </div>
       ))}
      </div>

      <div style={{background:C.bgDark,borderRadius:12,padding:'12px 14px',
       marginBottom:14,border:`1px solid ${C.border}`}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'center',marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:C.textMid,
         textTransform:'uppercase',letterSpacing:0.8}}>
         Coût matières — {r.volume}L
        </div>
        <div style={{fontFamily:FA,fontSize:18,color:C.alert}}>
         {cm.toFixed(2)}€
        </div>
       </div>
       {ings.map((ing,i)=>{
        const cout_ing=(ing.qte||0)*(ing.px||0);
        const pct=cm>0?Math.round(cout_ing/cm*100):0;
        return(
         <div key={`k${i}`} style={{marginBottom:5}}>
          <div style={{display:'flex',justifyContent:'space-between',
           alignItems:'center',marginBottom:2}}>
           <span style={{fontWeight:600,color:C.text,fontSize:12}}>{ing.nom}</span>
           <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontFamily:FM,
             color:C.textMid,fontSize:11}}>{ing.qte} {ing.u}</span>
            {ing.px&&<span style={{fontFamily:FM,
             color:C.alert,fontSize:11,fontWeight:700}}>
             {cout_ing.toFixed(2)}€
            </span>}
            <span style={{fontSize:11,color:ing.ok?C.ok:C.alert}}>
             {ing.ok?'✓':'⚠'}
            </span>
           </div>
          </div>
          {pct>0&&<div style={{height:3,background:C.border,borderRadius:2,overflow:'hidden'}}>
           <div style={{height:'100%',background:C.alert,
            width:`${pct}%`,borderRadius:2}}/>
          </div>}
         </div>
        );
       })}
       <div style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${C.border}`,
        display:'flex',justifyContent:'space-between',fontSize:12}}>
        <span style={{color:C.textMid}}>Coût / litre</span>
        <span style={{fontFamily:FM,fontWeight:700,
         color:C.alert}}>{cL.toFixed(3)}€/L</span>
       </div>
      </div>

      <div style={{marginBottom:14}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'center',marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:C.textMid,
         textTransform:'uppercase',letterSpacing:0.8}}>
         Prix & marges
        </div>
        <button onClick={()=>openEdit(r)}
         style={{background:C.amberPale,border:`1px solid ${C.amber}40`,
          borderRadius:8,padding:'4px 10px',fontSize:11,
          color:C.amber,fontWeight:600,cursor:'pointer'}}>
         ✏ Modifier les prix
        </button>
       </div>
       <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
        <PxCell label="33cl"    prix={px.b33||0} cout={coutRevient(r,'b33')}/>
        <PxCell label="75cl"    prix={px.b75||0} cout={coutRevient(r,'b75')}/>
        <PxCell label="Fût 20L" prix={px.f20||0} cout={cL*20}/>
        <PxCell label="Fût 30L" prix={px.f30||0} cout={cL*30}/>
       </div>
      </div>

      {!r.permanent&&(
       <button onClick={()=>supprimer(r)}
        style={{width:'100%',padding:'9px',borderRadius:8,
         border:`1px solid ${C.alert}40`,background:'transparent',
         color:C.alert,fontSize:12,fontWeight:600,cursor:'pointer',marginTop:8}}>
        🗑 Supprimer cette recette
       </button>
      )}
     </Modal>
    );
   })()}
  </div>
 );
}

function autoFillFromRecette(rec, volumeL){
 if(!rec) return {};
 const vol = parseFloat(volumeL) || rec.volume || 300;

 const HOUBLONS_NOMS = ['Cascade','Amarillo','Chinook','Mosaic','Nugget','Simcoe',
  'Elixir','Mistral','Citra','Centennial','Azacca','Sabro','Idaho7','Nectaron',
  'Nelson Sauvin','Motueka','Super delic','Barbe rouge','Ekuanot','Amèrisant',
  'Best coast hazy','Coriandre','Poivre','Écorce','Ecorce','Sucre','Phily',
  'Kveik','Windsor','Nottingham','NEIPA','BRY','Verdant','CBC1','Ananas',
  'Kiwi','Framboise','Passion','Miel','sour','Nova','K-97','S-04','WB','BE256'];
 const isMalt = ing => !HOUBLONS_NOMS.some(h=>ing.nom.toLowerCase().includes(h.toLowerCase()))
  && ing.u==='kg';
 const grainsKg = (rec.ingredients||[]).filter(isMalt).reduce((s,i)=>s+(i.qte||0),0);
 const ratio    = rec.volume>0 ? vol/rec.volume : 1;
 const grainsAdj= grainsKg * ratio;

 const eauMash   = Math.round(grainsAdj * 3.2);
 const pertesEbu = Math.round(vol * 0.10 + 8);
 const absorption= Math.round(grainsAdj * 0.8);
 const eauSparge = Math.max(0, vol + pertesEbu + absorption - eauMash);
 const avantEbu  = Math.round(eauMash + eauSparge - absorption);

 const PALIERS_STD = [
  {nom:'Palier protéinique', tempCible:50,  duree:0,  note:'Optionnel — skip si pale ale'},
  {nom:'Palier maltose',     tempCible:63,  duree:30, note:'Beta-amylase'},
  {nom:'Maltose/Dextrines',  tempCible:68,  duree:30, note:'Alpha+Beta'},
  {nom:'Palier dextrines',   tempCible:72,  duree:10, note:'Alpha-amylase'},
  {nom:'Inactivation',       tempCible:78,  duree:5,  note:'Mash out'},
 ];
 const styleL = (rec.style||'').toLowerCase();
 let paliers;
 if(styleL.includes('blanche')||styleL.includes('wit')){
  paliers = [
   {nom:'Palier protéinique',tempCible:50,  duree:15,note:'Blanche — obligatoire',tempReelle:'',dureeSaisie:''},
   {nom:'Palier maltose',    tempCible:63,  duree:25,note:'Beta-amylase',          tempReelle:'',dureeSaisie:''},
   {nom:'Maltose/Dextrines', tempCible:68,  duree:20,note:'Corps',                 tempReelle:'',dureeSaisie:''},
   {nom:'Inactivation',      tempCible:78,  duree:5, note:'Mash out',              tempReelle:'',dureeSaisie:''},
  ];
 } else if(styleL.includes('sour')||styleL.includes('gose')){
  paliers = [
   {nom:'Acidification',     tempCible:45,  duree:20,note:'Acide — optionnel',     tempReelle:'',dureeSaisie:''},
   {nom:'Palier maltose',    tempCible:63,  duree:30,note:'Beta-amylase — sec',     tempReelle:'',dureeSaisie:''},
   {nom:'Inactivation',      tempCible:78,  duree:5, note:'Mash out',              tempReelle:'',dureeSaisie:''},
  ];
 } else if(styleL.includes('triple')||styleL.includes('saison')){
  paliers = [
   {nom:'Palier maltose',    tempCible:63,  duree:40,note:'Très sec — longue beta', tempReelle:'',dureeSaisie:''},
   {nom:'Maltose/Dextrines', tempCible:65,  duree:20,note:'',                       tempReelle:'',dureeSaisie:''},
   {nom:'Inactivation',      tempCible:78,  duree:5, note:'Mash out',               tempReelle:'',dureeSaisie:''},
  ];
 } else if(styleL.includes('stout')||styleL.includes('porter')||styleL.includes('brune')){
  paliers = [
   {nom:'Palier maltose',    tempCible:65,  duree:30,note:'',                       tempReelle:'',dureeSaisie:''},
   {nom:'Maltose/Dextrines', tempCible:68,  duree:30,note:'Corps — malts foncés',   tempReelle:'',dureeSaisie:''},
   {nom:'Inactivation',      tempCible:78,  duree:5, note:'Mash out',               tempReelle:'',dureeSaisie:''},
  ];
 } else if(styleL.includes('neipa')||styleL.includes('dipa')||styleL.includes('hazy')){
  paliers = [
   {nom:'Palier maltose',    tempCible:65,  duree:25,note:'Sec mais pas trop',      tempReelle:'',dureeSaisie:''},
   {nom:'Maltose/Dextrines', tempCible:67,  duree:25,note:'Corps NEIPA',            tempReelle:'',dureeSaisie:''},
   {nom:'Inactivation',      tempCible:78,  duree:5, note:'Mash out',               tempReelle:'',dureeSaisie:''},
  ];
 } else {
  const temp = styleL.includes('ipa')||styleL.includes('pale')?66
        :styleL.includes('ambrée')||styleL.includes('amber')?68:67;
  paliers = [
   {nom:'Palier principal',  tempCible:temp,duree:60,note:'Mono palier',            tempReelle:'',dureeSaisie:''},
   {nom:'Inactivation',      tempCible:78,  duree:5, note:'Mash out',               tempReelle:'',dureeSaisie:''},
  ];
 }

 const houblonsDetail = (rec.ingredients||[])
  .filter(i=>HOUBLONS_NOMS.some(h=>(i.nom||'').toLowerCase().includes(h.toLowerCase()))
   && !['sach','L'].includes(i.u) && i.nom!=='Sucre')
  .map(i=>{
   const qteAdj = Math.round((i.qte||0)*ratio*1000)/1000;
   const uniteOut = qteAdj<1 ? 'g' : 'kg';
   const qteOut   = uniteOut==='g' ? Math.round(qteAdj*1000) : qteAdj;
   return {
    nom:   i.nom,
    qte:   qteOut,
    unite: uniteOut,
    etape: i.note||'',
    alpha: '',
    lot:   '',
    tempReelle: '',
   };
  });

 const levureDetail = (rec.ingredients||[])
  .filter(i=>['sach','kg'].includes(i.u)&&
   HOUBLONS_NOMS.slice(HOUBLONS_NOMS.indexOf('Phily')).some(h=>
    i.nom.toLowerCase().includes(h.toLowerCase())))
  .map(i=>({nom:i.nom, qte:(i.qte||0)*ratio, lot:''}));

 const TEMP_FERM = {'Nottingham':18,'Windsor':20,'NEIPA':20,'WB-06':22,'WB06':22,
  'BE256':20,'S-04':18,'S04':18,'Kveik':35,'Belle Saison':24,'Phily sour':25,
  'CBC1':20,'K-97':12,'K97':12,'Nova Lager':12,'BRY 97':20,'Verdant':20,
  'Best coast hazy':20};
 const tempFerm = Object.entries(TEMP_FERM)
  .find(([k])=>rec.levure?.toLowerCase().includes(k.toLowerCase()))?.[1]||18;
 const isColdFerm = ['Nova Lager','K-97','K97'].some(k=>
  rec.levure?.toLowerCase().includes(k.toLowerCase()));

 return {
  og:          rec.og||'',
  fg:          rec.fg||'',
  abv:         rec.abv||'',
  volume:      vol,
  eauMash, eauSparge, avantEbu,
  pHMash:      (rec.style||'').toLowerCase().includes('sour')||
        (rec.style||'').toLowerCase().includes('blanche')?'5.2':'5.3',
  pHFinal:     '',
  paliersMash: paliers,
  houblonsDetail,
  rendement:   '72',
  correctionEau: rec.correctionEau||'',
  densAvantEbu: '',
  tempFerm:    String(tempFerm),
  pressurisation: isColdFerm?'0.8':'0',
  dureeMash:   '60',
  tempMash:    paliers[0]?.tempCible||67,
  notes: `Recette ref: ${rec.nom} — ${rec.volume}L, DI ${rec.og||'?'}, DF ${rec.fg||'?'}`,
  datePrimaire:'', fermenteurPrimaire:'',
  dateSoftCrash:'', tempSoftCrash:'',
  dateColdCrash:'', tempColdCrash: isColdFerm?'2':'3',
  dureeColdCrash:'',
  dateConditionnement:'',
  resucrage:{
   bt: {volume:'', taux:(rec.style||'').includes('sour')?'6.5':'5.5', sucre:''},
   ecofass: {volume:'', taux:'3.8', sucre:''},
   inox:    {volume:'', taux:'3.5', sucre:''},
  },
  _recRef: rec,
 };
}

function MesureFormPlus({onAdd,label='Ajouter un relevé',placeholder='Observation…',
 hideVal=false,showType=false,types=['densité','pH','visuel','goût','brassage']}){
 const [val, setVal]   = useState('');
 const [temp,setTemp]  = useState('');
 const [note,setNote]  = useState('');
 const [type,setType]  = useState(types[0]);
 return (
  <div style={{background:C.amberPale,borderRadius:10,padding:12,
   border:`1px solid ${C.amber}25`,marginTop:6}}>
   <div style={{fontSize:9,fontWeight:700,color:C.amber,textTransform:'uppercase',
    letterSpacing:1.5,fontFamily:FM,marginBottom:10}}>
    + {label}
   </div>
   {showType&&(
    <div style={{marginBottom:8}}>
     <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
      {types.map(t=>(
       <button key={t} onClick={()=>setType(t)}
        style={{padding:'3px 9px',borderRadius:10,fontSize:10,fontWeight:700,
         border:`1px solid ${type===t?C.amber:C.border}`,
         background:type===t?C.amber:'transparent',
         color:type===t?C.bgDark:C.textMid}}>
        {t}
       </button>
      ))}
     </div>
    </div>
   )}
   <div style={{display:'grid',
    gridTemplateColumns:hideVal?'1fr':'1fr 1fr',gap:8,marginBottom:8}}>
    {!hideVal&&<div>
     <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
      letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>
      {type==='pH'?'pH':'Densité'}
     </div>
     <input type="number" step="0.001" value={val}
      onChange={e=>setVal(e.target.value)}
      placeholder={type==='pH'?'4.3':'1.025'}
      style={{...iSt,background:C.bgCard}}/>
    </div>}
    <div>
     <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
      letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>Temp °C</div>
     <input type="number" value={temp}
      onChange={e=>setTemp(e.target.value)} placeholder="18"
      style={{...iSt,background:C.bgCard}}/>
    </div>
   </div>
   <div style={{marginBottom:8}}>
    <input value={note} onChange={e=>setNote(e.target.value)}
     placeholder={placeholder}
     style={{...iSt,background:C.bgCard}}/>
   </div>
   <Btn p onClick={()=>{
    if(!val&&!note) return;
    onAdd(val,temp,note,type);
    setVal('');setTemp('');setNote('');
   }}>Enregistrer</Btn>
  </div>
 );
}
function MesureForm({onAdd}){
 return <MesureFormPlus onAdd={(v,t,n)=>onAdd(v,t,n,'densité')}/>;
}

function CourbeDensite({mesures,og,fg}){
 if(!mesures||mesures.length<2) return null;
 const pts = mesures.filter(m=>m.valeur);
 if(pts.length<1) return null;
 const W=280, H=80, PAD=8;
 const minV = Math.min(...pts.map(p=>p.valeur), fg||1.0);
 const maxV = Math.max(...pts.map(p=>p.valeur), og||1.0);
 const range = maxV-minV || 0.01;
 const x = (i) => PAD + (i/(pts.length-1||1))*(W-PAD*2);
 const y = (v) => H-PAD - ((v-minV)/range)*(H-PAD*2);
 const path = pts.map((p,i)=>`${i===0?'M':'L'}${x(i).toFixed(1)},${y(p.valeur).toFixed(1)}`).join(' ');
 const fgY  = fg ? y(fg) : null;
 const attPct = og&&pts[pts.length-1]?.valeur
  ? Math.round((og-pts[pts.length-1].valeur)/(og-1)*100)
  : null;
 return (
  <div style={{background:C.bgDark,borderRadius:8,padding:'8px 10px',
   border:`1px solid ${C.border}`,overflow:'hidden'}}>
   <div style={{display:'flex',justifyContent:'space-between',
    fontSize:9,color:C.textLight,fontFamily:FM,
    textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>
    <span>Courbe densité</span>
    {attPct!=null&&<span style={{color:attPct>80?C.ok:attPct>50?C.warn:C.textLight}}>
     Att. {attPct}%
    </span>}
   </div>
   <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
    {[0.25,0.5,0.75].map(t=>(
     <line key={t} x1={PAD} y1={PAD+(H-PAD*2)*t} x2={W-PAD} y2={PAD+(H-PAD*2)*t}
      stroke={C.border} strokeWidth="0.5"/>
    ))}
    {fgY!=null&&<line x1={PAD} y1={fgY} x2={W-PAD} y2={fgY}
     stroke={C.green} strokeWidth="1" strokeDasharray="4 3" opacity="0.7"/>}
    <path d={`${path} L${x(pts.length-1).toFixed(1)},${H-PAD} L${PAD},${H-PAD} Z`}
     fill={C.amber} fillOpacity="0.08"/>
    <path d={path} fill="none" stroke={C.amber} strokeWidth="1.5"
     strokeLinejoin="round" strokeLinecap="round"/>
    {pts.map((p,i)=>(
     <circle key={`k${i}`} cx={x(i)} cy={y(p.valeur)} r="2.5"
      fill={C.amber} stroke={C.bgDark} strokeWidth="1"/>
    ))}
    <text x={PAD-2} y={y(maxV)+3} fontSize="7" fill={C.textLight}
     textAnchor="end" fontFamily="monospace">{maxV.toFixed(3)}</text>
    <text x={PAD-2} y={y(minV)+3} fontSize="7" fill={C.textLight}
     textAnchor="end" fontFamily="monospace">{minV.toFixed(3)}</text>
    {fgY!=null&&<text x={W-PAD+2} y={fgY+3} fontSize="7" fill={C.green}
     fontFamily="monospace">DF</text>}
   </svg>
   <div style={{display:'flex',justifyContent:'space-between',
    fontSize:8,color:C.textLight,fontFamily:FM,marginTop:2}}>
    <span>{pts[0].date}</span>
    {pts.length>2&&<span>{pts[Math.floor(pts.length/2)].date}</span>}
    <span>{pts[pts.length-1].date}</span>
   </div>
  </div>
 );
}

function ModuleProduction({brassins,setBrassins,recettes}){
 const [filter,setFilter]   = useState('actifs');
 const [sel,setSel]         = useState(null);
 const [selTab,setSelTab]   = useState('suivi');   // onglets fiche : suivi|brassage|fermentation|notes
 const [showF,setShowF]     = useState(false);
 const [q,setQ]             = useState('');

 const EF = {
  recette:'', volume:'', statut:'planifié', dateDebut:'', fermenteur:'',
  og:'', fg:'', notes:'',
  eauMash:'', eauSparge:'', tempMash:'', dureeMash:'', rendement:'',
  pHMash:'', pHFinal:'',
  tempFerm:'', pressurisation:'',
 };
 const [form,setForm] = useState(EF);

 const actifs   = brassins.filter(b=>b.statut!=='terminé'&&
  (b.recette+' '+(b.fermenteur||'')+(b.notes||'')).toLowerCase().includes(q.toLowerCase()));
 const termines = brassins.filter(b=>b.statut==='terminé'&&b.volume>0&&
  (b.recette+' '+(b.fermenteur||'')+(b.notes||'')).toLowerCase().includes(q.toLowerCase()))
  .sort((a,b)=>b.id-a.id);
 const displayed = filter==='actifs' ? actifs : termines;
 const totalVol  = termines.reduce((s,b)=>s+(b.volume||0),0);

 const updB  = (b,patch) => setBrassins(brassins.map(x=>x.id===b.id?{...x,...patch}:x));
 const updSt = (b,ns)    => updB(b,{statut:ns});

 const addMes = (b,val,temp,note,type) => updB(b,{
  mesures:[...(b.mesures||[]),{
   date:new Date().toISOString().split('T')[0],
   valeur:parseFloat(val)||null,
   temp:parseFloat(temp)||null,
   note, type:type||'densité',
  }]
 });

 const calcABV = b => {
  if(!b.og||!b.fg) return null;
  return Math.round(((b.og - b.fg) * 131.25) * 10) / 10;
 };
 const calcAtt = b => {
  if(!b.og||!b.mesures?.length) return null;
  const last = b.mesures.filter(m=>m.valeur).slice(-1)[0];
  if(!last) return null;
  return Math.round((b.og - last.valeur) / (b.og - 1) * 100);
 };
 const recetteOf = b => recettes.find(r=>r.nom===b.recette);
 const joursDepuis = b => Math.floor((Date.now()-new Date(b.dateDebut+'T00:00'))/86400000);
 const expectedFG  = b => recetteOf(b)?.fg || null;

 const FicheBrassin = ({b}) => {
  const rec   = recetteOf(b);
  const att   = calcAtt(b);
  const abvCalc = calcABV(b);
  const jours = joursDepuis(b);
  const expFG = expectedFG(b);
  const lastMes = b.mesures?.filter(m=>m.valeur).slice(-1)[0];
  const densites = b.mesures?.filter(m=>m.type==='densité'||!m.type);
  const isFerme  = ['fermentation','garde','conditionnement'].includes(b.statut);
  const pHFin    = b.pHFinal || b.mesures?.find(m=>m.type==='pH')?.valeur;

  const fermStatus = () => {
   if(!att) return null;
   if(att>=85) return {col:C.ok,    txt:'✓ Fermentation terminée', bg:C.greenPale};
   if(att>=60) return {col:C.amber, txt:'⚗ En cours',              bg:C.amberPale};
   return       {col:C.warn,  txt:'⏳ Démarrage',                  bg:C.amberPale};
  };
  const fs = fermStatus();

  const TABS_FICHE = [
   {id:'suivi',       label:'📊 Suivi'},
   {id:'brassage',    label:'🔥 Brassage'},
   {id:'fermentation',label:'⚗ Ferm.'},
   {id:'notes',       label:'📝 Notes'},
  ];

  return (
   <Modal onClose={()=>{setSel(null);setSelTab('suivi');}} wide>
    <div style={{margin:'-20px -20px 0',padding:'14px 16px',
     background:C.bgDark,borderBottom:`1px solid ${C.border}`}}>
     <div style={{display:'flex',justifyContent:'space-between',
      alignItems:'flex-start',marginBottom:8}}>
      <div style={{flex:1,minWidth:0}}>
       <div style={{fontFamily:FA,fontSize:20,
        color:C.amber,marginBottom:4}}>{b.recette}</div>
       <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
        <Badge statut={b.statut}/>
        <span style={{fontFamily:FM,fontSize:10,
         color:C.textLight}}>{b.fermenteur}</span>
        <span style={{fontFamily:FM,fontSize:10,
         color:C.textLight}}>{fmtDate(b.dateDebut)} · J+{jours}</span>
       </div>
      </div>
      <button onClick={()=>{setSel(null);setSelTab('suivi');}}
       style={{background:'none',border:`1px solid ${C.border}`,
        borderRadius:20,padding:'5px 12px',fontSize:12,
        fontWeight:700,color:C.textMid,flexShrink:0}}>
       ‹ Retour
      </button>
     </div>
     <div style={{display:'flex',gap:0,overflowX:'auto',scrollbarWidth:'none',marginTop:4}}>
      {TABS_FICHE.map(t=>(
       <button key={t.id} onClick={()=>setSelTab(t.id)}
        style={{flexShrink:0,padding:'6px 12px',background:'none',border:'none',
         cursor:'pointer',fontSize:11,fontWeight:700,
         fontFamily:FM,letterSpacing:0.5,
         textTransform:'uppercase',whiteSpace:'nowrap',
         color:selTab===t.id?C.amber:C.textLight,
         borderBottom:selTab===t.id?`2px solid ${C.amber}`:'2px solid transparent'}}>
        {t.label}
       </button>
      ))}
     </div>
    </div>

    <div style={{paddingTop:16}}>

    {selTab==='suivi'&&(
     <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
       gap:8,marginBottom:14}}>
       {[
        ['DI',     b.og?b.og.toFixed(3):'—',       C.amber],
        ['DF actuelle', lastMes?lastMes.valeur.toFixed(3):'—', C.green],
        ['DF cible', expFG?expFG.toFixed(3):'—',   C.textMid],
        ['ABV',    abvCalc?`${abvCalc}%`:(b.abv?`${b.abv}%`:'—'), C.hop],
       ].map(([l,v,col])=>(
        <div key={l} style={{background:C.bgDark,borderRadius:8,
         padding:'10px 6px',textAlign:'center',
         borderBottom:`2px solid ${col}50`}}>
         <div style={{fontFamily:FM,fontWeight:700,
          fontSize:14,color:col,lineHeight:1}}>{v}</div>
         <div style={{fontSize:8,color:C.textLight,marginTop:3,
          textTransform:'uppercase',letterSpacing:0.8}}>{l}</div>
        </div>
       ))}
      </div>

      {fs&&<div style={{padding:'8px 12px',borderRadius:8,
       background:fs.bg,border:`1px solid ${fs.col}30`,
       marginBottom:12,display:'flex',justifyContent:'space-between',
       alignItems:'center'}}>
       <span style={{fontSize:12,fontWeight:700,color:fs.col}}>{fs.txt}</span>
       <span style={{fontFamily:FM,fontSize:12,
        fontWeight:700,color:fs.col}}>Att. {att}%</span>
      </div>}

      {densites?.length>=2&&(
       <div style={{marginBottom:12}}>
        <CourbeDensite mesures={densites} og={b.og} fg={expFG}/>
       </div>
      )}

      <div style={{marginBottom:14}}>
       <div style={{fontSize:9,fontFamily:FM,fontWeight:700,
        letterSpacing:1.5,color:C.textLight,textTransform:'uppercase',marginBottom:8}}>
        Statut
       </div>
       <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
        {Object.entries(STATUTS).map(([k,s])=>(
         <button key={k} onClick={()=>updSt(b,k)}
          style={{padding:'5px 10px',borderRadius:16,
           border:`1.5px solid ${b.statut===k?s.color:C.border}`,
           background:b.statut===k?s.bg:C.bgCard,
           color:b.statut===k?s.color:C.textLight,
           fontWeight:b.statut===k?700:400,fontSize:11,minHeight:32}}>
          {s.dot} {s.label}
         </button>
        ))}
       </div>
      </div>

      {b.mesures?.length>0&&(
       <div style={{marginBottom:12}}>
        <div style={{fontSize:9,fontFamily:FM,fontWeight:700,
         letterSpacing:1.5,color:C.textLight,textTransform:'uppercase',marginBottom:6}}>
         Historique des relevés
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
         {[...b.mesures].reverse().map((m,i)=>{
          const icons = {'densité':'⬟','pH':'🧪','temp':'🌡','visuel':'👁','goût':'👅'};
          const ic = icons[m.type||'densité']||'•';
          return(
           <div key={`k${i}`} style={{display:'flex',gap:8,padding:'7px 10px',
            borderRadius:7,background:C.bgDark,fontSize:11,
            border:`1px solid ${C.border}`,alignItems:'center'}}>
            <span style={{fontSize:12,flexShrink:0}}>{ic}</span>
            <span style={{fontFamily:FM,color:C.textLight,
             fontSize:10,flexShrink:0,minWidth:72}}>{m.date}</span>
            {m.valeur!=null&&<span style={{fontFamily:FM,
             fontWeight:700,color:C.amber,flexShrink:0}}>
             {m.valeur.toFixed(m.type==='pH'?2:3)}
            </span>}
            {m.temp!=null&&<span style={{color:C.textLight,fontSize:10,flexShrink:0}}>
             {m.temp}°C
            </span>}
            <span style={{color:C.textMid,flex:1,overflow:'hidden',
             textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.note}</span>
           </div>
          );
         })}
        </div>
       </div>
      )}

      {b.statut!=='terminé'&&(
       <MesureFormPlus onAdd={(val,temp,note,type)=>addMes(b,val,temp,note,type)}/>
      )}
     </div>
    )}

    {selTab==='brassage'&&(
     <div>

      <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
       marginBottom:12,border:`1px solid ${C.border}`}}>
       <div style={{fontSize:9,color:C.amber,fontFamily:FM,
        fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>
        Correction de l'eau
       </div>
       <input value={b.correctionEau||rec?.correctionEau||''}
        onChange={e=>updB(b,{correctionEau:e.target.value})}
        placeholder="Ex: 250ml Acide, 50g Sulfate Ca, 30g Chlorure Ca"
        style={iSt}/>
      </div>

      <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
       marginBottom:12,border:`1px solid ${C.border}`}}>
       <div style={{fontSize:9,color:C.amber,fontFamily:FM,
        fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>
        Volumes (L)
       </div>
       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {[
         ['Empâtage',         'eauMash',    rec?.eauMash||''],
         ['Rinçage',          'eauSparge',  rec?.eauSparge||''],
         ['Avant ébu (100°C)','avantEbu',   rec?.avantEbu||''],
        ].map(([label,field,hint])=>(
         <div key={field}>
          <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
           letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>{label}</div>
          <input type="number" value={b[field]||''}
           onChange={e=>updB(b,{[field]:e.target.value})}
           placeholder={String(hint||'')} style={{...iSt,padding:'7px 9px',fontSize:13}}/>
         </div>
        ))}
       </div>
       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:8}}>
        <div>
         <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
          letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>
          pH empâtage
         </div>
         <input type="number" step="0.1" value={b.pHMash||''}
          onChange={e=>updB(b,{pHMash:e.target.value})}
          placeholder={rec?.pHMash||'5.3'} style={{...iSt,padding:'7px 9px',fontSize:13}}/>
        </div>
        <div>
         <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
          letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>
          Densité avant ébu
         </div>
         <input type="number" step="0.001" value={b.densAvantEbu||''}
          onChange={e=>updB(b,{densAvantEbu:e.target.value})}
          placeholder="Ex: 1.060" style={{...iSt,padding:'7px 9px',fontSize:13}}/>
        </div>
       </div>
      </div>

      <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
       marginBottom:12,border:`1px solid ${C.border}`}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'center',marginBottom:10}}>
        <div style={{fontSize:9,color:C.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase'}}>
         Paliers d'empâtage
        </div>
        <button onClick={()=>{
         const pal = [...(b.paliersMash||rec?.paliersMash||[]),
          {nom:'Nouveau palier',tempCible:'',duree:'',tempReelle:'',dureeSaisie:''}];
         updB(b,{paliersMash:pal});
        }}
         style={{fontSize:10,color:C.amber,background:C.amberPale,
          border:`1px solid ${C.amber}40`,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>
         + Palier
        </button>
       </div>

       <div style={{display:'grid',
        gridTemplateColumns:'1fr 70px 70px 70px 70px',
        gap:4,marginBottom:6}}>
        {['Palier','Cible°C','Réel°C','Durée',''].map((h,i)=>(
         <div key={`k${i}`} style={{fontSize:8,color:C.textLight,
          fontFamily:FM,textTransform:'uppercase',
          letterSpacing:0.8}}>{h}</div>
        ))}
       </div>

       {(b.paliersMash||rec?.paliersMash||[]).map((pal,i)=>(
        <div key={`k${i}`} style={{display:'grid',
         gridTemplateColumns:'1fr 70px 70px 70px 26px',
         gap:4,marginBottom:5,alignItems:'center'}}>
         <input value={pal.nom||''}
          onChange={e=>{
           const pals=[...(b.paliersMash||rec?.paliersMash||[])];
           pals[i]={...pals[i],nom:e.target.value};
           updB(b,{paliersMash:pals});
          }}
          style={{...iSt,padding:'6px 8px',fontSize:11}}/>
         <div style={{background:C.bgCard,border:`1px solid ${C.border}`,
          borderRadius:8,padding:'6px',textAlign:'center',
          fontFamily:FM,fontSize:12,color:C.textMid}}>
          {pal.tempCible}°
         </div>
         <input type="number" value={pal.tempReelle||''}
          onChange={e=>{
           const pals=[...(b.paliersMash||rec?.paliersMash||[])];
           pals[i]={...pals[i],tempReelle:e.target.value};
           updB(b,{paliersMash:pals});
          }}
          placeholder="Réel" style={{...iSt,padding:'6px 5px',fontSize:12,textAlign:'center'}}/>
         <input type="number" value={pal.dureeSaisie||pal.duree||''}
          onChange={e=>{
           const pals=[...(b.paliersMash||rec?.paliersMash||[])];
           pals[i]={...pals[i],dureeSaisie:e.target.value};
           updB(b,{paliersMash:pals});
          }}
          placeholder={String(pal.duree||'')}
          style={{...iSt,padding:'6px 5px',fontSize:12,textAlign:'center'}}/>
         <button onClick={()=>{
          const pals=(b.paliersMash||rec?.paliersMash||[]).filter((_,j)=>j!==i);
          updB(b,{paliersMash:pals});
         }}
          style={{width:24,height:32,borderRadius:5,border:`1px solid ${C.border}`,
           background:'transparent',color:C.alert,fontSize:13,cursor:'pointer',
           display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
       ))}

       {(b.paliersMash||rec?.paliersMash||[]).map((pal,i)=>pal.note?(
        <div key={i+'n'} style={{fontSize:9,color:C.textLight,
         fontFamily:FM,marginBottom:3,
         paddingLeft:4}}>
         ↳ {pal.nom}: {pal.note}
        </div>
       ):null)}
      </div>

      <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
       marginBottom:12,border:`1px solid ${C.border}`}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'center',marginBottom:10}}>
        <div style={{fontSize:9,color:C.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase'}}>
         Houblons & Épices
        </div>
        <button onClick={()=>{
         const hops=[...(b.houblonsDetail||rec?.houblonsDetail||[]),
          {nom:'',qte:'',unite:'g',etape:'',alpha:'',lot:'',tempReelle:''}];
         updB(b,{houblonsDetail:hops});
        }}
         style={{fontSize:10,color:C.hop,background:C.hopPale,
          border:`1px solid ${C.hop}40`,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>
         + Ajouter
        </button>
       </div>

       <div style={{display:'grid',
        gridTemplateColumns:'1fr 60px 44px 1fr 36px 26px',
        gap:4,marginBottom:6}}>
        {['Type','Qté','U°','Étape / Timing','α%',''].map((h,i)=>(
         <div key={`k${i}`} style={{fontSize:8,color:C.textLight,
          fontFamily:FM,textTransform:'uppercase',
          letterSpacing:0.5}}>{h}</div>
        ))}
       </div>

       {(b.houblonsDetail||rec?.houblonsDetail||[]).map((hop,i)=>(
        <div key={`k${i}`} style={{display:'grid',
         gridTemplateColumns:'1fr 60px 44px 1fr 36px 26px',
         gap:4,marginBottom:5,alignItems:'center'}}>
         <input value={hop.nom||''}
          onChange={e=>{
           const h=[...(b.houblonsDetail||rec?.houblonsDetail||[])];
           h[i]={...h[i],nom:e.target.value};
           updB(b,{houblonsDetail:h});
          }}
          placeholder="Cascade…" style={{...iSt,padding:'6px 7px',fontSize:11}}
          list={`hop-list-${i}`}/>
         <datalist id={`hop-list-${i}`}>
          {['Cascade','Amarillo','Chinook','Mosaic','Nugget','Simcoe','Elixir',
           'Mistral','Citra','Centennial','Azacca','Sabro','Idaho7','Nectaron',
           'Nelson Sauvin','Motueka','Super delic','Barbe rouge','Ekuanot',
           'Amèrisant','Coriandre','Poivre'].map(h=>(
           <option key={h} value={h}/>
          ))}
         </datalist>
         <input type="number" value={hop.qte||''}
          onChange={e=>{
           const h=[...(b.houblonsDetail||rec?.houblonsDetail||[])];
           h[i]={...h[i],qte:e.target.value};
           updB(b,{houblonsDetail:h});
          }}
          placeholder="500" style={{...iSt,padding:'6px 5px',fontSize:12,textAlign:'right'}}/>
         <select value={hop.unite||'g'}
          onChange={e=>{
           const h=[...(b.houblonsDetail||rec?.houblonsDetail||[])];
           h[i]={...h[i],unite:e.target.value};
           updB(b,{houblonsDetail:h});
          }}
          style={{...iSt,padding:'6px 4px',fontSize:11}}>
          <option value="g">g</option>
          <option value="kg">kg</option>
         </select>
         <input value={hop.etape||''}
          onChange={e=>{
           const h=[...(b.houblonsDetail||rec?.houblonsDetail||[])];
           h[i]={...h[i],etape:e.target.value};
           updB(b,{houblonsDetail:h});
          }}
          placeholder="60min / aroma / DH J+2…"
          style={{...iSt,padding:'6px 7px',fontSize:11}}/>
         <input type="number" value={hop.alpha||''}
          onChange={e=>{
           const h=[...(b.houblonsDetail||rec?.houblonsDetail||[])];
           h[i]={...h[i],alpha:e.target.value};
           updB(b,{houblonsDetail:h});
          }}
          placeholder="%" style={{...iSt,padding:'6px 4px',fontSize:11,textAlign:'center'}}/>
         <button onClick={()=>{
          const h=(b.houblonsDetail||rec?.houblonsDetail||[]).filter((_,j)=>j!==i);
          updB(b,{houblonsDetail:h});
         }}
          style={{width:24,height:32,borderRadius:5,border:`1px solid ${C.border}`,
           background:'transparent',color:C.alert,fontSize:13,cursor:'pointer',
           display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
       ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12}}>
       {[
        ['Rendement (%)',   'rendement',  '72'],
        ['DI mesurée',      'og',         '1.050'],
        ['pH final moût',   'pHFinal',    '4.3'],
       ].map(([label,field,ph])=>(
        <div key={field}>
         <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
          letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>{label}</div>
         <input type="number" step={field==='og'?'0.001':field==='pHFinal'?'0.1':'1'}
          value={b[field]||''}
          onChange={e=>updB(b,{[field]:e.target.value})}
          placeholder={ph} style={iSt}/>
         {field==='og'&&rec?.og&&<div style={{fontSize:9,color:C.textLight,marginTop:2,
          fontFamily:FM}}>Cible: {rec.og.toFixed(3)}</div>}
        </div>
       ))}
      </div>

      <div>
       <div style={{fontSize:9,fontFamily:FM,fontWeight:700,
        letterSpacing:1.5,color:C.textLight,textTransform:'uppercase',marginBottom:6}}>
        Journal de brassage
       </div>
       {b.mesures?.filter(m=>m.type==='brassage').map((m,i)=>(
        <div key={`k${i}`} style={{padding:'7px 10px',borderRadius:7,
         background:C.bgDark,fontSize:11,border:`1px solid ${C.border}`,
         marginBottom:4,color:C.textMid,display:'flex',gap:8}}>
         🔥
         <span style={{color:C.textLight,fontSize:10,flexShrink:0}}>{m.date}</span>
         <span>{m.note}</span>
         {m.temp&&<span style={{color:C.textLight,fontSize:10}}>{m.temp}°C</span>}
        </div>
       ))}
       <MesureFormPlus onAdd={(v,t,n)=>addMes(b,v,t,n,'brassage')}
        placeholder="Observation de brassage…" hideVal
        label="Ajouter une note brassage"/>
      </div>
     </div>
    )}

    {selTab==='fermentation'&&(
     <div>

      <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
       marginBottom:12,border:`1px solid ${C.border}`}}>
       <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
        <div style={{flex:1,minWidth:0}}>
         <div style={{fontSize:9,color:C.amber,fontFamily:FM,
          fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6}}>
          Levure
         </div>
         <div style={{display:'grid',gridTemplateColumns:'1fr 100px',gap:8}}>
          <div>
           <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
            letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>Type</div>
           <input value={b.levureType||rec?.levure||''}
            onChange={e=>updB(b,{levureType:e.target.value})}
            placeholder={rec?.levure||'Nottingham'}
            style={{...iSt,padding:'7px 9px',fontSize:12}}/>
          </div>
          <div>
           <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
            letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>N° lot</div>
           <input value={b.levureLot||''}
            onChange={e=>updB(b,{levureLot:e.target.value})}
            placeholder="LOT…"
            style={{...iSt,padding:'7px 9px',fontSize:12}}/>
          </div>
         </div>
        </div>
       </div>
       <div>
        <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
         letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>pH fermentation</div>
        <input type="number" step="0.1" value={b.pHFerm||''}
         onChange={e=>updB(b,{pHFerm:e.target.value})}
         placeholder="Cible 4.0–4.5"
         style={{...iSt,padding:'7px 9px',fontSize:13,width:'50%'}}/>
       </div>
      </div>

      {[
       {key:'primaire',  label:'Primaire',   icon:'🟢',
       fields:[['Date',       'datePrimaire',      'date'],
           ['Température','tempFerm',          'number'],
           ['Fermenteur', 'fermenteurPrimaire','text']]},
       {key:'soft',     label:'Soft Crash',  icon:'🔵',
       fields:[['Date',       'dateSoftCrash',  'date'],
           ['Température','tempSoftCrash',  'number']]},
       {key:'cold',     label:'Cold Crash',  icon:'❄️',
       fields:[['Date',       'dateColdCrash',  'date'],
           ['Température','tempColdCrash',  'number'],
           ['Durée (j)',   'dureeColdCrash', 'number']]},
      ].map(stage=>(
       <div key={stage.key} style={{background:C.bgDark,borderRadius:10,
        padding:'12px 14px',marginBottom:10,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:9,color:C.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>
         {stage.icon} {stage.label}
        </div>
        <div style={{display:'grid',
         gridTemplateColumns:`repeat(${stage.fields.length},1fr)`,gap:8}}>
         {stage.fields.map(([label,field,type])=>(
          <div key={field}>
           <div style={{fontSize:9,color:C.textLight,
            fontFamily:FM,letterSpacing:0.5,
            textTransform:'uppercase',marginBottom:4}}>{label}</div>
           <input type={type} value={b[field]||''}
            onChange={e=>updB(b,{[field]:e.target.value})}
            placeholder={field.includes('Temp')?'18':
             field.includes('dur')||field.includes('Dur')?'7':''}
            style={{...iSt,padding:'7px 9px',fontSize:12}}/>
          </div>
         ))}
        </div>
       </div>
      ))}

      <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
       marginBottom:12,border:`1px solid ${C.border}`}}>
       <div style={{fontSize:9,color:C.amber,fontFamily:FM,
        fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>
        🍾 Conditionnement & Resucrage
       </div>
       <div style={{marginBottom:10}}>
        <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
         letterSpacing:0.5,textTransform:'uppercase',marginBottom:4}}>Date</div>
        <input type="date" value={b.dateConditionnement||b.dateCond||''}
         onChange={e=>updB(b,{dateConditionnement:e.target.value,dateCond:e.target.value})}
         style={{...iSt,padding:'7px 9px',fontSize:13,width:'50%'}}/>
       </div>

       <div style={{display:'grid',
        gridTemplateColumns:'80px 1fr 80px 80px',
        gap:4,marginBottom:6}}>
        {['Support','Volume (L)','Taux g/L','Sucre (g)'].map((h,i)=>(
         <div key={`k${i}`} style={{fontSize:8,color:C.textLight,
          fontFamily:FM,textTransform:'uppercase',
          letterSpacing:0.5}}>{h}</div>
        ))}
       </div>

       {[
        {key:'inox',   label:'Fûts Inox', defaultTaux:3.5, icon:'🛢'},
        {key:'ecofass',label:'Ecofass',    defaultTaux:3.8, icon:'🛢'},
        {key:'bt',     label:'Bouteilles', defaultTaux:5.5, icon:'🍺'},
       ].map(row=>{
        const res = b.resucrage?.[row.key]||{};
        const taux  = parseFloat(res.taux||row.defaultTaux)||0;
        const vol   = parseFloat(res.volume)||0;
        const sucreCalc = vol>0&&taux>0 ? Math.round(vol*taux) : '';
        return(
         <div key={row.key} style={{display:'grid',
          gridTemplateColumns:'80px 1fr 80px 80px',
          gap:4,marginBottom:5,alignItems:'center'}}>
          <div style={{fontSize:11,color:C.textMid,
           fontFamily:FM,display:'flex',gap:4,alignItems:'center'}}>
           <span>{row.icon}</span>{row.label}
          </div>
          <input type="number" value={res.volume||''}
           onChange={e=>{
            const r={...b.resucrage||{}};
            r[row.key]={...r[row.key]||{},volume:e.target.value,
             taux:res.taux||String(row.defaultTaux)};
            updB(b,{resucrage:r});
           }}
           placeholder="0" style={{...iSt,padding:'6px 8px',fontSize:12}}/>
          <input type="number" step="0.1" value={res.taux||row.defaultTaux}
           onChange={e=>{
            const r={...b.resucrage||{}};
            r[row.key]={...r[row.key]||{},taux:e.target.value};
            updB(b,{resucrage:r});
           }}
           style={{...iSt,padding:'6px 6px',fontSize:12,textAlign:'center'}}/>
          <div style={{background:sucreCalc?C.amberPale:C.bgCard,
           border:`1px solid ${sucreCalc?C.amber:C.border}`,
           borderRadius:8,padding:'7px 6px',textAlign:'center',
           fontFamily:FM,fontWeight:700,fontSize:12,
           color:sucreCalc?C.amber:C.textLight}}>
           {sucreCalc||'—'}
          </div>
         </div>
        );
       })}
      </div>

      {(b.mesures?.filter(m=>!m.type||m.type==='densité').length||0)>=2&&(
       <div style={{marginBottom:12}}>
        <div style={{fontSize:9,fontFamily:FM,fontWeight:700,
         letterSpacing:1.5,color:C.textLight,textTransform:'uppercase',marginBottom:6}}>
         Courbe de fermentation
        </div>
        <CourbeDensite
         mesures={b.mesures.filter(m=>!m.type||m.type==='densité')}
         og={b.og} fg={b.fg||expFG}/>
       </div>
      )}

      <MesureFormPlus onAdd={(v,t,n,tp)=>addMes(b,v,t,n,tp)}
       label="Ajouter un relevé fermentation"
       showType types={['densité','pH','visuel','goût','temp']}/>
     </div>
    )}

    {selTab==='notes'&&(
     <div>
      <div style={{marginBottom:14}}>
       <Label t="Notes générales"/>
       <textarea
        value={b.notes||''}
        onChange={e=>updB(b,{notes:e.target.value})}
        placeholder="Observations, pH, incidents, caractéristiques organoleptiques…"
        style={{...iSt,height:120,resize:'vertical',lineHeight:1.6}}/>
      </div>
      {rec&&(
       <div style={{background:C.bgDark,borderRadius:10,padding:'12px 14px',
        border:`1px solid ${C.border}`,marginBottom:14}}>
        <div style={{fontSize:9,fontFamily:FM,fontWeight:700,
         letterSpacing:1.5,color:C.textLight,textTransform:'uppercase',marginBottom:8}}>
         Recette de référence
        </div>
        {[
         ['Style',         rec.style],
         ['ABV cible',     `${rec.abv}%`],
         ['IBU',           rec.ibu],
         ['DI cible',      rec.og?.toFixed(3)],
         ['DF cible',      rec.fg?.toFixed(3)],
         ['Volume brassé', `${rec.volume} L`],
         ['Levure',        rec.levure],
        ].filter(([,v])=>v).map(([l,v])=>(
         <div key={l} style={{display:'flex',justifyContent:'space-between',
          padding:'5px 0',borderBottom:`1px solid ${C.border}`,
          fontSize:12,color:C.textMid}}>
          <span>{l}</span>
          <span style={{fontFamily:FM,
           fontWeight:600,color:C.cream}}>{v}</span>
         </div>
        ))}
       </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
       <div>
        <Label t="Volume final (L)"/>
        <input type="number" value={b.volume||''}
         onChange={e=>updB(b,{volume:parseInt(e.target.value)||0})}
         style={iSt}/>
       </div>
       <div>
        <Label t="Date conditionnement"/>
        <input type="date" value={b.dateCond||''}
         onChange={e=>updB(b,{dateCond:e.target.value})}
         style={iSt}/>
       </div>
      </div>
     </div>
    )}

    </div>
   </Modal>
  );
 };

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{marginBottom:14}}>
    <h2 style={{fontFamily:FA,
     fontSize:'clamp(20px,5vw,26px)',color:C.text}}>Production</h2>
    <p style={{color:C.textLight,fontSize:12,
     fontFamily:FM,marginTop:2}}>
     Braumeister 575L · 5 fermenteurs
    </p>
   </div>

   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
    <StatCard label="Terminés"   value={termines.length}                  icon="🍺" color={C.amber}/>
    <StatCard label="Volume"     value={`${(totalVol/1000).toFixed(2)} hL`} icon="🪣" color={C.green}/>
    <StatCard label="En cours"   value={actifs.length}                    icon="⚗️" color={C.hop}/>
    <StatCard label="Vol. moyen" value={termines.length?`${Math.round(totalVol/termines.length)}L`:'—'} icon="📊" color={C.brick}/>
   </div>

   <SearchBar value={q} onChange={setQ} placeholder="Recette, fermenteur…"/>

   <div style={{display:'flex',justifyContent:'space-between',
    alignItems:'center',marginBottom:12}}>
    <div style={{display:'flex',gap:6}}>
     {[['actifs',`Actifs (${actifs.length})`],['terminés',`Terminés (${termines.length})`]].map(([k,l])=>(
      <button key={k} onClick={()=>setFilter(k)}
       style={{padding:'7px 12px',borderRadius:20,fontWeight:600,fontSize:12,
        border:`1.5px solid ${filter===k?C.amber:C.border}`,
        background:filter===k?C.amberPale:C.bgCard,
        color:filter===k?C.amber:C.textMid,minHeight:36}}>
       {l}
      </button>
     ))}
    </div>
    <button onClick={()=>setShowF(true)}
     style={{background:C.amber,color:C.bgDark,border:'none',borderRadius:10,
      padding:'10px 14px',fontWeight:700,fontSize:13,minHeight:44}}>
     + Brassin
    </button>
   </div>

   <div style={{display:'flex',flexDirection:'column',gap:8}}>
    {displayed.map(b=>{
     const att   = calcAtt(b);
     const last  = b.mesures?.filter(m=>m.valeur&&(!m.type||m.type==='densité')).slice(-1)[0];
     const jours = joursDepuis(b);
     const expFG = expectedFG(b);
     const fermPct = b.og&&last ? Math.min(100,Math.round((b.og-last.valeur)/(b.og-(expFG||1.010))*100)) : 0;
     const inFerm  = ['fermentation','garde'].includes(b.statut);

     return(
      <div key={b.id} onClick={()=>{setSel(b);setSelTab('suivi');}}
       style={{background:C.bgCard,border:`1.5px solid ${C.border}`,
        borderRadius:12,padding:'13px 14px',cursor:'pointer',
        borderLeft:`3px solid ${STATUTS[b.statut]?.color||C.border}`}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'flex-start',marginBottom:6}}>
        <div style={{flex:1,minWidth:0}}>
         <div style={{fontFamily:FA,fontSize:16,
          color:C.text,overflow:'hidden',textOverflow:'ellipsis',
          whiteSpace:'nowrap'}}>{b.recette}</div>
         <div style={{fontSize:11,color:C.textLight,
          fontFamily:FM,marginTop:2}}>
          {b.fermenteur} · {fmtDate(b.dateDebut)}
          {b.statut!=='terminé'&&<span style={{color:C.amber}}> · J+{jours}</span>}
         </div>
        </div>
        <span style={{fontSize:18,color:C.textLight,flexShrink:0,marginLeft:8}}>›</span>
       </div>

       <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:inFerm?8:0,
        alignItems:'center'}}>
        <Badge statut={b.statut}/>
        {b.og&&<span style={{fontFamily:FM,fontSize:10,
         color:C.textLight,background:C.bgDark,padding:'1px 6px',
         borderRadius:4,border:`1px solid ${C.border}`}}>
         DI {b.og.toFixed(3)}
        </span>}
        {last&&b.statut!=='terminé'&&<span style={{fontFamily:FM,
         fontSize:10,color:C.green,background:C.greenPale,padding:'1px 6px',
         borderRadius:4,border:`1px solid ${C.green}30`}}>
         ↓ {last.valeur.toFixed(3)}
        </span>}
        {att!=null&&<span style={{fontFamily:FM,fontSize:10,
         color:att>=80?C.ok:att>=50?C.warn:C.textLight,
         background:C.bgDark,padding:'1px 6px',borderRadius:4,
         border:`1px solid ${C.border}`}}>
         Att. {att}%
        </span>}
        {b.volume>0&&<span style={{fontFamily:FM,
         fontSize:10,color:C.amber}}>
         {b.volume}L
        </span>}
        {(b.abv||(b.og&&b.fg))&&<span style={{fontFamily:FM,
         fontSize:10,color:C.hop}}>
         {b.abv||calcABV(b)}% ABV
        </span>}
       </div>

       {inFerm&&b.og&&last&&(
        <div>
         <div style={{display:'flex',justifyContent:'space-between',
          fontSize:8,color:C.textLight,fontFamily:FM,marginBottom:2}}>
          <span>Fermentation</span>
          <span style={{color:fermPct>=80?C.ok:C.amber}}>{fermPct}%</span>
         </div>
         <div style={{height:3,background:C.bgDark,borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:2,
           background:fermPct>=80?C.ok:C.amber,
           width:`${fermPct}%`,transition:'width 0.5s'}}/>
         </div>
        </div>
       )}
      </div>
     );
    })}
    {displayed.length===0&&(
     <div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}>
      <div style={{fontSize:36,marginBottom:8}}>⚗️</div>
      <div style={{fontWeight:600}}>
       {filter==='actifs'?'Aucun brassin en cours':'Aucun brassin terminé'}
      </div>
     </div>
    )}
   </div>

   {sel&&<FicheBrassin b={brassins.find(x=>x.id===sel.id)||sel}/>}

   {showF&&(
    <Modal onClose={()=>{setShowF(false);setForm(EF);}}>
     <h3 style={{fontFamily:FA,fontSize:20,
      color:C.text,marginBottom:14}}>Nouveau brassin</h3>
     {form.recette&&(()=>{
      const rec=recettes.find(r=>r.nom===form.recette);
      if(!rec) return null;
      return(
       <div style={{background:C.amberPale,borderRadius:8,padding:'8px 12px',
        marginBottom:12,border:`1px solid ${C.amber}40`,
        display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:16}}>⚗️</span>
        <div style={{flex:1,minWidth:0}}>
         <div style={{fontSize:11,fontWeight:700,color:C.amber}}>
          Pré-rempli depuis {rec.nom}
         </div>
         <div style={{fontSize:10,color:C.textMid,
          fontFamily:FM,marginTop:1}}>
          DI {rec.og?.toFixed(3)||'?'} · DF {rec.fg?.toFixed(3)||'?'} · {rec.abv}% · {rec.levure}
         </div>
        </div>
       </div>
      );
     })()}
     <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div>
       <Label t="Recette"/>
       <select value={form.recette}
        onChange={e=>{
         const rec = recettes.find(r=>r.nom===e.target.value);
         setForm(prev=>({
          ...prev,
          recette:e.target.value,
          ...(rec ? autoFillFromRecette(rec, prev.volume||rec.volume) : {})
         }));
        }} style={iSt}>
        <option value="">— Choisir —</option>
        {recettes.map(r=><option key={r.id} value={r.nom}>{r.nom}</option>)}
       </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
       <div><Label t="Statut"/>
        <select value={form.statut}
         onChange={e=>setForm({...form,statut:e.target.value})} style={iSt}>
         {Object.entries(STATUTS).map(([k,s])=>
          <option key={k} value={k}>{s.label}</option>)}
        </select>
       </div>
       <div><Label t="Fermenteur"/>
        <input value={form.fermenteur}
         onChange={e=>setForm({...form,fermenteur:e.target.value})}
         placeholder="FV-01" style={iSt}/>
       </div>
       <div><Label t="Volume final (L)"/>
        <input type="number" value={form.volume}
         onChange={e=>{
          const vol = e.target.value;
          const rec = recettes.find(r=>r.nom===form.recette);
          if(rec&&vol){
           const patch = autoFillFromRecette(rec, vol);
           setForm(prev=>({...prev,volume:vol,
            eauMash:patch.eauMash,eauSparge:patch.eauSparge}));
          } else {
           setForm(prev=>({...prev,volume:vol}));
          }
         }} style={iSt}/>
       </div>
       <div><Label t="DI visée"/>
        <input type="number" step="0.001" value={form.og}
         onChange={e=>setForm({...form,og:e.target.value})}
         placeholder="1.050" style={iSt}/>
       </div>
       <div style={{gridColumn:'1/-1'}}>
        <Label t="Date brassage"/>
        <input type="date" value={form.dateDebut}
         onChange={e=>setForm({...form,dateDebut:e.target.value})} style={iSt}/>
       </div>
       <div style={{gridColumn:'1/-1',background:C.bgDark,borderRadius:8,
        padding:'10px 12px',border:`1px solid ${C.border}`}}>
        <div style={{fontSize:9,color:C.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>
         ⚗ Eau & brassage — modifiable
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
         {[
          ['Eau mash (L)',    'eauMash',   'Ratio 3.2L/kg'],
          ['Eau rinçage (L)', 'eauSparge', 'Auto-calculé'],
          ['Temp. mash',      'tempMash',  'Ex: 67'],
          ['Durée mash (min)','dureeMash', '60'],
         ].map(([label,field,hint])=>(
          <div key={field}>
           <div style={{fontSize:9,color:C.textLight,marginBottom:3,
            fontFamily:FM,letterSpacing:0.5}}>{label}</div>
           <input type="text" value={form[field]||''}
            onChange={e=>setForm(prev=>({...prev,[field]:e.target.value}))}
            placeholder={hint}
            style={{...iSt,padding:'7px 10px',fontSize:13}}/>
          </div>
         ))}
        </div>
       </div>
       <div><Label t="pH mash"/>
        <input type="number" step="0.1" value={form.pHMash}
         onChange={e=>setForm({...form,pHMash:e.target.value})}
         placeholder="5.4" style={iSt}/>
       </div>
       <div><Label t="Temp. ferm (°C)"/>
        <input type="number" value={form.tempFerm}
         onChange={e=>setForm({...form,tempFerm:e.target.value})}
         placeholder="18" style={iSt}/>
       </div>
      </div>
      <div>
       <Label t="Notes"/>
       <textarea value={form.notes}
        onChange={e=>setForm({...form,notes:e.target.value})}
        style={{...iSt,height:60,resize:'none'}}/>
      </div>
     </div>
     <div style={{display:'flex',gap:10,marginTop:16,justifyContent:'flex-end'}}>
      <Btn onClick={()=>{setShowF(false);setForm(EF);}}>Annuler</Btn>
      <Btn p onClick={()=>{
       if(!form.recette)return;
       const ogVal   = parseFloat(form.og)||null;
       const today   = new Date().toISOString().split('T')[0];
       const newB = {
        ...form,
        id:            Date.now(),
        volume:        parseInt(form.volume)||0,
        og:            ogVal,
        fg:            parseFloat(form.fg)||null,
        abv:           parseFloat(form.abv)||null,
        paliersMash:   form.paliersMash||[],
        houblonsDetail:form.houblonsDetail||[],
        resucrage:     form.resucrage||{},
        correctionEau: form.correctionEau||'',
        levureType:    form.levureType||form._recRef?.levure||'',
        _recRef:       undefined,
        mesures:  ogVal && form.dateDebut ? [{
         date:   form.dateDebut||today,
         valeur: ogVal,
         temp:   parseFloat(form.tempFerm)||20,
         note:   'DI — initial',
         type:   'densité',
        }] : [],
       };
       setBrassins([...brassins, newB]);
       setShowF(false);setForm(EF);
      }}>Créer</Btn>
     </div>
    </Modal>
   )}
  </div>
 );
}

function ModuleConditionnement({brassins,setBrassins,stockCond,setStockCond,condSessions,setCondSessions}){
 const [view,setView]=useState('sessions');
 const [q,setQ]=useState('');
 const [selId,setSelId]=useState(null);
 const [showStock,setShowStock]=useState(false);
 const [editStock,setEditStock]=useState(null);
 const today=new Date().toISOString().split('T')[0];
 const ES={nom:'',cat:'Bouteille',qte:'',u:'unités',seuil:'',prix:'',four:'',dateAjout:today};
 const [sf,setSf]=useState(ES);
 const EF={brassinId:'',date:today,operateur:'',notes:'',lots:[{type:'Bouteille 33cl',volume:'',contenants:'',lot:'',capacite:0.33}]};
 const [condForm,setCondForm]=useState(EF);

 const totalBt33=condSessions.reduce((s,cs)=>s+cs.lots.filter(l=>l.type==='Bouteille 33cl').reduce((a,l)=>a+l.contenants,0),0);
 const totalBt75=condSessions.reduce((s,cs)=>s+cs.lots.filter(l=>l.type==='Bouteille 75cl').reduce((a,l)=>a+l.contenants,0),0);
 const totalFuts=condSessions.reduce((s,cs)=>s+cs.lots.filter(l=>l.type.startsWith('Fût')).reduce((a,l)=>a+l.contenants,0),0);
 const alertesCond=stockCond.filter(s=>s.qte<=s.seuil).length;

 const brassinsActifs = brassins.filter(b=>b.statut!=='terminé');
 const brassinsGarde  = brassinsActifs.filter(b=>b.statut==='garde');
 const brassinsEnCours= brassinsActifs.filter(b=>b.statut!=='garde'&&b.statut!=='planifié');
 const brassinsPlanif = brassinsActifs.filter(b=>b.statut==='planifié');

 const selBrassin = condForm.brassinId ? brassins.find(x=>x.id===parseInt(condForm.brassinId)) : null;

 const genLotNum = (brassinId, date, lotIndex) => {
  const d   = date || today;
  const yy  = d.slice(2,4);
  const mm  = d.slice(5,7);
  const dd  = d.slice(8,10);
  const num = String(brassinId).padStart(3,'0');
  const lettre = String.fromCharCode(65 + lotIndex); // A, B, C...
  return `${yy}${mm}${dd}-${num}-${lettre}`;
 };

 const rebuildLotNums = (lots, brassinId, date) =>
  lots.map((l,i) => ({...l, lot: genLotNum(brassinId, date, i)}));

 const addLot = () => {
  const next = [...condForm.lots, {type:'Bouteille 33cl',volume:'',contenants:'',lot:'',capacite:0.33}];
  const rebuilt = condForm.brassinId ? rebuildLotNums(next, condForm.brassinId, condForm.date) : next;
  setCondForm({...condForm, lots: rebuilt});
 };

 const updLot=(i,k,v)=>{
  const lots=[...condForm.lots];
  lots[i]={...lots[i],[k]:v};
  if(k==='type'){const cap={"Bouteille 33cl":0.33,"Bouteille 75cl":0.75,"Fût 20L":20,"Fût 30L":30}[v]||0;lots[i].capacite=cap;}
  if(k==='volume'&&lots[i].capacite>0)lots[i].contenants=Math.round(parseFloat(v||0)/lots[i].capacite);
  setCondForm({...condForm,lots});
 };

 const selectBrassin = (id) => {
  const idStr = String(id);
  setCondForm(f => {
   const newId = f.brassinId===idStr ? '' : idStr;
   const lots  = newId ? rebuildLotNums(f.lots, newId, f.date) : f.lots;
   return {...f, brassinId: newId, lots};
  });
 };

 const saveSession=()=>{
  if(!condForm.brassinId)return;
  const b=brassins.find(x=>x.id===parseInt(condForm.brassinId));
  const session={id:Date.now(),brassinId:parseInt(condForm.brassinId),brassinNom:b?.recette||'',date:condForm.date,operateur:condForm.operateur,notes:condForm.notes,lots:condForm.lots.map(l=>({...l,volume:parseFloat(l.volume)||0,contenants:parseInt(l.contenants)||0}))};
  const newStock=[...stockCond];
  session.lots.forEach(lot=>{
   const m={"Bouteille 33cl":"Bouteille 33cl","Bouteille 75cl":"Bouteille 75cl","Fût 20L":"Fût 20L Inox","Fût 30L":"Fût 30L Inox"};
   const sn=m[lot.type];if(sn){const si=newStock.findIndex(s=>s.nom===sn);if(si>=0)newStock[si]={...newStock[si],qte:newStock[si].qte-lot.contenants};}
   if(lot.type==='Bouteille 33cl'){const ci=newStock.findIndex(s=>s.nom==='Capsule couronne 26mm');if(ci>=0)newStock[ci]={...newStock[ci],qte:newStock[ci].qte-lot.contenants};const ei=newStock.findIndex(s=>s.nom==='Étiquette avant 33cl');if(ei>=0)newStock[ei]={...newStock[ei],qte:newStock[ei].qte-lot.contenants};}
   if(lot.type==='Bouteille 75cl'){const ci=newStock.findIndex(s=>s.nom==='Bouchon liège 75cl');if(ci>=0)newStock[ci]={...newStock[ci],qte:newStock[ci].qte-lot.contenants};const ei=newStock.findIndex(s=>s.nom==='Étiquette avant 75cl');if(ei>=0)newStock[ei]={...newStock[ei],qte:newStock[ei].qte-lot.contenants};}
  });
  setStockCond(newStock);
  setCondSessions([session,...condSessions]);
  const totalVol=session.lots.reduce((s,l)=>s+l.volume,0);
  setBrassins(brassins.map(x=>x.id===session.brassinId?{...x,volume:totalVol,statut:'terminé',dateCond:session.date}:x));
  setView('sessions');setCondForm(EF);
 };

 const saveStock=()=>{const it={...sf,id:editStock?.id||Date.now(),qte:parseFloat(sf.qte)||0,seuil:parseFloat(sf.seuil)||0,prix:parseFloat(sf.prix)||0};setStockCond(editStock?stockCond.map(s=>s.id===editStock.id?it:s):[...stockCond,it]);setShowStock(false);setEditStock(null);setSf(ES);};

 const BrassinCard = ({b, highlight}) => {
  const sel = condForm.brassinId===String(b.id);
  const j   = b.dateDebut ? Math.floor((Date.now()-new Date(b.dateDebut))/86400000) : null;
  const s   = STATUTS[b.statut]||STATUTS.planifié;
  return (
   <div onClick={()=>selectBrassin(b.id)}
    style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px',borderRadius:10,
     border:`2px solid ${sel?C.amber:highlight?`${s.color}60`:C.border}`,
     background:sel?C.amberPale:highlight?`${s.color}08`:C.bgCard,cursor:'pointer',
     transition:'all 0.12s'}}>
    <div style={{width:38,height:38,borderRadius:8,background:C.bgDark,flexShrink:0,
     display:'flex',alignItems:'center',justifyContent:'center',
     fontFamily:FM,fontSize:9,color:C.amberL,textAlign:'center',lineHeight:1.3,
     border:`1px solid ${sel?C.amber:C.border}`}}>
     {b.fermenteur}
    </div>
    <div style={{flex:1,minWidth:0}}>
     <div style={{fontWeight:700,fontSize:14,color:C.text,overflow:'hidden',
      textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.recette}</div>
     <div style={{display:'flex',gap:8,marginTop:2,alignItems:'center',flexWrap:'wrap'}}>
      {j!=null&&<span style={{fontSize:11,color:C.textLight,fontFamily:FM}}>J+{j}</span>}
      {b.og&&<span style={{fontSize:11,color:C.textLight,fontFamily:FM}}>DI {b.og.toFixed(3)}</span>}
      {b.fg&&<span style={{fontSize:11,color:C.green,fontFamily:FM}}>DF {b.fg.toFixed(3)}</span>}
     </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
     <Badge statut={b.statut}/>
     {sel&&(
      <span style={{fontSize:10,color:C.amber,fontWeight:700,
       fontFamily:FM}}>✓ sélectionné</span>
     )}
     {sel&&b.statut!=='terminé'&&(
      <span style={{fontSize:10,color:C.hop,fontWeight:600,
       background:C.hopPale,borderRadius:4,padding:'1px 5px',
       fontFamily:FM}}>→ conditionnement</span>
     )}
    </div>
   </div>
  );
 };

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{marginBottom:14}}>
    <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',color:C.text}}>Conditionnement</h2>
    {alertesCond>0&&<p style={{color:C.alert,fontSize:12,fontFamily:FM,marginTop:2}}>⚠ {alertesCond} alerte{alertesCond>1?'s':''} stock emballage</p>}
   </div>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
    <StatCard label="Sessions" value={condSessions.length} icon="🗂" color={C.amber}/>
    <StatCard label="Bouteilles 33cl" value={totalBt33.toLocaleString('fr')} icon="🍺" color={C.green} sub={`${stockCond.find(s=>s.nom==='Bouteille 33cl')?.qte||0} en stock`}/>
    <StatCard label="Bouteilles 75cl" value={totalBt75.toLocaleString('fr')} icon="🍾" color={"#2A6080"} sub={`${stockCond.find(s=>s.nom==='Bouteille 75cl')?.qte||0} en stock`}/>
    <StatCard label="Fûts remplis" value={totalFuts} icon="🛢" color={C.brick} sub={`20L·${stockCond.find(s=>s.nom==='Fût 20L Inox')?.qte||0} / 30L·${stockCond.find(s=>s.nom==='Fût 30L Inox')?.qte||0}`}/>
   </div>
   <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:14,scrollbarWidth:'none'}}>
    {[['sessions','📋 Sessions'],['stock','📦 Stock emballage'],['nouvelle','+ Nouvelle session']].map(([v,l])=>(
     <button key={v} onClick={()=>setView(v)} style={{flexShrink:0,padding:'8px 14px',borderRadius:20,border:`1.5px solid ${view===v?C.amber:C.border}`,background:view===v?C.amberPale:C.bgCard,color:view===v?C.amber:C.textMid,fontWeight:600,fontSize:13,minHeight:40,whiteSpace:'nowrap'}}>{l}</button>
    ))}
   </div>

   {view==='sessions'&&(
    <div>
     {condSessions.length===0&&<div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}><div style={{fontSize:36,marginBottom:8}}>🍾</div><p style={{fontSize:14}}>Aucune session</p></div>}
     {condSessions.map(cs=>{
      const totalL=cs.lots.reduce((s,l)=>s+l.volume,0);const open=selId===cs.id;
      return (
       <div key={cs.id} style={{background:C.bgCard,border:`1.5px solid ${open?C.amber:C.border}`,borderRadius:14,marginBottom:10,overflow:'hidden'}}>
        <div onClick={()=>setSelId(open?null:cs.id)} style={{padding:'14px 16px',cursor:'pointer'}}>
         <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div>
           <div style={{fontFamily:FA,fontSize:17,color:C.text}}>{cs.brassinNom}</div>
           <div style={{fontSize:11,color:C.textLight,fontFamily:FM,marginTop:2}}>{fmtDate(cs.date)} · {cs.operateur} · {totalL}L</div>
          </div>
          <span style={{fontSize:18,color:C.textLight}}>{open?'∧':'∨'}</span>
         </div>
         <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {cs.lots.map((l,i)=>(
           <div key={`k${i}`} style={{display:'flex',flexDirection:'column',gap:2,background:C.bg,borderRadius:8,padding:'6px 10px',border:`1px solid ${C.border}`,minWidth:80}}>
            <div style={{display:'flex',alignItems:'center',gap:5}}>
             <span style={{fontSize:15}}>{TYPE_ICONS[l.type]||'📦'}</span>
             <span style={{fontFamily:FM,fontWeight:700,fontSize:14,color:TYPE_COLORS[l.type]||C.text}}>{l.contenants}</span>
             <span style={{fontSize:11,color:C.textLight}}>{l.type}</span>
            </div>
            {l.lot&&<div style={{fontFamily:FM,fontSize:10,fontWeight:700,color:C.amber,letterSpacing:0.5,marginTop:1,borderTop:`1px solid ${C.border}`,paddingTop:2}}>
             {l.lot}
            </div>}
           </div>
          ))}
         </div>
        </div>
        {open&&(
         <div style={{padding:'0 16px 14px',borderTop:`1px solid ${C.border}`}}>
          {cs.lots.map((l,i)=>(
           <div key={`k${i}`} style={{background:C.bg,borderRadius:10,padding:'10px 12px',marginBottom:8,marginTop:8}}>
            <div style={{fontWeight:700,color:TYPE_COLORS[l.type]||C.text,fontSize:14,marginBottom:6}}>{TYPE_ICONS[l.type]} {l.type}</div>
            {[['Volume',`${l.volume} L`],['Contenants',`${l.contenants}`],['N° lot',l.lot||'—']].map(([k,v])=>(
             <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:2}}>
              <span style={{color:C.textLight}}>{k}</span>
              <span style={{fontFamily:FM,fontWeight:600,color:C.text}}>{v}</span>
             </div>
            ))}
           </div>
          ))}
          {cs.notes&&<div style={{background:C.amberPale,borderRadius:8,padding:'8px 12px',fontSize:12,color:C.textMid,marginTop:4}}>{cs.notes}</div>}
          <button onClick={()=>setCondSessions(condSessions.filter(x=>x.id!==cs.id))} style={{marginTop:10,background:C.brickPale,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 14px',fontSize:12,color:C.alert,minHeight:36}}>Supprimer</button>
         </div>
        )}
       </div>
      );
     })}
    </div>
   )}

   {view==='nouvelle'&&(
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:'16px'}}>
     <h3 style={{fontFamily:FA,fontSize:18,color:C.text,marginBottom:14}}>Nouvelle session de conditionnement</h3>

     <div style={{marginBottom:16}}>
      <Label t="Brassin à conditionner"/>

      {selBrassin&&(
       <div style={{marginBottom:12,padding:'12px 14px',borderRadius:10,
        background:`${C.amberPale}`,
        border:`2px solid ${C.amber}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
         <div>
          <div style={{fontFamily:FA,fontSize:18,color:C.text,lineHeight:1}}>{selBrassin.recette}</div>
          <div style={{fontFamily:FM,fontSize:11,color:C.textLight,marginTop:3}}>{selBrassin.fermenteur} · démarré le {fmtDate(selBrassin.dateDebut)}</div>
         </div>
         <Badge statut={selBrassin.statut}/>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
         {[
          ['DI', selBrassin.og?selBrassin.og.toFixed(3):'—'],
          ['DF', selBrassin.fg?selBrassin.fg.toFixed(3):'—'],
          ['ABV', selBrassin.abv?`${selBrassin.abv}%`:'—'],
          ['J+', selBrassin.dateDebut?Math.floor((Date.now()-new Date(selBrassin.dateDebut))/86400000):'—'],
         ].map(([k,v])=>(
          <div key={k} style={{background:C.bgCard,borderRadius:6,padding:'5px 10px',
           border:`1px solid ${C.border}`,textAlign:'center',flex:'0 0 auto'}}>
           <div style={{fontFamily:FM,fontWeight:700,fontSize:14,color:C.amber,lineHeight:1}}>{v}</div>
           <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',letterSpacing:1,marginTop:1}}>{k}</div>
          </div>
         ))}
        </div>
        {selBrassin.statut!=='terminé'&&(
         <div style={{marginTop:8,padding:'5px 10px',borderRadius:6,
          background:C.hopPale,border:`1px solid ${C.hop}40`,
          display:'inline-flex',alignItems:'center',gap:5,fontSize:11,color:C.hop,fontWeight:600}}>
          <span>🍾</span> Ce brassin passera en <strong>terminé</strong> à l'enregistrement
         </div>
        )}
       </div>
      )}

      {brassinsGarde.length>0&&(
       <div style={{marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
         <div style={{width:8,height:8,borderRadius:'50%',background:'#2A6080'}}/>
         <span style={{fontSize:11,color:'#2A6080',fontWeight:700,textTransform:'uppercase',letterSpacing:0.8}}>
          Prêts à conditionner
         </span>
         <span style={{fontSize:10,color:C.textLight,background:C.border,
          borderRadius:10,padding:'1px 6px'}}>{brassinsGarde.length}</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
         {brassinsGarde.map(b=><BrassinCard key={b.id} b={b} highlight={true}/>)}
        </div>
       </div>
      )}

      {brassinsEnCours.length>0&&(
       <div style={{marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
         <div style={{width:8,height:8,borderRadius:'50%',background:C.amber}}/>
         <span style={{fontSize:11,color:C.textMid,fontWeight:700,textTransform:'uppercase',letterSpacing:0.8}}>
          En cours de fermentation
         </span>
         <span style={{fontSize:10,color:C.textLight,background:C.border,
          borderRadius:10,padding:'1px 6px'}}>{brassinsEnCours.length}</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
         {brassinsEnCours.map(b=><BrassinCard key={b.id} b={b} highlight={false}/>)}
        </div>
       </div>
      )}

      {brassinsActifs.filter(b=>b.statut!=='planifié').length===0&&(
       <div style={{textAlign:'center',padding:'24px 16px',background:C.bg,
        borderRadius:10,border:`1.5px dashed ${C.border}`,color:C.textLight}}>
        <div style={{fontSize:28,marginBottom:6}}>⚗️</div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>Aucun brassin en cours</div>
        <div style={{fontSize:12}}>Démarrez un brassin dans l'onglet Brassin</div>
       </div>
      )}

      {(brassinsPlanif.length>0||brassinsActifs.length===0)&&(
       <div style={{marginTop:8}}>
        <select value={condForm.brassinId} onChange={e=>setCondForm({...condForm,brassinId:e.target.value})} style={{...iSt,fontSize:13,color:condForm.brassinId?C.text:C.textLight}}>
         <option value="">— Ou sélectionner un autre brassin —</option>
         <optgroup label="Terminés récents">
          {brassins.filter(b=>b.statut==='terminé').slice(-10).reverse().map(b=>
           <option key={b.id} value={b.id}>{b.recette} — {b.fermenteur} ({fmtDate(b.dateCond||b.dateDebut)})</option>
          )}
         </optgroup>
        </select>
       </div>
      )}
     </div>

     <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
      <div><Label t="Date"/><input type="date" value={condForm.date} onChange={e=>{const d=e.target.value;setCondForm(f=>({...f,date:d,lots:f.brassinId?rebuildLotNums(f.lots,f.brassinId,d):f.lots}));}} style={iSt}/></div>
      <div><Label t="Opérateur"/><input value={condForm.operateur} onChange={e=>setCondForm({...condForm,operateur:e.target.value})} placeholder="Prénom" style={iSt}/></div>
     </div>

     <div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:'uppercase',letterSpacing:0.8,marginBottom:10}}>Lots de conditionnement</div>
     {condForm.lots.map((lot,i)=>{
      const tc=TYPE_COLORS[lot.type]||C.text;
      const stokOK=lot.type.startsWith('Fût')?true:(()=>{const sn={"Bouteille 33cl":"Bouteille 33cl","Bouteille 75cl":"Bouteille 75cl"}[lot.type];const s=stockCond.find(x=>x.nom===sn);return !s||s.qte>=(parseInt(lot.contenants)||0);})();
      return (
       <div key={`k${i}`} style={{background:C.bg,borderRadius:12,padding:'12px 14px',marginBottom:10,border:`1.5px solid ${tc}25`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
         <span style={{fontWeight:700,color:tc,fontSize:14}}>{TYPE_ICONS[lot.type]||'📦'} Lot {i+1} — {lot.type}</span>
         {condForm.lots.length>1&&<button onClick={()=>setCondForm({...condForm,lots:condForm.lots.filter((_,j)=>j!==i)})} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:6,padding:'4px 10px',fontSize:12,color:C.alert,minHeight:32}}>✕</button>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
         <div><Label t="Type de contenant"/><select value={lot.type} onChange={e=>updLot(i,'type',e.target.value)} style={iSt}><option>Bouteille 33cl</option><option>Bouteille 75cl</option><option>Fût 20L</option><option>Fût 30L</option><option>Fût personnalisé</option></select></div>
         <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div><Label t="Volume (L)"/><input type="number" value={lot.volume} onChange={e=>updLot(i,'volume',e.target.value)} placeholder="556" style={iSt}/></div>
          <div><Label t={lot.type.startsWith('Fût')?'Nb fûts':'Nb bouteilles'}/><input type="number" value={lot.contenants} onChange={e=>updLot(i,'contenants',e.target.value)} placeholder={lot.capacite>0&&lot.volume?Math.round(parseFloat(lot.volume)/lot.capacite):'auto'} style={iSt}/></div>
         </div>
         <div><Label t="N° de lot"/><input value={lot.lot} onChange={e=>updLot(i,'lot',e.target.value)} placeholder="ex: 26-323-A" style={iSt}/></div>
        </div>
        {lot.contenants>0&&!lot.type.startsWith('Fût')&&(
         <div style={{marginTop:8,padding:'6px 10px',borderRadius:8,background:stokOK?C.greenPale:C.brickPale,fontSize:11,color:stokOK?C.green:C.brick,fontFamily:FM}}>
          {stokOK?'✓':'⚠'} Stock {lot.type}: {(()=>{const s=stockCond.find(x=>x.nom==={"Bouteille 33cl":"Bouteille 33cl","Bouteille 75cl":"Bouteille 75cl"}[lot.type]);return s?`${s.qte} dispo`:'—';})()}
         </div>
        )}
       </div>
      );
     })}
     <button onClick={addLot} style={{width:'100%',padding:'10px',borderRadius:10,border:`1.5px dashed ${C.green}`,background:C.greenPale,color:C.green,fontWeight:600,fontSize:13,marginBottom:14,minHeight:44}}>+ Ajouter un lot</button>
     <div style={{background:C.amberPale,borderRadius:10,padding:'10px 14px',marginBottom:14,border:`1px solid ${C.amber}30`}}>
      <div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:6}}>Récapitulatif</div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
       {condForm.lots.map((l,i)=>l.contenants>0&&<div key={`k${i}`} style={{fontSize:12,color:C.textMid}}><span style={{fontSize:15}}>{TYPE_ICONS[l.type]||'📦'}</span> <strong style={{color:TYPE_COLORS[l.type]||C.text}}>{l.contenants}</strong> {l.type}</div>)}
       <div style={{marginLeft:'auto',fontFamily:FM,fontWeight:700,color:C.amber,fontSize:13}}>{condForm.lots.reduce((s,l)=>s+(parseFloat(l.volume)||0),0).toFixed(0)} L total</div>
      </div>
     </div>
     <div><Label t="Notes"/><textarea value={condForm.notes} onChange={e=>setCondForm({...condForm,notes:e.target.value})} placeholder="Observations, pH final..." style={{...iSt,height:60,resize:'none',marginBottom:14}}/></div>
     <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
      <Btn onClick={()=>setView('sessions')}>Annuler</Btn>
      <Btn p onClick={saveSession} style={{opacity:condForm.brassinId?1:0.5,cursor:condForm.brassinId?'pointer':'not-allowed'}}>✓ Enregistrer</Btn>
     </div>
    </div>
   )}

   {view==='stock'&&(
    <div>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
      <h3 style={{fontFamily:FA,fontSize:18,color:C.text}}>Stock emballage</h3>
      <button onClick={()=>setShowStock(true)} style={{background:C.amber,color:'#fff',border:'none',borderRadius:10,padding:'10px 14px',fontWeight:700,fontSize:13,minHeight:44}}>+ Ajouter</button>
     </div>
     <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:12,scrollbarWidth:'none'}}>
      {Object.entries(CAT_COND_COLORS).map(([cat,color])=>{const n=stockCond.filter(s=>s.cat===cat).length;const low=stockCond.filter(s=>s.cat===cat&&s.qte<=s.seuil).length;return(
       <div key={cat} style={{flexShrink:0,background:C.bgCard,border:`1.5px solid ${low>0?C.alert:C.border}`,borderRadius:10,padding:'8px 12px',textAlign:'center',minWidth:72}}>
        <div style={{fontFamily:FA,fontSize:18,color}}>{n}</div>
        <div style={{fontSize:10,color:C.textMid,fontWeight:600,marginTop:1}}>{cat}</div>
        {low>0&&<div style={{fontSize:9,color:C.alert,marginTop:1}}>⚠{low}</div>}
       </div>
      );})}
     </div>
     <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {stockCond.map(s=>{const lv=alertLvl(s.qte,s.seuil);const ac=alertCol(lv);const cc=CAT_COND_COLORS[s.cat]||C.textMid;return(
       <div key={s.id} style={{background:C.bgCard,border:`1.5px solid ${lv==='error'?C.alert:lv==='warn'?C.amber:C.border}`,borderRadius:12,padding:'12px 14px',borderLeft:`4px solid ${cc}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
         <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>{s.nom}</div>
          <Tag text={s.cat} color={cc} bg={`${cc}18`}/>
         </div>
         <div style={{textAlign:'right',flexShrink:0,marginLeft:10}}>
          <div style={{fontFamily:FM,fontWeight:700,fontSize:18,color:ac}}>{s.qte.toLocaleString('fr')}</div>
          <div style={{fontSize:11,color:C.textLight}}>{s.u}</div>
         </div>
        </div>
        <div style={{display:'flex',gap:12,fontSize:12,color:C.textMid,marginBottom:8}}>
         <span>Seuil: <strong style={{color:C.text}}>{s.seuil} {s.u}</strong></span>
         {s.four&&s.four!=='—'&&<span style={{color:C.textLight}}>{s.four}</span>}
        </div>
        <div style={{display:'flex',gap:8}}>
         <button onClick={()=>{setEditStock(s);setSf({...s,qte:String(s.qte),seuil:String(s.seuil),prix:String(s.prix)});setShowStock(true);}} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:8,padding:'6px 12px',fontSize:12,color:C.textMid,minHeight:34}}>✏ Modifier</button>
         <button onClick={()=>{const v=prompt(`Ajuster ${s.nom} (actuel: ${s.qte})`);if(v!==null){const n=parseInt(v);if(!isNaN(n))setStockCond(stockCond.map(x=>x.id===s.id?{...x,qte:n}:x));}}} style={{background:C.amberPale,border:`1px solid ${C.amber}40`,borderRadius:8,padding:'6px 12px',fontSize:12,color:C.amber,fontWeight:600,minHeight:34}}>Ajuster qté</button>
         <button onClick={()=>{if(confirm(`Supprimer "${s.nom}" ?`))setStockCond(stockCond.filter(x=>x.id!==s.id));}} style={{background:C.brickPale,border:`1px solid ${C.border}`,borderRadius:8,padding:'6px 12px',fontSize:12,color:C.alert,minHeight:34}}>✕</button>
        </div>
       </div>
      );})}
     </div>
    </div>
   )}

   {showStock&&(
    <Modal onClose={()=>{setShowStock(false);setEditStock(null);setSf(ES);}}>
     <div style={{padding:'20px'}}>
      <h3 style={{fontFamily:FA,fontSize:18,color:C.text,marginBottom:14}}>{editStock?'Modifier':'Ajouter'} un article</h3>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
       <div><Label t="Nom"/><input value={sf.nom} onChange={e=>setSf({...sf,nom:e.target.value})} style={iSt}/></div>
       <div><Label t="Catégorie"/><select value={sf.cat} onChange={e=>setSf({...sf,cat:e.target.value})} style={iSt}>{Object.keys(CAT_COND_COLORS).map(c=><option key={c}>{c}</option>)}</select></div>
       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <div><Label t="Quantité"/><input type="number" value={sf.qte} onChange={e=>setSf({...sf,qte:e.target.value})} style={iSt}/></div>
        <div><Label t="Unité"/><input value={sf.u} onChange={e=>setSf({...sf,u:e.target.value})} style={iSt}/></div>
       </div>
       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <div><Label t="Seuil alerte"/><input type="number" value={sf.seuil} onChange={e=>setSf({...sf,seuil:e.target.value})} style={iSt}/></div>
        <div><Label t="Prix unit. (€)"/><input type="number" value={sf.prix} onChange={e=>setSf({...sf,prix:e.target.value})} style={iSt}/></div>
       </div>
       <div><Label t="Fournisseur"/><input value={sf.four} onChange={e=>setSf({...sf,four:e.target.value})} style={iSt}/></div>
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:16}}>
       <Btn onClick={()=>{setShowStock(false);setEditStock(null);setSf(ES);}}>Annuler</Btn>
       <Btn p onClick={saveStock}>✓ Enregistrer</Btn>
      </div>
     </div>
    </Modal>
   )}
  </div>
 );
}

function ModuleFournisseurs({fournisseurs,setFournisseurs,stock}){
 const [q,setQ]=useState('');
 const [sel,setSel]=useState(null);
 const [showF,setShowF]=useState(false);
 const [edit,setEdit]=useState(null);
 const EF={nom:'',type:'Malt',contact:'',tel:'',ville:'',delai:'',remise:'',notes:''};
 const [form,setForm]=useState(EF);
 const filtered=fournisseurs.filter(f=>(f.nom+f.ville).toLowerCase().includes(q.toLowerCase()));
 const openEdit=f=>{setEdit(f);setForm({...f,delai:String(f.delai),remise:String(f.remise)});setShowF(true);};
 const save=()=>{const it={...form,id:edit?.id||Date.now(),delai:parseInt(form.delai)||0,remise:parseFloat(form.remise)||0};setFournisseurs(edit?fournisseurs.map(f=>f.id===edit.id?it:f):[...fournisseurs,it]);setShowF(false);setEdit(null);setForm(EF);};
 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
    <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',color:C.text}}>Fournisseurs</h2>
    <button onClick={()=>setShowF(true)} style={{background:C.amber,color:'#fff',border:'none',borderRadius:10,padding:'10px 16px',fontWeight:700,fontSize:14,minHeight:44}}>+ Ajouter</button>
   </div>
   <input placeholder="🔍 Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={{...iSt,marginBottom:12}}/>
   <div style={{display:'flex',flexDirection:'column',gap:8}}>
    {filtered.map(f=>{const c=CAT_COLORS[f.type]||C.textMid;const ni=stock.filter(s=>s.four===f.nom).length;return(
     <div key={f.id} onClick={()=>setSel(f)} style={{background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:14,padding:'14px 16px',cursor:'pointer',borderLeft:`4px solid ${c}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
       <div>
        <div style={{fontFamily:FA,fontSize:16,color:C.text}}>{f.nom}</div>
        <div style={{fontSize:11,color:C.textLight,fontFamily:FM,marginTop:2}}>{f.ville}</div>
       </div>
       <Tag text={f.type} color={c} bg={`${c}18`}/>
      </div>
      <div style={{display:'flex',gap:12,fontSize:12,color:C.textMid,flexWrap:'wrap'}}>
       <span>Délai: <strong style={{color:C.text}}>{f.delai}j</strong></span>
       {f.remise>0&&<span style={{color:C.green}}>-{f.remise}%</span>}
       <span>{ni} produit{ni>1?'s':''} en stock</span>
      </div>
     </div>
    );})}
   </div>
   {sel&&(
    <Modal onClose={()=>setSel(null)} wide>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
      <div>
       <h3 style={{fontFamily:FA,fontSize:20,color:C.text}}>{sel.nom}</h3>
       <Tag text={sel.type} color={CAT_COLORS[sel.type]||C.textMid} bg={`${CAT_COLORS[sel.type]||C.textMid}18`}/>
      </div>
      <button onClick={()=>setSel(null)} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:8,padding:'6px 12px',fontSize:16,color:C.textMid}}>✕</button>
     </div>
     {[['Ville',sel.ville],['Contact',sel.contact],['Tél.',sel.tel],[`Délai`,`${sel.delai} jours`],['Remise',sel.remise>0?`-${sel.remise}%`:'Aucune']].map(([l,v])=>(
      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:C.bg,borderRadius:8,marginBottom:5,fontSize:13}}>
       <span style={{color:C.textLight,fontSize:11,textTransform:'uppercase',fontWeight:700}}>{l}</span>
       <span style={{color:C.text}}>{v||'—'}</span>
      </div>
     ))}
     {sel.notes&&<div style={{margin:'12px 0',padding:'10px 12px',background:C.amberPale,borderRadius:8,fontSize:12,color:C.textMid}}>{sel.notes}</div>}
     <div style={{marginTop:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.textMid,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Produits en stock</div>
      {stock.filter(s=>s.four===sel.nom).map(s=>{const ac=alertCol(alertLvl(s.qte,s.seuil));return(
       <div key={s.id} style={{display:'flex',justifyContent:'space-between',padding:'7px 12px',borderRadius:8,background:C.bg,marginBottom:4}}>
        <span style={{fontWeight:600,color:C.text,fontSize:13}}>{s.nom}</span>
        <span style={{fontFamily:FM,fontSize:13,fontWeight:700,color:ac}}>{fmt(s.qte)} {s.u}</span>
       </div>
      );})}
     </div>
     <div style={{display:'flex',gap:8,marginTop:14,justifyContent:'flex-end'}}>
      <button onClick={()=>{setSel(null);openEdit(sel);}} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:8,padding:'9px 16px',fontSize:13,minHeight:40}}>✏ Modifier</button>
      <button onClick={()=>{setFournisseurs(fournisseurs.filter(x=>x.id!==sel.id));setSel(null);}} style={{background:C.brickPale,border:`1px solid ${C.border}`,borderRadius:8,padding:'9px 16px',fontSize:13,color:C.alert,minHeight:40}}>✕ Supprimer</button>
     </div>
    </Modal>
   )}
   {showF&&(
    <Modal onClose={()=>{setShowF(false);setEdit(null);setForm(EF);}}>
     <h3 style={{fontFamily:FA,fontSize:20,color:C.text,marginBottom:14}}>{edit?'Modifier':'Ajouter'} un fournisseur</h3>
     <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div><Label t="Nom"/><input value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} style={iSt}/></div>
      <div><Label t="Type"/><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={iSt}>{Object.keys(CAT_COLORS).map(c=><option key={c}>{c}</option>)}</select></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
       <div><Label t="Ville / Pays"/><input value={form.ville} onChange={e=>setForm({...form,ville:e.target.value})} style={iSt}/></div>
       <div><Label t="Délai (jours)"/><input type="number" value={form.delai} onChange={e=>setForm({...form,delai:e.target.value})} style={iSt}/></div>
       <div><Label t="Email"/><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} style={iSt}/></div>
       <div><Label t="Remise (%)"/><input type="number" value={form.remise} onChange={e=>setForm({...form,remise:e.target.value})} style={iSt}/></div>
      </div>
      <div><Label t="Notes"/><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{...iSt,height:60,resize:'none'}}/></div>
     </div>
     <div style={{display:'flex',gap:10,marginTop:16,justifyContent:'flex-end'}}>
      <Btn onClick={()=>{setShowF(false);setEdit(null);setForm(EF);}}>Annuler</Btn>
      <Btn p onClick={save}>Enregistrer</Btn>
     </div>
    </Modal>
   )}
  </div>
 );
}

function ModuleHistorique({brassins}){
 const [q,setQ]=useState('');
 const termines=brassins.filter(b=>b.statut==='terminé'&&b.volume>0&&
  (b.recette+' '+(b.notes||'')).toLowerCase().includes(q.toLowerCase()));
 const parRec={};
 termines.forEach(b=>{if(!parRec[b.recette])parRec[b.recette]={n:0,v:0};parRec[b.recette].n++;parRec[b.recette].v+=b.volume;});
 const top=Object.entries(parRec).sort((a,b)=>b[1].v-a[1].v);
 const totalL=termines.reduce((s,b)=>s+b.volume,0);
 const maxV=Math.max(...top.map(x=>x[1].v));
 const mois=[{m:'Oct. 2025',v:65.46},{m:'Nov. 2025',v:63.16},{m:'Déc. 2025',v:69.66},{m:'Jan. 2026',v:47.98},{m:'Fév. 2026',v:61.14},{m:'Mars 2026',v:0}];
 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',color:C.text,marginBottom:4}}>Historique</h2>
   <SearchBar value={q} onChange={setQ} placeholder="Recette, notes…"/>
   <p style={{color:C.textLight,fontSize:12,fontFamily:FM,marginBottom:16}}>{termines.length} brassins · {(totalL/1000).toFixed(2)} hL total</p>
   <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:'14px 16px',marginBottom:14}}>
    <h3 style={{fontFamily:FA,fontSize:17,color:C.text,marginBottom:12}}>Volume par recette</h3>
    {top.map(([nom,d])=>(
     <div key={nom} style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
       <span style={{fontWeight:600,color:C.text,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{nom}</span>
       <span style={{fontFamily:FM,color:C.amber,fontSize:12,flexShrink:0,marginLeft:8}}>{(d.v/1000).toFixed(2)} hL · {d.n}×</span>
      </div>
      <div style={{height:6,background:C.border,borderRadius:3,overflow:'hidden'}}>
       <div style={{height:'100%',borderRadius:3,background:C.amber,width:`${(d.v/maxV)*100}%`}}/>
      </div>
     </div>
    ))}
   </div>
   <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:'14px 16px',marginBottom:14}}>
    <h3 style={{fontFamily:FA,fontSize:17,color:C.text,marginBottom:12}}>Production mensuelle</h3>
    {mois.map(({m,v})=>(
     <div key={m} style={{marginBottom:9}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
       <span style={{fontSize:12,color:C.textMid,fontFamily:FM}}>{m}</span>
       <span style={{fontSize:12,color:v>0?C.amber:C.textLight,fontFamily:FM,fontWeight:700}}>{v>0?`${v.toFixed(1)} HL`:'en cours'}</span>
      </div>
      <div style={{height:6,background:C.border,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',borderRadius:3,background:C.green,width:`${(v/80)*100}%`}}/></div>
     </div>
    ))}
    <div style={{marginTop:12,padding:'8px 12px',background:C.amberPale,borderRadius:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
     <span style={{fontSize:12,color:C.textMid}}>Total exercice</span>
     <span style={{fontFamily:FA,fontSize:16,color:C.amber}}>307,4 HL</span>
    </div>
   </div>
   <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden'}}>
    <div style={{padding:'10px 16px',background:C.cream,borderBottom:`1px solid ${C.border}`,fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:'uppercase',fontFamily:FM}}>Brassins terminés</div>
    {[...termines].reverse().map((b,i)=>(
     <div key={b.id} style={{padding:'10px 14px',borderBottom:i<termines.length-1?`1px solid ${C.border}`:'none',background:i%2===0?C.bgCard:C.bg}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
       <span style={{fontWeight:700,color:C.text,fontSize:14,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.recette}</span>
       <span style={{fontFamily:FM,color:C.amber,fontWeight:700,fontSize:14,flexShrink:0,marginLeft:8}}>{b.volume.toLocaleString('fr')}L</span>
      </div>
      <div style={{display:'flex',gap:10,marginTop:3,flexWrap:'wrap'}}>
       <span style={{fontFamily:FM,color:C.textMid,fontSize:11}}>{fmtDate(b.dateDebut)}</span>
       {b.abv&&<span style={{fontFamily:FM,color:C.green,fontSize:11}}>{b.abv}%</span>}
       {b.og&&<span style={{fontFamily:FM,color:C.textLight,fontSize:11}}>DI {b.og}</span>}
       <span style={{fontFamily:FM,color:C.textLight,fontSize:11}}>{b.fermenteur}</span>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
}

const T = {
 bg:       "#0F0A04",
 bgCard:   "#1A1208",
 bgMid:    "#241A0C",
 bgLight:  "#2E2210",
 border:   "#3D2E18",
 borderL:  "#52401F",
 amber:    "#C8820A",
 amberL:   "#E8A020",
 amberPale:"#2A1E08",
 gold:     "#F0C040",
 cream:    "#F0E8D8",
 creamMid: "#C8B898",
 creamDim: "#8A7A62",
 green:    "#4A7A3A",
 greenL:   "#6AA050",
 greenPale:"#0E1E0A",
 red:      "#C04030",
 redPale:  "#200A08",
 hop:      "#7A8B3C",
 hopPale:  "#181E08",
 bgDark:   "#070501",
};

const STATUTS_LOC = {
 demande:   {label:"Demande",    color:"#7A9A5A", bg:"#141E0A", dot:"○"},
 confirmée: {label:"Confirmée", color:"#6AA050", bg:"#0E1E0A", dot:"●"},
 "en cours":{label:"En cours",  color:"#E8A020", bg:"#2A1E08", dot:"◉"},
 retournée: {label:"Retournée", color:"#8A7A62", bg:"#201810", dot:"◎"},
 annulée:   {label:"Annulée",   color:"#C04030", bg:"#200A08", dot:"✕"},
};

const BIERES = [
 "L'Impèrtinente (APA 6%)",
 "La Pèrchée (Blanche 4.5%)",
 "La Pèrilleuse (Ambrée 6%)",
 "La Pèrlimpinpin (IPA 6.5%)",
 "La Supère (Triple 8.5%)",
 "La Blonde des Papas (Blonde 5%)",
 "La Mèrveilleuse (NEIPA 6%)",
 "La Mèrlimpinpin (DIPA 8%)",
 "La Mary'Stout (Brune 6%)",
 "La Mamagascar (Porter 7%)",
];

const STOCK_FUTS = {"20L":42,"30L":68};

const fmtDateLong = d => d ? new Date(d+"T00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"long"}) : "—";
const nbJours = (a,b) => Math.max(1,Math.round((new Date(b+"T00:00")-new Date(a+"T00:00"))/86400000)+1);
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const startOfWeek = d => { const r=new Date(d); const day=r.getDay()||7; r.setDate(r.getDate()-day+1); r.setHours(0,0,0,0); return r; };
const isSameDay  = (a,b) => new Date(a).toDateString()===new Date(b).toDateString();

const calcTarif = (dateDebut,dateFin,nbTireuses) => {
 if(!dateDebut||!dateFin||nbTireuses<1) return {tarif:0};
 const j  = nbJours(dateDebut,dateFin);
 const nb = Math.max(1,nbTireuses);
 const t  = j===1?30:j===2?50:j<=4?65:j<=7?110:110+(j-7)*20;
 return {tarif:t*nb};
};

const IST = {
 width:"100%",background:T.bgMid,border:`1px solid ${T.border}`,
 borderRadius:8,color:T.cream,padding:"10px 13px",fontSize:16,outline:"none",
};

const LblT = ({t}) => (
 <div style={{fontSize:10,fontWeight:700,color:T.creamDim,letterSpacing:1.5,
  textTransform:"uppercase",marginBottom:5,
  fontFamily:FB}}>{t}</div>
);

const PillT = ({statut}) => {
 const s = STATUTS_LOC[statut]||STATUTS_LOC.confirmée;
 return (
  <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",
   borderRadius:3,background:s.bg,color:s.color,fontSize:11,fontWeight:700,
   fontFamily:FB,letterSpacing:0.5,
   border:`1px solid ${s.color}40`}}>
   <span style={{fontSize:8}}>{s.dot}</span>{s.label.toUpperCase()}
  </span>
 );
};

const SecT = ({n,t}) => (
 <div style={{fontFamily:FB,fontWeight:800,fontSize:12,
  letterSpacing:2,color:T.amber,textTransform:"uppercase",marginBottom:12}}>
  <span style={{background:T.amber,color:"#000",borderRadius:2,padding:"0 5px",
   marginRight:7,fontWeight:900}}>{n}</span>{t}
 </div>
);

function ModalT({onClose,children,title}) {
 return (
  <div onClick={e=>e.target===e.currentTarget&&onClose()}
   style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.87)",zIndex:1000,
    display:"flex",alignItems:"flex-end",justifyContent:"center",
    backdropFilter:"blur(4px)"}}>
   <div style={{background:T.bgCard,borderTop:`2px solid ${T.amber}`,
    width:"100%",maxWidth:620,maxHeight:"93vh",overflowY:"auto",
    animation:"fadeUp 0.18s ease"}}>
    <div style={{position:"sticky",top:0,background:T.bgCard,
     borderBottom:`1px solid ${T.border}`,padding:"14px 20px",
     display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
     <div style={{fontFamily:FB,fontWeight:800,
      fontSize:17,letterSpacing:1,color:T.amberL,textTransform:"uppercase"}}>
      {title}
     </div>
     <button onClick={onClose}
      style={{background:"none",border:`1px solid ${T.border}`,borderRadius:4,
       padding:"4px 10px",color:T.creamDim,fontSize:13,minHeight:32,
       fontFamily:FB,letterSpacing:1}}>ESC</button>
    </div>
    <div style={{padding:"18px 20px 40px"}}>{children}</div>
   </div>
  </div>
 );
}

const FORM_VIDE_T = {
 client:"",contact:"",tel:"",
 lieuEvenement:"",nbPersonnes:0,
 dateDebut:"",dateFin:"",
 tireuses:[],futs:[],
 gobelets25:0,gobelets50:0,
 statut:"confirmée",notes:"",
};

function FormLocationT({editLoc,tireuses,recettes,onSave,onCancel}) {
 const [form,setForm] = useState(() =>
  editLoc
   ? {...editLoc}
   : {...FORM_VIDE_T}
 );
 const [err,setErr] = useState("");

 const applyTarifAuto = (nextForm) => {
  if(editLoc) return nextForm;
  if(!nextForm.dateDebut||!nextForm.dateFin) return nextForm;
    return nextForm;
 };

 const set = (k,v) => setForm(f => ({...f,[k]:v}));

 const setDate = (k,v) => setForm(f => applyTarifAuto({...f,[k]:v}));

 const toggleTireuse = id => setForm(f => {
  const sel  = f.tireuses.includes(id);
  const next = sel ? f.tireuses.filter(x=>x!==id) : [...f.tireuses,id];
  return applyTarifAuto({...f,tireuses:next});
 });

 const addFut = () => setForm(f => ({
  ...f, futs:[...f.futs,{biere:"",typeFut:"20L",nbFuts:1,volTotal:20,prixFut:""}]
 }));
 const remFut = i => setForm(f => ({...f, futs:f.futs.filter((_,j)=>j!==i)}));
 const prixFutAuto = (biere, typeFut) => {
  if(!recettes||!biere) return '';
  const rec = recettes.find(r => biere.startsWith(r.nom)||r.nom===biere.split(' (')[0]);
  if(!rec||!rec.prix) return '';
  const map = {"20L":"f20","30L":"f30"};
  const k   = map[typeFut];
  return k&&rec.prix[k] ? String(rec.prix[k]) : '';
 };

 const updFut = (i,k,v) => setForm(f => {
  const futs = f.futs.map((ft,j)=>{
   if(j!==i) return ft;
   const u = {...ft,[k]:v};
   if(k==="typeFut"||k==="nbFuts"){
    const vol={"20L":20,"30L":30}[k==="typeFut"?v:u.typeFut]||20;
    u.volTotal = vol*(parseInt(k==="nbFuts"?v:u.nbFuts)||1);
   }
   if((k==="biere"||k==="typeFut")&&!ft.prixFut){
    const newBiere  = k==="biere"  ? v : ft.biere;
    const newFormat = k==="typeFut"? v : ft.typeFut;
    const auto = prixFutAuto(newBiere, newFormat);
    if(auto) u.prixFut = auto;
   }
   return u;
  });
  return {...f,futs};
 });

 const handleSave = () => {
  if(!form.client.trim())        {setErr("Le nom du client est requis");      return;}
  if(!form.dateDebut)            {setErr("La date de début est requise");     return;}
  if(!form.dateFin)              {setErr("La date de fin est requise");       return;}
  if(form.dateFin<form.dateDebut){setErr("La date de fin doit être après le début"); return;}
  if(!form.tireuses.length)      {setErr("Sélectionnez au moins une tireuse"); return;}
  setErr("");
  onSave({
   ...form,
   gobelets25: parseInt(form.gobelets25) ||0,
   gobelets50: parseInt(form.gobelets50) ||0,
   futs:    form.futs.map(ft=>({
    ...ft,
    nbFuts:   parseInt(ft.nbFuts)  ||1,
    volTotal: parseInt(ft.volTotal)||0,
    prixFut:  parseFloat(ft.prixFut)||0,
   })),
  });
 };

 const j        = form.dateDebut&&form.dateFin ? nbJours(form.dateDebut,form.dateFin) : 0;
 const volTotal = form.futs.reduce((s,ft)=>s+(parseInt(ft.volTotal)||0),0);
 const sec      = {background:T.bgMid,borderRadius:8,padding:"14px 16px",
          marginBottom:10,border:`1px solid ${T.border}`};

 return (
  <div>
   {err&&(
    <div style={{background:T.redPale,border:`1px solid ${T.red}`,borderRadius:6,
     padding:"10px 14px",marginBottom:12,color:T.red,fontWeight:600,fontSize:13,
     display:"flex",alignItems:"center",gap:8}}>
     <span>⚠</span>{err}
    </div>
   )}

   <div style={{...sec,background:T.amberPale,border:`1.5px dashed ${T.amber}`,marginBottom:12}}>
    <SecT n="→" t="Import depuis Google Agenda (optionnel)"/>
    <div style={{fontSize:11,color:T.creamDim,marginBottom:8}}>
     Coller le titre d'un événement : <span style={{fontFamily:FM,color:T.amber}}>1BEC Client / 2×20L APA 100 Gobelets</span>
    </div>
    <div style={{display:"flex",gap:8}}>
     <input
      placeholder="Ex: 2BEC Anna Faou 0675959565 / 80L Blonde 60L IPA 30 Gobelets"
      style={{...iSt,flex:1,fontSize:12,fontFamily:FM}}
      onChange={e=>{
       const parsed = parseTitrePapas(e.target.value);
       if(!parsed.client) return;
       const tireusesIds = {
        '1 Bec':[1],'2 Becs':[4,5],'2 Becs CO2':[4,5],
        '2 Bari':[6],'2 BCF':[7],'2 BCG':[8],
       }[parsed.typeTireuse]||[];
       setForm(f=>applyTarifAuto({...f,
        client:   parsed.client||f.client,
        tel:      parsed.tel||f.tel,
        tireuses: tireusesIds.length?tireusesIds:f.tireuses,
        futs:     parsed.futs.length?parsed.futs.map(ft=>({
         biere:ft.biere,typeFut:ft.typeFut,
         nbFuts:ft.nbFuts,volTotal:ft.volTotal,prixFut:''
        })):f.futs,
        gobelets25: parsed.gobelets25||f.gobelets25,
       }));
       e.target.value='';
      }}
     />
    </div>
   </div>

   <div style={sec}>
    <SecT n="01" t="Client"/>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
     <div>
      <LblT t="Organisation / Nom *"/>
      <input value={form.client} onChange={e=>set("client",e.target.value)}
       placeholder="Association, mairie, entreprise..." style={IST}/>
     </div>
     <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <div>
       <LblT t="Email"/>
       <input value={form.contact} onChange={e=>set("contact",e.target.value)}
        placeholder="email@..." style={IST}/>
      </div>
      <div>
       <LblT t="Téléphone"/>
       <input value={form.tel} onChange={e=>set("tel",e.target.value)}
        placeholder="06…" style={IST}/>
      </div>
     </div>
     <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <div>
       <LblT t="Lieu de l'événement"/>
       <input value={form.lieuEvenement||""} onChange={e=>set("lieuEvenement",e.target.value)}
        placeholder="Salle, parc, adresse…" style={IST}/>
      </div>
      <div>
       <LblT t="Nb personnes estimé"/>
       <input type="number" min="0" step="10" value={form.nbPersonnes||""} placeholder="0"
        onChange={e=>set("nbPersonnes",parseInt(e.target.value)||0)} style={IST}/>
      </div>
     </div>
    </div>
   </div>

   <div style={sec}>
    <SecT n="02" t="Dates & statut"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
     <div>
      <LblT t="Début *"/>
      <input type="date" value={form.dateDebut}
       onChange={e=>setDate("dateDebut",e.target.value)} style={IST}/>
     </div>
     <div>
      <LblT t="Fin *"/>
      <input type="date" value={form.dateFin}
       onChange={e=>setDate("dateFin",e.target.value)} style={IST}/>
     </div>
    </div>
    {j>0&&(
     <div style={{background:T.amberPale,border:`1px solid ${T.amber}40`,borderRadius:6,
      padding:"6px 12px",marginBottom:10,fontFamily:FM,
      fontSize:12,color:T.amberL}}>
      Durée : <strong>{j} jour{j>1?"s":""}</strong>
     </div>
    )}
    <LblT t="Statut"/>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:2}}>
     {Object.entries(STATUTS_LOC).map(([k,s])=>(
      <button key={k} onClick={()=>set("statut",k)}
       style={{padding:"6px 12px",borderRadius:3,
        border:`1.5px solid ${form.statut===k?s.color:T.border}`,
        background:form.statut===k?s.bg:T.bgCard,
        color:form.statut===k?s.color:T.creamDim,
        fontFamily:FB,fontWeight:700,
        fontSize:12,letterSpacing:0.5,minHeight:34,textTransform:"uppercase"}}>
       {s.dot} {s.label}
      </button>
     ))}
    </div>
   </div>

   <div style={sec}>
    <SecT n="03" t={`Tireuses * — ${form.tireuses.length} sélectionnée${form.tireuses.length>1?"s":""}`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
     {tireuses.map(t=>{
      const sel = form.tireuses.includes(t.id);
      return (
       <button key={t.id} onClick={()=>toggleTireuse(t.id)}
        style={{padding:"10px 6px",borderRadius:6,textAlign:"center",minHeight:60,
         border:`2px solid ${sel?T.amber:T.border}`,
         background:sel?T.amberPale:T.bgCard}}>
        <div style={{fontFamily:FB,fontWeight:900,
         fontSize:13,color:sel?T.gold:T.creamMid,lineHeight:1,letterSpacing:-0.5}}>{t.nom}</div>
        <div style={{fontSize:9,color:sel?T.amberL:T.creamDim,marginTop:3,
         fontFamily:FM}}>{t.capacite}</div>
        {sel&&<div style={{fontSize:9,color:T.amber,marginTop:2,fontWeight:700}}>✓</div>}
       </button>
      );
     })}
    </div>
    <div style={{padding:"6px 10px",background:T.bgCard,borderRadius:5,
     border:`1px solid ${T.border}`,fontSize:10,color:T.creamDim,
     fontFamily:FM,display:"flex",gap:12,flexWrap:"wrap"}}>
     <span>1BEC — 1 robinet · froid sec</span>
     <span>2BEC — 2 robinets · froid sec</span>
     <span>2BARI — 2 rob. compacte · froid sec</span>
     <span>2BCF / 2BCG — banc de glace</span>
    </div>
   </div>

   <div style={sec}>
    <SecT n="04" t="Bières & Fûts"/>
    {form.futs.length===0&&(
     <p style={{fontSize:13,color:T.creamDim,marginBottom:10,fontStyle:"italic"}}>
      Aucun fût — optionnel
     </p>
    )}
    {form.futs.map((ft,i)=>(
     <div key={`k${i}`} style={{background:T.bgCard,borderRadius:8,padding:"12px",
      marginBottom:8,border:`1px solid ${T.borderL}`}}>
      <div style={{display:"flex",justifyContent:"space-between",
       alignItems:"center",marginBottom:10}}>
       <span style={{fontFamily:FB,fontWeight:700,
        fontSize:13,color:T.hop,letterSpacing:1}}>🛢 FÛT {i+1}</span>
       <button onClick={()=>remFut(i)}
        style={{background:"none",border:`1px solid ${T.border}`,borderRadius:3,
         padding:"2px 8px",color:T.red,fontSize:11,
         fontFamily:FB,letterSpacing:1}}>RETIRER</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
       <div>
        <LblT t="Bière"/>
        <select value={ft.biere} onChange={e=>updFut(i,"biere",e.target.value)}
         style={{...IST,background:T.bgMid}}>
         <option value="">— Choisir une bière —</option>
         {BIERES.map(b=><option key={b} value={b}>{b}</option>)}
        </select>
       </div>
       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div>
         <LblT t="Format fût"/>
         <select value={ft.typeFut} onChange={e=>updFut(i,"typeFut",e.target.value)}
          style={{...IST,background:T.bgMid}}>
          <option value="20L">Fût 20L — {STOCK_FUTS["20L"]} dispo</option>
          <option value="30L">Fût 30L — {STOCK_FUTS["30L"]} dispo</option>
         </select>
        </div>
        <div>
         <LblT t="Quantité"/>
         <input type="number" min="1" max="20" value={ft.nbFuts}
          onChange={e=>updFut(i,"nbFuts",e.target.value)}
          style={{...IST,background:T.bgMid}}/>
         <div style={{fontSize:10,marginTop:3,color:T.greenL,
          fontFamily:FM}}>≈ {ft.volTotal}L</div>
        </div>
       </div>
       <div>
        <LblT t="Prix / fût (€) — facturé au retour"/>
        <input type="number" min="0" step="5" value={ft.prixFut||""}
         placeholder="ex: 80"
         onChange={e=>updFut(i,"prixFut",e.target.value)}
         style={{...IST,background:T.bgMid}}/>
        {(ft.prixFut>0&&ft.nbFuts>0)&&(
         <div style={{fontSize:10,marginTop:3,fontFamily:FM,
          fontWeight:700,color:T.gold}}>
          Estimé : {Math.round(parseFloat(ft.prixFut)*parseInt(ft.nbFuts))}€
          {" "}· {ft.volTotal}L
         </div>
        )}
       </div>
      </div>
     </div>
    ))}
    <button onClick={addFut}
     style={{width:"100%",padding:"10px",borderRadius:6,
      border:`1.5px dashed ${T.hop}`,background:"transparent",color:T.hop,
      fontFamily:FB,fontWeight:700,
      fontSize:13,letterSpacing:1,textTransform:"uppercase",minHeight:42}}>
     + Ajouter un fût
    </button>
    {volTotal>0&&(
     <div style={{marginTop:8,padding:"8px 12px",borderRadius:5,
      background:T.amberPale,border:`1px solid ${T.amber}40`,
      fontFamily:FM,fontSize:12,color:T.amberL}}>
      <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,marginBottom:
       form.futs.some(ft=>ft.prixFut>0)?4:0}}>
       <span>Volume total</span><span>{volTotal} L</span>
      </div>
      {form.futs.some(ft=>parseFloat(ft.prixFut)>0)&&(
       <div style={{display:"flex",justifyContent:"space-between",
        paddingTop:4,borderTop:`1px solid ${T.amber}30`}}>
        <span style={{color:T.creamDim}}>Prix estimé fûts</span>
        <span style={{color:T.gold,fontWeight:700}}>
         {form.futs.reduce((s,ft)=>s+(parseFloat(ft.prixFut)||0)*(parseInt(ft.nbFuts)||1),0)}€
         <span style={{fontSize:9,color:T.creamDim,fontWeight:400,marginLeft:4}}>(au retour)</span>
        </span>
       </div>
      )}
     </div>
    )}
   </div>

   <div style={sec}>
    <SecT n="05" t="Gobelets consignés"/>
    <div style={{background:T.bgCard,borderRadius:6,padding:"12px",border:`1px solid ${T.border}`}}>
     <div style={{fontFamily:FB,fontWeight:800,fontSize:11,
      letterSpacing:2,color:T.hop,textTransform:"uppercase",marginBottom:10}}>
      Gobelets consignés — 1€/gobelet
     </div>
     <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <div>
       <LblT t="Gobelets 25cl"/>
       <input type="number" min="0" step="10" value={form.gobelets25||""} placeholder="0"
        onChange={e=>set("gobelets25",parseInt(e.target.value)||0)}
        style={{...IST,background:T.bgMid}}/>
       {(form.gobelets25>0)&&(
        <div style={{fontSize:10,marginTop:3,color:T.greenL,fontFamily:FM,fontWeight:700}}>
         Consigne : {form.gobelets25}€
        </div>
       )}
      </div>
      <div>
       <LblT t="Gobelets 50cl"/>
       <input type="number" min="0" step="10" value={form.gobelets50||""} placeholder="0"
        onChange={e=>set("gobelets50",parseInt(e.target.value)||0)}
        style={{...IST,background:T.bgMid}}/>
       {(form.gobelets50>0)&&(
        <div style={{fontSize:10,marginTop:3,color:T.greenL,fontFamily:FM,fontWeight:700}}>
         Consigne : {form.gobelets50}€
        </div>
       )}
      </div>
     </div>
     {((form.gobelets25||0)+(form.gobelets50||0)>0)&&(
      <div style={{marginTop:10,padding:"8px 12px",borderRadius:5,
       background:T.greenPale,border:`1px solid ${T.green}40`,
       display:"flex",justifyContent:"space-between",alignItems:"center"}}>
       <span style={{fontFamily:FB,fontWeight:700,
        fontSize:11,letterSpacing:1,color:T.greenL,textTransform:"uppercase"}}>
        Total consigne gobelets
       </span>
       <span style={{fontFamily:FM,fontWeight:700,
        color:T.greenL,fontSize:14}}>
        {(form.gobelets25||0)+(form.gobelets50||0)} €
       </span>
      </div>
     )}
     {((form.gobelets25||0)+(form.gobelets50||0)>0)&&(
      <div style={{marginTop:6,padding:"6px 10px",borderRadius:4,
       background:T.amberPale,border:`1px solid ${T.amber}30`,
       fontFamily:FM,fontSize:10,color:T.amberL}}>
       Total gobelets consignés : <strong>{(form.gobelets25||0) + (form.gobelets50||0)} €</strong>
       {" "}({(form.gobelets25||0)+(form.gobelets50||0)} gobelets × 1€)
      </div>
     )}
    </div>
   </div>

   <div style={{marginBottom:14}}>
    <LblT t="Notes / Événement"/>
    <textarea value={form.notes} onChange={e=>set("notes",e.target.value)}
     placeholder="Description de l'événement, instructions..."
     style={{...IST,height:70,resize:"none"}}/>
   </div>

   <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
    <button onClick={onCancel}
     style={{padding:"11px 20px",borderRadius:5,border:`1px solid ${T.border}`,
      background:"transparent",color:T.creamDim,
      fontFamily:FB,fontWeight:700,
      fontSize:14,letterSpacing:1,textTransform:"uppercase",minHeight:46}}>
     Annuler
    </button>
    <button onClick={handleSave}
     style={{padding:"11px 28px",borderRadius:5,border:"none",
      background:T.amber,color:"#000",
      fontFamily:FB,fontWeight:900,
      fontSize:14,letterSpacing:1.5,textTransform:"uppercase",minHeight:46}}>
     {editLoc?"Modifier →":"Créer →"}
    </button>
   </div>
  </div>
 );
}

function VuePlanning({tireuses,locations,onClickLoc}){
 const [mode,      setMode]      = useState('semaine');
 const [offset,    setOffset]    = useState(0);
 const [dateMin,   setDateMin]   = useState('');
 const [dateMax,   setDateMax]   = useState('');
 const [showFilter,setShowFilter]= useState(false);

 const today  = new Date(); today.setHours(0,0,0,0);
 const addD   = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
 const monday = d => { const x=new Date(d); x.setDate(x.getDate()-((x.getDay()+6)%7)); x.setHours(0,0,0,0); return x; };
 const fmtDay = d => d.toLocaleDateString('fr-FR',{day:'numeric'});
 const fmtWD  = d => d.toLocaleDateString('fr-FR',{weekday:'short'});
 const fmtFull= d => d.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
 const fmtM   = d => d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
 const isTod  = d => d.toDateString()===today.toDateString();

 let days=[], periodLabel='', moisRef;
 if(mode==='semaine'){
  const ws = addD(monday(today), offset*7);
  days = Array.from({length:7},(_,i)=>addD(ws,i));
  periodLabel = `Sem. du ${fmtFull(days[0])} au ${fmtFull(days[6])}`;
 } else {
  moisRef = new Date(today.getFullYear(), today.getMonth()+offset, 1);
  const mEnd = new Date(moisRef.getFullYear(), moisRef.getMonth()+1, 0);
  const gs   = addD(monday(moisRef),0);
  const len  = Math.ceil((mEnd.getDate()+((moisRef.getDay()+6)%7))/7)*7;
  days  = Array.from({length:len},(_,i)=>addD(gs,i));
  periodLabel = fmtM(moisRef);
 }

 const locDay = day => {
  const d0 = day; d0.setHours&&d0.setHours(0,0,0,0);
  return locations.filter(l=>{
   if(l.statut==='annulée') return false;
   const s=new Date(l.dateDebut+'T00:00'); s.setHours(0,0,0,0);
   const e=new Date(l.dateFin+'T23:59');
   if(s>d0||e<d0) return false;
   if(dateMin && new Date(l.dateFin+'T00:00') < new Date(dateMin+'T00:00')) return false;
   if(dateMax && new Date(l.dateDebut+'T00:00') > new Date(dateMax+'T00:00')) return false;
   return true;
  });
 };

 const locsVisible = [...new Set(days.flatMap(d=>locDay(d).map(l=>l.id)))].length;

 const SCOL = {confirmée:T.green,demande:T.amber,retournée:T.creamDim,annulée:T.red};

 const COL = `52px repeat(7,1fr)`;

 const PlanSemaine = () => (
  <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
   <div style={{minWidth:380,display:'grid',gridTemplateColumns:COL,gap:2}}>

    {/* Ligne header */}
    <div style={{padding:'4px 2px',display:'flex',alignItems:'center',justifyContent:'center'}}>
     <div style={{fontSize:8,color:T.creamDim,fontFamily:FM,textTransform:'uppercase',letterSpacing:0.5,textAlign:'center',lineHeight:1.2}}>
      TIREUSE
     </div>
    </div>
    {days.map((d,i)=>{
     const nb = locDay(d).length;
     return(
      <div key={`h${i}`} style={{
       background:isTod(d)?T.amber:T.bgMid,
       borderRadius:7,padding:'6px 2px',textAlign:'center',
       border:`1px solid ${isTod(d)?T.amber:T.border}`}}>
       <div style={{fontSize:10,fontWeight:700,
        color:isTod(d)?T.bgCard:T.creamDim,
        fontFamily:FM,textTransform:'uppercase',letterSpacing:0.3}}>
        {fmtWD(d)}
       </div>
       <div style={{fontSize:16,fontWeight:900,
        color:isTod(d)?T.bgCard:T.cream,lineHeight:1.1}}>
        {fmtDay(d)}
       </div>
       {nb>0&&<div style={{fontSize:8,marginTop:1,
        color:isTod(d)?T.bgCard:T.amber,fontFamily:FM}}>
        {nb} loc.
       </div>}
      </div>
     );
    })}

    {/* Ligne séparateur */}
    <div style={{gridColumn:'1 / -1',height:4}}/>

    {/* Lignes tireuses — dans le même grid */}
    {tireuses.map(t=>{
     const hasSomething = days.some(d=>locDay(d).filter(l=>l.tireuses?.includes(t.id)).length>0);
     return [
      /* Label tireuse */
      <div key={`lbl${t.id}`} style={{
       background:T.bgMid,borderRadius:7,padding:'4px 5px',
       display:'flex',flexDirection:'column',justifyContent:'center',
       borderLeft:`3px solid ${t.couleur}`,minHeight:44,
       opacity:hasSomething?1:0.7}}>
       <div style={{fontSize:11,fontWeight:900,color:t.couleur,
        fontFamily:FB,lineHeight:1}}>
        {t.nom}
       </div>
       <div style={{fontSize:8,color:T.creamDim,
        fontFamily:FM,marginTop:1,lineHeight:1}}>
        {t.label}
       </div>
      </div>,
      /* Cellules par jour */
      ...days.map((d,di)=>{
       const locs = locDay(d).filter(l=>l.tireuses?.includes(t.id));
       const is = isTod(d);
       return(
        <div key={`cell${t.id}_${di}`} style={{
         background: locs.length
          ? (SCOL[locs[0].statut]||T.green)+'1A'
          : is ? T.amberPale+'30' : T.bgCard,
         border:`1px solid ${is?T.amber+'50':locs.length?(SCOL[locs[0].statut]+'40'):T.border}`,
         borderRadius:6,minHeight:44,padding:2,
         display:'flex',flexDirection:'column',gap:1,alignItems:'stretch'}}>
         {locs.map((l,li)=>(
          <div key={li} onClick={()=>onClickLoc(l)}
           style={{flex:1,borderRadius:4,padding:'3px 4px',cursor:'pointer',
            background:(SCOL[l.statut]||T.green)+'28',
            borderLeft:`2px solid ${SCOL[l.statut]||T.green}`,
            overflow:'hidden'}}>
           <div style={{fontSize:9,fontWeight:700,
            color:SCOL[l.statut]||T.green,lineHeight:1.2,
            overflow:'hidden',textOverflow:'ellipsis',
            whiteSpace:'nowrap',fontFamily:FB}}>
            {l.client}
           </div>
           {l.lieuEvenement&&<div style={{fontSize:8,color:T.creamDim,
            fontFamily:FM,overflow:'hidden',textOverflow:'ellipsis',
            whiteSpace:'nowrap',marginTop:1}}>
            {l.lieuEvenement}
           </div>}
          </div>
         ))}
        </div>
       );
      }),
     ];
    })}
   </div>
  </div>
 );

 const PlanMois = () => {
  const WDS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const inM = d => d.getMonth()===moisRef?.getMonth();
  return(
   <div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:3}}>
     {WDS.map(j=>(
      <div key={j} style={{textAlign:'center',padding:'5px 2px',
       fontSize:10,fontWeight:700,color:T.creamDim,
       fontFamily:FM,textTransform:'uppercase'}}>
       {j}
      </div>
     ))}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
     {days.map((d,i)=>{
      const locs = locDay(d);
      const isT  = isTod(d);
      const inMois = inM(d);
      return(
       <div key={`k${i}`} style={{
        background: isT?T.amberPale:inMois?T.bgMid:T.bgCard,
        border:`1px solid ${isT?T.amber:T.border}`,
        borderRadius:8,minHeight:60,padding:'3px',
        opacity:inMois?1:0.45}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:2}}>
         <div style={{
          width:22,height:22,borderRadius:'50%',
          background:isT?T.amber:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:11,fontWeight:900,
           color:isT?T.bgCard:inMois?T.cream:T.creamDim,
           fontFamily:FM}}>
           {d.getDate()}
          </span>
         </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:1}}>
         {locs.slice(0,2).map((l,li)=>(
          <div key={li} onClick={()=>onClickLoc(l)}
           style={{borderRadius:4,padding:'2px 4px',cursor:'pointer',
            background:(SCOL[l.statut]||T.green)+'28',
            borderLeft:`2px solid ${SCOL[l.statut]||T.green}`,
            overflow:'hidden'}}>
           <div style={{fontSize:9,fontWeight:700,lineHeight:1.2,
            color:SCOL[l.statut]||T.green,
            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
            fontFamily:FB}}>
            {l.client}
           </div>
           {(l.tireuses||[]).length>0&&(
            <div style={{fontSize:7,color:T.creamDim,
             fontFamily:FM}}>
             {l.tireuses.length}🍺
            </div>
           )}
          </div>
         ))}
         {locs.length>2&&(
          <div style={{fontSize:8,color:T.amber,textAlign:'center',
           fontFamily:FM,fontWeight:700}}>
           +{locs.length-2}
          </div>
         )}
        </div>
       </div>
      );
     })}
    </div>
   </div>
  );
 };

 return(
  <div>
   <div style={{display:'flex',gap:6,alignItems:'center',
    marginBottom:10,flexWrap:'wrap'}}>

    <div style={{display:'flex',background:T.bgMid,borderRadius:8,padding:2}}>
     {[['semaine','7 jours'],['mois','Mois']].map(([k,l])=>(
      <button key={k} onClick={()=>{setMode(k);setOffset(0);}}
       style={{padding:'6px 12px',borderRadius:6,border:'none',
        background:mode===k?T.amber:'transparent',
        color:mode===k?T.bgCard:T.creamMid,
        fontFamily:FM,fontSize:11,fontWeight:700,
        cursor:'pointer',letterSpacing:0.3,minHeight:34}}>
       {l}
      </button>
     ))}
    </div>

    <div style={{display:'flex',alignItems:'center',gap:4,flex:1,justifyContent:'center'}}>
     <button onClick={()=>setOffset(o=>o-1)}
      style={{background:T.bgMid,border:`1px solid ${T.border}`,
       borderRadius:7,width:36,height:36,fontSize:18,color:T.cream,
       cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
      ‹
     </button>
     <div style={{textAlign:'center',flex:1}}>
      <div style={{fontFamily:FB,fontWeight:700,
       fontSize:13,color:T.cream,textTransform:'uppercase',letterSpacing:0.5}}>
       {periodLabel}
      </div>
      {offset!==0&&(
       <button onClick={()=>setOffset(0)}
        style={{background:'none',border:'none',fontSize:10,color:T.amber,
         fontWeight:700,cursor:'pointer',fontFamily:FM}}>
        → Aujourd'hui
       </button>
      )}
     </div>
     <button onClick={()=>setOffset(o=>o+1)}
      style={{background:T.bgMid,border:`1px solid ${T.border}`,
       borderRadius:7,width:36,height:36,fontSize:18,color:T.cream,
       cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
      ›
     </button>
    </div>

    <button onClick={()=>setShowFilter(f=>!f)}
     style={{background:showFilter||dateMin||dateMax?T.amberPale:T.bgMid,
      border:`1px solid ${showFilter||dateMin||dateMax?T.amber:T.border}`,
      borderRadius:8,padding:'6px 10px',fontSize:11,fontWeight:700,
      color:dateMin||dateMax?T.amber:T.creamMid,cursor:'pointer',
      fontFamily:FM,minHeight:34}}>
     🗓 {dateMin||dateMax?'Filtré':'Dates'}
    </button>
   </div>

   {showFilter&&(
    <div style={{background:T.bgMid,borderRadius:10,padding:'12px 14px',
     marginBottom:12,border:`1px solid ${T.border}`}}>
     <div style={{fontSize:9,color:T.amber,fontFamily:FM,
      fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>
      Filtrer par période
     </div>
     <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
      {[['Du','dateMin',dateMin,setDateMin],['Au','dateMax',dateMax,setDateMax]].map(([l,k,v,set])=>(
       <div key={k}>
        <div style={{fontSize:9,color:T.creamDim,fontFamily:FM,
         textTransform:'uppercase',letterSpacing:0.5,marginBottom:4}}>{l}</div>
        <input type="date" value={v}
         onChange={e=>set(e.target.value)}
         style={{...iSt,padding:'8px 10px',fontSize:13,fontFamily:FM}}/>
       </div>
      ))}
     </div>
     {(dateMin||dateMax)&&(
      <button onClick={()=>{setDateMin('');setDateMax('');}}
       style={{marginTop:8,fontSize:10,color:T.creamDim,background:'none',
        border:'none',cursor:'pointer',textDecoration:'underline',
        fontFamily:FM}}>
       Effacer le filtre
      </button>
     )}
    </div>
   )}

   <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
    {[['confirmée',T.green],['demande',T.amber],['retournée',T.creamDim]].map(([k,col])=>(
     <div key={k} style={{display:'flex',alignItems:'center',gap:4}}>
      <div style={{width:10,height:10,borderRadius:3,background:col}}/>
      <span style={{fontSize:10,color:T.creamDim,
       fontFamily:FM}}>{k}</span>
     </div>
    ))}
    <div style={{marginLeft:'auto',fontSize:10,color:T.amber,
     fontFamily:FM,fontWeight:700}}>
     {locsVisible} location{locsVisible!==1?'s':''} visible{locsVisible!==1?'s':''}
    </div>
   </div>

   {mode==='semaine' ? <PlanSemaine/> : <PlanMois/>}
  </div>
 );
}

function VueLocations({locations,setLocations,tireuses,setTireuses,onEdit,initSelLoc,onInitSelLocDone}){
 const [filtre,   setFiltre]   = useState('a_venir');
 const [tri,      setTri]      = useState('date_asc');
 const [q,        setQ]        = useState('');
 const [selLoc,   setSelLoc]   = useState(initSelLoc||null);

 useEffect(()=>{
  if(initSelLoc){ setSelLoc(initSelLoc); if(onInitSelLocDone) onInitSelLocDone(); }
 },[initSelLoc]);

 const filtrees = locations.filter(l=>{
  const today = new Date(); today.setHours(0,0,0,0);
  const dateFin = new Date(l.dateFin+'T00:00');
  const matchStatut = filtre==='toutes'
   || (filtre==='a_venir' && dateFin>=today && l.statut!=='annulée')
   || l.statut===filtre;
  const matchQ      = !q || [l.client,l.contact,l.tel,(l.notes||''),
   (l.futs||[]).map(f=>f.biere).join(' ')]
   .join(' ').toLowerCase().includes(q.toLowerCase());
  return matchStatut && matchQ;
 });

 const sorted = [...filtrees].sort((a,b)=>{
  switch(tri){
   case 'date_asc':  return new Date(a.dateDebut)-new Date(b.dateDebut);
   case 'client':    return (a.client||'').localeCompare(b.client||'');
   case 'statut':    return (a.statut||'').localeCompare(b.statut||'');
   default:          return new Date(b.dateDebut)-new Date(a.dateDebut);
  }
 });

 const SCOL = {confirmée:T.green, demande:T.amber,
        retournée:T.creamDim, annulée:T.red};

 const retourner = l => {
  setLocations(prev=>prev.map(x=>x.id===l.id?{...x,statut:'retournée'}:x));
  setTireuses(prev=>prev.map(t=>l.tireuses?.includes(t.id)?{...t,etat:'disponible'}:t));
  setSelLoc(null);
 };
 const annuler = l => {
  window.confirm('Annuler cette location ?')&&setLocations(prev=>prev.map(x=>x.id===l.id?{...x,statut:'annulée'}:x));
  setTireuses(prev=>prev.map(t=>l.tireuses?.includes(t.id)?{...t,etat:'disponible'}:t));
  setSelLoc(null);
 };

 const gCal = l => {
  const pad=n=>String(n).padStart(2,'0');
  const fD=d=>{const dt=new Date(d+'T00:00');return`${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}`;};
  const titreTireuses = l.tireuses?.length > 0
   ? `[${l.tireuses.length} tireuse${l.tireuses.length>1?'s':''}]` : '';
  const tel = l.tel ? ` · ${l.tel}` : '';
  const title = encodeURIComponent(`${titreTireuses} ${l.client}${tel}`);
  const futsList = (l.futs||[]).length>0
   ? (l.futs||[]).map(f=>`• ${f.nbFuts}×${f.typeFut} ${f.biere}`)
   : ['• Fûts : à préciser'];
  const gobelets = [];
  if((l.gobelets25||0)+(l.gobelets50||0)>0)
   gobelets.push(`• Gobelets consignés : ${(l.gobelets25||0)+(l.gobelets50||0)} × 1€ = ${(l.gobelets25||0)+(l.gobelets50||0)}€`);
  const det = encodeURIComponent([
   `📞 ${l.contact||'—'}${l.tel?' — '+l.tel:''}`,``,
   `🛢 FÛTS`,...futsList,
   ...(gobelets.length?[``,`🥤 GOBELETS`,...gobelets]:[]),
   ...(l.notes?['',`📝 ${l.notes}`]:[]),
  ].join('\n'));
  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fD(l.dateDebut)}/${fD(l.dateFin)}&details=${det}`,'_blank');
 };

 const nomsTireuses = l => (l.tireuses||[]).map(id=>{
  const t = tireuses.find(x=>x.id===id);
  return t ? t.nom : 'T'+id;
 }).join(', ');

 const duree = l => {
  const ms = new Date(l.dateFin+'T00:00')-new Date(l.dateDebut+'T00:00');
  return Math.max(1, Math.round(ms/86400000)+1);
 };

 const consigneGobelets = l => (l.gobelets25||0)+(l.gobelets50||0);

 return(
  <div>
   <div style={{position:'relative',marginBottom:8}}>
    <input value={q} onChange={e=>setQ(e.target.value)}
     placeholder="Rechercher client, bière, contact…"
     style={{...iSt,paddingLeft:32,paddingRight:q?32:12,
      fontFamily:FM,fontSize:12}}/>
    <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',
     fontSize:14,color:T.creamDim,pointerEvents:'none'}}>🔍</span>
    {q&&<button onClick={()=>setQ('')}
     style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',
      background:'none',border:'none',fontSize:14,color:T.creamDim,cursor:'pointer'}}>
     ✕
    </button>}
   </div>

   <div style={{display:'flex',gap:5,overflowX:'auto',marginBottom:8,
    scrollbarWidth:'none',paddingBottom:2}}>
    {['toutes','a_venir','confirmée','demande','retournée','annulée'].map(f=>{
     const today2 = new Date(); today2.setHours(0,0,0,0);
     const n   = f==='toutes'?locations.length
      :f==='a_venir'?locations.filter(l=>new Date(l.dateFin+'T00:00')>=today2&&l.statut!=='annulée').length
      :locations.filter(l=>l.statut===f).length;
     const col = f==='toutes'?T.amber:SCOL[f]||T.amber;
     const act = filtre===f;
     return(
      <button key={f} onClick={()=>setFiltre(f)}
       style={{flexShrink:0,padding:'6px 11px',borderRadius:16,
        border:`1.5px solid ${act?col:T.border}`,
        background:act?col+'22':'transparent',
        color:act?col:T.creamDim,fontSize:11,fontWeight:600,
        fontFamily:FM,cursor:'pointer',
        minHeight:32,whiteSpace:'nowrap'}}>
       {{a_venir:'À venir',toutes:'Toutes',
        confirmée:'Confirmée',demande:'Demande',
        retournée:'Retournée',annulée:'Annulée'}[f]||f}
       {' '}<span style={{opacity:0.7}}>({n})</span>
      </button>
     );
    })}
   </div>

   <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
    <span style={{fontSize:9,color:T.creamDim,fontFamily:FM,
     flexShrink:0}}>TRIER :</span>
    {[['date_desc','📅 Plus récent'],['date_asc','📅 Plus ancien'],
     ['client','A→Z'],['statut','Statut']].map(([k,l])=>(
     <button key={k} onClick={()=>setTri(k)}
      style={{padding:'4px 8px',borderRadius:12,border:`1px solid ${tri===k?T.amber:T.border}`,
       background:tri===k?T.amberPale:'transparent',
       color:tri===k?T.amber:T.creamDim,fontSize:10,fontWeight:600,
       fontFamily:FM,cursor:'pointer',whiteSpace:'nowrap'}}>
      {l}
     </button>
    ))}
   </div>

   <div style={{fontSize:10,color:T.creamDim,fontFamily:FM,
    marginBottom:8}}>
    {sorted.length} location{sorted.length!==1?'s':''}{q?` · "…${q}"`:''}
   </div>

   <div style={{display:'flex',flexDirection:'column',gap:8}}>
    {sorted.map(l=>{
     const col  = SCOL[l.statut]||T.amber;
     const dur  = duree(l);
     const caut = consigneGobelets(l);
     return(
      <div key={l.id} onClick={()=>setSelLoc(l)}
       style={{background:T.bgMid,border:`1px solid ${T.border}`,
        borderRadius:12,padding:'12px 14px',cursor:'pointer',
        borderLeft:`4px solid ${col}`,
        transition:'background 0.12s'}}>

       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'flex-start',marginBottom:6}}>
        <div style={{flex:1,minWidth:0}}>
         <div style={{fontFamily:FB,fontWeight:700,
          fontSize:16,color:T.cream,overflow:'hidden',
          textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {l.client}
         </div>
         <div style={{fontSize:10,color:T.creamDim,
          fontFamily:FM,marginTop:2}}>
          📅 {fmtDate(l.dateDebut)}
          {l.dateFin&&l.dateFin!==l.dateDebut?` → ${fmtDate(l.dateFin)}`:''}
          {' '}· {dur} jour{dur>1?'s':''}
         </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',
         alignItems:'flex-end',gap:4,flexShrink:0,marginLeft:8}}>
         <div style={{background:col+'25',border:`1px solid ${col}40`,
          borderRadius:10,padding:'2px 8px',fontSize:9,fontWeight:700,
          color:col,fontFamily:FM,
          textTransform:'uppercase',letterSpacing:0.5}}>
          {l.statut}
         </div>
        </div>
       </div>

       <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
        {(l.tireuses||[]).length>0&&(
         <div style={{display:'flex',gap:3}}>
          {(l.tireuses||[]).slice(0,6).map(id=>{
           const t=tireuses.find(x=>x.id===id);
           return(
            <div key={id} style={{
             background:(t?.couleur||T.amber)+'30',
             border:`1px solid ${t?.couleur||T.amber}60`,
             borderRadius:5,padding:'2px 6px',fontSize:9,
             fontWeight:700,color:t?.couleur||T.amber,
             fontFamily:FM,whiteSpace:'nowrap'}}>
             {t?.nom||'T'+id}
            </div>
           );
          })}
         </div>
        )}
        {(l.futs||[]).length>0&&(
         <div style={{fontSize:10,color:T.creamDim,
          fontFamily:FM}}>
          🛢 {(l.futs||[]).map(f=>`${f.nbFuts}×${f.typeFut}`).join(' · ')}
         </div>
        )}
        {caut>0&&(
         <div style={{fontSize:10,color:T.greenL,
          fontFamily:FM,marginLeft:'auto'}}>
          🥤 {caut}€
         </div>
        )}
       </div>

       {(l.contact||l.tel)&&(
        <div style={{fontSize:10,color:T.creamDim,
         fontFamily:FM,marginTop:5}}>
         📞 {[l.contact,l.tel].filter(Boolean).join(' — ')}
        </div>
       )}
      </div>
     );
    })}

    {sorted.length===0&&(
     <div style={{textAlign:'center',padding:'40px 0',color:T.creamDim}}>
      <div style={{fontSize:32,marginBottom:8}}>🍻</div>
      <div style={{fontSize:13,fontWeight:600}}>
       {q?`Aucun résultat pour "${q}"`:'Aucune location'}
      </div>
     </div>
    )}
   </div>

   {selLoc&&(()=>{
    const l   = locations.find(x=>x.id===selLoc.id)||selLoc;
    const col = SCOL[l.statut]||T.amber;
    const dur = duree(l);
    const caut= consigneGobelets(l);
    return(
     <Modal onClose={()=>setSelLoc(null)}>
      <div style={{marginBottom:14}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'flex-start',marginBottom:8}}>
        <div style={{flex:1,minWidth:0}}>
         <h2 style={{fontFamily:FB,fontWeight:900,
          fontSize:22,color:T.cream,marginBottom:4}}>{l.client}</h2>
         <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
          <div style={{background:col+'25',border:`1px solid ${col}40`,
           borderRadius:10,padding:'2px 10px',fontSize:10,fontWeight:700,
           color:col,fontFamily:FM,textTransform:'uppercase'}}>
           {l.statut}
          </div>
          <div style={{fontSize:11,color:T.creamDim,
           fontFamily:FM}}>
           {fmtDate(l.dateDebut)}{l.dateFin!==l.dateDebut?` → ${fmtDate(l.dateFin)}`:''} · {dur}j
          </div>
         </div>
        </div>
        <button onClick={()=>setSelLoc(null)}
         style={{background:'none',border:`1px solid ${T.border}`,
          borderRadius:20,padding:'5px 12px',fontSize:12,
          fontWeight:700,color:T.creamMid,cursor:'pointer'}}>✕</button>
       </div>
      </div>

      {(l.tireuses||[]).length>0&&(
       <div style={{marginBottom:12}}>
        <div style={{fontSize:9,color:T.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6}}>
         Tireuses ({l.tireuses.length})
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
         {(l.tireuses||[]).map(id=>{
          const t=tireuses.find(x=>x.id===id);
          return(
           <div key={id} style={{
            background:(t?.couleur||T.amber)+'20',
            border:`1px solid ${t?.couleur||T.amber}50`,
            borderRadius:8,padding:'6px 10px',
            fontSize:12,fontWeight:700,color:t?.couleur||T.amber,
            fontFamily:FM}}>
            {t?.nom||'T'+id}<br/>
            <span style={{fontSize:9,opacity:0.7}}>{t?.modele||''}</span>
           </div>
          );
         })}
        </div>
       </div>
      )}

      {(l.futs||[]).length>0&&(
       <div style={{marginBottom:12}}>
        <div style={{fontSize:9,color:T.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6}}>
         Fûts commandés
        </div>
        {(l.futs||[]).map((f,i)=>(
         <div key={`k${i}`} style={{display:'flex',justifyContent:'space-between',
          padding:'7px 10px',borderRadius:8,background:T.bgCard,
          marginBottom:4,fontSize:12}}>
          <span style={{fontWeight:700,color:T.cream}}>{f.biere}</span>
          <span style={{fontFamily:FM,color:T.amber,fontWeight:700}}>
           {f.nbFuts}×{f.typeFut} = {f.volTotal}L
          </span>
         </div>
        ))}
       </div>
      )}

      {(l.contact||l.tel)&&(
       <div style={{background:T.bgCard,borderRadius:8,padding:'10px 12px',
        marginBottom:12,border:`1px solid ${T.border}`}}>
        <div style={{fontSize:9,color:T.amber,fontFamily:FM,
         fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6}}>
         Contact
        </div>
        <div style={{fontSize:13,color:T.cream,fontWeight:600}}>
         {l.contact||'—'}
        </div>
        {l.tel&&<div style={{fontSize:12,color:T.amber,
         fontFamily:FM,marginTop:3}}>
         📞 {l.tel}
        </div>}
       </div>
      )}

      <div style={{background:T.bgCard,borderRadius:8,padding:'10px 12px',
       marginBottom:12,border:`1px solid ${T.border}`}}>
       <div style={{fontSize:9,color:T.amber,fontFamily:FM,
        fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6}}>
        Gobelets consignés (1€/unité)
       </div>
       {[
        ['Gobelets 25cl',   l.gobelets25>0?`${l.gobelets25} × 1€ = ${l.gobelets25}€`:'—'],
        ['Gobelets 50cl',   l.gobelets50>0?`${l.gobelets50} × 1€ = ${l.gobelets50}€`:'—'],
       ].map(([lbl,val])=>(
        <div key={lbl} style={{display:'flex',justifyContent:'space-between',
         fontSize:12,padding:'4px 0',borderBottom:`1px solid ${T.border}`,
         color:T.creamMid}}>
         <span>{lbl}</span>
         <span style={{fontFamily:FM,
          fontWeight:700,color:T.cream}}>{val}</span>
        </div>
       ))}
       {caut>0&&(
        <div style={{display:'flex',justifyContent:'space-between',
         fontSize:13,padding:'6px 0 0',color:T.greenL,fontWeight:700}}>
         <span>TOTAL CONSIGNE</span>
         <span style={{fontFamily:FM}}>{caut}€</span>
        </div>
       )}
      </div>

      {l.notes&&(
       <div style={{background:T.bgCard,borderRadius:8,padding:'8px 12px',
        marginBottom:12,border:`1px solid ${T.border}`,
        fontSize:11,color:T.creamDim,lineHeight:1.6}}>
        📝 {l.notes}
       </div>
      )}

      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
       {l.statut!=='retournée'&&l.statut!=='annulée'&&(
        <button onClick={()=>retourner(l)}
         style={{flex:1,padding:'10px',borderRadius:8,border:'none',
          background:T.green,color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
         ✓ Retournée
        </button>
       )}
       <button onClick={()=>gCal(l)}
        style={{flex:1,padding:'10px',borderRadius:8,
         border:`1px solid ${T.border}`,background:T.bgLight,
         color:T.creamMid,fontWeight:700,fontSize:12,cursor:'pointer'}}>
        📅 Google Agenda
       </button>
       {onEdit&&(
        <button onClick={()=>{setSelLoc(null);onEdit(l);}}
         style={{flex:1,padding:'10px',borderRadius:8,
          border:`1px solid ${T.amber}60`,background:T.amberPale,
          color:T.amber,fontWeight:700,fontSize:12,cursor:'pointer'}}>
         ✏ Modifier
        </button>
       )}
      </div>
      {l.statut!=='annulée'&&(
       <button onClick={()=>annuler(l)}
        style={{width:'100%',padding:'8px',borderRadius:8,
         border:`1px solid ${T.red}40`,background:'transparent',
         color:T.red,fontSize:11,fontWeight:600,cursor:'pointer'}}>
        🗑 Annuler la location
       </button>
      )}
     </Modal>
    );
   })()}
  </div>
 );
}

function VueParc({tireuses,locations}) {
 const actives = locations.filter(l=>l.statut!=="retournée"&&l.statut!=="annulée");
 const dispos  = tireuses.filter(t=>!actives.some(l=>l.tireuses.includes(t.id))).length;

 return (
  <div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
    {tireuses.map(t=>{
     const lc   = actives.find(l=>l.tireuses.includes(t.id));
     const libre= !lc;
     const s    = lc?STATUTS_LOC[lc.statut]:null;
     return (
      <div key={t.id} style={{background:libre?T.bgCard:T.bgMid,borderRadius:8,
       padding:"12px 8px",border:`2px solid ${libre?T.green:s?.color||T.amber}`,
       textAlign:"center",position:"relative",overflow:"hidden"}}>
       {!libre&&<div style={{position:"absolute",top:0,left:0,right:0,
        height:2,background:s?.color||T.amber}}/>}
       <div style={{fontFamily:FB,fontWeight:900,
        fontSize:14,color:libre?T.greenL:s?.color||T.amber,lineHeight:1,
        letterSpacing:-0.5}}>
        {t.nom}
       </div>
       <div style={{fontSize:9,color:T.creamDim,
        fontFamily:FM,marginTop:3}}>{t.capacite}</div>
       <div style={{marginTop:8,fontSize:10,
        fontFamily:FB,fontWeight:700,
        letterSpacing:0.5,textTransform:"uppercase",
        color:libre?T.green:s?.color||T.amber}}>
        {libre?"LIBRE":s?.label||"Louée"}
       </div>
       {lc&&<div style={{fontSize:8,color:T.creamDim,marginTop:3,overflow:"hidden",
        textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
        {lc.client.split(" ")[0]}
       </div>}
      </div>
     );
    })}
   </div>

   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
    {[
     {label:"Libres",val:`${dispos}/8`,color:T.greenL},
     {label:"En location",val:String(tireuses.length-dispos),color:T.amber},
     {label:"Locations actives",val:String(actives.length),color:T.gold},
    ].map(({label,val,color})=>(
     <div key={label} style={{background:T.bgCard,borderRadius:6,padding:"12px 10px",
      textAlign:"center",border:`1px solid ${T.border}`}}>
      <div style={{fontFamily:FB,fontWeight:900,
       fontSize:24,color,lineHeight:1}}>{val}</div>
      <div style={{fontSize:10,color:T.creamDim,textTransform:"uppercase",
       letterSpacing:1,fontFamily:FB,marginTop:4}}>
       {label}
      </div>
     </div>
    ))}
   </div>

   <div style={{fontFamily:FB,fontWeight:800,fontSize:13,
    letterSpacing:2,color:T.amber,textTransform:"uppercase",marginBottom:10}}>
    Détail du parc
   </div>
   {tireuses.map(t=>{
    const lc   = actives.find(l=>l.tireuses.includes(t.id));
    const libre= !lc;
    return (
     <div key={t.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,
      borderRadius:6,padding:"12px 14px",marginBottom:6,
      display:"flex",gap:12,alignItems:"center",
      borderLeft:`3px solid ${libre?T.green:STATUTS_LOC[lc?.statut]?.color||T.amber}`}}>
      <div style={{width:40,height:40,borderRadius:6,background:T.bgMid,
       display:"flex",alignItems:"center",justifyContent:"center",
       fontFamily:FB,fontWeight:900,
       fontSize:12,color:T.gold,flexShrink:0,letterSpacing:-0.5}}>{t.nom}</div>
      <div style={{flex:1,minWidth:0}}>
       <div style={{fontFamily:FB,fontWeight:700,
        fontSize:14,color:T.cream}}>
        {t.nom}{" "}
        <span style={{fontSize:11,color:T.creamDim,
         fontFamily:FM,fontWeight:400}}>{t.modele}</span>
       </div>
       <div style={{fontSize:11,color:T.creamDim,
        fontFamily:FM,marginTop:1}}>
        {t.capacite}{t.notes?` · ${t.notes}`:""}
       </div>
       {lc&&<div style={{fontSize:11,color:STATUTS_LOC[lc.statut]?.color,
        marginTop:3,fontFamily:FB,fontWeight:600}}>
        {lc.client} · {fmtDate(lc.dateDebut)}→{fmtDate(lc.dateFin)}
       </div>}
      </div>
      <span style={{flexShrink:0,fontFamily:FB,
       fontWeight:700,fontSize:11,letterSpacing:0.5,textTransform:"uppercase",
       color:libre?T.greenL:STATUTS_LOC[lc?.statut]?.color||T.amber}}>
       {libre?"✓ LIBRE":"⏳ LOUÉE"}
      </span>
     </div>
    );
   })}
  </div>
 );
}

function VueStats({locations}) {
 const nonAnn   = locations.filter(l=>l.statut!=="annulée");
 const retour   = locations.filter(l=>l.statut==="retournée");
 const actives  = locations.filter(l=>l.statut!=="annulée"&&l.statut!=="retournée");
 const totalCA  = nonAnn.reduce((s,l)=>s+(l.tarif||0),0);
 const totalGob = actives.reduce((s,l)=>s+((l.gobelets25||0)+(l.gobelets50||0)),0);
 const totalVol = nonAnn.reduce((s,l)=>s+l.futs.reduce((a,f)=>a+(f.volTotal||0),0),0);
 const totalJ   = retour.reduce((s,l)=>s+nbJours(l.dateDebut,l.dateFin),0);

 const bc={};
 nonAnn.forEach(l=>l.futs.forEach(f=>{
  if(f.biere){const k=f.biere.split("(")[0].trim();bc[k]=(bc[k]||0)+f.nbFuts;}
 }));
 const topB = Object.entries(bc).sort((a,b)=>b[1]-a[1]).slice(0,5);
 const maxB = topB[0]?.[1]||1;

 const md={};
 nonAnn.forEach(l=>{
  const m=new Date(l.dateDebut+"T00:00").toLocaleDateString("fr-FR",{month:"short",year:"2-digit"});
  if(!md[m])md[m]={ca:0,n:0};
  md[m].ca+=l.tarif||0; md[m].n++;
 });
 const ma  = Object.entries(md).slice(-6);
 const maxC= Math.max(...ma.map(x=>x[1].ca))||1;

 return (
  <div>
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
    {[
     {label:"Chiffre d'affaires",val:`${totalCA}€`,color:T.gold,  sub:`${nonAnn.length} locations`},
     {label:"Gobelets en consigne",val:`${totalGob}`,color:T.amber, sub:`${totalGob}€ à récupérer`},
     {label:"Volume servi",      val:`${totalVol}L`,color:T.hop,  sub:"en fût"},
     {label:"Jours de location", val:totalJ,       color:T.greenL,sub:`${retour.length} terminées`},
    ].map(({label,val,color,sub})=>(
     <div key={label} style={{background:T.bgCard,borderRadius:8,padding:"14px 16px",
      border:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
       background:color}}/>
      <div style={{fontFamily:FB,fontWeight:900,
       fontSize:"clamp(22px,6vw,30px)",color,lineHeight:1,marginBottom:3}}>
       {val}
      </div>
      <div style={{fontSize:10,color:T.creamDim,textTransform:"uppercase",
       letterSpacing:1,fontFamily:FB,fontWeight:700}}>
       {label}
      </div>
      <div style={{fontSize:11,color:T.creamMid,marginTop:3}}>{sub}</div>
     </div>
    ))}
   </div>

   {ma.length>0&&(
    <div style={{background:T.bgCard,borderRadius:8,padding:"14px 16px",
     border:`1px solid ${T.border}`,marginBottom:16}}>
     <div style={{fontFamily:FB,fontWeight:800,
      fontSize:13,letterSpacing:2,color:T.amber,textTransform:"uppercase",
      marginBottom:12}}>CA mensuel</div>
     {ma.map(([m,d])=>(
      <div key={m} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
       <div style={{width:42,fontFamily:FM,fontSize:10,
        color:T.creamDim,flexShrink:0,textAlign:"right"}}>{m}</div>
       <div style={{flex:1,height:20,background:T.bgMid,borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:2,
         background:`${T.amber}`,
         width:`${(d.ca/maxC)*100}%`}}/>
       </div>
       <div style={{fontFamily:FB,fontWeight:700,
        fontSize:13,color:T.gold,minWidth:40,textAlign:"right"}}>{d.ca}€</div>
      </div>
     ))}
    </div>
   )}

   {topB.length>0&&(
    <div style={{background:T.bgCard,borderRadius:8,padding:"14px 16px",
     border:`1px solid ${T.border}`}}>
     <div style={{fontFamily:FB,fontWeight:800,
      fontSize:13,letterSpacing:2,color:T.hop,textTransform:"uppercase",
      marginBottom:12}}>Bières les + louées</div>
     {topB.map(([nom,n])=>(
      <div key={nom} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
       <div style={{flex:1,fontSize:13,color:T.cream,overflow:"hidden",
        textOverflow:"ellipsis",whiteSpace:"nowrap",
        fontFamily:FB,fontWeight:600}}>{nom}</div>
       <div style={{width:80,height:6,background:T.bgMid,borderRadius:2,
        overflow:"hidden",flexShrink:0}}>
        <div style={{height:"100%",background:T.hop,
         width:`${(n/maxB)*100}%`,borderRadius:2}}/>
       </div>
       <div style={{fontFamily:FM,fontSize:11,color:T.hop,
        minWidth:28,textAlign:"right"}}>{n}×</div>
      </div>
     ))}
    </div>
   )}
  </div>
 );
}

const BIERE_ALIASES = [
 ['blonde des papas', "La Blonde des Papas"],
 ["l'impèrtinente",   "L'Impèrtinente"],
 ['impèrtinente',     "L'Impèrtinente"],
 ['impertinente',     "L'Impèrtinente"],
 ['pèrlimpinpin',     "La Pèrlimpinpin"],
 ['perlimpinpin',     "La Pèrlimpinpin"],
 ['pèrchée',          "La Pèrchée"],
 ['perchee',          "La Pèrchée"],
 ['pèrilleuse',       "La Pèrilleuse"],
 ['perilleuse',       "La Pèrilleuse"],
 ['mèrveilleuse',     "La Mèrveilleuse"],
 ['mèrlimpinpin',     "La Mèrlimpinpin"],
 ['supère',           "La Supère"],
 ['supere',           "La Supère"],
 ["mary'stout",       "La Mary'Stout"],
 ['mary stout',       "La Mary'Stout"],
 ['blonde',           "La Blonde des Papas"],
 ['blanche',          "La Pèrchée"],
 ['ambrée',           "La Pèrilleuse"],
 ['ambree',           "La Pèrilleuse"],
 ['triple',           "La Supère"],
 ['tripel',           "La Supère"],
 ['neipa',            "La Mèrveilleuse"],
 ['stout',            "La Mary'Stout"],
 ['brune',            "La Mary'Stout"],
 ['apa',              "L'Impèrtinente"],
 ['ipa',              "La Pèrlimpinpin"],
];

function normStr(s){
 return (s||'').toLowerCase()
  .replace(/[èêë]/g,'e').replace(/é/g,'e').replace(/[àâ]/g,'a')
  .replace(/[ïî]/g,'i').replace(/[ùû]/g,'u')
  .replace(/['\u2019]/g,' ').replace(/\s+/g,' ').trim();
}

function resolveBiere(raw){
 if(!raw) return '';
 const key = normStr(raw);
 for(const [alias, nom] of BIERE_ALIASES){
  const a = normStr(alias);
  if(a.length <= 3){
   if(new RegExp('(?<![a-z])'+a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![a-z])').test(key)) return nom;
  } else {
   if(key.includes(a)) return nom;
  }
 }
 return raw.trim();
}

function repartirFuts(volTotal, biere){
 if(!volTotal||volTotal<=0) return [];
 let best=null, bestR=Infinity;
 for(let n30=Math.floor(volTotal/30); n30>=0; n30--){
  const r30=volTotal-n30*30; if(r30<0) continue;
  const n20=Math.floor(r30/20); const r=r30-n20*20;
  if(r<bestR){bestR=r;best=[n20,n30,r];if(r===0)break;}
 }
 const [n20,n30,r]=best||[0,0,volTotal];
 const bR=resolveBiere(biere||''); const futs=[];
 if(n30>0) futs.push({biere:bR,typeFut:'30L',nbFuts:n30,volTotal:n30*30,prixFut:0});
 if(n20>0) futs.push({biere:bR,typeFut:'20L',nbFuts:n20,volTotal:n20*20,prixFut:0});
 if(r>0)   futs.push({biere:bR,typeFut:'?L', nbFuts:1,  volTotal:r,     prixFut:0});
 return futs;
}

const TIREUSE_TYPES = [
 {code:'1bec',  nb:1, label:'1 Bec',  ids:[1,2,3]},
 {code:'2bec',  nb:2, label:'2 Becs', ids:[4,5]},
 {code:'2bari', nb:1, label:'2 Bari', ids:[6]},
 {code:'2bcf',  nb:1, label:'2 BCF',  ids:[7]},
 {code:'2bcg',  nb:1, label:'2 BCG',  ids:[8]},
];

function parseTitrePapas(sum){
 const result = {typeTireuse:null, nbTireuses:1, client:'', tel:'', futs:[], gobelets25:0};
 let titre = sum.trim();

 const titreL = titre.toLowerCase();
 for(const tt of TIREUSE_TYPES){
  if(titreL.startsWith(tt.code)){
   result.typeTireuse = tt.label;
   result.nbTireuses  = tt.nb;
   titre = titre.slice(tt.code.length).trim();
   break;
  }
 }

 const slash = titre.indexOf('/');
 const partieClient   = slash>=0 ? titre.slice(0,slash).trim() : titre;
 const partieCommande = slash>=0 ? titre.slice(slash+1).trim() : '';

 const telM = partieClient.match(/\b(0[1-9][\d\s.\-]{8,12})\b/);
 if(telM){
  result.tel = telM[1].replace(/[\s.\-]/g,'');
  result.client = partieClient.replace(telM[0],'').replace(/\s+/g,' ').trim();
 } else {
  result.client = partieClient;
 }

 if(!partieCommande) return result;
 let cmd = partieCommande;

 const gobM = cmd.match(/(\d+)\s*(?:gobelets?|gob\.?)/i);
 if(gobM){
  result.gobelets25 = parseInt(gobM[1]);
  cmd = (cmd.slice(0,gobM.index)+cmd.slice(gobM.index+gobM[0].length)).trim();
 }

 const tokensB = [...cmd.matchAll(/(\d{2,4})\s*[Ll]?\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*?)(?=\d+|$)/g)].filter(m=>parseInt(m[1])>=15&&parseInt(m[1])<=600);

 const tokensC = [...cmd.matchAll(/(\d+)\s*[*×x]\s*(20|30)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*?)(?=\d+\s*[*×x]|\d+\s*[Ll]|$)/g)];

 if(tokensC.length>0){
  tokensC.forEach(m=>{
   const nb=parseInt(m[1]),vol=parseInt(m[2]),biere=m[3].trim().replace(/[+\-\s]+$/,'');
   if(biere) result.futs.push({biere:resolveBiere(biere),typeFut:vol+'L',nbFuts:nb,volTotal:nb*vol,prixFut:0});
  });
 } else if(tokensB.length>0){
  tokensB.forEach(m=>{
   const vol=parseInt(m[1]),biere=m[2].trim().replace(/[+\-\s]+$/,'');
   if(biere) repartirFuts(vol,biere).forEach(f=>result.futs.push(f));
  });
 } else {
  const biereM = cmd.match(/([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s']{2,})\s*$/);
  const biere  = biereM ? biereM[1].trim() : '';
  const cmdVols= biereM ? cmd.slice(0,biereM.index) : cmd;

  const avecMult=[];
  [...cmdVols.matchAll(/(\d+)\s*[*×x]\s*(20|30)/g)].forEach(m=>{
   avecMult.push({nb:parseInt(m[1]),vol:parseInt(m[2]),s:m.index,e:m.index+m[0].length});
  });

  let cmdSimple = cmdVols;
  [...avecMult].reverse().forEach(m=>{
   cmdSimple = cmdSimple.slice(0,m.s)+' '.repeat(m.e-m.s)+cmdSimple.slice(m.e);
  });
  const simplesM = [...cmdSimple.matchAll(/\b(20|30)\b/g)];

  const toutes = [
   ...avecMult.map(m=>({nb:m.nb,vol:m.vol})),
   ...simplesM.map(m=>({nb:1,vol:parseInt(m[1])})),
  ];

  toutes.forEach(({nb,vol})=>{
   if(biere) result.futs.push({biere:resolveBiere(biere),typeFut:vol+'L',
    nbFuts:nb,volTotal:nb*vol,prixFut:0});
  });
 }

 return result;
}

function parseICS(text){
 const events = [];
 if(!text || typeof text !== 'string') return events;

 let t = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
 t = t.replace(/\n[ \t]/g, '');

 const blocks = t.split(/\nBEGIN:VEVENT\n|^BEGIN:VEVENT\n/m);

 blocks.slice(1).forEach(block => {
  const getField = name => {
   const m = block.match(
    new RegExp('(?:^|\\n)' + name + '[^:\\n]*:([^\\n]+)', '')
   );
   return m ? m[1].trim() : '';
  };

  const getMulti = name => {
   const m = block.match(
    new RegExp('(?:^|\\n)' + name + '[^:\\n]*:([\\s\\S]*?)(?=\\n[A-Z][A-Z0-9\\-]*[;:]|\\nEND:VEVENT|$)', '')
   );
   return m ? m[1].trim() : '';
  };

  const parseDate = raw => {
   if(!raw) return '';
   const val = raw.includes(':') ? raw.split(':').slice(1).join(':').trim() : raw.trim();
   const d = val.replace(/T\d{6}Z?$/, '').replace(/[^0-9]/g, '');
   if(d.length !== 8) return '';
   return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
  };

  const dtstart  = getField('DTSTART');
  const dtend    = getField('DTEND');
  const uid      = getField('UID');
  const summary  = getField('SUMMARY')
   .replace(/\\n/g, ' ').replace(/\\N/g, ' ').replace(/\\,/g, ',').trim();

  let desc = getMulti('DESCRIPTION') || getField('DESCRIPTION');
  desc = desc
   .replace(/\\n/g, '\n').replace(/\\N/g, '\n')
   .replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
  desc = desc.split('\n')
   .filter(l => !l.match(/^(UID|DTSTART|DTEND|ORGANIZER|STATUS|SEQUENCE|CLASS|CREATED|LAST-MODIFIED|TRANSP|BEGIN|END|DTSTAMP|RRULE|EXDATE|RECURRENCE-ID|VALARM|ACTION|TRIGGER|DURATION|ATTACH)[;:]/))
   .join('\n').trim();

  if(!dtstart || !summary) return;

  let s = parseDate(dtstart);
  let e = parseDate(dtend) || s;

  if(!s) return; // date invalide

  if(dtend && !dtend.toUpperCase().includes('T') && e > s){
   const dd = new Date(e + 'T00:00');
   dd.setDate(dd.getDate() - 1);
   e = dd.toISOString().split('T')[0];
  }

  events.push({ uid, summary, description: desc, dateDebut: s, dateFin: e });
 });

 return events;
}



function parseDescFuts(desc){
  if(!desc)return{futs:[],gobelets25:0,gobelets50:0,tarif:0,tel:'',contact:'',notes:''};

  const futs=[],seen=new Set();
  let gobelets25=0,gobelets50=0,tarif=0,tel='',contact='',notes='';

  const addVol=(vol,biere)=>{
    const vT=parseInt(vol),b=biere.trim();
    if(!b||vT<15||vT>600)return;
    const bR=resolveBiere(b);
    if(!bR)return;
    repartirFuts(vT,bR).forEach(f=>{
      const k=f.nbFuts+'x'+parseInt(f.typeFut)+'-'+f.biere;
      if(!seen.has(k)){seen.add(k);futs.push(f);}
    });
  };
  const addF=(nb,vol,biere)=>{
    const bR=resolveBiere(biere),v=parseInt(vol),n=parseInt(nb);
    const k=n+'x'+v+'-'+bR;
    if(!seen.has(k)&&n>0&&v>0&&bR){seen.add(k);futs.push({biere:bR,typeFut:v+'L',nbFuts:n,volTotal:n*v,prixFut:0});}
  };

  const gob50m=desc.match(/\+?(\d+)\s*(?:gobelets?|gob\.?)\s*(?:de\s+)?50/i);
  if(gob50m)gobelets50=parseInt(gob50m[1]);
  const gob25m=desc.match(/\+?(\d+)\s*(?:gobelets?|gob\.?)\s*(?:de\s+)?25/i)
              ||(!gob50m&&desc.match(/\+?(\d+)\s*(?:gobelets?|gob\.?)(?!\s*\d)/i));
  if(gob25m)gobelets25=parseInt(gob25m[1]);
  const tarifm=desc.match(/(?:tarif|prix|total)\s*:?\s*(\d+)\s*€/i);
  if(tarifm)tarif=parseInt(tarifm[1]);
  const telm=desc.match(/(?:t[eé]l(?:[eé]phone)?|mobile)\s*[:\-.]?\s*([+\d][\d\s.\-]{7,})/i)
            ||desc.match(/\b(0[1-9][\d\s.\-]{8,12})\b/);
  if(telm)tel=telm[1].replace(/[\s.\-]/g,'').trim();
  const contm=desc.match(/(?:contact|nom)\s*[:\-]\s*([^\n,]{2,40})/i);
  if(contm)contact=contm[1].trim();

  const normalized = desc
    .replace(/\r/g,'')
    .replace(/\s*,\s*/g,'\n')    // virgule → saut de ligne
    .replace(/\s*\+\s*(?=\d)/g,'\n'); // + avant nombre → saut de ligne

  const SKIP=/(?:gobelets?|gob\.|tarif|prix|dépôt|contact|t[eé]l|mobile|adresse|\d\s*€)/i;

  normalized.split('\n').forEach(rawLine=>{
    let line=rawLine.replace(/^[•\-\*\+]\s*/,'').trim();
    if(!line||SKIP.test(line))return;

    for(const m of line.matchAll(/(\d+)\s*[×xX\*]\s*(20|30)\s*[Ll]\.?\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s']{1,30}?)(?=\d|$)/g))
      addF(m[1],m[2],m[3].trim());

    for(const m of line.matchAll(/([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s']{1,25}?)\s*[-:–]\s*(\d+)\s*[×xX\*]\s*(20|30)\s*[Ll]/g))
      if(!SKIP.test(m[1]))addF(m[2],m[3],m[1].trim());

    const lineClean=line.replace(/\+?\d+\s*(?:gobelets?|gob\.?)[^\n]*/gi,'').trim();
    for(const m of lineClean.matchAll(/(\d{2,4})\s*[Ll]?\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ']{2,25})/g)){
      const vol=parseInt(m[1]),biere=m[2].trim();
      if(vol>=15&&vol<=600&&!SKIP.test(biere))addVol(vol,biere);
    }

    for(const m of lineClean.matchAll(/([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ']{2,25})\s+(\d{2,4})\s*[Ll](?!\s*[×xX])/g)){
      const biere=m[1].trim(),vol=parseInt(m[2]);
      if(vol>=15&&vol<=600&&!SKIP.test(biere))addVol(vol,biere);
    }
  });

  const NOTE_STRIP=/tireuse|f[uû]t|gobelet|gob\b|tarif|contact|t[eé]l|\d+\s*[Ll]\b|\d+\s*[×xX]|\d+\s*€/i;
  notes=desc.split('\n').map(l=>l.trim())
    .filter(l=>l&&!NOTE_STRIP.test(l)&&!SKIP.test(l)).slice(0,3).join(' — ');

  return{futs,gobelets25,gobelets50,tarif,tel,contact,notes};
}

function mapICS(evt,i){
 const sum=evt.summary||'';
 const desc=evt.description||'';
 const sumL=sum.toLowerCase();
 const isPapasFmt=/^(1bec|2bec|2bari|2bcf|2bcg)/.test(sumL);
 const fromDesc=parseDescFuts(desc);

 if(isPapasFmt){
  const parsed=parseTitrePapas(sum);
  const ttEntry=TIREUSE_TYPES.find(t=>t.label===parsed.typeTireuse);
  const tireuseIds=ttEntry?ttEntry.ids:[1];
  const tireuses=tireuseIds.slice(0,parsed.nbTireuses);
  const futs=parsed.futs.length>0 ? parsed.futs : fromDesc.futs;
  const gobelets25=parsed.gobelets25||fromDesc.gobelets25;
  const gobelets50=fromDesc.gobelets50;
  const tel=parsed.tel||fromDesc.tel;
  const tarif=fromDesc.tarif;
  const notes=desc||'Import Google Agenda';
  return {
   id:Date.now()+i, client:parsed.client, contact:parsed.client,
   tel, dateDebut:evt.dateDebut, dateFin:evt.dateFin||evt.dateDebut,
   tireuses, typeTireuse:parsed.typeTireuse,
   futs, gobelets25, gobelets50, tarif,
   statut:'confirmée', notes, icsUid:evt.uid,
  };
 }

 const client=sum.replace(/^[🍻🔔📅\s]*/,'')
  .replace(/^(location|réservation|tireuse|loc\.?)[\s:\-]+/i,'')
  .replace(/\s*[-–]\s*(tireuse|location)s?.*/i,'')
  .replace(/\s*[\[\(].*?[\]\)]/g,'').trim()||`Import ${i+1}`;

 const allTxt=sum+'\n'+desc;
 const mT=allTxt.match(/(\d+)\s*tireuse/i)||allTxt.match(/tireuses?\s*[×x]\s*(\d+)/i);
 const nb=mT?Math.min(parseInt(mT[1]),8):1;
 const mCon=desc.match(/(?:contact|nom)\s*[:\-]\s*([^\n,]+)/i);

 return {
  id:Date.now()+i, client,
  contact:fromDesc.contact||(mCon?mCon[1].replace(/[\-–\|,].*/,'').trim():''),
  tel:fromDesc.tel,
  dateDebut:evt.dateDebut, dateFin:evt.dateFin||evt.dateDebut,
  tireuses:Array.from({length:nb},(_,j)=>j+1),
  futs:fromDesc.futs,
  gobelets25:fromDesc.gobelets25,
  gobelets50:fromDesc.gobelets50,
  tarif:fromDesc.tarif,
  statut:'confirmée',
  notes:fromDesc.notes||'Import Google Agenda',
  icsUid:evt.uid,
 };
}

function VueImport({locations,setLocations,onDone}){
 const [step,      setStep]      = useState('accueil');
 const [parsed,    setParsed]    = useState([]);
 const [selected,  setSelected]  = useState([]);
 const [urlInput,  setUrlInput]  = useState('');
 const [savedUrl,  setSavedUrl]  = useState('');
 const [loading,   setLoading]   = useState(false);
 const [err,       setErr]       = useState('');
 const [lastSync,  setLastSync]  = useState(null);
 const [autoMode,  setAutoMode]  = useState(false);

 useEffect(()=>{
  try{
   const DEFAULT_GCAL = 'https://calendar.google.com/calendar/ical/4sviprsls3nolk69j6rinf9si4%40group.calendar.google.com/public/basic.ics';
   const u = localStorage.getItem('ical_url_tireuses')||DEFAULT_GCAL;
   if(u){setSavedUrl(u);setUrlInput(u);}
   try{const ls=localStorage.getItem('ical_last_sync');if(ls)setLastSync(new Date(ls));}catch(e){}
  }catch(e){}
 },[]);

 const saveUrl = url => {
  try{ localStorage.setItem('ical_url_tireuses',url); }catch(e){}
  setSavedUrl(url);
 };

 const processICS = text => {
  setErr('');
  const evts = parseICS(text);
  if(!evts.length){setErr('Aucun événement trouvé. Vérifiez le format iCal.');return;}
  const mapped = evts
   .filter(e=>{ const s=(e.summary||'').toLowerCase();
    return /^(1bec|2bec|2bari|2bcf|2bcg)/.test(s)
     ||/tireuse|location|r[eé]servation|[eé]v[eé]n|f[eê]te|mariage|soiree|soirée|annivers/i.test(s+' '+(e.description||'')); })
   .map((e,i)=>mapICS(e,i));
  const used   = new Set(locations.filter(l=>l.icsUid).map(l=>l.icsUid));
  const news = mapped.filter(e=>!used.has(e.icsUid));
  const upds = mapped.filter(e=>used.has(e.icsUid));
  setSelected([...news,...upds].map(e=>e.id));
  setParsed(mapped);
  setStep('preview');
  try{localStorage.setItem('ical_last_sync',new Date().toISOString());}catch(e){}
  setLastSync(new Date());
 };

 const handleFile = e => {
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>processICS(ev.target.result);
  r.readAsText(f,'UTF-8');
 };

 const syncUrl = async (url) => {
  const u = url||urlInput;
  if(!u.trim()){setErr('Entrez une URL iCal valide');return;}
  setLoading(true); setErr('');
  try{
   const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`;
   const res = await fetch(proxy);
   if(!res.ok) throw new Error('HTTP '+res.status);
   const text = await res.text();
   if(!text.includes('BEGIN:VCALENDAR')) throw new Error('Format iCal invalide');
   saveUrl(u);
   processICS(text);
  }catch(ex){
   setErr(`Erreur : ${ex.message}. Vérifiez que l'agenda Google est bien partagé en public.`);
  }
  setLoading(false);
 };

 const doImport = () => {
  const toImp = parsed.filter(e=>selected.includes(e.id));
  const used  = new Set(locations.filter(l=>l.icsUid).map(l=>l.icsUid));
  setLocations(prev=>{
   let r=[...prev];
   toImp.filter(e=>used.has(e.icsUid)).forEach(u=>{
    r=r.map(l=>l.icsUid===u.icsUid?{...l,...u,id:l.id}:l);
   });
   return [...toImp.filter(e=>!used.has(e.icsUid)),...r];
  });
  setStep('done');
 };

 const nbNew  = parsed.filter(e=>!locations.some(l=>l.icsUid===e.icsUid)&&selected.includes(e.id)).length;
 const nbUpd  = parsed.filter(e=> locations.some(l=>l.icsUid===e.icsUid)&&selected.includes(e.id)).length;

 const card   = {background:T.bgCard,borderRadius:10,padding:'14px 16px',
  marginBottom:10,border:`1px solid ${T.border}`};
 const btnPrim= {padding:'11px 20px',borderRadius:6,border:'none',
  background:T.amber,color:'#000',fontFamily:FB,
  fontWeight:900,fontSize:14,letterSpacing:0.8,textTransform:'uppercase',
  cursor:'pointer',width:'100%',minHeight:44};
 const btnSec = {padding:'10px 16px',borderRadius:6,
  border:`1px solid ${T.border}`,background:'transparent',
  color:T.creamDim,fontFamily:FB,
  fontWeight:700,fontSize:13,letterSpacing:0.5,cursor:'pointer'};
 const Label  = ({children,style={}})=>(
  <div style={{fontSize:9,fontFamily:FM,fontWeight:700,
   letterSpacing:2,color:T.amberL,textTransform:'uppercase',
   marginBottom:6,...style}}>{children}</div>
 );

 if(step==='done') return(
  <div style={{textAlign:'center',padding:'40px 16px'}}>
   <div style={{fontSize:52,marginBottom:14}}>✅</div>
   <div style={{fontFamily:FB,fontWeight:900,
    fontSize:22,color:T.greenL,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>
    Synchronisation réussie
   </div>
   <div style={{fontSize:13,color:T.creamDim,marginBottom:6}}>
    {nbNew} nouvelle(s) location · {nbUpd} mise(s) à jour
   </div>
   {savedUrl&&<div style={{fontSize:10,color:T.amberL,fontFamily:FM,
    marginBottom:24,wordBreak:'break-all',padding:'6px 10px',
    background:T.bgMid,borderRadius:6,border:`1px solid ${T.amber}30`}}>
    🔗 URL mémorisée ✓
   </div>}
   <button onClick={onDone} style={btnPrim}>Voir les locations →</button>
  </div>
 );

 if(step==='preview') return(
  <div>
   <div style={{...card,background:T.amberPale,border:`1px solid ${T.amber}50`,marginBottom:14}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
     <div>
      <div style={{fontFamily:FB,fontWeight:900,
       fontSize:16,color:T.amber,letterSpacing:0.5}}>
       {parsed.length} événement{parsed.length>1?'s':''} trouvés
      </div>
      <div style={{fontSize:11,color:T.creamDim,marginTop:3,
       fontFamily:FM}}>
       {parsed.filter(e=>!locations.some(l=>l.icsUid===e.icsUid)).length} nouveaux ·{' '}
       {parsed.filter(e=>locations.some(l=>l.icsUid===e.icsUid)).length} mises à jour
      </div>
     </div>
     <button onClick={()=>setSelected(parsed.map(e=>e.id))}
      style={{...btnSec,fontSize:11,padding:'6px 10px'}}>
      Tout cocher
     </button>
    </div>
   </div>

   {err&&<div style={{background:T.redPale,border:`1px solid ${T.red}40`,
    borderRadius:6,padding:'8px 12px',marginBottom:10,color:T.red,fontSize:12}}>{err}</div>}

   <div style={{maxHeight:340,overflowY:'auto',marginBottom:14,
    display:'flex',flexDirection:'column',gap:6,scrollbarWidth:'thin'}}>
    {parsed.map(e=>{
     const sel   = selected.includes(e.id);
     const exist = locations.some(l=>l.icsUid===e.icsUid);
     const debut = new Date(e.dateDebut+'T00:00');
     const fin   = new Date(e.dateFin+'T00:00');
     const duree = Math.round((fin-debut)/86400000)+1;
     return(
      <div key={e.id}
       onClick={()=>setSelected(s=>sel?s.filter(x=>x!==e.id):[...s,e.id])}
       style={{background:sel?T.amberPale:T.bgCard,
        border:`1.5px solid ${sel?T.amber:T.border}`,
        borderRadius:8,padding:'10px 12px',cursor:'pointer',
        borderLeft:`3px solid ${exist?T.amber:T.greenL}`,
        opacity:sel?1:0.65,transition:'all 0.15s'}}>
       <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
        <div style={{width:18,height:18,borderRadius:3,flexShrink:0,marginTop:2,
         border:`2px solid ${sel?T.amber:T.border}`,
         background:sel?T.amber:'transparent',
         display:'flex',alignItems:'center',justifyContent:'center',
         fontSize:10,color:'#000',fontWeight:900}}>
         {sel?'✓':''}
        </div>
        <div style={{flex:1,minWidth:0}}>
         <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
          <div style={{fontFamily:FB,fontWeight:700,
           fontSize:15,color:T.cream,overflow:'hidden',
           textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>
           {e.client||'Sans titre'}
          </div>
          {exist&&<span style={{flexShrink:0,fontSize:8,fontWeight:700,
           color:T.amber,background:T.bgDark,border:`1px solid ${T.amber}40`,
           padding:'1px 5px',borderRadius:3,fontFamily:FM,
           letterSpacing:0.5}}>MAJ</span>}
         </div>
         <div style={{fontFamily:FM,fontSize:10,
          color:T.creamDim,marginBottom:4}}>
          📅 {e.dateDebut}{e.dateFin!==e.dateDebut?` → ${e.dateFin}`:''} · {duree}j
         </div>
         <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {e.tireuses?.length>0&&<span style={{fontSize:9,color:T.amberL,
           background:T.bgDark,padding:'1px 6px',borderRadius:3,
           fontFamily:FM,border:`1px solid ${T.amber}20`}}>
           🍻 {e.tireuses.length} tireuse{e.tireuses.length>1?'s':''}
          </span>}
          {e.futs?.length>0&&<span style={{fontSize:9,color:T.creamDim,
           background:T.bgDark,padding:'1px 6px',borderRadius:3,
           fontFamily:FM}}>
           🛢 {e.futs.map(f=>f.nbFuts+'×'+f.typeFut).join(' ')}
          </span>}
          {(e.gobelets25>0||e.gobelets50>0)&&<span style={{fontSize:9,color:T.greenL,
           background:T.bgDark,padding:'1px 6px',borderRadius:3,
           fontFamily:FM}}>
           🥤 {(e.gobelets25||0)+(e.gobelets50||0)} gob.
          </span>}
          {e.tel&&<span style={{fontSize:9,color:T.creamDim,
           background:T.bgDark,padding:'1px 6px',borderRadius:3,
           fontFamily:FM}}>
           📞 {e.tel}
          </span>}
         </div>
        </div>
       </div>
      </div>
     );
    })}
   </div>

   <div style={{display:'flex',gap:8}}>
    <button onClick={()=>setStep('accueil')} style={{...btnSec,flex:1}}>
     ← Retour
    </button>
    <button onClick={doImport} disabled={selected.length===0}
     style={{...btnPrim,flex:2,opacity:selected.length===0?0.4:1}}>
     Importer {selected.length} événement{selected.length>1?'s':''}
    </button>
   </div>
  </div>
 );

 return(
  <div>
   {savedUrl&&(
    <div style={{...card,border:`1.5px solid ${T.amber}60`,marginBottom:12,
     background:T.amberPale}}>
     <div style={{display:'flex',justifyContent:'space-between',
      alignItems:'flex-start',marginBottom:8}}>
      <div>
       <div style={{fontFamily:FB,fontWeight:900,
        fontSize:15,color:T.amber,letterSpacing:0.5,marginBottom:3}}>
        🔗 Agenda mémorisé
       </div>
       <div style={{fontSize:9,color:T.creamDim,
        fontFamily:FM,wordBreak:'break-all',
        maxWidth:220,lineHeight:1.4}}>
        {savedUrl.replace('https://calendar.google.com','gcal').slice(0,60)}…
       </div>
       {lastSync&&<div style={{fontSize:9,color:T.amberL,
        fontFamily:FM,marginTop:3}}>
        Dernière synchro : {lastSync.toLocaleDateString('fr-FR',
         {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
       </div>}
      </div>
      <button onClick={()=>syncUrl(savedUrl)}
       disabled={loading}
       style={{...btnPrim,width:'auto',padding:'8px 14px',fontSize:12,
        display:'flex',alignItems:'center',gap:6,minWidth:90}}>
       {loading?'…':'🔄 Sync'}
      </button>
     </div>
     <button onClick={()=>{setSavedUrl('');setUrlInput('');
      try{localStorage.removeItem('ical_url_tireuses');}catch(e){}}}
      style={{fontSize:9,color:T.creamDim,background:'none',border:'none',
       cursor:'pointer',textDecoration:'underline',fontFamily:FM}}>
      Supprimer l'URL mémorisée
     </button>
    </div>
   )}

   <div style={card}>
    <Label>Option A — URL iCal Google Agenda</Label>
    <input value={urlInput} onChange={e=>setUrlInput(e.target.value)}
     placeholder="https://calendar.google.com/calendar/ical/…"
     style={{...iSt,marginBottom:8,fontSize:13,
      fontFamily:FM}}/>
    {err&&<div style={{fontSize:11,color:T.red,marginBottom:8,lineHeight:1.4}}>{err}</div>}
    <button onClick={()=>syncUrl()} disabled={loading}
     style={{...btnPrim,opacity:loading?0.6:1}}>
     {loading?'Chargement…':'🔄 Synchroniser maintenant'}
    </button>
   </div>

   <div style={{...card,background:T.bgDark}}>
    <Label>Comment obtenir l'URL iCal ?</Label>
    {[
     ['1','Ouvrez Google Agenda sur ordinateur'],
     ['2','Dans le panneau gauche, cliquez ⋮ à côté de votre agenda "Tireuses"'],
     ['3','Sélectionnez "Paramètres et partage"'],
     ['4','Section "Intégrer l\'agenda" → copiez l\'adresse iCal'],
     ['5','Collez l\'URL ci-dessus et cliquez Synchroniser'],
    ].map(([n,t])=>(
     <div key={n} style={{display:'flex',gap:10,alignItems:'flex-start',
      marginBottom:8,fontSize:12,color:T.creamDim,lineHeight:1.4}}>
      <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,
       background:T.amber,color:'#000',display:'flex',alignItems:'center',
       justifyContent:'center',fontSize:9,fontWeight:900,marginTop:1}}>
       {n}
      </div>
      {t}
     </div>
    ))}
    <div style={{marginTop:8,padding:'8px 10px',background:T.bgCard,
     borderRadius:6,border:`1px solid ${T.border}`,
     fontSize:10,color:T.amberL,fontFamily:FM,lineHeight:1.6}}>
     ⚠ L'agenda doit être réglé sur "Accessible au public" pour que l'URL fonctionne
    </div>
   </div>

   <div style={card}>
    <Label>Option B — Fichier .ics</Label>
    <div style={{fontSize:12,color:T.creamDim,marginBottom:10,lineHeight:1.5}}>
     Dans Google Agenda → ⚙ Paramètres → Importer/Exporter → Exporter
    </div>
    <label style={{display:'flex',alignItems:'center',justifyContent:'center',
      width:'100%',minHeight:48,padding:'11px',boxSizing:'border-box',
      border:`1px solid ${T.border}`,borderRadius:6,cursor:'pointer',
      background:T.bgMid,color:T.cream,fontWeight:700,fontSize:14,gap:8}}>
     <input type="file" accept=".ics,text/calendar"
      style={{position:'absolute',opacity:0,pointerEvents:'none',width:0,height:0}}
      onChange={handleFile}/>
     📂 Choisir un fichier .ics
    </label>
   </div>

   {locations.filter(l=>l.icsUid).length>0&&(
    <div style={{...card,background:T.bgDark}}>
     <div style={{fontSize:11,color:T.creamDim,fontFamily:FM}}>
      📊 {locations.filter(l=>l.icsUid).length} location{locations.filter(l=>l.icsUid).length>1?'s':''} importées depuis Google Agenda
     </div>
    </div>
   )}
  </div>
 );
}

function ModuleTireuses({tireuses,setTireuses,locations,setLocations,stockCond,setStockCond,recettes}) {
 const [ongletT,setOngletT] = useState('planning');
 const [showForm,setShowForm] = useState(false);
 const [editLoc,setEditLoc]   = useState(null);
 const [selLoc, setSelLoc]    = useState(null);

 const actives    = locations.filter(l=>l.statut!=='retournée'&&l.statut!=='annulée');
 const dispos     = tireuses.filter(t=>!actives.some(l=>l.tireuses.includes(t.id))).length;
 const confirmees = locations.filter(l=>l.statut==='confirmée'||l.statut==='en cours').length;

 const openForm  = (loc=null) => { setEditLoc(loc); setShowForm(true); };
 const closeForm = ()         => { setShowForm(false); setEditLoc(null); };

 const handleSave = data => {
  const isNew = !editLoc;
  const loc   = {...data, id: editLoc?.id || Date.now()};
  if(isNew && (loc.statut==='confirmée'||loc.statut==='en cours'))
   setTireuses(prev => prev.map(t => loc.tireuses.includes(t.id) ? {...t,etat:'louée'} : t));
  setLocations(prev => isNew ? [loc,...prev] : prev.map(l => l.id===loc.id ? loc : l));
  closeForm();
 };

 const navT = [
  {id:'planning',  label:'Planning',  icon:'📅'},
  {id:'locations', label:'Locations', icon:'📋', badge:confirmees||null},
  {id:'parc',      label:'Parc',      icon:'🍻'},
  {id:'stats',     label:'Stats',     icon:'📊'},
  {id:'import',    label:'Agenda',    icon:'🔄'},
 ];

 return (
  <div style={{paddingBottom:80}}>
   <div style={{background:C.bgDark,padding:'10px 16px 0',position:'sticky',top:57,zIndex:50}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
     <div>
      <div style={{fontFamily:FA,fontSize:20,color:C.amberL,lineHeight:1}}>
       Tireuses
      </div>
      <div style={{fontFamily:FM,fontSize:10,color:C.textLight,marginTop:2}}>
       {dispos}/{tireuses.length} disponibles · {confirmees} en cours
      </div>
     </div>
     <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <button onClick={()=>exportICal(locations)}
       style={{background:'none',border:`1px solid ${C.border}`,borderRadius:8,
        padding:'6px 10px',fontSize:11,color:C.greenL,fontWeight:600,minHeight:36,
        fontFamily:"'DM Sans',sans-serif"}}>📥 .ics</button>
      <button onClick={()=>openForm()}
       style={{background:C.amber,color:'#fff',border:'none',borderRadius:8,
        padding:'8px 14px',fontWeight:700,fontSize:13,minHeight:40}}>
       + Location
      </button>
     </div>
    </div>
    <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:10,scrollbarWidth:'none'}}>
     {navT.map(n => {
      const act = ongletT === n.id;
      return (
       <button key={n.id} onClick={()=>setOngletT(n.id)}
        style={{flexShrink:0,padding:'6px 14px',borderRadius:20,
         border:`1.5px solid ${act?C.amber:C.border}`,
         background:act?C.amberPale:'transparent',
         color:act?C.amberL:C.textLight,
         fontFamily:"'DM Sans',sans-serif",fontWeight:act?700:400,
         fontSize:12,minHeight:34,whiteSpace:'nowrap',position:'relative'}}>
        {n.icon} {n.label}
        {n.badge != null && (
         <span style={{marginLeft:4,background:C.green,color:'#fff',
          borderRadius:8,padding:'1px 5px',fontSize:9,fontWeight:700}}>
          {n.badge}
         </span>
        )}
       </button>
      );
     })}
    </div>
   </div>

   <div style={{padding:'14px 16px'}}>
    {ongletT==='planning'  && <VuePlanning  tireuses={tireuses} locations={locations} onClickLoc={l=>{setSelLoc(l);setOngletT('locations');}}/>}
    {ongletT==='locations' && <VueLocations locations={locations} setLocations={setLocations} tireuses={tireuses} setTireuses={setTireuses} onEdit={openForm}/>}
    {ongletT==='parc'      && <VueParc      tireuses={tireuses} locations={locations}/>}
    {ongletT==='stats'     && <VueStats     locations={locations}/>}
    {ongletT==='import'    && <VueImport    locations={locations} setLocations={setLocations} onDone={()=>setOngletT('locations')}/>}
   </div>

   {showForm && (
    <ModalT onClose={closeForm} title={editLoc ? 'Modifier la location' : 'Nouvelle location 🍻'}>
     <FormLocationT
      editLoc={editLoc}
      tireuses={tireuses}
      recettes={recettes}
      onSave={handleSave}
      onCancel={closeForm}
     />
    </ModalT>
   )}
  </div>
 );
}

function ModulePlanification({brassins,setBrassins,condSessions,recettes,locations=[]}){
 const [vue,setVue]=useState('semaine'); // 'semaine' | 'mois' | 'liste'
 const [offset,setOffset]=useState(0);  // semaines ou mois de décalage
 const [showForm,setShowForm]=useState(false);
 const [formType,setFormType]=useState('brassage'); // 'brassage' | 'conditionnement'
 const [selEvent,setSelEvent]=useState(null);
 const today=new Date();
 const EF={recette:'',fermenteur:'',dateDebut:'',statut:'planifié',notes:'',type:'brassage',brassinRef:'',duree:1};
 const [form,setForm]=useState(EF);

 const events=[
  ...brassins.map(b=>({
   id:`b-${b.id}`, type:'brassage', titre:b.recette, date:b.dateDebut,
   dateFin:b.dateCond||null, statut:b.statut, fermenteur:b.fermenteur,
   color:({planifié:C.textLight,brassage:C.amber,fermentation:C.green,garde:"#2A6080",conditionnement:C.hop,terminé:C.border})[b.statut]||C.textMid,
   dot:STATUTS[b.statut]?.dot||'⬜', brassinId:b.id,
  })),
  ...condSessions.map(cs=>({
   id:`c-${cs.id}`, type:'conditionnement', titre:cs.brassinNom, date:cs.date,
   dateFin:null, statut:'conditionnement', fermenteur:cs.operateur||'—',
   color:C.hop, dot:'🍾', condId:cs.id,
   sub:`${cs.lots.map(l=>`${l.contenants} ${l.type}`).join(' + ')}`,
  })),
  ...(locations||[]).filter(l=>l.statut!=='annulée').map(l=>({
   id:`loc-${l.id}`, type:'location', titre:l.client, date:l.dateDebut,
   dateFin:l.dateFin, statut:l.statut, fermenteur:`${l.tireuses?.length||0} tireuse${(l.tireuses?.length||0)>1?'s':''}`,
   color:'#2A6080', dot:'🍻',
   sub:l.futs?.map(f=>f.biere+' '+f.nbFuts+'×'+f.typeFut).join(', '),
  })),
 ].filter(e=>e.date);

 const startOfMonth=d=>{const r=new Date(d);r.setDate(1);r.setHours(0,0,0,0);return r;};
 const isSameDay=(a,b)=>new Date(a).toDateString()===new Date(b).toDateString();
 const fmtJour=d=>new Date(d).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric'});
 const fmtMoisAnn=d=>new Date(d).toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
 const eventsOfDay=day=>events.filter(e=>isSameDay(e.date,day));

 const exportICal=()=>{
  const pad=n=>String(n).padStart(2,'0');
  const fmtICal=d=>{const dt=new Date(d);return `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}`;};
  const escape=s=>(s||'').replace(/[,;\\]/g,'\\$&').replace(/\n/g,'\\n');
  let ical="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Les Papas Brasseurs//Planning//FR\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:Les Papas Brasseurs\r\nX-WR-CALDESC:Planning de brassage et conditionnement\r\n";
  events.forEach(e=>{
   ical+=`BEGIN:VEVENT\r\nUID:${e.id}@papas-brasseurs\r\n`;
   ical+=`DTSTART;VALUE=DATE:${fmtICal(e.date)}\r\n`;
   if(e.dateFin)ical+=`DTEND;VALUE=DATE:${fmtICal(e.dateFin)}\r\n`;
   ical+=`SUMMARY:${escape(e.dot+' '+e.titre+(e.type==='conditionnement'?' (Conditionnement)':' ('+e.statut+')'))}\r\n`;
   const desc=e.type==='conditionnement'?`Conditionnement: ${e.sub}\nOpérateur: ${e.fermenteur}`:`Statut: ${e.statut}\nFermenteur: ${e.fermenteur}`;
   ical+=`DESCRIPTION:${escape(desc)}\r\nCATEGORIES:${e.type==='brassage'?'Brassage':'Conditionnement'}\r\nEND:VEVENT\r\n`;
  });
  ical+="END:VCALENDAR";
  const blob=new Blob([ical],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='papas-brasseurs-planning.ics';a.click();URL.revokeObjectURL(url);
 };

 const openGCal=(e)=>{
  const dt=new Date(e.date);const dtf=e.dateFin?new Date(e.dateFin):new Date(dt);
  if(!e.dateFin)dtf.setDate(dtf.getDate()+1);
  const pad=n=>String(n).padStart(2,'0');
  const fmt=d=>`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  const title=encodeURIComponent(`${e.dot} ${e.titre}${e.type==='conditionnement'?' (Conditionnement)':' ('+e.statut+')'}`);
  const details=encodeURIComponent(e.type==='conditionnement'?`Conditionnement\n${e.sub}\nOpérateur: ${e.fermenteur}`:`Fermenteur: ${e.fermenteur}\nStatut: ${e.statut}`);
  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(dt)}/${fmt(dtf)}&details=${details}&location=Clisson,France`,'_blank');
 };

 const saveForm=()=>{
  const newB={id:Date.now(),recette:form.recette,fermenteur:form.fermenteur,dateDebut:form.dateDebut,statut:form.statut,notes:form.notes,volume:0,og:null,fg:null,abv:null,dateCond:null,mesures:[]};
  setBrassins([...brassins,newB]);setShowForm(false);setForm(EF);
 };

 const weekStart=addDays(startOfWeek(today),offset*7);
 const weekDays=Array.from({length:7},(_,i)=>addDays(weekStart,i));

 const monthStart=new Date(today.getFullYear(),today.getMonth()+offset,1);
 const daysInMonth=new Date(monthStart.getFullYear(),monthStart.getMonth()+1,0).getDate();
 const firstDayDow=(monthStart.getDay()||7)-1;
 const monthDays=Array.from({length:daysInMonth},(_,i)=>new Date(monthStart.getFullYear(),monthStart.getMonth(),i+1));

 const listEvents=[...events].sort((a,b)=>new Date(a.date)-new Date(b.date));
 const futureEvents=listEvents.filter(e=>new Date(e.date)>=new Date(today.toDateString()));
 const pastEvents=listEvents.filter(e=>new Date(e.date)<new Date(today.toDateString())).reverse().slice(0,10);

 const EventChip=({e,compact})=>(
  <div onClick={()=>setSelEvent(e)} style={{display:'flex',alignItems:'center',gap:compact?4:6,padding:compact?'3px 6px':'7px 10px',borderRadius:8,background:`${e.color}20`,border:`1px solid ${e.color}40`,cursor:'pointer',marginBottom:compact?2:5}}>
   <span style={{fontSize:compact?11:14,flexShrink:0}}>{e.dot}</span>
   <div style={{flex:1,minWidth:0}}>
    <div style={{fontSize:compact?10:13,fontWeight:700,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.titre}</div>
    {!compact&&<div style={{fontSize:10,color:C.textLight,fontFamily:FM,marginTop:1}}>{e.fermenteur}{e.sub?` · ${e.sub}`:''}</div>}
   </div>
   {e.type==='conditionnement'&&<span style={{fontSize:9,color:C.hop,fontWeight:700,flexShrink:0}}>COND</span>}
  </div>
 );

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
    <div>
     <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',color:C.text}}>Planification</h2>
     <p style={{color:C.textLight,fontSize:12,fontFamily:FM,marginTop:2}}>{events.length} événements planifiés</p>
    </div>
    <div style={{display:'flex',gap:6}}>
     <button onClick={exportICal} title="Exporter iCal (.ics) – compatible Google Calendar, Apple Calendar, Outlook" style={{background:C.greenPale,border:`1px solid ${C.green}40`,borderRadius:10,padding:'8px 12px',fontSize:12,color:C.green,fontWeight:700,minHeight:40,display:'flex',alignItems:'center',gap:5}}>
      <span style={{fontSize:16}}>📅</span> .ics
     </button>
     <button onClick={()=>setShowForm(true)} style={{background:C.amber,color:'#fff',border:'none',borderRadius:10,padding:'8px 14px',fontWeight:700,fontSize:13,minHeight:40}}>+ Planifier</button>
    </div>
   </div>

   <div style={{background:C.greenPale,border:`1px solid ${C.green}30`,borderRadius:10,padding:'10px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10}}>
    <span style={{fontSize:20}}>📅</span>
    <div style={{fontSize:12,color:C.textMid,flex:1}}>
     <strong style={{color:C.text}}>Partager sur Google Agenda</strong><br/>
     Téléchargez le fichier .ics puis importez-le dans Google Calendar, ou cliquez sur un événement pour l'ajouter directement.
    </div>
   </div>

   <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:14,scrollbarWidth:'none'}}>
    {[['semaine','📅 Semaine'],['mois','🗓 Mois'],['liste','📋 Liste']].map(([v,l])=>(
     <button key={v} onClick={()=>{setVue(v);setOffset(0);}} style={{flexShrink:0,padding:'7px 14px',borderRadius:20,border:`1.5px solid ${vue===v?C.amber:C.border}`,background:vue===v?C.amberPale:C.bgCard,color:vue===v?C.amber:C.textMid,fontWeight:600,fontSize:13,minHeight:36,whiteSpace:'nowrap'}}>{l}</button>
    ))}
   </div>

   {vue==='semaine'&&(
    <div>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
      <button onClick={()=>setOffset(o=>o-1)} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 14px',fontSize:18,minHeight:40}}>‹</button>
      <div style={{textAlign:'center'}}>
       <div style={{fontFamily:FA,fontSize:15,color:C.text}}>{fmtJour(weekStart)} — {fmtJour(weekDays[6])}</div>
       {offset!==0&&<button onClick={()=>setOffset(0)} style={{background:'none',border:'none',fontSize:11,color:C.amber,cursor:'pointer',fontWeight:600}}>Aujourd'hui</button>}
      </div>
      <button onClick={()=>setOffset(o=>o+1)} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 14px',fontSize:18,minHeight:40}}>›</button>
     </div>
     <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {weekDays.map(day=>{
       const dayEvts=eventsOfDay(day);const isToday=isSameDay(day,today);
       return (
        <div key={day.toISOString()} style={{background:C.bgCard,border:`1.5px solid ${isToday?C.amber:C.border}`,borderRadius:12,overflow:'hidden'}}>
         <div style={{padding:'8px 12px',background:isToday?C.amberPale:C.cream,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontWeight:700,fontSize:13,color:isToday?C.amber:C.text,fontFamily:FM,textTransform:'capitalize'}}>{day.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</span>
          {isToday&&<span style={{fontSize:9,fontWeight:700,color:C.amber,background:C.amberPale,border:`1px solid ${C.amber}`,borderRadius:8,padding:'1px 7px'}}>AUJOURD'HUI</span>}
          {dayEvts.length===0&&<span style={{fontSize:11,color:C.textLight}}>—</span>}
         </div>
         {dayEvts.length>0&&<div style={{padding:'8px 10px'}}>{dayEvts.map(e=><EventChip key={e.id} e={e}/>)}</div>}
        </div>
       );
      })}
     </div>
    </div>
   )}

   {vue==='mois'&&(
    <div>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
      <button onClick={()=>setOffset(o=>o-1)} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 14px',fontSize:18,minHeight:40}}>‹</button>
      <div style={{textAlign:'center'}}>
       <div style={{fontFamily:FA,fontSize:15,color:C.text,textTransform:'capitalize'}}>{fmtMoisAnn(monthStart)}</div>
       {offset!==0&&<button onClick={()=>setOffset(0)} style={{background:'none',border:'none',fontSize:11,color:C.amber,cursor:'pointer',fontWeight:600}}>Ce mois</button>}
      </div>
      <button onClick={()=>setOffset(o=>o+1)} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 14px',fontSize:18,minHeight:40}}>›</button>
     </div>
     <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4}}>
      {['Lu','Ma','Me','Je','Ve','Sa','Di'].map(j=><div key={j} style={{textAlign:'center',fontSize:10,fontWeight:700,color:C.textLight,padding:'4px 0',fontFamily:FM}}>{j}</div>)}
     </div>
     <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
      {Array.from({length:firstDayDow}).map((_,i)=><div key={`e-${i}`}/>)}
      {monthDays.map(day=>{
       const dayEvts=eventsOfDay(day);const isToday=isSameDay(day,today);
       const hasBrassage=dayEvts.some(e=>e.type==='brassage');
       const hasCond=dayEvts.some(e=>e.type==='conditionnement');
       return (
        <div key={day.toISOString()} onClick={()=>dayEvts.length&&setSelEvent({multiDay:true,day,evts:dayEvts})} style={{minHeight:44,background:isToday?C.amberPale:C.bgCard,border:`1.5px solid ${isToday?C.amber:C.border}`,borderRadius:8,padding:'4px',cursor:dayEvts.length?'pointer':'default',position:'relative'}}>
         <div style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?C.amber:C.text,fontFamily:FM,marginBottom:2}}>{day.getDate()}</div>
         {dayEvts.length>0&&(
          <div style={{display:'flex',gap:2,flexWrap:'wrap'}}>
           {hasBrassage&&<div style={{width:8,height:8,borderRadius:'50%',background:C.amber}}/>}
           {hasCond&&<div style={{width:8,height:8,borderRadius:'50%',background:C.hop}}/>}
           {dayEvts.length>1&&<div style={{fontSize:8,color:C.textLight,fontFamily:FM,lineHeight:'8px'}}>+{dayEvts.length}</div>}
          </div>
         )}
        </div>
       );
      })}
     </div>
     <div style={{display:'flex',gap:14,marginTop:10,padding:'8px 12px',background:C.bgCard,borderRadius:10,border:`1px solid ${C.border}`}}>
      <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.textMid}}><div style={{width:10,height:10,borderRadius:'50%',background:C.amber}}/> Brassage</div>
      <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.textMid}}><div style={{width:10,height:10,borderRadius:'50%',background:C.hop}}/> Conditionnement</div>
     </div>
    </div>
   )}

   {vue==='liste'&&(
    <div>
     {futureEvents.length>0&&(
      <div style={{marginBottom:18}}>
       <div style={{fontSize:11,fontWeight:700,color:C.text,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>À venir</div>
       {futureEvents.map(e=>(
        <div key={e.id} onClick={()=>setSelEvent(e)} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'11px 12px',borderRadius:12,border:`1px solid ${C.border}`,background:C.bgCard,marginBottom:7,cursor:'pointer',borderLeft:`4px solid ${e.color}`}}>
         <div style={{flexShrink:0,textAlign:'center',minWidth:40}}>
          <div style={{fontFamily:FM,fontSize:18,fontWeight:700,color:e.color,lineHeight:1}}>{new Date(e.date).getDate()}</div>
          <div style={{fontFamily:FM,fontSize:9,color:C.textLight,textTransform:'capitalize'}}>{new Date(e.date).toLocaleDateString('fr-FR',{month:'short'})}</div>
         </div>
         <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:3}}>{e.dot} {e.titre}</div>
          <div style={{fontSize:11,color:C.textLight,fontFamily:FM}}>{e.fermenteur}{e.sub?` · ${e.sub}`:''}</div>
          {e.dateFin&&<div style={{fontSize:10,color:C.textMid,marginTop:2}}>→ Fin: {fmtDate(e.dateFin)}</div>}
         </div>
         <button onClick={ev=>{ev.stopPropagation();openGCal(e);}} title="Ajouter à Google Calendar" style={{background:C.greenPale,border:`1px solid ${C.green}30`,borderRadius:8,padding:'5px 8px',fontSize:11,color:C.green,fontWeight:700,flexShrink:0,minHeight:32}}>G+</button>
        </div>
       ))}
      </div>
     )}
     {pastEvents.length>0&&(
      <div>
       <div style={{fontSize:11,fontWeight:700,color:C.textLight,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Récents</div>
       {pastEvents.map(e=>(
        <div key={e.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,marginBottom:5,opacity:0.75}}>
         <span style={{fontSize:16}}>{e.dot}</span>
         <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:600,color:C.text,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.titre}</div>
          <div style={{fontSize:11,color:C.textLight,fontFamily:FM}}>{fmtDate(e.date)}</div>
         </div>
        </div>
       ))}
      </div>
     )}
     {events.length===0&&<div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}><div style={{fontSize:36,marginBottom:8}}>📅</div><p style={{fontSize:14}}>Aucun événement planifié</p></div>}
    </div>
   )}

   {selEvent&&!selEvent.multiDay&&(
    <Modal onClose={()=>setSelEvent(null)} wide>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
      <div>
       <div style={{fontSize:11,fontWeight:700,color:selEvent.color,textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{selEvent.type==='conditionnement'?'Conditionnement':'Brassage'} · {fmtDate(selEvent.date)}</div>
       <h3 style={{fontFamily:FA,fontSize:20,color:C.text}}>{selEvent.dot} {selEvent.titre}</h3>
      </div>
      <button onClick={()=>setSelEvent(null)} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:8,padding:'6px 12px',fontSize:16,color:C.textMid}}>✕</button>
     </div>
     {[['Fermenteur / Opérateur',selEvent.fermenteur],['Statut',selEvent.statut],['Date début',fmtDate(selEvent.date)],selEvent.dateFin&&['Date fin',fmtDate(selEvent.dateFin)],selEvent.sub&&['Conditionnement',selEvent.sub]].filter(Boolean).map(([l,v])=>(
      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:C.bg,borderRadius:8,marginBottom:5,fontSize:13}}>
       <span style={{color:C.textLight,fontSize:11,textTransform:'uppercase',fontWeight:700}}>{l}</span>
       <span style={{color:C.text}}>{v}</span>
      </div>
     ))}
     <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
      <button onClick={()=>openGCal(selEvent)} style={{flex:1,background:'#4285F4',color:'#fff',border:'none',borderRadius:10,padding:'11px 16px',fontWeight:700,fontSize:13,minHeight:44,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
       <span style={{fontSize:18}}>📅</span> Ajouter à Google Calendar
      </button>
      <button onClick={()=>{exportICal();}} style={{background:C.greenPale,border:`1px solid ${C.green}40`,borderRadius:10,padding:'11px 16px',fontWeight:700,fontSize:13,color:C.green,minHeight:44,display:'flex',alignItems:'center',gap:6}}>
       <span>📥</span> .ics
      </button>
     </div>
    </Modal>
   )}
   {selEvent?.multiDay&&(
    <Modal onClose={()=>setSelEvent(null)}>
     <div style={{fontFamily:FA,fontSize:18,color:C.text,marginBottom:14}}>
      {selEvent.day.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
     </div>
     {selEvent.evts.map(e=>(
      <div key={e.id} onClick={()=>setSelEvent(e)} style={{padding:'10px 12px',borderRadius:10,border:`1px solid ${e.color}40`,background:`${e.color}12`,marginBottom:8,cursor:'pointer'}}>
       <div style={{fontWeight:700,color:C.text,fontSize:14}}>{e.dot} {e.titre}</div>
       <div style={{fontSize:11,color:C.textLight,fontFamily:FM,marginTop:2}}>{e.fermenteur}{e.sub?` · ${e.sub}`:''}</div>
      </div>
     ))}
    </Modal>
   )}

   {showForm&&(
    <Modal onClose={()=>{setShowForm(false);setForm(EF);}} wide>
     <h3 style={{fontFamily:FA,fontSize:20,color:C.text,marginBottom:14}}>Planifier un événement</h3>
     <div style={{display:'flex',gap:8,marginBottom:14}}>
      {[['brassage','⚗️ Brassage'],['conditionnement','🍾 Conditionnement']].map(([t,l])=>(
       <button key={t} onClick={()=>setFormType(t)} style={{flex:1,padding:'9px',borderRadius:10,border:`1.5px solid ${formType===t?C.amber:C.border}`,background:formType===t?C.amberPale:C.bgCard,color:formType===t?C.amber:C.textMid,fontWeight:700,fontSize:13,minHeight:40}}>{l}</button>
      ))}
     </div>
     <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div><Label t="Recette / Bière"/><select value={form.recette} onChange={e=>setForm({...form,recette:e.target.value})} style={iSt}><option value="">— Choisir —</option>{recettes.map(r=><option key={r.id} value={r.nom}>{r.nom}</option>)}<option value="Autre">Autre…</option></select></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
       <div><Label t="Date"/><input type="date" value={form.dateDebut} onChange={e=>setForm({...form,dateDebut:e.target.value})} style={iSt}/></div>
       {formType==='brassage'
        ?<div><Label t="Fermenteur"/><input value={form.fermenteur} onChange={e=>setForm({...form,fermenteur:e.target.value})} placeholder="FV-01" style={iSt}/></div>
        :<div><Label t="Opérateur"/><input value={form.fermenteur} onChange={e=>setForm({...form,fermenteur:e.target.value})} placeholder="Prénom" style={iSt}/></div>
       }
       {formType==='brassage'&&<div style={{gridColumn:'1/-1'}}><Label t="Statut initial"/><select value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})} style={iSt}>{Object.entries(STATUTS).map(([k,s])=><option key={k} value={k}>{s.label}</option>)}</select></div>}
      </div>
      <div><Label t="Notes"/><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{...iSt,height:60,resize:'none'}}/></div>
     </div>
     <div style={{display:'flex',gap:10,marginTop:16,justifyContent:'flex-end'}}>
      <Btn onClick={()=>{setShowForm(false);setForm(EF);}}>Annuler</Btn>
      <Btn p onClick={saveForm}>Planifier</Btn>
     </div>
    </Modal>
   )}
  </div>
 );
}

function ModuleStockPF({condSessions,recettes,stockCond,stockPF,setStockPF}){
 const [view,setView]   = useState('stock');   // 'stock' | 'valorisation'
 const [filtre,setFiltre] = useState('Tous');   // bière ou 'Tous'
 const [q,setQ]           = useState('');
 const [editLot,setEditLot] = useState(null);   // lot en cours d'édition
 const [adjVal,setAdjVal]   = useState('');     // valeur d'ajustement

 const pCond = calcPrixCond(stockCond);
 const fmtKey = {'Bouteille 33cl':'b33','Bouteille 75cl':'b75','Fût 20L':'f20','Fût 30L':'f30'};
 const fmtVol = {'Bouteille 33cl':0.33,'Bouteille 75cl':0.75,'Fût 20L':20,'Fût 30L':30};

 const recetteFor = brassinNom => recettes.find(r=>
  brassinNom.includes(r.nom)||r.nom===brassinNom.split(' (')[0]
 );

 const coutMatL = rec => {
 if(!rec) return 0;
 return 0;
};

 const coutRevientLot = (brassinNom, type) => {
  const rec = recetteFor(brassinNom);
  const pk  = fmtKey[type];
  if(!rec||!pk) return 0;
  return pCond[type]||0;
 };

 const prixVente = (brassinNom, type) => {
  const rec = recetteFor(brassinNom);
  const pk  = fmtKey[type];
  return rec?.prix?.[pk] || 0;
 };

 const initFromSessions = () => {
  const lines = [];
  condSessions.forEach(cs=>{
   cs.lots.forEach(lot=>{
    const exist = stockPF.find(x=>x.lotId===`${cs.id}-${lot.lot}`);
    if(!exist){
     lines.push({
      id:         `${cs.id}-${lot.lot}`,
      lotId:      `${cs.id}-${lot.lot}`,
      brassinNom: cs.brassinNom,
      type:       lot.type,
      lot:        lot.lot,
      dateCond:   cs.date,
      qteInit:    lot.contenants,
      qteDispo:   lot.contenants,
      sorties:    [],
     });
    }
   });
  });
  if(lines.length) setStockPF(prev=>[...prev,...lines]);
 };

 const allLots = (() => {
  const map = {};
  stockPF.forEach(x=>{ map[x.lotId]=x; });
  const result = [];
  condSessions.forEach(cs=>{
   cs.lots.forEach(lot=>{
    const key  = `${cs.id}-${lot.lot}`;
    const saved = map[key];
    result.push(saved || {
     id:key,lotId:key,brassinNom:cs.brassinNom,
     type:lot.type,lot:lot.lot,dateCond:cs.date,
     qteInit:lot.contenants,qteDispo:lot.contenants,sorties:[],
    });
   });
  });
  return result;
 })();

 const bieres = ['Tous',...new Set(allLots.map(x=>x.brassinNom))];
 const filtered = allLots.filter(x=>
  (filtre==='Tous'||x.brassinNom===filtre)&&
  (x.brassinNom+' '+x.type+' '+x.lot).toLowerCase().includes(q.toLowerCase())
 );

 const kpis = (() => {
  let qte=0, ca=0, cout=0, vendu=0;
  allLots.forEach(lot=>{
   const pv = prixVente(lot.brassinNom, lot.type);
   const cr = pCond[lot.type]||0;
   qte    += lot.qteDispo;
   vendu  += (lot.qteInit-lot.qteDispo);
   ca     += lot.qteDispo * pv;
   cout   += lot.qteInit  * cr;
  });
  return {qte,ca,cout,vendu,marge:ca>0?Math.round((ca-cout)/ca*100):0};
 })();

 const appliquerSortie = (lot, qte, motif) => {
  const n = parseInt(qte)||0;
  if(n<=0||n>lot.qteDispo) return;
  const sortie = {date:new Date().toISOString().split('T')[0],qte:n,motif:motif||'Vente'};
  setStockPF(prev=>prev.map(x=>
   x.lotId===lot.lotId
    ? {...x, qteDispo:x.qteDispo-n, sorties:[...(x.sorties||[]),sortie]}
    : x
  ).concat(prev.find(x=>x.lotId===lot.lotId)?[]:[{...lot,qteDispo:lot.qteDispo-n,sorties:[sortie]}])
  );
  setEditLot(null); setAdjVal('');
 };

 const couleurType = t => ({
  'Bouteille 33cl':'#2A6080','Bouteille 75cl':'#4A6741',
  'Fût 20L':C.amber,'Fût 30L':C.brick,
 }[t]||C.textMid);

 const iconeType = t => ({'Bouteille 33cl':'🍺','Bouteille 75cl':'🍾','Fût 20L':'🛢','Fût 30L':'🛢'}[t]||'📦');

 const PctBar = ({val,max,color}) => (
  <div style={{height:4,background:C.border,borderRadius:2,overflow:'hidden',marginTop:3}}>
   <div style={{height:'100%',borderRadius:2,background:color,
    width:`${max>0?Math.min(100,val/max*100):0}%`,transition:'width 0.3s'}}/>
  </div>
 );

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{marginBottom:14}}>
    <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',color:C.text}}>
     Produits finis
    </h2>
    <p style={{fontSize:12,color:C.textLight,marginTop:2}}>
     Stock issu du conditionnement · valorisation temps réel
    </p>
   </div>

   <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:16}}>
    {[
     {label:'En stock',     val:kpis.qte.toLocaleString('fr'),  icon:'📦', color:C.amber,  sub:`${kpis.vendu.toLocaleString('fr')} vendus`},
     {label:'Valeur stock', val:`${kpis.ca.toLocaleString('fr')}€`, icon:'💰', color:C.ok, sub:`au prix de vente`},
     {label:'Coût embal.',  val:`${kpis.cout.toLocaleString('fr')}€`,icon:'🏷', color:C.hop,  sub:`emballage seul`},
     {label:'Marge brute',  val:`${kpis.marge}%`,               icon:'📈', color:kpis.marge>=55?C.ok:kpis.marge>=40?C.warn:C.alert, sub:`sur prix vente`},
    ].map(({label,val,icon,color,sub})=>(
     <div key={label} style={{background:C.bgCard,borderRadius:12,padding:'12px 14px',
      border:`1px solid ${C.border}`,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:3,
       background:color}}/>
      <div style={{fontSize:18,marginBottom:3}}>{icon}</div>
      <div style={{fontFamily:FA,
       fontSize:'clamp(18px,4vw,24px)',color,lineHeight:1}}>{val}</div>
      <div style={{fontSize:10,color:C.textLight,textTransform:'uppercase',
       letterSpacing:1,marginTop:3}}>{label}</div>
      <div style={{fontSize:11,color:C.textMid,marginTop:2}}>{sub}</div>
     </div>
    ))}
   </div>

   <div style={{display:'flex',gap:8,marginBottom:14}}>
    {[['stock','📋 Lots & stock'],['valorisation','📊 Valorisation']].map(([v,l])=>(
     <button key={v} onClick={()=>setView(v)}
      style={{flexShrink:0,padding:'8px 14px',borderRadius:20,
       border:`1.5px solid ${view===v?C.amber:C.border}`,
       background:view===v?C.amberPale:C.bgCard,
       color:view===v?C.amber:C.textMid,fontWeight:600,fontSize:13,minHeight:40}}>
      {l}
     </button>
    ))}
   </div>

   <SearchBar value={q} onChange={setQ} placeholder="Bière, lot, format…"/>
   <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:6,
    marginBottom:14,scrollbarWidth:'none'}}>
    {bieres.map(b=>(
     <button key={b} onClick={()=>setFiltre(b)}
      style={{flexShrink:0,padding:'5px 12px',borderRadius:20,whiteSpace:'nowrap',
       border:`1.5px solid ${filtre===b?C.amber:C.border}`,
       background:filtre===b?C.amberPale:C.bgCard,
       color:filtre===b?C.amber:C.textMid,fontSize:12,fontWeight:600,minHeight:32}}>
      {b}
     </button>
    ))}
   </div>

   {filtered.length===0&&(
    <div style={{textAlign:'center',padding:'60px 20px',color:C.textLight}}>
     <div style={{fontSize:40,marginBottom:10}}>🍾</div>
     <div style={{fontWeight:600,marginBottom:6}}>Aucun lot conditionné</div>
     <div style={{fontSize:12}}>Les lots apparaissent après une session de conditionnement</div>
    </div>
   )}

   {view==='stock'&&filtered.map(lot=>{
    const pv   = prixVente(lot.brassinNom, lot.type);
    const cr   = pCond[lot.type]||0;
    const pct  = lot.qteInit>0 ? lot.qteDispo/lot.qteInit : 0;
    const col  = couleurType(lot.type);
    const isEd = editLot?.lotId===lot.lotId;

    return (
     <div key={lot.lotId}
      style={{background:C.bgCard,border:`1.5px solid ${isEd?C.amber:C.border}`,
       borderRadius:14,marginBottom:10,overflow:'hidden',
       borderLeft:`4px solid ${col}`}}>
      <div style={{padding:'12px 14px'}}>
       <div style={{display:'flex',justifyContent:'space-between',
        alignItems:'flex-start',marginBottom:8}}>
        <div style={{flex:1,minWidth:0}}>
         <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
          <span style={{fontSize:16}}>{iconeType(lot.type)}</span>
          <span style={{fontFamily:FA,fontSize:16,
           color:C.text,overflow:'hidden',textOverflow:'ellipsis',
           whiteSpace:'nowrap'}}>{lot.brassinNom}</span>
         </div>
         <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <Tag text={lot.type} color={col} bg={`${col}15`}/>
          <span style={{fontFamily:FM,fontSize:10,
           color:C.textLight}}>{lot.lot}</span>
          <span style={{fontFamily:FM,fontSize:10,
           color:C.textLight}}>{fmtDate(lot.dateCond)}</span>
         </div>
        </div>
        <div style={{textAlign:'right',flexShrink:0,marginLeft:10}}>
         <div style={{fontFamily:FA,fontSize:22,
          color:lot.qteDispo>0?C.amber:C.textLight,lineHeight:1}}>
          {lot.qteDispo.toLocaleString('fr')}
         </div>
         <div style={{fontSize:10,color:C.textLight}}>
          / {lot.qteInit.toLocaleString('fr')} {lot.type.includes('Fût')?'fûts':'btl'}
         </div>
        </div>
       </div>

       <PctBar val={lot.qteDispo} max={lot.qteInit}
        color={pct>0.5?C.ok:pct>0.2?C.warn:C.alert}/>

       <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
        gap:8,marginTop:10}}>
        {[
         ['Prix vente', pv>0?`${pv}€`:'—', C.amber],
         ['Coût embal.',cr>0?`${cr.toFixed(2)}€`:'—', C.hop],
         ['Valeur dispo', pv>0?(lot.qteDispo*pv).toLocaleString('fr')+'€':'—', C.ok],
        ].map(([l,v,col])=>(
         <div key={l} style={{background:C.bg,borderRadius:8,padding:'6px 8px',
          textAlign:'center',border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:FM,fontWeight:700,
           fontSize:13,color:col}}>{v}</div>
          <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',
           letterSpacing:0.8,marginTop:1}}>{l}</div>
         </div>
        ))}
       </div>

       {(lot.sorties||[]).length>0&&(
        <div style={{marginTop:8,padding:'6px 10px',borderRadius:8,
         background:C.bg,border:`1px solid ${C.border}`}}>
         <div style={{fontSize:10,fontWeight:700,color:C.textLight,
          textTransform:'uppercase',letterSpacing:0.8,marginBottom:4}}>
          Sorties
         </div>
         {[...(lot.sorties||[])].reverse().slice(0,3).map((s,i)=>(
          <div key={`k${i}`} style={{display:'flex',justifyContent:'space-between',
           fontSize:11,color:C.textMid,marginBottom:2}}>
           <span>{fmtDate(s.date)} — {s.motif}</span>
           <span style={{fontFamily:FM,fontWeight:700,
            color:C.alert}}>-{s.qte}</span>
          </div>
         ))}
        </div>
       )}

       {isEd?(
        <div style={{marginTop:10,padding:'10px 12px',borderRadius:10,
         background:C.amberPale,border:`1px solid ${C.amber}40`}}>
         <div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:8,
          textTransform:'uppercase',letterSpacing:0.8}}>
          Enregistrer une sortie
         </div>
         <div style={{display:'flex',gap:8,marginBottom:8}}>
          <input type="number" min="1" max={lot.qteDispo}
           value={adjVal} placeholder={`Qté (max ${lot.qteDispo})`}
           onChange={e=>setAdjVal(e.target.value)}
           style={{...iSt,flex:1,fontSize:14}}/>
         </div>
         <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
          {['Vente directe','Vente CHR','Événement','Dégustation','Casse/Perte'].map(m=>(
           <button key={m} onClick={()=>appliquerSortie(lot,adjVal,m)}
            style={{padding:'5px 10px',borderRadius:8,fontSize:11,fontWeight:600,
             border:`1px solid ${C.amber}40`,background:C.bgCard,color:C.amber,
             minHeight:32}}>
            {m}
           </button>
          ))}
         </div>
         <button onClick={()=>{setEditLot(null);setAdjVal('');}}
          style={{fontSize:12,color:C.textLight,background:'none',
           border:'none',textDecoration:'underline'}}>
          Annuler
         </button>
        </div>
       ):(
        <button onClick={()=>setEditLot(lot)}
         style={{marginTop:10,width:'100%',padding:'7px',borderRadius:8,
          border:`1.5px dashed ${C.amber}60`,background:'transparent',
          color:C.amber,fontSize:12,fontWeight:600,minHeight:36}}>
         − Enregistrer une sortie
        </button>
       )}
      </div>
     </div>
    );
   })}

   {view==='valorisation'&&(()=>{
    const groupes = {};
    filtered.forEach(lot=>{
     const key = `${lot.brassinNom}||${lot.type}`;
     if(!groupes[key]) groupes[key]={
      brassinNom:lot.brassinNom, type:lot.type,
      qteInit:0, qteDispo:0, lots:[],
     };
     groupes[key].qteInit  += lot.qteInit;
     groupes[key].qteDispo += lot.qteDispo;
     groupes[key].lots.push(lot);
    });

    const lignes = Object.values(groupes).map(g=>{
     const pv = prixVente(g.brassinNom, g.type);
     const cr = pCond[g.type]||0;
     const vol= fmtVol[g.type]||0;
     return {
      ...g,
      pv, cr,
      valDispo:  g.qteDispo * pv,
      valInit:   g.qteInit  * pv,
      coutInit:  g.qteInit  * cr,
      coutDispo: g.qteDispo * cr,
      marge:     pv>0?Math.round((pv-cr)/pv*100):null,
      vendu:     g.qteInit-g.qteDispo,
      caVendu:   (g.qteInit-g.qteDispo)*pv,
     };
    });

    const totCA    = lignes.reduce((s,l)=>s+l.valDispo,0);
    const totCout  = lignes.reduce((s,l)=>s+l.coutDispo,0);
    const totVendu = lignes.reduce((s,l)=>s+l.caVendu,0);

    return (
     <div>
      <div style={{background:C.bgCard,borderRadius:14,padding:'14px 16px',
       marginBottom:16,border:`1px solid ${C.border}`}}>
       <div style={{fontFamily:FA,fontSize:16,
        color:C.text,marginBottom:12}}>Récapitulatif financier</div>
       {[
        ['CA généré (vendu)',    `${totVendu.toLocaleString('fr')}€`,   C.ok],
        ['Valeur stock restant', `${totCA.toLocaleString('fr')}€`,      C.amber],
        ['Coût emballage stock', `${totCout.toLocaleString('fr')}€`,    C.hop],
        ['Marge brute stock',    totCA>0?`${Math.round((totCA-totCout)/totCA*100)}%`:'—', C.ok],
       ].map(([l,v,col])=>(
        <div key={l} style={{display:'flex',justifyContent:'space-between',
         alignItems:'center',padding:'8px 10px',borderRadius:8,
         background:C.bg,marginBottom:6,border:`1px solid ${C.border}`}}>
         <span style={{fontSize:13,color:C.textMid}}>{l}</span>
         <span style={{fontFamily:FM,fontWeight:700,
          fontSize:15,color:col}}>{v}</span>
        </div>
       ))}
       <div style={{marginTop:8,padding:'8px 12px',borderRadius:8,
        background:C.greenPale,border:`1px solid ${C.green}30`,
        fontSize:11,color:C.textLight,lineHeight:1.5}}>
        💡 <strong style={{color:C.text}}>Note :</strong> la marge inclut l'emballage.
        Le coût de brassage (matières premières) est visible dans l'onglet Recettes.
       </div>
      </div>

      {lignes.map(l=>{
       const col = couleurType(l.type);
       return (
        <div key={`${l.brassinNom}-${l.type}`}
         style={{background:C.bgCard,borderRadius:12,padding:'12px 14px',
          marginBottom:10,border:`1px solid ${C.border}`,
          borderLeft:`4px solid ${col}`}}>
         <div style={{display:'flex',justifyContent:'space-between',
          alignItems:'flex-start',marginBottom:10}}>
          <div>
           <div style={{fontFamily:FA,
            fontSize:16,color:C.text,marginBottom:3}}>{l.brassinNom}</div>
           <Tag text={l.type} color={col} bg={`${col}15`}/>
          </div>
          {l.marge!=null&&(
           <div style={{textAlign:'center',background:l.marge>=55?C.greenPale:l.marge>=40?C.amberPale:C.brickPale,
            borderRadius:8,padding:'4px 10px',
            border:`1px solid ${l.marge>=55?C.green:l.marge>=40?C.amber:C.brick}30`}}>
            <div style={{fontFamily:FM,fontWeight:700,fontSize:18,
             color:l.marge>=55?C.ok:l.marge>=40?C.amber:C.alert}}>{l.marge}%</div>
            <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',
             letterSpacing:0.8}}>marge</div>
           </div>
          )}
         </div>

         <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:8}}>
          {[
           ['Initial conditionné', l.qteInit.toLocaleString('fr'), C.textMid],
           ['Encore disponible',   l.qteDispo.toLocaleString('fr'), l.qteDispo>0?C.amber:C.textLight],
           ['Vendus/sortis',        l.vendu.toLocaleString('fr'),    C.ok],
           ['CA sorties',           l.caVendu>0?`${l.caVendu.toLocaleString('fr')}€`:'—', C.ok],
          ].map(([lab,val,color])=>(
           <div key={lab} style={{background:C.bg,borderRadius:8,
            padding:'8px 10px',border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:FM,fontWeight:700,
             fontSize:15,color}}>{val}</div>
            <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',
             letterSpacing:0.8,marginTop:2}}>{lab}</div>
           </div>
          ))}
         </div>

         <div style={{display:'flex',gap:10,fontSize:12,
          color:C.textMid,flexWrap:'wrap',padding:'6px 8px',
          background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
          <span>Prix vente : <strong style={{color:C.amber,fontFamily:FM}}>
           {l.pv>0?`${l.pv}€`:'—'}</strong></span>
          <span>Coût embal. : <strong style={{color:C.hop,fontFamily:FM}}>
           {l.cr>0?`${l.cr.toFixed(2)}€`:'—'}</strong></span>
          <span>Stock : <strong style={{color:C.amber,fontFamily:FM}}>
           {l.valDispo>0?`${l.valDispo.toLocaleString('fr')}€`:'—'}</strong></span>
         </div>

         {l.qteInit>0&&(
          <div style={{marginTop:8}}>
           <div style={{display:'flex',justifyContent:'space-between',
            fontSize:10,color:C.textLight,marginBottom:2}}>
            <span>Écoulement</span>
            <span style={{fontFamily:FM}}>
             {Math.round((l.qteInit-l.qteDispo)/l.qteInit*100)}%
            </span>
           </div>
           <PctBar val={l.qteInit-l.qteDispo} max={l.qteInit} color={C.ok}/>
          </div>
         )}
        </div>
       );
      })}
     </div>
    );
   })()}
  </div>
 );
}

const BEER_IMAGES = {};  // Images retirées pour performance
const FERM_JOURS = {
 "L'Impèrtinente":22,"La Pèrchée":25,"La Pèrilleuse":17,"La Pèrlimpinpin":21,
 "La Supère":26,"La Blonde des Papas":20,"La Mèrveilleuse":29,"La Mèrlimpinpin":22,
 "La Mary'Stout":28,"La Mamagascar":26,"La Papa Poule":59,"Farmère":35,
 "La Mèrcure":24,"Single Hop Idaho7":20,
};

function ModuleCatalogue({recettes,setRecettes,brassins,stockPF,condSessions}){
 const [sel,setSel]             = useState(null);
 const [selIdx,setSelIdx]       = useState(0);
 const [filtre,setFiltre]       = useState('Toutes');
 const [uploadRec,setUploadRec] = useState(null);
 const [hoverId,setHoverId]     = useState(null);
 const fileRef                  = useRef();

 const SRM = s =>
  s<=3?'#F0D060':s<=6?'#D4A820':s<=10?'#B87810':s<=16?'#A05808'
  :s<=22?'#7A3A06':s<=30?'#501A04':'#2A0A02';

 const filtered = recettes.filter(r =>
  filtre==='Toutes'||(filtre==='Permanentes'?r.permanent:!r.permanent)
 );

 const getImg = r => r.imageUrl || BEER_IMAGES[r.nom] || null;

 const stockBiere = nom => {
  const all = [];
  condSessions.forEach(cs => {
   if(cs.brassinNom===nom||cs.brassinNom.includes(nom.split(' ')[1]||nom)){
    cs.lots.forEach(l => {
     const pf=(stockPF||[]).find(x=>x.lotId===`${cs.id}-${l.lot}`);
     all.push({type:l.type,dispo:pf?pf.qteDispo:l.contenants});
    });
   }
  });
  return all;
 };

 const dernierBrassin = nom =>
  [...brassins].filter(b=>b.recette===nom).sort((a,b)=>b.id-a.id)[0];
 const amerCol = ibu => ibu<20?C.greenL:ibu<40?C.warn:ibu<60?C.amber:C.alert;

 const handleUpload = e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
   setRecettes(prev=>prev.map(r=>r.id===uploadRec?{...r,imageUrl:ev.target.result}:r));
   setSel(prev=>prev?.id===uploadRec?{...prev,imageUrl:ev.target.result}:prev);
   setUploadRec(null);
  };
  reader.readAsDataURL(file);
 };

 const navModal = dir => {
  const i = (selIdx+dir+filtered.length)%filtered.length;
  setSelIdx(i); setSel(filtered[i]);
 };
 const openRec = (r,i) => { setSel(r); setSelIdx(i); };

 return (
  <div style={{paddingBottom:80,background:C.bg,minHeight:'100vh'}}>
   <input ref={fileRef} type="file" accept="image/*"
    style={{display:'none'}} onChange={handleUpload}/>

   <div style={{background:C.bgDark,padding:'20px 16px 0',
    borderBottom:`1px solid ${C.border}`}}>
    <div style={{display:'flex',alignItems:'flex-end',
     justifyContent:'space-between',marginBottom:16}}>
     <div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",
       fontSize:38,color:C.amber,lineHeight:0.9,letterSpacing:2}}>
       NOS BIÈRES
      </div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",
       fontSize:38,color:C.cream,lineHeight:0.9,letterSpacing:2}}>
       ARTISANALES
      </div>
      <div style={{fontFamily:FM,
       fontSize:9,color:C.textLight,letterSpacing:3,marginTop:6,
       textTransform:'uppercase'}}>
       Brasserie · Clisson 44 · 🌿 Certifié Bio
      </div>
     </div>
     <img src="https://static.wixstatic.com/media/6083cc_b88b212595ea479f8951c9804107e28e~mv2.png"
      style={{width:52,height:52,objectFit:'contain',opacity:0.9,
       filter:'brightness(1.1)'}}
      onError={e=>e.target.style.display='none'}/>
    </div>

    <div style={{display:'flex',gap:6,paddingBottom:14}}>
     {[['Toutes',filtered.length],
      ['Permanentes',recettes.filter(r=>r.permanent).length],
      ['Éphémères',recettes.filter(r=>!r.permanent).length]
     ].map(([f,n])=>(
      <button key={f} onClick={()=>setFiltre(f)}
       style={{padding:'5px 14px',borderRadius:4,fontSize:11,fontWeight:700,
        letterSpacing:0.5,textTransform:'uppercase',
        border:`1px solid ${filtre===f?C.amber:C.border}`,
        background:filtre===f?C.amber:'transparent',
        color:filtre===f?C.bgDark:C.textMid,minHeight:32,
        fontFamily:FM,
        transition:'all 0.15s'}}>
       {f} <span style={{opacity:0.7,fontSize:9}}>({n})</span>
      </button>
     ))}
    </div>
   </div>

   <div style={{padding:'0'}}>

    {filtered.length>0&&(()=>{
     const r      = filtered[0];
     const img    = getImg(r);
     const srm    = SRM(r.srm);
     const stock  = stockBiere(r.nom);
     const dispo  = stock.reduce((s,x)=>s+x.dispo,0);
     const px     = r.prix||{};
     return (
      <div key={r.id} onClick={()=>openRec(r,0)}
       onMouseEnter={()=>setHoverId(r.id)}
       onMouseLeave={()=>setHoverId(null)}
       style={{position:'relative',height:260,overflow:'hidden',
        cursor:'pointer',borderBottom:`1px solid ${C.border}`}}>

       {img&&(
        <img src={img}
         style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',
          objectFit:'cover',objectPosition:'left center',
          transform:hoverId===r.id?'scale(1.03)':'scale(1)',
          transition:'transform 0.4s ease',
          filter:'brightness(0.55)'}}
         onError={e=>e.target.style.display='none'}/>
       )}
       {!img&&(
        <div style={{position:'absolute',inset:0,background:C.bgCard,
         display:'flex',alignItems:'center',justifyContent:'center'}}>
         <span style={{fontSize:60,opacity:0.2}}>🍺</span>
        </div>
       )}

       <div style={{position:'absolute',inset:0,
        background:'linear-gradient(90deg,rgba(13,11,9,0.0) 0%,rgba(13,11,9,0.85) 58%,rgba(13,11,9,0.96) 100%)'}}/>

       <div style={{position:'absolute',left:0,top:0,bottom:0,
        width:4,background:srm}}/>

       <div style={{position:'absolute',right:0,top:0,bottom:0,
        width:'58%',display:'flex',flexDirection:'column',
        justifyContent:'center',padding:'20px 20px 20px 12px'}}>
        <div style={{fontFamily:FM,fontSize:8,
         letterSpacing:3,color:srm,textTransform:'uppercase',marginBottom:6}}>
         {r.style} · {r.permanent?'Permanente':'Éphémère'}
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",
         fontSize:32,color:C.cream,lineHeight:0.95,letterSpacing:1,
         marginBottom:10}}>
         {r.nom}
        </div>
        <p style={{fontSize:11,color:C.textMid,lineHeight:1.5,
         marginBottom:12,display:'-webkit-box',WebkitLineClamp:2,
         WebkitBoxOrient:'vertical',overflow:'hidden'}}>
         {r.description}
        </p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
         {[
          [`${r.abv}%`,C.amber],
          [`IBU ${r.ibu}`,amerCol(r.ibu)],
          ...(px.b33?[`${px.b33}€ / 33cl`,C.cream]:[]),
         ].map(([v,col],i)=>(
          <span key={`k${i}`} style={{fontFamily:FM,
           fontSize:10,fontWeight:700,color:col,
           background:'rgba(0,0,0,0.4)',
           padding:'3px 8px',borderRadius:4,
           border:`1px solid ${col}30`}}>{v}</span>
         ))}
        </div>
        {dispo>0&&<div style={{fontFamily:FM,
         fontSize:9,color:C.greenL,letterSpacing:1}}>
         ● {dispo.toLocaleString('fr')} disponibles
        </div>}
       </div>

       <div style={{position:'absolute',bottom:16,right:20,
        fontFamily:"'Bebas Neue',sans-serif",fontSize:22,
        color:C.amber,opacity:hoverId===r.id?1:0.5,
        transition:'opacity 0.2s'}}>→</div>
      </div>
     );
    })()}

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,
     background:C.border}}>
     {filtered.slice(1).map((r,i)=>{
      const img   = getImg(r);
      const srm   = SRM(r.srm);
      const stock = stockBiere(r.nom);
      const dispo = stock.reduce((s,x)=>s+x.dispo,0);
      const dernier = dernierBrassin(r.nom);
      const px = r.prix||{};
      const enBrassage = dernier&&dernier.statut!=='terminé';
      const isHov = hoverId===r.id;

      return (
       <div key={r.id} onClick={()=>openRec(r,i+1)}
        onMouseEnter={()=>setHoverId(r.id)}
        onMouseLeave={()=>setHoverId(null)}
        style={{position:'relative',height:220,overflow:'hidden',
         cursor:'pointer',background:C.bgCard}}>

        {img&&(
         <img src={img}
          style={{position:'absolute',top:0,left:0,
           width:'100%',height:'100%',
           objectFit:'cover',objectPosition:'left center',
           transform:isHov?'scale(1.05)':'scale(1)',
           transition:'transform 0.35s ease',
           filter:'brightness(0.45)'}}
          onError={e=>e.target.style.display='none'}/>
        )}
        {!img&&(
         <div style={{position:'absolute',inset:0,
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:44,opacity:0.12}}>🍺</span>
         </div>
        )}

        <div style={{position:'absolute',inset:0,
         background:'linear-gradient(0deg,rgba(13,11,9,0.97) 0%,rgba(13,11,9,0.5) 50%,rgba(13,11,9,0.0) 100%)'}}/>

        <div style={{position:'absolute',top:0,left:0,right:0,
         height:3,background:srm}}/>

        <div style={{position:'absolute',bottom:0,left:0,right:0,
         padding:'12px'}}>
         <div style={{fontFamily:FM,fontSize:7,
          letterSpacing:2,color:srm,textTransform:'uppercase',
          marginBottom:3}}>{r.style}</div>
         <div style={{fontFamily:"'Bebas Neue',sans-serif",
          fontSize:20,color:C.cream,lineHeight:0.95,
          letterSpacing:0.5,marginBottom:6}}>{r.nom}</div>
         <div style={{display:'flex',gap:5,alignItems:'center',
          flexWrap:'wrap'}}>
          <span style={{fontFamily:FM,
           fontSize:9,fontWeight:700,color:C.amber}}>
           {r.abv}%
          </span>
          <span style={{color:C.border,fontSize:8}}>·</span>
          <span style={{fontFamily:FM,
           fontSize:9,color:amerCol(r.ibu)}}>
           IBU {r.ibu}
          </span>
          {px.b33&&<>
           <span style={{color:C.border,fontSize:8}}>·</span>
           <span style={{fontFamily:FM,
            fontSize:9,color:C.textMid}}>{px.b33}€</span>
          </>}
         </div>
         <div style={{marginTop:5,fontFamily:FM,
          fontSize:8,letterSpacing:0.5,
          color:dispo>0?C.greenL:enBrassage?C.amber:C.textLight}}>
          {dispo>0?`● ${dispo.toLocaleString('fr')} dispo`
           :enBrassage?'⚗ En brassage':''}
         </div>
        </div>

        <div style={{position:'absolute',top:10,right:10,
         fontFamily:FM,fontSize:7,fontWeight:700,
         color:r.permanent?C.amber:C.hop,letterSpacing:1,
         textTransform:'uppercase'}}>
         {r.permanent?'★ PERM.':'◇ ÉPHÉM.'}
        </div>
       </div>
      );
     })}
    </div>
   </div>

   {sel&&(()=>{
    const r       = recettes.find(x=>x.id===sel.id)||sel;
    const img     = getImg(r);
    const srm     = SRM(r.srm);
    const stock   = stockBiere(r.nom);
    const px      = r.prix||{};
    const hasNext = filtered.length>1;

    return (
     <Modal onClose={()=>setSel(null)}>

      <div style={{display:'flex',alignItems:'center',
       justifyContent:'space-between',marginBottom:0,
       margin:'-20px -20px 0',padding:'12px 16px',
       borderBottom:`1px solid ${C.border}`,background:C.bgDark}}>
       <button onClick={()=>setSel(null)}
        style={{display:'flex',alignItems:'center',gap:5,background:'none',
         border:'none',color:C.textMid,fontSize:12,fontWeight:700,
         fontFamily:FM,letterSpacing:0.5,padding:0}}>
        ← RETOUR
       </button>
       {hasNext&&(
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
         <button onClick={()=>navModal(-1)}
          style={{width:28,height:28,borderRadius:4,
           border:`1px solid ${C.border}`,background:C.bgCard,
           color:C.textMid,fontSize:14,display:'flex',
           alignItems:'center',justifyContent:'center',fontWeight:700}}>‹</button>
         <span style={{fontFamily:FM,fontSize:9,
          color:C.textLight,letterSpacing:1}}>
          {selIdx+1} / {filtered.length}
         </span>
         <button onClick={()=>navModal(1)}
          style={{width:28,height:28,borderRadius:4,
           border:`1px solid ${C.border}`,background:C.bgCard,
           color:C.textMid,fontSize:14,display:'flex',
           alignItems:'center',justifyContent:'center',fontWeight:700}}>›</button>
        </div>
       )}
      </div>

      <div style={{position:'relative',height:200,overflow:'hidden',
       margin:'0 -20px',background:C.bgDark}}>
       {img?(
        <img src={img}
         style={{width:'100%',height:'100%',objectFit:'cover',
          objectPosition:'left center',
          filter:'brightness(0.5)',
          animation:'fadeUp 0.3s ease'}}
         onError={e=>e.target.style.display='none'}/>
       ):(
        <div style={{height:'100%',display:'flex',alignItems:'center',
         justifyContent:'center',fontSize:60,opacity:0.15}}>🍺</div>
       )}
       <div style={{position:'absolute',inset:0,
        background:'linear-gradient(90deg,rgba(13,11,9,0) 0%,rgba(13,11,9,0.9) 55%)'}}/>
       <div style={{position:'absolute',left:0,top:0,bottom:0,width:4,background:srm}}/>

       <div style={{position:'absolute',right:20,top:'50%',
        transform:'translateY(-50%)',textAlign:'right',maxWidth:'55%'}}>
        <div style={{fontFamily:FM,fontSize:8,
         letterSpacing:3,color:srm,textTransform:'uppercase',marginBottom:4}}>
         {r.style}
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",
         fontSize:36,color:C.cream,lineHeight:0.9,letterSpacing:1}}>
         {r.nom}
        </div>
        <div style={{fontFamily:FM,fontSize:9,
         color:C.textMid,marginTop:6,letterSpacing:0.5}}>
         {r.abv}% vol · IBU {r.ibu}
        </div>
       </div>

       <button onClick={()=>{setUploadRec(r.id);fileRef.current?.click();}}
        style={{position:'absolute',bottom:10,right:16,
         fontFamily:FM,fontSize:9,fontWeight:700,
         color:C.amber,background:'rgba(0,0,0,0.5)',
         border:`1px solid ${C.amber}40`,
         borderRadius:4,padding:'4px 10px',letterSpacing:0.5}}>
        📷 {img?'CHANGER':'AJOUTER'}
       </button>
      </div>

      <div style={{padding:'16px 0 0'}}>

       <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
        <Tag text={r.style} color={r.permanent?C.amber:C.hop}
         bg={r.permanent?C.amberPale:C.hopPale}/>
        <Tag text={`${r.abv}% vol`} color={C.textMid} bg={C.bgCard}/>
        <Tag text={r.permanent?'Permanente':'Éphémère'}
         color={r.permanent?C.amber:C.hop} bg={C.bgCard}/>
       </div>

       <div style={{height:2,background:srm,
        borderRadius:1,marginBottom:14,width:'100%'}}/>

       <p style={{color:C.textMid,fontSize:13,lineHeight:1.7,
        marginBottom:16,fontStyle:'italic'}}>
        « {r.description} »
       </p>

       <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',
        gap:6,marginBottom:16}}>
        {[['ABV',`${r.abv}%`,C.amber],
         ['IBU',r.ibu,amerCol(r.ibu)],
         ['SRM',r.srm,srm],
         ['DI',r.og,C.textMid],
         ['DF',r.fg||'—',C.textLight]
        ].map(([l,v,col])=>(
         <div key={l} style={{textAlign:'center',background:C.bgDark,
          borderRadius:6,padding:'10px 2px',
          borderBottom:`2px solid ${col}60`}}>
          <div style={{fontFamily:FM,fontWeight:700,
           fontSize:13,color:col,lineHeight:1}}>{v}</div>
          <div style={{fontSize:8,color:C.textLight,
           textTransform:'uppercase',letterSpacing:1,marginTop:4}}>{l}</div>
         </div>
        ))}
       </div>

       <div style={{marginBottom:14}}>
        <div style={{fontFamily:FM,fontSize:8,
         letterSpacing:2,color:C.textLight,textTransform:'uppercase',
         marginBottom:8}}>Houblons & Levure</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
         {r.houblons?.map(h=>(
          <span key={h} style={{background:C.hopPale,color:C.hop,
           padding:'4px 12px',borderRadius:4,fontSize:11,fontWeight:700,
           border:`1px solid ${C.hop}30`,letterSpacing:0.3,
           fontFamily:FM}}>
           {h}
          </span>
         ))}
         {r.levure&&(
          <span style={{background:C.brickPale,color:C.brick,
           padding:'4px 12px',borderRadius:4,fontSize:11,fontWeight:700,
           border:`1px solid ${C.brick}30`,letterSpacing:0.3,
           fontFamily:FM}}>
           {r.levure}
          </span>
         )}
        </div>
       </div>

       {(px.b33||px.f20)&&(
        <div style={{marginBottom:16}}>
         <div style={{fontFamily:FM,fontSize:8,
          letterSpacing:2,color:C.textLight,textTransform:'uppercase',
          marginBottom:8}}>Tarifs</div>
         <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
          {[['🍺','33cl',px.b33],['🍾','75cl',px.b75],
           ['🛢','Fût 20L',px.f20],['🛢','Fût 30L',px.f30]
          ].map(([ico,l,p])=>p?(
           <div key={l} style={{background:C.bgDark,borderRadius:6,
            padding:'10px 6px',textAlign:'center',
            borderBottom:`2px solid ${C.amber}50`}}>
            <div style={{fontSize:16,marginBottom:4}}>{ico}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",
             fontSize:20,color:C.amber,lineHeight:1}}>{p}€</div>
            <div style={{fontFamily:FM,
             fontSize:8,color:C.textLight,marginTop:3,
             letterSpacing:0.5}}>{l}</div>
           </div>
          ):null)}
         </div>
        </div>
       )}

       {stock.length>0&&stock.some(s=>s.dispo>0)&&(
        <div style={{background:C.bgDark,borderRadius:8,
         padding:'12px 14px',marginBottom:16,
         borderLeft:`3px solid ${C.greenL}`}}>
         <div style={{fontFamily:FM,fontSize:8,
          letterSpacing:2,color:C.greenL,textTransform:'uppercase',
          marginBottom:8}}>Stock disponible</div>
         {stock.filter(s=>s.dispo>0).map((s,i)=>(
          <div key={`k${i}`} style={{display:'flex',
           justifyContent:'space-between',
           fontSize:12,color:C.textMid,marginBottom:4}}>
           <span>{s.type}</span>
           <span style={{fontFamily:FM,
            fontWeight:700,color:C.greenL}}>
            {s.dispo.toLocaleString('fr')}
           </span>
          </div>
         ))}
        </div>
       )}

       <button onClick={()=>setSel(null)}
        style={{width:'100%',padding:'12px',borderRadius:6,
         border:`1px solid ${C.border}`,background:'transparent',
         color:C.textMid,fontFamily:FM,
         fontSize:11,fontWeight:700,letterSpacing:1,
         textTransform:'uppercase'}}>
        ← RETOUR AU CATALOGUE
       </button>
      </div>
     </Modal>
    );
   })()}
  </div>
 );
}

function ModulePL({brassins,recettes,condSessions,stockPF,locations,stock,stockCond}){
 const [periode,setPeriode] = useState('tout');

 const pCond = calcPrixCond(stockCond);

 const fmtKey = {'Bouteille 33cl':'b33','Bouteille 75cl':'b75','Fût 20L':'f20','Fût 30L':'f30'};

 const now = new Date();
 const filterDate = d => {
  if(periode==='tout') return true;
  const dt = new Date(d);
  const mois = (now.getFullYear()-dt.getFullYear())*12+now.getMonth()-dt.getMonth();
  if(periode==='m1') return mois<=1;
  if(periode==='m3') return mois<=3;
  if(periode==='m6') return mois<=6;
  if(periode==='a1') return mois<=12;
  return true;
 };

 const sessionsFiltered = condSessions.filter(cs=>filterDate(cs.date));
 let caVentes = 0, coutVentes = 0;
 sessionsFiltered.forEach(cs=>{
  const rec = recettes.find(r=>r.nom===cs.brassinNom||cs.brassinNom.includes(r.nom.split(' ')[1]||r.nom));
  cs.lots.forEach(lot=>{
   const pf   = (stockPF||[]).find(x=>x.lotId===`${cs.id}-${lot.lot}`);
   const vendu= pf ? (lot.contenants - pf.qteDispo) : 0;
   const pk   = fmtKey[lot.type];
   const pv   = rec?.prix?.[pk]||0;
   const cr   = pCond[lot.type]||0;
   caVentes   += vendu * pv;
   coutVentes += vendu * cr;
  });
 });

 const locsFiltered = locations.filter(l=>
  l.statut==='retournée'&&filterDate(l.dateDebut));
 const caLocations  = locsFiltered.reduce((s,l)=>{
  const futCA = (l.futs||[]).reduce((a,f)=>{
   const prixFut = parseFloat(f.prixFut)||0;
   return a + prixFut*(f.nbFuts||1);
  },0);
  return s + futCA;
 },0);
 const consignesEnCours = locations
  .filter(l=>l.statut==='confirmée'||l.statut==='en cours')
  .reduce((s,l)=>(s+(l.gobelets25||0)+(l.gobelets50||0)),0);

 const brassinsFiltered = brassins.filter(b=>b.statut==='terminé'&&filterDate(b.dateDebut));
 let coutBrassage = 0;
 brassinsFiltered.forEach(b=>{
  const rec = recettes.find(r=>r.nom===b.recette);
  if(!rec) return;
  rec.ingredients.forEach(ing=>{
   const s=findStock(stock,ing.nom);
   if(s) coutBrassage += (ing.qte||0)*(s.prix||0)*(b.volume||rec.volume)/rec.volume;
  });
 });

 let valStock = 0;
 condSessions.forEach(cs=>{
  const rec = recettes.find(r=>r.nom===cs.brassinNom||cs.brassinNom.includes(r.nom.split(' ')[1]||r.nom));
  cs.lots.forEach(lot=>{
   const pf = (stockPF||[]).find(x=>x.lotId===`${cs.id}-${lot.lot}`);
   const dispo = pf?pf.qteDispo:lot.contenants;
   const pk = fmtKey[lot.type];
   const pv = rec?.prix?.[pk]||0;
   valStock += dispo * pv;
  });
 });

 const caTotal     = caVentes + caLocations;
 const coutTotal   = coutVentes + coutBrassage;
 const margeGrossE = caTotal - coutTotal;
 const margeGrossP = caTotal>0?Math.round(margeGrossE/caTotal*100):0;

 const periodes = [
  {id:'m1',label:'1 mois'},{id:'m3',label:'3 mois'},
  {id:'m6',label:'6 mois'},{id:'a1',label:'12 mois'},
  {id:'tout',label:'Tout'},
 ];

 const Row = ({label,value,color=C.textMid,bold,sub}) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
   padding:'9px 12px',borderRadius:8,
   background:bold?C.amberPale:C.bgCard,
   border:`1px solid ${bold?C.amber:C.border}`,marginBottom:5}}>
   <div>
    <div style={{fontSize:13,color:bold?C.amber:C.textMid,fontWeight:bold?700:400}}>{label}</div>
    {sub&&<div style={{fontSize:10,color:C.textLight,marginTop:1}}>{sub}</div>}
   </div>
   <div style={{fontFamily:FA,fontSize:bold?20:16,
    color,lineHeight:1}}>{value}</div>
  </div>
 );

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',
    color:C.text,marginBottom:4}}>P&L Brasserie</h2>
   <p style={{fontSize:12,color:C.textLight,fontFamily:FM,
    marginBottom:14}}>Compte de résultat consolidé</p>

   <div style={{display:'flex',gap:6,overflowX:'auto',marginBottom:18,
    paddingBottom:4,scrollbarWidth:'none'}}>
    {periodes.map(p=>(
     <button key={p.id} onClick={()=>setPeriode(p.id)}
      style={{flexShrink:0,padding:'6px 14px',borderRadius:20,
       border:`1.5px solid ${periode===p.id?C.amber:C.border}`,
       background:periode===p.id?C.amberPale:'transparent',
       color:periode===p.id?C.amber:C.textMid,
       fontSize:12,fontWeight:600,minHeight:34,whiteSpace:'nowrap'}}>
      {p.label}
     </button>
    ))}
   </div>

   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
    {[
     {label:'CA réalisé',val:`${caTotal.toLocaleString('fr')}€`,
     color:C.ok,icon:'💰',sub:`ventes + locations`},
     {label:'Marge brute',val:`${margeGrossP}%`,
     color:margeGrossP>=50?C.ok:margeGrossP>=30?C.warn:C.alert,
     icon:'📈',sub:`${margeGrossE.toLocaleString('fr')}€`},
     {label:'Valeur stock PF',val:`${valStock.toLocaleString('fr')}€`,
     color:C.amber,icon:'📦',sub:'produits finis dispo'},
     {label:'Consignes gobelets',val:`${consignesEnCours.toLocaleString('fr')}€`,
     color:C.brick,icon:'🔒',sub:'à récupérer'},
    ].map(({label,val,color,icon,sub})=>(
     <StatCard key={label} label={label} value={val} color={color} icon={icon} sub={sub}/>
    ))}
   </div>

   <div style={{background:C.bgCard,borderRadius:14,padding:'16px',
    border:`1px solid ${C.border}`,marginBottom:14}}>
    <div style={{fontFamily:FA,fontSize:16,
     color:C.text,marginBottom:12}}>Détail des revenus</div>
    <Row label="Ventes bouteilles & fûts"
     value={`${caVentes.toLocaleString('fr')}€`} color={C.ok}
     sub={`${sessionsFiltered.length} sessions conditionnement`}/>
    <Row label="Locations tireuses (fûts facturés)"
     value={`${caLocations.toLocaleString('fr')}€`} color={C.ok}
     sub={`${locsFiltered.length} locations retournées`}/>
    <Row label="CA TOTAL" value={`${caTotal.toLocaleString('fr')}€`}
     color={C.ok} bold/>
   </div>

   <div style={{background:C.bgCard,borderRadius:14,padding:'16px',
    border:`1px solid ${C.border}`,marginBottom:14}}>
    <div style={{fontFamily:FA,fontSize:16,
     color:C.text,marginBottom:12}}>Détail des coûts</div>
    <Row label="Matières premières brassage"
     value={`-${coutBrassage.toLocaleString('fr')}€`} color={C.alert}
     sub={`${brassinsFiltered.length} brassins terminés`}/>
    <Row label="Emballage (bouteilles conditionnées)"
     value={`-${coutVentes.toLocaleString('fr')}€`} color={C.alert}
     sub="bouteilles+capsules+étiquettes vendues"/>
    <Row label="COÛT TOTAL" value={`-${coutTotal.toLocaleString('fr')}€`}
     color={C.alert} bold/>
   </div>

   <div style={{background:margeGrossP>=50?C.greenPale:margeGrossP>=30?C.amberPale:C.brickPale,
    borderRadius:14,padding:'16px',
    border:`1px solid ${margeGrossP>=50?C.green:margeGrossP>=30?C.amber:C.brick}`}}>
    <Row label="MARGE BRUTE"
     value={`${margeGrossE.toLocaleString('fr')}€ (${margeGrossP}%)`}
     color={margeGrossP>=50?C.ok:margeGrossP>=30?C.amber:C.alert} bold/>
    <div style={{fontSize:11,color:C.textLight,marginTop:8,lineHeight:1.6}}>
     💡 Non inclus : charges fixes (loyer, énergie, salaires, amortissements).
     Cette marge brute représente la rentabilité sur les seules matières.
    </div>
   </div>
  </div>
 );
}

function ModuleEncaissement({locations,setLocations}){
 const [filtre,setFiltre] = useState('en_attente');

 const enAttente = locations.filter(l=>
  l.statut==='retournée'&&!(l.encaisse));
 const encaisses = locations.filter(l=>l.encaisse);
 const actives   = locations.filter(l=>
  l.statut==='confirmée'||l.statut==='en cours');

 const displayed = filtre==='en_attente'?enAttente
  :filtre==='encaisses'?encaisses:actives;

 const totalAttente = enAttente.reduce((s,l)=>{
  const futCA=(l.futs||[]).reduce((a,f)=>(a+(parseFloat(f.prixFut)||0)*(f.nbFuts||1)),0);
  const gobConsigne =(l.gobelets25||0)+(l.gobelets50||0);
  return s+futCA+gobConsigne;
 },0);

 const encaisser = (loc, montant, motif) => {
  setLocations(prev=>prev.map(l=>l.id===loc.id
   ?{...l, encaisse:true, dateEncaissement:new Date().toISOString().split('T')[0],
     montantEncaisse:parseFloat(montant)||0, noteEncaissement:motif}
   :l
  ));
 };

 const [editLoc,setEditLoc] = useState(null);
 const [montant,setMontant] = useState('');
 const [note,setNote]       = useState('');

 const LocCard = ({l}) => {
  const futCA = (l.futs||[]).reduce((a,f)=>(a+(parseFloat(f.prixFut)||0)*(f.nbFuts||1)),0);
  const gobConsigne= (l.gobelets25||0)+(l.gobelets50||0);
  const total = futCA + gobConsigne;
  const isEdit = editLoc?.id===l.id;

  return (
   <div style={{background:C.bgCard,borderRadius:14,marginBottom:10,
    overflow:'hidden',border:`1.5px solid ${isEdit?C.amber:C.border}`}}>
    <div style={{padding:'12px 14px'}}>
     <div style={{display:'flex',justifyContent:'space-between',
      alignItems:'flex-start',marginBottom:8}}>
      <div style={{flex:1,minWidth:0}}>
       <div style={{fontFamily:FA,fontSize:16,
        color:C.text,overflow:'hidden',textOverflow:'ellipsis',
        whiteSpace:'nowrap'}}>{l.client}</div>
       <div style={{fontSize:11,color:C.textLight,
        fontFamily:FM,marginTop:2}}>
        {fmtDate(l.dateDebut)} · {l.tireuses.length} tireuse{l.tireuses.length>1?'s':''}
        {l.tel&&` · ${l.tel}`}
       </div>
      </div>
      <div style={{textAlign:'right',flexShrink:0,marginLeft:10}}>
       <div style={{fontFamily:FA,fontSize:20,
        color:l.encaisse?C.ok:C.amber,lineHeight:1}}>
        {total.toLocaleString('fr')}€
       </div>
       {l.encaisse&&<div style={{fontSize:10,color:C.ok,
        fontFamily:FM}}>✓ Encaissé</div>}
      </div>
     </div>

     <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
      {(l.futs||[]).map((f,i)=>f.prixFut>0&&(
       <span key={`k${i}`} style={{background:C.bgCard,borderRadius:6,
        padding:'3px 9px',fontSize:10,color:C.amber,
        fontFamily:FM,border:`1px solid ${C.border}`}}>
        🛢 {f.nbFuts}×{f.typeFut} = {((parseFloat(f.prixFut)||0)*(f.nbFuts||1)).toFixed(0)}€
       </span>
      ))}
      {gobConsigne>0&&(
       <span style={{background:C.bgCard,borderRadius:6,
        padding:'3px 9px',fontSize:10,color:C.hop,
        fontFamily:FM,border:`1px solid ${C.border}`}}>
        🥤 Gobelets {gobConsigne}€
       </span>
      )}
     </div>

     {l.encaisse&&l.dateEncaissement&&(
      <div style={{fontSize:11,color:C.textLight,fontFamily:FM}}>
       Encaissé le {fmtDate(l.dateEncaissement)}
       {l.noteEncaissement&&` · ${l.noteEncaissement}`}
      </div>
     )}

     {!l.encaisse&&l.statut==='retournée'&&(
      isEdit?(
       <div style={{marginTop:10,padding:'10px 12px',borderRadius:10,
        background:C.amberPale,border:`1px solid ${C.amber}40`}}>
        <div style={{fontSize:11,fontWeight:700,color:C.amber,
         marginBottom:8,textTransform:'uppercase',letterSpacing:0.8}}>
         Valider l'encaissement
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
         <div>
          <label style={{fontSize:10,color:C.textLight,
           textTransform:'uppercase',letterSpacing:0.8,
           display:'block',marginBottom:4}}>Montant (€)</label>
          <input type="number" value={montant}
           onChange={e=>setMontant(e.target.value)}
           placeholder={String(total)}
           style={{...iSt,fontSize:15,fontWeight:700}}/>
         </div>
         <div>
          <label style={{fontSize:10,color:C.textLight,
           textTransform:'uppercase',letterSpacing:0.8,
           display:'block',marginBottom:4}}>Mode</label>
          <select value={note} onChange={e=>setNote(e.target.value)}
           style={iSt}>
           <option value="">Chèque</option>
           <option>Virement</option>
           <option>Espèces</option>
           <option>CB</option>
           <option>Partiel</option>
          </select>
         </div>
        </div>
        <div style={{display:'flex',gap:8}}>
         <button onClick={()=>{setEditLoc(null);setMontant('');setNote('');}}
          style={{flex:1,padding:'9px',borderRadius:8,
           border:`1px solid ${C.border}`,background:'transparent',
           color:C.textMid,fontSize:12,fontWeight:600}}>
          Annuler
         </button>
         <button onClick={()=>{encaisser(l,montant||total,note||'Chèque');setEditLoc(null);}}
          style={{flex:2,padding:'9px',borderRadius:8,border:'none',
           background:C.ok,
           color:'#fff',fontSize:13,fontWeight:700}}>
          ✓ Confirmer {(parseFloat(montant)||total).toLocaleString('fr')}€
         </button>
        </div>
       </div>
      ):(
       <button onClick={()=>{setEditLoc(l);setMontant(String(total));setNote('');}}
        style={{marginTop:8,width:'100%',padding:'9px',borderRadius:8,
         border:`1.5px dashed ${C.amber}80`,background:'transparent',
         color:C.amber,fontSize:12,fontWeight:600}}>
        💰 Enregistrer l'encaissement
       </button>
      )
     )}
    </div>
   </div>
  );
 };

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,
    fontSize:'clamp(20px,5vw,26px)',color:C.text,marginBottom:4}}>
    Encaissements
   </h2>

   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
    <StatCard label="À encaisser" icon="⏳"
     value={`${totalAttente.toLocaleString('fr')}€`}
     color={totalAttente>0?C.alert:C.ok}
     sub={`${enAttente.length} location${enAttente.length>1?'s':''}`}/>
    <StatCard label="Encaissé" icon="✅"
     value={`${encaisses.reduce((s,l)=>s+(l.montantEncaisse||0),0).toLocaleString('fr')}€`}
     color={C.ok}
     sub={`${encaisses.length} location${encaisses.length>1?'s':''}`}/>
   </div>

   <div style={{display:'flex',gap:6,marginBottom:14}}>
    {[
     {id:'en_attente',label:`⏳ À encaisser (${enAttente.length})`},
     {id:'actives',label:`📋 En cours (${actives.length})`},
     {id:'encaisses',label:`✅ Soldées (${encaisses.length})`},
    ].map(f=>(
     <button key={f.id} onClick={()=>setFiltre(f.id)}
      style={{flexShrink:0,padding:'6px 12px',borderRadius:20,
       border:`1.5px solid ${filtre===f.id?C.amber:C.border}`,
       background:filtre===f.id?C.amberPale:'transparent',
       color:filtre===f.id?C.amber:C.textMid,
       fontSize:11,fontWeight:600,minHeight:34,whiteSpace:'nowrap'}}>
      {f.label}
     </button>
    ))}
   </div>

   {displayed.length===0&&(
    <div style={{textAlign:'center',padding:'40px 0',color:C.textLight}}>
     <div style={{fontSize:36,marginBottom:8}}>
      {filtre==='en_attente'?'🎉':'📋'}
     </div>
     <div style={{fontWeight:600}}>
      {filtre==='en_attente'?'Tout est encaissé !':'Aucune location ici'}
     </div>
    </div>
   )}

   {displayed.map(l=><LocCard key={l.id} l={l}/>)}
  </div>
 );
}

function ModuleSimulation({recettes,setRecettes,stock,stockCond,condSessions,stockPF}){
 const [mode,setMode]      = useState('prix');
 const [recSel,setRecSel]  = useState(recettes[0]?.id||1);
 const [delta,setDelta]    = useState({b33:0,b75:0,f20:0,f30:0});
 const [matDelta,setMatDelta] = useState(0); // % variation coût matières

 const pCond = calcPrixCond(stockCond);
 const fmtKey = {'Bouteille 33cl':'b33','Bouteille 75cl':'b75','Fût 20L':'f20','Fût 30L':'f30'};
 const fmtVol = {'b33':0.33,'b75':0.75,'f20':20,'f30':30};

 const rec = recettes.find(r=>r.id===recSel)||recettes[0];
 if(!rec) return null;

 const px = rec.prix||{};

 const coutMatL = rec => {
 if(!rec) return 0;
 return 0;
};
 const cL = coutMatL()*(1+matDelta/100);

 const coutRevient = fmt => {
  const vol = fmtVol[fmt]||0;
  const pC  = {'b33':pCond['Bouteille 33cl'],'b75':pCond['Bouteille 75cl'],'f20':0,'f30':0}[fmt]||0;
  return cL*vol+pC;
 };

 const volumesVendus = {};
 condSessions.forEach(cs=>{
  if(cs.brassinNom!==rec.nom&&!cs.brassinNom.includes(rec.nom.split(' ')[1]||'')) return;
  cs.lots.forEach(lot=>{
   const pf=((stockPF)||[]).find(x=>x.lotId===`${cs.id}-${lot.lot}`);
   const vendu=(pf)?(lot.contenants-pf.qteDispo):0;
   const k=fmtKey[lot.type];
   if(k) volumesVendus[k]=(volumesVendus[k]||0)+vendu;
  });
 });

 const impact = fmt => {
  const pvBase  = px[fmt]||0;
  const pvNew   = pvBase + (delta[fmt]||0);
  const cr      = coutRevient(fmt);
  const vol     = volumesVendus[fmt]||0;
  const caBase  = pvBase*vol;
  const caNew   = pvNew*vol;
  const mgBase  = pvBase>0?Math.round((pvBase-cr)/pvBase*100):null;
  const mgNew   = pvNew>0?Math.round((pvNew-cr)/pvNew*100):null;
  return {pvBase,pvNew,cr,vol,caBase,caNew,mgBase,mgNew,
      diffCA:caNew-caBase,diffMg:(mgNew||0)-(mgBase||0)};
 };

 const fmts    = ['b33','b75','f20','f30'];
 const labels  = {'b33':'33cl','b75':'75cl','f20':'Fût 20L','f30':'Fût 30L'};
 const impacts = Object.fromEntries(fmts.map(f=>[f,impact(f)]));
 const totalDiffCA = fmts.reduce((s,f)=>s+impacts[f].diffCA,0);

 const applyPrix = () => {
  setRecettes(recettes.map(r=>r.id===rec.id
   ?{...r,prix:Object.fromEntries(
     fmts.map(f=>[f,(px[f]||0)+(delta[f]||0)])
    )}
   :r
  ));
  setDelta({b33:0,b75:0,f20:0,f30:0});
 };

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,
    fontSize:'clamp(20px,5vw,26px)',color:C.text,marginBottom:4}}>
    Simulation
   </h2>
   <p style={{fontSize:12,color:C.textLight,fontFamily:FM,
    marginBottom:14}}>Testez l'impact de vos décisions tarifaires</p>

   <div style={{marginBottom:14}}>
    <label style={{fontSize:10,fontWeight:700,color:C.textLight,
     textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>
     Recette à simuler
    </label>
    <select value={recSel} onChange={e=>setRecSel(parseInt(e.target.value))}
     style={iSt}>
     {recettes.map(r=>(
      <option key={r.id} value={r.id}>{r.nom} — {r.style}</option>
     ))}
    </select>
   </div>

   <div style={{display:'flex',gap:8,marginBottom:16}}>
    {[['prix','📈 Prix de vente'],['cout','💸 Coût matières']].map(([v,l])=>(
     <button key={v} onClick={()=>setMode(v)}
      style={{flex:1,padding:'8px',borderRadius:20,
       border:`1.5px solid ${mode===v?C.amber:C.border}`,
       background:mode===v?C.amberPale:'transparent',
       color:mode===v?C.amber:C.textMid,
       fontSize:12,fontWeight:600,minHeight:36}}>
      {l}
     </button>
    ))}
   </div>

   {mode==='prix'&&(
    <>
     {fmts.filter(f=>px[f]>0).map(f=>{
      const imp = impacts[f];
      return (
       <div key={f} style={{background:C.bgCard,borderRadius:12,
        padding:'14px',marginBottom:10,border:`1px solid ${C.border}`}}>
        <div style={{display:'flex',justifyContent:'space-between',
         alignItems:'center',marginBottom:10}}>
         <div>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>
           {labels[f]}
          </div>
          <div style={{fontSize:11,color:C.textLight,
           fontFamily:FM,marginTop:1}}>
           {imp.vol.toLocaleString('fr')} vendus · coût {imp.cr.toFixed(2)}€
          </div>
         </div>
         <div style={{textAlign:'right'}}>
          <div style={{fontFamily:FA,fontSize:20,
           color:C.amber}}>{(imp.pvNew).toFixed(2)}€</div>
          {delta[f]!==0&&<div style={{fontSize:11,
           color:delta[f]>0?C.ok:C.alert,fontFamily:FM}}>
           {delta[f]>0?'+':''}{delta[f]}€
          </div>}
         </div>
        </div>

        <input type="range"
         min={-2} max={5} step={0.1}
         value={delta[f]||0}
         onChange={e=>setDelta({...delta,[f]:parseFloat(e.target.value)})}
         style={{width:'100%',marginBottom:8,accentColor:C.amber}}/>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
         {[
          ['Marge base',`${imp.mgBase}%`,C.textMid],
          ['Marge new', `${imp.mgNew}%`,
           (imp.mgNew||0)>=(imp.mgBase||0)?C.ok:C.alert],
          ['Impact CA', `${imp.diffCA>=0?'+':''}${imp.diffCA.toFixed(0)}€`,
           imp.diffCA>=0?C.ok:C.alert],
         ].map(([l,v,col])=>(
          <div key={l} style={{background:C.bgCard,borderRadius:6,
           padding:'5px 8px',textAlign:'center',border:`1px solid ${C.border}`}}>
           <div style={{fontFamily:FM,fontWeight:700,
            fontSize:12,color:col}}>{v}</div>
           <div style={{fontSize:9,color:C.textLight,marginTop:1}}>{l}</div>
          </div>
         ))}
        </div>
       </div>
      );
     })}

     <div style={{background:totalDiffCA>=0?C.greenPale:C.brickPale,
      borderRadius:12,padding:'14px',
      border:`1px solid ${totalDiffCA>=0?C.green:C.brick}`,marginBottom:14}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
       <div style={{fontWeight:700,color:C.text}}>Impact total sur CA historique</div>
       <div style={{fontFamily:FA,fontSize:22,
        color:totalDiffCA>=0?C.ok:C.alert}}>
        {totalDiffCA>=0?'+':''}{totalDiffCA.toFixed(0)}€
       </div>
      </div>
     </div>

     {Object.values(delta).some(v=>v!==0)&&(
      <button onClick={applyPrix}
       style={{width:'100%',padding:'13px',borderRadius:10,border:'none',
        background:C.amber,
        color:'#fff',fontWeight:700,fontSize:14,marginBottom:10}}>
       ✓ Appliquer ces nouveaux prix
      </button>
     )}
    </>
   )}

   {mode==='cout'&&(
    <>
     <div style={{background:C.bgCard,borderRadius:12,padding:'14px',
      marginBottom:14,border:`1px solid ${C.border}`}}>
      <div style={{fontWeight:700,color:C.text,marginBottom:12}}>
       Variation du coût matières
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
       <span style={{color:C.textMid,fontSize:13}}>Hausse / baisse des ingrédients</span>
       <span style={{fontFamily:FM,fontWeight:700,
        fontSize:15,color:matDelta>0?C.alert:matDelta<0?C.ok:C.textMid}}>
        {matDelta>0?'+':''}{matDelta}%
       </span>
      </div>
      <input type="range" min={-30} max={50} step={1}
       value={matDelta} onChange={e=>setMatDelta(parseInt(e.target.value))}
       style={{width:'100%',marginBottom:12,accentColor:C.amber}}/>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
       {fmts.filter(f=>px[f]>0).map(f=>{
        const imp = impacts[f];
        return (
         <div key={f} style={{background:C.bgCard,borderRadius:8,
          padding:'10px',border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:600,color:C.text,fontSize:13,
           marginBottom:4}}>{labels[f]}</div>
          <div style={{display:'flex',justifyContent:'space-between',
           fontSize:12,color:C.textMid}}>
           <span>Coût revient</span>
           <span style={{fontFamily:FM,
            color:C.alert}}>{imp.cr.toFixed(2)}€</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',
           fontSize:12,color:C.textMid}}>
           <span>Marge</span>
           <span style={{fontFamily:FM,
            color:imp.mgNew>=50?C.ok:imp.mgNew>=30?C.warn:C.alert,
            fontWeight:700}}>{imp.mgNew}%</span>
          </div>
         </div>
        );
       })}
      </div>
     </div>

     <div style={{background:C.amberPale,borderRadius:10,padding:'12px 14px',
      border:`1px solid ${C.amber}30`,fontSize:12,color:C.textMid,lineHeight:1.6}}>
      💡 Utilisez ce simulateur pour anticiper l'impact d'une hausse de matières
      (houblon, malt) sur vos marges et décider si un ajustement de prix est nécessaire.
     </div>
    </>
   )}
  </div>
 );
}

function ModulePrediction({brassins,recettes}){
 const actifs = brassins.filter(b=>b.statut!=='terminé'&&b.statut!=='planifié');

 const predire = b => {
  const duree = FERM_JOURS[b.recette] || 21;
  const debut = new Date(b.dateDebut+'T00:00');
  const datePrete = new Date(debut.getTime() + duree*86400000);
  const joursRestants = Math.ceil((datePrete-new Date())/86400000);
  const joursEcoules  = Math.floor((new Date()-debut)/86400000);
  const pct = Math.min(100,Math.max(0,Math.round(joursEcoules/duree*100)));
  const lastMes = b.mesures[b.mesures.length-1];
  const attenuation = b.og&&lastMes ? Math.round((b.og-lastMes.valeur)/(b.og-1.008)*100) : null;
  return {datePrete,joursRestants,joursEcoules,duree,pct,attenuation,lastMes};
 };

 const statusColor = jr => jr<=0?C.ok:jr<=3?C.warn:jr<=7?C.amber:C.textLight;
 const statusLabel = jr => jr<=0?'🟢 PRÊTE':jr<=3?'🔶 Très bientôt':`📅 ${jr}j restants`;

 if(actifs.length===0) return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,fontSize:'clamp(20px,5vw,26px)',
    color:C.text,marginBottom:14}}>Prédictions</h2>
   <div style={{textAlign:'center',padding:'60px 20px',color:C.textLight}}>
    <div style={{fontSize:40,marginBottom:10}}>⚗️</div>
    <div style={{fontWeight:600}}>Aucun brassin en cours</div>
   </div>
  </div>
 );

 return (
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,
    fontSize:'clamp(20px,5vw,26px)',color:C.text,marginBottom:4}}>
    Prédictions
   </h2>
   <p style={{fontSize:12,color:C.textLight,fontFamily:FM,
    marginBottom:16}}>
    Dates estimées basées sur l'historique réel de chaque recette
   </p>

   {actifs.map(b=>{
    const {datePrete,joursRestants,joursEcoules,duree,pct,attenuation,lastMes} = predire(b);
    const img = BEER_IMAGES[b.recette];
    const rec = recettes.find(r=>r.nom===b.recette);

    return (
     <div key={b.id} style={{background:`${C.bgCard}`,
      borderRadius:16,marginBottom:14,overflow:'hidden',
      border:`1.5px solid ${joursRestants<=3?C.amber:C.border}`,
      boxShadow:joursRestants<=3?`0 0 20px ${C.amber}30`:'none'}}>

      <div style={{padding:'14px 14px 10px',
       display:'flex',gap:12,alignItems:'flex-start'}}>
       <div style={{width:56,height:56,borderRadius:10,
        background:C.bgDark,flexShrink:0,overflow:'hidden',
        display:'flex',alignItems:'center',justifyContent:'center',
        border:`1px solid ${C.border}`}}>
        {img?(
         <img src={img} style={{width:52,height:52,objectFit:'contain'}}
          onError={e=>e.target.style.display='none'}/>
        ):<span style={{fontSize:28}}>⚗️</span>}
       </div>

       <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:FA,fontSize:17,
         color:C.text,lineHeight:1.1}}>{b.recette}</div>
        <div style={{fontSize:11,color:C.textLight,
         fontFamily:FM,marginTop:2}}>
         {b.fermenteur} · démarré {fmtDate(b.dateDebut)} · J+{joursEcoules}
        </div>
        <div style={{marginTop:4,fontSize:12,fontWeight:700,
         color:statusColor(joursRestants)}}>
         {statusLabel(joursRestants)}
        </div>
       </div>

       <div style={{textAlign:'center',flexShrink:0,
        background:joursRestants<=0?C.greenPale:C.amberPale,
        borderRadius:10,padding:'6px 10px',
        border:`1px solid ${joursRestants<=0?C.green:C.amber}40`}}>
        <div style={{fontFamily:FM,fontWeight:700,
         fontSize:11,color:joursRestants<=0?C.ok:C.amber}}>
         {datePrete.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}
        </div>
        <div style={{fontSize:8,color:C.textLight,marginTop:1,
         textTransform:'uppercase',letterSpacing:0.5}}>estimée</div>
       </div>
      </div>

      <div style={{padding:'0 14px 12px'}}>
       <div style={{display:'flex',justifyContent:'space-between',
        fontSize:10,color:C.textLight,marginBottom:4,
        fontFamily:FM}}>
        <span>Brassage</span>
        <span style={{color:statusColor(joursRestants),fontWeight:700}}>
         {pct}% · {joursEcoules}j / {duree}j estimés
        </span>
        <span>Conditionnement</span>
       </div>
       <div style={{height:8,background:C.bgCard,borderRadius:4,overflow:'hidden',
        border:`1px solid ${C.border}`}}>
        <div style={{height:'100%',borderRadius:4,
         background:pct>=100
          ?C.ok
          :pct>=70
          ?C.amber
          :C.hop,
         width:`${pct}%`,transition:'width 0.5s ease'}}/>
       </div>
      </div>

      {b.mesures.length>0&&(
       <div style={{padding:'0 14px 14px'}}>
        <div style={{background:C.bgCard,borderRadius:8,padding:'10px 12px',
         border:`1px solid ${C.border}`}}>
         <div style={{display:'flex',justifyContent:'space-between',
          alignItems:'center',marginBottom:6}}>
          <div style={{fontSize:10,fontWeight:700,color:C.textLight,
           textTransform:'uppercase',letterSpacing:0.8}}>
           Progression densité
          </div>
          {attenuation!=null&&(
           <span style={{fontSize:10,fontWeight:700,
            color:attenuation>=80?C.ok:C.warn,
            fontFamily:FM,
            background:attenuation>=80?C.greenPale:C.amberPale,
            padding:'2px 7px',borderRadius:10,
            border:`1px solid ${attenuation>=80?C.green:C.amber}30`}}>
            Att. {attenuation}%
           </span>
          )}
         </div>
         <div style={{display:'flex',gap:6,overflowX:'auto',
          scrollbarWidth:'none'}}>
          {(b.mesures||[]).map((m,i)=>(
           <div key={`k${i}`} style={{flexShrink:0,textAlign:'center',
            background:C.bgCard,borderRadius:6,padding:'6px 10px',
            border:`1px solid ${i===b.mesures.length-1?C.amber:C.border}`}}>
            <div style={{fontFamily:FM,fontWeight:700,
             fontSize:12,color:i===b.mesures.length-1?C.amber:C.textMid}}>
             {m.valeur.toFixed(3)}
            </div>
            <div style={{fontSize:8,color:C.textLight,marginTop:1}}>
             {m.note}
            </div>
            <div style={{fontSize:8,color:C.textLight}}>
             {fmtDate(m.date)}
            </div>
           </div>
          ))}
          {rec?.fg&&(
           <div style={{flexShrink:0,textAlign:'center',
            background:C.greenPale,borderRadius:6,padding:'6px 10px',
            border:`1px solid ${C.green}40`}}>
            <div style={{fontFamily:FM,fontWeight:700,
             fontSize:12,color:C.ok}}>{rec.fg.toFixed(3)}</div>
            <div style={{fontSize:8,color:C.ok,marginTop:1}}>
             DF cible
            </div>
           </div>
          )}
         </div>
        </div>
       </div>
      )}
     </div>
    );
   })}

   <div style={{background:C.bgCard,borderRadius:10,padding:'12px 14px',
    border:`1px solid ${C.border}`}}>
    <div style={{fontSize:10,fontWeight:700,color:C.textLight,
     textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>
     Durées moyennes (historique réel)
    </div>
    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
     {Object.entries(FERM_JOURS).map(([nom,j])=>(
      <span key={nom} style={{fontSize:10,fontFamily:FM,
       color:C.textMid,background:C.bgCard,padding:'2px 8px',
       borderRadius:10,border:`1px solid ${C.border}`}}>
       {nom.split(' ').slice(1,3).join(' ')||nom}: {j}j
      </span>
     ))}
    </div>
   </div>
  </div>
 );
}

function detectEventType(evt){
 const txt = ((evt.summary||'')+(evt.description||'')).toLowerCase();
 if(/tireuse|location |réservation|reservation|évén|fête|fete|fest|mariage|soirée|anniversaire|repas/i.test(txt))
  return 'location';
 if(/brassin|brassage|brew|ferment|cuvée|cuve|mash|empatage|conditionnement|mise en bouteille|enfutage|embouteillage|transfert|lavage|cip/i.test(txt))
  return 'brassin';
 if(/livraison|commande|order|achat|fournisseur|delivery|malts?|houblons?/i.test(txt))
  return 'achat';
 return 'brassin';  // calendrier brasserie → probablement des brassins
}

function mapICSBrassin(evt, recettes, i){
 const sum = evt.summary||'';
 // Extraire le volume depuis le titre : "10hl" → 1000 L, "100L" → 100 L
 const volHl = sum.match(/(\d+(?:[.,]\d+)?)\s*hl/i);
 const volL  = sum.match(/(\d+(?:[.,]\d+)?)\s*[lL](?!\w)/);
 const volume = volHl ? parseFloat(volHl[1].replace(',','.')) * 100
              : volL  ? parseFloat(volL[1].replace(',','.'))
              : null;
 // Extraire la cuve : C1–C5
 const cuveM = sum.match(/\bC([1-5])\b/i);
 const fermenteur = cuveM ? `C${cuveM[1]}` : '';
 // Associer une recette par nom
 const rec = recettes.find(r=>
  sum.toLowerCase().includes(r.nom.toLowerCase().replace(/^la |^l['']/,''))
 );
 // Nettoyer le titre pour obtenir le nom de recette
 const cleanSum = sum.replace(/brassage|brassin|embouteillage|enfutage|transfert|lavage|cip|\bC[1-5]\b|\d+\s*hl|\d+\s*[lL](?!\w)/gi,'').replace(/[-–→:]/g,' ').replace(/\s+/g,' ').trim();
 return {
  id:         Date.now()+i,
  recette:    rec?.nom || cleanSum || `Import ${i+1}`,
  volume:     volume ?? rec?.volume ?? 0,
  statut:     'planifié',
  dateDebut:  evt.dateDebut,
  dateCond:   null,
  fermenteur: fermenteur,
  og:         rec?.og||null,
  fg:         null,
  abv:        rec?.abv||null,
  mesures:    [],
  notes:      evt.description ? `Import Google Agenda\n${evt.description}` : 'Import Google Agenda',
  icsUid:     evt.uid,
 };
}

function ModuleAgendaImport({locations,setLocations,brassins,setBrassins,recettes}){
 const KEYS = {
  tireuses: 'ical_url_tireuses',
  brasserie:'ical_url_brasserie',
 };
 const DEFAULT_URL_TIREUSES  = 'https://calendar.google.com/calendar/ical/4sviprsls3nolk69j6rinf9si4%40group.calendar.google.com/public/basic.ics';
 const DEFAULT_URL_BRASSERIE = 'https://calendar.google.com/calendar/ical/mpgr7arg8dmepjrsegpjob1m7g%40group.calendar.google.com/public/basic.ics';

 const [activeKey,  setActiveKey]   = useState('tireuses');
 const [urls,       setUrls]        = useState({tireuses:'',brasserie:''});
 const [loading,    setLoading]     = useState(false);
 const [err,        setErr]         = useState('');
 const [lastSyncs,  setLastSyncs]   = useState({});
 const [step,       setStep]        = useState('accueil'); // accueil | preview | done
 const [parsed,     setParsed]      = useState({location:[],brassin:[],autre:[]});
 const [selected,   setSelected]    = useState({location:[],brassin:[]});
 const [importStats,setImportStats] = useState(null);
 const fileRef = useRef();

 useEffect(()=>{
  try{
   const u = {tireuses:'',brasserie:''};
   const ls = {};
   Object.entries(KEYS).forEach(([k,sk])=>{
    u[k]  = localStorage.getItem(sk)||(k==='tireuses'?DEFAULT_URL_TIREUSES:k==='brasserie'?DEFAULT_URL_BRASSERIE:'');
    const d = localStorage.getItem(sk+'_sync');
    if(d) ls[k] = new Date(d);
   });
   setUrls(u);
   setLastSyncs(ls);
  }catch(e){
   setUrls({tireuses:DEFAULT_URL_TIREUSES,brasserie:''});
  }
 },[]);

 const saveUrl = (key, url) => {
  try{ localStorage.setItem(KEYS[key], url); }catch(e){}
  setUrls(prev=>({...prev,[key]:url}));
 };

 const processICS = (text, sourceKey) => {
  setErr('');
  const evts = parseICS(text);
  if(!evts.length){ setErr('Aucun événement trouvé dans ce calendrier.'); return; }

  const cats = {location:[],brassin:[],autre:[]};
  evts.forEach((evt,i)=>{
   const type = detectEventType(evt);
   if(type==='location'){
    const mapped = mapICS(evt,i);
    const exists = locations.some(l=>l.icsUid===evt.uid);
    cats.location.push({...mapped, _exists:exists, _type:'location'});
   } else if(type==='brassin'){
    const mapped = mapICSBrassin(evt,recettes,i);
    const exists = brassins.some(b=>b.icsUid===evt.uid);
    cats.brassin.push({...mapped, _exists:exists, _type:'brassin'});
   } else {
    cats.autre.push({...evt, _type:'autre', id:Date.now()+i});
   }
  });

  setParsed(cats);
  setSelected({
   location: cats.location.filter(e=>!e._exists).map(e=>e.id),
   brassin:  cats.brassin.filter(e=>!e._exists).map(e=>e.id),
  });

  try{
   localStorage.setItem(KEYS[sourceKey]+'_sync', new Date().toISOString());
   setLastSyncs(prev=>({...prev,[sourceKey]:new Date()}));
  }catch(e){}

  setStep('preview');
 };

 const syncUrl = async (key) => {
  const url = urls[key];
  if(!url?.trim()){ setErr('Entrez une URL iCal valide'); return; }
  setLoading(true); setErr('');
  try{
   const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
   if(!res.ok) throw new Error('HTTP '+res.status);
   const text = await res.text();
   if(!text.includes('BEGIN:VCALENDAR')) throw new Error('Format iCal invalide');
   saveUrl(key, url);
   processICS(text, key);
  } catch(ex){
   setErr(`Erreur : ${ex.message}. Vérifiez que l'agenda est public.`);
  }
  setLoading(false);
 };

 const handleFile = e => {
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>processICS(ev.target.result, activeKey);
  r.readAsText(f,'UTF-8');
 };

 const doImport = () => {
  let nLoc=0, nBras=0, uLoc=0, uBras=0;

  const toImpLoc = parsed.location.filter(e=>selected.location.includes(e.id));
  if(toImpLoc.length){
   const usedUids = new Set(locations.filter(l=>l.icsUid).map(l=>l.icsUid));
   const newLocs  = toImpLoc.filter(e=>!usedUids.has(e.icsUid));
   const updLocs  = toImpLoc.filter(e=>usedUids.has(e.icsUid));
   nLoc = newLocs.length; uLoc = updLocs.length;
   setLocations(prev=>{
    let r=[...prev];
    updLocs.forEach(u=>{ r=r.map(l=>l.icsUid===u.icsUid?{...l,...u,id:l.id}:l); });
    return [...newLocs,...r];
   });
  }

  const toImpBras = parsed.brassin.filter(e=>selected.brassin.includes(e.id));
  if(toImpBras.length){
   const usedUids = new Set(brassins.filter(b=>b.icsUid).map(b=>b.icsUid));
   const newBras  = toImpBras.filter(e=>!usedUids.has(e.icsUid));
   const updBras  = toImpBras.filter(e=>usedUids.has(e.icsUid));
   nBras = newBras.length; uBras = updBras.length;
   setBrassins(prev=>{
    let r=[...prev];
    updBras.forEach(u=>{ r=r.map(b=>b.icsUid===u.icsUid?{...b,...u,id:b.id}:b); });
    return [...newBras,...r];
   });
  }

  setImportStats({nLoc,nBras,uLoc,uBras});
  setStep('done');
 };

 const Card = ({children,style={}}) => (
  <div style={{background:C.bgCard,borderRadius:10,padding:'14px 16px',
   marginBottom:10,border:`1px solid ${C.border}`,...style}}>
   {children}
  </div>
 );
 const Lbl = ({children}) => (
  <div style={{fontSize:9,color:C.amber,fontFamily:FM,
   fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6}}>
   {children}
  </div>
 );
 const totalNew = parsed.location.filter(e=>!e._exists).length
        + parsed.brassin.filter(e=>!e._exists).length;
 const totalUpd = parsed.location.filter(e=>e._exists).length
        + parsed.brassin.filter(e=>e._exists).length;

 if(step==='done'&&importStats) return(
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{textAlign:'center',padding:'40px 20px'}}>
    <div style={{fontSize:52,marginBottom:14}}>✅</div>
    <div style={{fontFamily:FA,fontSize:22,
     color:C.ok,marginBottom:10}}>Synchronisation réussie</div>
    <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:260,margin:'0 auto'}}>
     {importStats.nLoc>0&&<div style={{background:C.bgCard,borderRadius:8,padding:'10px 14px',
      border:`1px solid ${C.border}`,fontSize:13,color:C.textMid,textAlign:'left'}}>
      🍻 {importStats.nLoc} nouvelle{importStats.nLoc>1?'s':''} location{importStats.nLoc>1?'s':''}
     </div>}
     {importStats.uLoc>0&&<div style={{background:C.bgCard,borderRadius:8,padding:'10px 14px',
      border:`1px solid ${C.border}`,fontSize:13,color:C.textMid,textAlign:'left'}}>
      🔄 {importStats.uLoc} location{importStats.uLoc>1?'s':''} mise{importStats.uLoc>1?'s':''} à jour
     </div>}
     {importStats.nBras>0&&<div style={{background:C.bgCard,borderRadius:8,padding:'10px 14px',
      border:`1px solid ${C.border}`,fontSize:13,color:C.textMid,textAlign:'left'}}>
      ⚗️ {importStats.nBras} nouveau{importStats.nBras>1?'x':''} brassin{importStats.nBras>1?'s':''}
     </div>}
     {importStats.uBras>0&&<div style={{background:C.bgCard,borderRadius:8,padding:'10px 14px',
      border:`1px solid ${C.border}`,fontSize:13,color:C.textMid,textAlign:'left'}}>
      🔄 {importStats.uBras} brassin{importStats.uBras>1?'s':''} mis à jour
     </div>}
     {!importStats.nLoc&&!importStats.uLoc&&!importStats.nBras&&!importStats.uBras&&(
      <div style={{fontSize:13,color:C.textLight}}>Aucun élément importé</div>
     )}
    </div>
    <button onClick={()=>{setStep('accueil');setParsed({location:[],brassin:[],autre:[]});}}
     style={{marginTop:24,padding:'11px 28px',borderRadius:8,border:'none',
      background:C.amber,color:C.bgDark,fontWeight:700,fontSize:14,cursor:'pointer'}}>
     ← Retour
    </button>
   </div>
  </div>
 );

 if(step==='preview') return(
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
    <button onClick={()=>setStep('accueil')}
     style={{background:'none',border:`1px solid ${C.border}`,borderRadius:20,
      padding:'6px 12px',fontSize:12,fontWeight:700,color:C.textMid,cursor:'pointer'}}>
     ← Retour
    </button>
    <h2 style={{fontFamily:FA,fontSize:18,color:C.text,flex:1}}>
     Aperçu — {totalNew} nouveaux · {totalUpd} MAJ
    </h2>
   </div>

   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
    {[
     {icon:'🍻',label:'Locations',count:parsed.location.length,
     color:C.green,key:'location'},
     {icon:'⚗️',label:'Brassins',count:parsed.brassin.length,
     color:C.amber,key:'brassin'},
    ].map(cat=>(
     <div key={cat.key} style={{background:C.bgCard,borderRadius:10,
      padding:'10px 12px',border:`1px solid ${C.border}`,
      borderLeft:`3px solid ${cat.color}`}}>
      <div style={{fontSize:18,marginBottom:4}}>{cat.icon}</div>
      <div style={{fontFamily:FA,fontSize:20,
       color:cat.color}}>{cat.count}</div>
      <div style={{fontSize:10,color:C.textLight,
       fontFamily:FM,textTransform:'uppercase',
       letterSpacing:0.8}}>{cat.label}</div>
     </div>
    ))}
   </div>

   {[
    {key:'location',icon:'🍻',label:'Locations tireuses',
    selKey:'location',color:C.green},
    {key:'brassin', icon:'⚗️',label:'Brassins planifiés',
    selKey:'brassin',color:C.amber},
   ].map(cat=>parsed[cat.key].length>0&&(
    <div key={cat.key} style={{marginBottom:14}}>
     <div style={{display:'flex',justifyContent:'space-between',
      alignItems:'center',marginBottom:8}}>
      <div style={{fontSize:11,fontWeight:700,color:cat.color,
       fontFamily:FM,textTransform:'uppercase',
       letterSpacing:0.8}}>
       {cat.icon} {cat.label}
      </div>
      <button onClick={()=>setSelected(s=>({...s,
       [cat.selKey]:s[cat.selKey].length===parsed[cat.key].length
        ?[]:parsed[cat.key].map(e=>e.id)}))}
       style={{fontSize:10,color:C.textMid,background:'none',
        border:`1px solid ${C.border}`,borderRadius:6,
        padding:'3px 8px',cursor:'pointer'}}>
       Tout {selected[cat.selKey].length===parsed[cat.key].length?'désélect.':'cocher'}
      </button>
     </div>
     {parsed[cat.key].map(evt=>{
      const sel = selected[cat.selKey].includes(evt.id);
      return(
       <div key={evt.id}
        onClick={()=>setSelected(s=>({...s,
         [cat.selKey]:sel
          ?s[cat.selKey].filter(x=>x!==evt.id)
          :[...s[cat.selKey],evt.id]}))}
        style={{display:'flex',alignItems:'flex-start',gap:8,
         padding:'10px 12px',borderRadius:8,marginBottom:5,cursor:'pointer',
         background:sel?C.amberPale:C.bgCard,
         border:`1.5px solid ${sel?C.amber:C.border}`,
         borderLeft:`3px solid ${evt._exists?C.warn:cat.color}`,
         opacity:sel?1:0.7,transition:'all 0.15s'}}>
        <div style={{width:18,height:18,borderRadius:3,flexShrink:0,marginTop:1,
         border:`2px solid ${sel?C.amber:C.border}`,
         background:sel?C.amber:'transparent',
         display:'flex',alignItems:'center',justifyContent:'center',
         fontSize:10,color:C.bgDark,fontWeight:900}}>
         {sel?'✓':''}
        </div>
        <div style={{flex:1,minWidth:0}}>
         <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:2}}>
          <div style={{fontWeight:700,color:C.cream,fontSize:13,
           overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>
           {cat.key==='location'?evt.client:evt.recette||evt.summary}
          </div>
          {evt._exists&&<span style={{flexShrink:0,fontSize:8,fontWeight:700,
           color:C.warn,background:C.bgDark,border:`1px solid ${C.warn}40`,
           padding:'1px 5px',borderRadius:3,fontFamily:FM,
           letterSpacing:0.5}}>MAJ</span>}
         </div>
         <div style={{fontFamily:FM,fontSize:9,
          color:C.textLight}}>
          📅 {evt.dateDebut}{evt.dateFin&&evt.dateFin!==evt.dateDebut?` → ${evt.dateFin}`:''}
          {cat.key==='location'&&evt.tireuses?.length>0&&
           ` · ${evt.tireuses.length} tireuse${evt.tireuses.length>1?'s':''}`}
          {cat.key==='brassin'&&evt.volume>0&&` · ${evt.volume}L`}
         </div>
        </div>
       </div>
      );
     })}
    </div>
   ))}

   {parsed.autre.length>0&&(
    <div style={{background:C.bgDark,borderRadius:8,padding:'10px 14px',
     marginBottom:14,border:`1px solid ${C.border}`}}>
     <div style={{fontSize:10,color:C.textLight,fontFamily:FM}}>
      📋 {parsed.autre.length} événement{parsed.autre.length>1?'s':''} non reconnu{parsed.autre.length>1?'s':''} (ignoré{parsed.autre.length>1?'s':''})
     </div>
    </div>
   )}

   <button onClick={doImport}
    disabled={!selected.location.length&&!selected.brassin.length}
    style={{width:'100%',padding:'13px',borderRadius:10,border:'none',
     background:C.amber,color:C.bgDark,fontWeight:700,fontSize:14,cursor:'pointer',
     opacity:(!selected.location.length&&!selected.brassin.length)?0.4:1}}>
    ✓ Importer ({selected.location.length+selected.brassin.length} éléments)
   </button>
  </div>
 );

 return(
  <div style={{padding:'16px',paddingBottom:80}}>
   <h2 style={{fontFamily:FA,
    fontSize:'clamp(20px,5vw,26px)',color:C.text,marginBottom:4}}>
    Google Agenda
   </h2>
   <p style={{fontSize:12,color:C.textLight,
    fontFamily:FM,marginBottom:16}}>
    Synchronisation automatique des locations et brassins
   </p>

   <div style={{display:'flex',gap:6,marginBottom:14}}>
    {[
     {key:'tireuses', label:'🍻 Tireuses / Événements',color:C.green},
     {key:'brasserie',label:'⚗️ Brasserie / Production',color:C.amber},
    ].map(opt=>(
     <button key={opt.key} onClick={()=>{setActiveKey(opt.key);setErr('');}}
      style={{flex:1,padding:'8px 6px',borderRadius:8,fontWeight:600,fontSize:11,
       border:`1.5px solid ${activeKey===opt.key?opt.color:C.border}`,
       background:activeKey===opt.key?`${opt.color}18`:'transparent',
       color:activeKey===opt.key?opt.color:C.textMid,minHeight:38,cursor:'pointer'}}>
      {opt.label}
     </button>
    ))}
   </div>

   {urls[activeKey]&&(
    <Card style={{background:C.amberPale,border:`1.5px solid ${C.amber}60`,marginBottom:14}}>
     <div style={{display:'flex',justifyContent:'space-between',
      alignItems:'flex-start',marginBottom:6}}>
      <div style={{flex:1,minWidth:0}}>
       <Lbl>Agenda mémorisé — {activeKey==='tireuses'?'Locations':'Brasserie'}</Lbl>
       <div style={{fontSize:9,color:C.textMid,fontFamily:FM,
        wordBreak:'break-all',lineHeight:1.4,maxWidth:220}}>
        {urls[activeKey].replace('https://calendar.google.com','gcal').slice(0,60)}…
       </div>
       {lastSyncs[activeKey]&&<div style={{fontSize:9,color:C.amberL,
        fontFamily:FM,marginTop:3}}>
        Synchro: {lastSyncs[activeKey].toLocaleDateString('fr-FR',
         {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
       </div>}
      </div>
      <button onClick={()=>syncUrl(activeKey)} disabled={loading}
       style={{flexShrink:0,padding:'8px 14px',borderRadius:8,border:'none',
        background:C.amber,color:C.bgDark,fontWeight:700,fontSize:12,
        cursor:'pointer',minWidth:80}}>
       {loading?'…':'🔄 Sync'}
      </button>
     </div>
     <button onClick={()=>{
      const k=KEYS[activeKey];
      try{localStorage.removeItem(k);}catch(e){}
      setUrls(prev=>({...prev,[activeKey]:''}));
     }}
      style={{fontSize:9,color:C.textLight,background:'none',border:'none',
       cursor:'pointer',textDecoration:'underline',fontFamily:FM}}>
      Supprimer l'URL
     </button>
    </Card>
   )}

   <Card>
    <Lbl>URL iCal Google Agenda</Lbl>
    <input value={urls[activeKey]||''}
     onChange={e=>setUrls(prev=>({...prev,[activeKey]:e.target.value}))}
     placeholder="https://calendar.google.com/calendar/ical/…"
     style={{...iSt,marginBottom:8,fontSize:12,fontFamily:FM}}/>
    {err&&<div style={{fontSize:11,color:C.alert,marginBottom:8,lineHeight:1.4}}>{err}</div>}
    <button onClick={()=>syncUrl(activeKey)} disabled={loading}
     style={{width:'100%',padding:'11px',borderRadius:8,border:'none',
      background:C.amber,color:C.bgDark,fontWeight:700,fontSize:13,cursor:'pointer',
      opacity:loading?0.6:1}}>
     {loading?'Chargement…':'🔄 Synchroniser'}
    </button>
   </Card>

   <Card style={{background:C.bgDark}}>
    <Lbl>Comment obtenir l'URL iCal ?</Lbl>
    {[
     ['1','Ouvrez Google Agenda sur ordinateur (pas mobile)'],
     ['2','⋮ à côté de votre agenda → "Paramètres et partage"'],
     ['3','Descendez jusqu\'à "Intégrer l\'agenda"'],
     ['4','Copiez l\'adresse iCal (lien en .ics)'],
     ['5','Collez l\'URL ci-dessus et cliquez Synchroniser'],
    ].map(([n,t])=>(
     <div key={n} style={{display:'flex',gap:10,alignItems:'flex-start',
      marginBottom:7,fontSize:12,color:C.textMid,lineHeight:1.4}}>
      <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,
       background:C.amber,color:C.bgDark,display:'flex',alignItems:'center',
       justifyContent:'center',fontSize:9,fontWeight:900,marginTop:1}}>{n}</div>
      {t}
     </div>
    ))}
    <div style={{marginTop:8,padding:'8px 10px',background:C.bgCard,borderRadius:6,
     border:`1px solid ${C.border}`,fontSize:10,color:C.amber,
     fontFamily:FM,lineHeight:1.6}}>
     ⚠ L'agenda doit être "Accessible au public" pour que l'URL fonctionne
    </div>
    <div style={{marginTop:6,padding:'8px 10px',background:C.bgCard,borderRadius:6,
     border:`1px solid ${C.border}`,fontSize:10,color:C.textLight,lineHeight:1.6}}>
     💡 Détection automatique : les événements contenant "tireuse", "location",
     "réservation" sont importés comme locations. Ceux avec "brassin", "brassage"
     ou un nom de recette sont importés comme brassins planifiés.
    </div>
   </Card>

   <Card>
    <Lbl>Ou importer un fichier .ics</Lbl>
    <div style={{fontSize:12,color:C.textMid,marginBottom:8,lineHeight:1.5}}>
     Google Agenda → ⚙ Paramètres → Importer/Exporter → Exporter
    </div>
    <label style={{display:'flex',alignItems:'center',justifyContent:'center',
      width:'100%',minHeight:48,padding:'11px',boxSizing:'border-box',
      border:`1.5px dashed ${C.border}`,borderRadius:8,cursor:'pointer',
      background:C.bgCard,color:C.text,fontWeight:700,fontSize:14,gap:8}}>
     <input type="file" accept=".ics,text/calendar"
      style={{position:'absolute',opacity:0,pointerEvents:'none',width:0,height:0}}
      onChange={handleFile}/>
     📂 Choisir un fichier .ics
    </label>
   </Card>

   {(locations.filter(l=>l.icsUid).length>0||brassins.filter(b=>b.icsUid).length>0)&&(
    <Card style={{background:C.bgDark}}>
     <div style={{fontSize:11,color:C.textMid,fontFamily:FM}}>
      📊 {locations.filter(l=>l.icsUid).length} location{locations.filter(l=>l.icsUid).length!==1?'s':''} ·{' '}
      {brassins.filter(b=>b.icsUid).length} brassin{brassins.filter(b=>b.icsUid).length!==1?'s':''}{' '}
      importés depuis Google Agenda
     </div>
    </Card>
   )}
  </div>
 );
}

function ModuleAnticipation({brassins,setBrassins,recettes,locations,stock,stockPF,condSessions}){
 const [horizon, setHorizon] = useState(8); // semaines

 const today   = new Date(); today.setHours(0,0,0,0);
 const addW    = n => { const d=new Date(today); d.setDate(d.getDate()+n*7); return d; };
 const fmtD    = d => d.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});

 const locsAVenir = locations.filter(l=>{
  if(['retournée','annulée'].includes(l.statut)) return false;
  const fin = new Date(l.dateFin+'T23:59');
  return fin >= today && fin <= addW(horizon);
 });

 const besoinsLoc = {};
 locsAVenir.forEach(l=>{
  (l.futs||[]).forEach(f=>{
   if(!f.biere) return;
   besoinsLoc[f.biere] = (besoinsLoc[f.biere]||0) + (f.volTotal||0);
  });
 });

 const stockBieres = {};
 brassins.filter(b=>b.statut==='terminé'&&b.volume>0).forEach(b=>{
  if(!stockBieres[b.recette]) stockBieres[b.recette]=0;
  stockBieres[b.recette] += b.volume;
 });
 const enFerm = brassins.filter(b=>['fermentation','garde','conditionnement'].includes(b.statut));

 const manques = Object.entries(besoinsLoc).map(([biere,volNecessaire])=>{
  const dispo       = stockBieres[biere]||0;
  const disponibles = enFerm.filter(b=>b.recette===biere);
  const volEnCours  = disponibles.reduce((s,b)=>s+(b.volume||0),0);
  const manque      = Math.max(0, volNecessaire - dispo);
  const couvert     = manque <= volEnCours;
  const rec         = recettes.find(r=>r.nom===biere);
  return {biere,volNecessaire,dispo,volEnCours,manque,couvert,rec,disponibles};
 });

 const FERM_JOURS_DEFAUT = {
  "L'Impèrtinente":22,"La Pèrchée":18,"La Pèrilleuse":17,"La Pèrlimpinpin":21,
  "La Supère":28,"La Blonde des Papas":14,"La Mèrveilleuse":18,"La Mèrlimpinpin":21,
  "La Mary'Stout":18,"La Mamagascar":20,"La Chromamatik":18,"La Cold IPA":20,
  "La Daarønn":10,"La Daddy Cool Gose":18,"La Habemouss Papa":12,
  "La Mamagascard":20,"La Mèrcure":14,"La Papa Poule":14,
  "La Queen Bee":16,"La Témèraire":18,
 };
 const fermJours = b => FERM_JOURS_DEFAUT[b]||16;

 const suggestions = manques
  .filter(m=>m.manque>0&&!m.couvert)
  .map(m=>{
   const locProche = locsAVenir
    .filter(l=>(l.futs||[]).some(f=>f.biere===m.biere))
    .sort((a,b)=>new Date(a.dateDebut)-new Date(b.dateDebut))[0];
   const dateLimite = locProche ? new Date(locProche.dateDebut+'T00:00') : addW(horizon);
   const joursFerm = fermJours(m.biere);
   const dateBrassage = new Date(dateLimite);
   dateBrassage.setDate(dateLimite.getDate() - joursFerm - 2);
   const volBrassin = Math.ceil(m.manque/100)*100;
   const enRetard   = dateBrassage < today;
   const urgent     = (dateBrassage - today) / 86400000 < 7;
   return {...m, locProche, dateBrassage, dateLimite, volBrassin, enRetard, urgent, joursFerm};
  })
  .sort((a,b)=>a.dateBrassage-b.dateBrassage);

 const semaines = Array.from({length:horizon},(_,i)=>{
  const debut = addW(i);
  const fin   = addW(i+1);
  const locs  = locsAVenir.filter(l=>{
   const d=new Date(l.dateDebut+'T00:00'); const f=new Date(l.dateFin+'T23:59');
   return d < fin && f >= debut;
  });
  const sug   = suggestions.filter(s=>s.dateBrassage>=debut&&s.dateBrassage<fin);
  return {i,debut,fin,locs,sug};
 });

 const creerBrassin = sug => {
  if(!sug.rec) return;
  const dateStr = sug.dateBrassage < today
   ? today.toISOString().split('T')[0]
   : sug.dateBrassage.toISOString().split('T')[0];
  const newB = {
   id:        Date.now(),
   recette:   sug.biere,
   volume:    sug.volBrassin,
   statut:    'planifié',
   dateDebut: dateStr,
   fermenteur:'',
   og:        sug.rec.og||null,
   fg:        sug.rec.fg||null,
   abv:       sug.rec.abv||null,
   mesures:   [],
   notes:     `Planifié auto — besoin location ${sug.locProche?.client||'à venir'}`,
   paliersMash:[],houblonsDetail:[],resucrage:{},
  };
  setBrassins(prev=>[newB,...prev]);
 };

 const cardS = {background:C.bgCard,borderRadius:12,padding:'14px 16px',
  marginBottom:12,border:`1px solid ${C.border}`};
 const Lbl = ({children,color=C.amber})=>(
  <div style={{fontSize:9,color,fontFamily:FM,fontWeight:700,
   letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>{children}</div>
 );

 const totalManque = manques.reduce((s,m)=>s+m.manque,0);
 const totalSugg   = suggestions.length;
 const locsTotal   = locsAVenir.length;

 return(
  <div style={{padding:'16px',paddingBottom:80}}>
   <div style={{marginBottom:16}}>
    <h2 style={{fontFamily:FA,
     fontSize:'clamp(20px,5vw,26px)',color:C.text,marginBottom:4}}>
     Anticipation brassins
    </h2>
    <p style={{color:C.textLight,fontSize:12,fontFamily:FM,marginBottom:12}}>
     Analyse des besoins sur les {horizon} prochaines semaines
    </p>

    <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:14}}>
     <span style={{fontSize:11,color:C.textLight,fontFamily:FM}}>Horizon :</span>
     {[4,6,8,12].map(h=>(
      <button key={h} onClick={()=>setHorizon(h)}
       style={{padding:'5px 11px',borderRadius:14,border:`1.5px solid ${horizon===h?C.amber:C.border}`,
        background:horizon===h?C.amberPale:'transparent',color:horizon===h?C.amber:C.textMid,
        fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:FM}}>
       {h} sem.
      </button>
     ))}
    </div>
   </div>

   <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20}}>
    {[
     ['Locations à venir', locsTotal,    C.green,  '🍺'],
     ['Bières concernées', Object.keys(besoinsLoc).length, C.amber, '🛢'],
     ['Volume manquant',   `${totalManque}L`, totalManque>0?C.alert:C.ok, '⚠'],
     ['Brassins à planifier', totalSugg, totalSugg>0?C.alert:C.ok, '⚗️'],
    ].map(([l,v,col,icon])=>(
     <div key={l} style={{background:C.bgCard,borderRadius:10,padding:'12px',
      border:`1px solid ${C.border}`,borderTop:`3px solid ${col}`,textAlign:'center'}}>
      <div style={{fontSize:24,marginBottom:4}}>{icon}</div>
      <div style={{fontFamily:FM,fontWeight:700,
       fontSize:20,color:col,lineHeight:1}}>{v}</div>
      <div style={{fontSize:9,color:C.textLight,textTransform:'uppercase',
       letterSpacing:0.8,marginTop:4}}>{l}</div>
     </div>
    ))}
   </div>

   {suggestions.length>0&&(
    <div style={cardS}>
     <Lbl color={C.alert}>⚗️ Brassins à planifier ({suggestions.length})</Lbl>
     <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {suggestions.map((s,i)=>(
       <div key={`k${i}`} style={{background:s.enRetard?C.alert+'15':s.urgent?C.amberPale:C.bgDark,
        border:`1px solid ${s.enRetard?C.alert:s.urgent?C.amber:C.border}`,
        borderRadius:10,padding:'12px 14px',
        borderLeft:`4px solid ${s.enRetard?C.alert:s.urgent?C.amber:C.green}`}}>
        <div style={{display:'flex',justifyContent:'space-between',
         alignItems:'flex-start',marginBottom:8}}>
         <div>
          <div style={{fontFamily:FA,fontSize:18,
           color:C.text,marginBottom:3}}>{s.biere}</div>
          <div style={{fontSize:11,color:C.textLight,
           fontFamily:FM}}>
           {s.locProche&&`Pour : ${s.locProche.client} — ${fmtD(new Date(s.locProche.dateDebut+'T00:00'))}`}
          </div>
         </div>
         <div style={{display:'flex',gap:6,alignItems:'center'}}>
          {s.enRetard&&<span style={{fontSize:10,fontWeight:700,color:C.alert,
           background:C.alert+'20',border:`1px solid ${C.alert}`,
           borderRadius:6,padding:'2px 8px',fontFamily:FM}}>
           EN RETARD
          </span>}
          {s.urgent&&!s.enRetard&&<span style={{fontSize:10,fontWeight:700,color:C.amber,
           background:C.amberPale,border:`1px solid ${C.amber}`,
           borderRadius:6,padding:'2px 8px',fontFamily:FM}}>
           URGENT
          </span>}
         </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
         gap:8,marginBottom:12}}>
         {[
          ['Brasser avant', fmtD(s.dateBrassage), s.enRetard?C.alert:C.amber],
          ['Volume suggéré', `${s.volBrassin}L`, C.amber],
          ['Manque actuel', `${s.manque}L`, C.alert],
          ['Fermentation', `~${s.joursFerm}j`, C.textMid],
         ].map(([l,v,col])=>(
          <div key={l} style={{background:C.bgCard,borderRadius:8,padding:'8px',
           textAlign:'center',border:`1px solid ${C.border}`}}>
           <div style={{fontFamily:FM,fontWeight:700,
            fontSize:14,color:col,lineHeight:1}}>{v}</div>
           <div style={{fontSize:8,color:C.textLight,marginTop:3,
            textTransform:'uppercase',letterSpacing:0.5}}>{l}</div>
          </div>
         ))}
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center',
         marginBottom:12,fontSize:11,color:C.textMid,
         fontFamily:FM}}>
         <span>Stock dispo : <strong style={{color:C.cream}}>{s.dispo}L</strong></span>
         <span>Besoin : <strong style={{color:C.amber}}>{s.volNecessaire}L</strong></span>
         {s.volEnCours>0&&<span>En fermentation : <strong style={{color:C.green}}>{s.volEnCours}L</strong></span>}
        </div>

        {s.rec&&(
         <div style={{marginBottom:12,padding:'8px 10px',borderRadius:7,
          background:C.bgCard,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:9,color:C.textLight,fontFamily:FM,
           textTransform:'uppercase',letterSpacing:1,marginBottom:5}}>
           Ingrédients clés (pour {s.volBrassin}L)
          </div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
           {(s.rec.ingredients||[]).filter(ing=>['kg'].includes(ing.u)&&ing.qte>0).slice(0,6).map((ing,ii)=>{
            const ratio = s.volBrassin / (s.rec.volume||300);
            const qteN  = Math.round(ing.qte*ratio*10)/10;
            const stk   = findStock(stock,ing.nom);
            const ok    = stk&&stk.qte>=qteN;
            return(
             <div key={ii} style={{display:'flex',alignItems:'center',gap:4,
              background:ok?C.greenPale:C.bgDark,
              border:`1px solid ${ok?C.green:C.alert}`,
              borderRadius:5,padding:'2px 7px',fontSize:9,
              fontFamily:FM}}>
              <span style={{color:ok?C.ok:C.alert}}>{ok?'✓':'⚠'}</span>
              <span style={{color:C.textMid}}>{ing.nom}</span>
              <span style={{color:ok?C.ok:C.alert,fontWeight:700}}>{qteN}kg</span>
             </div>
            );
           })}
          </div>
         </div>
        )}

        <button onClick={()=>creerBrassin(s)}
         style={{width:'100%',padding:'10px',borderRadius:8,border:'none',
          background:s.enRetard?C.alert:C.amber,color:C.bgDark,
          fontWeight:700,fontSize:13,cursor:'pointer',
          fontFamily:FB,letterSpacing:0.5}}>
         ⚗ Créer ce brassin ({s.volBrassin}L — {fmtD(s.dateBrassage)})
        </button>
       </div>
      ))}
     </div>
    </div>
   )}

   {suggestions.length===0&&manques.length>0&&(
    <div style={{...cardS,background:C.greenPale,border:`1px solid ${C.green}`,
     textAlign:'center',padding:'24px'}}>
     <div style={{fontSize:36,marginBottom:8}}>✅</div>
     <div style={{fontFamily:FB,fontWeight:700,
      fontSize:18,color:C.ok}}>
      Tous les besoins sont couverts
     </div>
     <div style={{fontSize:12,color:C.textMid,marginTop:4}}>
      Les brassins en cours couvrent toutes les locations à venir
     </div>
    </div>
   )}

   {manques.length>0&&(
    <div style={cardS}>
     <Lbl>Besoins par bière — {horizon} semaines</Lbl>
     {manques.map((m,i)=>{
      const pctDispo = m.volNecessaire>0 ? Math.min(100,Math.round(m.dispo/m.volNecessaire*100)) : 100;
      const pctCours = m.volNecessaire>0 ? Math.min(100-pctDispo,Math.round(m.volEnCours/m.volNecessaire*100)) : 0;
      return(
       <div key={`k${i}`} style={{marginBottom:12,paddingBottom:12,
        borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:'flex',justifyContent:'space-between',
         alignItems:'center',marginBottom:6}}>
         <div>
          <div style={{fontWeight:600,color:C.text,fontSize:13}}>{m.biere}</div>
          <div style={{fontSize:10,color:C.textLight,fontFamily:FM,marginTop:1}}>
           Besoin : {m.volNecessaire}L · Dispo : {m.dispo}L
           {m.volEnCours>0&&` · En fermentation : ${m.volEnCours}L`}
          </div>
         </div>
         <div style={{textAlign:'right'}}>
          {m.manque>0?(
           <div style={{fontSize:12,fontWeight:700,color:m.couvert?C.ok:C.alert,
            fontFamily:FM}}>
            {m.couvert?'✓ Couvert':`⚠ −${m.manque}L`}
           </div>
          ):(
           <div style={{fontSize:12,fontWeight:700,color:C.ok,
            fontFamily:FM}}>✓ OK</div>
          )}
         </div>
        </div>
        <div style={{height:6,background:C.bgDark,borderRadius:4,overflow:'hidden',display:'flex'}}>
         <div style={{height:'100%',background:C.green,
          width:`${pctDispo}%`,transition:'width 0.5s'}}/>
         <div style={{height:'100%',background:C.hop,
          width:`${pctCours}%`,transition:'width 0.5s'}}/>
        </div>
        <div style={{display:'flex',gap:10,marginTop:3}}>
         <div style={{display:'flex',gap:4,alignItems:'center'}}>
          <div style={{width:8,height:8,borderRadius:2,background:C.green}}/>
          <span style={{fontSize:8,color:C.textLight,fontFamily:FM}}>
           Disponible ({pctDispo}%)
          </span>
         </div>
         {pctCours>0&&<div style={{display:'flex',gap:4,alignItems:'center'}}>
          <div style={{width:8,height:8,borderRadius:2,background:C.hop}}/>
          <span style={{fontSize:8,color:C.textLight,fontFamily:FM}}>
           En fermentation ({pctCours}%)
          </span>
         </div>}
        </div>
       </div>
      );
     })}
    </div>
   )}

   <div style={cardS}>
    <Lbl>Timeline — {horizon} semaines à venir</Lbl>
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
     {semaines.map(({i,debut,fin,locs,sug})=>{
      if(locs.length===0&&sug.length===0) return null;
      return(
       <div key={`k${i}`} style={{display:'flex',gap:10,alignItems:'flex-start',
        padding:'8px 10px',borderRadius:8,background:C.bgDark,
        border:`1px solid ${C.border}`}}>
        <div style={{flexShrink:0,width:100,textAlign:'right',
         fontSize:9,color:C.textLight,fontFamily:FM,
         lineHeight:1.4,paddingTop:2}}>
         <div style={{fontWeight:700,color:C.cream}}>
          {fmtD(debut)} →
         </div>
         <div>{fmtD(fin)}</div>
        </div>
        <div style={{flex:1}}>
         {sug.map((s,si)=>(
          <div key={si} style={{display:'flex',alignItems:'center',gap:6,
           marginBottom:4,padding:'4px 8px',borderRadius:6,
           background:s.enRetard?C.alert+'20':C.amberPale,
           border:`1px solid ${s.enRetard?C.alert:C.amber}`}}>
           <span style={{fontSize:12}}>⚗️</span>
           <span style={{fontSize:11,fontWeight:700,
            color:s.enRetard?C.alert:C.amber}}>
            Brasser {s.biere} — {s.volBrassin}L
           </span>
          </div>
         ))}
         {locs.map((l,li)=>(
          <div key={li} style={{display:'flex',alignItems:'center',gap:6,
           marginBottom:3,padding:'3px 8px',borderRadius:6,
           background:C.greenPale,border:`1px solid ${C.green}30`}}>
           <span style={{fontSize:11}}>🍺</span>
           <span style={{fontSize:11,color:C.greenL,fontWeight:600}}>
            {l.client}
           </span>
           <span style={{fontSize:9,color:C.textLight,
            fontFamily:FM}}>
            {(l.futs||[]).map(f=>`${f.nbFuts}×${f.typeFut} ${f.biere}`).join(' + ')}
           </span>
          </div>
         ))}
        </div>
       </div>
      );
     })}
    </div>
   </div>

   {locsAVenir.length===0&&(
    <div style={{textAlign:'center',padding:'60px 0',color:C.textLight}}>
     <div style={{fontSize:48,marginBottom:12}}>🗓</div>
     <div style={{fontSize:16,fontWeight:600}}>Aucune location prévue</div>
     <div style={{fontSize:12,marginTop:6}}>
      Ajoutez des locations de tireuses pour voir les besoins
     </div>
    </div>
   )}
  </div>
 );
}


function App() {

  /*    9 variables d'�tat principales    */
  const [stock,        setStock]        = useState(typeof STOCK_INIT        !== 'undefined' ? STOCK_INIT        : []);
  const [recettes,     setRecettes]     = useState(typeof RECETTES_INIT     !== 'undefined' ? RECETTES_INIT     : []);
  const [brassins,     setBrassins]     = useState(typeof PRODUCTION_INIT   !== 'undefined' ? PRODUCTION_INIT   : []);
  const [fournisseurs, setFournisseurs] = useState(typeof FOURNISSEURS_INIT !== 'undefined' ? FOURNISSEURS_INIT : []);
  const [stockCond,    setStockCond]    = useState(typeof STOCK_COND_INIT   !== 'undefined' ? STOCK_COND_INIT   : []);
  const [condSessions, setCondSessions] = useState(typeof COND_SESSIONS_INIT!== 'undefined' ? COND_SESSIONS_INIT: []);
  const [tireuses,     setTireuses]     = useState(typeof TIREUSES_INIT     !== 'undefined' ? TIREUSES_INIT     : []);
  const [locations,    setLocations]    = useState(typeof LOCATIONS_INIT    !== 'undefined' ? LOCATIONS_INIT    : []);
  const [stockPF,      setStockPF]      = useState([]);
  const [module,       setModule]       = useState('dashboard');

  /*    Contr�le Firebase    */
  const [fbReady,     setFbReady]     = useState(false);
  const saveTimerRef                  = useRef(null);
  const firstLoadRef                  = useRef(true);

  /*    Chargement initial depuis Firestore    */
  useEffect(() => {
    const splash = document.getElementById('splash');
    const root   = document.getElementById('root');
    const show   = () => {
      if (splash) splash.style.display = 'none';
      if (root)   root.style.display   = 'block';
    };
    const db = window._db;
    if (!db) { show(); setFbReady(true); return; }
    const unsub = db.collection('brasserie').doc('v1').onSnapshot(
      snap => {
        if (snap.exists && firstLoadRef.current) {
          const d = snap.data();
          if (Array.isArray(d.stock))        setStock(d.stock);
          if (Array.isArray(d.recettes))     setRecettes(d.recettes);
          if (Array.isArray(d.brassins))     setBrassins(d.brassins);
          if (Array.isArray(d.fournisseurs)) setFournisseurs(d.fournisseurs);
          if (Array.isArray(d.stockCond))    setStockCond(d.stockCond);
          if (Array.isArray(d.condSessions)) setCondSessions(d.condSessions);
          if (Array.isArray(d.tireuses))     setTireuses(d.tireuses);
          if (Array.isArray(d.locations))    setLocations(d.locations);
          if (Array.isArray(d.stockPF))      setStockPF(d.stockPF);
        }
        if (firstLoadRef.current) { firstLoadRef.current = false; show(); setFbReady(true); }
      },
      err => { console.error('Firebase lecture:', err); show(); setFbReady(true); }
    );
    return () => unsub();
  }, []);

  /*    Sauvegarde automatique (debounce 1,5 s)    */
  useEffect(() => {
    if (!fbReady) return;
    const db = window._db;
    if (!db) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      db.collection('brasserie').doc('v1').set({
        stock, recettes, brassins, fournisseurs,
        stockCond, condSessions, tireuses, locations, stockPF,
        _ts: new Date().toISOString(),
      }).catch(e => console.error('Firebase sauvegarde:', e));
    }, 1500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [stock, recettes, brassins, fournisseurs, stockCond, condSessions,
      tireuses, locations, stockPF, fbReady]);


 const alerts=stock.filter(s=>s.qte<=s.seuil).length;
 const alertsCond=stockCond.filter(s=>s.qte<=s.seuil).length;
 const actifs=brassins.filter(b=>b.statut!=='terminé').length;

 const locActives   = locations.filter(l=>l.statut==='confirmée'||l.statut==='en cours').length;
 const aEncaisser   = locations.filter(l=>l.statut==='retournée'&&!l.encaisse).length;
 const brassinsActifs = brassins.filter(b=>b.statut!=='terminé'&&b.statut!=='planifié');
 const brassinsPrets  = brassinsActifs.filter(b=>{
  const debut=new Date(b.dateDebut+'T00:00');
  const duree=(FERM_JOURS&&FERM_JOURS[b.recette])||21;
  const jr=Math.ceil((new Date(debut.getTime()+duree*86400000)-new Date())/86400000);
  return jr<=2;
 }).length;

 const FAMILLES = [
  {
   id:'accueil', label:'Accueil', icon:'🏠',
   modules:[{id:'dashboard',label:'Tableau de bord',icon:'🏠'}],
  },
  {
   id:'brasserie', label:'Brasserie', icon:'⚗️',
   badge: (actifs||0)+(brassinsPrets||0)||null,
   bc: brassinsPrets>0?C.ok:C.amber,
   modules:[
    {id:'production',     label:'Brassins',     icon:'⚗️', badge:actifs||null,        bc:C.amber},
    {id:'conditionnement',label:'Conditionnement',icon:'🍾',badge:alertsCond||null,   bc:alertsCond>0?C.alert:C.amber},
    {id:'recettes',       label:'Recettes',     icon:'📋'},
    {id:'prediction',     label:'Prédictions',  icon:'🔮', badge:brassinsPrets||null, bc:C.ok},
    {id:'historique',     label:'Historique',   icon:'📊'},
    {id:'agenda',         label:'Agenda',       icon:'🔄'},
    {id:'anticipation',   label:'Anticipation', icon:'🔮'},
   ],
  },
  {
   id:'locations', label:'Locations', icon:'🍻',
   badge: (locActives||0)+(aEncaisser||0)||null,
   bc: aEncaisser>0?C.alert:C.green,
   modules:[
    {id:'tireuses',      label:'Planning',      icon:'📅'},
    {id:'encaissement',  label:'Encaissements', icon:'💳', badge:aEncaisser||null, bc:C.alert},
   ],
  },
  {
   id:'ventes', label:'Ventes', icon:'🛒',
   modules:[
    {id:'catalogue',  label:'Catalogue',    icon:'🍺'},
    {id:'stockpf',    label:'Prod. finis',  icon:'📦'},
    {id:'pl',         label:'P&L',          icon:'💰'},
    {id:'simulation', label:'Simulation',   icon:'📈'},
   ],
  },
  {
   id:'achats', label:'Achats', icon:'📦',
   badge: alerts||null, bc: alerts>0?C.alert:C.amber,
   modules:[
    {id:'stocks',       label:'Stock matières', icon:'🌾', badge:alerts||null, bc:alerts>0?C.alert:C.amber},
    {id:'fournisseurs', label:'Fournisseurs',   icon:'🏭'},
    {id:'planification',label:'Agenda',         icon:'📅'},
   ],
  },
 ];

 const familleActive = FAMILLES.find(f=>f.modules.some(m=>m.id===module))?.id || 'accueil';
 const setFamille = fid => {
  const f = FAMILLES.find(x=>x.id===fid);
  if(f) setModule(f.modules[0].id);
 };
 const sousMods = FAMILLES.find(f=>f.id===familleActive)?.modules || [];

 // ── Responsive : desktop (≥768px) = sidebar, mobile = bottom nav ──────
 const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
 useEffect(() => {
   const onResize = () => setIsMobile(window.innerWidth < 768);
   window.addEventListener('resize', onResize);
   return () => window.removeEventListener('resize', onResize);
 }, []);

 // ── Thème sombre / clair ────────────────────────────────────────────
 const [theme, setTheme] = useState(() => {
  try { return localStorage.getItem('ppb_theme') || 'dark'; } catch(e) { return 'dark'; }
 });
 // Applique la palette avant chaque rendu (tous les composants enfants relisent C)
 Object.assign(C, theme === 'dark' ? C_DARK : C_LIGHT);
 const toggleTheme = () => {
  const next = theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('ppb_theme', next); } catch(e) {}
  setTheme(next);
 };

 const SIDEBAR_W = 220;

 // Module courant label + icone pour le header desktop
 const allMods = FAMILLES.flatMap(f => f.modules);
 const currentMod = allMods.find(m => m.id === module) || {label: 'Tableau de bord', icon: '🏠'};
 const currentFam = FAMILLES.find(f => f.modules.some(m => m.id === module)) || FAMILLES[0];

 return (
  <div style={{minHeight:'100vh',background:C.bg,fontFamily:"'Inter',sans-serif",color:C.text,display:'flex',flexDirection:'row',overflowX:'hidden'}}>
   <style>{FONTS}</style>

   {/* ── SIDEBAR DESKTOP ─────────────────────────────────────────── */}
   {!isMobile && (
    <aside style={{
     position:'fixed',top:0,left:0,bottom:0,
     width:SIDEBAR_W,
     background:C.bgCard,
     borderRight:`1px solid ${C.border}`,
     display:'flex',flexDirection:'column',
     zIndex:300,overflowY:'auto',
     scrollbarWidth:'none',
    }}>
     {/* Logo */}
     <div style={{padding:'24px 20px 20px',borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
       <div style={{width:36,height:36,borderRadius:10,
        background:`linear-gradient(135deg,${C.amber},${C.amberL})`,
        display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:20,flexShrink:0}}>🍺</div>
       <div>
        <div style={{fontFamily:FB,fontWeight:800,fontSize:13,
         color:C.text,lineHeight:1.2}}>Les Papas</div>
        <div style={{fontFamily:FB,fontWeight:800,fontSize:13,
         color:C.amber,lineHeight:1.2}}>Brasseurs</div>
       </div>
      </div>
      <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap'}}>
       <span style={{background:C.greenPale,color:C.greenL,fontSize:9,
        padding:'2px 8px',borderRadius:20,fontWeight:700,
        letterSpacing:0.5}}>🌿 FR-BIO-09</span>
       {actifs>0&&<span style={{background:C.amberPale,color:C.amberL,fontSize:9,
        padding:'2px 8px',borderRadius:20,fontWeight:700}}>⚗️ {actifs} actifs</span>}
      </div>
     </div>

     {/* Navigation */}
     <nav style={{flex:1,padding:'12px 0'}}>
      {FAMILLES.map(f => {
       const famAct = familleActive === f.id;
       return (
        <div key={f.id}>
         {/* Famille header */}
         <button onClick={()=>setFamille(f.id)} style={{
          width:'100%',display:'flex',alignItems:'center',gap:10,
          padding:'8px 20px',background:'none',border:'none',cursor:'pointer',
          color: famAct ? C.amber : C.textMid,
          fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',
          fontFamily:FM,transition:'color 0.15s',
         }}>
          <span style={{fontSize:14,opacity:famAct?1:0.6}}>{f.icon}</span>
          <span>{f.label}</span>
          {f.badge && <span style={{marginLeft:'auto',background:f.bc||C.amber,
           color:'#000',borderRadius:10,padding:'1px 6px',fontSize:9,fontWeight:900,
           minWidth:16,textAlign:'center'}}>{f.badge}</span>}
         </button>
         {/* Sous-modules si famille active */}
         {famAct && f.modules.length > 1 && f.modules.map(m => {
          const modAct = module === m.id;
          return (
           <button key={m.id} onClick={()=>setModule(m.id)} style={{
            width:'100%',display:'flex',alignItems:'center',gap:8,
            padding:'7px 20px 7px 40px',background: modAct ? `${C.amber}15` : 'none',
            border:'none',cursor:'pointer',
            borderLeft: modAct ? `2px solid ${C.amber}` : '2px solid transparent',
            color: modAct ? C.amber : C.textLight,
            fontSize:12,fontWeight: modAct ? 600 : 400,
            transition:'all 0.15s',
           }}>
            <span style={{fontSize:12}}>{m.icon}</span>
            <span style={{flex:1,textAlign:'left'}}>{m.label}</span>
            {m.badge && <span style={{background:m.bc||C.amber,color:'#000',
             borderRadius:10,padding:'1px 5px',fontSize:9,fontWeight:900}}>{m.badge}</span>}
           </button>
          );
         })}
         {famAct && f.modules.length === 1 && null}
        </div>
       );
      })}
     </nav>

     {/* Footer sidebar */}
     <div style={{padding:'16px 20px',borderTop:`1px solid ${C.border}`}}>
      <div style={{fontSize:10,color:C.textLight,lineHeight:1.6}}>
       <div style={{fontWeight:600,color:C.textMid,marginBottom:2}}>Clisson · Loire-Atlantique</div>
       <div>Microbrasserie artisanale</div>
       <div style={{color:C.green,marginTop:4}}>🌿 Certifiée bio FR-BIO-09</div>
      </div>
      <button onClick={toggleTheme} style={{
       marginTop:10,width:'100%',padding:'7px 12px',
       background:C.bgDark2,border:`1px solid ${C.border}`,
       borderRadius:8,cursor:'pointer',
       display:'flex',alignItems:'center',gap:8,
       fontSize:11,color:C.textMid,fontFamily:FM,
       transition:'all 0.15s',
      }}>
       <span style={{fontSize:13}}>{theme==='dark'?'☀️':'🌙'}</span>
       <span>{theme==='dark'?'Mode clair':'Mode sombre'}</span>
      </button>
     </div>
    </aside>
   )}

   {/* ── ZONE PRINCIPALE ─────────────────────────────────────────── */}
   <div style={{
    flex:1,
    marginLeft: isMobile ? 0 : SIDEBAR_W,
    minHeight:'100vh',
    display:'flex',flexDirection:'column',
   }}>
    {/* Header desktop */}
    {!isMobile && (
     <header style={{
      position:'sticky',top:0,zIndex:100,
      background:`${C.bg}ee`,
      backdropFilter:'blur(12px)',
      borderBottom:`1px solid ${C.border}`,
      padding:'0 28px',
      display:'flex',alignItems:'center',
      justifyContent:'space-between',
      height:60,
      flexShrink:0,
     }}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
       <span style={{color:C.textLight,fontSize:13}}>{currentFam.icon} {currentFam.label}</span>
       {sousMods.length > 1 && <>
        <span style={{color:C.border}}>›</span>
        <span style={{color:C.text,fontSize:13,fontWeight:600}}>{currentMod.icon} {currentMod.label}</span>
       </>}
      </div>
      {/* Sous-modules tabs (desktop header) + toggle thème */}
      <div style={{display:'flex',alignItems:'center',gap:8}}>
      {sousMods.length > 1 && (
       <div style={{display:'flex',gap:2}}>
        {sousMods.map(m => {
         const act = module === m.id;
         return (
          <button key={m.id} onClick={()=>setModule(m.id)} style={{
           padding:'6px 14px',background: act ? `${C.amber}20` : 'none',
           border:'none',borderRadius:8,cursor:'pointer',
           color: act ? C.amber : C.textLight,
           fontSize:12,fontWeight: act ? 700 : 400,
           display:'flex',alignItems:'center',gap:5,
           transition:'all 0.15s',
          }}>
           {m.icon} {m.label}
           {m.badge && <span style={{background:m.bc||C.amber,color:'#000',
            borderRadius:10,padding:'1px 5px',fontSize:9,fontWeight:900}}>{m.badge}</span>}
          </button>
         );
        })}
       </div>
      )}
      <button onClick={toggleTheme} style={{
       background:C.bgDark2,border:`1px solid ${C.border}`,
       borderRadius:8,padding:'5px 12px',cursor:'pointer',
       fontSize:12,color:C.textMid,fontFamily:FM,
       display:'flex',alignItems:'center',gap:6,flexShrink:0,
       transition:'all 0.15s',
      }}>
       <span style={{fontSize:14}}>{theme==='dark'?'☀️':'🌙'}</span>
       <span>{theme==='dark'?'Clair':'Sombre'}</span>
      </button>
      </div>
     </header>
    )}

    {/* Header mobile */}
    {isMobile && (
     <header style={{position:'sticky',top:0,zIndex:100,background:C.bgDark,
      borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
       padding:'10px 16px 0'}}>
       <div style={{fontFamily:FA,fontSize:18,color:C.amberL,lineHeight:1}}>
        Les Papas Brasseurs
       </div>
       <div style={{display:'flex',gap:5,alignItems:'center'}}>
        <span style={{background:C.greenPale,color:C.greenL,fontSize:9,
         padding:'2px 8px',borderRadius:4,fontWeight:700,letterSpacing:0.5}}>🌿 BIO</span>
        {actifs>0&&<span style={{background:C.amberPale,color:C.amberL,fontSize:9,
         padding:'2px 8px',borderRadius:4,fontWeight:700}}>⚗️ {actifs}</span>}
        <button onClick={toggleTheme} style={{
         background:C.bgCard,border:`1px solid ${C.border}`,
         borderRadius:6,padding:'2px 7px',cursor:'pointer',
         fontSize:13,lineHeight:1,minHeight:28,color:C.textMid,
        }}>{theme==='dark'?'☀️':'🌙'}</button>
       </div>
      </div>
      {sousMods.length>1&&(
       <div style={{display:'flex',overflowX:'auto',scrollbarWidth:'none',
        padding:'8px 12px 0',marginTop:8,borderTop:`1px solid ${C.border}`}}>
        {sousMods.map(m=>{
         const act=module===m.id;
         return (
          <button key={m.id} onClick={()=>setModule(m.id)}
           style={{flexShrink:0,padding:'6px 14px 8px',fontSize:11,
            fontWeight:700,fontFamily:FM,letterSpacing:0.5,
            textTransform:'uppercase',whiteSpace:'nowrap',
            background:'none',border:'none',cursor:'pointer',
            color:act?C.amber:C.textLight,
            borderBottom:act?`2px solid ${C.amber}`:'2px solid transparent',
            transition:'color 0.15s'}}>
           {m.icon} {m.label}
           {m.badge&&<span style={{marginLeft:4,background:m.bc||C.amber,
            color:C.bgDark,borderRadius:6,padding:'1px 5px',
            fontSize:8,fontWeight:900}}>{m.badge}</span>}
          </button>
         );
        })}
       </div>
      )}
     </header>
    )}

    {/* Contenu */}
    <main style={{
     flex:1,
     paddingBottom: isMobile ? 'calc(56px + env(safe-area-inset-bottom,0px))' : 24,
    }}>
    {module==='dashboard'       &&<ModuleDashboard stock={stock} brassins={brassins} fournisseurs={fournisseurs} condSessions={condSessions} recettes={recettes} stockCond={stockCond} stockPF={stockPF} locations={locations} setModule={setModule}/>}
    {module==='stocks'          &&<ModuleStocks stock={stock} setStock={setStock} fournisseurs={fournisseurs}/>}
    {module==='recettes'        &&<ModuleRecettes recettes={recettes} setRecettes={setRecettes} stock={stock} stockCond={stockCond}/>}
    {module==='production'      &&<ModuleProduction brassins={brassins} setBrassins={setBrassins} recettes={recettes}/>}
    {module==='conditionnement' &&<ModuleConditionnement brassins={brassins} setBrassins={setBrassins} stockCond={stockCond} setStockCond={setStockCond} condSessions={condSessions} setCondSessions={setCondSessions}/>}
    {module==='fournisseurs'    &&<ModuleFournisseurs fournisseurs={fournisseurs} setFournisseurs={setFournisseurs} stock={stock}/>}
    {module==='historique'      &&<ModuleHistorique brassins={brassins}/>}
    {module==='planification'   &&<ModulePlanification brassins={brassins} setBrassins={setBrassins} condSessions={condSessions} recettes={recettes} locations={locations}/>}
    {module==='tireuses'        &&<ModuleTireuses tireuses={tireuses} setTireuses={setTireuses} locations={locations} setLocations={setLocations} stockCond={stockCond} setStockCond={setStockCond} recettes={recettes}/>}
    {module==='stockpf'         &&<ModuleStockPF condSessions={condSessions} recettes={recettes} stockCond={stockCond} stockPF={stockPF} setStockPF={setStockPF}/>}
    {module==='catalogue'       &&<ModuleCatalogue recettes={recettes} setRecettes={setRecettes} brassins={brassins} stockPF={stockPF} condSessions={condSessions}/>}
    {module==='pl'              &&<ModulePL brassins={brassins} recettes={recettes} condSessions={condSessions} stockPF={stockPF} locations={locations} stock={stock} stockCond={stockCond}/>}
    {module==='encaissement'    &&<ModuleEncaissement locations={locations} setLocations={setLocations}/>}
    {module==='simulation'      &&<ModuleSimulation recettes={recettes} setRecettes={setRecettes} stock={stock} stockCond={stockCond} condSessions={condSessions} stockPF={stockPF}/>}
    {module==='prediction'      &&<ModulePrediction brassins={brassins} recettes={recettes}/>}
    {module==='agenda'          &&<ModuleAgendaImport locations={locations} setLocations={setLocations} brassins={brassins} setBrassins={setBrassins} recettes={recettes}/>}
    {module==='anticipation'   &&<ModuleAnticipation brassins={brassins} setBrassins={setBrassins} recettes={recettes} locations={locations} stock={stock} stockPF={stockPF} condSessions={condSessions}/>}
    </main>

   </div>{/* fin zone principale */}

   {/* ── BOTTOM NAV MOBILE UNIQUEMENT ────────────────────────────── */}
   {isMobile && (
   <nav style={{position:'fixed',bottom:0,left:0,right:0,
    background:C.bgDark,borderTop:`1px solid ${C.border}`,
    zIndex:200,paddingBottom:'env(safe-area-inset-bottom,0px)'}}>
    <div style={{display:'flex',height:56}}>
     {FAMILLES.map(f=>{
      const act = familleActive===f.id;
      return (
       <button key={f.id} onClick={()=>setFamille(f.id)}
        style={{flex:1,display:'flex',flexDirection:'column',
         alignItems:'center',justifyContent:'center',gap:2,
         background:'none',border:'none',cursor:'pointer',
         position:'relative',padding:'4px 2px',minHeight:56,
         transition:'opacity 0.15s'}}>
        {act&&<div style={{position:'absolute',top:0,left:'20%',right:'20%',
         height:2,background:C.amber,borderRadius:'0 0 2px 2px'}}/>}
        <span style={{fontSize:17,lineHeight:1,
         opacity:act?1:0.4,
         transition:'opacity 0.15s'}}>{f.icon}</span>
        <span style={{fontFamily:FM,
         fontSize:8.5,letterSpacing:0.3,textTransform:'uppercase',
         color:act?C.amber:C.textLight,fontWeight:act?700:400,
         whiteSpace:'nowrap'}}>
         {f.label}
        </span>
        {f.badge&&<div style={{position:'absolute',top:3,right:'8%',
         background:f.bc||C.amber,color:C.bgDark,
         borderRadius:8,padding:'1px 4px',
         fontSize:8,fontWeight:900,minWidth:13,
         textAlign:'center',lineHeight:'14px'}}>{f.badge}</div>}
       </button>
      );
     })}
    </div>
   </nav>
   )}

  </div>
 );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
