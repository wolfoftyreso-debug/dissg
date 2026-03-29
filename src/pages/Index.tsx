import { Link } from 'react-router-dom'

const PETROL = '#003D6B'
const BORDER = '#1A1A1A'
const TEXT = '#1A1A1A'
const SECONDARY = '#4A4A4A'
const BG = '#FFFFFF'
const BG_ALT = '#F4F4F4'

export default function Index() {
  return (
    <div style={{ fontFamily: '"IBM Plex Sans", -apple-system, sans-serif', background: BG, color: TEXT, minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 48px', display: 'flex', alignItems: 'center', height: 52 }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: PETROL, flex: 1 }}>
          DISSG · DIGITAL INTELLIGENCE SYSTEM
        </div>
        <nav style={{ display: 'flex', gap: 0 }}>
          {[
            ['/', 'Hem'],
            ['/public', 'Dashboard'],
            ['/om', 'Om systemet'],
            ['/api-policy', 'API'],
            ['/login', 'Logga in'],
          ].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', padding: '0 20px', height: 52, lineHeight: '52px', fontSize: 13, color: SECONDARY, textDecoration: 'none', borderLeft: `1px solid #E0E0E0`, fontWeight: 400 }}>
              {label}
            </Link>
          ))}
          <Link to="/register" style={{ display: 'block', padding: '0 20px', height: 52, lineHeight: '52px', fontSize: 13, color: '#FFFFFF', background: PETROL, textDecoration: 'none', borderLeft: `1px solid ${PETROL}`, fontWeight: 600 }}>
            Registrera
          </Link>
        </nav>
      </header>

      {/* System identification bar */}
      <div style={{ background: PETROL, padding: '8px 48px', display: 'flex', gap: 48, alignItems: 'center' }}>
        {[
          ['VERSION', '2.1.0'],
          ['KLASSIFICERING', 'KOMMERSIELL'],
          ['JURISDIKTION', 'EU · GLOBAL'],
          ['STATUS', 'OPERATIV'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 8, fontSize: 11 }}>
            <span style={{ color: '#7FB3D3', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, letterSpacing: '0.06em' }}>{k}</span>
            <span style={{ color: '#FFFFFF', fontFamily: '"IBM Plex Mono", monospace' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px' }}>
        
        {/* System description */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 64 }}>
          <tbody>
            <tr>
              <td style={{ width: '60%', paddingRight: 64, verticalAlign: 'top' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, borderLeft: `3px solid ${PETROL}`, paddingLeft: 12 }}>
                  SYSTEMÖVERSIKT
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, margin: '0 0 20px', letterSpacing: '-0.3px' }}>
                  Beslutsstöd för<br />beslutsfattare.
                </h1>
                <p style={{ fontSize: 15, color: SECONDARY, lineHeight: 1.8, margin: '0 0 32px', maxWidth: 500 }}>
                  DISSG aggregerar, strukturerar och presenterar global intelligensdata för politiker, analytiker och nyhetsredaktioner. Källhänvisat. Verifierbart. Maskinläsbart.
                </p>
                <div style={{ display: 'flex', gap: 0 }}>
                  <Link to="/register" style={{ padding: '12px 28px', background: PETROL, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', border: `1px solid ${PETROL}` }}>
                    ÖPPNA KONTO
                  </Link>
                  <Link to="/public" style={{ padding: '12px 28px', background: 'transparent', color: TEXT, textDecoration: 'none', fontSize: 13, fontWeight: 600, border: `1px solid ${BORDER}`, borderLeft: 'none' }}>
                    SYSTEMDEMO
                  </Link>
                </div>
              </td>
              <td style={{ verticalAlign: 'top', background: BG_ALT, padding: 28, border: `1px solid #E0E0E0` }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>SYSTEMSPECIFIKATION</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }}>
                  <tbody>
                    {[
                      ['Systembet.', 'DISSG-01'],
                      ['Version', '2.1.0 / 2026-Q1'],
                      ['Datakällor', 'WorldBank · UN · OECD · SCB'],
                      ['Täckning', '190+ länder'],
                      ['Uppdatering', 'Daglig · Realtid (Pro)'],
                      ['Exportformat', 'JSON · CSV · PDF'],
                      ['API', 'REST · OAuth2'],
                      ['Jurisdiktion', 'EU (GDPR) · Global'],
                      ['Operatör', 'Wavult Group FZCO, Dubai'],
                    ].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid #E0E0E0' }}>
                        <td style={{ padding: '7px 0', color: SECONDARY, width: '45%' }}>{k}</td>
                        <td style={{ padding: '7px 0', color: TEXT, fontWeight: 500 }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Module overview */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, borderLeft: `3px solid ${PETROL}`, paddingLeft: 12 }}>
            SYSTEMMODULER
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                {['Modul', 'Funktion', 'Datakälla', 'Tillgång'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: SECONDARY, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['GDM · Global Diagnostic Map', 'Interaktiv världskarta med 50+ indikatorer', 'WorldBank · Freedom House', 'Gratis'],
                ['GMI · Global Master Index', 'Komposit-index per land och region', 'OECD · UN · EIU', 'Gratis'],
                ['Kausalgrafer', 'Orsaksanalys och signaldetektion', 'Beräknat', 'Pro'],
                ['Beslutstidslinje', 'Historik av politiska beslut och effekter', 'Officiella register', 'Pro'],
                ['API · Datautmatning', 'Maskinläsbar export för integrationer', 'Alla källor', 'Enterprise'],
                ['Regional Intelligence', 'Djupanalys per region/sektor', 'Lokala datakällor', 'Pro'],
              ].map(([mod, func, src, access], i) => (
                <tr key={mod} style={{ borderBottom: '1px solid #E0E0E0', background: i % 2 === 0 ? '#FFFFFF' : BG_ALT }}>
                  <td style={{ padding: '12px 16px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 500, color: PETROL, fontSize: 12 }}>{mod}</td>
                  <td style={{ padding: '12px 16px', color: TEXT }}>{func}</td>
                  <td style={{ padding: '12px 16px', color: SECONDARY, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11 }}>{src}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: access === 'Gratis' ? '#1A5C1A' : access === 'Pro' ? PETROL : '#7B3C00', border: `1px solid`, borderColor: access === 'Gratis' ? '#1A5C1A' : access === 'Pro' ? PETROL : '#7B3C00', padding: '2px 8px' }}>
                      {access.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: PETROL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, borderLeft: `3px solid ${PETROL}`, paddingLeft: 12 }}>
            PRENUMERATIONSPLANER
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                {['Plan', 'Pris', 'Inkluderat', 'Målgrupp'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: SECONDARY, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['STANDARD', '0 kr / mån', 'GDM, GMI, 3 sök/dag', 'Allmänhet · Studenter'],
                ['PRO', '799 kr / mån', 'Allt i Standard + kausal, export, API, obeg. sökning', 'Analytiker · Journalister'],
                ['ENTERPRISE', 'Offert', 'Allt i Pro + whitelabel, anpassad data, SLA, dedikerat stöd', 'Nyhetsredaktioner · Myndigheter'],
              ].map(([plan, price, inc, target], i) => (
                <tr key={plan} style={{ borderBottom: '1px solid #E0E0E0', background: i === 1 ? '#EEF5FC' : i % 2 === 0 ? '#FFFFFF' : BG_ALT }}>
                  <td style={{ padding: '14px 16px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, fontSize: 12, color: i === 1 ? PETROL : TEXT, borderLeft: i === 1 ? `3px solid ${PETROL}` : '3px solid transparent' }}>{plan}</td>
                  <td style={{ padding: '14px 16px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: 13, color: TEXT }}>{price}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: SECONDARY, maxWidth: 300 }}>{inc}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: SECONDARY }}>{target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: BG_ALT, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: SECONDARY }}>
          DISSG · Wavult Group FZCO · Dubai, UAE · © 2026
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            ['/om', 'Om systemet'],
            ['/api-policy', 'API-policy'],
            ['mailto:access@dissg.se', 'Kontakt'],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: SECONDARY, textDecoration: 'none', padding: '0 16px', borderLeft: '1px solid #E0E0E0' }}>
              {label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}
