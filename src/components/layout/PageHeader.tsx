import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeToken } from "@/services/authService";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
    onBack?: () => void;
      isTitleLoading?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "New booking", message: "Jane Doe booked a Deep Tissue Massage", time: "2 min ago", read: false },
  { id: "2", title: "Payment received", message: "Payment of $150 received from John Smith", time: "1 hour ago", read: false },
  { id: "3", title: "Staff update", message: "Sarah Wilson updated her availability", time: "3 hours ago", read: true },
];

export function PageHeader({ title , showBack = false, onBack , isTitleLoading }: PageHeaderProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

const [visibleLoader, setVisibleLoader] = useState(true);

useEffect(() => {
  if (!title || isTitleLoading) {
    setVisibleLoader(true);
    return;
  }

  const t = setTimeout(() => {
    setVisibleLoader(false);
  }, 400); // 👈 minimum time to avoid flicker

  return () => clearTimeout(t);
}, [title, isTitleLoading]);

const THEME_KEY = "theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(THEME_KEY) === "dark";
};
const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [isDark]);

 const toggleTheme = () => {
  setIsDark((prev) => {
    const next = !prev;
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    return next;
  });
};

  const handleLogout = () => {
    removeToken();
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Close dropdowns when clicking outside

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    {visibleLoader && (
  <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-background/70 backdrop-blur-sm">
    <div className="flex items-center gap-1 text-[32px] font-semibold text-foreground">
      <span className="dot dot-1">.</span>
      <span className="dot dot-2">.</span>
      <span className="dot dot-3">.</span>
    </div>
  </div>
)}
    <header className="relative flex items-center h-[72px] px-6">
     {showBack && (
  <button
    onClick={onBack}
    className="
      absolute left-6
      flex items-center gap-2
      rounded-full border  border-primary
      px-4 py-2
      text-sm font-medium text-primary
      hover:bg-primary hover:text-primary-foreground
      transition
    "
  >
    ← Back
  </button>
)}
{/* Page Title */}
<h1
  className="
    absolute left-1/2 -translate-x-1/2
    text-[28px] font-semibold text-foreground
  "
>
  {title || "\u00A0"}
</h1>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Theme Toggle */}
     {/* Theme Toggle */}
<div className="gradient-border shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
  <div className="gradient-border-inner flex items-center p-1">
    {/* Light */}
    <button
      onClick={() => {
        if (isDark) toggleTheme();
      }}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        !isDark
          ? "bg-card shadow-[inset_0_0_20px_hsl(var(--primary)/0.15)]"
          : "text-muted-foreground"
      )}
    >
      <Sun className="w-4 h-4 text-foreground" />
    </button>

    {/* Dark */}
    <button
      onClick={() => {
        if (!isDark) toggleTheme();
      }}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        isDark
          ? "bg-card shadow-[inset_0_0_20px_hsl(var(--primary)/0.15)]"
          : "text-muted-foreground"
      )}
    >
      <Moon className="w-4 h-4" />
    </button>
  </div>
</div>
        {/* Notifications */}
     {/* Notifications */}
      <div ref={notificationsRef} className="relative gradient-border shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => {
            setIsNotificationsOpen((p) => !p);
            setIsProfileOpen(false);
          }}
          className="
            gradient-border-inner
            w-10 h-10 rounded-full
            flex items-center justify-center
            shadow-[inset_8px_8px_30px_hsl(var(--primary)/0.15)]
            transition-all
            hover:scale-[1.02]
          "
        >
          <Bell className="w-[18px] h-[18px] text-foreground" strokeWidth={1.5} />
        </button>

        {/* DROPDOWN */}
        {isNotificationsOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-card border shadow-dropdown z-50">
            <div className="px-4 py-3 border-b font-semibold">
              Notifications
            </div>

            <div className="max-h-64 overflow-y-auto">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 text-sm hover:bg-muted border-b last:border-0"
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {n.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* User Profile Pill with Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className={cn(
              "flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-card border border-border shadow-profile-pill hover:bg-muted/50 transition-all duration-200",
              isProfileOpen && "bg-muted/50"
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
              alt="Jane Cooper"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-foreground text-sm">Jane Cooper</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isProfileOpen && "rotate-180"
            )} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border border-border shadow-dropdown py-1.5 animate-fade-in z-50">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors rounded-lg mx-1 mr-2"
                style={{ width: 'calc(100% - 8px)' }}
                onClick={() => {
                  setIsProfileOpen(false);
                  console.log("Edit Profile clicked");
                }}
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Edit Profile
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors rounded-lg mx-1"
                style={{ width: 'calc(100% - 8px)' }}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
}
