import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addDays } from "date-fns";
import { format } from "date-fns";
import { de, fr } from "date-fns/locale";
import {
  Home, Building2, Truck, Package, Piano, Archive,
  MapPin, ArrowRight, ArrowLeft, Check, Send, Loader2,
  User, Mail, Phone, CalendarIcon, Clock, ChevronRight,
  Sofa, BedDouble, UtensilsCrossed, Briefcase, BoxesIcon
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCreateAnnouncement } from "@/hooks/useAnnouncements";
import { MovingItem, calculateEstimatedVolume } from "@/components/announcements/MovingItemsPicker";
import MovingItemsPicker from "@/components/announcements/MovingItemsPicker";
import { useI18n } from "@/hooks/useI18n";

// --- Types ---
interface QuoteData {
  category: string;
  from_city: string;
  to_city: string;
  apartment_size: string;
  floor: number;
  has_elevator: boolean;
  needs_packing: boolean;
  needs_assembly: boolean;
  needs_fragile_packing: boolean;
  needs_cleaning: boolean;
  needs_storage: boolean;
  needs_premium_insurance: boolean;
  needs_express: boolean;
  needs_weekend: boolean;
  preferred_date: Date | null;
  items: MovingItem[];
  client_name: string;
  client_email: string;
  client_phone: string;
  description: string;
  bidding_duration: string;
}

