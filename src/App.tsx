import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, Clock, ShieldCheck, Truck, BarChart3, 
  Settings, Zap, MessageSquare, Bell, ArrowRight, 
  Filter, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';

// Interface para simulação ideal do Funil e das Compras Urgentes
interface CardLicitacao {
  id: string;
  orgao: string;
  objeto: string;
  ramo: string;
  valor: number;
  portal: 'PNCP' | 'Compras.gov' | 'SIGA-RJ';
  tempoRestante: string;
  exclusivoME: boolean;
  margemEst: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'urgentes' | 'analytics' | 'settings'>('kanban');
  const [whatsappActive, setWhatsappActive] = useState(true);
  const [telegramActive, setTelegramActive] = useState(false);
  const [minRoi, setMinRoi] = useState(15);
  
  // Massa de dados mockada com tempos independentes simulados para manter a integridade visual
  const [licitacoes, setLicitacoes] = useState<CardLicitacao[]>([
    {
      id: '1',
      orgao: 'Câmara Municipal de Cantagalo - RJ',
      objeto: 'Contratação de empresa para fornecimento de materiais de consumo, papelaria, escritório e suprimentos de informática.',
      ramo: 'Papelaria e Informática',
      valor: 25148.82,
      portal: 'PNCP',
      tempoRestante: '02:45:12',
      exclusivoME: true,
      margemEst: 22
    },
    {
      id: '2',
      orgao: 'DETRAN - RJ',
      objeto: 'Aquisição de cadeiras operacionais ergonômicas e armários de aço para postos de atendimento.',
      ramo: 'Móveis Corporativos',
      valor: 48900.00,
      portal: 'SIGA-RJ',
      tempoRestante: '00:14:35',
      exclusivoME: true,
      margemEst: 18
    },
    {
      id: '3',
      orgao: 'Prefeitura de Niterói - RJ',
      objeto: 'Registro de preços para fornecimento de lâmpadas LED, cabos flexíveis e disjuntores gerais.',
      ramo: 'Material Elétrico',
      valor: 14250.00,
      portal: 'Compras.gov',
      tempoRestante: '04:21:05',
      exclusivoME: false,
      margemEst: 24
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex flex-col md:flex-row">
      {/* SIDEBAR DE NAVEGAÇÃO */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <FolderKanban size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">MEU FILTRO</h1>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Rio de Janeiro
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <button onClick={() => setActiveTab('kanban')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <FolderKanban size={18} /> Quadro de Licitações
            </button>
            <button onClick={() => setActiveTab('urgentes')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'urgentes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <Zap size={18} /> Compras Urgentes
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <BarChart3 size={18} /> Análise de Mercado
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <Settings size={18} /> Configurações / CNAEs
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 px-2">
          v1.0.0 Stable MVP
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DINÂMICO */}
      <main className="flex-1 bg-slate-950 p-4 md:p-8 overflow-y-auto">
        
        {/* VIEW: QUADRO KANBAN */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Quadro de Licitações (Funil)</h2>
                <p className="text-sm text-slate-400">Gerencie e avance seus processos ativos de dispensas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* COLUNA 1: TRIAGEM */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">Triagem / Novas</span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
                </div>
                {licitacoes.slice(2, 3).map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 shadow-md">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">{item.portal}</span>
                      <span className="text-amber-400 font-semibold">{item.tempoRestante}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">{item.orgao}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.objeto}</p>
                    </div>
                    <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-800/60">
                      <span className="font-bold text-emerald-400">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <button className="text-blue-400 flex items-center gap-0.5 hover:underline">Analisar <ArrowRight size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* COLUNA 2: EM ANÁLISE */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">Edital em Análise</span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">0</span>
                </div>
                <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800 rounded-lg">Nenhum card nesta fase</div>
              </div>

              {/* COLUNA 3: PROPOSTA CADASTRADA */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">Proposta Cadastrada</span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
                </div>
                {licitacoes.slice(0, 1).map(item => (
                  <div key={item.id} className="bg-slate-900 border border-blue-500/30 rounded-lg p-4 space-y-3 shadow-md">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">{item.portal}</span>
                      <span className="text-amber-400 font-semibold">{item.tempoRestante}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">{item.orgao}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.objeto}</p>
                    </div>
                    <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-800/60">
                      <span className="font-bold text-emerald-400">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <span className="text-blue-400 font-medium">Aguardando Abertura</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* COLUNA 4: EM DISPUTA */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">Em Disputa (Lances)</span>
                  <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">1</span>
                </div>
                {licitacoes.slice(1, 2).map(item => (
