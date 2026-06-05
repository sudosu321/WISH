import { useState, useEffect } from "react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
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

      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowModal(false);
        setImage(null);
        setDesc("");
        setUploading(false);
        const postsRes = await fetch("http://localhost:5000/posts");
        const data = await postsRes.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <title>WISH</title>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <h1 className="absolute text-[8rem] md:text-[12rem] font-black uppercase tracking-widest text-red-950/10 select-none">
          REMEMBER
        </h1>
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl md:text-7xl italic text-gray-200">
            "Find this place familiar ?"
          </h2>
          <p className="mt-6 text-red-700 uppercase tracking-[0.5rem] text-sm">
            WISH - Where I stay human
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0E1116] border border-red-950 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(217,4,41,0.2)]"
            >
              <img
                src={post.img}
                alt={post.user}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="p-3">
                <h3 className="text-red-400 text-sm font-medium">
                  @{post.user}
                </h3>
                <p className="text-gray-500 text-xs mt-1">{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#D90429] text-white text-3xl flex items-center justify-center shadow-[0_0_20px_rgba(217,4,41,0.5)] hover:scale-110 transition-all"
      >
        ✚
      </button>

      {uploading && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin mb-4" />
          <p className="text-red-500 uppercase tracking-widest text-sm font-[VT323] text-xl">
            Uploading...
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[500px] bg-[#0E1116] border border-red-900 p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(217,4,41,0.25)]">
            <h2 className="text-red-500 text-2xl font-[VT323] tracking-widest uppercase">
              Create Post
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-gray-400 file:bg-red-900 file:text-white file:border-none file:px-4 file:py-2 file:mr-4"
            />

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write something..."
              className="bg-black border border-gray-800 text-white p-3 h-32 resize-none outline-none focus:border-red-700"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 bg-[#D90429] hover:bg-[#b10322] py-3 transition-all disabled:opacity-50 uppercase tracking-widest"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;