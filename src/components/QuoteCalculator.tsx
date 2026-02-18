import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, MapPin, Home, Truck, Package, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCompetitors, calculateCompetitorPrices } from "@/hooks/useCompetitors";
import PriceComparisonBadge from "@/components/PriceComparisonBadge";
import { useI18n } from "@/hooks/useI18n";

interface FormData {
  fromCity: string;
  toCity: string;
  apartmentSize: string;
  floor: string;
  hasElevator: boolean;
  packingService: boolean;
  furnitureAssembly: boolean;
  fragilePackaging: boolean;
  premiumInsurance: boolean;
  expressService: boolean;
  weekendService: boolean;
  cleaningService: boolean;
  storageService: boolean;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  notes: string;
}

const apartmentSizes = [
  { value: "studio", labelKey: "Studio / 1 Zimmer", volume: 15, basePrice: 299 },
  { value: "2rooms", labelKey: "2 Zimmer (ca. 50m²)", volume: 25, basePrice: 449 },
  { value: "3rooms", labelKey: "3 Zimmer (ca. 75m²)", volume: 35, basePrice: 599 },
  { value: "4rooms", labelKey: "4 Zimmer (ca. 100m²)", volume: 50, basePrice: 799 },
  { value: "5rooms", labelKey: "5+ Zimmer (ca. 120m²+)", volume: 70, basePrice: 999 },
  { value: "house", labelKey: "Einfamilienhaus", volume: 100, basePrice: 1499 },
];

const germanCities = [
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Hamburg", lat: 53.5511, lng: 9.9937 },
  { name: "München", lat: 48.1351, lng: 11.582 },
  { name: "Köln", lat: 50.9375, lng: 6.9603 },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
  { name: "Düsseldorf", lat: 51.2277, lng: 6.7735 },
  { name: "Leipzig", lat: 51.3397, lng: 12.3731 },
  { name: "Dortmund", lat: 51.5136, lng: 7.4653 },
  { name: "Essen", lat: 51.4556, lng: 7.0116 },
  { name: "Bremen", lat: 53.0793, lng: 8.8017 },
  { name: "Dresden", lat: 51.0504, lng: 13.7373 },
  { name: "Hannover", lat: 52.3759, lng: 9.732 },
  { name: "Nürnberg", lat: 49.4521, lng: 11.0767 },
  { name: "Potsdam", lat: 52.3906, lng: 13.0645 },
];

