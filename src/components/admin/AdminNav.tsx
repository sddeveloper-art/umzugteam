import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, ExternalLink } from "lucide-react";

interface AdminNavProps {
  userEmail: string;
  onSignOut: () => void;
}

const AdminNav = ({ userEmail, onSignOut }: AdminNavProps) => {
  return (
    <header className="bg-card border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Home className="w-4 h-4 mr-2" />
              Zur Website
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://presence.ionos.de/de-DE/c9ced923-2bb5-44e6-9f89-72570c570a4c/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              IONOS Dashboard
            </Button>
          </a>
          <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
          <Button onClick={onSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Ausloggen
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
