import { useState, useEffect } from "react";
import API_URL from "../config";
import { Link } from "react-router-dom";

function Sidebar(){
    const [me, setMe] = useState(null);

  useEffect(() => {
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
    fetchMe();
  }, []);

    return(
    <div className={`  
        fixed top-0 left-0 h-screen 
        bg-black/10 backdrop-blur-xl
          shadow-[8px_0_30px_rgba(2,4,41,0.4)]
        overflow-y-auto
       w-60 opacity-100
      `}
    >
     {me ? (
            <Link
              to={`/user/${me.username}`}
              className="
                mt-8 mx-2
                flex items-center gap-3
                px-4 py-3
                bg-black/40 backdrop-blur-md
                border border-transparent rounded-2xl
                shadow-[0_0_20px_rgba(4,4,41,0.20)]
               hover:shadow-[0_0_28px_rgba(4,4,41,0.40)] hover:bg-black/60 hover:scale-105
                transition-all duration-300 group"
            >
              <img
                src={me.avatar_img || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt={me.name}
                className="w-12 h-12 rounded-full object-cover bordertransition-colors shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-white text-lg font-[VT323] tracking-wide uppercase group-hover:text-wh
                -300 transition-colors truncate">
                  {me.name || me.username}
                </p>
                <p className="text-gray-500 text-xs truncate">@{me.username}</p>
              </div>
            </Link>
          ) : (
            <div className="px-4 mt-8 mx-2 py-3 bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl">
              <p className="text-white/60 text-sm font-[VT323] uppercase tracking-widest">Not logged in</p>
            </div>
          )}

          <div className="mt-4 mx-2 px-4 py-3 bg-black/20 backdrop-blur-sm  rounded-2xl">
            <p className="text-white/60 text-xs font-[VT323] uppercase tracking-widest text-center">
              Features coming soon !
            </p>
          </div>
      <div/>
      </div>);
}
export default Sidebar;