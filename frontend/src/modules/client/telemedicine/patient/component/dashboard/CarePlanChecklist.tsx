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
    <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200/60">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              My Care Plan Checklist
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Doctor-prescribed daily health habits
            </p>
          </div>
        </div>
        <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-semibold text-xs">
          {completedCount} of {tasks.length} ({progressPercent}%)
        </Badge>
      </CardHeader>

      <CardContent className="pt-3 divide-y divide-slate-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="py-3 flex items-start gap-3 cursor-pointer group transition-colors hover:bg-slate-50/60 px-2 rounded-xl"
          >
            <div className="mt-0.5 shrink-0 text-teal-600">
              {task.completed ? (
                <CheckSquare className="h-4 w-4 text-emerald-600" />
              ) : (
                <Square className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
              )}
            </div>
            <div className="space-y-0.5 select-none">
              <p
                className={`text-xs font-semibold ${
                  task.completed ? "text-slate-500 line-through" : "text-slate-900"
                }`}
              >
                {task.label}
              </p>
              <p className="text-[11px] text-slate-500">{task.subtitle}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
