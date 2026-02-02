/**
 * Question-Based Navigation
 * 
 * Wrong: "Economy", "Health", "Education"
 * Right: "How is life expectancy developing?"
 * 
 * Domains are metadata – questions are the interface.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface QuestionItem {
  id: string;
  question: string;
  questionSv: string;
  domain: string;          // Metadata, not primary
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  url: string;
}

interface QuestionNavigationProps {
  questions: QuestionItem[];
  className?: string;
}

const TREND_ICONS = {
  up: <TrendingUp className="h-4 w-4 text-green-500" />,
  down: <TrendingDown className="h-4 w-4 text-red-500" />,
  stable: <Minus className="h-4 w-4 text-muted-foreground" />,
};

/**
 * Main question navigation component
 */
export function QuestionNavigation({ questions, className }: QuestionNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupByDomain, setGroupByDomain] = useState(false);
  
  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.questionSv.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group by domain if needed
  const grouped = groupByDomain
    ? filteredQuestions.reduce((acc, q) => {
        if (!acc[q.domain]) acc[q.domain] = [];
        acc[q.domain].push(q);
        return acc;
      }, {} as Record<string, QuestionItem[]>)
    : { all: filteredQuestions };
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sök frågor..."
          className="pl-10"
        />
      </div>
      
      {/* Toggle grouping */}
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => setGroupByDomain(false)}
          className={cn(
            'px-3 py-1 rounded',
            !groupByDomain ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          )}
        >
          Alla frågor
        </button>
        <button
          onClick={() => setGroupByDomain(true)}
          className={cn(
            'px-3 py-1 rounded',
            groupByDomain ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          )}
        >
          Gruppera efter område
        </button>
      </div>
      
      {/* Questions list */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([domain, items]) => (
          <div key={domain} className="space-y-2">
            {groupByDomain && domain !== 'all' && (
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {domain}
              </h3>
            )}
            
            <div className="space-y-1">
              {items.map((q) => (
                <QuestionLink key={q.id} question={q} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {filteredQuestions.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Inga frågor matchar din sökning
        </p>
      )}
    </div>
  );
}

/**
 * Single question link with trend indicator
 */
function QuestionLink({ question }: { question: QuestionItem }) {
  return (
    <Link
      to={question.url}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        'hover:bg-muted transition-colors group'
      )}
    >
      {/* Trend indicator */}
      <div className="shrink-0">
        {TREND_ICONS[question.trend]}
      </div>
      
      {/* Question text */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate group-hover:text-primary transition-colors">
          {question.questionSv}
        </p>
        <p className="text-xs text-muted-foreground">
          Senast: {question.lastUpdate}
        </p>
      </div>
      
      {/* Domain tag */}
      <span className="shrink-0 text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
        {question.domain}
      </span>
      
      {/* Arrow */}
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
    </Link>
  );
}

/**
 * Demo data
 */
export function QuestionNavigationDemo() {
  const demoQuestions: QuestionItem[] = [
    {
      id: '1',
      question: 'How is life expectancy developing?',
      questionSv: 'Hur utvecklas livslängden?',
      domain: 'Hälsa',
      trend: 'up',
      lastUpdate: '2024-01',
      url: '/questions/life-expectancy',
    },
    {
      id: '2',
      question: 'How is the dependency ratio changing?',
      questionSv: 'Hur förändras försörjningsbördan?',
      domain: 'Demografi',
      trend: 'up',
      lastUpdate: '2024-01',
      url: '/questions/dependency-ratio',
    },
    {
      id: '3',
      question: 'How is energy dependence changing?',
      questionSv: 'Hur förändras energiberoendet?',
      domain: 'Energi',
      trend: 'down',
      lastUpdate: '2024-01',
      url: '/questions/energy-dependence',
    },
    {
      id: '4',
      question: 'How is employment structure changing?',
      questionSv: 'Hur förändras sysselsättningsstrukturen?',
      domain: 'Ekonomi',
      trend: 'stable',
      lastUpdate: '2024-01',
      url: '/questions/employment-structure',
    },
    {
      id: '5',
      question: 'How is educational attainment developing?',
      questionSv: 'Hur utvecklas utbildningsnivån?',
      domain: 'Utbildning',
      trend: 'up',
      lastUpdate: '2024-01',
      url: '/questions/educational-attainment',
    },
  ];
  
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">Vad vill du förstå?</h2>
      <QuestionNavigation questions={demoQuestions} />
    </div>
  );
}
