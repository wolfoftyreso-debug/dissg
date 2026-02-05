/**
 * CHARTER DISPLAY
 * 
 * Public display of the Decision Legitimacy Charter.
 * Read-only. No interpretation. No negotiation.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CHARTER_ARTICLES, 
  DECISION_LEGITIMACY_CHARTER,
  getCharterHash 
} from '@/core/charter';

export function CharterDisplay() {
  const hash = getCharterHash();
  
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-mono">
              DECISION LEGITIMACY CHARTER
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              v{DECISION_LEGITIMACY_CHARTER.version.version} | Public. Short. Non-negotiable.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {hash}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {CHARTER_ARTICLES.map((article, index) => (
              <div key={article.number}>
                {index > 0 && <Separator className="mb-6" />}
                
                <div className="space-y-3">
                  <h3 className="font-mono font-bold text-lg">
                    {article.number}. {article.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed">
                    {article.content}
                  </p>
                  
                  {article.subsections && (
                    <div className="pl-4 space-y-1">
                      {article.subsections.map((sub, i) => (
                        <p 
                          key={i} 
                          className={`text-sm ${
                            sub.startsWith('•') || sub.match(/^\d\./)
                              ? 'text-muted-foreground'
                              : 'italic text-muted-foreground/80'
                          }`}
                        >
                          {sub}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    {article.is_absolute && (
                      <Badge variant="destructive" className="text-xs">
                        ABSOLUTE
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {article.enforcement_type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center font-mono">
            This document is immutable. No oral tradition may supersede it.
          </p>
          <p className="text-xs text-center mt-2 font-medium">
            The system does not exist to make decisions easier.
            It exists to make reality unavoidable.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
