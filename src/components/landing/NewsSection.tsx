/**
 * NEWS SECTION
 * 
 * "Aktuellt från DISSG" - Avanza-inspirerade nyhets-/feature-cards.
 * GLOBALT PERSPEKTIV - jurisdiktionsneutral.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Import images
import newsGlobalData from '@/assets/landing/news-global-data.jpg';
import newsLambdaPro from '@/assets/landing/news-lambda-pro.jpg';
import newsCompare from '@/assets/landing/news-compare.jpg';

interface NewsCard {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  image: string;
  badge?: string;
}

const NEWS_ITEMS: NewsCard[] = [
  {
    id: '1',
    title: 'Koppla din data till 195 länder',
    description: 'Har du befintlig data? Importera dina dataset och se dem i globalt sammanhang. Jämför med länder, regioner och städer världen över.',
    category: 'Guide',
    link: '/data',
    image: newsGlobalData,
    badge: 'GLOBAL → LOKAL',
  },
  {
    id: '2',
    title: 'Djupdyk med Lambda Pro',
    description: 'Tillgång till alla 184 indikatorer, breakdown från global till lokal nivå, och AI-assisterade insikter. För forskare, analytiker och beslutsfattare.',
    category: 'Tjänst',
    link: '/settings',
    image: newsLambdaPro,
    badge: 'ALLA NIVÅER',
  },
  {
    id: '3',
    title: 'Jämför städer och regioner globalt',
    description: 'Jämför valfria städer, regioner eller länder mot varandra – objektivt och transparent. Samma metodologi överallt.',
    category: 'Verktyg',
    link: '/diagnostics',
    image: newsCompare,
    badge: '195 LÄNDER',
  },
];

export const NewsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12">
          Aktuellt från DISSG
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {NEWS_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group block bg-card border rounded-sm overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Card image */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge overlay */}
                {item.badge && (
                  <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground px-2 py-1 text-[10px] font-mono font-medium tracking-wider rounded-sm">
                    {item.badge}
                  </div>
                )}
              </div>
              
              {/* Card content */}
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Läs mer</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Geographic scope info - GLOBAL hierarchy */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Universell hierarki – samma struktur för alla 195 länder
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 bg-muted rounded-sm border">[◉] CIVILISATION</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1.5 bg-muted rounded-sm border">[▣] VÄRLDSDEL</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1.5 bg-muted rounded-sm border">[▢] NATION</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1.5 bg-muted rounded-sm border">[◇] REGION</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1.5 bg-muted rounded-sm border">[□] KOMMUN</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1.5 bg-muted rounded-sm border">[•] STAD</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
