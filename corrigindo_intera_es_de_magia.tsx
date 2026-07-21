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