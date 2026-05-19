import { Bell, Search, PanelLeftClose, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/lib/search-context";

interface AppHeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function AppHeader({ isSidebarOpen, onSidebarToggle }: AppHeaderProps) {
  const { headerSearch, setHeaderSearch } = useSearch();
  return (
    <header className="relative h-16 mx-6 mt-4 mb-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm z-40 flex items-center px-6 transition-all duration-300">
      {/* Left Section: Toggle Button + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search…"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="w-full pl-9 h-9 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Center Section: Brand Logo - Absolutely Centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-800 to-slate-500">
          Quba Demo
        </span>
      </div>

      {/* Right Section: Notifications */}
      <div className="flex-1 flex items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-md" />
        </Button>
      </div>
    </header>
  );
}
