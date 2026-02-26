import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AvailabilityRow = {
  id: string;
  date: string;
  slots_total: number;
  slots_booked: number;
  is_blocked: boolean;
};

const AvailabilityCalendar = () => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const { data: availability = [] } = useQuery({
    queryKey: ["availability", format(monthStart, "yyyy-MM")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .gte("date", format(monthStart, "yyyy-MM-dd"))
        .lte("date", format(monthEnd, "yyyy-MM-dd"));
      if (error) throw error;
      return data as AvailabilityRow[];
    },
  });

  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilityRow>();
    availability.forEach((a) => map.set(a.date, a));
    return map;
  }, [availability]);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0=Sun
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Mon=0

  const getStatus = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return "past";
    const key = format(date, "yyyy-MM-dd");
    const entry = availabilityMap.get(key);
    if (!entry) return "available"; // no entry = open
    if (entry.is_blocked) return "blocked";
    const remaining = entry.slots_total - entry.slots_booked;
    if (remaining <= 0) return "full";
    if (remaining <= 1) return "limited";
    return "available";
  };

  const statusConfig = {
    available: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-200", border: "border-emerald-300 dark:border-emerald-700", icon: CheckCircle, label: "Verfügbar" },
    limited: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-200", border: "border-amber-300 dark:border-amber-700", icon: Clock, label: "Begrenzt" },
    full: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-800 dark:text-red-200", border: "border-red-300 dark:border-red-700", icon: XCircle, label: "Ausgebucht" },
    blocked: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", icon: XCircle, label: "Gesperrt" },
    past: { bg: "bg-muted/50", text: "text-muted-foreground/50", border: "border-transparent", icon: null, label: "" },
  };

  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-bold text-foreground capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: de })}
        </h3>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {d}
          </div>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const status = getStatus(day);
          const config = statusConfig[status];
          const key = format(day, "yyyy-MM-dd");
          const entry = availabilityMap.get(key);
          const remaining = entry ? entry.slots_total - entry.slots_booked : null;

          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "relative rounded-lg border p-2 min-h-[60px] md:min-h-[72px] transition-all cursor-default",
                    config.bg,
                    config.border,
                    isToday(day) && "ring-2 ring-primary ring-offset-1"
                  )}
                >
                  <span className={cn("text-sm font-medium", config.text)}>
                    {format(day, "d")}
                  </span>
                  {status !== "past" && config.icon && (
                    <config.icon className={cn("absolute bottom-1.5 right-1.5 h-3.5 w-3.5", config.text)} />
                  )}
                  {status === "limited" && remaining !== null && (
                    <span className={cn("absolute top-1 right-1.5 text-[10px] font-bold", config.text)}>
                      {remaining}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              {status !== "past" && (
                <TooltipContent>
                  <p className="font-medium">{format(day, "EEEE, d. MMMM", { locale: de })}</p>
                  <p className="text-xs">{config.label}{remaining !== null && status !== "blocked" ? ` — ${remaining} Plätze frei` : ""}</p>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        {(["available", "limited", "full", "blocked"] as const).map((s) => {
          const c = statusConfig[s];
          return (
            <div key={s} className="flex items-center gap-1.5 text-xs">
              <div className={cn("w-3.5 h-3.5 rounded border", c.bg, c.border)} />
              <span className="text-muted-foreground">{c.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>Tage ohne Eintrag gelten als verfügbar. Kontaktieren Sie uns für eine verbindliche Buchung.</p>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
