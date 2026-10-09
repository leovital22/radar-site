// Renderizador de Markdown simples e seguro para o corpo dos artigos do Radar.
// Suporta: ## / ### subtítulos, listas numeradas e com marcadores, **negrito**,
// *itálico*, [links](url) e parágrafos. Não usa HTML cru, então não há risco de injeção.

function renderInline(text, keyPrefix) {
  const out = [];
  const regex = /(\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*([^*\s][^*]*?)\*)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    if (m[2] !== undefined) {
      out.push(<strong key={key}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      out.push(
        <a key={key} href={m[4]} target="_blank" rel="noopener noreferrer">
          {m[3]}
        </a>
      );
    } else if (m[5] !== undefined) {
      out.push(<em key={key}>{m[5]}</em>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function cleanLine(line) {
  return line
    .replace(/\s+$/g, '')
    .replace(/(\d)\s+%/g, '$1%')
    .replace(/(\d)\s+º/g, '$1º');
}

export function renderMarkdown(source) {
  if (!source) return null;

  // Aceita tanto quebras de linha reais quanto "\n" gravados como texto.
  const lines = String(source).replace(/\\n/g, '\n').split('\n').map(cleanLine);

  const blocks = [];
  let list = null; // { type: 'ol' | 'ul', items: [] }
  let para = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      continue;
    }

    let m;
    if ((m = line.match(/^#{3,6}\s+(.*)/))) {
      flushPara(); flushList();
      blocks.push({ type: 'h3', text: m[1] });
    } else if ((m = line.match(/^#{1,2}\s+(.*)/))) {
      flushPara(); flushList();
      blocks.push({ type: 'h2', text: m[1] });
    } else if ((m = line.match(/^\d+[.)]\s+(.*)/))) {
      flushPara();
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; }
      list.items.push(m[1]);
    } else if ((m = line.match(/^[-*•]\s+(.*)/))) {
      flushPara();
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; }
      list.items.push(m[1]);
    } else if (/^\*\*(Abertura|Fechamento|Introdução|Conclusão)\*\*:?$/i.test(line)) {
      // Rótulos internos que o agente às vezes escreve: não vão para o leitor.
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return blocks.map((b, i) => {
    const k = `b${i}`;
    if (b.type === 'h2') return <h2 key={k}>{renderInline(b.text, k)}</h2>;
    if (b.type === 'h3') return <h3 key={k}>{renderInline(b.text, k)}</h3>;
    if (b.type === 'ol' || b.type === 'ul') {
      const Tag = b.type;
      return (
        <Tag key={k}>
          {b.items.map((it, j) => (
            <li key={`${k}-${j}`}>{renderInline(it, `${k}-${j}`)}</li>
          ))}
        </Tag>
      );
    }
    return <p key={k}>{renderInline(b.text, k)}</p>;
  });
}
