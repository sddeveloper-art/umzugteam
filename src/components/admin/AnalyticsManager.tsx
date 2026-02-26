import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Loader2, TrendingUp, Users, Megaphone, Euro, Star, Building2, CheckCircle, Clock } from "lucide-react";

interface Stats {
  totalAnnouncements: number;
  activeAnnouncements: number;
  completedAnnouncements: number;
  expiredAnnouncements: number;
  totalBids: number;
  avgBidPrice: number;
  totalRatings: number;
  avgRating: number;
  uniqueCompanies: number;
  totalUsers: number;
  conversionRate: number;
}

interface MonthlyData {
  month: string;
  announcements: number;
  bids: number;
}

interface TopCompany {
  company_name: string;
  bid_count: number;
  avg_price: number;
}

interface CityData {
  city: string;
  count: number;
}

const STATUS_COLORS = ["hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(142, 71%, 45%)"];

const AnalyticsManager = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [topCities, setTopCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all data in parallel
        const [announcementsRes, bidsRes, ratingsRes, usersRes] = await Promise.all([
          supabase.from("moving_announcements").select("id, status, from_city, to_city, created_at"),
          supabase.from("company_bids").select("id, company_name, price, created_at, announcement_id"),
          supabase.from("company_ratings").select("id, rating, company_name"),
          supabase.from("profiles").select("id"),
        ]);

        const announcements = announcementsRes.data || [];
        const bids = bidsRes.data || [];
        const ratings = ratingsRes.data || [];
        const users = usersRes.data || [];

        const active = announcements.filter(a => a.status === "active").length;
        const completed = announcements.filter(a => a.status === "completed").length;
        const expired = announcements.filter(a => a.status === "expired").length;
        const avgPrice = bids.length > 0 ? bids.reduce((sum, b) => sum + Number(b.price), 0) / bids.length : 0;
        const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
        const uniqueCompanies = new Set(bids.map(b => b.company_name)).size;
        const conversionRate = announcements.length > 0 ? (completed / announcements.length) * 100 : 0;

        setStats({
          totalAnnouncements: announcements.length,
          activeAnnouncements: active,
          completedAnnouncements: completed,
          expiredAnnouncements: expired,
          totalBids: bids.length,
          avgBidPrice: Math.round(avgPrice),
          totalRatings: ratings.length,
          avgRating: Math.round(avgRating * 10) / 10,
          uniqueCompanies,
          totalUsers: users.length,
          conversionRate: Math.round(conversionRate),
        });

        // Monthly trends (last 6 months)
        const now = new Date();
        const months: MonthlyData[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const label = d.toLocaleDateString("de-DE", { month: "short", year: "2-digit" });
          const annCount = announcements.filter(a => a.created_at.startsWith(key)).length;
          const bidCount = bids.filter(b => b.created_at.startsWith(key)).length;
          months.push({ month: label, announcements: annCount, bids: bidCount });
        }
        setMonthlyData(months);

        // Top companies by bid count
        const companyMap: Record<string, { count: number; totalPrice: number }> = {};
        bids.forEach(b => {
          if (!companyMap[b.company_name]) companyMap[b.company_name] = { count: 0, totalPrice: 0 };
          companyMap[b.company_name].count++;
          companyMap[b.company_name].totalPrice += Number(b.price);
        });
        const topComp = Object.entries(companyMap)
          .map(([name, data]) => ({ company_name: name, bid_count: data.count, avg_price: Math.round(data.totalPrice / data.count) }))
          .sort((a, b) => b.bid_count - a.bid_count)
          .slice(0, 8);
        setTopCompanies(topComp);

        // Top cities
        const cityMap: Record<string, number> = {};
        announcements.forEach(a => {
          cityMap[a.from_city] = (cityMap[a.from_city] || 0) + 1;
          cityMap[a.to_city] = (cityMap[a.to_city] || 0) + 1;
        });
        const topCit = Object.entries(cityMap)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
        setTopCities(topCit);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!stats) return null;

  const statusData = [
    { name: "Aktiv", value: stats.activeAnnouncements },
    { name: "Abgelaufen", value: stats.expiredAnnouncements },
    { name: "Abgeschlossen", value: stats.completedAnnouncements },
  ].filter(d => d.value > 0);

  const kpis = [
    { label: "Anfragen", value: stats.totalAnnouncements, icon: Megaphone, color: "text-accent" },
    { label: "Aktive", value: stats.activeAnnouncements, icon: Clock, color: "text-green-500" },
    { label: "Angebote", value: stats.totalBids, icon: TrendingUp, color: "text-blue-500" },
    { label: "Ø Preis", value: `${stats.avgBidPrice} €`, icon: Euro, color: "text-yellow-500" },
    { label: "Unternehmen", value: stats.uniqueCompanies, icon: Building2, color: "text-purple-500" },
    { label: "Nutzer", value: stats.totalUsers, icon: Users, color: "text-pink-500" },
    { label: "Konversion", value: `${stats.conversionRate}%`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Ø Bewertung", value: stats.totalRatings > 0 ? `${stats.avgRating} ★` : "–", icon: Star, color: "text-yellow-400" },
  ];

  const chartConfig = {
    announcements: { label: "Anfragen", color: "hsl(var(--accent))" },
    bids: { label: "Angebote", color: "hsl(var(--primary))" },
  };

  const barChartConfig = {
    bid_count: { label: "Angebote", color: "hsl(var(--accent))" },
  };

  const cityChartConfig = {
    count: { label: "Anfragen", color: "hsl(var(--primary))" },
  };

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monatliche Entwicklung</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.some(d => d.announcements > 0 || d.bids > 0) ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="announcements" stroke="var(--color-announcements)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="bids" stroke="var(--color-bids)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">Noch keine Daten vorhanden</p>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status-Verteilung</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ChartContainer config={{}} className="h-[200px] w-[200px] mx-auto">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-2">
                  {statusData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }} />
                      <span className="text-sm text-foreground">{d.name}: <strong>{d.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">Noch keine Anfragen</p>
            )}
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Unternehmen</CardTitle>
          </CardHeader>
          <CardContent>
            {topCompanies.length > 0 ? (
              <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                <BarChart data={topCompanies} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="company_name" tick={{ fontSize: 11 }} width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="bid_count" fill="var(--color-bid_count)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">Noch keine Angebote</p>
            )}
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Beliebteste Städte</CardTitle>
          </CardHeader>
          <CardContent>
            {topCities.length > 0 ? (
              <ChartContainer config={cityChartConfig} className="h-[250px] w-full">
                <BarChart data={topCities} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">Noch keine Daten</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      {topCompanies.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Unternehmens-Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Unternehmen</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Angebote</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Ø Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {topCompanies.map((c) => (
                    <tr key={c.company_name} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3 font-medium text-foreground">{c.company_name}</td>
                      <td className="py-2 px-3 text-right text-foreground">{c.bid_count}</td>
                      <td className="py-2 px-3 text-right text-foreground">{c.avg_price} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsManager;
