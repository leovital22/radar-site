import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '@/lib/markdown';

const tagClass = {
  Mercado: 'tag-mercado',
  Estratégia: 'tag-estrategia',
  Casos: 'tag-casos',
  Ferramentas: 'tag-ferramentas',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default async function ArtigoPage({ params }) {
  const { id } = await params;

  const { data: artigo, error } = await supabase
    .from('artigos')
    .select('*')
    .eq('id', id)
    .eq('status', 'Publicado')
    .single();

  if (error || !artigo) {
    notFound();
  }

  return (
    <div className="wrap article-page">
      <span className={`tag ${tagClass[artigo.categoria] || 'tag-mercado'}`}>
        {(artigo.categoria || '').toUpperCase()}
      </span>
      <h1>{artigo.titulo}</h1>
      {artigo.resumo && <p className="dek">{artigo.resumo}</p>}
      <div className="byline">
        <b>Radar</b> · {formatDate(artigo.created_at)}
      </div>

      {artigo.imagem_url && (
        <figure className="article-cover">
          <div
            className="feature-big-thumb"
            style={{ backgroundImage: `url(${artigo.imagem_url})`, marginBottom: 0 }}
          ></div>
          {artigo.imagem_autor && (
            <figcaption className="photo-credit">
              Foto:{' '}
              {artigo.imagem_autor_link ? (
                <a href={artigo.imagem_autor_link} target="_blank" rel="noopener noreferrer">
                  {artigo.imagem_autor}
                </a>
              ) : (
                artigo.imagem_autor
              )}{' '}
              /{' '}
              <a
                href="https://unsplash.com/?utm_source=radar_blog&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
            </figcaption>
          )}
        </figure>
      )}

      <div className="article-body">{renderMarkdown(artigo.conteudo)}</div>

      {artigo.link_video && (
        <p style={{ marginTop: '32px' }}>
          <a href={artigo.link_video} className="video-badge" style={{ fontSize: '14px' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'var(--green)' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
            Assista também no O Briefing
          </a>
        </p>
      )}
    </div>
  );
}
