import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Heart,
  User,
  Settings,
  Music2,
} from "lucide-react";

const DOCK_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "discover", label: "Discover", icon: Compass, path: "/nexus" },
  { id: "favourites", label: "Favourites", icon: Heart, path: "/nexus" },
  { id: "profile", label: "Profile", icon: User, path: "/nexus" },
  { id: "settings", label: "Settings", icon: Settings, path: "/nexus" },
];

export default function FloatingDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const isActive = (item) => {
    if (item.id === "home") return location.pathname === "/";
    return location.pathname === item.path;
  };

  return (
    <nav
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-dock px-6 py-3 flex items-center gap-4"
      aria-label="Main navigation"
    >
      <div
        className="w-10 h-10 rounded-full bg-aura-pink/10 flex items-center justify-center text-aura-pink transition group relative"
        onMouseEnter={() => setHovered("home")}
        onMouseLeave={() => setHovered(null)}
      >
        <Music2 className="w-5 h-5 fill-current" />
        {hovered === "home" && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap text-xs bg-white/90 text-[#080A16] px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AURA
          </span>
        )}
      </div>

      {DOCK_ITEMS.map((item) => {
        const activeItem = isActive(item);
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.path !== location.pathname) {
                navigate(item.path);
              }
            }}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group"
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            aria-label={item.label}
          >
            <div
              className={`absolute inset-0 rounded-full transition-opacity duration-200 ${
                activeItem
                  ? "bg-gradient-to-tr from-aura-pink to-aura-purple opacity-100 shadow-[0_0_20px_rgba(245,44,155,0.5)]"
                  : "bg-white/5 opacity-0 hover:opacity-100"
              }`}
            />
            <Icon
              className={`w-5 h-5 transition-all duration-200 ${
                activeItem
                  ? "text-white scale-110"
                  : hovered === item.id
                  ? "text-aura-cyan scale-105"
                  : "text-white/60"
              }`}
            />
            {hovered === item.id && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap text-xs bg-white/90 text-[#080A16] px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
