"use client";

import { useState } from "react";
import { CheckSquare, Square, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CareTask {
  id: string;
  label: string;
  subtitle: string;
  completed: boolean;
}

const DEFAULT_TASKS: CareTask[] = [
  {
    id: "t1",
    label: "Morning Vitals Check",
    subtitle: "Record systolic and diastolic BP upon waking",
    completed: true,
  },
  {
    id: "t2",
    label: "30-min Low-Impact Walk",
    subtitle: "Keep heart rate in aerobic zone (105-120 bpm)",
    completed: true,
  },
  {
    id: "t3",
    label: "Dietary Sodium Restriction",
    subtitle: "Limit daily sodium to under 2,000 mg",
    completed: false,
  },
  {
    id: "t4",
    label: "Evening Glucose Check",
    subtitle: "Test 2 hours post-dinner",
    completed: false,
  },
];

export function CarePlanChecklist() {
  const [tasks, setTasks] = useState<CareTask[]>(DEFAULT_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <Card className="dash-card border border-border/80 bg-card rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-2xs">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="dash-section-title text-foreground">
              My Care Plan Checklist
            </CardTitle>
            <p className="dash-caption text-xs text-muted-foreground mt-0.5">
              Doctor-prescribed daily health habits
            </p>
          </div>
        </div>
        <Badge className="bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20 font-semibold text-xs px-2.5 py-0.5 rounded-full">
          {completedCount} of {tasks.length} ({progressPercent}%)
        </Badge>
      </CardHeader>

      <CardContent className="pt-3 pb-3 divide-y divide-border/60">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="py-3 flex items-start gap-3 cursor-pointer group transition-all duration-150 hover:bg-muted/50 px-3 rounded-xl active:scale-[0.99]"
          >
            <div className="mt-0.5 shrink-0 text-teal-600 transition-transform duration-150 group-hover:scale-110">
              {task.completed ? (
                <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
              )}
            </div>
            <div className="space-y-0.5 select-none flex-1">
              <p
                className={`text-xs sm:text-sm font-semibold transition-colors ${
                  task.completed ? "text-muted-foreground line-through opacity-75" : "text-foreground"
                }`}
              >
                {task.label}
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">{task.subtitle}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
