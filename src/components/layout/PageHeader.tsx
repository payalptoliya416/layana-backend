import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, User, LogOut, ChevronDown, MoveLeft, ArrowLeft, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeToken } from "@/services/authService";
import { createPortal } from "react-dom";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  isTitleLoading?: boolean;
  onMenuClick?: () => void;
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

export function PageHeader({ title , showBack = false, onBack , isTitleLoading ,onMenuClick }: PageHeaderProps) {
  const navigate = useNavigate();
 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
const [isThemeOpen, setIsThemeOpen] = useState(false);
const themeRef = useRef<HTMLDivElement>(null);
const [visibleLoader, setVisibleLoader] = useState(true);

useEffect(() => {
  if (!title || isTitleLoading) {
    setVisibleLoader(true);
    return;
  }

  const t = setTimeout(() => {
    setVisibleLoader(false);
  }, 1200); 

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
      window.dispatchEvent(new Event("theme-change"));
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
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const GlobalLoader = () => {
  return createPortal(
    <div
      style={{ zIndex: 2147483647 }} // max safe z-index
      className="
        fixed inset-0
        flex items-center justify-center
         modal-overlay backdrop-blur-sm
      "
    >
      <div className="flex items-end gap-2 h-8">
        <span className="dot-wave dot-1" />
        <span className="dot-wave dot-2" />
        <span className="dot-wave dot-3" />
        <span className="dot-wave dot-4" />
      </div>
    </div>,
    document.body
  );
}
  return (
    <>
     {visibleLoader && <GlobalLoader />}

    <header className="relative flex items-center px-2 justify-between sm:px-6 bg-card py-3 rounded-2xl gap-[1px] sm:gap-1 overflow-x-hidden">
       <button
    onClick={onMenuClick}
    className="lg:hidden flex items-center justify-center
      h-8 w-8 rounded-sm border border-border bg-card
      hover:bg-muted transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

     {showBack && (
      <button
        onClick={onBack}
        className=" hidden ml-auto
          2xl:absolute left-6
          sm:flex items-center gap-2
          rounded-full border  border-primary
          px-4 py-2
          text-sm font-medium text-primary
          hover:bg-primary hover:text-primary-foreground
          transition
        "
      >
       <ArrowLeft className="h-4 w-4" /> Back
      </button>
    )}
    {/* Page Title */}
      <h1
      className="
        flex-1 min-w-0
        truncate
        text-base md:text-[28px]
        font-semibold text-foreground

        2xl:absolute
        2xl:left-1/2
        2xl:-translate-x-1/2
        2xl:text-center
      "
      title={title}
    >
      {title}
    </h1>

      {/* Right Actions */}
      <div className="self-end lg:ml-auto flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
          {showBack && (
      <button
        onClick={onBack}
        className=" sm:hidden
          2xl:absolute left-6
          flex items-center gap-2
          rounded-full border  border-primary
          px-2 py-2  w-9 h-9
          text-sm font-medium text-primary
          hover:bg-primary hover:text-primary-foreground
          transition
        "
      >
       <ArrowLeft className="h-4 w-4" />
      </button>
    )}
        {/* Notifications */}
   <div ref={themeRef} className="relative block gradient-border">
  <button
    onClick={() => toggleTheme()}
    className="
      w-9 md:w-[50px] h-9 md:h-[50px]
      rounded-full
      flex items-center justify-center
      gradient-border-inner
      boxshadow
      transition-all
    "
    aria-label="Toggle theme"
  >
    {isDark ? (
      <Moon className="w-4 h-4 text-foreground transition-transform duration-200" />
    ) : (
      <Sun className="w-4 h-4 text-foreground transition-transform duration-200" />
    )}
  </button>
</div>
     {/* Notifications */}
      <div ref={notificationsRef} className="relative gradient-border shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => {
            setIsNotificationsOpen((p) => !p);
            setIsProfileOpen(false);
          }}
          className="
            gradient-border-inner
            w-9 md:w-[50px] h-9 md:h-[50px] rounded-full
            flex items-center justify-center
            boxshadow
            transition-all
          "
        >
          <Bell className="w-[18px] h-[18px] text-foreground" strokeWidth={1.5} />
        </button>

        {/* DROPDOWN */}
     {isNotificationsOpen && (
    <div className="fixed sm:absolute
    inset-x-0 sm:inset-auto
    top-20 sm:top-full mt-2
    mx-3 sm:mx-0 
    sm:right-0
    w-[calc(100%-1.5rem)] sm:w-80
    bg-card rounded-xl border border-border
    shadow-dropdown py-1.5
    animate-fade-in z-50">
    {/* <div className="absolute right-0 top-full mt-2 w-56 sm:w-80 bg-card rounded-xl border border-border shadow-dropdown py-1.5 animate-fade-in !z-50"> */}
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
        <div ref={profileRef} className="relative gradient-border">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className={cn(
              "flex items-center gap-2.5 px-[2px] py-[7px] md:p-[7px] h-10 md:h-[50px] rounded-full gradient-border-inner transition-all duration-200 gradient-border-inner",
              isProfileOpen && "bg-muted/50 "
            )}
            style={{boxShadow : '0px 6px 10px 0px rgba(0, 0, 0, 0.1)'}}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
              alt="Ramesh T"
              className="w-[36px] h-[36px] rounded-full object-cover"
            />
            <span className="font-medium text-foreground text-sm hidden sm:block">Ramesh T</span>
            
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-card rounded-xl border border-border shadow-dropdown py-1.5 animate-fade-in z-50">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors rounded-lg mx-1 mr-2"
                style={{ width: 'calc(100% - 8px)' }}
                onClick={() => {
                  setIsProfileOpen(false);
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
