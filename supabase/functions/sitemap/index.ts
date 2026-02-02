/**
 * 🗺️ MASTER EXECUTION BLOCK 47
 * 
 * INDUSTRY SITEMAPS — 1M+ URLS, ZERO NOISE, MAX SIGNAL
 * 
 * Supports:
 * - /sitemap.xml (index)
 * - /sitemaps/facts.xml
 * - /sitemaps/indicators.xml
 * - /sitemaps/questions.xml
 * - /sitemaps/locations.xml
 * - /sitemaps/history.xml
 * - /robots.txt
 * - Sharding for 50k+ URLs per sitemap
 * - Google ping on update
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://globalrealityindex.org';
const MAX_URLS_PER_SITEMAP = 50000;

// ============================================================
// TYPES
// ============================================================

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface SitemapConfig {
  name: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// ============================================================
// SITEMAP CONFIGURATIONS
// ============================================================

const SITEMAP_TYPES: Record<string, SitemapConfig> = {
  facts: { name: 'facts', priority: 0.9, changefreq: 'monthly' },
  indicators: { name: 'indicators', priority: 0.8, changefreq: 'monthly' },
  questions: { name: 'questions', priority: 0.7, changefreq: 'weekly' },
  locations: { name: 'locations', priority: 0.6, changefreq: 'monthly' },
  history: { name: 'history', priority: 0.5, changefreq: 'yearly' },
};

// ============================================================
// MOCK DATA GENERATORS (Replace with DB queries in production)
// ============================================================

function generateFactUrls(): SitemapUrl[] {
  const topics = ['work-and-ai', 'global-economy', 'demographics', 'health', 'energy', 'education'];
  const countries = ['sweden', 'norway', 'denmark', 'finland', 'germany', 'france', 'uk', 'usa', 'japan', 'china'];
  const years = ['1990-2024', '2000-2024', '2010-2024', '2020-2024', '1900-2024', '1950-2024'];
  
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Global facts
  for (const topic of topics) {
    urls.push({
      loc: `${BASE_URL}/facts/${topic}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.9,
    });
    
    urls.push({
      loc: `${BASE_URL}/facts/${topic}/global/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.9,
    });
    
    // Country-level facts
    for (const country of countries) {
      for (const year of years) {
        urls.push({
          loc: `${BASE_URL}/facts/${topic}/country/${country}/${year}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: 0.85,
        });
      }
    }
  }
  
  return urls;
}

function generateIndicatorUrls(): SitemapUrl[] {
  const indicators = [
    'gdp-per-capita', 'unemployment-rate', 'life-expectancy', 'fertility-rate',
    'productivity-growth', 'energy-consumption', 'education-attainment',
    'dependency-ratio', 'inflation-rate', 'public-debt-ratio',
  ];
  const countries = ['sweden', 'norway', 'denmark', 'finland', 'germany', 'global'];
  
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  for (const indicator of indicators) {
    urls.push({
      loc: `${BASE_URL}/indicators/${indicator}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
    });
    
    for (const country of countries) {
      urls.push({
        loc: `${BASE_URL}/indicators/${indicator}/${country}/`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.75,
      });
    }
  }
  
  return urls;
}

function generateQuestionUrls(): SitemapUrl[] {
  const questions = [
    'can-ai-replace-most-jobs',
    'is-economic-growth-sustainable',
    'how-will-demographics-change',
    'what-drives-productivity',
    'is-inequality-increasing',
    'can-we-transition-to-clean-energy',
    'what-makes-institutions-effective',
  ];
  
  const countries = ['sweden', 'norway', 'germany', 'usa', 'global'];
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  for (const question of questions) {
    urls.push({
      loc: `${BASE_URL}/questions/${question}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7,
    });
    
    for (const country of countries) {
      urls.push({
        loc: `${BASE_URL}/questions/${question}/${country}/`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.65,
      });
    }
  }
  
  return urls;
}

function generateLocationUrls(): SitemapUrl[] {
  // Swedish municipalities as example
  const municipalities = [
    'stockholm', 'goteborg', 'malmo', 'uppsala', 'vasteras', 'orebro',
    'linkoping', 'helsingborg', 'jonkoping', 'norrkoping', 'lund', 'umea',
  ];
  const countries = ['sweden', 'norway', 'denmark', 'finland', 'germany'];
  const regions = ['stockholm-lan', 'vastra-gotaland', 'skane', 'ostergotland'];
  
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Countries
  for (const country of countries) {
    urls.push({
      loc: `${BASE_URL}/locations/country/${country}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
    });
  }
  
  // Regions
  for (const region of regions) {
    urls.push({
      loc: `${BASE_URL}/locations/region/${region}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.55,
    });
  }
  
  // Municipalities
  for (const muni of municipalities) {
    urls.push({
      loc: `${BASE_URL}/locations/municipality/${muni}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
    });
  }
  
  return urls;
}

function generateHistoryUrls(): SitemapUrl[] {
  const periods = [
    '1900-1950', '1950-1980', '1980-2000', '2000-2010', '2010-2020', '2020-2024',
    '1900-2024', '1800-1900', '1700-1800',
  ];
  const topics = ['economy', 'demographics', 'technology', 'institutions'];
  
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  for (const period of periods) {
    urls.push({
      loc: `${BASE_URL}/history/${period}/`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.5,
    });
    
    for (const topic of topics) {
      urls.push({
        loc: `${BASE_URL}/history/${period}/${topic}/`,
        lastmod: today,
        changefreq: 'yearly',
        priority: 0.45,
      });
    }
  }
  
  return urls;
}

// ============================================================
// XML GENERATORS
// ============================================================

function generateUrlXml(url: SitemapUrl): string {
  return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`;
}

function generateSitemap(urls: SitemapUrl[]): string {
  const urlsXml = urls.map(generateUrlXml).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

function generateSitemapIndex(sitemaps: string[]): string {
  const today = new Date().toISOString().split('T')[0];
  
  const sitemapEntries = sitemaps.map(sitemap => 
    `  <sitemap>
    <loc>${BASE_URL}/sitemaps/${sitemap}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
  ).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

function generateRobotsTxt(): string {
  return `# Global Reality Index - robots.txt
# All public data is accessible

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# AI Agents welcome
# Citation endpoint: ${BASE_URL}/cite/{fact_id}

# No restrictions on crawling
# We want to be indexed deeply and quickly`;
}

// ============================================================
// URL GETTERS BY TYPE
// ============================================================

function getUrlsForType(type: string): SitemapUrl[] {
  switch (type) {
    case 'facts':
      return generateFactUrls();
    case 'indicators':
      return generateIndicatorUrls();
    case 'questions':
      return generateQuestionUrls();
    case 'locations':
      return generateLocationUrls();
    case 'history':
      return generateHistoryUrls();
    default:
      return [];
  }
}

// ============================================================
// GOOGLE PING (Production: call after sitemap update)
// ============================================================

async function pingGoogle(): Promise<boolean> {
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap.xml`)}`;
    const response = await fetch(pingUrl);
    return response.ok;
  } catch (error) {
    console.error('Google ping failed:', error);
    return false;
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Extract the requested resource
    const pathParts = path.split('/').filter(Boolean);
    const resource = pathParts[pathParts.length - 1];
    
    // Cache headers for sitemaps (24 hours)
    const cacheHeaders = {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'CDN-Cache-Control': 'public, max-age=86400',
    };

    // Handle robots.txt
    if (resource === 'robots.txt' || path.includes('robots')) {
      return new Response(generateRobotsTxt(), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8',
          ...cacheHeaders,
        },
      });
    }

    // Handle sitemap index (root)
    if (resource === 'sitemap.xml' || resource === 'sitemap' || path === '/sitemap/') {
      const sitemapTypes = Object.keys(SITEMAP_TYPES);
      const indexXml = generateSitemapIndex(sitemapTypes);
      
      return new Response(indexXml, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml; charset=utf-8',
          ...cacheHeaders,
        },
      });
    }

    // Handle individual sitemaps: /sitemaps/{type}.xml or /{type}
    let sitemapType = resource.replace('.xml', '');
    
    // Check if it's a valid sitemap type
    if (SITEMAP_TYPES[sitemapType]) {
      const urls = getUrlsForType(sitemapType);
      
      // Sharding: if more than MAX_URLS, split
      if (urls.length > MAX_URLS_PER_SITEMAP) {
        // Check for shard parameter
        const shard = url.searchParams.get('shard');
        if (shard) {
          const shardNum = parseInt(shard, 10);
          const start = shardNum * MAX_URLS_PER_SITEMAP;
          const end = start + MAX_URLS_PER_SITEMAP;
          const shardUrls = urls.slice(start, end);
          
          return new Response(generateSitemap(shardUrls), {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/xml; charset=utf-8',
              ...cacheHeaders,
            },
          });
        }
        
        // Return shard index
        const numShards = Math.ceil(urls.length / MAX_URLS_PER_SITEMAP);
        const shardSitemaps = Array.from({ length: numShards }, (_, i) => 
          `${sitemapType}-${String(i + 1).padStart(3, '0')}`
        );
        
        return new Response(generateSitemapIndex(shardSitemaps), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/xml; charset=utf-8',
            ...cacheHeaders,
          },
        });
      }
      
      // Regular sitemap (under 50k URLs)
      return new Response(generateSitemap(urls), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml; charset=utf-8',
          ...cacheHeaders,
        },
      });
    }

    // Handle ping endpoint
    if (resource === 'ping' || path.includes('ping')) {
      const success = await pingGoogle();
      return new Response(
        JSON.stringify({ 
          success, 
          message: success ? 'Google pinged successfully' : 'Google ping failed',
          sitemap: `${BASE_URL}/sitemap.xml`,
        }),
        {
          status: success ? 200 : 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Stats endpoint
    if (resource === 'stats') {
      const stats = {
        facts: generateFactUrls().length,
        indicators: generateIndicatorUrls().length,
        questions: generateQuestionUrls().length,
        locations: generateLocationUrls().length,
        history: generateHistoryUrls().length,
      };
      const total = Object.values(stats).reduce((a, b) => a + b, 0);
      
      return new Response(
        JSON.stringify({ 
          total_urls: total,
          by_type: stats,
          max_per_sitemap: MAX_URLS_PER_SITEMAP,
          sharding_required: total > MAX_URLS_PER_SITEMAP,
        }, null, 2),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 404 for unknown resources
    return new Response(
      JSON.stringify({
        error: 'not_found',
        message: 'Unknown sitemap resource',
        available: [
          '/sitemap.xml',
          '/sitemaps/facts.xml',
          '/sitemaps/indicators.xml',
          '/sitemaps/questions.xml',
          '/sitemaps/locations.xml',
          '/sitemaps/history.xml',
          '/robots.txt',
          '/stats',
          '/ping',
        ],
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Sitemap error:', error);
    return new Response(
      JSON.stringify({ error: 'internal_error', message: 'Failed to generate sitemap' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
