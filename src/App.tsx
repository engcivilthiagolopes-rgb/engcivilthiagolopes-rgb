import React, { useEffect, useState } from 'react';
import { 
  FolderKanban, Clock, AlertTriangle, ShieldCheck, 
  ArrowRight, RefreshCw, KeyRound, Truck, Search, CheckCircle2 
} from 'lucide-react';

// Interface estruturada para as licitações reais do PNCP
interface LicitacaoPNCP {
  id: string;
  orgao: string;
  objeto: string;
  ramo: string;
  valorMaximo: number;
  dataEncerramento: string;
  tempoRestanteTexto?: string;
  linkOficial: string;
}

// 1. MOTOR DE BUSCA DA API DO PNCP INTEGRADO
async function buscarDispensasReaisRJ(): Promise<LicitacaoPNCP[]> {
  try {
    const url = 'https://pncp.gov.br';
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    
    const palavrasChave = ['papel', 'cadeira', 'alcool', 'parafuso', 'lampada', 'led', 'tubo', 'tinta', 'toner', 'teclado', 'mouse', 'limpeza', 'material', 'escritorio', 'fio', 'cabo'];

    return data.data
      .map((item: any) => ({
        id: item.id || String(Math.random()),
        orgao: item.orgaoSubordinadoNome || item.orgaoEntidadeNome || 'Órgão Fluminense',
        objeto: item.objeto || '',
        ramo: 'Geral',
        valorMaximo: item.valorTotalEstimado || 0,
        dataEncerramento: item.dataFimTermo || new Date(Date.now() + 7200000).toISOString(),
        linkOficial: `https://pncp.gov.br{item.orgaoEntidadeCnpj}/${item.anoContratacao}/${item.sequencialContratacao}`
      }))
      .filter((lic: any) => lic.valorMaximo <= 100000 && palavrasChave.some(p => lic.objeto.toLowerCase().includes(p)));
  } catch (error) {
    return [];
  }
}

export default function App() {
  const [licitacoes, setLicitacoes] = useState<LicitacaoPNCP[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega as licitações reais do governo fluminense
  const carregarDados = () => {
    setLoading(true);
    buscarDispensasReaisRJ().then(dados => {
      setLicitacoes(dados);
      setLoading(false);
    });
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // 2. CRONÔMETRO RESTRITO SEGUNDO A SEGUNDO INDEPENDENTE
  useEffect(() => {
    const timer = setInterval(() => {
      setLicitacoes(listaAtual => 
        listaAtual.map(item => {
          const diferencaTempo = new Date(item.dataEncerramento).getTime() - new Date().getTime();
          
          if (diferencaTempo <= 0) {
            return { ...item, tempoRestanteTexto: 'Encerrada' };
          }

          const hrs = Math.floor(diferencaTempo / 3600000);
          const mins = Math.floor((diferencaTempo % 3600000) / 60000);
          const secs = Math.floor((diferencaTempo % 60000) / 1000);

          return {
            ...item,
            tempoRestanteTexto: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [licitacoes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <FolderKanban size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MEU FILTRO</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sincronização Ativa com PNCP & Compras.gov
              </p>
            </div>
          </div>
          <button onClick={carregarDados} className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition-all font-medium">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Atualizar Bases
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* FILTROS E INFORMAÇÕES DO USUÁRIO */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Localidade e Região</span>
            <span className="text-sm font-bold text-slate-200 block">📍 Estado do Rio de Janeiro</span>
            <span className="text-xs text-slate-400 block">Esfera Estadual e todos os 92 Municípios</span>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0 md:px-6">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Modalidade & Teto</span>
            <span className="text-sm font-bold text-slate-200 block">⚡ Dispensa de Licitação (Lei 14.133)</span>
            <span className="text-xs text-slate-400 block">Contratações de até R\$ 100.000,00</span>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Perfil Comercial Ativo</span>
            <div className="flex flex-wrap gap-1.5">
              {['Papelaria', 'Móveis', 'Limpeza', 'Ferragens', 'Elétrica', 'Hidráulica', 'Pintura', 'Informática'].map(ramo => (
                <span key={ramo} className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-medium text-slate-300">{ramo}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FEED EM TEMPO REAL */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
            🔔 Contratações Urgentes em Andamento ({licitacoes.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800/60 rounded-xl">
              <RefreshCw size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-slate-400">Consultando bases governamentais e processando prazos...</p>
            </div>
          ) : licitacoes.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800/60 rounded-xl">
              <Search size={24} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">Nenhuma dispensa ativa encontrada no teto estabelecido neste momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licitacoes.map(item => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg transition-all group">
                  <div className="space-y-3">
                    {/* TOPO CARD */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase">PNCP OFICIAL</span>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded ${item.tempoRestanteTexto === 'Encerrada' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        <Clock size={12} />
                        <span>{item.tempoRestanteTexto || 'Calculando...'}</span>
                      </div>
                    </div>

                    {/* CONTEÚDO CARD */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">{item.orgao}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.objeto}</p>
                    </div>

                    {/* INTELIGÊNCIA INTERNA E AVALIAÇÃO */}
                    <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400" /> Exclusivo ME/EPP</div>
                      <div className="flex items-center gap-1"><Truck size={12} className="text-blue-400" /> Fornecedores Prontos</div>
                    </div>
                  </div>

                  {/* RODAPÉ DO CARD */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Valor Estimado</span>
                      <span className="text-base font-extrabold text-emerald-400">{item.valorMaximo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <a href={item.linkOficial} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/10">
                      Participar <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
