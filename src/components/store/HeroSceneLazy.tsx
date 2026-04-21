/**
 * Lazy wrapper — dynamically imports HeroScene with no SSR.
 * Three.js requires the browser's WebGL context; it cannot run on the server.
 */
import dynamic from "next/dynamic";

//const //HeroScene = //dynamic(()=> import("./Heroscene")),


const HeroScene = dynamic(() => import ("./Heroscene"),{

    loading:() => (
        <div style={{
            position:"absolute",inset:0,
            background:"radial-gradient(ellipse 80% 60% at 70% 50%, #071A38 0%, #020B19 70%)",
        }}>
        </div>

    )
});


export default HeroScene;
