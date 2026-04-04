import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/runp8",
    icon: "📸",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Twitter / X",
    url: "https://x.com/runp8",
    icon: "𝕏",
    color: "from-sky-400 to-blue-500",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/runp8",
    icon: "📘",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@runp8",
    icon: "▶️",
    color: "from-red-500 to-red-700",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@runp8",
    icon: "🎵",
    color: "from-gray-700 to-gray-900",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to runp8
      </Link>

      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-2xl font-bold">
          r8
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">runp8</h1>
        <p className="text-center text-sm text-muted-foreground max-w-xs">
          Find your next rental. Follow us everywhere.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${link.color}`}
            >
              <link.icon className="h-5 w-5 text-white" />
            </div>
            <span className="font-body text-sm font-medium text-foreground">
              {link.name}
            </span>
            <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        © {new Date().getFullYear()} runp8 — All rights reserved
      </p>
    </div>
  );
}
