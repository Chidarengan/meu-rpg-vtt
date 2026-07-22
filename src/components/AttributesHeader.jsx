import React from 'react';
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
    const updated = [...sheetData.resources, { id: `res_${Date.now()}`, label: 'Novo Recurso', type: 'number', value: '100', max: '100', color: 'bg-green-500' }];
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

        <div className="flex items-center gap-2">
          {isSheetUnlocked && (
            <div className="flex bg-black/30 rounded border p-0.5" style={{ borderColor: activeTheme.border }}>
              <button onClick={undo} disabled={historyStack.length === 0} className={`p-1 rounded ${historyStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`} title="Desfazer (Ctrl+Z)"><Undo size={14}/></button>
              <button onClick={redo} disabled={redoStack.length === 0} className={`p-1 rounded ${redoStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`} title="Refazer (Ctrl+Y)"><Redo size={14}/></button>
            </div>
          )}

          <button 
            onClick={() => setIsSheetUnlocked(!isSheetUnlocked)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all ${isSheetUnlocked ? 'bg-red-950/40 border-red-500/80 text-red-300' : 'bg-slate-800/80 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
          >
            {isSheetUnlocked ? <Unlock size={14} className="animate-pulse" /> : <Lock size={14} />}
            {isSheetUnlocked ? "DESTRAVADO / EDITAR" : "FICHA TRAVADA"}
          </button>

          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 rounded border transition-colors ${showConfig ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white'}`}
          >
            <Settings size={16} />
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