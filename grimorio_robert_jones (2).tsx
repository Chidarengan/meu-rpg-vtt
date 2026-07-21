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