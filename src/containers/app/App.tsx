import Atributes from "../../components/attributes/Atributes";
import Canvas from "../../components/canvas/Canvas";
import GameState from "../../components/gamestate/GameState";
import Header from "../../components/header/Header";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.root}>
      <Atributes />
      <Header />
      <Canvas>
        <GameState />
      </Canvas>
    </div>
  );
}

export default App;
