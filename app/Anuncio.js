import { supabase } from '@/lib/supabaseClient';

// Espaços de anúncio do Radar.
// posicao: 'home-topo' | 'home-lateral' | 'artigo-meio' | 'artigo-fim'
// A tabela "anuncios" no Supabase só deixa o site ver anúncios ativos e dentro do período.

const WHATSAPP = '5599984980343';

const formatos = {
  'home-topo': 'banner',
  'home-lateral': 'vertical',
  'artigo-meio': 'banner',
  'artigo-fim': 'quadrado',
};

export default async function Anuncio({ posicao }) {
  const formato = formatos[posicao] || 'banner';
  let anuncio = null;

  try {
    const { data } = await supabase
      .from('anuncios')
      .select('anunciante, imagem_url, link')
      .eq('posicao', posicao)
      .order('created_at', { ascending: false })
      .limit(1);
    anuncio = data && data.length ? data[0] : null;
  } catch (e) {
    anuncio = null;
  }

  if (anuncio) {
    const imagem = (
      <img src={anuncio.imagem_url} alt={`Anúncio: ${anuncio.anunciante}`} loading="lazy" />
    );
    return (
      <aside className={`ad-slot ad-${formato}`} aria-label="Publicidade">
        <span className="ad-label">Publicidade</span>
        {anuncio.link ? (
          <a href={anuncio.link} target="_blank" rel="noopener noreferrer sponsored">{imagem}</a>
        ) : (
          imagem
        )}
      </aside>
    );
  }

  const texto = encodeURIComponent('Olá! Quero anunciar no Radar.');
  return (
    <aside className={`ad-slot ad-${formato}`} aria-label="Publicidade">
      <span className="ad-label">Publicidade</span>
      <a
        className="ad-vazio"
        href={`https://wa.me/${WHATSAPP}?text=${texto}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>Anuncie aqui</strong>
        <span className="ad-cta">Quero anunciar</span>
      </a>
    </aside>
  );
}
