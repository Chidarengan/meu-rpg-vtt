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