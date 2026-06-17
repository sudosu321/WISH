import { useState, useEffect } from "react";
import API_URL from "../config";
import { Link } from "react-router-dom";
function Sidebar(){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/users`);
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    return(<>
       
    
    <div className={`  
        fixed top-0 right-0 h-screen 
        bg-black/10 backdrop-blur-xl
          shadow-[-8px_0_30px_rgba(2,4,41,0.4)]
        overflow-y-auto
       w-64 opacity-100
      `}>
        <div className="p-5 pt-10 min-w-[288px]">
          <h2 className="text-white uppercase font-[VT323] tracking-widest mb-4 text-xl">
            Connected Humans
          </h2>
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/user/${user.username}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 hover:scale-105 transition-all"
            >
              <img
                src={user.avatar_img || "/def_avatar.png"}
                onError={(e) => { e.target.src = "/def_avatar.png"; }}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-white font-[Rajdhani] text-md capitalize truncate">{user.name || user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </>);
}
export default Sidebar;