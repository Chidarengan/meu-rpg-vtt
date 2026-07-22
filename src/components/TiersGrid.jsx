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