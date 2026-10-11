import './globals.css';
import Ticker from './Ticker';

export const revalidate = 60;

export const metadata = {
  title: 'Radar — o que move o mercado',
  description: 'Mercado, estratégia, casos e ferramentas de marketing e negócios no Brasil.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="topbar">
          <div className="wrap topbar-inner">
            <a className="brand" href="/">
              <svg className="brand-mark" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#7cd52d" strokeWidth="1.4" opacity="0.5" />
                <circle cx="20" cy="20" r="11" stroke="#7cd52d" strokeWidth="1.4" opacity="0.7" />
                <circle cx="20" cy="20" r="2.4" fill="#7cd52d" />
                <line x1="20" y1="20" x2="20" y2="2" stroke="#7cd52d" strokeWidth="1.4" />
              </svg>
              <div className="brand-word">RADA<span>R</span></div>
            </a>
            <nav className="main-nav">
              <a href="/artigos?categoria=Mercado">Mercado</a>
              <a href="/artigos?categoria=Estratégia">Estratégia</a>
              <a href="/artigos?categoria=Casos">Casos</a>
              <a href="/artigos?categoria=Ferramentas">Ferramentas</a>
              <a href="/artigos">Todas as matérias</a>
            </nav>
          </div>
          <Ticker />
        </div>

        {children}

        <footer>
          <div className="wrap">
            <div className="foot-top">
              <div className="foot-left">
                <div className="foot-brand">RADA<span>R</span></div>
                <div>
                  <div className="foot-vortex-label">UM BRAÇO EDITORIAL DA</div>
                  <div className="vortex-lockup">
                    <svg viewBox="0 0 40 40" fill="none">
                      <path
                        d="M20 4 C 28 4 34 10 34 18 C 34 24.4 29 29.6 22.4 29.6 C 17.6 29.6 13.6 25.9 13.6 21.2 C 13.6 17.6 16.4 14.8 20 14.8 C 22.8 14.8 25 17 25 19.8"
                        stroke="#7cd52d"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <circle cx="25" cy="19.8" r="2.2" fill="#7cd52d" />
                    </svg>
                    <div className="vortex-lockup-text">VORTEX<span>ADS</span></div>
                  </div>
                </div>
              </div>
              <div className="foot-cols">
                <div>
                  <a href="/artigos?categoria=Mercado">Mercado</a>
                  <a href="/artigos?categoria=Estratégia">Estratégia</a>
                  <a href="/artigos?categoria=Casos">Casos</a>
                  <a href="/artigos?categoria=Ferramentas">Ferramentas</a>
                </div>
                <div>
                  <a href="#">O Briefing (YouTube)</a>
                  <a href="#">Sobre o Radar</a>
                </div>
                <div>
                  <a href="https://instagram.com/vortexads.co">Instagram · @vortexads.co</a>
                  <a href="mailto:Vortexads.info@gmail.com">Vortexads.info@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="foot-legal">
              <span>O Radar é o braço editorial da Vortex Ads — cobrimos o mercado de marketing e negócios do Brasil com a mesma lógica que aplicamos nas contas dos nossos clientes.</span>
              <span>Vortex Ads · Estratégia e Marketing</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
