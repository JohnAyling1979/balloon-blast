import { useContext, useRef, useState } from "react";
import { CanvasContext, CanvasContextType } from "../canvas/Canvas";
import { BALLOONS, getBalloons, getSky } from "../../constans";
import styles from "./GameState.module.css";
import { BalloonType, balloonFactory } from "../balloon/Ballon";
import { ButtonType, buttonFactory } from "../button/Button";

type GameStateType = {
  state: string;
  time: number;
}

function GameState() {
  const { ctx, canvasRef } = useContext(CanvasContext) as CanvasContextType;
  const backgroundImageRef = useRef(getSky());
  const balloonsRef = useRef<BalloonType[]>([...getBalloons(20), balloonFactory(400, 300, 1, 'blue', 'floatRight')]);
  const buttonsRef = useRef<ButtonType[]>([]);
  const scoreRef = useRef<BalloonType[]>([]);
  const popRef = useRef<number>(0);
  const lengthRef = useRef(3);
  const sequenceRef = useRef<number[]>([Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]);
  const playerSequenceRef = useRef<number[]>([]);
  const [gameState, setGameState] = useState<GameStateType>({
    state: 'intro',
    time: 0,
  });

  const renderScreen = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(backgroundImageRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);
    scoreRef.current.forEach((element) => {
      element.draw(ctx);
    });
    balloonsRef.current.forEach((element) => {
      element.draw(ctx);
      element.action(ctx);
    });
    buttonsRef.current.forEach((element) => {
      element.draw(ctx);
      element.action();
    });

    if (gameState.state === 'playing sequence') {
      ctx.font = '18px Arial';
      ctx.fillStyle = 'green';
      ctx.fillText('Watch the pattern', 340, 400);
      const activeButton = gameState.time >= 100 && gameState.time % 50 === 0 ? sequenceRef.current[gameState.time / 50 - 2] : undefined;

      if (activeButton !== undefined) {
        buttonsRef.current[activeButton]?.pressed?.();
      }

      if (gameState.time > lengthRef.current * 50 + 100) {
        canvasRef.current?.addEventListener('click', playerTurn);

        setGameState((prevState) => ({
          ...prevState,
          state: 'player turn',
          time: 0,
        }));

        return
      }
    } else if (gameState.state === 'player turn') {
      if (playerSequenceRef.current.length === lengthRef.current && !balloonsRef.current[0].isAnimating()) {
        lengthRef.current += 1;
        playerSequenceRef.current = [];

        scoreRef.current.push(balloonsRef.current[0]);
        scoreRef.current[scoreRef.current.length - 1].score(scoreRef.current.length * 20);

        balloonsRef.current = [
          balloonFactory(
            400,
            300,
            1 / lengthRef.current,
            BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
            'none'
          ),
        ];

        sequenceRef.current = [];

        Array(lengthRef.current).fill(0).forEach(() => {
          sequenceRef.current.push(Math.floor(Math.random() * 4));
        });

        setGameState((prevState) => ({
          ...prevState,
          state: 'playing sequence',
          time: 0,
        }));
      }
    } else if (gameState.state === 'game over') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = 'red';
      ctx.font = '80px BallonCaps';
      ctx.fillText('Game Over', 180, 200);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('Click to play again', 340, 300);
    }

    setGameState((prevState) => ({
      ...prevState,
      time: prevState.time + 1,
    }));
  }

  const restart = () => {
    canvasRef.current?.removeEventListener('click', restart);
    popRef.current = 0;
    lengthRef.current = 3;
    sequenceRef.current = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    playerSequenceRef.current = [];
    scoreRef.current = [];
    balloonsRef.current = [
      balloonFactory(
        400,
        300,
        1 / lengthRef.current,
        BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
        'none'
      ),
    ];

    setGameState((prevState) => ({
      ...prevState,
      state: 'playing sequence',
      time: 0,
    }));
  }

  const playerTurn = (event: MouseEvent) => {
    const x = event.x - canvasRef.current?.offsetLeft!;
    const y = event.y - canvasRef.current?.offsetTop!;
    let buttonPressed = -1;

    if (y > 470 && y < 530) {
      if (x > 220 && x < 280) {
        buttonPressed = 0;
      } else if (x > 320 && x < 380) {
        buttonPressed = 1;
      } else if (x > 420 && x < 480) {
        buttonPressed = 2;
      } else if (x > 520 && x < 580) {
        buttonPressed = 3;
      }

      if (buttonPressed !== -1) {
        buttonsRef.current[buttonPressed]?.pressed?.();
        const currentElement = playerSequenceRef.current.length;

        if (sequenceRef.current[currentElement] !== buttonPressed) {
          canvasRef.current?.removeEventListener('click', playerTurn);
          popRef.current += 1;

          if (popRef.current === 3) {
            balloonsRef.current[0].pop();

            canvasRef.current?.addEventListener('click', restart);

            setGameState((prevState) => ({
              ...prevState,
              state: 'game over',
              time: 0,
            }));
          } else {
            balloonsRef.current[0].pop(false);
            playerSequenceRef.current = [];

            balloonsRef.current = [
              balloonFactory(
                400,
                300,
                1 / lengthRef.current,
                BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
                'none'
              ),
            ];

            setGameState((prevState) => ({
              ...prevState,
              state: 'playing sequence',
              time: 0,
            }));
          }
        } else {
          balloonsRef.current[0].inflate(1 / lengthRef.current);
          playerSequenceRef.current.push(buttonPressed);
        }

        if (playerSequenceRef.current.length === lengthRef.current) {
          canvasRef.current?.removeEventListener('click', playerTurn);
        }
      }
    }
  }

  const startGame = (event: MouseEvent) => {
    const x = event.x - canvasRef.current?.offsetLeft!;
    const y = event.y - canvasRef.current?.offsetTop!;

    if (x > 340 && x < 460 && y > 140 && y < 265) {
      canvasRef.current?.removeEventListener('click', startGame);

      balloonsRef.current = [
        balloonFactory(
          400,
          300,
          1 / lengthRef.current,
          BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
          'none'
        ),
      ];

      buttonsRef.current = [
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
    balloonsRef.current = [
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

  requestAnimationFrame(renderScreen);

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
      <div>{JSON.stringify(gameState)}</div>
      <div>{JSON.stringify(sequenceRef.current)}</div>
      <div>{JSON.stringify(playerSequenceRef.current)}</div>
    </div>
  )
}

export default GameState;
