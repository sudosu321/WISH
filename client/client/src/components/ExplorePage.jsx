import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../config";
import MeteorShower from "./MeteorShower";
// ── Framer variants ────────────────────────────────────────────────────────────
const pageEnter = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};

const staggerList = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const rowItem = {
  hidden: { opacity: 0, x: -18 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit:   { opacity: 0, x: 18, transition: { duration: 0.2 } },
};

// ── Tiny avatar placeholder (initials) ────────────────────────────────────────
function Avatar({ src, name, size = 44 }) {
  const [broken, setBroken] = useState(false);
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (broken || !src) {
    return (
      <div
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        className="rounded-full bg-gradient-to-br from-blue-900 to-blue-400 flex items-center justify-center text-white font-bold shrink-0 select-none"
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setBroken(true)}
      style={{ width: size, height: size }}
      className="rounded-full object-cover shrink-0 border border-white/10"
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [query, setQuery]       = useState("");
  const [loading, setLoading]   = useState(true);
  const loggedIn = localStorage.getItem("username");

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API_URL}/users`);
        const data = await res.json();
        // filter out the logged-in user
        setUsers((data.users ?? data).filter((u) => u.username !== loggedIn));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [loggedIn]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.tagline?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="show"
      className="min-h-screen relative overflow-x-hidden"
    >
      <title>Explore People</title>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/w1.png')" }}
      />
      {/* Dark overlay so cards stay readable */}

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-black/70 backdrop-blur-md border-b border-white/5 px-4 pt-10 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-blue-900/40 transition-colors shrink-0"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div>
            <h1 className="text-white font-[Rajdhani] text-2xl leading-none tracking-wide">
              Connected Humans
            </h1>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
            viewBox="0 0 24 24" fill="currentColor"
          >
            <path d="M21 19.59l-5.4-5.4A7.5 7.5 0 1 0 4.5 12a7.5 7.5 0 0 0 4.69 6.93L14.6 21 21 19.59zM4.5 12a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username…"
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-white text-sm outline-none focus:border-transparent/60 transition-colors placeholder-gray-600"
          />
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <main className="px-4 pt-4 pb-28">

        {/* Loading shimmer */}
        {loading && (
          <div className="flex flex-col gap-3 mt-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 animate-pulse"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 bg-white/10 rounded-full" />
                  <div className="h-2 w-20 bg-white/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count badge */}
        {!loading && query && (
          <motion.p
            key={filtered.length}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-xs uppercase tracking-widest mb-3 font-mono"
          >
            {filtered.length === 0
              ? "no one found"
              : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </motion.p>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center mt-20 gap-4 text-center"
          >
            
            <motion.p 
              
              className="text-white font-[Rajdhani] text-xl uppercase tracking-widest">
                No one found
            </motion.p>
            <p className="text-white text-sm">
              Try a different name or username
            </p>
          </motion.div>
        )}

        {/* User list */}
        {!loading && filtered.length > 0 && (
          <motion.ul
            variants={staggerList}
            initial="hidden"
            animate="show"
            className=" z-10 flex flex-col gap-2"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((u) => (
                <motion.li
                  key={u.username}
                  variants={rowItem}
                  layout
                  onClick={() => navigate(`/user/${u.username}`)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/5
                    active:bg-blue-900/20 active:border-blue-900/30
                    hover:bg-white/5 hover:border-white/10 hover:scale-105
                    transition-all cursor-pointer select-none group"
                >
                  <Avatar src={u.avatar_img} name={u.name || u.username} size={44} />

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-[Rajdhani] text-base leading-tight truncate">
                      {u.name || u.username}
                    </p>
                    <p className="text-gray-400 font-mono text-xs truncate">
                      @{u.username}
                    </p>
                  </div>

                  {/* Arrow chevron */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-700 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0"
                    viewBox="0 0 24 24" fill="currentColor"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                  </svg>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex bg-[#0E1116]/95 backdrop-blur-md border-t border-red-900/30">
        {[
          { to: "/home",    icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",                                                                     label: "Home"    },
          { to: `/user/${loggedIn}`, icon: "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z", label: "Profile" },
          { to: "/explore", icon: "M21 19.59l-5.4-5.4A7.5 7.5 0 1 0 4.5 12a7.5 7.5 0 0 0 4.69 6.93L14.6 21 21 19.59zM4.5 12a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z", label: "Explore", active: true },
          
        ].map(({ to, label, active }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] tracking-widest uppercase transition-colors
              ${active ? "text-blue-500" : "text-gray-600 hover:text-gray-400"}`}
          >
            {label}
          </button>
        ))}
      </nav>
            <MeteorShower density={10} />
      
    </motion.div>
  );
}