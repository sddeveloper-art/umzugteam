import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { CalendarDays } from "lucide-react";

const Verfuegbarkeit = () => {
  return (
    <>
      <Helmet>
        <title>Verfügbarkeit – UmzugTeam365 | Freie Termine prüfen</title>
        <meta name="description" content="Prüfen Sie die aktuellen Verfügbarkeiten für Ihren Umzug. Interaktiver Kalender mit freien Terminen bei UmzugTeam365." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <CalendarDays className="h-4 w-4" />
              Terminplanung
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Verfügbarkeit prüfen
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Sehen Sie auf einen Blick, welche Termine für Ihren Umzug frei sind. Wählen Sie Ihren Wunschtermin und kontaktieren Sie uns.
            </p>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
            <AvailabilityCalendar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Verfuegbarkeit;
