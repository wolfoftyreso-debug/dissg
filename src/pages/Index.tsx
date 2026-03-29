/**
 * ============================================================================
 * DISSG – LANDING PAGE (Enterprise Edition)
 * ============================================================================
 *
 * Ren vit design. Hero: "Världen förklarad. Beslut förstärkta."
 * Tre tiers: Gratis / Pro 799 kr/mån / Enterprise
 * Beslutstöd för politiker, journalister, analytiker
 */

export default function Index() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.5px' }}>DISSG</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/about" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Om systemet</a>
          <a href="/methodology" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Metodik</a>
          <a href="/pricing" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Priser</a>
          <a href="/login" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Logga in</a>
          <a href="/register" style={{ fontSize: 14, padding: '8px 20px', background: '#1C1C1E', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Kom igång gratis</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 48px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 20 }}>
          Digital Intelligence &amp; Signal System for Governance
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, color: '#1C1C1E', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24, margin: '0 0 24px' }}>
          Världen förklarad.<br />Beslut förstärkta.
        </h1>
        <p style={{ fontSize: 20, color: '#6B7280', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
          DISSG ger politiker, journalister och analytiker realtidsintelligens om globala skeenden — strukturerad, källbelagd och möjlig att agera på.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ padding: '16px 36px', background: '#1C1C1E', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            Starta gratis
          </a>
          <a href="/public-dashboard" style={{ padding: '16px 36px', background: '#F3F4F6', color: '#374151', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>
            Se demo →
          </a>
        </div>
      </div>

      {/* Social proof strip */}
      <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '20px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, letterSpacing: '0.05em' }}>
          BESLUTSTÖD FÖR · RIKSDAG &amp; REGERING · KOMMUNLEDNINGAR · INVESTIGATIV JOURNALISM · THINKTANKS · POLICY-ANALYTIKER
        </p>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-1px', margin: '0 0 16px' }}>
            Intelligens du kan agera på
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', margin: 0 }}>
            Inte bara data. Kausal förståelse och strukturerat beslutsunderlag.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            {
              icon: '🌍',
              title: 'Globala index',
              desc: 'Demokrati, pressfrihet, korruption, klimat — live-data från 190+ länder sammansatt i ett enhetligt system.',
            },
            {
              icon: '⚡',
              title: 'Kausala signaler',
              desc: 'Se vad som driver vad. Kausalgrafer och trendanalys identifierar mekanismer, inte bara korrelationer.',
            },
            {
              icon: '📋',
              title: 'Beslutsstöd',
              desc: 'Strukturerat underlag för lagstiftning, policy och journalistik. Exportera till PDF, CSV eller via API.',
            },
            {
              icon: '🔍',
              title: 'Djupanalys',
              desc: 'Borra ned från global trend till enskilt land, region och indikator. Historisk data sedan 1960.',
            },
            {
              icon: '🛡️',
              title: 'Källbelagd data',
              desc: 'Varje siffra spåras till primärkälla: FN, Världsbanken, V-Dem, RSF, TI och 40+ andra auktoriteter.',
            },
            {
              icon: '🤖',
              title: 'AI-assistans',
              desc: 'Ställ komplexa frågor i naturligt språk. Systemet svarar med källhänvisningar och osäkerhetsintervall.',
            },
          ].map(f => (
            <div key={f.title} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '28px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1C1C1E', marginBottom: 8, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '72px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-1px', margin: '0 0 16px' }}>
              Vem använder DISSG?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              {
                role: 'Politiker & tjänstemän',
                desc: 'Faktabaserat underlag för lagstiftning och budgetbeslut. Jämför Sverige med relevanta länder. Identifiera tidiga varningssignaler.',
              },
              {
                role: 'Journalister & redaktioner',
                desc: 'Grävanalys med djup datakoppling. Hitta avvikelser och anomalier snabbt. Källdokumentation redo för publicering.',
              },
              {
                role: 'Analytiker & thinktanks',
                desc: 'Bygga scenarier och kausalmodeller. Exportera data och insikter till externa rapporter. API-integration med egna system.',
              },
            ].map(u => (
              <div key={u.role} style={{ borderLeft: '3px solid #1C1C1E', paddingLeft: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E', marginBottom: 8, margin: '0 0 8px' }}>{u.role}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: '#F8F9FA', borderTop: '1px solid #E5E7EB', padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-1px', marginBottom: 12, margin: '0 0 12px' }}>
            Enkel prissättning
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 48, margin: '0 0 48px' }}>
            Börja gratis. Uppgradera när du behöver mer.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'left' }}>
            {[
              {
                tier: 'Gratis',
                price: '0 kr',
                period: '/mån',
                desc: 'För nyfikna och ny-användare.',
                features: ['Globala index (190 länder)', 'Regionöversikt', 'Nyhetsflöden', '3 djupfrågor/dag', 'Grundläggande export'],
                cta: 'Kom igång gratis',
                primary: false,
                href: '/register',
              },
              {
                tier: 'Pro',
                price: '799 kr',
                period: '/mån',
                desc: 'För professionella användare.',
                features: ['Allt i Gratis', 'Obegränsad sökning', 'Kausalmodeller', 'Export PDF/CSV', 'API-åtkomst (1 000 req/dag)', 'Historisk data sedan 1960'],
                cta: 'Starta Pro',
                primary: true,
                href: '/register?plan=pro',
              },
              {
                tier: 'Enterprise',
                price: 'Kontakta oss',
                period: '',
                desc: 'För organisationer och myndigheter.',
                features: ['Allt i Pro', 'Whitelabel-alternativ', 'Anpassad datainsamling', 'Dedikerad support', 'SLA-avtal', 'Obegränsad API-åtkomst'],
                cta: 'Kontakta oss',
                primary: false,
                href: 'mailto:access@dissg.se',
              },
            ].map(p => (
              <div
                key={p.tier}
                style={{
                  border: p.primary ? '2px solid #1C1C1E' : '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: '32px',
                  background: p.primary ? '#1C1C1E' : '#fff',
                  position: 'relative',
                }}
              >
                {p.primary && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#1C1C1E', border: '1px solid #4B5563', color: '#E5E7EB', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    POPULÄRAST
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: p.primary ? '#9CA3AF' : '#6B7280', marginBottom: 8 }}>{p.tier}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: p.primary ? '#fff' : '#1C1C1E', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: p.primary ? '#6B7280' : '#9CA3AF', marginBottom: 8 }}>{p.period}</div>
                <div style={{ fontSize: 13, color: p.primary ? '#9CA3AF' : '#6B7280', marginBottom: 24 }}>{p.desc}</div>
                <div style={{ borderTop: p.primary ? '1px solid #374151' : '1px solid #F3F4F6', marginBottom: 20 }} />
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: p.primary ? '#E5E7EB' : '#374151', marginBottom: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: p.primary ? '#6B7280' : '#9CA3AF', flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
                <a
                  href={p.href}
                  style={{
                    display: 'block',
                    marginTop: 28,
                    padding: '13px 0',
                    textAlign: 'center',
                    background: p.primary ? '#fff' : '#1C1C1E',
                    color: p.primary ? '#1C1C1E' : '#fff',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA bottom */}
      <div style={{ background: '#1C1C1E', padding: '72px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16, margin: '0 0 16px' }}>
          Världen väntar inte.
        </h2>
        <p style={{ fontSize: 18, color: '#9CA3AF', marginBottom: 40, margin: '0 0 40px' }}>
          Kom igång gratis idag. Inga kreditkort krävs.
        </p>
        <a href="/register" style={{ padding: '18px 44px', background: '#fff', color: '#1C1C1E', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>
          Skapa konto →
        </a>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E5E7EB', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FA', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>© 2026 DISSG · Wavult Group FZCO · Dubai, UAE</p>
        <div style={{ display: 'flex', gap: 0 }}>
          <a href="/about" style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'none', marginLeft: 24 }}>Om systemet</a>
          <a href="/methodology" style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'none', marginLeft: 24 }}>Metodik</a>
          <a href="mailto:access@dissg.se" style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'none', marginLeft: 24 }}>Kontakt</a>
          <a href="/privacy" style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'none', marginLeft: 24 }}>Integritetspolicy</a>
        </div>
      </footer>
    </div>
  )
}
