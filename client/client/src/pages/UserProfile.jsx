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
    setEditAvatarPreview(user.avatar || null);
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
      formData.append("name",     editName.trim().slice(0, 14));
        formData.append("tagline",  editTagline.trim().slice(0, 20));
        formData.append("bio",      editBio.trim().slice(0, 60));
      if (editAvatar) formData.append("avatar", editAvatar);

      const res = await fetch(`${API_URL}/users/${username}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated.user ?? { ...user, name: editName, tagline: editTagline, bio: editBio, avatar: editAvatarPreview });
        setShowEditModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  if (!user) return <div>Loading...</div>;
  const otherPosts = allPosts.filter((p) => p.user !== username);

  const postCardClass = `
    bg-black/20
    backdrop-blur-lg
    border
    border-red-950/70
    overflow-hidden
    cursor-pointer
    transition-all
    duration-300
    ease-out
    rounded-3xl
    hover:-translate-y-1
    hover:scale-105
    hover:border-red-700
    shadow-[0_0_20px_rgba(217,4,41,0.15)]
    hover:shadow-[0_0_30px_rgba(217,4,41,0.35)]
  `;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/w1.png')" }}
      />
      <Link
        to="/home"
        className="
          fixed top-6 left-6 z-50
          w-10 h-10 flex items-center justify-center
          bg-black/40 backdrop-blur-md
          border border-red-900 rounded-xl
          text-red-500 hover:bg-red-900 hover:text-white
          transition-colors shadow-[0_0_15px_rgba(217,4,41,0.20)]
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </Link>

        <title>{user.name}</title>

      <div className="max-w-7xl mx-auto flex gap-6 px-8 pt-10 pb-16">
        <div className="flex-1 min-w-0">

          {/* Profile card */}
        <div className="
            bg-black/40 backdrop-blur-md border border-red-900
            rounded-3xl p-8 shadow-[0_0_30px_rgba(217,4,41,0.30)]
            flex items-center gap-8 relative
          ">
            <img
              src={user.avatar_img || "/def_avatar.png"}
              alt=""
              className="w-36 h-36 rounded-full object-cover border-2 border-red-700"
            />
            <div className="flex-1">
              <h1 className="text-[#D90429] text-5xl font-[VT323] uppercase">
                {user.name}
              </h1>
              <p className="text-gray-500 mt-1">@{user.username}</p>
              <p className="text-red-400 italic mt-4 text-lg">{user.tagline}</p>
              <p className="text-gray-300 mt-4 max-w-2xl">{user.bio}</p>
            </div>

            {isOwnProfile && (
              <button
                onClick={openEditModal}
                className="
                  absolute top-5 right-5
                  flex items-center gap-2
                  px-4 py-2
                  bg-black/40 backdrop-blur-md
                  border border-red-900/70 rounded-xl
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

          {posts.length > 0 && (
            <div className="mt-10 bg-black/40 backdrop-blur-md border border-red-900 rounded-3xl p-8 shadow-[0_0_30px_rgba(217,4,41,0.30)]">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[#D90429] font-[VT323] text-3xl uppercase tracking-widest whitespace-nowrap">
                  {user.name}'s Posts
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <div key={post.id} onClick={() => setSelectedPost(post)} className={postCardClass}>
                    <img src={post.img} alt={post.user} className="w-full bg-black/40 backdrop-blur-md aspect-square object-cover" />
                    <div className="p-3">
                      <h3 className="text-red-400 text-sm font-medium">@{post.user}</h3>
                      <p className="text-gray-500 text-xs mt-1">{post.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {otherPosts.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-4 mb-6 backdrop-blur-md border bg-black/40 border-red-900 rounded-2xl p-4">
                <h2 className="ml-4 text-gray-400 font-[VT323] text-3xl uppercase tracking-widest whitespace-nowrap">
                  From the Community
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherPosts.map((post) => (
                  <div key={post.id} onClick={() => setSelectedPost(post)} className={postCardClass}>
                    <img src={post.img} alt={post.user} className="w-full bg-black/40 backdrop-blur-md aspect-square object-cover" />
                    <div className="p-3">
                      <Link
                        to={`/user/${post.user}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-red-400 text-sm font-medium hover:text-red-300 transition-colors"
                      >
                        @{post.user}
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">{post.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="
          sticky top-10 h-fit w-72
          bg-black/20 backdrop-blur-lg border border-red-950/70
          rounded-3xl p-5 z-40
          shadow-[0_0_20px_rgba(217,4,41,0.15)]
        ">
          <h2 className="text-red-400 uppercase tracking-widest mb-4">Connected Humans</h2>
          {users.map((u) => (
            <Link
              key={u.id}
              to={`/user/${u.username}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all"
            >
              <img
                src={u.avatar_img || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-red-400 text-sm">{u.name}</p>
                <p className="text-gray-500 text-xs">{u.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="
              relative w-[520px]
              bg-[#0E1116] border border-red-900
              rounded-2xl p-8
              shadow-[0_0_40px_rgba(217,4,41,0.30)]
              flex flex-col gap-5
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-red-500 text-3xl font-[VT323] tracking-widest uppercase">
              Edit Profile
            </h2>

            {/* Avatar picker */}
            <div className="flex items-center gap-5">
              <img
                src={editAvatarPreview || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-red-700"
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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs uppercase tracking-widest">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name (14 letters)"
                className="
                  bg-black border border-gray-800 rounded-lg
                  text-white px-4 py-2 text-sm
                  outline-none focus:border-red-700 transition-colors
                "
              />
            </div>

            {/* Tagline */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs uppercase tracking-widest">Tagline</label>
              <input
                type="text"
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                placeholder="A short line about you (20 letters)"
                className="
                  bg-black border border-gray-800 rounded-lg
                  text-white px-4 py-2 text-sm
                  outline-none focus:border-red-700 transition-colors
                "
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs uppercase tracking-widest">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell the world who you are... (60 letters)"
                rows={4}
                className="
                  bg-black border border-gray-800 rounded-lg
                  text-white px-4 py-2 text-sm
                  outline-none focus:border-red-700 transition-colors
                  resize-none
                "
              />
            </div>
            <div className="flex gap-3 mt-1">
              <button
                onClick={handleEditSubmit}
                disabled={saving}
                className="
                  flex-1 py-3 rounded-lg
                  bg-[#D90429] hover:bg-[#b10322]
                  text-white text-sm uppercase tracking-widest
                  transition-all disabled:opacity-50
                "
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="
                  flex-1 py-3 rounded-lg
                  bg-gray-800 hover:bg-gray-700
                  text-white text-sm uppercase tracking-widest
                  transition-all
                "
              >
                Cancel
              </button>
            </div>
            <button
              onClick={() => setShowEditModal(false)}
              className="
                absolute top-4 right-4
                w-8 h-8 flex items-center justify-center
                font-[VT323] text-xl
                bg-black/40 border border-red-900 rounded-lg
                text-red-500 hover:bg-red-900 hover:text-white
                transition-colors
              "
            >
              X
            </button>
          </div>
        </div>
      )}
      {/* Post modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="
              relative bg-black/40 backdrop-blur-md
              border border-red-900 rounded-2xl
              w-[70%] max-w-5xl max-h-[90vh] overflow-auto
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

export default UserProfile;