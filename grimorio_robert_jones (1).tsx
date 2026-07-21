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