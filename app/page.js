import { supabase } from '@/lib/supabaseClient';

export const revalidate = 60; // re-busca artigos novos a cada 60s

const tagClass = {
  Mercado: 'tag-mercado',
  Estratégia: 'tag-estrategia',
  Casos: 'tag-casos',
  Ferramentas: 'tag-ferramentas',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
}

export default async function HomePage() {
  const { data: artigos, error } = await supabase
    .from('artigos')
    .select('*')
    .eq('status', 'Publicado')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="empty-state">
        Erro ao carregar os artigos do Supabase: {error.message}
      </div>
    );
  }

  if (!artigos || artigos.length === 0) {
    return (
      <div className="empty-state">
        Ainda não há matérias publicadas no Radar.<br />
        Assim que um artigo for aprovado no Supabase (status = &quot;Publicado&quot;), ele aparece aqui automaticamente.
      </div>
    );
  }

  const destaque = artigos[0];
  const listaLateral = artigos.slice(1, 5);
  const emAlta = artigos.slice(0, 3);
  const destaqueGrande = artigos[1] || artigos[0];
  const destaquesPequenos = artigos.slice(2, 6);
  const ultimas = artigos.slice(0, 6);

  return (
    <>
      <div className="hero">
        {destaque.imagem_url && (
          <img className="hero-photo" src={destaque.imagem_url} alt={destaque.titulo} />
        )}
        <div className="hero-overlay"></div>
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">EDIÇÃO DESTA SEMANA</div>
            <h1>{destaque.titulo}</h1>
            {destaque.resumo && <p className="dek">{destaque.resumo}</p>}
            <div className="byline">
              <b>Radar</b> · {destaque.categoria} · {formatDate(destaque.created_at)}
            </div>
          </div>
          {listaLateral.length > 0 && (
            <div className="signals">
              <div className="signals-head">
                <b>ÚLTIMAS NOTÍCIAS</b>
                <span className="pulse-dot"></span>
              </div>
              {listaLateral.map((a) => (
                <a className="signal-item" key={a.id} href={`/artigo/${a.id}`}>
                  <div
                    className="signal-thumb"
                    style={a.imagem_url ? { backgroundImage: `url(${a.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  ></div>
                  <div>
                    <p>{a.titulo}</p>
                    <span>{(a.categoria || '').toUpperCase()} · {formatDate(a.created_at)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {emAlta.length > 0 && (
        <div className="trending">
          <div className="wrap">
            <div className="trending-label"><span className="pulse-dot"></span>EM ALTA</div>
            <div className="trending-grid">
              {emAlta.map((a) => (
                <a className="trend-card" key={a.id} href={`/artigo/${a.id}`}>
                  <div
                    className="trend-thumb"
                    style={a.imagem_url ? { backgroundImage: `url(${a.imagem_url})` } : undefined}
                  ></div>
                  <h4>{a.titulo}</h4>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Destaques da semana</h2>
            <a href="/artigos">Ver todas →</a>
          </div>
          <div className="feature-grid">
            <a className="feature-big" href={`/artigo/${destaqueGrande.id}`}>
              <div
                className="feature-big-thumb"
                style={destaqueGrande.imagem_url ? { backgroundImage: `url(${destaqueGrande.imagem_url})` } : undefined}
              ></div>
              <span className={`tag ${tagClass[destaqueGrande.categoria] || 'tag-mercado'}`}>
                {(destaqueGrande.categoria || '').toUpperCase()}
              </span>
              <h3>{destaqueGrande.titulo}</h3>
              {destaqueGrande.resumo && <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{destaqueGrande.resumo}</p>}
            </a>
            {destaquesPequenos.length > 0 && (
              <div className="feature-small-grid">
                {destaquesPequenos.map((a) => (
                  <a className="feature-small" key={a.id} href={`/artigo/${a.id}`}>
                    <div
                      className="feature-small-thumb"
                      style={a.imagem_url ? { backgroundImage: `url(${a.imagem_url})` } : undefined}
                    ></div>
                    <span className={`tag ${tagClass[a.categoria] || 'tag-mercado'}`}>
                      {(a.categoria || '').toUpperCase()}
                    </span>
                    <h4>{a.titulo}</h4>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="section" style={{ borderBottom: 'none' }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Últimas no Radar</h2>
            <a href="/artigos">Ver todas →</a>
          </div>
          <div className="grid-articles">
            {ultimas.map((a) => (
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
                  {a.link_video && (
                    <>
                      <span>·</span>
                      <span className="video-badge">
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        Também no vídeo
                      </span>
                    </>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
