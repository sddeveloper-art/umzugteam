import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AddressResult {
  display_name: string;
  lat: number;
  lng: number;
  type: string;
  address: {
    road: string | null;
    house_number: string | null;
    postcode: string | null;
    city: string | null;
    state: string | null;
    suburb: string | null;
  };
}

export function useAddressSearch() {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("geocode-address", {
          body: { query, limit: 8 },
        });

        if (error) throw error;
        setResults(data?.results || []);
      } catch (err) {
        console.error("Address search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);
  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return { results, isLoading, search, clear };
}
