import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, BarChart3, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface AppSidebarProps {
  onToggle: () => void;
}

export function AppSidebar({ onToggle }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  const initials = (user?.name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <TooltipProvider>
      <aside className="hidden md:flex w-16 shrink-0 flex-col h-full justify-between bg-white border-r border-gray-200">
        {/* Top Section: Navigation */}
        <div className="flex flex-col pt-8">
          {/* Navigation */}
          <nav className="px-2 py-4 space-y-2 flex flex-col">
            {items.map((item) => {
              const active = pathname === item.to;
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200",
                        active
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile Avatar */}
        <div className="h-16 flex items-center justify-center border-t border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {user?.name || "Profile"}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
