import { supabase } from '@/lib/supabaseClient';

// Faixa "NO RADAR": mostra as manchetes dos artigos publicados mais recentes.
export default async function Ticker() {
  const { data } = await supabase
    .from('artigos')
    .select('id, titulo, categoria')
    .eq('status', 'Publicado')
    .order('created_at', { ascending: false })
    .limit(6);

  const itens = data || [];
  if (itens.length === 0) return null;

  // Repete a lista para a faixa nunca ficar vazia na tela,
  // e duplica no fim para a animação girar sem "pulo".
  let base = [...itens];
  while (base.length < 4) base = base.concat(itens);
  const trilha = base.concat(base);

  return (
    <div className="ticker-row">
      <div className="ticker-tag">NO RADAR</div>
      <div className="ticker-scroll">
        <div className="ticker-track">
          {trilha.map((a, i) => (
            <a key={`${a.id}-${i}`} href={`/artigo/${a.id}`} aria-hidden={i >= base.length ? 'true' : undefined} tabIndex={i >= base.length ? -1 : undefined}>
              <b>{(a.categoria || 'Radar').toUpperCase()}</b> {a.titulo}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
