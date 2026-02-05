/**
 * POST-DECISION VIEW — CALM ZONE
 * 
 * Grey. Nothing can be changed.
 * Only: protocol, context snapshot, scheduled follow-up
 * 
 * "This is over. Now we live with the consequence."
 */

import { cn } from '@/lib/utils';
import type { BoardProtocol, DecisionContextSnapshot, ScheduledReview } from '@/core/board-decision/workflow';

interface PostDecisionViewProps {
  protocol: BoardProtocol;
  contextSnapshot: DecisionContextSnapshot;
  scheduledReview: ScheduledReview;
}

export function PostDecisionView({ protocol, contextSnapshot, scheduledReview }: PostDecisionViewProps) {
  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      {/* Header - signals finality */}
      <header className="mb-8">
        <div className="font-mono text-sm text-muted-foreground mb-2">
          [LÅST] {protocol.protocol_id}
        </div>
        <h1 className="font-mono text-lg text-muted-foreground">
          Beslut fattat {protocol.meeting_date}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Protocol summary */}
        <div className="border bg-background p-4 md:p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            PROTOKOLL
          </h2>
          
          <div className="font-mono text-sm space-y-4">
            <div>
              <div className="text-muted-foreground text-xs mb-1">BESLUT</div>
              {protocol.items.map((item, i) => (
                <div key={i} className="mb-2">
                  <div>{item.title}</div>
                  {item.decision_taken && (
                    <div className="text-muted-foreground">
                      Valt alternativ: {item.decision_taken}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">SIGNERAT AV</div>
              {protocol.signatures.filter(s => s.signed_at).map((sig, i) => (
                <div key={i} className="text-muted-foreground">
                  {sig.role}: {sig.name}
                </div>
              ))}
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">LÅST</div>
              <div className="text-muted-foreground">
                {protocol.locked_at ? new Date(protocol.locked_at).toLocaleString('sv-SE') : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Context snapshot */}
        <div className="border bg-background p-4 md:p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            KONTEXTBILD
          </h2>
          
          <div className="font-mono text-sm space-y-4">
            <div>
              <div className="text-muted-foreground text-xs mb-1">SNAPSHOT ID</div>
              <div className="text-muted-foreground break-all">
                {contextSnapshot.dcs_id}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">DPD CHECKSUM</div>
              <div className="text-muted-foreground break-all text-xs">
                {contextSnapshot.dpd_checksum}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">INDEXVÄRDEN VID BESLUT</div>
              {contextSnapshot.index_versions.map((idx, i) => (
                <div key={i} className="flex justify-between text-muted-foreground">
                  <span className="truncate">{idx.index_id}</span>
                  <span>{idx.value_at_decision.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduled review */}
        <div className="border bg-background p-4 md:p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            UPPFÖLJNING
          </h2>
          
          <div className="font-mono text-sm space-y-4">
            <div>
              <div className="text-muted-foreground text-xs mb-1">SCHEMALAGD</div>
              <div>{scheduledReview.scheduled_date}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">PÅMINNELSER</div>
              {scheduledReview.reminder_dates.map((date, i) => (
                <div key={i} className="text-muted-foreground">{date}</div>
              ))}
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">IRREVERSIBILITET</div>
              <div className={cn(
                "inline-block px-2 py-1 border",
                scheduledReview.irreversibility_level === 'high' && "border-foreground",
                scheduledReview.irreversibility_level === 'permanent' && "bg-foreground text-background"
              )}>
                {scheduledReview.irreversibility_level.toUpperCase()}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">STATUS</div>
              <div className={cn(
                scheduledReview.status === 'pending' && "text-muted-foreground",
                scheduledReview.status === 'completed' && "text-foreground",
                scheduledReview.status === 'overdue' && "font-bold"
              )}>
                {scheduledReview.status === 'pending' && '[VÄNTAR]'}
                {scheduledReview.status === 'completed' && '[KLAR]'}
                {scheduledReview.status === 'overdue' && '[FÖRSENAD]'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <footer className="mt-8 font-mono text-sm text-muted-foreground text-center">
        Detta beslut är låst. Ingen ändring möjlig.
      </footer>
    </div>
  );
}
