import { useState } from "react";
import "./App.css";
import FacialExpression from "./components/FacialExpression";
import Songs from "./components/Songs";

function App() {
    const [songs, setSongs] = useState([]);


    
  return (
    <>
      <FacialExpression setSongs={setSongs}/>
      <Songs songs={songs}/>
    </>
  );
}

export default App;
