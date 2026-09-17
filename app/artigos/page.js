import { supabase } from '@/lib/supabaseClient';

export const revalidate = 60;

const tagClass = {
  Mercado: 'tag-mercado',
  Estratégia: 'tag-estrategia',
  Casos: 'tag-casos',
  Ferramentas: 'tag-ferramentas',
};

const categorias = ['Mercado', 'Estratégia', 'Casos', 'Ferramentas'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
}

export default async function ArtigosPage({ searchParams }) {
  const params = await searchParams;
  const categoriaAtiva = params?.categoria;

  let query = supabase.from('artigos').select('*').eq('status', 'Publicado').order('created_at', { ascending: false });
  if (categoriaAtiva) {
    query = query.eq('categoria', categoriaAtiva);
  }
  const { data: artigos, error } = await query;

  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <h2>Todas as matérias</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <a
            href="/artigos"
            className="tag"
            style={{
              background: !categoriaAtiva ? 'var(--green)' : 'var(--bg-3)',
              color: !categoriaAtiva ? 'var(--bg)' : 'var(--white)',
              border: '1px solid var(--line)',
            }}
          >
            TODAS
          </a>
          {categorias.map((c) => (
            <a
              key={c}
              href={`/artigos?categoria=${encodeURIComponent(c)}`}
              className="tag"
              style={{
                background: categoriaAtiva === c ? 'var(--green)' : 'var(--bg-3)',
                color: categoriaAtiva === c ? 'var(--bg)' : 'var(--white)',
                border: '1px solid var(--line)',
              }}
            >
              {c.toUpperCase()}
            </a>
          ))}
        </div>

        {error && <div className="empty-state">Erro ao carregar: {error.message}</div>}

        {!error && (!artigos || artigos.length === 0) && (
          <div className="empty-state">Nenhuma matéria encontrada nessa categoria ainda.</div>
        )}

        {artigos && artigos.length > 0 && (
          <div className="grid-articles">
            {artigos.map((a) => (
              <a className="article-card" key={a.id} href={`/artigo/${a.id}`}>
                <div
                  className="thumb"
                  style={a.imagem_url ? { backgroundImage: `url(${a.imagem_url})` } : undefined}
                ></div>
                <span className={`tag ${tagClass[a.categoria] || 'tag-mercado'}`}>
                  {(a.categoria || '').toUpperCase()}
                </span>
                <h3>{a.titulo}</h3>
                {a.resumo && <p>{a.resumo}</p>}
                <div className="card-meta">
                  <span>{formatDate(a.created_at)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