const calculateDistance = (from: string, to: string): number => {
  const fromCity = germanCities.find(c => c.name.toLowerCase() === from.toLowerCase());
  const toCity = germanCities.find(c => c.name.toLowerCase() === to.toLowerCase());
  
  if (!fromCity || !toCity) return 50; // Default distance
  
  const R = 6371; // Earth's radius in km
  const dLat = (toCity.lat - fromCity.lat) * Math.PI / 180;
  const dLng = (toCity.lng - fromCity.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(fromCity.lat * Math.PI / 180) * Math.cos(toCity.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

const QuoteCalculator = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const { data: competitors = [] } = useCompetitors();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fromCity: "Berlin",
    toCity: "",
    apartmentSize: "",
    floor: "0",
    hasElevator: false,
    packingService: false,
    furnitureAssembly: false,
    fragilePackaging: false,
    premiumInsurance: false,
    expressService: false,
    weekendService: false,
    cleaningService: false,
    storageService: false,
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculation = useMemo(() => {
    const size = apartmentSizes.find(s => s.value === formData.apartmentSize);
    if (!size) return null;

    const distance = calculateDistance(formData.fromCity, formData.toCity);
    const distanceCost = distance * 1.5;
    
    const floorNumber = parseInt(formData.floor) || 0;
    const floorCost = formData.hasElevator ? 0 : floorNumber * 30;
    
    const packingCost = formData.packingService ? size.volume * 8 : 0;
    const assemblyCost = formData.furnitureAssembly ? 150 : 0;
    const fragileCost = formData.fragilePackaging ? 120 : 0;
    const insuranceCost = formData.premiumInsurance ? 89 : 0;
    const expressCost = formData.expressService ? 199 : 0;
    const weekendCost = formData.weekendService ? 149 : 0;
    const cleaningCost = formData.cleaningService ? 180 : 0;
    const storageCost = formData.storageService ? 99 : 0;
    
    const subtotal = size.basePrice + distanceCost + floorCost + packingCost + assemblyCost + fragileCost + insuranceCost + expressCost + weekendCost + cleaningCost + storageCost;
    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    return {
      basePrice: size.basePrice,
      distance,
      distanceCost,
      floorCost,
      packingCost,
      assemblyCost,
      fragileCost,
      insuranceCost,
      expressCost,
      weekendCost,
      cleaningCost,
      storageCost,
      subtotal,
      tax,
      total,
      volume: size.volume,
    };
  }, [formData]);

  // Calculate competitor price comparisons
  const priceComparisons = useMemo(() => {
    if (!calculation || competitors.length === 0) return [];
    return calculateCompetitorPrices(
      competitors,
      calculation.total,
      calculation.basePrice,
      calculation.distanceCost,
      calculation.floorCost
    );
  }, [calculation, competitors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calculation) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          fromCity: formData.fromCity,
          toCity: formData.toCity,
          apartmentSize: apartmentSizes.find(s => s.value === formData.apartmentSize)?.labelKey || formData.apartmentSize,
          floor: parseInt(formData.floor) || 0,
          hasElevator: formData.hasElevator,
          needsPacking: formData.packingService,
          needsAssembly: formData.furnitureAssembly,
          preferredDate: formData.preferredDate,
          estimatedPrice: Math.round(calculation.total),
          distance: calculation.distance,
          volume: calculation.volume,
          message: formData.notes,
        },
      });

      if (error) {
        console.error("Error sending quote:", error);
        toast({
          title: t("common.error"),
          description: t("hero.errorDesc"),
          variant: "destructive",
        });
        return;
      }

      console.log("Quote sent successfully:", data);
      toast({
        title: t("calc.successTitle"),
        description: t("calc.successDesc"),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: t("common.error"),
        description: t("hero.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {t("calc.successTitle")}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t("calc.successDesc")}
        </p>
        <div className="bg-muted rounded-xl p-6 text-left mb-6">
          <h4 className="font-semibold text-foreground mb-3">{t("calc.yourDetails")}</h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">{t("calc.route")}:</span> {formData.fromCity} → {formData.toCity}</p>
            <p><span className="text-muted-foreground">{t("calc.estimatedPrice")}:</span> <span className="font-bold text-accent">{calculation?.total.toFixed(2)} €</span></p>
          </div>
        </div>
        <Button variant="accent" onClick={() => { setSubmitted(false); setStep(1); }}>
          {t("calc.newRequest")}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="bg-muted p-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= s ? 'bg-accent text-accent-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                  step > s ? 'bg-accent' : 'bg-muted-foreground/20'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("calc.step1")}</span>
          <span>{t("calc.step2")}</span>
          <span>{t("calc.step3")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {/* Step 1: Moving details */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("calc.movingDetails")}</h3>
                <p className="text-sm text-muted-foreground">{t("calc.whereToGo")}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("calc.from")} *
                </label>
                <select
                  value={formData.fromCity}
                  onChange={(e) => updateFormData('fromCity', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  {germanCities.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("calc.to")} *
                </label>
                <select
                  value={formData.toCity}
                  onChange={(e) => updateFormData('toCity', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value="">{t("calc.selectPlease")}</option>
                  {germanCities.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("calc.apartmentSize")} *
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {apartmentSizes.map((size) => (
                  <label
                    key={size.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.apartmentSize === size.value
                        ? 'border-accent bg-accent/5'
                        : 'border-input hover:border-accent/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="apartmentSize"
                      value={size.value}
                      checked={formData.apartmentSize === size.value}
                      onChange={(e) => updateFormData('apartmentSize', e.target.value)}
                      className="sr-only"
                    />
                    <Home className={`w-5 h-5 ${formData.apartmentSize === size.value ? 'text-accent' : 'text-muted-foreground'}`} />
                    <div>
                      <div className="font-medium text-foreground">{size.labelKey}</div>
                      <div className="text-xs text-muted-foreground">{t("calc.fromAb")} {size.basePrice} €</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("calc.floor")}
                </label>
                <select
                  value={formData.floor}
                  onChange={(e) => updateFormData('floor', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="0">{t("calc.groundFloor")}</option>
                  <option value="1">1. {t("calc.floorN")}</option>
                  <option value="2">2. {t("calc.floorN")}</option>
                  <option value="3">3. {t("calc.floorN")}</option>
                  <option value="4">4. {t("calc.floorN")}</option>
                  <option value="5">{t("calc.floor5plus")}</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasElevator}
                    onChange={(e) => updateFormData('hasElevator', e.target.checked)}
                    className="w-5 h-5 rounded border-input text-accent focus:ring-accent"
                  />
                  <span className="text-foreground">{t("calc.hasElevator")}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Extra services */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("calc.extras")}</h3>
                <p className="text-sm text-muted-foreground">{t("calc.extrasSubtitle")}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "packingService" as const, label: t("calc.packing"), desc: t("calc.packingDesc"), cost: calculation?.packingCost || 0 },
                { key: "furnitureAssembly" as const, label: t("calc.assembly"), desc: t("calc.assemblyDesc"), cost: 150 },
                { key: "fragilePackaging" as const, label: t("calc.fragile"), desc: t("calc.fragileDesc"), cost: 120 },
                { key: "premiumInsurance" as const, label: t("calc.premiumInsurance"), desc: t("calc.premiumInsuranceDesc"), cost: 89 },
                { key: "expressService" as const, label: t("calc.express"), desc: t("calc.expressDesc"), cost: 199 },
                { key: "weekendService" as const, label: t("calc.weekend"), desc: t("calc.weekendDesc"), cost: 149 },
                { key: "cleaningService" as const, label: t("calc.cleaning"), desc: t("calc.cleaningDesc"), cost: 180 },
                { key: "storageService" as const, label: t("calc.storage"), desc: t("calc.storageDesc"), cost: 99 },
              ].map((option) => (
                <label key={option.key} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData[option.key] ? 'border-accent bg-accent/5' : 'border-input hover:border-accent/50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData[option.key] as boolean}
                    onChange={(e) => updateFormData(option.key, e.target.checked)}
                    className="w-5 h-5 mt-1 rounded border-input text-accent focus:ring-accent"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{option.label}</span>
                      <span className="text-accent font-bold">+{option.cost} €</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Price calculation preview */}
            {calculation && (
              <div className="bg-primary/5 rounded-xl p-6 mt-6">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-accent" />
                  {t("calc.costOverview")}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("calc.basePrice")} ({apartmentSizes.find(s => s.value === formData.apartmentSize)?.labelKey})</span>
                    <span className="text-foreground">{calculation.basePrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("calc.distance")} ({calculation.distance} km)</span>
                    <span className="text-foreground">{calculation.distanceCost.toFixed(2)} €</span>
                  </div>
                  {calculation.floorCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.floorSurcharge")}</span>
                      <span className="text-foreground">{calculation.floorCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.packingCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.packing")}</span>
                      <span className="text-foreground">{calculation.packingCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.assemblyCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.assembly")}</span>
                      <span className="text-foreground">{calculation.assemblyCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.fragileCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.fragile")}</span>
                      <span className="text-foreground">{calculation.fragileCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.insuranceCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.premiumInsurance")}</span>
                      <span className="text-foreground">{calculation.insuranceCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.expressCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.express")}</span>
                      <span className="text-foreground">{calculation.expressCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.weekendCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.weekend")}</span>
                      <span className="text-foreground">{calculation.weekendCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.cleaningCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.cleaning")}</span>
                      <span className="text-foreground">{calculation.cleaningCost.toFixed(2)} €</span>
                    </div>
                  )}
                  {calculation.storageCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.storage")}</span>
                      <span className="text-foreground">{calculation.storageCost.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="border-t border-input pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.subtotal")}</span>
                      <span className="text-foreground">{calculation.subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("calc.vat")}</span>
                      <span className="text-foreground">{calculation.tax.toFixed(2)} €</span>
                    </div>
                  </div>
                  <div className="border-t border-input pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground text-lg">{t("calc.estimatedTotal")}</span>
                      <span className="font-bold text-accent text-2xl">{calculation.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
                
                <PriceComparisonBadge 
                  comparisons={priceComparisons} 
                  ourPrice={calculation.total} 
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Contact info */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("calc.contactInfo")}</h3>
                <p className="text-sm text-muted-foreground">{t("calc.contactSubtitle")}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("calc.name")} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("calc.email")} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="max@email.de"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("calc.phone")} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="01XX XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("calc.preferredDate")}</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => updateFormData('preferredDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("calc.additionalNotes")}</label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={3}
                placeholder={t("calc.notesPlaceholder")}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            {/* Final price summary */}
            {calculation && (
              <>
                <div className="bg-accent/10 rounded-xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("calc.estimatedTotal")}</p>
                    <p className="text-3xl font-bold text-accent">{calculation.total.toFixed(2)} €</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{formData.fromCity} → {formData.toCity}</p>
                    <p>{calculation.distance} km • {calculation.volume} m³</p>
                  </div>
                </div>
                
                <PriceComparisonBadge 
                  comparisons={priceComparisons} 
                  ourPrice={calculation.total} 
                />
              </>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-input">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              {t("calc.back")}
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              variant="accent"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!formData.toCity || !formData.apartmentSize)}
            >
              {t("calc.next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("calc.sending")}
                </>
              ) : (
                t("calc.submit")
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuoteCalculator;
