import { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../canvas/Canvas";
import { getBalloons, getSky } from "../../constans";
import styles from "./GameState.module.css";


type elementType = {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
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
    elements: [],
    backgroundImage: getSky(),
  });

  useEffect(() => {
    setGameState((prevState) => ({
      ...prevState,
      elements: getBalloons(20).map((balloon) => ({
        x: Math.random() * 800 - 1000,
        y: Math.random() * (ctx?.canvas?.height ?? 100),
        width: 120,
        height: 240,
        image: balloon,
      })),
    }));
  }, []);

  const draw = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.drawImage(gameState.backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

      gameState.elements.forEach((element) => {
        ctx.drawImage(element.image, element.x, Math.sin(element.x / 50) * 50 + element.y, element.width, element.height);
      });

      setGameState((prevState) => {
        return ({
          ...prevState,
          elements: prevState.elements.map((element) => {
            let x = element.x + .5;
            let y = element.y;

            if (x > ctx.canvas.width) {
              x = Math.random() * 800 - 1000;
              y = Math.random() * ctx.canvas.height;
            }

            return ({
              ...element,
              x,
              y,
            })
          }),
        })
      });
    }
  }

  requestAnimationFrame(draw);
  if (gameState.state === 'intro') {
    return (
      <div>
        <button className={styles.startButton} onClick={() => setGameState((prevState) => ({
          ...prevState,
          state: 'instructions',
          elements: [],
        }))}>
          Start
        </button>
      </div>
    );
  }

  if (gameState.state === 'instructions') {
    return <div>{gameState.instructions}</div>
  }

  return null
}

export default GameState;
