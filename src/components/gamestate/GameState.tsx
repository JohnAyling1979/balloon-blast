import { useContext, useEffect, useState } from "react";
import { CanvasContext, CanvasContextType } from "../canvas/Canvas";
import { getBalloons, getSky } from "../../constans";
import styles from "./GameState.module.css";
import { balloonFactory } from "../balloon/Ballon";

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
  elements: elementType[];
  backgroundImage: HTMLImageElement;
  time: number;
}

function GameState() {
  const { ctx, canvasRef } = useContext(CanvasContext) as CanvasContextType;
  const [gameState, setGameState] = useState<GameStateType>({
    score: 0,
    length: 3,
    state: 'intro',
    sequence: [],
    playerSequence: [],
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

  const startGame = (event: MouseEvent) => {
    const x = event.x - canvasRef.current?.offsetLeft!;
    const y = event.y - canvasRef.current?.offsetTop!;

    if (x > 380 && x < 440 && y > 155 && y < 235) {
      canvasRef.current?.removeEventListener('click', startGame);

      setGameState((prevState) => ({
        ...prevState,
        state: 'playing',
        elements: [],
      }));
    }
  }

  const showInstructions = () => {
    canvasRef.current?.addEventListener('click', startGame);


    setGameState((prevState) => ({
      ...prevState,
      state: 'instructions',
      elements: [
        balloonFactory(
          340,
          150,
          1,
          'blue',
          'pulse'
        )
      ],
    }));
  }

  requestAnimationFrame(draw);

  return (
    <div className={styles.root}>
      {gameState.state === 'intro' && (
        <button className={styles.startButton} onClick={showInstructions}>
          Start
        </button>
      )}
      {gameState.state === 'instructions' && (
        <div>
          <div>
            The party is about to start! You must copy the pattern to blow up the balloon. Enter the wrong pattern and the balloon will pop! Loose 3 balloons and your out of breath and the party starts.
          </div>
          <div className={styles.secondSection}>
            Click the balloon to start.
          </div>
        </div>
      )}
    </div>
  )
}

export default GameState;
