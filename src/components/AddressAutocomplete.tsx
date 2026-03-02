import { useState, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAddressSearch, AddressResult } from "@/hooks/useAddressSearch";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

function formatShortAddress(result: AddressResult): string {
  const parts: string[] = [];
  const a = result.address;
  if (a.road) {
    parts.push(a.house_number ? `${a.road} ${a.house_number}` : a.road);
  }
  if (a.postcode && a.city) {
    parts.push(`${a.postcode} ${a.city}`);
  } else if (a.city) {
    parts.push(a.city);
  }
  if (a.state) parts.push(a.state);
  return parts.length > 0 ? parts.join(", ") : result.display_name.split(",").slice(0, 3).join(",");
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Adresse eingeben...",
  className,
}: AddressAutocompleteProps) {
  const { results, isLoading, search, clear } = useAddressSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (val: string) => {
    onChange(val);
    search(val);
    setShowSuggestions(true);
  };

  const handleSelect = (result: AddressResult) => {
    const short = formatShortAddress(result);
    onChange(short);
    onSelect(result);
    setShowSuggestions(false);
    clear();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={className}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {results.map((result, i) => (
            <button
              key={`${result.lat}-${result.lng}-${i}`}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full px-3 py-2.5 text-left hover:bg-accent/10 text-sm flex items-start gap-2 border-b border-border/30 last:border-0"
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">
                  {result.address.city || result.display_name.split(",")[0]}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {formatShortAddress(result)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
