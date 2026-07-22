import React, { useState, useEffect } from 'react';
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

const THEMES = [
  { id: 'default', name: 'Trevas (Padrão)', bg: '#070714', panel: '#0a0a1a', border: '#2a2a4a' },
  { id: 'blood', name: 'Sangue Demoníaco', bg: '#140505', panel: '#1c0a0a', border: '#4c1d1d' },
  { id: 'necro', name: 'Necromante', bg: '#0f0514', panel: '#180a1f', border: '#3b1d4c' },
  { id: 'arcane', name: 'Arcano', bg: '#051014', panel: '#0a1a1f', border: '#1d3e4c' },
  { id: 'noir', name: 'Noir', bg: '#0b0b0b', panel: '#141414', border: '#2a2a2a' }
];

export default function App() {
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

  const togglePin = (skill) => {
    if (isEditingSkill) return;
    if (pinnedSkill?.id === skill.id) setPinnedSkill(null);
    else { setPinnedSkill(skill); setHoveredSkill(null); setShowConfig(false); }
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
    setShowConfig(false);
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