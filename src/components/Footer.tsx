import { MessageCircle, Send, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import DiscordCommunitySection from "@/components/DiscordCommunitySection";

const Footer = () => {
  return (
    <>
    <DiscordCommunitySection />
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Watermark */}
      <div className="absolute -bottom-20 -right-10 opacity-[0.04] pointer-events-none select-none">
        <Logo size={420} showWordmark={false} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Logo size={40} />
            <p className="text-muted-foreground mt-5 max-w-md text-sm leading-relaxed">
              Institutional-grade prop trading firm intelligence. Verified reviews, payout transparency,
              and trusted analysis for serious traders.
            </p>
            <div className="flex gap-2 mt-6">
              {[
                { href: "https://x.com/propfirm_forex", icon: () => <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: "Twitter" },
                { href: "https://www.youtube.com/@propfirm_knowledge", icon: Youtube, label: "YouTube" },
                { href: "https://telegram.dog/free_propfirm_accounts", icon: Send, label: "Telegram" },
                { href: "https://discord.gg/7MRsuqqT3n", icon: MessageCircle, label: "Discord" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Platform",
              links: [
                { to: "/", label: "Home" },
                { to: "/propfirms", label: "All Firms" },
                { to: "/compare", label: "Compare" },
                { to: "/reviews", label: "Reviews" },
                { to: "/table-review", label: "Table Review" },
              ]
            },
            {
              title: "Discover",
              links: [
                { to: "/top-firms", label: "Top Rated" },
                { to: "/cheap-firms", label: "Budget Firms" },
                { to: "/drama-tracker", label: "Drama Tracker" },
              ]
            },
            {
              title: "Account",
              links: [
                { to: "/login", label: "Log In" },
                { to: "/signup", label: "Sign Up" },
                { to: "/write-review", label: "Write Review" },
              ]
            }
          ].map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-foreground font-semibold mb-4 text-[11px] font-heading uppercase tracking-[0.18em]">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gradient-divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} PropFirm Knowledge · Institutional trading intelligence.
          </p>
          <p className="text-muted-foreground text-xs">
            Trading involves risk. Trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
