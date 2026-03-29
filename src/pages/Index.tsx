import { useState } from 'react'
import { Link } from 'react-router-dom'

const PETROL = '#003D6B'
const BORDER = '#1A1A1A'
const TEXT = '#1A1A1A'
const SECONDARY = '#4A4A4A'
const BG = '#FFFFFF'
const BG_ALT = '#F4F4F4'

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: '"IBM Plex Sans", -apple-system, sans-serif', background: BG, color: TEXT, minHeight: '100vh' }}>
      
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 200, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', color: PETROL }}>
              DISSG
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: TEXT }}>×</button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[['/', 'Hem'], ['/public', 'Dashboard'], ['/om', 'Om systemet'], ['/api-policy', 'API'], ['/login', 'Logga in']].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '16px 0', fontSize: 18, color: TEXT, textDecoration: 'none', borderBottom: '1px solid #E5E7EB', fontWeight: 500 }}>
                {label}
              </Link>
            ))}
            <Link to="/register" onClick={() => setMenuOpen(false)}
              style={{ display: 'block', marginTop: 24, padding: '16px 0', textAlign: 'center', background: PETROL, color: '#fff', borderRadius: 4, textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
              Registrera — Gratis
            </Link>
          </nav>
        </div>
      )}

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 clamp(16px, 5vw, 48px)', display: 'flex', alignItems: 'center', height: 52, position: 'sticky', top: 0, background: BG, zIndex: 100 }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: PETROL, flex: 1 }}>
          DISSG
        </div>
        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 0 }} className="desktop-nav">
          {[['/', 'Hem'], ['/public', 'Dashboard'], ['/om', 'Om systemet'], ['/api-policy', 'API'], ['/login', 'Logga in']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', padding: '0 16px', height: 52, lineHeight: '52px', fontSize: 13, color: SECONDARY, textDecoration: 'none', borderLeft: '1px solid #E0E0E0' }}>
              {label}
            </Link>
          ))}
          <Link to="/register" style={{ display: 'block', padding: '0 20px', height: 52, lineHeight: '52px', fontSize: 13, color: '#fff', background: PETROL, textDecoration: 'none', borderLeft: `1px solid ${PETROL}`, fontWeight: 600 }}>
            Registrera
          </Link>
        </nav>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(true)} className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: TEXT, padding: '0 4px', lineHeight: 1 }}>
          ☰
        </button>
      </header>

      {/* System identification bar */}
      <div style={{ background: PETROL, padding: '6px clamp(16px, 5vw, 48px)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', minWidth: 'max-content' }}>
          {[['VERSION', '2.1.0'], ['KLASSIFICERING', 'KOMMERSIELL'], ['JURISDIKTION', 'EU · GLOBAL'], ['STATUS', 'OPERATIV']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 8, fontSize: 11 }}>
              <span style={{ color: '#7FB3D3', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, letterSpacing: '0.06em' }}>{k}</span>
              <span style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px, 6vw, 64px) clamp(16px, 5vw, 48px)' }}>
        
        {/* Hero + spec — stacks on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 40, marginBottom: 64 }}>
          <div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, borderLeft: `3px solid ${PETROL}`, paddingLeft: 12 }}>
              SYSTEMÖVERSIKT
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 20px', letterSpacing: '-0.3px' }}>
              Beslutsstöd för<br />beslutsfattare.
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 15px)', color: SECONDARY, lineHeight: 1.8, margin: '0 0 32px', maxWidth: 500 }}>
              DISSG aggregerar, strukturerar och presenterar global intelligensdata för politiker, analytiker och nyhetsredaktioner. Källhänvisat. Verifierbart. Maskinläsbart.
            </p>
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
              <Link to="/register" style={{ padding: '12px 24px', background: PETROL, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', border: `1px solid ${PETROL}` }}>
                ÖPPNA KONTO
              </Link>
              <Link to="/public" style={{ padding: '12px 24px', background: 'transparent', color: TEXT, textDecoration: 'none', fontSize: 14, fontWeight: 600, border: `1px solid ${BORDER}`, borderLeft: 'none' }}>
                SYSTEMDEMO
              </Link>
            </div>
          </div>
          <div style={{ background: BG_ALT, padding: 24, border: `1px solid #E0E0E0` }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>SYSTEMSPECIFIKATION</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }}>
                <tbody>
                  {[
                    ['Systembet.', 'DISSG-01'],
                    ['Version', '2.1.0 / 2026-Q1'],
                    ['Datakällor', 'WorldBank · UN · OECD'],
                    ['Täckning', '190+ länder'],
                    ['Uppdatering', 'Daglig · Realtid (Pro)'],
                    ['Exportformat', 'JSON · CSV · PDF'],
                    ['API', 'REST · OAuth2'],
                    ['Jurisdiktion', 'EU (GDPR) · Global'],
                    ['Operatör', 'Wavult Group FZCO'],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ padding: '7px 0', color: SECONDARY, width: '45%' }}>{k}</td>
                      <td style={{ padding: '7px 0', color: TEXT, fontWeight: 500 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Module table — scrollable on mobile */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, borderLeft: `3px solid ${PETROL}`, paddingLeft: 12 }}>
            SYSTEMMODULER
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                  {['Modul', 'Funktion', 'Datakälla', 'Tillgång'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: SECONDARY, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['GDM · Global Diagnostic Map', 'Interaktiv världskarta', 'WorldBank · Freedom House', 'Gratis'],
                  ['GMI · Global Master Index', 'Komposit-index', 'OECD · UN', 'Gratis'],
                  ['Kausalgrafer', 'Orsaksanalys', 'Beräknat', 'Pro'],
                  ['Beslutstidslinje', 'Historik av beslut', 'Officiella register', 'Pro'],
                  ['API · Datautmatning', 'Maskinläsbar export', 'Alla källor', 'Enterprise'],
                ].map(([mod, func, src, access], i) => (
                  <tr key={mod} style={{ borderBottom: '1px solid #E0E0E0', background: i % 2 === 0 ? '#fff' : BG_ALT }}>
                    <td style={{ padding: '10px 12px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 500, color: PETROL, fontSize: 11 }}>{mod}</td>
                    <td style={{ padding: '10px 12px', color: TEXT }}>{func}</td>
                    <td style={{ padding: '10px 12px', color: SECONDARY, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11 }}>{src}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, fontWeight: 700, color: access === 'Gratis' ? '#1A5C1A' : PETROL, border: '1px solid', borderColor: access === 'Gratis' ? '#1A5C1A' : PETROL, padding: '1px 6px' }}>{access.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing — stack on mobile */}
        <div>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, borderLeft: `3px solid ${PETROL}`, paddingLeft: 12 }}>
            PRENUMERATIONSPLANER
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                  {['Plan', 'Pris', 'Målgrupp'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: SECONDARY, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['STANDARD', '0 kr / mån', 'Allmänhet · Studenter'],
                  ['PRO', '799 kr / mån', 'Analytiker · Journalister'],
                  ['ENTERPRISE', 'Offert', 'Nyhetsredaktioner · Myndigheter'],
                ].map(([plan, price, target], i) => (
                  <tr key={plan} style={{ borderBottom: '1px solid #E0E0E0', background: i === 1 ? '#EEF5FC' : i % 2 === 0 ? '#fff' : BG_ALT }}>
                    <td style={{ padding: '14px 12px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, fontSize: 12, color: i === 1 ? PETROL : TEXT, borderLeft: i === 1 ? `3px solid ${PETROL}` : '3px solid transparent' }}>{plan}</td>
                    <td style={{ padding: '14px 12px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: 13 }}>{price}</td>
                    <td style={{ padding: '14px 12px', fontSize: 13, color: SECONDARY }}>{target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: 'clamp(16px, 3vw, 20px) clamp(16px, 5vw, 48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: BG_ALT, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: SECONDARY }}>
          DISSG · Wavult Group FZCO · © 2026
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
          {[['/om', 'Om systemet'], ['/api-policy', 'API-policy'], ['mailto:access@dissg.se', 'Kontakt']].map(([href, label]) => (
            <a key={href} href={href} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: SECONDARY, textDecoration: 'none', padding: '0 12px', borderLeft: '1px solid #E0E0E0' }}>
              {label}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
