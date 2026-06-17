import { useState, useEffect } from "react";
import API_URL from "../config";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function PostSection() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

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
    fetchPosts();
  }, []);

  return (
    <div className="px-8 pb-16 ">
      <div className="z-30 columns-2 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}

            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.2, delay: (index % 3) * 0.08, ease: "easeInOut" }}
            whileHover={{ y: -6, scale: 1.03 }}
            onClick={() => setSelectedPost(post)}
            className="z-10
              bg-black/20 backdrop-blur-lg
              overflow-hidden cursor-pointer
              rounded-md border border-transparent
              shadow-[0_0_20px_rgba(4,4,41,0.15)]
              hover:shadow-[0_0_35px_rgba(4,4,41,0.25)]
              transition-colors duration-200
            "
          >
             <div
              className="absolute inset-0 -z-10 scale-110"
              style={{
                backgroundImage: `url(${post.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(18px) brightness(0.5) saturate(1.4)",
              }}
            />
            <div className="overflow-hidden">
              <motion.img
                src={post.img}
                alt={post.user}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
              
            </div>
            
            <div className="p-3">
              <h3 className="text-white text-sm font-[Rajdhani] truncate">
                @{post.user}
              </h3>
              <p className="text-white text-xs font-[Core]  truncate">{post.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal with AnimatePresence for exit animation */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setSelectedPost(null)}
            
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0, y: 200  }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="
                 relative overflow-hidden bg-black/40 backdrop-blur-md
                 rounded-2xl
                 max-w-4xl max-h-[90vh] 
                shadow-[0_0_30px_rgba(4,4,41,0.30)]
              "
              onClick={(e) => e.stopPropagation()}
              
            >
              
              <motion.img
                src={selectedPost.img}
                alt=""
                className="w-full max-h-[70vh] object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0.6, ease: "easeInOut" }}
              />
              <div
                className="absolute inset-0 -z-10 scale-110"
                style={{
                  backgroundImage: `url(${selectedPost.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(25px) brightness(0.35) saturate(1.5)",
                }}
              />
              <motion.div
                className="p-6"
              >
                <Link to={`/user/${selectedPost.user}`}>
                  <h2 className="text-white text-xl font-[Cormorant] uppercase tracking-wide ">
                    @{selectedPost.user}
                  </h2>
                  <p className="mt-4 text-gray-300 font-[Cormorant] ">{selectedPost.desc}</p>
                </Link>
              </motion.div>

              <motion.button
                onClick={() => setSelectedPost(null)}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(214,0,0,0.8)" }}
                whileTap={{ scale: 0.95 }}
                className="
                  absolute top-3 right-3 w-10 h-10
                  font-[VT323] text-2xl
                  bg-black/40 backdrop-blur-md border rounded-lg text-white
                   hover:text-white transition-colors
                "
              >
                X
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PostSection;