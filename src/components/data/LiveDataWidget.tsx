import { useState, useEffect } from 'react'
import { getWorldBankData, WB_INDICATORS, latestValue, type WorldBankDataPoint } from '../../lib/dataSources'

interface LiveDataWidgetProps {
  countryCode?: string
  showTitle?: boolean
}

export function LiveDataWidget({ countryCode = 'WLD', showTitle = true }: LiveDataWidgetProps) {
  const [data, setData] = useState<Record<string, number | null>>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const results = await Promise.allSettled([
          getWorldBankData(WB_INDICATORS.GDP_PER_CAPITA, countryCode),
          getWorldBankData(WB_INDICATORS.INFLATION, countryCode),
          getWorldBankData(WB_INDICATORS.UNEMPLOYMENT, countryCode),
          getWorldBankData(WB_INDICATORS.LIFE_EXPECTANCY, countryCode),
          getWorldBankData(WB_INDICATORS.INTERNET_USERS, countryCode),
        ])

        if (cancelled) return

        const keys = ['gdp_per_capita', 'inflation', 'unemployment', 'life_expectancy', 'internet_users']
        const mapped: Record<string, number | null> = {}
        let firstDate: string | null = null

        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value.data.length > 0) {
            const val = latestValue(r.value.data)
            mapped[keys[i]] = val
            if (!firstDate) {
              const latest = [...r.value.data]
                .sort((a: WorldBankDataPoint, b: WorldBankDataPoint) => Number(b.date) - Number(a.date))
                .find((d: WorldBankDataPoint) => d.value !== null)
              firstDate = latest?.date ?? null
            }
          } else {
            mapped[keys[i]] = null
          }
        })

        setData(mapped)
        setLastUpdated(firstDate)
      } catch (err) {
        console.error('LiveDataWidget fetch failed:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [countryCode])

  const fmt = (n: number | null, decimals = 1) =>
    n === null ? '—' : n.toLocaleString('sv-SE', { maximumFractionDigits: decimals })
  const fmtUSD = (n: number | null) =>
    n === null ? '—' : `$${(n / 1000).toFixed(0)}k`

  if (loading) {
    return (
      <div style={{ padding: 16, color: '#9CA3AF', fontSize: 12, fontFamily: 'monospace' }}>
        HÄMTAR LIVE-DATA…
      </div>
    )
  }

  return (
    <div style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
      {showTitle && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#003D6B',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 12,
          }}
        >
          LIVE-DATA — WorldBank {lastUpdated ? `(${lastUpdated})` : ''}
          {countryCode !== 'WLD' ? ` — ${countryCode}` : ' — GLOBALT'}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 8,
        }}
      >
        {[
          { label: 'BNP/capita', value: fmtUSD(data.gdp_per_capita), unit: 'USD' },
          { label: 'Inflation', value: fmt(data.inflation), unit: '%' },
          { label: 'Arbetslöshet', value: fmt(data.unemployment), unit: '%' },
          { label: 'Medellivslängd', value: fmt(data.life_expectancy), unit: 'år' },
          { label: 'Internetanv.', value: fmt(data.internet_users), unit: '%' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: '#F4F4F4',
              padding: '8px 12px',
              border: '1px solid #E0E0E0',
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 4,
              }}
            >
              {item.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>{item.value}</div>
            <div style={{ fontSize: 9, color: '#9CA3AF' }}>{item.unit}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
