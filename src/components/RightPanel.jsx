import React, { useState, useRef } from 'react';
import { 
  Settings, Edit2, Pin, Trash2, ChevronDown, ChevronUp, 
  Download, Upload, AlertTriangle, Palette 
} from 'lucide-react';

const EMOJI_CATEGORIES = [
  { label: 'Luta/Guerra', emojis: ['⚔️','🗡️','🛡️','🏹','🪓','🥊','⛓️','🩸','💥','💀','👹','👿'] },
  { label: 'Magia/Efeitos', emojis: ['🔮','🪄','📜','🌀','🌌','✨','🌟','🕯️','🧿','🌙','⏳','🎨'] },
  { label: 'Elementos', emojis: ['🔥','❄️','⚡','💧','🌪️','🪨','☀️','☁️','🌋','🌿','🍄','🍀'] },
  { label: 'Animais/Ecos', emojis: ['🦇','🕷️','🐍','🐉','🐺','🦁','🦅','🐈','🐙','🦠','🧪','👁️'] },
  { label: 'Utilitários', emojis: ['🎒','🗝️','⚙️','💎','🔔','🎭','🎲','👑','🗺️','🚬','🥃','🔥'] }
];

export default function RightPanel({
  showConfig,
  isEditingSkill,
  setIsEditingSkill,
  editForm,
  setEditForm,
  displaySkill,
  pinnedSkill,
  isSheetUnlocked,
  activeTheme,
  THEMES,
  sheetData,
  updateSheetData,
  startEditingSkill,
  saveSkill,
  deleteSkill,
  clearAll
}) {
  const [configSection, setConfigSection] = useState('themes');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
        if (parsed.characterName && parsed.skills) {
          updateSheetData(parsed);
          alert("Ficha importada com sucesso!");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-[45%] relative flex flex-col shadow-2xl transition-colors duration-200" style={{ backgroundColor: activeTheme.panel }}>
      {showConfig ? (
        <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2 border-b border-white/10 pb-4"><Settings size={24}/> Configurações</h2>
          
          <div className="border rounded-lg overflow-hidden mb-4" style={{ borderColor: activeTheme.border }}>
            <button onClick={() => setConfigSection(configSection === 'themes' ? '' : 'themes')} className="w-full p-4 flex justify-between items-center bg-black/30 font-bold">
              <span>🎨 Paletas de Cores ({THEMES.length} opções)</span>
              {configSection === 'themes' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {configSection === 'themes' && (
              <div className="p-4 grid grid-cols-2 gap-2 bg-black/20">
                {THEMES.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => updateSheetData({ ...sheetData, activeThemeId: t.id })}
                    className={`p-2.5 rounded border text-left flex items-center justify-between ${sheetData.activeThemeId === t.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-700'}`} 
                    style={{ backgroundColor: t.panel }}
                  >
                    <span className="font-bold text-xs text-white">{t.name}</span>
                    <div className="flex">
                      <div className="w-3.5 h-3.5 rounded-full mr-1" style={{ backgroundColor: t.bg }}></div>
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.border }}></div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-lg overflow-hidden mb-4" style={{ borderColor: activeTheme.border }}>
            <button onClick={() => setConfigSection(configSection === 'backup' ? '' : 'backup')} className="w-full p-4 flex justify-between items-center bg-black/30 font-bold">
              <span>💾 Backup & Importação</span>
              {configSection === 'backup' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {configSection === 'backup' && (
              <div className="p-4 flex flex-col gap-3 bg-black/20 text-xs">
                <button onClick={exportJSON} className="w-full bg-blue-900/30 border border-blue-500/50 text-blue-300 p-3 rounded font-bold flex items-center justify-center gap-2">
                  <Download size={16} /> Exportar Arquivo JSON
                </button>
                <label className="w-full bg-green-900/30 border border-green-500/50 text-green-300 p-3 rounded font-bold flex items-center justify-center gap-2 cursor-pointer text-center">
                  <Upload size={16} /> Importar Arquivo JSON
                  <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={importJSON} />
                </label>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-red-900/30">
            <button onClick={clearAll} className="w-full bg-red-950/50 hover:bg-red-900 border border-red-800 text-red-400 p-3 rounded flex items-center justify-center gap-2 font-bold">
              <AlertTriangle size={18} /> CLEAR ALL (Zerar Ficha)
            </button>
          </div>
        </div>
      ) : isEditingSkill && editForm ? (
        <div className="flex flex-col h-full bg-black/10">
          <div className="p-4 border-b flex justify-between items-center bg-black/20" style={{ borderColor: activeTheme.border }}>
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
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-14 h-14 bg-black/50 border rounded text-2xl flex items-center justify-center" style={{ borderColor: activeTheme.border }}>
                  {editForm.icon}
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 p-3 rounded shadow-2xl w-72 grid gap-3 z-50">
                    {EMOJI_CATEGORIES.map(cat => (
                      <div key={cat.label}>
                        <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">{cat.label}</div>
                        <div className="grid grid-cols-6 gap-1">
                          {cat.emojis.map(em => (
                            <button key={em} onClick={() => { setEditForm({ ...editForm, icon: em }); setShowEmojiPicker(false); }} className="text-xl hover:bg-slate-800 rounded p-1">{em}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Nome da Habilidade</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white font-bold outline-none" style={{ borderColor: activeTheme.border }} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Ação / Custo</label>
                <input type="text" value={editForm.action} onChange={e => setEditForm({ ...editForm, action: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white text-sm outline-none" style={{ borderColor: activeTheme.border }} />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Tipo</label>
                <input type="text" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full bg-black/40 border rounded p-2 text-white text-sm outline-none" style={{ borderColor: activeTheme.border }} />
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
                </select>
              </div>
              {!editForm.isNew && (
                <button onClick={() => deleteSkill(editForm.id)} className="px-3 py-2 bg-red-950/40 text-red-400 border border-red-900/50 rounded flex items-center gap-1.5 text-xs font-bold">
                  <Trash2 size={14}/> EXCLUIR SKILL
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col mt-2">
              <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Descrição da Magia</label>
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full flex-1 min-h-[250px] bg-black/40 border rounded p-3 text-sm text-slate-300 font-serif leading-relaxed resize-none custom-scrollbar outline-none" style={{ borderColor: activeTheme.border }}></textarea>
            </div>
          </div>
        </div>
      ) : displaySkill ? (
        <div className="relative z-10 flex flex-col h-full animate-in fade-in duration-100">
          <div className="p-6 pb-4 border-b bg-black/20 shrink-0" style={{ borderColor: activeTheme.border }}>
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{displaySkill.icon || '✨'}</span> 
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
              {pinnedSkill?.id === displaySkill.id && <span className="text-yellow-500 font-bold ml-auto flex items-center gap-1 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-500/50"><Pin size={12} /> FIXADO</span>}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-md leading-relaxed custom-scrollbar whitespace-pre-wrap font-serif">
            {displaySkill.description}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-10 text-center select-none">
          <div className="text-5xl mb-4 opacity-20">📖</div>
          <h3 className="text-xl font-bold mb-2">Grimório Ativo</h3>
          <p className="text-sm">Passe o mouse sobre os ícones de magia na esquerda.</p>
          <p className="mt-4 text-xs text-slate-500">Clique na magia para <strong className="text-yellow-600">Fixar</strong> e ler textos longos com calma.</p>
        </div>
      )}
    </div>
  );
}