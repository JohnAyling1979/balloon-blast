import { useContext, useEffect, useRef, useState } from "react";
import { CanvasContext, CanvasContextType } from "../canvas/Canvas";
import { BALLOONS, getBalloons, getSky } from "../../constans";
import styles from "./GameState.module.css";
import { balloonFactory } from "../balloon/Ballon";
import { buttonFactory } from "../button/Button";

type elementType = {
  action: (ctx: CanvasRenderingContext2D) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  pressed?: () => void;
}

type GameStateType = {
  state: string;
  time: number;
}

function GameState() {
  const { ctx, canvasRef } = useContext(CanvasContext) as CanvasContextType;
  const elementsRef = useRef<elementType[]>([...getBalloons(20), balloonFactory(400, 300, 1, 'blue', 'floatRight')]);
  const backgroundImageRef = useRef(getSky());
  const scoreRef = useRef(0);
  const lengthRef = useRef(3);
  const sequenceRef = useRef<number[]>([Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]);
  const playerSequenceRef = useRef<number[]>([]);
  const [gameState, setGameState] = useState<GameStateType>({
    state: 'intro',
    time: 0,
  });

  const draw = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.drawImage(backgroundImageRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);

      elementsRef.current.forEach((element) => {
        element.draw(ctx);
        element.action(ctx);
      });
    }

    if (gameState.state === 'playing sequence') {
      const activeButton = gameState.time % 50 === 0 ? sequenceRef.current[gameState.time / 50]  : undefined;
      if (activeButton !== undefined) {
        elementsRef.current[activeButton + 1]?.pressed?.();
      }
    }

    setGameState((prevState) => ({
      ...prevState,
      time: prevState.time + 1,
    }));
  }

  const startGame = (event: MouseEvent) => {
    const x = event.x - canvasRef.current?.offsetLeft!;
    const y = event.y - canvasRef.current?.offsetTop!;

    if (x > 340 && x < 460 && y > 140 && y < 265) {
      canvasRef.current?.removeEventListener('click', startGame);

      elementsRef.current = [
        balloonFactory(
          400,
          300,
          1 / lengthRef.current,
          BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
          'none'
        ),
        buttonFactory(250, 500, 1, 'blue'),
        buttonFactory(350, 500, 1, 'green'),
        buttonFactory(450, 500, 1, 'purple'),
        buttonFactory(550, 500, 1, 'red'),
      ];

      setGameState((prevState) => ({
        ...prevState,
        state: 'playing sequence',
        time: 0,
      }));
    }
  }

  const showInstructions = () => {
    canvasRef.current?.addEventListener('click', startGame);
    elementsRef.current = [
      balloonFactory(
        400,
        300,
        1,
        'blue',
        'pulse'
      )
    ];

    setGameState((prevState) => ({
      ...prevState,
      state: 'instructions',
      time: 0,
    }));
  }

  requestAnimationFrame(draw);

  console.log(sequenceRef.current, playerSequenceRef.current);
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
