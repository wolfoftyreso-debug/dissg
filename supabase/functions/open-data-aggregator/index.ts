import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * OPEN DATA AGGREGATOR
 * 
 * Universal aggregator for open/public data sources.
 * Supports: RSS feeds, REST APIs, public datasets
 * 
 * Categories:
 * - news: News feeds and articles
 * - sports: Live scores, standings, events
 * - weather: Meteorological data (SMHI, OpenWeather)
 * - finance: Stock prices, exchange rates
 * - transport: Traffic, public transport
 * - government: Open government data
 * - social: Social media trends
 */

// Open API endpoints - no keys required
const OPEN_APIS = {
  // Swedish sources
  smhi_weather: 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point',
  svt_rss: 'https://www.svt.se/nyheter/rss.xml',
  sr_rss: 'https://api.sr.se/api/v2/news?format=json',
  riksbank_rates: 'https://swea.riksbank.se/sweaWS/services/SweaWebServiceHttpSoap12Endpoint',
  
  // International open sources
  exchangerate: 'https://api.exchangerate-api.com/v4/latest',
  wikipedia_feed: 'https://en.wikipedia.org/w/api.php',
  
  // Sports (open endpoints)
  football_data: 'https://www.thesportsdb.com/api/v1/json/3', // Free tier
  
  // Government open data
  eu_opendata: 'https://data.europa.eu/api/hub/search',
  scb_api: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
};

interface DataRequest {
  category: 'news' | 'weather' | 'finance' | 'sports' | 'transport' | 'government' | 'social';
  source?: string;
  params?: Record<string, string>;
  geo?: { lat: number; lon: number };
}

async function fetchWeatherData(geo?: { lat: number; lon: number }) {
  // Default to Stockholm if no geo provided
  const lat = geo?.lat || 59.3293;
  const lon = geo?.lon || 18.0686;
  
  const url = `${OPEN_APIS.smhi_weather}/lon/${lon.toFixed(4)}/lat/${lat.toFixed(4)}/data.json`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SMHI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const timeSeries = data.timeSeries || [];
  
  // Transform to standardized format
  return {
    source: 'SMHI',
    source_url: 'https://www.smhi.se',
    license: 'CC BY 4.0',
    updated_at: new Date().toISOString(),
    data: timeSeries.slice(0, 24).map((ts: any) => ({
      timestamp: ts.validTime,
      temperature: ts.parameters?.find((p: any) => p.name === 't')?.values?.[0],
      precipitation: ts.parameters?.find((p: any) => p.name === 'pmean')?.values?.[0],
      wind_speed: ts.parameters?.find((p: any) => p.name === 'ws')?.values?.[0],
    })),
  };
}

async function fetchNewsData(_source?: string) {
  // Sveriges Radio API (JSON)
  const response = await fetch(`${OPEN_APIS.sr_rss}&size=20`);
  
  if (!response.ok) {
    throw new Error(`SR API error: ${response.status}`);
  }
  
  const data = await response.json();
  const articles = data.articles || [];
  
  return {
    source: 'Sveriges Radio',
    source_url: 'https://sverigesradio.se',
    license: 'Public Service',
    updated_at: new Date().toISOString(),
    data: articles.map((article: any) => ({
      title: article.title,
      summary: article.description,
      published_at: article.publicationDateUtc,
      url: article.url,
      category: article.category?.name || 'Allmänt',
    })),
  };
}

async function fetchFinanceData(params?: Record<string, string>) {
  const currency = params?.currency || 'SEK';
  
  const response = await fetch(`${OPEN_APIS.exchangerate}/${currency}`);
  
  if (!response.ok) {
    throw new Error(`Exchange rate API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    source: 'ExchangeRate-API',
    source_url: 'https://www.exchangerate-api.com',
    license: 'Open',
    updated_at: data.time_last_updated ? new Date(data.time_last_updated * 1000).toISOString() : new Date().toISOString(),
    base_currency: data.base,
    data: Object.entries(data.rates || {}).slice(0, 20).map(([code, rate]) => ({
      currency: code,
      rate: rate,
    })),
  };
}

async function fetchSportsData(params?: Record<string, string>) {
  const league = params?.league || '4328'; // English Premier League default
  
  // Get latest events
  const response = await fetch(`${OPEN_APIS.football_data}/eventspastleague.php?id=${league}`);
  
  if (!response.ok) {
    throw new Error(`Sports API error: ${response.status}`);
  }
  
  const data = await response.json();
  const events = data.events || [];
  
  return {
    source: 'TheSportsDB',
    source_url: 'https://www.thesportsdb.com',
    license: 'Open (Free Tier)',
    updated_at: new Date().toISOString(),
    data: events.slice(0, 15).map((event: any) => ({
      id: event.idEvent,
      date: event.dateEvent,
      home_team: event.strHomeTeam,
      away_team: event.strAwayTeam,
      home_score: event.intHomeScore,
      away_score: event.intAwayScore,
      venue: event.strVenue,
      league: event.strLeague,
    })),
  };
}

async function fetchGovernmentData(params?: Record<string, string>) {
  const query = params?.query || 'population';
  
  // EU Open Data Portal
  const response = await fetch(
    `${OPEN_APIS.eu_opendata}/datasets?q=${encodeURIComponent(query)}&limit=10`
  );
  
  if (!response.ok) {
    throw new Error(`EU OpenData API error: ${response.status}`);
  }
  
  const data = await response.json();
  const results = data.result?.results || [];
  
  return {
    source: 'EU Open Data Portal',
    source_url: 'https://data.europa.eu',
    license: 'CC BY 4.0',
    updated_at: new Date().toISOString(),
    data: results.map((dataset: any) => ({
      id: dataset.id,
      title: dataset.title?.en || dataset.title,
      description: dataset.description?.en || dataset.description,
      publisher: dataset.catalog?.publisher?.name,
      modified: dataset.modified,
      formats: dataset.distributions?.map((d: any) => d.format?.label) || [],
    })),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, source, params, geo }: DataRequest = await req.json();
    
    console.log(`[OPEN-DATA] Fetching ${category} data${source ? ` from ${source}` : ''}`);
    
    let result;
    
    switch (category) {
      case 'weather':
        result = await fetchWeatherData(geo);
        break;
      case 'news':
        result = await fetchNewsData(source);
        break;
      case 'finance':
        result = await fetchFinanceData(params);
        break;
      case 'sports':
        result = await fetchSportsData(params);
        break;
      case 'government':
        result = await fetchGovernmentData(params);
        break;
      default:
        throw new Error(`Unsupported category: ${category}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      category,
      ...result,
      meta: {
        fetched_at: new Date().toISOString(),
        data_layer: 'B', // Channel B: Semi-official/aggregated
        is_empirical: false,
        aggregation_type: 'external_open_source',
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[OPEN-DATA] Error:', errorMessage);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      data: null,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
