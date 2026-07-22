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