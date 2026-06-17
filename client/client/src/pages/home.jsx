import { useState } from "react";
import API_URL from "../config";
import PostSection from "../components/PostSection";
import UserSidebar from "../components/UserSidebar";
import LeftSidebar from "../components/LeftSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import MeteorShower from "../components/MeteorShower";

// Bottom nav icons — shown only on mobile, replaces both sidebars
function MobileNav() {
  const loggedInUser = localStorage.getItem("username");
  const { pathname } = useLocation();
  const links = [
    { to: "/home", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", label: "Home" },
    { to: `/user/${loggedInUser}`, icon: "ti-user", label: "Profile" },
    { to: "/explore", icon: "ti-search", label: "Explore" },

  ]; 
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden bg-[#0E1116]/95 backdrop-blur-md border-t border-red-900/30 safe-b">
      {links.map(({ to, icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex-1 flex flex-col items-center gap-1 py-3 ] text-[10px] tracking-widest uppercase transition-colors
            ${pathname === to ? "text-blue-500" : "text-gray-600 hover:text-gray-400"}`}
        >
          <i className={`ti ${icon} text-xl`} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

// Framer variants
const heroTitle = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)",  transition: { duration: 1.1, ease: "easeOut" } },
};
const sidebarVariant = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.6, delay: 0.5, ease: "easeOut" } },
};
const rightSidebarVariant = {
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.6, delay: 0.5, ease: "easeOut" } },
};
const fabVariant = {
  hidden: { scale: 0, rotate: -90 },
  show:   { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.8 } },
};
const modalBackdrop = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.2 } },
  exit:   { opacity: 0, transition: { duration: 0.2 } },
};
const modalCard = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  show:   { opacity: 1, scale: 1,    y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
  exit:   { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.18 } },
};
const pageEnter = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};
function Home() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage]         = useState(null);
  const [desc, setDesc]           = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!image || !desc) { alert("Please fill all fields"); return; }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("username", localStorage.getItem("username"));
      formData.append("description", desc);
      formData.append("image", image);
      const res = await fetch(`${API_URL}/posts`, { method: "POST", body: formData });
      if (res.ok) { setShowModal(false); setImage(null); setDesc(""); }
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  return (
    <motion.div
          variants={pageEnter}
          initial="hidden"
          animate="show"
           className="min-h-screen relative overflow-x-hidden">
      <title>Homepage</title>
      <MeteorShower density={5}/>
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/w1.png')" }}
      />
      <div className="fixed inset-1 -z-10 bg-black/50" />

      {/* Hero */}
      <section className="relative h-[28vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-2">
          <motion.h1
            variants={heroTitle}
            initial="hidden"
            animate="show"
            className="text-3xl sm:text-5xl md:text-7xl font-[Philosopher] text-gray-200"
          >
            Leave a piece of yourself...
          </motion.h1>
        </div>
      </section>

      {/* 3-Column Layout — sidebars hidden on mobile */}
      <div className="flex w-full min-h-[calc(100vh-28vh)] pb-20 lg:pb-0">

        {/* LEFT SIDEBAR — desktop only */}
        <motion.aside
          variants={sidebarVariant}
          initial="hidden"
          animate="show"
          className="z-10 hidden lg:flex w-[220px] shrink-0 sticky top-0 h-screen px-4 pt-6 flex-col gap-4"
        >
          <LeftSidebar />
        </motion.aside>

        {/* CENTER FEED */}
        <main className="flex-1 z-10 min-w-0 px-3 sm:px-4">
          <PostSection />
        </main>

        {/* RIGHT SIDEBAR — desktop only */}
        <motion.aside
          variants={rightSidebarVariant}
          initial="hidden"
          animate="show"
          className="z-10 hidden lg:block w-[240px] shrink-0 sticky top-0 h-screen overflow-y-auto"
        >
          <UserSidebar />
        </motion.aside>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* FAB — sits above mobile nav */}
      <motion.button
        variants={fabVariant}
        initial="hidden"
        animate="show"
        whileHover={{ scale: 1.12, boxShadow: "0 0 28px rgba(4,4,41,0.7)" }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl flex items-center justify-center shadow-[0_0_20px_rgba(4,4,41,0.5)] z-30"
        aria-label="Create post"
      >
        ✚
      </motion.button>

      {/* Uploading overlay */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
          >
            <div className="w-12 h-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-blue-500 uppercase tracking-widest font-[VT323] text-xl">Uploading...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create post modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              key="modal-card"
              variants={modalCard}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full sm:max-w-[500px] bg-[#0E1116] border border-transparent p-6 flex flex-col gap-4 shadow-[0_0_40px_rgba(4,4,41,0.2)] rounded-t-2xl sm:rounded-2xl"
            >
              {/* Drag handle on mobile */}
              <div className="w-10 h-1 rounded-full bg-gray-700 mx-auto sm:hidden mb-1" />

              <h2 className="text-white  text-2xl font-[VT323] tracking-widest uppercase">
                Create Post
              </h2>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="text-gray-400 text-sm file:bg-blue-900 file:text-white file:border-none file:px-4 file:py-2 file:mr-4 file:rounded-lg"
              />

              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Write something..."
                className="bg-black border border-gray-800 rounded-lg text-white p-3 h-28 resize-none outline-none focus:border-transparent transition-colors text-sm"
              />

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 bg-blue-900 hover:bg-blue-950 py-3 rounded-lg transition-colors disabled:opacity-50 uppercase tracking-widest text-white text-xs"
                >
                  Submit
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg transition-colors uppercase tracking-widest text-white text-xs"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export default Home;