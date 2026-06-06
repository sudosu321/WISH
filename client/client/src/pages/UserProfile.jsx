import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";

function UserProfile() {
  const { username } = useParams();
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const loggedInUser = localStorage.getItem("username");
  const isOwnProfile = loggedInUser === username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${API_URL}/users/${username}`);
      const data = await res.json();
      setUser(data.user);
      setPosts(data.posts);
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
    const fetchAllPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        setAllPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
    fetchUser();
    fetchAllPosts();
  }, [username]);

  const openEditModal = () => {
    setEditName(user.name || "");
    setEditTagline(user.tagline || "");
    setEditBio(user.bio || "");
    setEditAvatar(null);
    setEditAvatarPreview(user.avatar_img || null);
    setShowEditModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditAvatar(file);
    setEditAvatarPreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name",    editName.trim().slice(0, 14));
      formData.append("tagline", editTagline.trim().slice(0, 20));
      formData.append("bio",     editBio.trim().slice(0, 60));
      if (editAvatar) formData.append("avatar", editAvatar);

      const res = await fetch(`${API_URL}/users/${username}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated.user ?? { ...user, name: editName, tagline: editTagline, bio: editBio, avatar_img: editAvatarPreview });
        setShowEditModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user)  return (
    
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-cover
        bg-center
        bg-fixed
        relative
      "
      style={{
        backgroundImage: "url('/w1.png')"
      }}
    >      
      <title>Loading...</title>
      <div
        className="
          w-96
          p-8
          bg-black/40
          backdrop-blur-md
          border
          rounded-3xl
          border-red-900
          shadow-[0_0_30px_rgba(217,4,41,0.50)]
          flex
          flex-col
          gap-4
        "
      >
        <h1
          className="
            text-center
            text-[#D90429]
            text-xl
            font-[VT323]
            uppercase
            drop-shadow-[0_0_12px_rgba(217,4,41,0.7)]
          "
        >
          Wait while we load for you ...
        </h1>  
      </div>
    </div>
  );

  const otherPosts = allPosts.filter((p) => p.user !== username);

  const postCardClass = `
    bg-black/20 backdrop-blur-lg border border-red-950/70
    overflow-hidden cursor-pointer transition-all duration-300 ease-out
    rounded-3xl hover:-translate-y-1 hover:scale-105 hover:border-red-700
    shadow-[0_0_20px_rgba(217,4,41,0.15)] hover:shadow-[0_0_30px_rgba(217,4,41,0.35)]
  `;

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center scale-100"
        style={{ backgroundImage: "url('/w1.png')" }}
      />

      {/* Home button */}
      <Link
        to="/home"
        className="
          fixed top-6 left-6 z-50
          w-10 h-10 flex items-center justify-center
          bg-black/40 backdrop-blur-md border border-red-900 rounded-xl
          text-red-500 hover:bg-red-900 hover:text-white
          transition-colors shadow-[0_0_15px_rgba(217,4,41,0.20)]
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </Link>

      {/* Sidebar toggle button — always visible, flush to right edge */}
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

      <title>{user.name}</title>

      {/* ── Full width content ── */}
      <div className="px-8 pt-10 pb-16">

        {/* Profile card */}
        <div className={`
        bg-black/40 backdrop-blur-md border rounded-3xl p-5 md:p-8 flex flex-col sm:flex-row items-center gap-4 md:gap-8 relative
        ${isOwnProfile
          ? "border-blue-500/60 shadow-[0_0_30px_rgba(0,150,255,0.25)]"
          : "border-red-900 shadow-[0_0_30px_rgba(217,4,41,0.30)]"
        }
      `}>
          <img
            src={user.avatar_img || "/def_avatar.png"}
            onError={(e) => { e.target.src = "/def_avatar.png"; }}
            alt=""
            className="w-32 h-32 rounded-full object-cover border-2 border-red-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-[#D90429] text-4xl font-[VT323] uppercase truncate">
              {user.name || user.username}
            </h1>
            <p className="text-gray-500 mt-1">@{user.username}</p>
            <p className="text-red-400 italic mt-4 text-lg truncate">{user.tagline}</p>
            <p className="text-gray-300 mt-4 max-w-2xl">{user.bio}</p>
          </div>

          {isOwnProfile && (
            <button
              onClick={openEditModal}
              className="
                absolute top-5 right-5
                flex items-center gap-2 px-4 py-2
                bg-black/40 backdrop-blur-md border border-red-900/70 rounded-xl
                text-red-400 text-sm
                hover:bg-red-900/40 hover:border-red-600 hover:text-red-300
                transition-all shadow-[0_0_12px_rgba(217,4,41,0.15)]
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* User's own posts */}
        {posts.length > 0 && (
          <div className="mt-10 bg-black/40 backdrop-blur-md border border-red-900 rounded-3xl p-8 shadow-[0_0_30px_rgba(217,4,41,0.30)]">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-[#D90429] font-[VT323] text-3xl uppercase tracking-widest whitespace-nowrap">
                {user.name || user.username}'s Posts
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-red-900/60 to-transparent" />
              <span className="text-gray-600 text-xs uppercase tracking-widest">{posts.length} posts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div key={post.id} onClick={() => setSelectedPost(post)} className={postCardClass}>
                  <img src={post.img} alt={post.user} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <h3 className="text-red-400 text-sm font-medium truncate">@{post.user}</h3>
                    <p className="text-gray-500 text-xs mt-1 truncate">{post.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community posts */}
        {otherPosts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-4 mb-6 bg-black/40 backdrop-blur-md border border-red-900 rounded-2xl px-6 py-4">
              <h2 className="text-gray-400 font-[VT323] text-3xl uppercase tracking-widest whitespace-nowrap">
                From the Community
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-700/60 to-transparent" />
              <span className="text-gray-600 text-xs uppercase tracking-widest">{otherPosts.length} posts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherPosts.map((post) => (
                <div key={post.id} onClick={() => setSelectedPost(post)} className={postCardClass}>
                  <img src={post.img} alt={post.user} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <Link
                      to={`/user/${post.user}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-red-400 text-sm font-medium hover:text-red-300 transition-colors truncate block"
                    >
                      @{post.user}
                    </Link>
                    <p className="text-gray-500 text-xs mt-1 truncate">{post.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
          {users.map((u) => (
            <Link
              key={u.id}
              to={`/user/${u.username}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <img
                src={u.avatar_img || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-red-400 text-sm truncate">{u.name || u.username}</p>
                <p className="text-gray-500 text-xs truncate">{u.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="
              relative w-full max-w-[520px]
              bg-[#0E1116] border border-red-900
              rounded-2xl p-8
              shadow-[0_0_40px_rgba(217,4,41,0.30)]
              flex flex-col gap-5
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-red-500 text-3xl font-[VT323] tracking-widest uppercase">
              Edit Profile
            </h2>

            {/* Avatar picker */}
            <div className="flex items-center gap-5">
              <img
                src={editAvatarPreview || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-red-700 shrink-0"
              />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Profile Picture</p>
                <label className="
                  cursor-pointer px-4 py-2 text-sm
                  bg-black border border-red-900/70 rounded-lg
                  text-red-400 hover:bg-red-900/30 hover:border-red-600
                  transition-all
                ">
                  Choose Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="text-gray-500 text-xs uppercase tracking-widest">Name</label>
                <span className="text-gray-600 text-xs">{editName.length}/14</span>
              </div>
              <input
                type="text" maxLength={14}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="bg-black border border-gray-800 rounded-lg text-white px-4 py-2 text-sm outline-none focus:border-red-700 transition-colors"
              />
            </div>

            {/* Tagline */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="text-gray-500 text-xs uppercase tracking-widest">Tagline</label>
                <span className="text-gray-600 text-xs">{editTagline.length}/20</span>
              </div>
              <input
                type="text" maxLength={20}
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                placeholder="A short line about you"
                className="bg-black border border-gray-800 rounded-lg text-white px-4 py-2 text-sm outline-none focus:border-red-700 transition-colors"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="text-gray-500 text-xs uppercase tracking-widest">Bio</label>
                <span className="text-gray-600 text-xs">{editBio.length}/60</span>
              </div>
              <textarea
                maxLength={60}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell the world who you are..."
                rows={3}
                className="bg-black border border-gray-800 rounded-lg text-white px-4 py-2 text-sm outline-none focus:border-red-700 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 mt-1">
              <button
                onClick={handleEditSubmit}
                disabled={saving}
                className="flex-1 py-3 rounded-lg bg-[#D90429] hover:bg-[#b10322] text-white text-sm uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-[VT323] text-xl bg-black/40 border border-red-900 rounded-lg text-red-500 hover:bg-red-900 hover:text-white transition-colors"
            >
              X
            </button>
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
            className="relative bg-black/40 backdrop-blur-md border border-red-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-[0_0_30px_rgba(217,4,41,0.30)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPost.img} alt="" className="w-full max-h-[70vh] object-contain" />
            <div className="p-6">
              <Link to={`/user/${selectedPost.user}`}>
              <h2 className="text-red-500 text-xl font-bold">@{selectedPost.user}</h2>
              <p className="mt-4 text-gray-300">{selectedPost.desc}</p></Link>
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 w-10 h-10 font-[VT323] text-2xl bg-black/40 backdrop-blur-md border border-red-900 rounded-lg text-red-500 hover:bg-red-900 hover:text-white transition-colors"
            >
              X
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserProfile;