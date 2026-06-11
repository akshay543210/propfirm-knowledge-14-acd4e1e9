import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion, AnimatePresence } from "framer-motion";
import PayoutSupportBanner from "@/components/PayoutSupportBanner";
import Logo from "@/components/ui/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/propfirms", label: "All Firms" },
  { to: "/reviews", label: "Reviews" },
  { to: "/drama-tracker", label: "Drama Tracker" },
  { to: "/compare", label: "Compare" },
  { to: "/table-review", label: "Table Review" },
];

const Navbar = ({ isAdminMode, setIsAdminMode }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { direction, atTop } = useScrollDirection();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;
  const isSubPage = location.pathname !== "/";

  return (
    <div className="fixed left-0 right-0 z-50" style={{ top: 36 }}>
      <PayoutSupportBanner />

      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: direction === "down" && !atTop ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`w-full transition-all duration-300 ${
          atTop
            ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
            : "bg-background/95 backdrop-blur-2xl border-b border-primary/30 shadow-[0_1px_0_hsl(var(--primary)/0.15),0_8px_24px_-12px_hsl(38_40%_50%/0.15)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Left */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              {isSubPage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 shrink-0"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Link to="/" aria-label="PropFirm Knowledge home">
                <Logo size={34} />
              </Link>
              {isAdmin && (
                <span className="hidden md:inline-flex ml-3 text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary-deep border border-primary/40 font-semibold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>

            {/* Center */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors whitespace-nowrap ${
                    isActive(link.to) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {isAdmin && (
                <Link to="/admin-dashboard-2024">
                  <Button size="sm" variant="outline" className="border-primary/40 text-foreground hover:bg-primary/10 text-xs font-semibold">
                    <Shield className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Admin
                  </Button>
                </Link>
              )}
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted text-[13px]">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="btn-gold text-[13px] font-semibold px-5 rounded-lg">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                      <User className="h-4 w-4 mr-1.5" />
                      {user.email ? user.email.split("@")[0] : "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card/98 backdrop-blur-xl border-border shadow-lg">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/reviews")}>My Reviews</DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin-dashboard-2024")}>
                          <Shield className="h-4 w-4 mr-2 text-primary" />
                          Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile burger */}
            <div className="lg:hidden md:flex hidden items-center" />
            <div className="lg:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground hover:bg-muted">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Gold hairline */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[998] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border z-[999] lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-border">
                <Logo size={30} />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-foreground">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="px-4 py-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? "bg-primary/10 text-foreground border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin-dashboard-2024"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10"
                  >
                    <Shield className="inline h-4 w-4 mr-2 text-primary" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="gradient-divider my-4" />
                {!user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-border">Log in</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full btn-gold font-semibold">Get Started</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate("/reviews"); setIsMobileMenuOpen(false); }}>
                      My Reviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={async () => { await handleLogout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
