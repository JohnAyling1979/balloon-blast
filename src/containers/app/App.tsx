import { useEffect, useState } from "react";
import Atributes from "../../components/attributes/Atributes";
import Canvas from "../../components/canvas/Canvas";
import GameState from "../../components/gamestate/GameState";
import Header from "../../components/header/Header";
import styles from "./App.module.css";

function App() {
  const [canvasWidth, setCanasWidth] = useState(0);
  const [canvasHeight, setCanasHeight] = useState(0);

  useEffect(() => {
    const setCanvasSize = () => {
      if (window.innerWidth > 800) {
        setCanasWidth(800);
        setCanasHeight(600);
      } else {
        setCanasWidth(300);
        setCanasHeight(600);
      }
    }

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    }
  }, []);

  return (
    <div className={styles.root}>
      <Atributes canvasWidth={canvasWidth} />
      <Header />
      <Canvas canvasWidth={canvasWidth} canvasHeight={canvasHeight}>
        <GameState />
      </Canvas>
    </div>
  );
}

export default App;
