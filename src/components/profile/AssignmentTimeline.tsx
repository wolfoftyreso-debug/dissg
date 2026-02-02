import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, ArrowRight } from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ASSIGNMENT_TYPES, LANGUAGE_TEMPLATES } from '@/config/publicProfileConfig';

interface Assignment {
  id: string;
  title: string;
  assignmentType: string;
  startDate: string;
  endDate?: string | null;
  responsibilityAreas: string[];
}

interface AssignmentTimelineProps {
  assignments: Assignment[];
  onSelectAssignment?: (id: string) => void;
  selectedId?: string;
  className?: string;
}

export function AssignmentTimeline({
  assignments,
  onSelectAssignment,
  selectedId,
  className = '',
}: AssignmentTimelineProps) {
  const labels = LANGUAGE_TEMPLATES.timeline;
  
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM yyyy', { locale: sv });
  };
  
  const getDuration = (start: string, end?: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const months = differenceInMonths(endDate, startDate);
    
    if (months < 12) {
      return `${months} månader`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} år`;
    }
    return `${years} år, ${remainingMonths} mån`;
  };
  
  const getTypeLabel = (type: string) => {
    return ASSIGNMENT_TYPES[type as keyof typeof ASSIGNMENT_TYPES]?.label || type;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {labels.title}
        </CardTitle>
        <CardDescription>
          Offentliga uppdrag och ansvarsperioder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Assignments */}
          <div className="space-y-6">
            {assignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className={`relative pl-10 cursor-pointer transition-opacity ${
                  selectedId && selectedId !== assignment.id ? 'opacity-50' : ''
                }`}
                onClick={() => onSelectAssignment?.(assignment.id)}
              >
                {/* Timeline dot */}
                <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                  !assignment.endDate 
                    ? 'bg-primary border-primary' 
                    : 'bg-background border-muted-foreground'
                }`} />
                
                {/* Content */}
                <div className={`p-4 rounded-lg border transition-colors ${
                  selectedId === assignment.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getTypeLabel(assignment.assignmentType)}
                      </p>
                    </div>
                    {!assignment.endDate && (
                      <Badge variant="default">Pågående</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(assignment.startDate)}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{assignment.endDate ? formatDate(assignment.endDate) : 'nu'}</span>
                    <span className="text-xs">({getDuration(assignment.startDate, assignment.endDate)})</span>
                  </div>
                  
                  {assignment.responsibilityAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {assignment.responsibilityAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
