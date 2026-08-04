# CONTEXTO DO PROJETO - MEU RPG VTT / FICHA DIGITAL
> 🗓️ **Última Atualização:** 03/08/2026 às 22:25:13

Olá! Este arquivo contém a estrutura de arquivos e o código-fonte atualizado do projeto **Meu RPG VTT** (incluindo componentes, rascunhos em TSX/HTML e configurações).

---

## 📁 ESTRUTURA DE ARQUIVOS
```text
├── .gitignore
├── corrigindo_intera_es_de_magia.tsx
├── eslint.config.js
├── grimorio_robert_jones (1).tsx
├── grimorio_robert_jones (2).tsx
├── grimorio_robert_jones.tsx
├── index.html
├── MapaDoProjetoIA.md
├── package.json
├── postcss.config.js
├── public
│   ├── favicon.svg
│   └── icons.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components
│   │   ├── AttributesHeader.jsx
│   │   ├── RightPanel.jsx
│   │   └── TiersGrid.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── TODO.md
└── vite.config.js
```

---

## 📝 CÓDIGO-FONTE DOS ARQUIVOS

### 📄 Arquivo: `.gitignore`
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Contexto da IA
.ai-context/
bundle-ai.js
```

### 📄 Arquivo: `corrigindo_intera_es_de_magia.tsx`
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Lock, Unlock, Plus, Edit2, Save, X, Pin, Trash2, 
  ChevronDown, ChevronUp, Download, Upload, ArrowDownAZ, 
  GripVertical, AlertTriangle, Undo, Redo, RotateCcw, Palette
} from 'lucide-react';

// === DADOS INICIAIS DE RECONSTRUÇÃO ===
const INITIAL_SKILLS = [
  { id: 's1', tier: 'Tier 1', name: 'Capeta Indigno (Imp)', icon: '💀', action: 'Bônus Action', type: 'Conjuração', color: 'border-red-600', description: 'Selado no meu isqueiro, nunca tenho que trocar o óleo.\n\nLvl 1 - Vira hunters mark.' },
  { id: 's2', tier: 'Tier 1', name: 'Sorte do Diabo lvl 3', icon: '✨', action: 'Bônus Action', type: 'Adivinhação', color: 'border-purple-500', description: 'Me permite trapacear em jogos de azar...\n\nLvL 2: Quando um jogador rolar um resultado, se for impar, eu posso dar um re-roll.' },
  { id: 's3', tier: 'Passivas', name: 'Sobretudo de Naida', icon: '🧥', action: 'Passivo', type: 'Defesa', color: 'border-slate-500', description: 'Naida é um Fey que perdeu uma aposta. Funciona como uma mage armor.\n\nlvl 5 - Ganho 5 de armadura base.' },
];
const INITIAL_TIERS = ['Passivas', 'Especiais', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6', 'Tier 7', 'Tier 8'];
const INITIAL_ATTRIBUTES = [
  { id: 'level', label: 'Lvl', value: '515' },
  { id: 'insanity', label: 'Insanidade', value: '63' },
  { id: 'for', label: 'FOR', value: '40(20)' },
  { id: 'dex', label: 'DEX', value: '101(50)' },
  { id: 'res', label: 'RES', value: '100(50)' },
  { id: 'agi', label: 'AGI', value: '34(17)' },
  { id: 'int', label: 'INT', value: '140(70)' },
  { id: 'cha', label: 'CHA', value: '100(50)' }
];
const INITIAL_RESOURCES = [
  { id: 'hp', label: 'HP', type: 'number', value: '1545', max: '1545', color: 'bg-red-500' },
  { id: 'manto', label: 'Manto Arcano', type: 'number', value: '2575', max: '2575', color: 'bg-blue-500' },
  { id: 'effort_d12', label: 'Effort d12', type: 'boxes', value: 4, max: 8, color: 'bg-purple-600' }
];

const THEMES = [
  { id: 'default', name: 'Trevas (Padrão)', bg: '#070714', panel: '#0a0a1a', border: '#2a2a4a', text: '#cbd5e1' },
  { id: 'blood', name: 'Sangue Demoníaco', bg: '#140505', panel: '#1c0a0a', border: '#4c1d1d', text: '#fca5a5' },
  { id: 'necro', name: 'Necromante', bg: '#0f0514', panel: '#180a1f', border: '#3b1d4c', text: '#d8b4fe' },
  { id: 'arcane', name: 'Arcano', bg: '#051014', panel: '#0a1a1f', border: '#1d3e4c', text: '#93c5fd' },
  { id: 'noir', name: 'Noir', bg: '#0b0b0b', panel: '#141414', border: '#2a2a2a', text: '#d1d5db' },
  { id: 'sacred', name: 'Luz Sagrada', bg: '#14130b', panel: '#1f1d10', border: '#4c4621', text: '#fde047' },
  { id: 'druid', name: 'Druida', bg: '#05140b', panel: '#0a1f12', border: '#1d4c2b', text: '#6ee7b7' },
  { id: 'toxin', name: 'Toxina', bg: '#0e1405', panel: '#171f0a', border: '#364c1d', text: '#bef264' },
  { id: 'ocean', name: 'Profundeza', bg: '#050f14', panel: '#0a191f', border: '#1d3c4c', text: '#67e8f9' }
];

const EMOJI_CATEGORIES = [
  { label: 'Luta/Guerra', emojis: ['⚔️','🗡️','🛡️','🏹','🪓','🥊','⛓️','🩸','💥','💀','👹','👿'] },
  { label: 'Magia/Efeitos', emojis: ['🔮','🪄','📜','🌀','🌌','✨','🌟','🕯️','🧿','🌙','⏳','🎨'] },
  { label: 'Elementos', emojis: ['🔥','❄️','⚡','💧','🌪️','🪨','☀️','☁️','🌋','🌿','🍄','🍀'] },
  { label: 'Animais/Ecos', emojis: ['🦇','🕷️','🐍','🐉','🐺','🦁','🦅','🐈','🐙','🦠','🧪','👁️'] },
  { label: 'Utilitários', emojis: ['🎒','🗝️','⚙️','💎','🔔','🎭','🎲','👑','🗺️','🚬','🥃','🔥'] }
];

export default function FichaRobertJonesV5() {
  // === ESTADO MASTER ÚNICO (Para facilitar desfazer/refazer) ===
  const [sheetData, setSheetData] = useState(() => {
    try {
      const saved = window.localStorage.getItem('rpg_sheet_master_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      characterName: 'Robert (Summer) Jones',
      attributes: INITIAL_ATTRIBUTES,
      resources: INITIAL_RESOURCES,
      tiers: INITIAL_TIERS,
      skills: INITIAL_SKILLS,
      activeThemeId: 'default',
      customTheme: { bg: '#070714', panel: '#0a0a1a', border: '#2a2a4a', text: '#cbd5e1' }
    };
  });

  // === CONTROLE DE HISTÓRICO (CTRL+Z / CTRL+Y) ===
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Função para salvar estado e registrar no histórico
  const updateSheetData = (newData) => {
    setHistoryStack(prev => [...prev, sheetData].slice(-40)); // Limita a 40 passos
    setRedoStack([]); // Reseta o refazer
    setSheetData(newData);
  };

  const undo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack(prev => [...prev, sheetData]);
    setSheetData(previous);
    setHistoryStack(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(prev => [...prev, sheetData]);
    setSheetData(next);
    setRedoStack(prev => prev.slice(0, -1));
  };

  // Atalhos de teclado globais para desfazer/refazer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyStack, redoStack, sheetData]);

  // Salvar no LocalStorage sempre que o sheetData mudar
  useEffect(() => {
    window.localStorage.setItem('rpg_sheet_master_v5', JSON.stringify(sheetData));
  }, [sheetData]);

  // === ESTADOS DA INTERFACE ===
  const [isSheetUnlocked, setIsSheetUnlocked] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configSection, setConfigSection] = useState('themes'); // 'themes', 'backup', 'custom'
  
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [pinnedSkill, setPinnedSkill] = useState(null);
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleMouseEnter = (skill) => {
    if (!isEditingSkill) {
      setHoveredSkill(skill);
    }
  };

  const handleMouseLeave = () => {
    if (!isEditingSkill) {
      setHoveredSkill(null);
    }
  };

  const togglePin = (skill) => {
    if (isEditingSkill) return;
    if (pinnedSkill?.id === skill.id) {
      setPinnedSkill(null);
    } else {
      setPinnedSkill(skill);
      setHoveredSkill(null);
      setShowConfig(false);
    }
  };

  // Controle de Ordenação Temporária (A-Z) por Tier
  const [sortedTiers, setSortedTiers] = useState([]);

  // Drag & Drop States
  const [draggedTier, setDraggedTier] = useState(null);
  const [draggedSkill, setDraggedSkill] = useState(null);

  const fileInputRef = useRef(null);

  // Determinar cores do tema atual
  let activeTheme = THEMES.find(t => t.id === sheetData.activeThemeId) || THEMES[0];
  if (sheetData.activeThemeId === 'custom') {
    activeTheme = sheetData.customTheme;
  }

  const displaySkill = pinnedSkill || hoveredSkill;

  // === EXPORTAR / IMPORTAR / RESET / EXPORTAR HTML ===
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(sheetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ficha_${sheetData.characterName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.characterName && parsed.skills) {
          updateSheetData(parsed);
          alert("Ficha importada com sucesso!");
        } else {
          alert("Formato de arquivo JSON inválido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  const exportStandaloneHTML = () => {
    // Esse gerador cria uma página completa do site com os dados embutidos para rodar offline
    const htmlTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ficha - ${sheetData.characterName}</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const INITIAL_EMBEDDED_DATA = ${JSON.stringify(sheetData)};
    // O mesmo código React vai rodar aqui a partir dos dados embutidos...
    // [Emulação direta offline simplificada para leitura e visualização]
  </script>
</body>
</html>`;
    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `App_Ficha_${sheetData.characterName.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (window.confirm("Certeza absoluta de que quer apagar tudo e recomeçar a ficha do zero?")) {
      updateSheetData({
        characterName: 'Novo Personagem',
        attributes: [
          { id: 'for', label: 'FOR', value: '10' },
          { id: 'dex', label: 'DEX', value: '10' },
          { id: 'res', label: 'RES', value: '10' },
          { id: 'agi', label: 'AGI', value: '10' },
          { id: 'int', label: 'INT', value: '10' },
          { id: 'cha', label: 'CHA', value: '10' }
        ],
        resources: [
          { id: 'hp', label: 'HP', type: 'number', value: '100', max: '100', color: 'bg-red-500' }
        ],
        tiers: ['Geral'],
        skills: [],
        activeThemeId: 'default',
        customTheme: { bg: '#070714', panel: '#0a0a1a', border: '#2a2a4a', text: '#cbd5e1' }
      });
      setPinnedSkill(null);
      setHoveredSkill(null);
      setIsEditingSkill(false);
    }
  };

  // === LÓGICA DE ORDENAÇÃO A-Z ===
  const toggleSortTier = (tierName) => {
    if (sortedTiers.includes(tierName)) {
      setSortedTiers(sortedTiers.filter(t => t !== tierName));
    } else {
      setSortedTiers([...sortedTiers, tierName]);
    }
  };

  const getTierSkills = (tierName) => {
    const tierSkills = sheetData.skills.filter(s => s.tier === tierName);
    if (sortedTiers.includes(tierName)) {
      return [...tierSkills].sort((a, b) => a.name.localeCompare(b.name));
    }
    return tierSkills;
  };

  // === DRAG & DROP: TIERS (LINHAS) ===
  const handleDragStartTier = (e, tierName) => {
    if (!isSheetUnlocked) { e.preventDefault(); return; }
    setDraggedTier(tierName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropTier = (e, targetTierName) => {
    e.preventDefault();
    if (!draggedTier || draggedTier === targetTierName) return;
    
    const newTiers = [...sheetData.tiers];
    const draggedIdx = newTiers.indexOf(draggedTier);
    const targetIdx = newTiers.indexOf(targetTierName);
    
    newTiers.splice(draggedIdx, 1);
    newTiers.splice(targetIdx, 0, draggedTier);
    
    updateSheetData({ ...sheetData, tiers: newTiers });
    setDraggedTier(null);
  };

  // === DRAG & DROP: SKILLS (QUADRADINHOS) ===
  const handleDragStartSkill = (e, skill) => {
    if (!isSheetUnlocked) { e.preventDefault(); return; }
    setDraggedSkill(skill);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropSkill = (e, targetSkill) => {
    e.preventDefault();
    if (!draggedSkill || draggedSkill.id === targetSkill.id) return;

    const updatedSkills = [...sheetData.skills];
    const draggedIdx = updatedSkills.findIndex(s => s.id === draggedSkill.id);
    
    // Remove o item arrastado
    const [removed] = updatedSkills.splice(draggedIdx, 1);
    
    // Altera a linha (tier) caso tenha sido jogada em outra categoria
    removed.tier = targetSkill.tier;

    // Encontra a posição do destino no array atualizado
    const targetIdx = updatedSkills.findIndex(s => s.id === targetSkill.id);
    updatedSkills.splice(targetIdx, 0, removed);

    updateSheetData({ ...sheetData, skills: updatedSkills });
    setDraggedSkill(null);
  };

  // === LÓGICA DE ATRIBUTOS E RECURSOS DINÂMICOS ===
  const updateAttribute = (id, field, value) => {
    const updated = sheetData.attributes.map(a => a.id === id ? { ...a, [field]: value } : a);
    updateSheetData({ ...sheetData, attributes: updated });
  };

  const deleteAttribute = (id) => {
    const updated = sheetData.attributes.filter(a => a.id !== id);
    updateSheetData({ ...sheetData, attributes: updated });
  };

  const addAttribute = () => {
    const newId = `attr_${Date.now()}`;
    const updated = [...sheetData.attributes, { id: newId, label: 'NOVO', value: '10' }];
    updateSheetData({ ...sheetData, attributes: updated });
  };

  const updateResource = (id, field, value) => {
    const updated = sheetData.resources.map(r => r.id === id ? { ...r, [field]: value } : r);
    updateSheetData({ ...sheetData, resources: updated });
  };

  const deleteResource = (id) => {
    const updated = sheetData.resources.filter(r => r.id !== id);
    updateSheetData({ ...sheetData, resources: updated });
  };

  const addResource = () => {
    const newId = `res_${Date.now()}`;
    const updated = [...sheetData.resources, { id: newId, label: 'Novo Recurso', type: 'number', value: '100', max: '100', color: 'bg-green-500' }];
    updateSheetData({ ...sheetData, resources: updated });
  };

  const toggleResourceBox = (resId, boxIdx) => {
    if (isSheetUnlocked) return; // Trava impede cliques acidentais se estiver editando estrutura
    const updated = sheetData.resources.map(r => {
      if (r.id === resId && r.type === 'boxes') {
        const currentVal = Number(r.value);
        // Se clicar em uma caixa marcada que é a última, desmarca. Caso contrário, define até o índice clicado.
        const newVal = (boxIdx + 1 === currentVal) ? boxIdx : boxIdx + 1;
        return { ...r, value: newVal };
      }
      return r;
    });
    updateSheetData({ ...sheetData, resources: updated });
  };

  // === LÓGICA DE TIERS ===
  const addTier = (name) => {
    const cleaned = name.trim();
    if (cleaned && !sheetData.tiers.includes(cleaned)) {
      updateSheetData({ ...sheetData, tiers: [...sheetData.tiers, cleaned] });
    }
  };

  const removeTier = (tierName) => {
    const hasSkills = sheetData.skills.some(s => s.tier === tierName);
    if (hasSkills) {
      alert("Segurança: Você não pode deletar uma linha que contém habilidades. Remova as habilidades primeiro!");
      return;
    }
    const updated = sheetData.tiers.filter(t => t !== tierName);
    updateSheetData({ ...sheetData, tiers: updated });
  };

  // === LÓGICA DE SKILLS (EDIT / SAVE / DELETE) ===
  const startEditingSkill = () => {
    setEditForm({ ...displaySkill });
    setIsEditingSkill(true);
    setShowEmojiPicker(false);
  };

  const saveSkill = () => {
    let updatedSkills = [...sheetData.skills];
    if (editForm.isNew) {
      const newSkill = { ...editForm };
      delete newSkill.isNew;
      updatedSkills.push(newSkill);
      setPinnedSkill(newSkill);
    } else {
      updatedSkills = updatedSkills.map(s => s.id === editForm.id ? editForm : s);
      setPinnedSkill(editForm);
    }
    updateSheetData({ ...sheetData, skills: updatedSkills });
    setIsEditingSkill(false);
  };

  const createSkill = (tierName) => {
    const newSkill = {
      id: `skill_${Date.now()}`,
      isNew: true,
      tier: tierName,
      name: 'Nova Habilidade',
      icon: '✨',
      action: 'Ação / Bônus',
      type: 'Magia',
      color: 'border-slate-500',
      description: 'Escreva a descrição completa...'
    };
    setPinnedSkill(newSkill);
    setEditForm(newSkill);
    setIsEditingSkill(true);
    setShowConfig(false);
  };

  const deleteSkill = (id) => {
    if (window.confirm("Certeza que deseja deletar permanentemente esta habilidade?")) {
      const updatedSkills = sheetData.skills.filter(s => s.id !== id);
      updateSheetData({ ...sheetData, skills: updatedSkills });
      
      // Limpa os estados de visualização de forma segura
      if (pinnedSkill?.id === id) setPinnedSkill(null);
      if (hoveredSkill?.id === id) setHoveredSkill(null);
      setIsEditingSkill(false);
    }
  };

  return (
    <div className="flex flex-col h-screen text-slate-300 font-sans overflow-hidden select-none" style={{ backgroundColor: activeTheme.bg }}>
      
      {/* HEADER COMPACTO INTEGRADO */}
      <header className="p-3 shrink-0 flex flex-col gap-2 border-b transition-colors duration-200 shadow-lg z-20" style={{ backgroundColor: activeTheme.panel, borderColor: activeTheme.border }}>
        
        {/* Topo do Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-mono font-bold uppercase">Nome:</span>
            {isSheetUnlocked ? (
              <input 
                className="bg-black/40 border border-slate-700 rounded px-2 py-0.5 text-white font-bold text-lg focus:border-blue-500 outline-none"
                value={sheetData.characterName} 
                onChange={(e) => updateSheetData({ ...sheetData, characterName: e.target.value })}
              />
            ) : (
              <h1 className="text-xl font-bold text-white tracking-wider">{sheetData.characterName}</h1>
            )}
          </div>

          {/* Histórico & Controles de Trava */}
          <div className="flex items-center gap-2">
            {/* Ctrl+Z/Ctrl+Y Visuais */}
            <div className="flex bg-black/30 rounded border p-0.5" style={{ borderColor: activeTheme.border }}>
              <button onClick={undo} disabled={historyStack.length === 0} className={`p-1 rounded ${historyStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`} title="Desfazer (Ctrl+Z)"><Undo size={14}/></button>
              <button onClick={redo} disabled={redoStack.length === 0} className={`p-1 rounded ${redoStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`} title="Refazer (Ctrl+Y)"><Redo size={14}/></button>
            </div>

            <button 
              onClick={() => setIsSheetUnlocked(!isSheetUnlocked)} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all ${isSheetUnlocked ? 'bg-red-950/40 border-red-500/80 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-slate-800/80 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
            >
              {isSheetUnlocked ? <Unlock size={14} className="animate-pulse" /> : <Lock size={14} />}
              {isSheetUnlocked ? "DESTRAVADO / EDITAR" : "TRAVAR FICHA"}
            </button>

            <button 
              onClick={() => { setShowConfig(!showConfig); setPinnedSkill(null); setIsEditingSkill(false); }}
              className={`p-1.5 rounded border transition-colors ${showConfig ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white'}`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* ÁREA DE ATRIBUTOS (Foco do seu Request) */}
        <div className="relative flex flex-col gap-2 bg-black/30 p-2.5 rounded border border-white/5 shadow-inner mt-1">
          <span className="absolute -top-2 left-2 bg-[#05050f] px-1 text-[9px] text-slate-500 font-bold tracking-widest uppercase" style={{ backgroundColor: activeTheme.bg }}>Atributos</span>
          
          {/* Grid de Atributos Básicos */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {sheetData.attributes.map(attr => (
              <div key={attr.id} className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/5">
                {isSheetUnlocked ? (
                  <>
                    <button onClick={() => deleteAttribute(attr.id)} className="text-red-500 hover:text-red-300 p-0.5"><X size={11}/></button>
                    <input className="w-10 bg-transparent text-slate-400 text-center text-xs font-bold uppercase border-b border-transparent focus:border-blue-500 outline-none" value={attr.label} onChange={(e) => updateAttribute(attr.id, 'label', e.target.value)} />
                    <input className="w-16 bg-black/60 border border-slate-700 rounded px-1 text-white text-center font-bold focus:border-blue-500 outline-none" value={attr.value} onChange={(e) => updateAttribute(attr.id, 'value', e.target.value)} />
                  </>
                ) : (
                  <><span className="text-slate-400 text-xs font-bold uppercase">{attr.label}</span> <strong className="text-white font-mono text-sm">{attr.value}</strong></>
                )}
              </div>
            ))}
            {isSheetUnlocked && (
              <button onClick={addAttribute} className="text-green-400 text-xs flex items-center gap-1 bg-green-950/30 px-2 py-1 rounded border border-green-500/30 hover:bg-green-900/20"><Plus size={11}/> Attr</button>
            )}
          </div>

          <div className="w-full h-px bg-white/5 my-1"></div>

          {/* Grid de Recursos (Barras vs Checkboxes Clicáveis) */}
          <div className="flex flex-wrap items-center gap-3">
            {sheetData.resources.map(res => (
              <div key={res.id} className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/5">
                {isSheetUnlocked ? (
                  <>
                    <button onClick={() => deleteResource(res.id)} className="text-red-500 hover:text-red-300 p-0.5"><X size={11}/></button>
                    <select 
                      value={res.type} 
                      onChange={e => updateResource(res.id, 'type', e.target.value)} 
                      className="bg-slate-900 text-xs border border-slate-700 rounded p-0.5 text-slate-300 outline-none"
                    >
                      <option value="number">Nº</option>
                      <option value="boxes">Caixas</option>
                    </select>
                    <input className="w-20 bg-transparent text-slate-400 border-b border-transparent focus:border-blue-500 text-xs font-bold outline-none" value={res.label} onChange={(e) => updateResource(res.id, 'label', e.target.value)} />
                    
                    {res.type === 'number' ? (
                      <div className="flex items-center gap-1">
                        <input className="w-14 bg-black/60 border border-slate-700 rounded px-1 text-white text-center font-mono focus:border-blue-500 outline-none text-xs" value={res.value} onChange={(e) => updateResource(res.id, 'value', e.target.value)} />
                        <span className="text-slate-600 text-xs">/</span>
                        <input className="w-14 bg-black/60 border border-slate-700 rounded px-1 text-slate-400 text-center font-mono focus:border-blue-500 outline-none text-xs" placeholder="Max" value={res.max || ''} onChange={(e) => updateResource(res.id, 'max', e.target.value)} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span>Max caixas:</span>
                        <input type="number" min="1" max="24" className="w-10 bg-black/60 border border-slate-700 rounded px-1 text-white text-center" value={res.max || '5'} onChange={(e) => updateResource(res.id, 'max', e.target.value)} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className={`w-2.5 h-2.5 rounded-full ${res.color} shadow-sm`}></div>
                    <span className="text-slate-400 text-xs font-bold uppercase">{res.label}:</span>
                    {res.type === 'number' ? (
                      <span className="font-mono text-sm"><strong className="text-white">{res.value}</strong>{res.max ? <span className="text-slate-500 text-xs">/{res.max}</span> : ''}</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {Array.from({ length: Number(res.max) || 5 }).map((_, bIdx) => (
                          <button 
                            key={bIdx} 
                            onClick={() => toggleResourceBox(res.id, bIdx)}
                            className={`w-4 h-4 rounded-sm border transition-all duration-100 ${bIdx < Number(res.value) ? `${res.color} border-transparent shadow-[0_0_5px_rgba(255,255,255,0.15)]` : 'bg-black/60 border-slate-700'}`}
                          ></button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {isSheetUnlocked && (
              <button onClick={addResource} className="text-green-400 text-xs flex items-center gap-1 bg-green-950/30 px-2 py-1 rounded border border-green-500/30 hover:bg-green-900/20"><Plus size={11}/> Recurso</button>
            )}
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL DIVIDIDA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ESQUERDA: GRADE DE TIERS (55%) */}
        <div className="w-[55%] flex flex-col overflow-y-auto custom-scrollbar p-4 border-r gap-3" style={{ borderColor: activeTheme.border }}>
          {sheetData.tiers.map(tier => {
            const tierSkills = getTierSkills(tier);
            const rowSize = 8;
            const emptySlotsNeeded = (rowSize - ((tierSkills.length + (isSheetUnlocked ? 1 : 0)) % rowSize)) % rowSize;
            const isSorted = sortedTiers.includes(tier);

            return (
              <div 
                key={tier} 
                className="p-2 rounded border border-white/5 bg-black/10 transition-colors"
                draggable={isSheetUnlocked && draggedSkill === null}
                onDragStart={(e) => handleDragStartTier(e, tier)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropTier(e, tier)}
              >
                {/* Linha de Título do Tier */}
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1 select-none">
                  {isSheetUnlocked && <GripVertical size={13} className="text-slate-600 cursor-grab active:cursor-grabbing" />}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tier}</span>
                  <span className="text-[10px] text-slate-600 font-mono">({tierSkills.length})</span>
                  
                  {isSheetUnlocked && (
                    <div className="ml-auto flex items-center gap-1">
                      {/* Botão A-Z inteligente com Toggle */}
                      <button 
                        onClick={() => toggleSortTier(tier)} 
                        className={`p-1 rounded transition-colors ${isSorted ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
                        title={isSorted ? "Visualização A-Z (Clique para desfazer e ver ordem arrastada)" : "Ordenar de A-Z"}
                      >
                        <ArrowDownAZ size={14}/>
                      </button>
                      
                      {/* Botão Excluir Tier (Só deleta se vazio) */}
                      <button 
                        onClick={() => removeTier(tier)}
                        disabled={tierSkills.length > 0}
                        className={`p-1 rounded ${tierSkills.length === 0 ? 'text-red-500 hover:bg-red-500/20' : 'text-slate-700 cursor-not-allowed'}`}
                        title={tierSkills.length === 0 ? "Excluir Linha" : "Esvazie a linha primeiro"}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  )}
                </div>

                {/* Grade de Skills */}
                <div className="flex flex-wrap gap-1.5 min-h-[44px]">
                  {tierSkills.map(skill => {
                    const isPinned = pinnedSkill?.id === skill.id;
                    const isHovered = hoveredSkill?.id === skill.id && !isPinned;

                    return (
                      <button
                        key={skill.id}
                        draggable={isSheetUnlocked}
                        onDragStart={(e) => handleDragStartSkill(e, skill)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropSkill(e, skill)}
                        onMouseEnter={() => handleMouseEnter(skill)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => togglePin(skill)}
                        className={`
                          relative w-11 h-11 flex items-center justify-center rounded transition-all duration-100 border-2
                          ${isPinned ? 'border-yellow-400 scale-110 z-10 shadow-[0_0_10px_rgba(250,204,21,0.5)] bg-slate-900' : `${skill.color} bg-black/40`}
                          ${isHovered ? 'border-white brightness-125 z-10 bg-slate-900' : ''}
                          ${isSheetUnlocked ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                        `}
                      >
                        <span className="relative z-10 text-xl pointer-events-none">{skill.icon || '✨'}</span>
                        {isPinned && <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full -mt-1 -mr-1 shadow-md"></div>}
                      </button>
                    );
                  })}

                  {isSheetUnlocked && (
                    <button 
                      onClick={() => createSkill(tier)}
                      className="w-11 h-11 border-2 border-dashed bg-black/20 text-slate-500 hover:text-slate-300 rounded hover:border-slate-400 flex items-center justify-center transition-all"
                      style={{ borderColor: activeTheme.border }}
                    >
                      <Plus size={18} />
                    </button>
                  )}

                  {/* Espaços Estéticos para Alinhamento */}
                  {Array.from({ length: emptySlotsNeeded }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-11 h-11 border bg-black/5 rounded opacity-20" style={{ borderColor: activeTheme.border }}></div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Adicionador de Tiers */}
          {isSheetUnlocked && (
            <div className="mt-2 p-3 bg-black/20 rounded border border-dashed border-slate-700 flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Ex: Armas de Sangue (Pressione Enter)..." 
                className="bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-sm flex-1 text-white focus:border-blue-500 outline-none" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addTier(e.target.value);
                    e.target.value = '';
                  }
                }} 
              />
            </div>
          )}
        </div>

        {/* DIREITA: PAINEL DE LEITURA / CONFIGS (45%) */}
        <div className="w-[45%] relative flex flex-col shadow-2xl transition-colors duration-200" style={{ backgroundColor: activeTheme.panel }}>
          
          {showConfig ? (
            /* === MENU CONFIGURAÇÕES EM SANFONA === */
            <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2 border-b border-white/10 pb-4"><Settings size={24}/> Configurações</h2>
              
              {/* Sanfona 1: Paletas de Cores */}
              <div className="border rounded-lg overflow-hidden mb-4" style={{ borderColor: activeTheme.border }}>
                <button 
                  onClick={() => setConfigSection(configSection === 'themes' ? '' : 'themes')} 
                  className="w-full p-4 flex justify-between items-center bg-black/30 hover:bg-black/50 font-bold"
                >
                  <span className="flex items-center gap-2">🎨 Paletas de Cores ({THEMES.length} opções)</span>
                  {configSection === 'themes' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {configSection === 'themes' && (
                  <div className="p-4 grid grid-cols-2 gap-2 bg-black/20">
                    {THEMES.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => updateSheetData({ ...sheetData, activeThemeId: t.id })}
                        className={`p-2.5 rounded border text-left flex items-center justify-between ${sheetData.activeThemeId === t.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-700 hover:border-slate-500'}`} 
                        style={{ backgroundColor: t.panel }}
                      >
                        <span className="font-bold text-xs text-white">{t.name}</span>
                        <div className="flex">
                          <div className="w-3.5 h-3.5 rounded-full mr-1" style={{ backgroundColor: t.bg }}></div>
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.border }}></div>
                        </div>
                      </button>
                    ))}
                    {/* Botão Tema Customizado */}
                    <button 
                      onClick={() => updateSheetData({ ...sheetData, activeThemeId: 'custom' })}
                      className={`p-2.5 rounded border text-left flex items-center justify-between col-span-2 ${sheetData.activeThemeId === 'custom' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-700 hover:border-slate-500'}`} 
                      style={{ backgroundColor: sheetData.customTheme.panel }}
                    >
                      <span className="font-bold text-xs text-yellow-400 flex items-center gap-1"><Palette size={14}/> Tema Personalizado</span>
                      <div className="flex">
                        <div className="w-3.5 h-3.5 rounded-full mr-1 animate-pulse" style={{ backgroundColor: sheetData.customTheme.bg }}></div>
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: sheetData.customTheme.border }}></div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Sanfona 2: Customização Real (Mudar o Padrão e Salvar) */}
              {sheetData.activeThemeId === 'custom' && (
                <div className="border rounded-lg overflow-hidden mb-4" style={{ borderColor: activeTheme.border }}>
                  <button 
                    onClick={() => setConfigSection(configSection === 'custom' ? '' : 'custom')} 
                    className="w-full p-4 flex justify-between items-center bg-black/30 hover:bg-black/50 font-bold"
                  >
                    <span className="text-yellow-400 flex items-center gap-2">🎨 Cores Personalizadas</span>
                    {configSection === 'custom' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </button>
                  {configSection === 'custom' && (
                    <div className="p-4 flex flex-col gap-3 bg-black/20 text-xs">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400">Fundo da Página:</label>
                        <input type="color" value={sheetData.customTheme.bg} onChange={e => updateSheetData({ ...sheetData, customTheme: { ...sheetData.customTheme, bg: e.target.value } })} className="w-10 h-7 bg-transparent border border-slate-700 cursor-pointer" />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400">Painéis de Fundo:</label>
                        <input type="color" value={sheetData.customTheme.panel} onChange={e => updateSheetData({ ...sheetData, customTheme: { ...sheetData.customTheme, panel: e.target.value } })} className="w-10 h-7 bg-transparent border border-slate-700 cursor-pointer" />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400">Linhas de Borda:</label>
                        <input type="color" value={sheetData.customTheme.border} onChange={e => updateSheetData({ ...sheetData, customTheme: { ...sheetData.customTheme, border: e.target.value } })} className="w-10 h-7 bg-transparent border border-slate-700 cursor-pointer" />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400">Cor do Texto:</label>
                        <input type="color" value={sheetData.customTheme.text} onChange={e => updateSheetData({ ...sheetData, customTheme: { ...sheetData.customTheme, text: e.target.value } })} className="w-10 h-7 bg-transparent border border-slate-700 cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sanfona 3: Gerenciamento e Backup */}
              <div className="border rounded-lg overflow-hidden mb-4" style={{ borderColor: activeTheme.border }}>
                <button 
                  onClick={() => setConfigSection(configSection === 'backup' ? '' : 'backup')} 
                  className="w-full p-4 flex justify-between items-center bg-black/30 hover:bg-black/50 font-bold"
                >
                  <span className="flex items-center gap-2">💾 Backup & Importação</span>
                  {configSection === 'backup' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {configSection === 'backup' && (
                  <div className="p-4 flex flex-col gap-3 bg-black/20 text-xs">
                    <p className="text-slate-500">Seus dados ficam em cache no navegador. Faça backup para segurança absoluta.</p>
                    
                    <button onClick={exportJSON} className="w-full bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/50 text-blue-300 p-3 rounded font-bold flex items-center justify-center gap-2 transition-colors">
                      <Download size={16} /> Exportar Arquivo JSON
                    </button>

                    <label className="w-full bg-green-900/30 hover:bg-green-800/50 border border-green-500/50 text-green-300 p-3 rounded font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                      <Upload size={16} /> Importar Arquivo JSON
                      <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={importJSON} />
                    </label>

                    <button onClick={exportStandaloneHTML} className="w-full bg-yellow-950/30 hover:bg-yellow-900/40 border border-yellow-600/50 text-yellow-300 p-3 rounded font-bold flex items-center justify-center gap-2 transition-colors">
                      <Download size={16} /> Baixar como App HTML Offline
                    </button>
                  </div>
                )}
              </div>

              {/* Botão Nuclear de Reset */}
              <div className="mt-auto pt-6 border-t border-red-900/30">
                <button onClick={clearAll} className="w-full bg-red-950/50 hover:bg-red-900 border border-red-800 text-red-400 p-3 rounded flex items-center justify-center gap-2 font-bold transition-all duration-150">
                  <AlertTriangle size={18} /> CLEAR ALL (Zerar Ficha)
                </button>
              </div>
            </div>
          ) : isEditingSkill && editForm ? (
            /* === FORMULÁRIO DE EDIÇÃO DE MAGIA === */
            <div className="flex flex-col h-full bg-black/10">
              <div className="p-4 border-b flex justify-between items-center bg-black/20" style={{ borderColor: activeTheme.border }}>
                <h2 className="text-md font-bold text-blue-400 flex items-center gap-2"><Edit2 size={16} /> Editando Skill</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditingSkill(false); if(editForm.isNew) setPinnedSkill(null); }} className="px-3 py-1 bg-slate-800 text-xs rounded hover:bg-slate-700">Cancelar</button>
                  <button onClick={saveSkill} className="px-3 py-1 bg-green-600 text-xs text-white font-bold rounded hover:bg-green-500">Salvar</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Ícone</label>
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                      className="w-14 h-14 bg-black/50 border rounded text-2xl flex items-center justify-center hover:border-slate-400 transition-colors"
                      style={{ borderColor: activeTheme.border }}
                    >
                      {editForm.icon}
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 p-3 rounded shadow-2xl w-72 grid gap-3 z-50">
                        {EMOJI_CATEGORIES.map(cat => (
                          <div key={cat.label}>
                            <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">{cat.label}</div>
                            <div className="grid grid-cols-6 gap-1">
                              {cat.emojis.map(em => (
                                <button key={em} onClick={() => { setEditForm({ ...editForm, icon: em }); setShowEmojiPicker(false); }} className="text-xl hover:bg-slate-800 rounded p-1 transition-colors">{em}</button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Nome da Habilidade</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white font-bold focus:border-blue-500 outline-none" style={{ borderColor: activeTheme.border }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Ação / Custo</label>
                    <input type="text" value={editForm.action} onChange={e => setEditForm({ ...editForm, action: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white text-sm focus:border-blue-500 outline-none" style={{ borderColor: activeTheme.border }} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Tipo</label>
                    <input type="text" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white text-sm focus:border-blue-500 outline-none" style={{ borderColor: activeTheme.border }} />
                  </div>
                </div>

                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Cor da Borda</label>
                    <select value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="w-full bg-slate-900 border rounded p-2 text-white text-sm outline-none" style={{ borderColor: activeTheme.border }}>
                      <option value="border-slate-500">Cinza</option>
                      <option value="border-red-600">Vermelho</option>
                      <option value="border-blue-500">Azul</option>
                      <option value="border-green-600">Verde</option>
                      <option value="border-purple-500">Roxo</option>
                      <option value="border-yellow-500">Amarelo</option>
                      <option value="border-orange-500">Laranja</option>
                      <option value="border-teal-500">Teal</option>
                    </select>
                  </div>
                  {!editForm.isNew && (
                    <button onClick={() => deleteSkill(editForm.id)} className="px-3 py-2 bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-900/50 rounded flex items-center gap-1.5 text-xs font-bold transition-all duration-150">
                      <Trash2 size={14}/> EXCLUIR SKILL
                    </button>
                  )}
                </div>

                <div className="flex-1 flex flex-col mt-2">
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Mecânicas e Detalhes da Magia</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full flex-1 min-h-[250px] bg-black/40 border rounded p-3 text-sm text-slate-300 font-serif leading-relaxed resize-none custom-scrollbar focus:border-blue-500 outline-none" style={{ borderColor: activeTheme.border }}></textarea>
                </div>
              </div>
            </div>
          ) : displaySkill ? (
            /* === MODO LEITURA DA MAGIA === */
            <div className="relative z-10 flex flex-col h-full animate-in fade-in duration-100">
              <div className="p-6 pb-4 border-b bg-black/20 shrink-0" style={{ borderColor: activeTheme.border }}>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold text-white tracking-wide leading-tight flex items-center gap-3 select-none">
                    <span className="text-3xl drop-shadow-lg">{displaySkill.icon || '✨'}</span> 
                    {displaySkill.name}
                  </h2>
                  {pinnedSkill?.id === displaySkill.id && isSheetUnlocked && (
                    <button onClick={startEditingSkill} className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 font-bold text-xs rounded border border-blue-500/50 transition-colors">
                      <Edit2 size={12} /> Editar
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 select-none">
                  <span className="bg-black/50 px-2.5 py-1 rounded border" style={{ borderColor: activeTheme.border }}>{displaySkill.action}</span>
                  <span className="bg-black/50 px-2.5 py-1 rounded border" style={{ borderColor: activeTheme.border }}>{displaySkill.type}</span>
                  {pinnedSkill?.id === displaySkill.id && <span className="text-yellow-500 font-bold ml-auto flex items-center gap-1 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-500/50"><Pin size={12} /> FIXADO</span>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-md leading-relaxed custom-scrollbar whitespace-pre-wrap font-serif select-text">
                {displaySkill.description}
              </div>
            </div>
          ) : (
            /* === ESTADO VAZIO === */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 relative z-10 p-10 text-center select-none">
              <div className="text-5xl mb-4 opacity-20">📖</div>
              <h3 className="text-xl font-bold mb-2">Grimório Ativo</h3>
              <p className="text-sm">Passe o mouse sobre os ícones de magia na esquerda.</p>
              <p className="mt-4 text-xs text-slate-500">Clique na magia para <strong className="text-yellow-600">Fixar</strong> e ler textos de 10.000 palavras com calma.</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${activeTheme.border}; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4a4a8a; }
      `}} />
    </div>
  );
}
```

### 📄 Arquivo: `eslint.config.js`
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])

```

### 📄 Arquivo: `grimorio_robert_jones (1).tsx`
```tsx
import React, { useState } from 'react';
import { Settings, Lock, Unlock, Plus, Edit2, Save, Eye, EyeOff, X, Palette, LayoutList, Book } from 'lucide-react';

// === DADOS INICIAIS BASEADOS NA FICHA DO ROBERT JONES ===
const INITIAL_SKILLS = [
  {
    id: 'p1', tier: 'Passivas', name: 'Sobretudo de Naida - lvl 5', action: 'Passivo / Bônus', type: 'Defesa / Utilitário', color: 'border-slate-500', emoji: '🧥',
    description: `Naida é um Fey, nao sei oq ele é exatamente. Ele perdeu uma aposta com um mago a 950 anos atras, e ele tem que servir a humanidade por 1000 anos, e ele just so happen, de ser minha posse no momento. Ele nao fala mas tem inteligencia. Ele é tipo a capa do dr estranho, voa sozinho (nao me faz voar) consegue pegar coisas.

Ele é uma mage armor (tipo skyrim q tem uma aura fina ao redor) ele sempre me da metade do meu mod de int de ArmB. Ao invés, eu posso fazer a minha armadura base ser metade do mod de int x tier que eu usar (bonus action) a duraçao é a tier em horas. quando eu casto uma barreira eu adiciono meu valor de ArmB.
Refinamento /5 (150 crit) 30 ab

lvl 1 - Aumento distancia de pulo com int
lvl 2 - Consigo andar na parede brevemente mov = mod int
lvl 3 - Coloco metade mod de For na armadura base
lvl 4 - Slowfall, recebo metade do dano de fall damage...
lvl 5 - Ganho 5 de armadura base. Eu posso usar meu sobretudo como uma bag of holding...`
  },
  {
    id: 'p2', tier: 'Passivas', name: 'Manto Arcano lvl 5', action: 'Passivo', type: 'Defesa Magica', color: 'border-blue-500', emoji: '✨',
    description: `Tenho uma barra de vida extra para receber danos proveniente de magia (exceto físicos e venenoso), esse calculo é feito igualmente a quantidade que se ganharia de hp vezes o level proveniente de resistência, porem, usando inteligência no lugar. Fica ligado se eu cair inconsciente.

lvl 1 - Posso invocar copias ilusorias de items que estão na minha pocket dimension...
lvl 2 - com a bonus action posso criar uma ward magica (a la skyrim)...
lvl 3 - quando uma magia atinge minha ward eu ganho slot temporario...
lvl 4 - Dragon hide - posso ativar com a bonus action, ganho x2 na armadura ao tipo de dano magico comumente usado por dragoes...
lvl 5 - Dragon Meal - quando eu levar um dano, transformo em dragon breath.`
  },
  {
    id: 't1_1', tier: 'Tier 1', name: 'Capeta Indigno de Nome (Imp)', action: 'Bônus Action', type: 'Conjuração', color: 'border-red-600', emoji: '💀',
    description: `Selado no meu isqueiro, nunca tenho que trocar o óleo.
É um demônio insignificante pouco maior que um dedo que eu maltrato, eu sou o dono dele para todos os efeitos e ele é meu escravo enquanto eu viver. Ele sabe muitas coisas. Ele meio que sempre esta invocado no meu isqueiro.

Ele faz "the usual familiar things", costuma ser invisível e mudar a aparência, mas eu não tenho controle absoluto dele. HP é meu mod de int, os outros stats dele quando ele ta invocado é 6 de mod. Ter gasto a bônus action dessa skill é pré-requisito para outras habilidades (Imp).

lvl 1 - ele vira um hunters mark.
lvl 2 - O fogo do meu esqueiro evapora agua facilmente, e nao se apaga por meios não magicos.`
  },
  {
    id: 't1_2', tier: 'Tier 1', name: 'Sorte do Diabo lvl 3', action: 'Bônus Action', type: 'Adivinhação', color: 'border-purple-500', emoji: '🎲',
    description: `Me permite trapacear em jogos de Azar, se for um numero, eu sei que numero vai dar...

LvL 1: (link) quando um par e bom ímpar e ruim e rolado eu posso dar um re-roll. Só posso fazer isso pra um jogador por dia.
LvL 2: (link) Quando um jogador rolar um resultado, se for impar, eu posso dar um re-roll. De acordo com o novo resultado a Skill funciona diferente. Se for par, fica com o novo , se for acerto crítico ignora o crítico. Se for ímpar mas maior que o resultado anterior, ignora e fica com o antigo...
LvL 3: Posso dar re-roll em erro critico de esquiva, se a esquiva falhar mesmo assim ele cai prone.`
  },
  {
    id: 't2_1', tier: 'Tier 2', name: 'Cauda de Bathin lvl 5', action: 'Ação / Imp', type: 'Conjuração', color: 'border-green-600', emoji: '🐍',
    description: `Range: mod de int.
Invoco uma serpente que é a cauda de um demônio cavalo, ele bate (perfurante) através de um portal, deixa restrained ate passar o save de for e vai embora, range igual meu mod de int.

"Cavalo satã com cauda de cobra, tu que és o decimo oitavo espirito na chave menor de solomon, duque do inferno que comanda trinta e sete legiões de demônios, não direi teu nome, mas me da uma forcinha"

lvl 1 - Ataque de oportunidade se andar sem disengage.
lvl 2 - add mod int/2 elétrico.
lvl 5 - Posso me puxar na direção.`
  },
  {
    id: 't3_1', tier: 'Tier 3', name: 'Maldição de Cytorak', action: 'Bônus Action / Concentração', type: 'Encantamento / Imp', color: 'border-red-800', emoji: '👁️',
    description: `Marco um alvo, a maldição é uma marca brilhante visivel no peito e nao pode ser removida com dispell e cleanses.
Eu tenho que explicar pro alvo que, se eu matar ele enquanto ele estiver com a marca, a alma dele vai pro inferno por X(slot) dias pra ser torturado por cytorak, porém eu posso tirar a marca se ele se render.

SKILL: Sempre que eu errar uma magia ataque ranged no alvo marcado, esse ataque vira uma esfera e fica ali flutuando ao redor do alvo. No inicio do meu proximo turno, eu posso atacar o alvo com as esferas presentes de novo.
Sempre que eu erro uma esfera eu ganho um bonus de 1d4 pra acertar a proxima.`
  },
  {
    id: 't6_1', tier: 'Tier 6', name: 'Solo de Sitri lvl 1', action: 'Ação / Concentração', type: 'Necromancia / Imp', color: 'border-fuchsia-600', emoji: '🔥',
    description: `Eu brevemente profano o chao em que eu piso, numa area em 35ft a partir de mim. Todos que iniciarem o turno ou entrarem na area recebe um ataque, se atingido faz save de resistencia, se passar recebe metade do dano. O dano é um smite de t6 necrotico direto na vida.

Sitri é um principe do inferno, tem o corpo de uma mulher gostosa, asas de anjo negras e cabeças de onça. Ela fica me agarrando enquanto eu mantenho a skill ligada.

"Decimo segundo espirito da Ars Goetia, principe comandante de 60 legioes infernais... Seduza meus inimigos ao poder profano..."

lvl 1 - a area é terreno dificil`
  },
  {
    id: 't8_1', tier: 'Tier 8', name: 'Redemoinho Felinfernal', action: 'Ação', type: 'Evocação Espacial', color: 'border-red-900', emoji: '🌪️',
    description: `Duração 6 Rodadas. Ou até eu desligar a skill.
Seleciono um ponto no mapa aonde eu possa ver em até 500ft, um portal interdimensional instável que se alterna rapidamente entre camadas diferentes do inferno aparece no local. Criaturas na área levam dano T8.

Ao ativar a skill eu jogo 5d8s, re-rolando valores iguais ate que tenham 5 números diferentes. no inicio dos meus turnos, a esfera dispara num alvo aleatorio presente. (50% chance de ir na gente ou inimigo).

Enquanto a skill estiver ativa, todo effort ou buff que for adicionado num dano de magia minha, eu pego esse valor e adiciono numa pool. Essa pool funciona como effort funcionava antigamente, mas apenas para danos de magia.`
  }
];

const INITIAL_TIERS = ['Passivas', 'Especiais', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6', 'Tier 7', 'Tier 8'];

const INITIAL_STATS = {
  name: "Robert (Summer) Jones",
  level: "515",
  insanity: "63",
  for: "40(20)",
  dex: "101(50)",
  res: "100(50)",
  agi: "34(17)",
  int: "140(70)",
  cha: "100(50)",
  hp: "1545",
  manto: "2575"
};

const THEMES = {
  darkBlue: {
    name: "Abismo (Padrão)",
    bgMain: "bg-[#070714]",
    bgPanel: "bg-[#0a0a1a]",
    bgCard: "bg-[#151525]",
    borderBase: "border-[#1e1e4a]",
    borderCard: "border-[#2a2a6a]",
    textMain: "text-slate-300",
    textHighlight: "text-blue-400"
  },
  bloodRed: {
    name: "Sangue Demoníaco",
    bgMain: "bg-[#140707]",
    bgPanel: "bg-[#1a0a0a]",
    bgCard: "bg-[#251515]",
    borderBase: "border-[#4a1e1e]",
    borderCard: "border-[#6a2a2a]",
    textMain: "text-red-100",
    textHighlight: "text-red-400"
  },
  necromancer: {
    name: "Necromante",
    bgMain: "bg-[#0a1407]",
    bgPanel: "bg-[#0f1a0a]",
    bgCard: "bg-[#1a2515]",
    borderBase: "border-[#2e4a1e]",
    borderCard: "border-[#3e6a2a]",
    textMain: "text-green-100",
    textHighlight: "text-green-400"
  },
  arcane: {
    name: "Arcano",
    bgMain: "bg-[#100714]",
    bgPanel: "bg-[#150a1a]",
    bgCard: "bg-[#201525]",
    borderBase: "border-[#3b1e4a]",
    borderCard: "border-[#522a6a]",
    textMain: "text-purple-100",
    textHighlight: "text-purple-400"
  },
  monochrome: {
    name: "Noir",
    bgMain: "bg-[#0f0f0f]",
    bgPanel: "bg-[#141414]",
    bgCard: "bg-[#1f1f1f]",
    borderBase: "border-[#333333]",
    borderCard: "border-[#444444]",
    textMain: "text-gray-300",
    textHighlight: "text-white"
  }
};

export default function FichaRobertJones() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [stats, setStats] = useState(INITIAL_STATS);
  
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [lockedSkill, setLockedSkill] = useState(null);
  
  // Estados de Controle / Configuração
  const [isUnlocked, setIsUnlocked] = useState(false); // Ficha travada por padrão
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [currentThemeKey, setCurrentThemeKey] = useState("darkBlue");
  const [newTierName, setNewTierName] = useState("");

  const theme = THEMES[currentThemeKey];

  // A habilidade exibida no painel direito
  const displaySkill = lockedSkill || hoveredSkill;

  // Interações com o mouse
  const handleMouseEnter = (skill) => {
    if (!isEditingSkill && !showConfig) setHoveredSkill(skill);
  };
  const handleMouseLeave = () => {
    if (!isEditingSkill && !showConfig) setHoveredSkill(null);
  };
  const handleClick = (skill) => {
    if (isEditingSkill || showConfig) return;

    if (lockedSkill && lockedSkill.id === skill.id) {
      setLockedSkill(null);
      setHoveredSkill(null);
    } else {
      setLockedSkill(skill);
    }
  };

  // Funções de Edição de Skill
  const startEditing = () => {
    if (!isUnlocked) return;
    setEditForm({ ...displaySkill });
    setIsEditingSkill(true);
  };

  const cancelEditing = () => {
    setIsEditingSkill(false);
    setEditForm(null);
  };

  const saveSkill = () => {
    setSkills(prev => prev.map(s => s.id === editForm.id ? editForm : s));
    setLockedSkill(editForm);
    setIsEditingSkill(false);
  };

  const addNewSkill = (tierName) => {
    if (!isUnlocked) return;
    const newSkill = {
      id: `new_${Date.now()}`,
      tier: tierName,
      name: 'Nova Habilidade',
      action: 'Ação / Bônus',
      type: 'Magia',
      color: 'border-slate-400',
      emoji: '✨',
      description: 'Descreva os efeitos mecânicos e lore da habilidade aqui...',
    };
    setSkills([...skills, newSkill]);
    setLockedSkill(newSkill);
    setEditForm(newSkill);
    setIsEditingSkill(true);
  };

  // Funções de Configuração e Layout
  const handleAddTier = (e) => {
    e.preventDefault();
    if (newTierName.trim() && !tiers.includes(newTierName.trim())) {
      setTiers([...tiers, newTierName.trim()]);
      setNewTierName("");
    }
  };

  const handleStatChange = (statKey, value) => {
    if (!isUnlocked) return;
    setStats(prev => ({ ...prev, [statKey]: value }));
  };

  return (
    <div className={`flex flex-col h-screen ${theme.bgMain} ${theme.textMain} font-sans overflow-hidden border-2 ${theme.borderBase} transition-colors duration-300`}>
      
      {/* HEADER COMPACTO (Apenas Configurações e Trava) */}
      <header className={`${theme.bgPanel} border-b ${theme.borderCard} p-2 flex justify-between items-center shrink-0`}>
        <div className="flex items-center gap-3">
          <h1 className={`text-xl font-bold ${theme.textHighlight} tracking-wider uppercase flex items-center gap-2`}>
            Grimório
            {!isUnlocked && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-600">Somente Leitura</span>}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botão de Trava Principal */}
          <button 
            onClick={() => {
              setIsUnlocked(!isUnlocked);
              if (isUnlocked) {
                setIsEditingSkill(false);
                setShowConfig(false);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${
              isUnlocked 
                ? 'bg-red-900/30 border-red-500/50 text-red-400 hover:bg-red-900/50' 
                : 'bg-green-900/30 border-green-500/50 text-green-400 hover:bg-green-900/50'
            }`}
            title={isUnlocked ? "Travar Ficha" : "Destravar Ficha para Edição"}
          >
            {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
            <span className="text-xs font-bold uppercase">{isUnlocked ? 'Destravar / Editar' : 'Travado'}</span>
          </button>

          {/* Botão de Configurações */}
          <button 
            onClick={() => {
              setShowConfig(!showConfig);
              if (!showConfig) setIsEditingSkill(false);
            }}
            className={`p-1.5 rounded border transition-colors ${showConfig ? 'bg-slate-700 border-slate-500 text-white' : `${theme.bgCard} ${theme.borderCard} text-slate-400 hover:text-white`}`}
            title="Configurações (Temas, Tiers)"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ESQUERDA: Status e Grid de Habilidades */}
        <div className={`w-[55%] flex flex-col border-r ${theme.borderCard} ${theme.bgPanel} overflow-hidden`}>
          
          {/* PAINEL DE STATUS (Fixo no topo da coluna da esquerda) */}
          <div className={`${theme.bgCard} p-3 border-b ${theme.borderCard} shrink-0 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono`}>
            {/* Linha 1: Nome e Info */}
            <div className="col-span-2 flex items-center justify-between border-b border-slate-700/50 pb-2 mb-1">
              <input 
                type="text" value={stats.name} readOnly={!isUnlocked}
                onChange={e => handleStatChange('name', e.target.value)}
                className={`font-bold text-lg bg-transparent border-b ${isUnlocked ? 'border-slate-500 focus:border-blue-500' : 'border-transparent outline-none'} w-1/2`}
              />
              <div className="flex gap-2">
                <span className="flex items-center gap-1">Nv. <input type="text" value={stats.level} readOnly={!isUnlocked} onChange={e => handleStatChange('level', e.target.value)} className={`w-12 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></span>
                <span className="flex items-center gap-1 text-red-400">Ins: <input type="text" value={stats.insanity} readOnly={!isUnlocked} onChange={e => handleStatChange('insanity', e.target.value)} className={`w-8 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></span>
              </div>
            </div>

            {/* Atributos Básicos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between"><span className="text-slate-500">FOR</span> <input type="text" value={stats.for} readOnly={!isUnlocked} onChange={e => handleStatChange('for', e.target.value)} className={`w-16 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">DEX</span> <input type="text" value={stats.dex} readOnly={!isUnlocked} onChange={e => handleStatChange('dex', e.target.value)} className={`w-16 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">RES</span> <input type="text" value={stats.res} readOnly={!isUnlocked} onChange={e => handleStatChange('res', e.target.value)} className={`w-16 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between"><span className="text-slate-500">AGI</span> <input type="text" value={stats.agi} readOnly={!isUnlocked} onChange={e => handleStatChange('agi', e.target.value)} className={`w-16 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></div>
              <div className="flex items-center justify-between"><strong className={theme.textHighlight}>INT</strong> <input type="text" value={stats.int} readOnly={!isUnlocked} onChange={e => handleStatChange('int', e.target.value)} className={`w-16 bg-transparent text-right font-bold ${theme.textHighlight} border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">CHA</span> <input type="text" value={stats.cha} readOnly={!isUnlocked} onChange={e => handleStatChange('cha', e.target.value)} className={`w-16 bg-transparent text-right border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/></div>
            </div>

            {/* Barras Principais */}
            <div className="col-span-2 flex items-center justify-around pt-2 border-t border-slate-700/50 mt-1 bg-[#050510]/50 p-2 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div> 
                <span className="text-slate-400">HP:</span> 
                <input type="text" value={stats.hp} readOnly={!isUnlocked} onChange={e => handleStatChange('hp', e.target.value)} className={`w-16 bg-transparent font-bold text-white border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div> 
                <span className="text-slate-400">Manto:</span> 
                <input type="text" value={stats.manto} readOnly={!isUnlocked} onChange={e => handleStatChange('manto', e.target.value)} className={`w-16 bg-transparent font-bold text-white border-b ${isUnlocked ? 'border-slate-500' : 'border-transparent outline-none'}`}/>
              </div>
            </div>
          </div>

          {/* GRID SCROLLÁVEL */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {tiers.map(tier => {
              const tierSkills = skills.filter(s => s.tier === tier);
              
              const rowSize = 8;
              const emptySlotsNeeded = (rowSize - ((tierSkills.length + (isUnlocked ? 1 : 0)) % rowSize)) % rowSize;
              
              return (
                <div key={tier} className="mb-5">
                  {/* Título do Tier */}
                  <div className={`flex items-center gap-2 mb-2 border-b ${theme.borderCard} pb-1`}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tier}</h3>
                    <span className="text-[10px] text-slate-600">({tierSkills.length})</span>
                  </div>
                  
                  {/* Grid de Ícones */}
                  <div className="flex flex-wrap gap-1.5">
                    {tierSkills.map(skill => {
                      const isLocked = lockedSkill && lockedSkill.id === skill.id;
                      const isHovered = hoveredSkill && hoveredSkill.id === skill.id && !isLocked;
                      
                      return (
                        <button
                          key={skill.id}
                          onMouseEnter={() => handleMouseEnter(skill)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleClick(skill)}
                          className={`
                            relative w-11 h-11 ${theme.bgCard} flex items-center justify-center rounded transition-all duration-100
                            border-2 text-xl
                            ${isLocked ? 'border-yellow-400 scale-110 z-10 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : skill.color}
                            ${isHovered ? 'border-white brightness-125 z-10' : ''}
                            hover:brightness-125
                          `}
                        >
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                          <span className="relative z-10 drop-shadow-md">
                            {skill.emoji || '✨'}
                          </span>
                          {isLocked && (
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full -mt-1 -mr-1 shadow-md"></div>
                          )}
                        </button>
                      );
                    })}
                    
                    {/* Botão de Adicionar (O [+]) - Só aparece se destravado */}
                    {isUnlocked && (
                      <button 
                        onClick={() => addNewSkill(tier)}
                        title={`Adicionar skill em ${tier}`}
                        className={`w-11 h-11 border-2 border-dashed ${theme.borderCard} ${theme.bgPanel} flex items-center justify-center text-slate-500 rounded hover:border-slate-300 hover:text-slate-200 transition-colors`}
                      >
                        <Plus size={18} />
                      </button>
                    )}

                    {/* Espaços Vazios para manter o grid alinhado */}
                    {Array.from({ length: emptySlotsNeeded }).map((_, i) => (
                      <div key={`empty-${i}`} className={`w-11 h-11 border border-black/20 ${theme.bgCard} rounded opacity-30`}></div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="h-20 text-center text-slate-700 text-xs pt-4 font-mono">- Fim do Grimório -</div>
          </div>
        </div>

        {/* DIREITA: Painel Híbrido */}
        <div className="w-[45%] bg-[#050510] relative flex flex-col">
          
          {/* MODO: CONFIGURAÇÕES GERAIS */}
          {showConfig ? (
            <div className="flex flex-col h-full bg-[#0a0a1a] animate-in fade-in">
              <div className="p-4 border-b border-[#2a2a4a] bg-[#10102a] flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2"><Settings size={18}/> Configurações da Ficha</h2>
                <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Temas */}
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Palette size={16}/> Paleta de Cores</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(THEMES).map(([key, t]) => (
                      <button 
                        key={key}
                        onClick={() => setCurrentThemeKey(key)}
                        className={`p-3 rounded border flex items-center justify-between transition-colors ${currentThemeKey === key ? 'bg-slate-800 border-blue-500' : 'bg-[#151525] border-[#2a2a4a] hover:border-slate-500'}`}
                      >
                        <span className="font-medium text-slate-200">{t.name}</span>
                        <div className="flex gap-1">
                          <div className={`w-4 h-4 rounded-full ${t.bgMain} border border-slate-600`}></div>
                          <div className={`w-4 h-4 rounded-full ${t.bgPanel} border border-slate-600`}></div>
                          <div className={`w-4 h-4 rounded-full ${t.bgCard} border border-slate-600`}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Gerenciar Tiers */}
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutList size={16}/> Categorias (Tiers)</h3>
                  
                  {isUnlocked ? (
                    <form onSubmit={handleAddTier} className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={newTierName}
                        onChange={(e) => setNewTierName(e.target.value)}
                        placeholder="Novo Nome (Ex: Especial, Magias Level 9)" 
                        className="flex-1 bg-[#151525] border border-[#2a2a4a] rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium">Adicionar</button>
                    </form>
                  ) : (
                    <p className="text-xs text-yellow-500 mb-4 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                      Destrave a ficha (no cadeado acima) para adicionar novas categorias.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {tiers.map(tier => (
                      <div key={tier} className="bg-[#151525] border border-[#2a2a4a] text-slate-300 px-3 py-1.5 rounded text-sm flex items-center gap-2">
                        {tier}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : 
          
          /* MODO: EDIÇÃO DE SKILL */
          isEditingSkill && editForm ? (
            <div className="flex flex-col h-full bg-[#0a0a1a] animate-in fade-in">
              <div className="p-4 border-b border-[#2a2a4a] flex justify-between items-center bg-[#10102a]">
                <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2"><Edit2 size={18} /> Editando Magia</h2>
                <div className="flex gap-2">
                  <button onClick={cancelEditing} className="px-3 py-1 bg-slate-800 text-sm text-slate-300 rounded hover:bg-slate-700">Cancelar</button>
                  <button onClick={saveSkill} className="px-3 py-1 bg-blue-600 text-sm text-white rounded hover:bg-blue-500 flex items-center gap-1"><Save size={14}/> Salvar</button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-16">
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Ícone</label>
                    <input 
                      type="text" 
                      value={editForm.emoji} 
                      onChange={e => setEditForm({...editForm, emoji: e.target.value})}
                      placeholder="✨"
                      className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-center text-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Nome da Habilidade</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Custo / Ação</label>
                    <input 
                      type="text" 
                      value={editForm.action} 
                      onChange={e => setEditForm({...editForm, action: e.target.value})}
                      className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Tipo (Ex: Fogo)</label>
                    <input 
                      type="text" 
                      value={editForm.type} 
                      onChange={e => setEditForm({...editForm, type: e.target.value})}
                      className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Cor da Borda</label>
                  <select 
                    value={editForm.color} 
                    onChange={e => setEditForm({...editForm, color: e.target.value})}
                    className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="border-slate-500">Cinza (Padrão/Físico)</option>
                    <option value="border-red-600">Vermelho (Fogo/Dano)</option>
                    <option value="border-blue-500">Azul (Mágico/Gelo)</option>
                    <option value="border-green-600">Verde (Veneno/Cura)</option>
                    <option value="border-purple-500">Roxo (Sombrio/Ilusão)</option>
                    <option value="border-yellow-500">Amarelo (Elétrico/Luz)</option>
                    <option value="border-orange-500">Laranja (Fogo Infernal)</option>
                    <option value="border-fuchsia-600">Fúcsia (Necromancia)</option>
                    <option value="border-stone-400">Pedra (Defesa/Terra)</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Descrição (Markdown implícito / Quebras de linha)</label>
                  <textarea 
                    value={editForm.description} 
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full flex-1 min-h-[300px] bg-[#151525] border border-[#2a2a4a] rounded p-3 text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
                  ></textarea>
                </div>
              </div>
            </div>
          ) : 
          
          /* MODO: LEITURA DE SKILL */
          displaySkill ? (
            <div className="relative z-10 flex flex-col h-full animate-in fade-in duration-200">
              
              {/* Header da Skill */}
              <div className={`p-5 pb-3 border-b ${theme.borderCard} ${theme.bgPanel} shrink-0`}>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-wide leading-tight flex items-center gap-3">
                    <span className="text-3xl drop-shadow-md">{displaySkill.emoji}</span>
                    {displaySkill.name}
                  </h2>
                  
                  {/* Controles: Se a skill estiver travada e a ficha destravada, permite editar */}
                  {lockedSkill?.id === displaySkill.id && (
                    <div className="flex gap-2 shrink-0 ml-4">
                      {isUnlocked && (
                        <button onClick={startEditing} className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-600 transition-colors">
                          <Edit2 size={12} /> Editar
                        </button>
                      )}
                      <button onClick={() => setLockedSkill(null)} className="flex items-center justify-center w-7 h-7 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded border border-red-900/50 transition-colors" title="Destravar Leitura">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-3">
                  <span className={`${theme.bgCard} px-2 py-1 rounded border ${theme.borderCard} text-blue-300`}>
                    {displaySkill.action}
                  </span>
                  <span className={`${theme.bgCard} px-2 py-1 rounded border ${theme.borderCard} text-purple-300`}>
                    {displaySkill.type}
                  </span>
                  {lockedSkill?.id === displaySkill.id && (
                    <span className="text-yellow-500 font-bold ml-auto animate-pulse flex items-center gap-1">
                      <Eye size={12} /> TRAVADO
                    </span>
                  )}
                </div>
              </div>

              {/* Corpo do Texto Gigante */}
              <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-base leading-relaxed custom-scrollbar whitespace-pre-wrap font-serif">
                {displaySkill.description}
                <div className="h-10"></div>
              </div>
            </div>
          ) : (
            
            /* MODO: ESTADO VAZIO */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 relative z-10 p-10 text-center">
              <Book size={64} className="mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">Selecione uma Magia</h3>
              <p>Passe o mouse na grade à esquerda para espiar o texto.</p>
              <p className="mt-2 text-sm">Clique em um quadrado para <strong className="text-yellow-600">Travar a Leitura</strong>.</p>
              {!isUnlocked && (
                <div className="mt-8 p-3 bg-red-900/10 border border-red-900/30 rounded text-xs text-red-400 max-w-sm">
                  <Lock size={16} className="inline mr-2 mb-1" />
                  A ficha está travada para evitar edições acidentais durante o combate. Desbloqueie no topo para editar atributos, magias ou criar novos Tiers.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
          border-left: 1px solid rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a4a; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a8a; 
        }
        /* Utilitário de animação suave */
        .animate-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
```

### 📄 Arquivo: `grimorio_robert_jones (2).tsx`
```tsx
import React, { useState, useEffect } from 'react';
import { Settings, Lock, Unlock, Plus, Edit2, Save, X, Pin, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_SKILLS = [
  { id: 's1', tier: 'Tier 1', name: 'Capeta Indigno (Imp)', icon: '💀', action: 'Bônus Action', type: 'Conjuração', color: 'border-red-600', description: 'Selado no meu isqueiro, nunca tenho que trocar o óleo.\n\nLvl 1 - Vira hunters mark.' },
  { id: 's2', tier: 'Tier 1', name: 'Sorte do Diabo lvl 3', icon: '✨', action: 'Bônus Action', type: 'Adivinhação', color: 'border-purple-500', description: 'Me permite trapacear em jogos de Azar...\n\nLvL 2: Quando um jogador rolar um resultado, se for impar, eu posso dar um re-roll.' },
  { id: 's3', tier: 'Passivas', name: 'Sobretudo de Naida', icon: '🧥', action: 'Passivo', type: 'Defesa', color: 'border-slate-500', description: 'Naida é um Fey. Ele é tipo a capa do dr estranho, voa sozinho.\n\nlvl 5 - Ganho 5 de armadura base.' },
];
const INITIAL_TIERS = ['Passivas', 'Especiais', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6', 'Tier 7', 'Tier 8'];
const INITIAL_ATTRIBUTES = [
  { id: 'for', label: 'FOR', value: '40(20)' },
  { id: 'dex', label: 'DEX', value: '101(50)' },
  { id: 'res', label: 'RES', value: '100(50)' },
  { id: 'agi', label: 'AGI', value: '34(17)' },
  { id: 'int', label: 'INT', value: '140(70)' },
  { id: 'cha', label: 'CHA', value: '100(50)' }
];
const INITIAL_RESOURCES = [
  { id: 'hp', label: 'HP', value: '1545', color: 'bg-red-500' },
  { id: 'manto', label: 'Manto Arcano', value: '2575', color: 'bg-blue-500' }
];

const THEMES = [
  { id: 'default', name: 'Padrão (Trevas)', bg: '#070714', panel: '#0a0a1a', border: '#2a2a4a' },
  { id: 'blood', name: 'Sangue Demoníaco', bg: '#140505', panel: '#1a0808', border: '#4a1515' },
  { id: 'necro', name: 'Necromante', bg: '#100514', panel: '#150a1a', border: '#3a154a' },
  { id: 'arcane', name: 'Arcano', bg: '#051014', panel: '#08151a', border: '#153a4a' },
  { id: 'noir', name: 'Noir', bg: '#0a0a0a', panel: '#121212', border: '#333333' },
  { id: 'paladin', name: 'Paladino', bg: '#141205', panel: '#1a1808', border: '#4a4215' },
  { id: 'druid', name: 'Druida', bg: '#051408', panel: '#081a0c', border: '#154a22' },
  { id: 'cyber', name: 'Cyberpunk', bg: '#0a001a', panel: '#10002b', border: '#e01e8a' },
  { id: 'chaos', name: 'Chamas do Caos', bg: '#1a0a00', panel: '#2b1000', border: '#d97706' },
  { id: 'deep', name: 'Profundeza', bg: '#00101a', panel: '#00182b', border: '#0d9488' }
];

function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}

export default function FichaRPG() {
  const [characterName, setCharacterName] = useStickyState('Robert (Summer) Jones', 'rpg_name');
  const [attributes, setAttributes] = useStickyState(INITIAL_ATTRIBUTES, 'rpg_attrs');
  const [resources, setResources] = useStickyState(INITIAL_RESOURCES, 'rpg_resources');
  const [tiers, setTiers] = useStickyState(INITIAL_TIERS, 'rpg_tiers');
  const [skills, setSkills] = useStickyState(INITIAL_SKILLS, 'rpg_skills');
  const [activeThemeId, setActiveThemeId] = useStickyState('default', 'rpg_theme');

  const [isSheetUnlocked, setIsSheetUnlocked] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [pinnedSkill, setPinnedSkill] = useState(null);
  
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newTierName, setNewTierName] = useState('');

  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
  const displaySkill = pinnedSkill || hoveredSkill;

  const handleMouseEnter = (skill) => { if (!isEditingSkill) setHoveredSkill(skill); };
  const handleMouseLeave = () => { if (!isEditingSkill) setHoveredSkill(null); };
  
  const handlePinToggle = (skill) => {
    if (isEditingSkill) return;
    if (pinnedSkill && pinnedSkill.id === skill.id) {
      setPinnedSkill(null);
    } else {
      setPinnedSkill(skill);
      setHoveredSkill(null);
      setShowConfig(false);
    }
  };

  const startEditing = () => {
    setEditForm({ ...displaySkill });
    setIsEditingSkill(true);
  };

  const saveSkill = () => {
    if (editForm.isNew) {
      const newSkillObj = { ...editForm };
      delete newSkillObj.isNew;
      setSkills([...skills, newSkillObj]);
      setPinnedSkill(newSkillObj);
    } else {
      setSkills(skills.map(s => s.id === editForm.id ? editForm : s));
      setPinnedSkill(editForm);
    }
    setIsEditingSkill(false);
  };

  const createNewSkill = (tierName) => {
    const newSkill = {
      id: `new_${Date.now()}`,
      isNew: true,
      tier: tierName,
      name: 'Nova Habilidade',
      icon: '✨',
      action: 'Ação / Bônus',
      type: 'Magia',
      color: 'border-slate-500',
      description: 'Descreva os efeitos mecânicos...',
    };
    setPinnedSkill(newSkill);
    setEditForm(newSkill);
    setIsEditingSkill(true);
    setShowConfig(false);
  };

  const deleteSkill = (id) => {
    // Usando mensagem em tela ao invés de alert/confirm para evitar bloqueios no componente React
    const confirmDelete = window.confirm("Certeza que deseja apagar esta habilidade?");
    if(confirmDelete) {
      setSkills(skills.filter(s => s.id !== id));
      setPinnedSkill(null);
      setIsEditingSkill(false);
    }
  };

  const addTier = () => {
    if(newTierName.trim() && !tiers.includes(newTierName.trim())) {
      setTiers([...tiers, newTierName.trim()]);
      setNewTierName('');
    }
  };

  const removeTier = (tierToRemove) => {
    setTiers(tiers.filter(t => t !== tierToRemove));
  };

  const addAttribute = () => {
    const newId = `attr_${Date.now()}`;
    setAttributes([...attributes, { id: newId, label: 'NOVO', value: '0' }]);
  };

  const removeAttribute = (id) => {
    setAttributes(attributes.filter(a => a.id !== id));
  };

  const updateAttribute = (id, field, newValue) => {
    setAttributes(attributes.map(a => a.id === id ? { ...a, [field]: newValue } : a));
  };

  const addResource = () => {
    const newId = `res_${Date.now()}`;
    setResources([...resources, { id: newId, label: 'Novo', value: '100', color: 'bg-green-500' }]);
  };

  const removeResource = (id) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id, field, newValue) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: newValue } : r));
  };

  return (
    <div className="flex flex-col h-screen text-slate-300 font-sans overflow-hidden" style={{ backgroundColor: activeTheme.bg }}>
      <header className="p-3 shrink-0 flex flex-col gap-2 border-b" style={{ backgroundColor: activeTheme.panel, borderColor: activeTheme.border }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm uppercase tracking-widest font-bold">Nome:</span>
            {isSheetUnlocked ? (
              <input 
                className="bg-black/30 border border-slate-700 rounded px-2 py-1 text-white font-bold w-64"
                value={characterName} 
                onChange={(e) => setCharacterName(e.target.value)}
              />
            ) : (
              <h1 className="text-xl font-bold text-white tracking-wider">{characterName}</h1>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSheetUnlocked(!isSheetUnlocked)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-bold border transition-colors ${isSheetUnlocked ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-green-900/30 border-green-500 text-green-400'}`}
            >
              {isSheetUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
              {isSheetUnlocked ? "FICHA DESTRAVADA" : "FICHA TRAVADA"}
            </button>
            <button 
              onClick={() => { setShowConfig(!showConfig); setPinnedSkill(null); setIsEditingSkill(false); }}
              className={`p-1.5 rounded border transition-colors ${showConfig ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white'}`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-black/20 p-2 rounded border border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            {attributes.map(attr => (
              <div key={attr.id} className="flex items-center gap-1">
                {isSheetUnlocked ? (
                  <>
                    <button onClick={() => removeAttribute(attr.id)} className="text-red-500 hover:bg-red-500/20 rounded p-0.5"><X size={12}/></button>
                    <input className="w-10 bg-transparent text-slate-400 border-b border-slate-700 text-center uppercase" value={attr.label} onChange={(e) => updateAttribute(attr.id, 'label', e.target.value)} />
                    <input className="w-14 bg-black/50 border border-slate-700 rounded px-1 text-white text-center" value={attr.value} onChange={(e) => updateAttribute(attr.id, 'value', e.target.value)} />
                  </>
                ) : (
                  <><span className="text-slate-500">{attr.label}</span> <strong className="text-white">{attr.value}</strong></>
                )}
              </div>
            ))}
            {isSheetUnlocked && <button onClick={addAttribute} className="text-green-500 flex items-center bg-green-500/10 px-1 rounded hover:bg-green-500/20"><Plus size={14}/> Attr</button>}
          </div>

          <div className="w-px h-6 bg-slate-700 mx-2"></div>

          <div className="flex flex-wrap items-center gap-4">
            {resources.map(res => (
              <div key={res.id} className="flex items-center gap-1">
                {isSheetUnlocked ? (
                  <>
                    <button onClick={() => removeResource(res.id)} className="text-red-500 hover:bg-red-500/20 rounded p-0.5"><X size={12}/></button>
                    <div className={`w-2 h-2 rounded-full ${res.color}`}></div>
                    <input className="w-20 bg-transparent text-slate-400 border-b border-slate-700" value={res.label} onChange={(e) => updateResource(res.id, 'label', e.target.value)} />
                    <input className="w-16 bg-black/50 border border-slate-700 rounded px-1 text-white text-center" value={res.value} onChange={(e) => updateResource(res.id, 'value', e.target.value)} />
                  </>
                ) : (
                  <><div className={`w-2 h-2 rounded-full ${res.color}`}></div><span className="text-slate-400">{res.label}:</span> <strong className="text-white">{res.value}</strong></>
                )}
              </div>
            ))}
            {isSheetUnlocked && <button onClick={addResource} className="text-green-500 flex items-center bg-green-500/10 px-1 rounded hover:bg-green-500/20"><Plus size={14}/> Recurso</button>}
          </div>
        </div>
      </header>

      {}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[55%] flex flex-col overflow-y-auto custom-scrollbar p-4 border-r" style={{ borderColor: activeTheme.border }}>
          {tiers.map(tier => {
            const tierSkills = skills.filter(s => s.tier === tier);
            const rowSize = 8;
            const emptySlotsNeeded = (rowSize - ((tierSkills.length + (isSheetUnlocked ? 1 : 0)) % rowSize)) % rowSize;
            const canDeleteTier = tierSkills.length === 0;

            return (
              <div key={tier} className="mb-6">
                <div className="flex items-center gap-2 mb-2 border-b pb-1" style={{ borderColor: activeTheme.border }}>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tier}</h3>
                  <span className="text-[10px] text-slate-600">({tierSkills.length})</span>
                  {isSheetUnlocked && (
                    <button 
                      onClick={() => removeTier(tier)}
                      disabled={!canDeleteTier}
                      title={canDeleteTier ? "Apagar Linha" : "Esvazie a linha antes de apagar"}
                      className={`ml-auto p-1 rounded ${canDeleteTier ? 'text-red-500 hover:bg-red-500/20' : 'text-slate-700 cursor-not-allowed'}`}
                    >
                      <Trash2 size={14}/>
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {tierSkills.map(skill => {
                    const isPinned = pinnedSkill && pinnedSkill.id === skill.id;
                    const isHovered = hoveredSkill && hoveredSkill.id === skill.id && !isPinned;
                    return (
                      <button
                        key={skill.id}
                        onMouseEnter={() => handleMouseEnter(skill)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handlePinToggle(skill)}
                        className={`
                          relative w-11 h-11 flex items-center justify-center rounded transition-all duration-100 border-2
                          ${isPinned ? 'border-yellow-400 scale-110 z-10 shadow-[0_0_10px_rgba(250,204,21,0.5)] bg-[#1a1a2e]' : `${skill.color} bg-black/40`}
                          ${isHovered ? 'border-white brightness-125 z-10 bg-[#1a1a2e]' : ''}
                          hover:brightness-125
                        `}
                      >
                        <span className="relative z-10 text-xl">{skill.icon || '✨'}</span>
                        {isPinned && <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full -mt-1 -mr-1 shadow-md"></div>}
                      </button>
                    );
                  })}
                  
                  {isSheetUnlocked && (
                    <button onClick={() => createNewSkill(tier)} className="w-11 h-11 border-2 border-dashed bg-black/20 flex items-center justify-center text-slate-500 rounded hover:border-slate-300 hover:text-slate-200" style={{ borderColor: activeTheme.border }}>
                      <Plus size={18} />
                    </button>
                  )}

                  {Array.from({ length: emptySlotsNeeded }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-11 h-11 border bg-black/10 rounded opacity-30" style={{ borderColor: activeTheme.border }}></div>
                  ))}
                </div>
              </div>
            );
          })}

          {isSheetUnlocked && (
            <div className="mt-4 p-3 bg-black/20 rounded border border-dashed flex gap-2 items-center" style={{ borderColor: activeTheme.border }}>
              <input 
                type="text" 
                placeholder="Ex: Armas Demoniacas..." 
                value={newTierName}
                onChange={(e) => setNewTierName(e.target.value)}
                className="bg-black/50 border border-slate-700 rounded px-2 py-1 text-sm flex-1 text-white"
                onKeyDown={(e) => { if(e.key === 'Enter') addTier(); }}
              />
              <button onClick={addTier} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm text-white font-bold">Criar Linha</button>
            </div>
          )}
        </div>

        {}
        <div className="w-[45%] relative flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.5)]" style={{ backgroundColor: activeTheme.panel }}>
          
          {showConfig ? (
            <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar text-slate-300">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2"><Settings size={24}/> Configurações</h2>
              
              <div className="border rounded overflow-hidden mb-6" style={{ borderColor: activeTheme.border }}>
                <button 
                  onClick={() => setThemesOpen(!themesOpen)}
                  className="w-full p-4 flex justify-between items-center bg-black/30 hover:bg-black/50 font-bold"
                >
                  <span className="flex items-center gap-2">🎨 Paleta de Cores ({THEMES.length} opções)</span>
                  {themesOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                </button>
                
                {themesOpen && (
                  <div className="p-4 grid grid-cols-2 gap-3 bg-black/20">
                    {THEMES.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setActiveThemeId(t.id)}
                        className={`p-3 rounded border text-left flex items-center justify-between transition-all ${activeThemeId === t.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-700 hover:border-slate-500'}`}
                        style={{ backgroundColor: t.panel }}
                      >
                        <span className="font-bold text-sm text-white">{t.name}</span>
                        <div className="flex">
                          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: t.bg }}></div>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.border }}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : isEditingSkill && editForm ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center bg-black/30" style={{ borderColor: activeTheme.border }}>
                <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2"><Edit2 size={18} /> Editando Habilidade</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditingSkill(false); if(editForm.isNew) setPinnedSkill(null); }} className="px-3 py-1 bg-slate-800 text-sm text-slate-300 rounded hover:bg-slate-700">Cancelar</button>
                  <button onClick={saveSkill} className="px-3 py-1 bg-green-600 text-sm text-white font-bold rounded hover:bg-green-500 flex items-center gap-1"><Save size={14}/> Salvar</button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-16">
                    <label className="block text-xs text-slate-400 mb-1">ÍCONE</label>
                    <input type="text" value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="w-full bg-black/40 border rounded p-2 text-center text-xl" style={{ borderColor: activeTheme.border }}/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">NOME DA HABILIDADE</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/40 border rounded p-2 text-white" style={{ borderColor: activeTheme.border }}/>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">CUSTO / AÇÃO</label>
                    <input type="text" value={editForm.action} onChange={e => setEditForm({...editForm, action: e.target.value})} className="w-full bg-black/40 border rounded p-2 text-white text-sm" style={{ borderColor: activeTheme.border }}/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">TIPO (EX: FOGO, ILUSÃO)</label>
                    <input type="text" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="w-full bg-black/40 border rounded p-2 text-white text-sm" style={{ borderColor: activeTheme.border }}/>
                  </div>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">COR DA BORDA</label>
                    <select value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} className="w-full bg-black/40 border rounded p-2 text-white text-sm" style={{ borderColor: activeTheme.border }}>
                      <option value="border-slate-500">Cinza (Padrão)</option>
                      <option value="border-red-600">Vermelho (Sangue/Fogo)</option>
                      <option value="border-blue-500">Azul (Mágico/Gelo)</option>
                      <option value="border-green-600">Verde (Veneno/Cura)</option>
                      <option value="border-purple-500">Roxo (Sombrio/Ilusão)</option>
                      <option value="border-yellow-500">Amarelo (Elétrico/Luz)</option>
                      <option value="border-fuchsia-600">Fúcsia (Necromancia)</option>
                    </select>
                  </div>
                  {!editForm.isNew && (
                    <button onClick={() => deleteSkill(editForm.id)} className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 border border-red-900 rounded flex items-center gap-2 text-sm font-bold">
                      <Trash2 size={16}/> APAGAR MAGIA
                    </button>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs text-slate-400 mb-1">DESCRIÇÃO (MECÂNICAS E LORE)</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full flex-1 min-h-[300px] bg-black/40 border rounded p-4 text-slate-300 font-serif leading-relaxed resize-none custom-scrollbar" style={{ borderColor: activeTheme.border }}></textarea>
                </div>
              </div>
            </div>
          ) : displaySkill ? (
            <div className="relative z-10 flex flex-col h-full animate-in fade-in duration-200">
              <div className="p-6 pb-4 border-b bg-black/20 shrink-0" style={{ borderColor: activeTheme.border }}>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-3xl font-bold text-white tracking-wide leading-tight flex items-center gap-3">
                    <span className="text-4xl drop-shadow-md">{displaySkill.icon || '✨'}</span> 
                    {displaySkill.name}
                  </h2>
                  
                  {pinnedSkill?.id === displaySkill.id && isSheetUnlocked && (
                    <button onClick={startEditing} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded shadow-lg border border-slate-600">
                      <Edit2 size={14} /> Editar
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-slate-400">
                  <span className="bg-black/40 px-3 py-1 rounded border text-blue-300" style={{ borderColor: activeTheme.border }}>{displaySkill.action}</span>
                  <span className="bg-black/40 px-3 py-1 rounded border text-purple-300" style={{ borderColor: activeTheme.border }}>{displaySkill.type}</span>
                  
                  {pinnedSkill?.id === displaySkill.id && (
                    <span className="text-yellow-500 font-bold ml-auto flex items-center gap-1 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-500/50">
                      <Pin size={14} /> FIXADO
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-lg leading-relaxed custom-scrollbar whitespace-pre-wrap font-serif">
                {displaySkill.description}
                <div className="h-12"></div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 relative z-10 p-10 text-center">
              <div className="text-6xl mb-4 opacity-30">📖</div>
              <h3 className="text-2xl font-bold mb-2">Painel de Leitura</h3>
              <p className="text-lg">Passe o mouse sobre os ícones à esquerda.</p>
              <p className="mt-4 text-sm text-slate-500">Clique no ícone para <strong className="text-yellow-600">Fixar</strong> o texto na tela.</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${activeTheme.border}; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4a4a8a; }
        * { outline: none; }
      `}} />
    </div>
  );
}
```

### 📄 Arquivo: `grimorio_robert_jones.tsx`
```tsx
import React, { useState } from 'react';
import { Sword, Shield, Zap, Sparkles, Book, Flame, Wind, Droplets, Skull, Plus, Edit2, Save, Eye, EyeOff, X } from 'lucide-react';

// === DADOS INICIAIS BASEADOS NA FICHA DO ROBERT JONES ===
const INITIAL_SKILLS = [
  {
    id: 'p1', tier: 'Passivas', name: 'Sobretudo de Naida - lvl 5', action: 'Passivo / Bônus', type: 'Defesa / Utilitário', color: 'border-slate-500', iconType: 'Shield',
    description: `Naida é um Fey, nao sei oq ele é exatamente. Ele perdeu uma aposta com um mago a 950 anos atras, e ele tem que servir a humanidade por 1000 anos, e ele just so happen, de ser minha posse no momento. Ele nao fala mas tem inteligencia. Ele é tipo a capa do dr estranho, voa sozinho (nao me faz voar) consegue pegar coisas.

Ele é uma mage armor (tipo skyrim q tem uma aura fina ao redor) ele sempre me da metade do meu mod de int de ArmB. Ao invés, eu posso fazer a minha armadura base ser metade do mod de int x tier que eu usar (bonus action) a duraçao é a tier em horas. quando eu casto uma barreira eu adiciono meu valor de ArmB.
Refinamento /5 (150 crit) 30 ab

lvl 1 - Aumento distancia de pulo com int
lvl 2 - Consigo andar na parede brevemente mov = mod int
lvl 3 - Coloco metade mod de For na armadura base
lvl 4 - Slowfall, recebo metade do dano de fall damage...
lvl 5 - Ganho 5 de armadura base. Eu posso usar meu sobretudo como uma bag of holding...`
  },
  {
    id: 'p2', tier: 'Passivas', name: 'Manto Arcano lvl 5', action: 'Passivo', type: 'Defesa Magica', color: 'border-blue-500', iconType: 'Sparkles',
    description: `Tenho uma barra de vida extra para receber danos proveniente de magia (exceto físicos e venenoso), esse calculo é feito igualmente a quantidade que se ganharia de hp vezes o level proveniente de resistência, porem, usando inteligência no lugar. Fica ligado se eu cair inconsciente.

lvl 1 - Posso invocar copias ilusorias de items que estão na minha pocket dimension...
lvl 2 - com a bonus action posso criar uma ward magica (a la skyrim)...
lvl 3 - quando uma magia atinge minha ward eu ganho slot temporario...
lvl 4 - Dragon hide - posso ativar com a bonus action, ganho x2 na armadura ao tipo de dano magico comumente usado por dragoes...
lvl 5 - Dragon Meal - quando eu levar um dano, transformo em dragon breath.`
  },
  {
    id: 't1_1', tier: 'Tier 1', name: 'Capeta Indigno de Nome (Imp)', action: 'Bônus Action', type: 'Conjuração', color: 'border-red-600', iconType: 'Skull',
    description: `Selado no meu isqueiro, nunca tenho que trocar o óleo.
É um demônio insignificante pouco maior que um dedo que eu maltrato, eu sou o dono dele para todos os efeitos e ele é meu escravo enquanto eu viver. Ele sabe muitas coisas. Ele meio que sempre esta invocado no meu isqueiro.

Ele faz "the usual familiar things", costuma ser invisível e mudar a aparência, mas eu não tenho controle absoluto dele. HP é meu mod de int, os outros stats dele quando ele ta invocado é 6 de mod. Ter gasto a bônus action dessa skill é pré-requisito para outras habilidades (Imp).

lvl 1 - ele vira um hunters mark.
lvl 2 - O fogo do meu esqueiro evapora agua facilmente, e nao se apaga por meios não magicos.`
  },
  {
    id: 't1_2', tier: 'Tier 1', name: 'Sorte do Diabo lvl 3', action: 'Bônus Action', type: 'Adivinhação', color: 'border-purple-500', iconType: 'Sparkles',
    description: `Me permite trapacear em jogos de Azar, se for um numero, eu sei que numero vai dar...

LvL 1: (link) quando um par e bom ímpar e ruim e rolado eu posso dar um re-roll. Só posso fazer isso pra um jogador por dia.
LvL 2: (link) Quando um jogador rolar um resultado, se for impar, eu posso dar um re-roll. De acordo com o novo resultado a Skill funciona diferente. Se for par, fica com o novo , se for acerto crítico ignora o crítico. Se for ímpar mas maior que o resultado anterior, ignora e fica com o antigo...
LvL 3: Posso dar re-roll em erro critico de esquiva, se a esquiva falhar mesmo assim ele cai prone.`
  },
  {
    id: 't2_1', tier: 'Tier 2', name: 'Cauda de Bathin lvl 5', action: 'Ação / Imp', type: 'Conjuração', color: 'border-green-600', iconType: 'Zap',
    description: `Range: mod de int.
Invoco uma serpente que é a cauda de um demônio cavalo, ele bate (perfurante) através de um portal, deixa restrained ate passar o save de for e vai embora, range igual meu mod de int.

"Cavalo satã com cauda de cobra, tu que és o decimo oitavo espirito na chave menor de solomon, duque do inferno que comanda trinta e sete legiões de demônios, não direi teu nome, mas me da uma forcinha"

lvl 1 - Ataque de oportunidade se andar sem disengage.
lvl 2 - add mod int/2 elétrico.
lvl 5 - Posso me puxar na direção.`
  },
  {
    id: 't3_1', tier: 'Tier 3', name: 'Maldição de Cytorak', action: 'Bônus Action / Concentração', type: 'Encantamento / Imp', color: 'border-red-800', iconType: 'Skull',
    description: `Marco um alvo, a maldição é uma marca brilhante visivel no peito e nao pode ser removida com dispell e cleanses.
Eu tenho que explicar pro alvo que, se eu matar ele enquanto ele estiver com a marca, a alma dele vai pro inferno por X(slot) dias pra ser torturado por cytorak, porém eu posso tirar a marca se ele se render.

SKILL: Sempre que eu errar uma magia ataque ranged no alvo marcado, esse ataque vira uma esfera e fica ali flutuando ao redor do alvo. No inicio do meu proximo turno, eu posso atacar o alvo com as esferas presentes de novo.
Sempre que eu erro uma esfera eu ganho um bonus de 1d4 pra acertar a proxima.`
  },
  {
    id: 't6_1', tier: 'Tier 6', name: 'Solo de Sitri lvl 1', action: 'Ação / Concentração', type: 'Necromancia / Imp', color: 'border-fuchsia-600', iconType: 'Flame',
    description: `Eu brevemente profano o chao em que eu piso, numa area em 35ft a partir de mim. Todos que iniciarem o turno ou entrarem na area recebe um ataque, se atingido faz save de resistencia, se passar recebe metade do dano. O dano é um smite de t6 necrotico direto na vida.

Sitri é um principe do inferno, tem o corpo de uma mulher gostosa, asas de anjo negras e cabeças de onça. Ela fica me agarrando enquanto eu mantenho a skill ligada.

"Decimo segundo espirito da Ars Goetia, principe comandante de 60 legioes infernais... Seduza meus inimigos ao poder profano..."

lvl 1 - a area é terreno dificil`
  },
  {
    id: 't8_1', tier: 'Tier 8', name: 'Redemoinho Felinfernal', action: 'Ação', type: 'Evocação Espacial', color: 'border-red-900', iconType: 'Wind',
    description: `Duração 6 Rodadas. Ou até eu desligar a skill.
Seleciono um ponto no mapa aonde eu possa ver em até 500ft, um portal interdimensional instável que se alterna rapidamente entre camadas diferentes do inferno aparece no local. Criaturas na área levam dano T8.

Ao ativar a skill eu jogo 5d8s, re-rolando valores iguais ate que tenham 5 números diferentes. no inicio dos meus turnos, a esfera dispara num alvo aleatorio presente. (50% chance de ir na gente ou inimigo).

Enquanto a skill estiver ativa, todo effort ou buff que for adicionado num dano de magia minha, eu pego esse valor e adiciono numa pool. Essa pool funciona como effort funcionava antigamente, mas apenas para danos de magia.`
  }
];

const TIERS = ['Passivas', 'Especiais', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6', 'Tier 7', 'Tier 8'];

const getIconComponent = (type) => {
  switch (type) {
    case 'Shield': return <Shield size={20} />;
    case 'Sparkles': return <Sparkles size={20} />;
    case 'Skull': return <Skull size={20} />;
    case 'Flame': return <Flame size={20} />;
    case 'Wind': return <Wind size={20} />;
    case 'Zap': return <Zap size={20} />;
    case 'Droplets': return <Droplets size={20} />;
    default: return <Book size={20} />;
  }
};

export default function FichaRobertJones() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [lockedSkill, setLockedSkill] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // A habilidade exibida no painel direito
  const displaySkill = lockedSkill || hoveredSkill;

  // Interações com o mouse
  const handleMouseEnter = (skill) => {
    if (!isEditing) setHoveredSkill(skill);
  };
  const handleMouseLeave = () => {
    if (!isEditing) setHoveredSkill(null);
  };
  const handleClick = (skill) => {
    if (isEditing) return; // Se estiver editando algo, não deixa trocar clicando fora facilmente

    if (lockedSkill && lockedSkill.id === skill.id) {
      setLockedSkill(null);
      setHoveredSkill(null);
    } else {
      setLockedSkill(skill);
    }
  };

  // Funções de Edição
  const startEditing = () => {
    setEditForm({ ...displaySkill });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const saveSkill = () => {
    setSkills(prev => prev.map(s => s.id === editForm.id ? editForm : s));
    setLockedSkill(editForm); // Atualiza o painel travado com a nova versão
    setIsEditing(false);
  };

  const addNewSkill = (tierName) => {
    const newSkill = {
      id: `new_${Date.now()}`,
      tier: tierName,
      name: 'Nova Habilidade',
      action: 'Ação / Bônus',
      type: 'Magia',
      color: 'border-slate-400',
      iconType: 'Book',
      description: 'Descreva os efeitos mecânicos e lore da habilidade aqui...',
    };
    setSkills([...skills, newSkill]);
    setLockedSkill(newSkill);
    setEditForm(newSkill);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#070714] text-slate-300 font-sans overflow-hidden border-2 border-[#1e1e4a]">
      
      {/* HEADER COMPACTO - Status do Robert */}
      <header className="bg-[#0b0b1a] border-b border-[#2a2a6a] p-2 flex justify-between items-center shrink-0 text-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-red-500 tracking-wider uppercase">Robert (Summer) Jones</h1>
          <span className="px-2 py-0.5 bg-slate-800 text-xs rounded border border-slate-600">Nível 515</span>
          <span className="px-2 py-0.5 bg-[#2a1010] text-red-300 text-xs rounded border border-red-900/50">Insanidade: 63</span>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <div className="flex items-center gap-1"><span className="text-slate-500">FOR</span> 40(20)</div>
          <div className="flex items-center gap-1"><span className="text-slate-500">DEX</span> 101(50)</div>
          <div className="flex items-center gap-1"><span className="text-slate-500">RES</span> 100(50)</div>
          <div className="flex items-center gap-1"><span className="text-slate-500">AGI</span> 34(17)</div>
          <div className="flex items-center gap-1"><strong className="text-blue-400">INT 140(70)</strong></div>
          <div className="flex items-center gap-1"><span className="text-slate-500">CHA</span> 100(50)</div>
          <div className="flex items-center gap-1 border-l pl-2 border-slate-700">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div> HP: 1545
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Manto Arcano: 2575
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ESQUERDA: Grade Compacta por Tiers */}
        <div className="w-[55%] flex flex-col border-r border-[#2a2a6a] bg-[#0a0a1a] overflow-y-auto custom-scrollbar p-3">
          
          {TIERS.map(tier => {
            const tierSkills = skills.filter(s => s.tier === tier);
            
            // Para deixar o visual bonito, vamos preencher os "buracos" vazios para formar linhas (ex: múltiplos de 6 ou 8)
            // Calculamos quantos slots faltam para fechar uma fileira de 8 (ajustável)
            const rowSize = 8;
            const emptySlotsNeeded = (rowSize - ((tierSkills.length + 1) % rowSize)) % rowSize;
            
            return (
              <div key={tier} className="mb-4">
                {/* Título do Tier */}
                <div className="flex items-center gap-2 mb-2 border-b border-[#1e1e3a] pb-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tier}</h3>
                  <span className="text-[10px] text-slate-600">({tierSkills.length})</span>
                </div>
                
                {/* Grid de Ícones */}
                <div className="flex flex-wrap gap-1.5">
                  {tierSkills.map(skill => {
                    const isLocked = lockedSkill && lockedSkill.id === skill.id;
                    const isHovered = hoveredSkill && hoveredSkill.id === skill.id && !isLocked;
                    
                    return (
                      <button
                        key={skill.id}
                        onMouseEnter={() => handleMouseEnter(skill)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(skill)}
                        className={`
                          relative w-11 h-11 bg-[#151525] flex items-center justify-center rounded transition-all duration-100
                          border-2 
                          ${isLocked ? 'border-yellow-400 scale-110 z-10 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : skill.color}
                          ${isHovered ? 'border-white brightness-125 z-10' : ''}
                          hover:brightness-125
                        `}
                      >
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                        <span className="relative z-10 text-slate-300 drop-shadow-md">
                          {getIconComponent(skill.iconType)}
                        </span>
                        {isLocked && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full -mt-1 -mr-1 shadow-md"></div>
                        )}
                      </button>
                    );
                  })}
                  
                  {/* Botão de Adicionar (O [+]) */}
                  <button 
                    onClick={() => addNewSkill(tier)}
                    title={`Adicionar skill em ${tier}`}
                    className="w-11 h-11 border-2 border-dashed border-[#2a2a4a] bg-[#0a0a1a] flex items-center justify-center text-[#4a4a6a] rounded hover:border-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <Plus size={18} />
                  </button>

                  {/* Espaços Vazios para manter o grid alinhado (Estético Digimon/RPG) */}
                  {Array.from({ length: emptySlotsNeeded }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-11 h-11 border border-[#10101a] bg-[#05050a] rounded opacity-50"></div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="h-20 text-center text-[#2a2a4a] text-xs pt-4 font-mono">- Fim do Grimório -</div>
        </div>

        {/* DIREITA: Painel de Leitura e Edição */}
        <div className="w-[45%] bg-[#050510] relative flex flex-col">
          
          {/* MODO LEITURA */}
          {displaySkill && !isEditing ? (
            <div className="relative z-10 flex flex-col h-full animate-in fade-in duration-200">
              
              {/* Header da Skill */}
              <div className="p-5 pb-3 border-b border-[#1a1a3a] bg-[#0a0a1a] shrink-0">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-wide leading-tight">{displaySkill.name}</h2>
                  
                  {/* Controles: Se a skill estiver travada, mostra o botão de editar e fechar */}
                  {lockedSkill?.id === displaySkill.id && (
                    <div className="flex gap-2 shrink-0 ml-4">
                      <button onClick={startEditing} className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-600 transition-colors">
                        <Edit2 size={12} /> Editar
                      </button>
                      <button onClick={() => setLockedSkill(null)} className="flex items-center justify-center w-7 h-7 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded border border-red-900/50 transition-colors" title="Destravar">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="bg-[#151525] px-2 py-1 rounded border border-[#2a2a4a] text-blue-300">
                    {displaySkill.action}
                  </span>
                  <span className="bg-[#151525] px-2 py-1 rounded border border-[#2a2a4a] text-purple-300">
                    {displaySkill.type}
                  </span>
                  {lockedSkill?.id === displaySkill.id && (
                    <span className="text-yellow-500 font-bold ml-auto animate-pulse flex items-center gap-1">
                      <Eye size={12} /> TRAVADO
                    </span>
                  )}
                </div>
              </div>

              {/* Corpo do Texto Gigante */}
              <div className="flex-1 overflow-y-auto p-5 text-slate-300 text-base leading-relaxed custom-scrollbar whitespace-pre-wrap font-serif">
                {displaySkill.description}
                <div className="h-10"></div>
              </div>
            </div>
          ) : isEditing && editForm ? (
            
            /* MODO DE EDIÇÃO DA FICHA */
            <div className="relative z-10 flex flex-col h-full bg-[#0a0a1a]">
              <div className="p-4 border-b border-[#2a2a4a] flex justify-between items-center bg-[#10102a]">
                <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2"><Edit2 size={18} /> Editando Magia</h2>
                <div className="flex gap-2">
                  <button onClick={cancelEditing} className="px-3 py-1 bg-slate-800 text-sm text-slate-300 rounded hover:bg-slate-700">Cancelar</button>
                  <button onClick={saveSkill} className="px-3 py-1 bg-blue-600 text-sm text-white rounded hover:bg-blue-500 flex items-center gap-1"><Save size={14}/> Salvar</button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Nome da Habilidade</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Custo / Ação</label>
                    <input 
                      type="text" 
                      value={editForm.action} 
                      onChange={e => setEditForm({...editForm, action: e.target.value})}
                      className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Tipo (Ex: Fogo, Ilusão)</label>
                    <input 
                      type="text" 
                      value={editForm.type} 
                      onChange={e => setEditForm({...editForm, type: e.target.value})}
                      className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Cor da Borda</label>
                  <select 
                    value={editForm.color} 
                    onChange={e => setEditForm({...editForm, color: e.target.value})}
                    className="w-full bg-[#151525] border border-[#2a2a4a] rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="border-slate-500">Cinza (Padrão)</option>
                    <option value="border-red-600">Vermelho (Fogo/Dano)</option>
                    <option value="border-blue-500">Azul (Mágico/Gelo)</option>
                    <option value="border-green-600">Verde (Vento/Cura)</option>
                    <option value="border-purple-500">Roxo (Sombrio/Ilusão)</option>
                    <option value="border-yellow-500">Amarelo (Elétrico/Luz)</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Descrição (Pode usar muitas quebras de linha)</label>
                  <textarea 
                    value={editForm.description} 
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full flex-1 min-h-[300px] bg-[#151525] border border-[#2a2a4a] rounded p-3 text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
                  ></textarea>
                </div>
              </div>
            </div>
          ) : (
            /* ESTADO VAZIO */
            <div className="flex-1 flex flex-col items-center justify-center text-[#2a2a4a] relative z-10 p-10 text-center">
              <Book size={64} className="mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Grimório de Robert Jones</h3>
              <p>Passe o mouse na grade à esquerda para espiar o texto.</p>
              <p className="mt-2 text-sm">Clique em um quadrado para <strong className="text-yellow-600">Travar a Leitura</strong> ou <strong className="text-blue-600">Editar</strong> a habilidade.</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #070714; 
          border-left: 1px solid #1a1a3a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a4a; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a8a; 
        }
      `}} />
    </div>
  );
}
```

### 📄 Arquivo: `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>meu-rpg-vtt</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

### 📄 Arquivo: `MapaDoProjetoIA.md`
```md
Excelente ideia. Deixar o roteiro documentado agora tira isso da sua cabeça e te deixa dormir tranquilo. Se um dia vocês decidirem desenterrar a ideia, o mapa do tesouro já está pronto.

Aqui está um rascunho de arquitetura estruturado em Fases, focado em construir o Mínimo Produto Viável (MVP) primeiro e ir escalando.

Fase 1: Fundação e Banco de Dados (O Alicerce)
Antes de desenhar qualquer tela, a base precisa existir.

Setup do Firebase: Criar o projeto e habilitar Authentication, Firestore (fichas/chat), Realtime Database (mapa) e Storage.

Autenticação Simples: Fazer o login via Google. É o mais rápido e evita gerenciar senhas.

Estrutura de Dados: Definir as coleções no Firestore. Exemplo: Campanhas -> Sessões -> Fichas / Logs de Chat.

Fase 2: O Motor das Fichas (React + CRUD)
Aqui é onde entra aquele código que testamos hoje.

Integração do Protótipo: Pegar a interface da ficha (Tiers, painel de leitura gigante, status) e ligar no Firebase.

Sincronização em Tempo Real: Fazer com que, se você tomar 50 de dano e editar o HP na sua tela, o Mestre veja o número caindo na tela dele instantaneamente via Firestore onSnapshot.

CRUD Completo: Garantir que criar, ler, atualizar e deletar magias (como o "Solo de Sitri" ou "Manto Arcano") esteja funcionando liso com o banco de dados.

Fase 3: O Tabuleiro (VTT Core)
A parte mais complexa. Recomendo usar uma biblioteca gráfica voltada para React, como React Konva ou PixiJS, pois manipular Canvas puro para arrastar tokens dá muita dor de cabeça.

Renderização do Grid: Desenhar o tabuleiro (quadriculado ou hexagonal) com funções de Zoom e Pan (arrastar a câmera).

Sistema de Camadas: Separar o Mapa (fundo) dos Tokens (personagens/monstros).

Movimentação Sincronizada: Fazer o drag-and-drop dos tokens. Ao soltar o mouse, o React envia as novas coordenadas (X, Y) para o Firebase Realtime Database, e a tela de todos os outros jogadores atualiza na mesma hora.

Fase 4: O Gerenciador de Imagens (Upload Híbrido)
A solução que discutimos para manter tudo no plano gratuito.

Lógica de Compressão: Instalar o browser-image-compression para rodar no frontend.

Input Duplo: Criar o modal onde o Mestre pode jogar o link direto de uma imagem externa ou fazer o upload comprimido pro Storage.

Aplicação no VTT: Ligar essas URLs ao fundo do Canvas (mapa) e aos círculos dos Tokens.

Fase 5: O Social e as Regras (Chat & Dados)
Rolador de Dados: Programar a lógica de RNG (Random Number Generator) para jogar os d12, d20 e d50 do sistema de vocês.

Log de Combate: Um chat lateral simples que registra quem rolou o quê, os resultados e comandos do Mestre.

Fase 6: Polimento e "Game Feel"
A cereja do bolo, para ser feita só quando tudo acima estiver rodando bem.

Régua de Distância: Uma ferramenta para medir os fts no grid.

Tracker de Iniciativa: Uma listinha lateral ordenando os turnos.

Efeitos Visuais/Sonoros: Tocar um som de dado rolando ou fazer a tela tremer num acerto crítico.
```

### 📄 Arquivo: `package.json`
```json
{
  "name": "meu-rpg-vtt",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "bundle": "node bundle-ai.js"
  },
  "dependencies": {
    "emoji-picker-react": "^4.19.1",
    "lucide-react": "^1.25.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/postcss": "^4.3.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "autoprefixer": "^10.5.4",
    "eslint": "^10.6.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "postcss": "^8.5.21",
    "tailwindcss": "^4.3.3",
    "vite": "^8.1.1"
  }
}

```

### 📄 Arquivo: `postcss.config.js`
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 📄 Arquivo: `README.md`
```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

### 📄 Arquivo: `src\App.css`
```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

```

### 📄 Arquivo: `src\App.jsx`
```jsx
import { useState, useEffect } from 'react';
import AttributesHeader from './components/AttributesHeader';
import TiersGrid from './components/TiersGrid';
import RightPanel from './components/RightPanel';

const INITIAL_SKILLS = [
  { id: 's1', tier: 'Tier 1', name: 'Capeta Indigno (Imp)', icon: '💀', action: 'Bônus Action', type: 'Conjuração', color: 'border-red-600', description: 'Selado no meu isqueiro, nunca tenho que trocar o óleo.\n\nLvl 1 - Vira hunters mark.' },
  { id: 's2', tier: 'Tier 1', name: 'Sorte do Diabo lvl 3', icon: '✨', action: 'Bônus Action', type: 'Adivinhação', color: 'border-purple-500', description: 'Me permite trapacear em jogos de azar...' },
  { id: 's3', tier: 'Passivas', name: 'Sobretudo de Naida', icon: '🧥', action: 'Passivo', type: 'Defesa', color: 'border-slate-500', description: 'Naida é um Fey que perdeu uma aposta. Funciona como uma mage armor.' },
];
const INITIAL_TIERS = ['Passivas', 'Especiais', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6', 'Tier 7', 'Tier 8'];
const INITIAL_ATTRIBUTES = [
  { id: 'level', label: 'Lvl', value: '515' },
  { id: 'insanity', label: 'Insanidade', value: '63' },
  { id: 'for', label: 'FOR', value: '40(20)' },
  { id: 'dex', label: 'DEX', value: '101(50)' },
  { id: 'res', label: 'RES', value: '100(50)' },
  { id: 'agi', label: 'AGI', value: '34(17)' },
  { id: 'int', label: 'INT', value: '140(70)' },
  { id: 'cha', label: 'CHA', value: '100(50)' }
];
const INITIAL_RESOURCES = [
  { id: 'hp', label: 'HP', type: 'number', value: '1545', max: '1545', color: 'bg-red-500' },
  { id: 'manto', label: 'Manto Arcano', type: 'number', value: '2575', max: '2575', color: 'bg-blue-500' },
  { id: 'effort_d12', label: 'Effort d12', type: 'boxes', value: 4, max: 8, color: 'bg-purple-600' }
];

// O "Tesouro" das 20 Paletas de Cores!
const THEMES = [
  { id: 'default', name: 'Trevas', bg: '#121224', panel: '#1a1a30', border: '#3d3d63' },
  { id: 'blood', name: 'Sangue Demoníaco', bg: '#1f0a0a', panel: '#2e1212', border: '#6b2929' },
  { id: 'necro', name: 'Necromante', bg: '#1b0b24', panel: '#281333', border: '#5a2e73' },
  { id: 'arcane', name: 'Arcano', bg: '#0b1a21', panel: '#142933', border: '#2e5b6e' },
  { id: 'noir', name: 'Noir', bg: '#171717', panel: '#242424', border: '#404040' },
  { id: 'cyberpunk', name: 'Neon Cyber', bg: '#0f172a', panel: '#1e293b', border: '#f43f5e' },
  { id: 'emerald', name: 'Clã Esmeralda', bg: '#064e3b', panel: '#065f46', border: '#10b981' },
  { id: 'amber', name: 'Deserto de Âmbar', bg: '#451a03', panel: '#78350f', border: '#f59e0b' },
  { id: 'ocean', name: 'Abismo Oceânico', bg: '#082f49', panel: '#0c4a6e', border: '#0ea5e9' },
  { id: 'toxic', name: 'Pântano Tóxico', bg: '#14532d', panel: '#166534', border: '#84cc16' },
  { id: 'gold', name: 'Reino Dourado', bg: '#422006', panel: '#713f12', border: '#eab308' },
  { id: 'frost', name: 'Gelo Eterno', bg: '#083344', panel: '#164e63', border: '#06b6d4' },
  { id: 'crimson', name: 'Carmim Real', bg: '#4c0519', panel: '#881337', border: '#e11d48' },
  { id: 'royal', name: 'Realeza', bg: '#2e1065', panel: '#4c1d95', border: '#8b5cf6' },
  { id: 'hollow', name: 'Vazio Absoluto', bg: '#000000', panel: '#0a0a0a', border: '#262626' },
  { id: 'earth', name: 'Terra Ancestral', bg: '#291c14', panel: '#4a3325', border: '#8b5a2b' },
  { id: 'twilight', name: 'Crepúsculo', bg: '#1e1b4b', panel: '#312e81', border: '#6366f1' },
  { id: 'ash', name: 'Cinzas de Guerra', bg: '#27272a', panel: '#3f3f46', border: '#a1a1aa' },
  { id: 'solar', name: 'Chama Solar', bg: '#7f1d1d', panel: '#991b1b', border: '#f97316' },
  { id: 'abyssal', name: 'Corrupção', bg: '#111827', panel: '#1f2937', border: '#14b8a6' }
];

export default function App() {
  const [sheetData, setSheetData] = useState(() => {
    try {
      const saved = window.localStorage.getItem('rpg_sheet_master_v5');
      if (saved) return JSON.parse(saved);
    } catch {
      console.log("Criando nova ficha.");
    }
    return {
      characterName: 'Robert (Summer) Jones',
      attributes: INITIAL_ATTRIBUTES,
      resources: INITIAL_RESOURCES,
      tiers: INITIAL_TIERS,
      skills: INITIAL_SKILLS,
      activeThemeId: 'default'
    };
  });

  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSheetUnlocked, setIsSheetUnlocked] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [pinnedSkill, setPinnedSkill] = useState(null);
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const updateSheetData = (newData) => {
    setHistoryStack(prev => [...prev, sheetData].slice(-40));
    setRedoStack([]);
    setSheetData(newData);
  };

  const undo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack(prev => [...prev, sheetData]);
    setSheetData(previous);
    setHistoryStack(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(prev => [...prev, sheetData]);
    setSheetData(next);
    setRedoStack(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    window.localStorage.setItem('rpg_sheet_master_v5', JSON.stringify(sheetData));
  }, [sheetData]);

  const activeTheme = THEMES.find(t => t.id === sheetData.activeThemeId) || THEMES[0];
  const displaySkill = pinnedSkill || hoveredSkill;

  // Lógica aprimorada: Agora ela "derruba" as Configurações se você clicar em uma magia!
  const togglePin = (skill) => {
    if (isEditingSkill) return;

    // Se a aba de configuração estiver aberta, o clique na skill muda a aba instantaneamente
    if (showConfig) {
      setShowConfig(false);
      setPinnedSkill(skill);
      setHoveredSkill(null);
      return;
    }

    if (pinnedSkill?.id === skill.id) setPinnedSkill(null);
    else { setPinnedSkill(skill); setHoveredSkill(null); }
  };

  const startEditingSkill = () => {
    setEditForm({ ...displaySkill });
    setIsEditingSkill(true);
  };

  const saveSkill = () => {
    let updatedSkills = [...sheetData.skills];
    if (editForm.isNew) {
      const newSkill = { ...editForm };
      delete newSkill.isNew;
      updatedSkills.push(newSkill);
      setPinnedSkill(newSkill);
    } else {
      updatedSkills = updatedSkills.map(s => s.id === editForm.id ? editForm : s);
      setPinnedSkill(editForm);
    }
    updateSheetData({ ...sheetData, skills: updatedSkills });
    setIsEditingSkill(false);
  };

  const createSkill = (tierName) => {
    const newSkill = {
      id: `skill_${Date.now()}`,
      isNew: true,
      tier: tierName,
      name: 'Nova Habilidade',
      icon: '✨',
      action: 'Ação / Bônus',
      type: 'Magia',
      color: 'border-slate-500',
      description: 'Escreva a descrição...'
    };
    setPinnedSkill(newSkill);
    setEditForm(newSkill);
    setIsEditingSkill(true);
    setShowConfig(false); // Já fecha config por padrão
  };

  const deleteSkill = (id) => {
    if (window.confirm("Deletar habilidade?")) {
      const updatedSkills = sheetData.skills.filter(s => s.id !== id);
      updateSheetData({ ...sheetData, skills: updatedSkills });
      if (pinnedSkill?.id === id) setPinnedSkill(null);
      if (hoveredSkill?.id === id) setHoveredSkill(null);
      setIsEditingSkill(false);
    }
  };

  const clearAll = () => {
    if (window.confirm("Zerar ficha inteira?")) {
      updateSheetData({
        characterName: 'Novo Personagem',
        attributes: [{ id: 'for', label: 'FOR', value: '10' }],
        resources: [{ id: 'hp', label: 'HP', type: 'number', value: '100', max: '100', color: 'bg-red-500' }],
        tiers: ['Geral'],
        skills: [],
        activeThemeId: 'default'
      });
      setPinnedSkill(null);
      setIsEditingSkill(false);
    }
  };

  return (
    <div className="flex flex-col h-screen text-slate-300 font-sans overflow-hidden select-none" style={{ backgroundColor: activeTheme.bg }}>
      <AttributesHeader 
        sheetData={sheetData} updateSheetData={updateSheetData}
        isSheetUnlocked={isSheetUnlocked} setIsSheetUnlocked={setIsSheetUnlocked}
        showConfig={showConfig} setShowConfig={setShowConfig}
        historyStack={historyStack} redoStack={redoStack}
        undo={undo} redo={redo} activeTheme={activeTheme}
      />
      <div className="flex flex-1 overflow-hidden">
        <TiersGrid 
          sheetData={sheetData} updateSheetData={updateSheetData}
          isSheetUnlocked={isSheetUnlocked} activeTheme={activeTheme}
          pinnedSkill={pinnedSkill} hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill} togglePin={togglePin}
          createSkill={createSkill}
        />
        <RightPanel 
          showConfig={showConfig} isEditingSkill={isEditingSkill}
          setIsEditingSkill={setIsEditingSkill} editForm={editForm}
          setEditForm={setEditForm} displaySkill={displaySkill}
          pinnedSkill={pinnedSkill} isSheetUnlocked={isSheetUnlocked}
          activeTheme={activeTheme} THEMES={THEMES}
          sheetData={sheetData} updateSheetData={updateSheetData}
          startEditingSkill={startEditingSkill} saveSkill={saveSkill}
          deleteSkill={deleteSkill} clearAll={clearAll}
        />
      </div>
    </div>
  );
}
```

### 📄 Arquivo: `src\components\AttributesHeader.jsx`
```jsx
import { Settings, Lock, Unlock, Plus, X, Undo, Redo } from 'lucide-react';

export default function AttributesHeader({
  sheetData,
  updateSheetData,
  isSheetUnlocked,
  setIsSheetUnlocked,
  showConfig,
  setShowConfig,
  historyStack,
  redoStack,
  undo,
  redo,
  activeTheme
}) {
  const updateAttribute = (id, field, value) => {
    const updated = sheetData.attributes.map(a => a.id === id ? { ...a, [field]: value } : a);
    updateSheetData({ ...sheetData, attributes: updated });
  };

  const deleteAttribute = (id) => {
    const updated = sheetData.attributes.filter(a => a.id !== id);
    updateSheetData({ ...sheetData, attributes: updated });
  };

  const addAttribute = () => {
    const updated = [...sheetData.attributes, { id: `attr_${Date.now()}`, label: 'NOVO', value: '10' }];
    updateSheetData({ ...sheetData, attributes: updated });
  };

  const updateResource = (id, field, value) => {
    const updated = sheetData.resources.map(r => r.id === id ? { ...r, [field]: value } : r);
    updateSheetData({ ...sheetData, resources: updated });
  };

  const deleteResource = (id) => {
    const updated = sheetData.resources.filter(r => r.id !== id);
    updateSheetData({ ...sheetData, resources: updated });
  };

  const addResource = () => {
    const updated = [...sheetData.resources, { id: `res_${Date.now()}`, label: 'Novo Recurso', type: 'number', value: '0', max: '5', color: 'bg-green-500' }];
    updateSheetData({ ...sheetData, resources: updated });
  };

  const toggleResourceBox = (resId, boxIdx) => {
    if (isSheetUnlocked) return;
    const updated = sheetData.resources.map(r => {
      if (r.id === resId && r.type === 'boxes') {
        const currentVal = Number(r.value);
        const newVal = (boxIdx + 1 === currentVal) ? boxIdx : boxIdx + 1;
        return { ...r, value: newVal };
      }
      return r;
    });
    updateSheetData({ ...sheetData, resources: updated });
  };

  return (
    <header className="p-3 shrink-0 flex flex-col gap-2 border-b shadow-lg z-20" style={{ backgroundColor: activeTheme.panel, borderColor: activeTheme.border }}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs font-mono font-bold uppercase">Nome:</span>
          {isSheetUnlocked ? (
            <input 
              className="bg-black/40 border border-slate-700 rounded px-2 py-0.5 text-white font-bold text-lg focus:border-blue-500 outline-none"
              value={sheetData.characterName} 
              onChange={(e) => updateSheetData({ ...sheetData, characterName: e.target.value })}
            />
          ) : (
            <h1 className="text-xl font-bold text-white tracking-wider">{sheetData.characterName}</h1>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isSheetUnlocked && (
            <div className="flex bg-black/30 rounded border p-0.5 transition-all" style={{ borderColor: activeTheme.border }}>
              <button onClick={undo} disabled={historyStack.length === 0} className={`p-1 rounded ${historyStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`} title="Desfazer (Ctrl+Z)"><Undo size={14}/></button>
              <button onClick={redo} disabled={redoStack.length === 0} className={`p-1 rounded ${redoStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`} title="Refazer (Ctrl+Y)"><Redo size={14}/></button>
            </div>
          )}

          {isSheetUnlocked && (
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className="p-1.5 rounded border transition-all shadow-sm"
              style={{
                /* O botão agora é um camaleão, fundindo-se perfeitamente com a paleta atual */
                backgroundColor: showConfig ? activeTheme.border : 'transparent',
                borderColor: activeTheme.border,
                color: showConfig ? '#ffffff' : '#94a3b8'
              }}
              title="Configurações da Ficha"
            >
              <Settings size={16} />
            </button>
          )}

          <button 
            onClick={() => {
              const novoEstado = !isSheetUnlocked;
              setIsSheetUnlocked(novoEstado);
              if (!novoEstado) setShowConfig(false);
            }} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all w-36 justify-center ${isSheetUnlocked ? 'bg-red-950/40 border-red-500/80 text-red-300' : 'bg-slate-800/80 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
          >
            {isSheetUnlocked ? <Lock size={14} className="animate-pulse" /> : <Unlock size={14} />}
            {isSheetUnlocked ? "TRAVAR FICHA" : "DESTRAVAR FICHA"}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col gap-2 bg-black/30 p-2.5 rounded border border-white/5 shadow-inner mt-1">
        <span className="absolute -top-2 left-2 bg-[#05050f] px-1 text-[9px] text-slate-500 font-bold tracking-widest uppercase" style={{ backgroundColor: activeTheme.bg }}>Atributos</span>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {sheetData.attributes.map(attr => (
            <div key={attr.id} className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/5">
              {isSheetUnlocked ? (
                <>
                  <button onClick={() => deleteAttribute(attr.id)} className="text-red-500 hover:text-red-300 p-0.5"><X size={11}/></button>
                  <input className="w-10 bg-transparent text-slate-400 text-center text-xs font-bold uppercase border-b border-transparent focus:border-blue-500 outline-none" value={attr.label} onChange={(e) => updateAttribute(attr.id, 'label', e.target.value)} />
                  <input className="w-16 bg-black/60 border border-slate-700 rounded px-1 text-white text-center font-bold focus:border-blue-500 outline-none" value={attr.value} onChange={(e) => updateAttribute(attr.id, 'value', e.target.value)} />
                </>
              ) : (
                <><span className="text-slate-400 text-xs font-bold uppercase">{attr.label}</span> <strong className="text-white font-mono text-sm">{attr.value}</strong></>
              )}
            </div>
          ))}
          {isSheetUnlocked && (
            <button onClick={addAttribute} className="text-green-400 text-xs flex items-center gap-1 bg-green-950/30 px-2 py-1 rounded border border-green-500/30 hover:bg-green-900/20"><Plus size={11}/> Attr</button>
          )}
        </div>

        <div className="w-full h-px bg-white/5 my-1"></div>

        <div className="flex flex-wrap items-center gap-3">
          {sheetData.resources.map(res => (
            <div key={res.id} className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/5">
              {isSheetUnlocked ? (
                <>
                  <button onClick={() => deleteResource(res.id)} className="text-red-500 hover:text-red-300 p-0.5"><X size={11}/></button>
                  <select 
                    value={res.type} 
                    onChange={e => updateResource(res.id, 'type', e.target.value)} 
                    className="bg-slate-900 text-xs border border-slate-700 rounded p-0.5 text-slate-300 outline-none"
                  >
                    <option value="number">Nº</option>
                    <option value="boxes">Caixas</option>
                  </select>
                  <input className="w-20 bg-transparent text-slate-400 border-b border-transparent focus:border-blue-500 text-xs font-bold outline-none" value={res.label} onChange={(e) => updateResource(res.id, 'label', e.target.value)} />
                  
                  {res.type === 'number' ? (
                    <div className="flex items-center gap-1">
                      <input className="w-14 bg-black/60 border border-slate-700 rounded px-1 text-white text-center font-mono focus:border-blue-500 outline-none text-xs" value={res.value} onChange={(e) => updateResource(res.id, 'value', e.target.value)} />
                      <span className="text-slate-600 text-xs">/</span>
                      <input className="w-14 bg-black/60 border border-slate-700 rounded px-1 text-slate-400 text-center font-mono focus:border-blue-500 outline-none text-xs" placeholder="Max" value={res.max || ''} onChange={(e) => updateResource(res.id, 'max', e.target.value)} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>Max:</span>
                      <input type="number" min="1" max="24" className="w-10 bg-black/60 border border-slate-700 rounded px-1 text-white text-center" value={res.max || '5'} onChange={(e) => updateResource(res.id, 'max', e.target.value)} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={`w-2.5 h-2.5 rounded-full ${res.color} shadow-sm`}></div>
                  <span className="text-slate-400 text-xs font-bold uppercase">{res.label}:</span>
                  {res.type === 'number' ? (
                    <span className="font-mono text-sm"><strong className="text-white">{res.value}</strong>{res.max ? <span className="text-slate-500 text-xs">/{res.max}</span> : ''}</span>
                  ) : (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {Array.from({ length: Number(res.max) || 5 }).map((_, bIdx) => (
                        <button 
                          key={bIdx} 
                          onClick={() => toggleResourceBox(res.id, bIdx)}
                          className={`w-4 h-4 rounded-sm border transition-all duration-100 ${bIdx < Number(res.value) ? `${res.color} border-transparent shadow-[0_0_5px_rgba(255,255,255,0.15)]` : 'bg-black/60 border-slate-700'}`}
                        ></button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          {isSheetUnlocked && (
            <button onClick={addResource} className="text-green-400 text-xs flex items-center gap-1 bg-green-950/30 px-2 py-1 rounded border border-green-500/30 hover:bg-green-900/20"><Plus size={11}/> Recurso</button>
          )}
        </div>
      </div>
    </header>
  );
}
```

### 📄 Arquivo: `src\components\RightPanel.jsx`
```jsx
import { useState, useRef } from 'react';
import { 
  Settings, Edit2, Pin, Trash2, ChevronDown, ChevronUp, 
  Download, Upload, AlertTriangle, Image
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react'; // <-- IMPORTAMOS O BANCO DE EMOJIS AQUI

export default function RightPanel({
  showConfig, isEditingSkill, setIsEditingSkill, editForm, setEditForm,
  displaySkill, pinnedSkill, isSheetUnlocked, activeTheme, THEMES,
  sheetData, updateSheetData, startEditingSkill, saveSkill, deleteSkill, clearAll
}) {
  const [configSection, setConfigSection] = useState('themes');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(sheetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ficha_${sheetData.characterName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.characterName && parsed.skills) updateSheetData(parsed);
      } catch {
        alert("Erro no arquivo.");
      }
    };
    reader.readAsText(file);
  };

  // Função corrigida para ler imagem como Base64 (URL)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditForm({ ...editForm, icon: event.target.result });
      setShowEmojiPicker(false);
    };
    reader.readAsDataURL(file); 
  };

  const handleDoubleClickTheme = (themeId) => {
    updateSheetData({ ...sheetData, activeThemeId: themeId });
    setToastMessage('🎨 Tema Padrão Atualizado!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const isCustomImage = displaySkill?.icon && displaySkill.icon.startsWith('data:image');
  const isEditingCustomImage = editForm?.icon && editForm.icon.startsWith('data:image');

  return (
    <div className="w-[45%] relative flex flex-col shadow-2xl transition-colors duration-200 h-full overflow-hidden" style={{ backgroundColor: activeTheme.panel }}>
      
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white px-4 py-2 rounded shadow-lg text-sm font-bold z-50 border border-blue-400">
          {toastMessage}
        </div>
      )}

      {showConfig ? (
        <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2 border-b border-white/10 pb-4 shrink-0"><Settings size={24}/> Configurações</h2>
          
          <div className="border rounded-lg mb-4 shrink-0" style={{ borderColor: activeTheme.border }}>
            <button onClick={() => setConfigSection(configSection === 'themes' ? '' : 'themes')} className="w-full p-4 flex justify-between items-center bg-black/30 font-bold rounded-t-lg">
              <span>🎨 Paletas de Cores</span>
            </button>
            {configSection === 'themes' && (
              <div className="p-4 grid grid-cols-2 gap-2 bg-black/20 rounded-b-lg">
                <p className="col-span-2 text-xs text-slate-400 mb-2 font-mono text-center">Dê <strong className="text-white">duplo clique</strong> para definir o padrão.</p>
                {THEMES.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => updateSheetData({ ...sheetData, activeThemeId: t.id })}
                    onDoubleClick={() => handleDoubleClickTheme(t.id)}
                    className={`p-2.5 rounded border text-left flex items-center justify-between transition-all ${sheetData.activeThemeId === t.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-700'}`} 
                    style={{ backgroundColor: t.panel }}
                  >
                    <span className="font-bold text-xs text-white">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-lg mb-4 shrink-0" style={{ borderColor: activeTheme.border }}>
            <button onClick={() => setConfigSection(configSection === 'backup' ? '' : 'backup')} className="w-full p-4 flex justify-between items-center bg-black/30 font-bold rounded-t-lg">
              <span>💾 Backup & Importação</span>
            </button>
            {configSection === 'backup' && (
              <div className="p-4 flex flex-col gap-3 bg-black/20 text-xs rounded-b-lg">
                <button onClick={exportJSON} className="w-full bg-blue-900/30 border border-blue-500/50 text-blue-300 p-3 rounded font-bold flex items-center justify-center gap-2">Exportar JSON</button>
                <label className="w-full bg-green-900/30 border border-green-500/50 text-green-300 p-3 rounded font-bold flex items-center justify-center gap-2 cursor-pointer text-center">
                  Importar JSON
                  <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={importJSON} />
                </label>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-red-900/30 shrink-0">
            <button onClick={clearAll} className="w-full bg-red-950/50 hover:bg-red-900 border border-red-800 text-red-400 p-3 rounded flex items-center justify-center gap-2 font-bold">
              <AlertTriangle size={18} /> CLEAR ALL (Zerar Ficha)
            </button>
          </div>
        </div>
      ) : isEditingSkill && editForm ? (
        <div className="flex flex-col h-full bg-black/10">
          <div className="p-4 border-b flex justify-between items-center bg-black/20 shrink-0" style={{ borderColor: activeTheme.border }}>
            <h2 className="text-md font-bold text-blue-400 flex items-center gap-2"><Edit2 size={16} /> Editando Skill</h2>
            <div className="flex gap-2">
              <button onClick={() => setIsEditingSkill(false)} className="px-3 py-1 bg-slate-800 text-xs rounded">Cancelar</button>
              <button onClick={saveSkill} className="px-3 py-1 bg-green-600 text-xs text-white font-bold rounded">Salvar</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Ícone</label>
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-14 h-14 bg-black/50 border rounded text-2xl flex items-center justify-center overflow-hidden hover:border-slate-500 transition-colors" style={{ borderColor: activeTheme.border }}>
                  {isEditingCustomImage ? <img src={editForm.icon} alt="" className="w-full h-full object-cover" /> : editForm.icon}
                </button>
                
                {/* O NOVO MENU DE EMOJIS COMPLETO */}
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 flex flex-col gap-2">
                    {/* Botão de Upload de Imagem continua existindo */}
                    <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl">
                      <label className="flex items-center justify-center gap-1.5 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/50 text-blue-300 text-[11px] p-2 rounded cursor-pointer font-bold transition-all">
                        <Image size={13}/> Subir Imagem Real Leve
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>

                    {/* Componente que traz o banco de dados inteiro do sistema */}
                    <div className="shadow-2xl">
                      <EmojiPicker 
                        theme="dark" 
                        emojiStyle="native"
                        searchPlaceHolder="Buscar magia..."
                        onEmojiClick={(emojiData) => {
                          setEditForm({ ...editForm, icon: emojiData.emoji });
                          setShowEmojiPicker(false);
                        }} 
                        style={{
                          /* Sincronizando as cores do EmojiPicker com o nosso activeTheme */
                          '--epr-bg-color': activeTheme.panel,
                          '--epr-category-label-bg-color': activeTheme.panel,
                          '--epr-picker-border-color': activeTheme.border,
                          '--epr-search-border-color': activeTheme.border,
                          '--epr-search-input-bg-color': activeTheme.bg,
                          '--epr-hover-bg-color': activeTheme.bg,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Nome da Habilidade</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white font-bold outline-none focus:border-blue-500 transition-colors" style={{ borderColor: activeTheme.border }} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Ação / Custo</label>
                <input type="text" value={editForm.action} onChange={e => setEditForm({ ...editForm, action: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white text-sm outline-none focus:border-blue-500 transition-colors" style={{ borderColor: activeTheme.border }} />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Tipo</label>
                <input type="text" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white text-sm outline-none focus:border-blue-500 transition-colors" style={{ borderColor: activeTheme.border }} />
              </div>
            </div>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Cor da Borda</label>
                <select value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="w-full bg-slate-900 border rounded p-2 text-white text-sm outline-none focus:border-blue-500 transition-colors" style={{ borderColor: activeTheme.border }}>
                  <option value="border-slate-500">Cinza</option>
                  <option value="border-red-600">Vermelho</option>
                  <option value="border-blue-500">Azul</option>
                  <option value="border-green-600">Verde</option>
                  <option value="border-purple-500">Roxo</option>
                  <option value="border-yellow-500">Amarelo</option>
                </select>
              </div>
              {!editForm.isNew && (
                <button onClick={() => deleteSkill(editForm.id)} className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded flex items-center gap-1.5 text-xs font-bold transition-colors">
                  <Trash2 size={14}/> EXCLUIR SKILL
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col mt-2 min-h-[250px]">
              <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Descrição da Magia</label>
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full flex-1 bg-black/40 border rounded p-3 text-sm text-slate-300 font-serif leading-relaxed resize-none custom-scrollbar outline-none focus:border-blue-500 transition-colors" style={{ borderColor: activeTheme.border }}></textarea>
            </div>
          </div>
        </div>
      ) : displaySkill ? (
        <div className="relative z-10 flex flex-col h-full animate-in fade-in duration-100">
          <div className="p-6 pb-4 border-b bg-black/20 shrink-0" style={{ borderColor: activeTheme.border }}>
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden">
                  {isCustomImage ? <img src={displaySkill.icon} alt="" className="w-full h-full object-cover rounded shadow-md" /> : displaySkill.icon || '✨'}
                </span> 
                {displaySkill.name}
              </h2>
              {pinnedSkill?.id === displaySkill.id && isSheetUnlocked && (
                <button onClick={startEditingSkill} className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 text-blue-300 font-bold text-xs rounded border border-blue-500/50">
                  <Edit2 size={12} /> Editar
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="bg-black/50 px-2.5 py-1 rounded border" style={{ borderColor: activeTheme.border }}>{displaySkill.action}</span>
              <span className="bg-black/50 px-2.5 py-1 rounded border" style={{ borderColor: activeTheme.border }}>{displaySkill.type}</span>
              
              {pinnedSkill?.id === displaySkill.id && (
                <div className="text-yellow-500 ml-auto flex items-center justify-center p-1 rounded-full bg-yellow-950/20 border border-yellow-500/40 shadow-sm animate-pulse" title="Magia Fixada no Painel">
                  <Pin size={12} className="rotate-45" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-md leading-relaxed custom-scrollbar whitespace-pre-wrap font-serif">
            {displaySkill.description}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-10 text-center select-none bg-gradient-to-b from-transparent to-black/10">
          <div className="text-5xl mb-4 opacity-20">📖</div>
          <h3 className="text-xl font-bold mb-2">Grimório Ativo</h3>
          <p className="text-sm">Passe o mouse sobre os ícones de magia na esquerda.</p>
        </div>
      )}
    </div>
  );
}
```

### 📄 Arquivo: `src\components\TiersGrid.jsx`
```jsx
import { useState } from 'react';
import { Plus, Trash2, ArrowDownAZ, GripVertical } from 'lucide-react';

export default function TiersGrid({
  sheetData,
  updateSheetData,
  isSheetUnlocked,
  activeTheme,
  pinnedSkill,
  hoveredSkill,
  setHoveredSkill,
  togglePin,
  createSkill
}) {
  const [sortedTiers, setSortedTiers] = useState([]);
  const [draggedTier, setDraggedTier] = useState(null);
  const [draggedSkill, setDraggedSkill] = useState(null);

  const toggleSortTier = (tierName) => {
    if (sortedTiers.includes(tierName)) {
      setSortedTiers(sortedTiers.filter(t => t !== tierName));
    } else {
      setSortedTiers([...sortedTiers, tierName]);
    }
  };

  const getTierSkills = (tierName) => {
    const tierSkills = sheetData.skills.filter(s => s.tier === tierName);
    if (sortedTiers.includes(tierName)) {
      return [...tierSkills].sort((a, b) => a.name.localeCompare(b.name));
    }
    return tierSkills;
  };

  const handleDragStartTier = (e, tierName) => {
    if (!isSheetUnlocked) { e.preventDefault(); return; }
    setDraggedTier(tierName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropTier = (e, targetTierName) => {
    e.preventDefault();
    if (!draggedTier || draggedTier === targetTierName) return;
    
    const newTiers = [...sheetData.tiers];
    const draggedIdx = newTiers.indexOf(draggedTier);
    const targetIdx = newTiers.indexOf(targetTierName);
    
    newTiers.splice(draggedIdx, 1);
    newTiers.splice(targetIdx, 0, draggedTier);
    
    updateSheetData({ ...sheetData, tiers: newTiers });
    setDraggedTier(null);
  };

  const handleDragStartSkill = (e, skill) => {
    if (!isSheetUnlocked) { e.preventDefault(); return; }
    setDraggedSkill(skill);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropSkill = (e, targetSkill) => {
    e.preventDefault();
    if (!draggedSkill || draggedSkill.id === targetSkill.id) return;

    const updatedSkills = [...sheetData.skills];
    const draggedIdx = updatedSkills.findIndex(s => s.id === draggedSkill.id);
    
    const [removed] = updatedSkills.splice(draggedIdx, 1);
    removed.tier = targetSkill.tier;

    const targetIdx = updatedSkills.findIndex(s => s.id === targetSkill.id);
    updatedSkills.splice(targetIdx, 0, removed);

    updateSheetData({ ...sheetData, skills: updatedSkills });
    setDraggedSkill(null);
  };

  const addTier = (name) => {
    const cleaned = name.trim();
    if (cleaned && !sheetData.tiers.includes(cleaned)) {
      updateSheetData({ ...sheetData, tiers: [...sheetData.tiers, cleaned] });
    }
  };

  const removeTier = (tierName) => {
    const hasSkills = sheetData.skills.some(s => s.tier === tierName);
    if (hasSkills) {
      alert("Remova as habilidades primeiro!");
      return;
    }
    const updated = sheetData.tiers.filter(t => t !== tierName);
    updateSheetData({ ...sheetData, tiers: updated });
  };

  return (
    <div className="w-[55%] flex flex-col overflow-y-auto custom-scrollbar p-4 border-r gap-3" style={{ borderColor: activeTheme.border }}>
      {sheetData.tiers.map(tier => {
        const tierSkills = getTierSkills(tier);
        const rowSize = 8;
        const emptySlotsNeeded = (rowSize - ((tierSkills.length + (isSheetUnlocked ? 1 : 0)) % rowSize)) % rowSize;
        const isSorted = sortedTiers.includes(tier);

        return (
          <div 
            key={tier} 
            className="p-2 rounded border border-white/5 bg-black/10 transition-colors"
            draggable={isSheetUnlocked && draggedSkill === null}
            onDragStart={(e) => handleDragStartTier(e, tier)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropTier(e, tier)}
          >
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1 select-none">
              {/* Espaço reservado fixo para evitar trepidação quando trava/destrava */}
              <div className="w-4 flex items-center justify-center shrink-0">
                {isSheetUnlocked && <GripVertical size={13} className="text-slate-600 cursor-grab active:cursor-grabbing" />}
              </div>
              
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tier}</span>
              <span className="text-[10px] text-slate-600 font-mono">({tierSkills.length})</span>
              
              {isSheetUnlocked && (
                <div className="ml-auto flex items-center gap-1">
                  <button 
                    onClick={() => toggleSortTier(tier)} 
                    className={`p-1 rounded transition-colors ${isSorted ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <ArrowDownAZ size={14}/>
                  </button>
                  <button 
                    onClick={() => removeTier(tier)}
                    disabled={tierSkills.length > 0}
                    className={`p-1 rounded ${tierSkills.length === 0 ? 'text-red-500 hover:bg-red-500/20' : 'text-slate-700 cursor-not-allowed'}`}
                  >
                    <Trash2 size={14}/>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[44px]">
              {tierSkills.map(skill => {
                const isPinned = pinnedSkill?.id === skill.id;
                const isHovered = hoveredSkill?.id === skill.id && !isPinned;
                const isCustomImage = skill.icon && skill.icon.startsWith('data:image');

                return (
                  <button
                    key={skill.id}
                    draggable={isSheetUnlocked}
                    onDragStart={(e) => handleDragStartSkill(e, skill)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropSkill(e, skill)}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => togglePin(skill)}
                    className={`
                      relative w-11 h-11 flex items-center justify-center rounded transition-all duration-100 border-2 overflow-hidden
                      ${isPinned ? 'border-yellow-400 scale-110 z-10 shadow-[0_0_10px_rgba(250,204,21,0.5)] bg-slate-900' : `${skill.color} bg-black/40`}
                      ${isHovered ? 'border-white brightness-125 z-10 bg-slate-900' : ''}
                    `}
                  >
                    {isCustomImage ? (
                      <img src={skill.icon} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="relative z-10 text-xl pointer-events-none">{skill.icon || '✨'}</span>
                    )}
                    {isPinned && <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full -mt-1 -mr-1 shadow-md"></div>}
                  </button>
                );
              })}

              {isSheetUnlocked && (
                <button 
                  onClick={() => createSkill(tier)}
                  className="w-11 h-11 border-2 border-dashed bg-black/20 text-slate-500 hover:text-slate-300 rounded flex items-center justify-center transition-all"
                  style={{ borderColor: activeTheme.border }}
                >
                  <Plus size={18} />
                </button>
              )}

              {Array.from({ length: emptySlotsNeeded }).map((_, i) => (
                <div key={`empty-${i}`} className="w-11 h-11 border bg-black/5 rounded opacity-20" style={{ borderColor: activeTheme.border }}></div>
              ))}
            </div>
          </div>
        );
      })}

      {isSheetUnlocked && (
        <div className="mt-2 p-3 bg-black/20 rounded border border-dashed border-slate-700 flex gap-2 items-center">
          <input 
            type="text" 
            placeholder="Ex: Armas de Sangue (Pressione Enter)..." 
            className="bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-sm flex-1 text-white focus:border-blue-500 outline-none" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTier(e.target.value);
                e.target.value = '';
              }
            }} 
          />
        </div>
      )}
    </div>
  );
}
```

### 📄 Arquivo: `src\index.css`
```css
@import "tailwindcss";

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
```

### 📄 Arquivo: `src\main.jsx`
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

### 📄 Arquivo: `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 📄 Arquivo: `TODO.md`
```md
gm poder visualizar todas as fichas. rolar dados?

copiar o sistema de calc do roll20?


configurações e mudar paleta de cores. (mais opcoes)

dentro dos atributos, pontos de status.

quando colcoar um valor nesse stat, nas configuraçoes ter a opçao: "mod 1 mod 2 mod 3 mod 4 (que significa o mesmo valor do stat dividido por 2, 3 , 4 ,5, pra achar esses modificadores, e tambem mod tal como a conta de dnd. ) o usuario pode clicar em quantas dessas ele quiser para aparecer visualmente


effort, novo recurso, hp manto arcano, a corzinha o usuario tem q escolher

gerador de modificadores nas config

configuraçao ainda nao da scroll direito (configuraçoes tem q ficar so no destravado)

uma barra so de skills favoritas (talvez poder olhar duas skills ao mesmo tempo)
---------
tirar as informaçoes do jones de dentro da ficha. 

tem uma mudança de tamanho meio chatinha quando trava e destrava. as linhas tambem mudam de lugar, perde uma smoothness. o botao de destravar tem q sempre ser o mais a direita mesmo quando destravar.

eu sinto que tem poucos emojis, nao tem um jeito de importar da web ao inves de por dentro do codigo todos? ? e ai ter tipo UMA CARALHADA

terceira img(ate agora nao sei pq tem esse fixado escrito ali)

eu lembro de ter conseguido que alem de emojis upar imgs no formato web e tal bem levinho nao sei pra onde foi isso. 

podemos adicionar mais temas tambem

barrinha a la sotn q deixa o usuario escolher o tema?

travar e destravar ficha cor estranha, bolinhas de hp e effort tbm. nao ta suficientemente modularizado
(icone de pin ali na skill)

Quer que a gente faça uma rodada de refatoração agora (quebrando o painel em arquivos menores como SkillForm.jsx, SkillView.jsx, etc., para limpar a arquitetura) ou prefere focar em terminar as funcionalidades principais da ficha primeiro e deixar a "faxina" para depois?


(uma feature q deixa o user ou o GM liberar a ficha para acesso e outros poderem fazer textos em relaçao aquela ficha)
```

### 📄 Arquivo: `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

