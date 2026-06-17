import { motion } from "framer-motion";
import MeteorShower from "./MeteorShower";

function LoadingProfile(){
    return (<div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/w1.png')" }}
    >
      <MeteorShower density={5}/>
      <title>Loading...</title>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-80 p-8 bg-black/50 backdrop-blur-md border border-blue-900/30 rounded-3xl shadow-[0_0_40px_rgba(217,4,41,0.15)] flex flex-col items-center gap-4"
      >
        <div className="w-10 h-10 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-500 font-[VT323] text-xl uppercase tracking-widest text-center">
          Loading profile...
        </p>
      </motion.div>
    </div>);
}
export default LoadingProfile;