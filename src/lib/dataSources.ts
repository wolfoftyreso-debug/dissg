// Real data sources for DISSG
// All free, no API key required initially

// ─────────────────────────────────────────────────────────────
// World Bank API — economic indicators
// ─────────────────────────────────────────────────────────────

export async function getWorldBankData(indicator: string, country: string = 'all') {
  const res = await fetch(
    `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&mrv=5&per_page=100`,
  )
  if (!res.ok) throw new Error(`World Bank API: ${res.status}`)
  const [meta, data] = await res.json()
  return { meta, data: (data as WorldBankDataPoint[]) || [] }
}

export interface WorldBankDataPoint {
  indicator: { id: string; value: string }
  country: { id: string; value: string }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

export const WB_INDICATORS = {
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',
  INFLATION: 'FP.CPI.TOTL.ZG',
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',
  LIFE_EXPECTANCY: 'SP.DYN.LE00.IN',
  INTERNET_USERS: 'IT.NET.USER.ZS',
  CO2_EMISSIONS: 'EN.ATM.CO2E.PC',
  LITERACY_RATE: 'SE.ADT.LITR.ZS',
  POPULATION: 'SP.POP.TOTL',
  POVERTY_HEADCOUNT: 'SI.POV.DDAY',
  GOVERNMENT_DEBT: 'GC.DOD.TOTL.GD.ZS',
  GINI_INDEX: 'SI.POV.GINI',
  TRADE_GDP: 'NE.TRD.GNFS.ZS',
  MILITARY_EXPENDITURE: 'MS.MIL.XPND.GD.ZS',
  EDUCATION_EXPENDITURE: 'SE.XPD.TOTL.GD.ZS',
  HEALTH_EXPENDITURE: 'SH.XPD.CHEX.GD.ZS',
} as const

// Fetch multiple indicators for a country
export async function getCountryIndicators(
  countryCode: string,
  indicators: string[],
): Promise<Record<string, WorldBankDataPoint[]>> {
  const results = await Promise.allSettled(
    indicators.map((ind) => getWorldBankData(ind, countryCode)),
  )
  const out: Record<string, WorldBankDataPoint[]> = {}
  indicators.forEach((ind, i) => {
    const r = results[i]
    if (r.status === 'fulfilled') {
      out[ind] = r.value.data
    } else {
      out[ind] = []
    }
  })
  return out
}

// ─────────────────────────────────────────────────────────────
// REST Countries API — country metadata
// ─────────────────────────────────────────────────────────────

export interface RestCountry {
  name: { common: string; official: string }
  cca2: string
  cca3: string
  population: number
  region: string
  subregion: string
  flags: { png: string; svg: string; alt?: string }
  capital?: string[]
  latlng?: [number, number]
  area?: number
  currencies?: Record<string, { name: string; symbol: string }>
  languages?: Record<string, string>
}

export async function getCountryData(): Promise<RestCountry[]>
export async function getCountryData(countryCode: string): Promise<RestCountry>
export async function getCountryData(countryCode?: string): Promise<RestCountry | RestCountry[]> {
  const url = countryCode
    ? `https://restcountries.com/v3.1/alpha/${countryCode}`
    : `https://restcountries.com/v3.1/all?fields=name,cca2,cca3,population,region,subregion,flags,capital,latlng,area,currencies,languages`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Countries API: ${res.status}`)
  const data = await res.json()
  if (countryCode) {
    return Array.isArray(data) ? data[0] : data
  }
  return data as RestCountry[]
}

// ─────────────────────────────────────────────────────────────
// UN Comtrade — trade data (public, no key)
// ─────────────────────────────────────────────────────────────

export async function getTradeData(
  reporterCode: string,
  year: number = 2023,
): Promise<unknown | null> {
  try {
    const res = await fetch(
      `https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=${reporterCode}&period=${year}&cmdCode=TOTAL&flowCode=X,M&maxRecords=20`,
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// Open-Meteo — climate data (free, no key)
// ─────────────────────────────────────────────────────────────

export interface ClimateData {
  latitude: number
  longitude: number
  timezone: string
  daily: {
    time: string[]
    temperature_2m_max: number[]
    precipitation_sum: number[]
  }
}

export async function getClimateData(lat: number, lon: number): Promise<ClimateData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&forecast_days=7`,
  )
  if (!res.ok) throw new Error(`Climate API: ${res.status}`)
  return res.json()
}

// Historical climate averages
export async function getHistoricalClimate(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
): Promise<ClimateData> {
  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,precipitation_sum`,
  )
  if (!res.ok) throw new Error(`Climate archive API: ${res.status}`)
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// News — requires backend CORS proxy, return empty for now
// ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getNewsForCountry(_query: string): Promise<never[]> {
  // Real RSS parsing requires backend proxy — return empty
  return []
}

// ─────────────────────────────────────────────────────────────
// Utility: latest non-null value from WB data series
// ─────────────────────────────────────────────────────────────

export function latestValue(data: WorldBankDataPoint[]): number | null {
  const sorted = [...data].sort((a, b) => Number(b.date) - Number(a.date))
  return sorted.find((d) => d.value !== null)?.value ?? null
}
