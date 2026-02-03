/**
 * STRIM SITEMAP GENERATOR
 * 
 * Generates sitemaps per entity type for optimal Google crawling.
 * 
 * Endpoints:
 * - /sitemap.xml (index)
 * - /sitemap-substances.xml
 * - /sitemap-diagnoses.xml
 * - /sitemap-treatments.xml
 * - /sitemap-legal.xml
 * - /sitemap-statistics.xml
 * - /sitemap-terms.xml
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIM_BASE_URL = 'https://strim.se';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600',
};

const ENTITY_CONFIG = [
  { type: 'substances', table: 'strim_substances', path: 'substans', priority: '0.9' },
  { type: 'diagnoses', table: 'strim_diagnoses', path: 'diagnos', priority: '0.9' },
  { type: 'treatments', table: 'strim_treatments', path: 'behandling', priority: '0.8' },
  { type: 'legal', table: 'strim_legal', path: 'lag', priority: '0.7' },
  { type: 'statistics', table: 'strim_statistics', path: 'statistik', priority: '0.8' },
  { type: 'terms', table: 'strim_terms', path: 'begrepp', priority: '0.7' },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const requestedFile = pathParts[1] || 'sitemap.xml';

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sitemap index
    if (requestedFile === 'sitemap.xml') {
      const sitemapIndex = generateSitemapIndex();
      return new Response(sitemapIndex, {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    }

    // Entity-specific sitemap
    const match = requestedFile.match(/^sitemap-(\w+)\.xml$/);
    if (match) {
      const entityType = match[1];
      const config = ENTITY_CONFIG.find(c => c.type === entityType);
      
      if (!config) {
        return new Response('Not found', { status: 404 });
      }

      const { data: entities } = await supabase
        .from(config.table)
        .select('canonical_slug, updated_at')
        .eq('status', 'active')
        .order('canonical_slug');

      const sitemap = generateEntitySitemap(entities || [], config);
      return new Response(sitemap, {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    console.error('Sitemap error:', error);
    return new Response('Internal error', { status: 500 });
  }
});

function generateSitemapIndex(): string {
  const lastmod = new Date().toISOString().split('T')[0];
  
  const sitemaps = ENTITY_CONFIG.map(config => `
  <sitemap>
    <loc>${STRIM_BASE_URL}/sitemap-${config.type}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

function generateEntitySitemap(
  entities: Array<{ canonical_slug: string; updated_at: string }>,
  config: typeof ENTITY_CONFIG[0]
): string {
  const urls = entities.map(entity => {
    const lastmod = new Date(entity.updated_at).toISOString().split('T')[0];
    return `
  <url>
    <loc>${STRIM_BASE_URL}/data/${config.path}/${entity.canonical_slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
