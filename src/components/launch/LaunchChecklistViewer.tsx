/**
 * Launch Checklist Viewer
 * 
 * 30-day launch progress visualization.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ALL_WEEKS,
  ALL_TASKS,
  GO_LIVE_CRITERIA,
  POST_LAUNCH_RULES,
  DAY_30_STATUS,
  LAUNCH_SUMMARY,
  calculateLaunchStatus,
  getWeekProgress,
  type TaskStatus,
} from '@/core/launch';

export function LaunchChecklistViewer() {
  // Simulated task statuses (in production, this would come from state management)
  const [taskStatuses] = useState<Record<string, TaskStatus>>(() => {
    const statuses: Record<string, TaskStatus> = {};
    ALL_TASKS.forEach(t => {
      statuses[t.id] = 'pending';
    });
    return statuses;
  });

  const launchStatus = calculateLaunchStatus(taskStatuses);

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">
                30-DAY LAUNCH CHECKLIST
              </CardTitle>
              <CardDescription className="font-mono mt-1">
                Decision Legitimacy System — production go-live
              </CardDescription>
            </div>
            <Badge variant={launchStatus.ready_for_go_live ? 'default' : 'outline'}>
              Day {launchStatus.current_day}/30
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span>{launchStatus.tasks_completed}/{launchStatus.tasks_total} tasks</span>
            </div>
            <Progress 
              value={(launchStatus.tasks_completed / launchStatus.tasks_total) * 100} 
              className="h-2"
            />
            {launchStatus.blockers.length > 0 && (
              <div className="text-xs text-destructive">
                Blockers: {launchStatus.blockers.join(', ')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="week-1" className="w-full">
        <TabsList className="grid w-full grid-cols-5 font-mono text-xs">
          <TabsTrigger value="week-1">Week 1</TabsTrigger>
          <TabsTrigger value="week-2">Week 2</TabsTrigger>
          <TabsTrigger value="week-3">Week 3</TabsTrigger>
          <TabsTrigger value="week-4">Week 4</TabsTrigger>
          <TabsTrigger value="go-live">Go-Live</TabsTrigger>
        </TabsList>

        {ALL_WEEKS.map((week) => {
          const progress = getWeekProgress(week.week, taskStatuses);
          
          return (
            <TabsContent key={week.week} value={`week-${week.week}`} className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-mono text-base">
                        WEEK {week.week}: {week.title}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs mt-1">
                        Goal: {week.goal}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{progress.percentage}%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progress.percentage} className="h-1 mb-4" />
                  
                  {week.days.map((day) => (
                    <div key={day.day} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-muted-foreground">
                          DAY {day.day_range || day.day}
                        </span>
                        <span className="text-sm">{day.focus}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {day.tasks.map((task) => (
                          <div 
                            key={task.id}
                            className="flex items-start gap-2 py-2 border-b border-border last:border-0"
                          >
                            <span className={`text-xs ${
                              taskStatuses[task.id] === 'completed' ? 'text-primary' :
                              taskStatuses[task.id] === 'blocked' ? 'text-destructive' :
                              'text-muted-foreground'
                            }`}>
                              {taskStatuses[task.id] === 'completed' ? '[✓]' :
                               taskStatuses[task.id] === 'blocked' ? '[×]' :
                               taskStatuses[task.id] === 'in_progress' ? '[→]' : '[ ]'}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{task.id}</span>
                                <span className="text-sm">{task.description}</span>
                                {task.critical && (
                                  <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                    CRITICAL
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                ✓ {task.verification}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <span className="text-muted-foreground">Exit Criteria: </span>
                    <span className="italic">{week.exit_criteria}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}

        {/* Go-Live Tab */}
        <TabsContent value="go-live" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">GO-LIVE CRITERIA</CardTitle>
            </CardHeader>
            <CardContent>
              {GO_LIVE_CRITERIA.map((criteria) => (
                <div key={criteria.id} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground text-xs">[W{criteria.week}]</span>
                  <span className="text-sm flex-1">{criteria.description}</span>
                </div>
              ))}
              <Separator className="my-4" />
              <p className="text-center text-sm italic">
                "{LAUNCH_SUMMARY.final_criterion}"
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">AFTER DAY 30</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-destructive mb-2 uppercase">Do NOT:</p>
                  {POST_LAUNCH_RULES.do_not.map((rule, i) => (
                    <p key={i} className="text-sm text-muted-foreground">[×] {rule}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-primary mb-2 uppercase">DO:</p>
                  {POST_LAUNCH_RULES.do.map((rule, i) => (
                    <p key={i} className="text-sm">[→] {rule}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">DAY 30 STATUS</CardTitle>
              <CardDescription className="font-mono">
                {DAY_30_STATUS.not_a_product ? 'Not a product.' : ''} {DAY_30_STATUS.what_it_is}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {DAY_30_STATUS.achieved.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-primary">[✓]</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
