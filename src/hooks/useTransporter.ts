import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type TransportCategory =
  | "demenagement" | "meubles" | "voitures" | "motos" | "palettes"
  | "colis" | "fret" | "animaux" | "autres_vehicules" | "autres";

export const CATEGORY_LABELS: Record<TransportCategory, { de: string; icon: string }> = {
  demenagement: { de: "Umzüge", icon: "🏠" },
  meubles: { de: "Möbel", icon: "🛋️" },
  voitures: { de: "Autos", icon: "🚗" },
  motos: { de: "Motorräder", icon: "🏍️" },
  palettes: { de: "Paletten", icon: "📦" },
  colis: { de: "Pakete", icon: "📮" },
  fret: { de: "Fracht", icon: "🚛" },
  animaux: { de: "Tiere", icon: "🐾" },
  autres_vehicules: { de: "Andere Fahrzeuge", icon: "🚜" },
  autres: { de: "Sonstiges", icon: "📋" },
};

export interface TransporterProfile {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string;
  description: string | null;
  logo_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  categories: TransportCategory[];
  completed_deliveries: number;
  created_at: string;
  updated_at: string;
}

export interface PublicTransporter {
  id: string;
  company_name: string;
  contact_name: string;
  city: string | null;
  country: string;
  description: string | null;
  logo_url: string | null;
  is_verified: boolean;
  categories: TransportCategory[];
  completed_deliveries: number;
  created_at: string;
  avg_rating: number;
  total_ratings: number;
}

export const useMyTransporterProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transporter", "me", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("transporters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as TransporterProfile | null;
    },
    enabled: !!user,
  });
};

export const usePublicTransporters = () => {
  return useQuery({
    queryKey: ["transporters", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transporters_public")
        .select("*")
        .order("completed_deliveries", { ascending: false });
      if (error) throw error;
      return (data as unknown as PublicTransporter[]) || [];
    },
  });
};

export const useTransporterById = (id: string) => {
  return useQuery({
    queryKey: ["transporter", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transporters_public")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as unknown as PublicTransporter;
    },
    enabled: !!id,
  });
};

export const useCreateTransporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      company_name: string;
      contact_name: string;
      email: string;
      phone?: string;
      city?: string;
      description?: string;
      categories: TransportCategory[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Assign transporter role
      await supabase.from("user_roles").insert({ user_id: user.id, role: "transporter" as any });

      const { data: result, error } = await supabase
        .from("transporters")
        .insert([{ ...data, user_id: user.id }] as any)
        .select()
        .single();
      if (error) throw error;
      return result as unknown as TransporterProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transporter"] });
      queryClient.invalidateQueries({ queryKey: ["transporters"] });
    },
  });
};

export const useUpdateTransporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<TransporterProfile> & { id: string }) => {
      const { id, ...updates } = data;
      const { error } = await supabase
        .from("transporters")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transporter"] });
      queryClient.invalidateQueries({ queryKey: ["transporters"] });
    },
  });
};

// Transporter's own bids
export const useMyBids = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transporter", "bids", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get transporter profile
      const { data: transporter } = await supabase
        .from("transporters")
        .select("id, company_email:email")
        .eq("user_id", user.id)
        .single();
      if (!transporter) return [];

      const { data, error } = await supabase
        .from("company_bids")
        .select("*")
        .eq("transporter_id", transporter.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
