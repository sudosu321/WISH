import { useState, useEffect } from "react";
import API_URL from "../config";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMe = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;
        const res = await fetch(`${API_URL}/users/${username}`);
        const data = await res.json();
        setMe(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
    fetchUsers();
    fetchMe();
  }, []);

  const handleSubmit = async () => {
    if (!image || !desc) {
      alert("Please fill all fields");
      return;
    }

    try {
      setUploading(true);
      const username = localStorage.getItem("username");
      const formData = new FormData();
      formData.append("username", username);
      formData.append("description", desc);
      formData.append("image", image);

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowModal(false);
        setImage(null);
        setDesc("");
        setUploading(false);
        const postsRes = await fetch(`${API_URL}/posts`);
        const data = await postsRes.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/w1.png')" }}
      />

      <title>Homepage</title>

      {/* Floating user bar */}
      {me && (
        <Link
          to={`/user/${me.username}`}
          className="
            fixed top-5 left-5 z-50
            flex items-center gap-3
            px-4 py-2
            bg-black/40 backdrop-blur-md
            border border-red-900/70 rounded-2xl
            shadow-[0_0_20px_rgba(217,4,41,0.20)]
            hover:border-red-600 hover:shadow-[0_0_28px_rgba(217,4,41,0.40)] hover:bg-black/60
            transition-all duration-300 group
          "
        >
          <img
            src={me.avatar_img || "/def_avatar.png"}
            onError={(e) => { e.target.src = "/def_avatar.png"; }}
            alt={me.name}
            className="w-14 h-14 rounded-full object-cover border border-red-700 group-hover:border-red-400 transition-colors"
          />
          <div className="w-32">
            <p className="text-red-400 text-lg font-[VT323] tracking-wide uppercase group-hover:text-red-300 transition-colors truncate">
              {me.name || me.username}
            </p>
            <p className="text-gray-600 text-xs truncate">@{me.username}</p>
          </div>
        </Link>
      )}

      {/* Sidebar toggle — vertically centered, flush to right */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="
          fixed top-1/2 -translate-y-1/2 right-0 z-50
          w-7 h-14
          flex items-center justify-center
          bg-black/40 backdrop-blur-md
          border border-red-900/70 border-r-0
          rounded-l-xl
          text-red-400 hover:text-red-300
          hover:bg-black/60 hover:border-red-600
          transition-all
          shadow-[-4px_0_12px_rgba(217,4,41,0.15)]
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 transition-transform duration-300 ${showSidebar ? "rotate-0" : "rotate-180"}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent" />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl md:text-8xl font-[VT323] text-gray-200">
            Leave a piece of yourself...
          </h2>
          <p className="mt-6 text-amber-50 uppercase tracking-[0.5rem] text-sm">
            WISH - Where I stay human
          </p>
        </div>
      </section>

      {/* Posts — full width, no sidebar in flow */}
      <div className="px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="
                bg-black/20 backdrop-blur-lg border border-red-950/70
                overflow-hidden cursor-pointer transition-all duration-300 ease-out
                rounded-3xl hover:-translate-y-1 hover:scale-105 hover:border-red-700
                shadow-[0_0_20px_rgba(217,4,41,0.15)] hover:shadow-[0_0_35px_rgba(217,4,41,0.35)]
              "
            >
              <img
                src={post.img}
                alt={post.user}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <h3 className="text-red-400 text-sm font-medium truncate">@{post.user}</h3>
                <p className="text-gray-500 text-xs mt-1 truncate">{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating sidebar (overlays content) ── */}
      <div className={` mt-5 rounded-3xl
        fixed top-0 right-0 h-screen z-40
        transition-all duration-300 ease-in-out
        bg-black/30 backdrop-blur-xl
        border-l border-red-950/70
        shadow-[-8px_0_30px_rgba(217,4,41,0.12)]
        overflow-y-auto
        ${showSidebar ? "w-100 opacity-100" : "w-0 opacity-0 pointer-events-none"}
      `}>
        <div className="p-5 pt-10 min-w-[288px]">
          <h2 className="text-red-400 uppercase tracking-widest mb-4 text-sm">
            Connected Humans
          </h2>
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/user/${user.username}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <img
                src={user.avatar_img || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-red-400 text-sm truncate">{user.name || user.username}</p>
                <p className="text-gray-500 text-xs truncate">{user.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#D90429] text-white text-3xl flex items-center justify-center shadow-[0_0_20px_rgba(217,4,41,0.5)] hover:scale-110 transition-all z-30"
      >
        ✚
      </button>

      {/* Uploading overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin mb-4" />
          <p className="text-red-500 uppercase tracking-widest font-[VT323] text-xl">
            Uploading...
          </p>
        </div>
      )}

      {/* Create post modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[500px] bg-[#0E1116] border border-red-900 p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(217,4,41,0.25)] rounded-2xl">
            <h2 className="text-red-500 text-2xl font-[VT323] tracking-widest uppercase">
              Create Post
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-gray-400 file:bg-red-900 file:text-white file:border-none file:px-4 file:py-2 file:mr-4 file:rounded-lg"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write something..."
              className="bg-black border border-gray-800 rounded-lg text-white p-3 h-32 resize-none outline-none focus:border-red-700 transition-colors"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 bg-[#D90429] hover:bg-[#b10322] py-3 rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest text-white text-sm"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg transition-all uppercase tracking-widest text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="
              relative bg-black/40 backdrop-blur-md
              border border-red-900 rounded-2xl
              w-full max-w-4xl max-h-[90vh] overflow-auto
              shadow-[0_0_30px_rgba(217,4,41,0.30)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPost.img} alt="" className="w-full max-h-[70vh] object-contain" />
            <div className="p-6">
              <h2 className="text-red-500 text-xl font-bold">@{selectedPost.user}</h2>
              <p className="mt-4 text-gray-300">{selectedPost.desc}</p>
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="
                absolute top-3 right-3 w-10 h-10
                font-[VT323] text-2xl
                bg-black/40 backdrop-blur-md border border-red-900 rounded-lg
                text-red-500 hover:bg-red-900 hover:text-white transition-colors
              "
            >
              X
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;