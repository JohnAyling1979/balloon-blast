import { useContext, useState } from "react";
import { CanvasContext } from "../canvas/Canvas";
import { getBalloons, getSky } from "../../constans";
import styles from "./GameState.module.css";

type elementType = {
  action: (ctx: CanvasRenderingContext2D) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

type GameStateType = {
  score: number;
  length: number;
  state: string;
  sequence: number[];
  playerSequence: number[];
  instructions: string;
  elements: elementType[];
  backgroundImage: HTMLImageElement;
  time: number;
}

function GameState() {
  const ctx = useContext(CanvasContext);
  const [gameState, setGameState] = useState<GameStateType>({
    score: 0,
    length: 3,
    state: 'intro',
    sequence: [],
    playerSequence: [],
    instructions: 'The party is about to start! You must copy the pattern to blow up the balloon. Enter the wrong pattern and the balloon will pop! Loose 3 balloons and your out of breath and the party starts',
    elements: getBalloons(20),
    backgroundImage: getSky(),
    time: 0,
  });

  const draw = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.drawImage(gameState.backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

      gameState.elements.forEach((element) => {
        element.draw(ctx);
        element.action(ctx);
      });
    }

    setGameState((prevState) => ({
      ...prevState,
      time: prevState.time + 1,
    }));
  }

  requestAnimationFrame(draw);

  return (
    <div className={styles.root}>
      {gameState.state === 'intro' && (
        <button className={styles.startButton} onClick={() => setGameState((prevState) => ({
          ...prevState,
          state: 'instructions',
          elements: [],
        }))}>
          Start
        </button>
      )}
      {gameState.state === 'instructions' && (
        <div>{gameState.instructions}</div>
      )}
    </div>
  )
}

export default GameState;