const CreateQuote = () => {
  const navigate = useNavigate();
  const createAnnouncement = useCreateAnnouncement();
  const { t, language } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateLocale = language === "fr" ? fr : de;

  const STEPS = [
    { id: "category", label: t("wizard.step.category"), icon: Package },
    { id: "route", label: t("wizard.step.route"), icon: MapPin },
    { id: "details", label: t("wizard.step.details"), icon: Home },
    { id: "items", label: t("wizard.step.items"), icon: BoxesIcon },
    { id: "contact", label: t("wizard.step.contact"), icon: User },
    { id: "summary", label: t("wizard.step.summary"), icon: Check },
  ];

  const CATEGORIES = [
    { value: "privatumzug", label: t("wizard.cat.private"), desc: t("wizard.cat.privateDesc"), icon: Home },
    { value: "firmenumzug", label: t("wizard.cat.company"), desc: t("wizard.cat.companyDesc"), icon: Building2 },
    { value: "moebeltransport", label: t("wizard.cat.furniture"), desc: t("wizard.cat.furnitureDesc"), icon: Sofa },
    { value: "klaviertransport", label: t("wizard.cat.piano"), desc: t("wizard.cat.pianoDesc"), icon: Piano },
    { value: "fernumzug", label: t("wizard.cat.longDist"), desc: t("wizard.cat.longDistDesc"), icon: Truck },
    { value: "lagerung", label: t("wizard.cat.storage"), desc: t("wizard.cat.storageDesc"), icon: Archive },
  ];

  const APARTMENT_SIZES = [
    { value: "1-Zimmer", label: t("wizard.size.1room") },
    { value: "2-Zimmer", label: t("wizard.size.2room") },
    { value: "3-Zimmer", label: t("wizard.size.3room") },
    { value: "4-Zimmer", label: t("wizard.size.4room") },
    { value: "5+-Zimmer", label: t("wizard.size.5room") },
    { value: "Haus", label: t("wizard.size.house") },
    { value: "Büro", label: t("wizard.size.office") },
  ];

  const BIDDING_DURATIONS = [
    { value: "1", label: t("wizard.dur.1day") },
    { value: "2", label: t("wizard.dur.2days") },
    { value: "3", label: t("wizard.dur.3days") },
    { value: "5", label: t("wizard.dur.5days") },
    { value: "7", label: t("wizard.dur.1week") },
    { value: "14", label: t("wizard.dur.2weeks") },
  ];

  const SERVICE_OPTIONS = [
    { key: "has_elevator", label: t("wizard.svc.elevator"), desc: t("wizard.svc.elevatorDesc") },
    { key: "needs_packing", label: t("wizard.svc.packing"), desc: t("wizard.svc.packingDesc") },
    { key: "needs_assembly", label: t("wizard.svc.assembly"), desc: t("wizard.svc.assemblyDesc") },
    { key: "needs_fragile_packing", label: t("wizard.svc.fragile"), desc: t("wizard.svc.fragileDesc") },
    { key: "needs_cleaning", label: t("wizard.svc.cleaning"), desc: t("wizard.svc.cleaningDesc") },
    { key: "needs_storage", label: t("wizard.svc.storage"), desc: t("wizard.svc.storageDesc") },
    { key: "needs_premium_insurance", label: t("wizard.svc.insurance"), desc: t("wizard.svc.insuranceDesc") },
    { key: "needs_express", label: t("wizard.svc.express"), desc: t("wizard.svc.expressDesc") },
    { key: "needs_weekend", label: t("wizard.svc.weekend"), desc: t("wizard.svc.weekendDesc") },
  ];

  const [data, setData] = useState<QuoteData>({
    category: "",
    from_city: "",
    to_city: "",
    apartment_size: "",
    floor: 0,
    has_elevator: false,
    needs_packing: false,
    needs_assembly: false,
    needs_fragile_packing: false,
    needs_cleaning: false,
    needs_storage: false,
    needs_premium_insurance: false,
    needs_express: false,
    needs_weekend: false,
    preferred_date: null,
    items: [],
    client_name: "",
    client_email: "",
    client_phone: "",
    description: "",
    bidding_duration: "3",
  });

  const update = (partial: Partial<QuoteData>) => setData((prev) => ({ ...prev, ...partial }));

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return !!data.category;
      case 1: return data.from_city.length >= 2 && data.to_city.length >= 2;
      case 2: return !!data.apartment_size;
      case 3: return true;
      case 4: return data.client_name.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client_email) && !!data.bidding_duration;
      case 5: return true;
      default: return false;
    }
  };

  const next = () => { if (canProceed() && currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1); };
  const prev = () => { if (currentStep > 0) setCurrentStep((s) => s - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const endDate = addDays(new Date(), parseInt(data.bidding_duration));
      await createAnnouncement.mutateAsync({
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone || undefined,
        from_city: data.from_city,
        to_city: data.to_city,
        apartment_size: data.apartment_size,
        volume: data.items.length > 0 ? Math.round(calculateEstimatedVolume(data.items)) : undefined,
        floor: data.floor,
        has_elevator: data.has_elevator,
        needs_packing: data.needs_packing,
        needs_assembly: data.needs_assembly,
        preferred_date: data.preferred_date?.toISOString().split("T")[0],
        description: [
          `Kategorie: ${CATEGORIES.find((c) => c.value === data.category)?.label || data.category}`,
          data.description,
        ].filter(Boolean).join("\n"),
        end_date: endDate.toISOString(),
        items: data.items.length > 0 ? data.items : undefined,
      });
      navigate("/anfragen");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const estimatedVolume = calculateEstimatedVolume(data.items);

  return (
    <>
      <Helmet>
        <title>{t("wizard.pageTitle")} | UmzugTeam365</title>
        <meta name="description" content={t("wizard.metaDesc")} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-muted pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("wizard.pageTitle")}
              </h1>
              <span className="text-sm text-muted-foreground">
                {t("wizard.stepOf")} {currentStep + 1} {t("wizard.of")} {STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            {/* Step indicators */}
            <div className="hidden md:flex items-center justify-between mt-4">
              {STEPS.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => i < currentStep && setCurrentStep(i)}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      isActive && "text-primary",
                      isDone && "text-primary/70 cursor-pointer hover:text-primary",
                      !isActive && !isDone && "text-muted-foreground"
                    )}
                    disabled={i > currentStep}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                        isActive && "border-primary bg-primary text-primary-foreground",
                        isDone && "border-primary bg-primary/10 text-primary",
                        !isActive && !isDone && "border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span className="hidden lg:inline">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-10">
                {/* Step 0: Category */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("wizard.cat.title")}</h2>
                    <p className="text-muted-foreground mb-6">{t("wizard.cat.subtitle")}</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {CATEGORIES.map((cat) => {
                        const CatIcon = cat.icon;
                        const selected = data.category === cat.value;
                        return (
                          <button
                            key={cat.value}
                            onClick={() => update({ category: cat.value })}
                            className={cn(
                              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all text-center hover:shadow-md",
                              selected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border hover:border-primary/40"
                            )}
                          >
                            <div className={cn(
                              "w-14 h-14 rounded-full flex items-center justify-center",
                              selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              <CatIcon className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{cat.label}</p>
                              <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1: Route */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("wizard.route.title")}</h2>
                    <p className="text-muted-foreground mb-6">{t("wizard.route.subtitle")}</p>
                    <div className="max-w-lg mx-auto space-y-6">
                      <div className="relative">
                        <div className="absolute left-5 top-[3.5rem] bottom-[3.5rem] w-0.5 bg-primary/30" />
                        <div className="space-y-6">
                          <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                                <MapPin className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <label className="font-semibold text-foreground">{t("wizard.route.from")}</label>
                            </div>
                            <div className="ml-[3.25rem]">
                              <Input
                                placeholder={t("wizard.route.fromPlaceholder")}
                                value={data.from_city}
                                onChange={(e) => update({ from_city: e.target.value })}
                                className="text-base py-6"
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center z-10">
                                <MapPin className="w-5 h-5 text-accent-foreground" />
                              </div>
                              <label className="font-semibold text-foreground">{t("wizard.route.to")}</label>
                            </div>
                            <div className="ml-[3.25rem]">
                              <Input
                                placeholder={t("wizard.route.toPlaceholder")}
                                value={data.to_city}
                                onChange={(e) => update({ to_city: e.target.value })}
                                className="text-base py-6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("wizard.details.title")}</h2>
                    <p className="text-muted-foreground mb-6">{t("wizard.details.subtitle")}</p>
                    <div className="space-y-6 max-w-2xl">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">{t("wizard.details.sizeLabel")}</label>
                          <Select value={data.apartment_size} onValueChange={(v) => update({ apartment_size: v })}>
                            <SelectTrigger className="py-6 text-base">
                              <SelectValue placeholder={t("wizard.details.sizePlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              {APARTMENT_SIZES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">{t("wizard.details.floorLabel")}</label>
                          <Input
                            type="number"
                            min={0}
                            max={50}
                            value={data.floor}
                            onChange={(e) => update({ floor: parseInt(e.target.value) || 0 })}
                            className="py-6 text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("wizard.details.dateLabel")}</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full sm:w-[280px] justify-start text-left font-normal py-6 text-base",
                                !data.preferred_date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {data.preferred_date
                                ? format(data.preferred_date, "PPP", { locale: dateLocale })
                                : t("wizard.details.datePlaceholder")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={data.preferred_date || undefined}
                              onSelect={(d) => update({ preferred_date: d || null })}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">{t("wizard.details.servicesLabel")}</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {SERVICE_OPTIONS.map((opt) => {
                            const checked = data[opt.key as keyof QuoteData] as boolean;
                            return (
                              <label
                                key={opt.key}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                                  checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => update({ [opt.key]: !!v } as any)}
                                  className="mt-0.5"
                                />
                                <div>
                                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Items */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("wizard.items.title")}</h2>
                    <p className="text-muted-foreground mb-6">{t("wizard.items.subtitle")}</p>
                    <MovingItemsPicker
                      items={data.items}
                      onChange={(items) => update({ items })}
                    />
                  </div>
                )}

                {/* Step 4: Contact */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("wizard.contact.title")}</h2>
                    <p className="text-muted-foreground mb-6">{t("wizard.contact.subtitle")}</p>
                    <div className="max-w-lg mx-auto space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <User className="inline w-4 h-4 mr-1" />{t("wizard.contact.nameLabel")}
                        </label>
                        <Input
                          placeholder={t("wizard.contact.namePlaceholder")}
                          value={data.client_name}
                          onChange={(e) => update({ client_name: e.target.value })}
                          className="py-6 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Mail className="inline w-4 h-4 mr-1" />{t("wizard.contact.emailLabel")}
                        </label>
                        <Input
                          type="email"
                          placeholder={t("wizard.contact.emailPlaceholder")}
                          value={data.client_email}
                          onChange={(e) => update({ client_email: e.target.value })}
                          className="py-6 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Phone className="inline w-4 h-4 mr-1" />{t("wizard.contact.phoneLabel")}
                        </label>
                        <Input
                          type="tel"
                          placeholder={t("wizard.contact.phonePlaceholder")}
                          value={data.client_phone}
                          onChange={(e) => update({ client_phone: e.target.value })}
                          className="py-6 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("wizard.contact.extraLabel")}
                        </label>
                        <Textarea
                          placeholder={t("wizard.contact.extraPlaceholder")}
                          value={data.description}
                          onChange={(e) => update({ description: e.target.value })}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Clock className="inline w-4 h-4 mr-1" />{t("wizard.contact.durationLabel")}
                        </label>
                        <Select value={data.bidding_duration} onValueChange={(v) => update({ bidding_duration: v })}>
                          <SelectTrigger className="py-6 text-base">
                            <SelectValue placeholder={t("wizard.contact.durationPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {BIDDING_DURATIONS.map((d) => (
                              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">{t("wizard.contact.durationHint")}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Summary */}
                {currentStep === 5 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t("wizard.summary.title")}</h2>
                    <p className="text-muted-foreground mb-6">{t("wizard.summary.subtitle")}</p>
                    <div className="space-y-4">
                      <SummaryRow label={t("wizard.summary.category")} value={CATEGORIES.find((c) => c.value === data.category)?.label || data.category} onEdit={() => setCurrentStep(0)} editLabel={t("wizard.summary.edit")} />
                      <SummaryRow label={t("wizard.summary.route")} value={`${data.from_city} → ${data.to_city}`} onEdit={() => setCurrentStep(1)} editLabel={t("wizard.summary.edit")} />
                      <SummaryRow label={t("wizard.summary.size")} value={APARTMENT_SIZES.find((s) => s.value === data.apartment_size)?.label || data.apartment_size} onEdit={() => setCurrentStep(2)} editLabel={t("wizard.summary.edit")} />
                      <SummaryRow label={t("wizard.summary.floor")} value={`${data.floor}. ${t("wizard.summary.og")}${data.has_elevator ? ` (${t("wizard.svc.elevator")})` : ""}`} onEdit={() => setCurrentStep(2)} editLabel={t("wizard.summary.edit")} />
                      {data.preferred_date && (
                        <SummaryRow label={t("wizard.summary.date")} value={format(data.preferred_date, "PPP", { locale: dateLocale })} onEdit={() => setCurrentStep(2)} editLabel={t("wizard.summary.edit")} />
                      )}
                      {data.items.length > 0 && (
                        <SummaryRow
                          label={t("wizard.summary.inventory")}
                          value={`${data.items.reduce((s, i) => s + i.quantity, 0)} ${t("wizard.summary.items")} (~${estimatedVolume.toFixed(1)} m³)`}
                          onEdit={() => setCurrentStep(3)}
                          editLabel={t("wizard.summary.edit")}
                        />
                      )}
                      <SummaryRow label={t("wizard.summary.name")} value={data.client_name} onEdit={() => setCurrentStep(4)} editLabel={t("wizard.summary.edit")} />
                      <SummaryRow label={t("wizard.summary.email")} value={data.client_email} onEdit={() => setCurrentStep(4)} editLabel={t("wizard.summary.edit")} />
                      {data.client_phone && <SummaryRow label={t("wizard.summary.phone")} value={data.client_phone} onEdit={() => setCurrentStep(4)} editLabel={t("wizard.summary.edit")} />}
                      <SummaryRow
                        label={t("wizard.summary.duration")}
                        value={BIDDING_DURATIONS.find((d) => d.value === data.bidding_duration)?.label || data.bidding_duration}
                        onEdit={() => setCurrentStep(4)}
                        editLabel={t("wizard.summary.edit")}
                      />

                      {/* Active services */}
                      {SERVICE_OPTIONS.filter((o) => data[o.key as keyof QuoteData]).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {SERVICE_OPTIONS.filter((o) => data[o.key as keyof QuoteData]).map((o) => (
                            <Badge key={o.key} variant="secondary">{o.label}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{t("wizard.summary.freeNote")}</p>
                            <p className="text-xs text-muted-foreground">{t("wizard.summary.freeDesc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={prev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> {t("wizard.nav.back")}
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={next}
                disabled={!canProceed()}
                className="gap-2"
                size="lg"
              >
                {t("wizard.nav.next")} <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
                className="gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("wizard.nav.sending")}</>
                ) : (
                  <><Send className="w-4 h-4" /> {t("wizard.nav.submit")}</>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

const SummaryRow = ({ label, value, onEdit, editLabel }: { label: string; value: string; onEdit: () => void; editLabel: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
    <button onClick={onEdit} className="text-xs text-primary hover:underline">{editLabel}</button>
  </div>
);

export default CreateQuote;
