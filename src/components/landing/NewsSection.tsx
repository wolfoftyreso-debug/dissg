/**
 * NEWS SECTION
 * 
 * "Aktuellt från DISSG" - Avanza-inspirerade nyhets-/feature-cards.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface NewsCard {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

const NEWS_ITEMS: NewsCard[] = [
  {
    id: '1',
    title: 'Migrera din befintliga data till DISSG',
    description: 'Har du redan samhällsdata? På 5 minuter kan du importera dina befintliga dataset. Dina insikter fortsätter ackumulera medan du får bättre analysverktyg.',
    category: 'Guide',
    link: '/data',
  },
  {
    id: '2',
    title: 'Få det bästa med Lambda Pro',
    description: 'Tillgång till alla 184 indikatorer, regional breakdown till kommunnivå, och AI-assisterade insikter. Perfekt för forskare och analytiker.',
    category: 'Tjänst',
    link: '/settings',
  },
  {
    id: '3',
    title: 'Kommun eller region? Jämför digitalt',
    description: 'Hos oss kan du jämföra kommuner och regioner mot varandra – objektivt och transparent. Använd samma verktyg som beslutsfattare.',
    category: 'Verktyg',
    link: '/diagnostics',
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
              {/* Card image placeholder */}
              <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                <div className="text-4xl font-mono text-muted-foreground/30">
                  [{item.category.slice(0, 1)}]
                </div>
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
      </div>
    </section>
  );
};

export default NewsSection;
