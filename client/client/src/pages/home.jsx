import { useState, useEffect } from "react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://wish-kc7i.onrender.com/posts");
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

      const res = await fetch("https://wish-kc7i.onrender.com/posts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowModal(false);
        setImage(null);
        setDesc("");
        setUploading(false);
        const postsRes = await fetch("https://wish-kc7i.onrender.com/posts");
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

      <div
        className="
          fixed
          inset-0
          -z-10
          bg-cover
          bg-center
          scale-110
        "
        style={{
          backgroundImage: "url('/w1.png')"
        }}
      />
      <title>Homepage</title>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent " />

        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl md:text-8xl font-[VT323] text-gray-200">
           Leave a piece of yourself...
          </h2>
          <p className="mt-6 text-amber-50 uppercase tracking-[0.5rem] text-sm">
            WISH - Where I stay human
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="
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
                hover:shadow-[0_0_35px_rgba(217,4,41,0.35)]
              "
            >
              <img
                src={post.img}
                alt={post.user}
                className="w-full  bg-black/40
          backdrop-blur-md aspect-[4/4] object-cover"
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
          <p className="text-red-500 uppercase tracking-widest text-m font-[VT323] text-xl">
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
      {selectedPost && (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={() => setSelectedPost(null)}
      >
        <div
          className="
            bg-black/40
          backdrop-blur-md
            border border-red-900
            rounded-2xl
            w-[70%]
            max-w-5xl
            max-h-[90vh]
            overflow-auto
          "
          onClick={(e) => e.stopPropagation()}
        >

          <img
            src={selectedPost.img}
            alt=""
            className="w-full max-h-[70vh] object-contain"
          />

          <div className="p-6">
            <h2 className="text-red-500 text-xl font-bold">
              @{selectedPost.user}
            </h2>

            <p className="mt-4 text-gray-300">
              {selectedPost.desc}
            </p>

            <button
              onClick={() => setSelectedPost(null)}
              className="
                absolute
                top-3
                right-3
                w-10
                h-10
                font-[VT323]
                text-2xl
               bg-black/40
                backdrop-blur-md
                border border-red-900
                text-red-500
                hover:bg-red-900
                hover:text-white
              "
            >
              X
            </button>
          </div>

        </div>
      </div>
    )}
    </div>
  );
}

export default Home;