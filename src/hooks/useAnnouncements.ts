import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Moving item in inventory
export interface MovingItemData {
  name: string;
  quantity: number;
  category: string;
}

// Public announcement data (no PII)
export interface PublicAnnouncement {
  id: string;
  from_city: string;
  to_city: string;
  apartment_size: string;
  volume: number;
  floor: number;
  has_elevator: boolean;
  needs_packing: boolean;
  needs_assembly: boolean;
  preferred_date: string | null;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "completed";
  created_at: string;
  items: MovingItemData[] | null;
}

// Full announcement data (admin only)
export interface MovingAnnouncement extends PublicAnnouncement {
  client_name: string;
  client_email: string;
  client_phone: string | null;
  description: string | null;
  winner_bid_id: string | null;
  notification_sent: boolean;
  updated_at: string;
}

// Public bid summary (no company PII)
export interface BidSummary {
  announcement_id: string;
  bid_count: number;
  lowest_price: number;
  highest_price: number;
}

// Full bid data (admin only)
export interface CompanyBid {
  id: string;
  announcement_id: string;
  company_name: string;
  company_email: string;
  company_phone: string | null;
  price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  client_name: string;
  client_email: string;
  client_phone?: string;
  from_city: string;
  to_city: string;
  apartment_size: string;
  volume?: number;
  floor?: number;
  has_elevator?: boolean;
  needs_packing?: boolean;
  needs_assembly?: boolean;
  preferred_date?: string;
  description?: string;
  end_date: string;
  items?: MovingItemData[];
}

export interface CreateBidData {
  announcement_id: string;
  company_name: string;
  company_email: string;
  company_phone?: string;
  price: number;
  notes?: string;
}

// Hook for public announcements (no PII exposed)
export const usePublicAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements_public")
        .select("*")
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .order("end_date", { ascending: true });

      if (error) throw error;
      return (data as unknown as PublicAnnouncement[]) || [];
    },
    refetchInterval: 30000,
  });
};

// Hook for admin: full announcements with PII (requires admin role)
export const useAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moving_announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as unknown as MovingAnnouncement[]) || [];
    },
  });
};

// Legacy hook - now uses public view
export const useActiveAnnouncements = () => {
  return usePublicAnnouncements();
};

// Hook for public bid summaries (no company PII)
export const useBidSummary = (announcementId: string) => {
  return useQuery({
    queryKey: ["bids", "summary", announcementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bids_summary")
        .select("*")
        .eq("announcement_id", announcementId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as BidSummary | null;
    },
    enabled: !!announcementId,
  });
};

// Hook for admin: full bids with company PII (requires admin role)
export const useAnnouncementBids = (announcementId: string) => {
  return useQuery({
    queryKey: ["bids", announcementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_bids")
        .select("*")
        .eq("announcement_id", announcementId)
        .order("price", { ascending: true });

      if (error) throw error;
      return data as CompanyBid[];
    },
    enabled: !!announcementId,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateAnnouncementData) => {
      const insertData: Record<string, unknown> = { ...data };
      
      // Attach user_id if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) insertData.user_id = user.id;
      
      const { data: result, error } = await supabase
        .from("moving_announcements")
        .insert([insertData as any])
        .select()
        .single();

      if (error) throw error;
      return result as unknown as MovingAnnouncement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Anfrage erstellt!",
        description: "Ihre Umzugsanfrage wurde erfolgreich veröffentlicht.",
      });
    },
    onError: (error) => {
      console.error("Error creating announcement:", error);
      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateBid = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBidData) => {
      const { data: result, error } = await supabase
        .from("company_bids")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result as CompanyBid;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bids", variables.announcement_id] });
      queryClient.invalidateQueries({ queryKey: ["bids", "summary", variables.announcement_id] });
      toast({
        title: "Angebot abgegeben!",
        description: "Ihr Preisangebot wurde erfolgreich eingereicht.",
      });
    },
    onError: (error) => {
      console.error("Error creating bid:", error);
      toast({
        title: "Fehler",
        description: "Das Angebot konnte nicht abgegeben werden.",
        variant: "destructive",
      });
    },
  });
};

export const formatTimeRemaining = (endDate: string): string => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Abgelaufen";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}T ${hours}Std`;
  if (hours > 0) return `${hours}Std ${minutes}Min`;
  return `${minutes}Min`;
};
