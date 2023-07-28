import { useContext, useEffect, useRef, useState } from "react";
import { CanvasContext, CanvasContextType } from "../canvas/Canvas";
import { BALLOONS, getBalloons, getSky } from "../../constans";
import styles from "./GameState.module.css";
import { BalloonType, balloonFactory } from "../balloon/Ballon";
import { ButtonType, buttonFactory } from "../button/Button";
import { gameOverMusic, popped0Music, popped1Music, popped2Music, titleMusic } from "../../music";

type GameStateType = {
  state: string;
  time: number;
}

function GameState() {
  const { ctx, canvasRef } = useContext(CanvasContext) as CanvasContextType;
  const backgroundImageRef = useRef(getSky());
  const balloonsRef = useRef<BalloonType[]>([...getBalloons(20), balloonFactory(ctx.canvas.width / 2, ctx.canvas.height / 2, 1, 'blue', 'floatRight')]);
  const buttonsRef = useRef<ButtonType[]>([]);
  const scoreRef = useRef<BalloonType[]>([]);
  const poppedRef = useRef<BalloonType[]>([]);
  const lengthRef = useRef(3);
  const sequenceRef = useRef<number[]>([Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]);
  const playerSequenceRef = useRef<number[]>([]);
  const backgroundMusicRef = useRef<HTMLAudioElement>(titleMusic);
  const clickListenerRef = useRef<((event: MouseEvent) => void)[]>([]);
  const highScoreRef = useRef<number>(+(localStorage.getItem('balloon-blowout-highScore') || '0'));
  const [gameState, setGameState] = useState<GameStateType>({
    state: 'intro',
    time: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    backgroundMusicRef.current.pause();
    backgroundMusicRef.current.currentTime = 0;

    balloonsRef.current = [...getBalloons(20), balloonFactory(ctx.canvas.width / 2, ctx.canvas.height / 2, 1, 'blue', 'floatRight')];
    buttonsRef.current = [];
    scoreRef.current = [];
    poppedRef.current = [];
    lengthRef.current = 3;
    sequenceRef.current = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    playerSequenceRef.current = [];
    backgroundMusicRef.current = titleMusic;
    setGameState({
      state: 'intro',
      time: 0,
    });

    return () => {
      clickListenerRef.current.forEach((listener) => {
        canvas?.removeEventListener('click', listener);
      });

      clickListenerRef.current = [];
    }
  }, [ctx.canvas.width, ctx.canvas.height, canvasRef]);

  const renderScreen = () => {
    let isAnimating = false;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (ctx.canvas.width < ctx.canvas.height) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, ctx.canvas.width * 3, ctx.canvas.height);
    } else {
      ctx.drawImage(backgroundImageRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    scoreRef.current.forEach((element) => {
      element.draw(ctx);

      if (element.isAnimating()) {
        isAnimating = true;
      }
    });
    poppedRef.current.forEach((element, index) => {
      element.draw(ctx);

      if (!element.isAnimating()) {
        ctx.font = '25px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('X', ctx.canvas.width - (index * 20 + 29), 31);
      }

      if (element.isAnimating()) {
        isAnimating = true;
      }
    });
    balloonsRef.current.forEach((element) => {
      element.draw(ctx);
      element.action(ctx);

      if (element.isAnimating()) {
        isAnimating = true;
      }
    });
    buttonsRef.current.forEach((element) => {
      element.draw(ctx);
      element.action();
    });

    if (isAnimating) {
      requestAnimationFrame(renderScreen);
      return;
    }

    if (gameState.state === 'playing sequence') {
      ctx.font = '18px Arial';
      ctx.fillStyle = 'green';
      ctx.fillText('Watch the pattern', ctx.canvas.width / 2 - 70, ctx.canvas.height / 2 + 35);

      const activeButton = gameState.time >= 100 && gameState.time % 50 === 0 ? sequenceRef.current[gameState.time / 50 - 2] : undefined;

      if (activeButton !== undefined) {
        buttonsRef.current[activeButton]?.pressed?.();
      }

      if (gameState.time > lengthRef.current * 50 + 100) {
        canvasRef.current?.addEventListener('click', playerTurn);
        clickListenerRef.current.push(playerTurn);

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
        scoreRef.current[scoreRef.current.length - 1].score(scoreRef.current.length);

        balloonsRef.current = [
          balloonFactory(
            ctx.canvas.width / 2,
            ctx.canvas.height / 2,
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
      if (ctx.canvas.width === 800) {
        ctx.fillText('Game Over', 180, 200);
      } else {
        ctx.fillText('Game', 35, 150);
        ctx.fillText('Over', 65, 250);
      }
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('Click to play again', ctx.canvas.width / 2 - 55, 300);

      ctx.fillStyle = 'yellow';
      ctx.font = '25px Arial';

      if (scoreRef.current.length > highScoreRef.current) {
        ctx.fillText('New High Score!', ctx.canvas.width / 2 - 90, 350);
        ctx.fillText(`High Score: ${scoreRef.current.length}`, ctx.canvas.width / 2 - 90, 380);
      } else if (scoreRef.current.length === highScoreRef.current) {
        ctx.fillText('Tied High Score!', ctx.canvas.width / 2 - 90, 350);
        ctx.fillText(`High Score: ${scoreRef.current.length}`, ctx.canvas.width / 2 - 90, 380);
      } else {
        ctx.fillText(`High Score: ${highScoreRef.current}`, ctx.canvas.width / 2 - 90, 350);
        ctx.fillText(`Your Score: ${scoreRef.current.length}`, ctx.canvas.width / 2 - 90, 380);
      }
    }

    setGameState((prevState) => ({
      ...prevState,
      time: prevState.time + 1,
    }));
  }

  const restart = () => {
    backgroundMusicRef.current.pause();
    backgroundMusicRef.current.currentTime = 0;
    backgroundMusicRef.current = popped0Music;
    backgroundMusicRef.current.play();

    canvasRef.current?.removeEventListener('click', restart);
    clickListenerRef.current = clickListenerRef.current.filter((element) => element !== restart);

    poppedRef.current = [];
    lengthRef.current = 3;
    sequenceRef.current = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    playerSequenceRef.current = [];
    scoreRef.current = [];
    balloonsRef.current = [
      balloonFactory(
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
        1 / lengthRef.current,
        BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
        'none'
      ),
    ];
    highScoreRef.current = Math.max(scoreRef.current.length, highScoreRef.current);

    setGameState((prevState) => ({
      ...prevState,
      state: 'playing sequence',
      time: 0,
    }));
  }

  const playerTurn = (event: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()!;

    const x = event.x - rect.left!;
    const y = event.y - rect.top!;
    let buttonPressed = -1;

    let blueXMin = 220;
    let blueXMax = 280;
    let blueYMin = 470;
    let blueYMax = 530;
    let greenXMin = 320;
    let greenXMax = 380;
    let greenYMin = 470;
    let greenYMax = 530;
    let purpleXMin = 420;
    let purpleXMax = 480;
    let purpleYMin = 470;
    let purpleYMax = 530;
    let redXMin = 520;
    let redXMax = 580;
    let redYMin = 470;
    let redYMax = 530;
    if (ctx.canvas.width < 800) {
      blueXMin = 70;
      blueXMax = 130;
      blueYMin = 370;
      blueYMax = 430;
      greenXMin = 170;
      greenXMax = 230;
      greenYMin = 370;
      greenYMax = 430;
      purpleXMin = 70;
      purpleXMax = 130;
      purpleYMin = 470;
      purpleYMax = 530;
      redXMin = 170;
      redXMax = 230;
      redYMin = 470;
      redYMax = 530;
    }


    if (x > blueXMin && x < blueXMax && y > blueYMin && y < blueYMax) {
      buttonPressed = 0;
    } else if (x > greenXMin && x < greenXMax && y > greenYMin && y < greenYMax) {
      buttonPressed = 1;
    } else if (x > purpleXMin && x < purpleXMax && y > purpleYMin && y < purpleYMax) {
      buttonPressed = 2;
    } else if (x > redXMin && x < redXMax && y > redYMin && y < redYMax) {
      buttonPressed = 3;
    }

    if (buttonPressed !== -1) {
      buttonsRef.current[buttonPressed]?.pressed?.();
      const currentElement = playerSequenceRef.current.length;

      if (sequenceRef.current[currentElement] !== buttonPressed) {
        canvasRef.current?.removeEventListener('click', playerTurn);
        clickListenerRef.current = clickListenerRef.current.filter((element) => element !== playerTurn);

        poppedRef.current.push(balloonsRef.current[0]);
        balloonsRef.current[0].pop(ctx, poppedRef.current.length);
        balloonsRef.current = [];

        if (poppedRef.current.length === 1) {
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
          backgroundMusicRef.current = popped1Music;
          backgroundMusicRef.current.play();
        } else if (poppedRef.current.length === 2) {
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
          backgroundMusicRef.current = popped2Music;
          backgroundMusicRef.current.play();
        }

        if (poppedRef.current.length === 3) {
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
          backgroundMusicRef.current = gameOverMusic;
          backgroundMusicRef.current.play();

          canvasRef.current?.addEventListener('click', restart);
          clickListenerRef.current.push(restart);

          if (scoreRef.current.length > highScoreRef.current) {
            localStorage.setItem('balloon-blowout-highScore', scoreRef.current.length.toString());
          }

          setGameState((prevState) => ({
            ...prevState,
            state: 'game over',
            time: 0,
          }));
        } else {
          playerSequenceRef.current = [];

          balloonsRef.current = [
            balloonFactory(
              ctx.canvas.width / 2,
              ctx.canvas.height / 2,
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
        clickListenerRef.current = clickListenerRef.current.filter((element) => element !== playerTurn);
      }
    }
  }

  const startGame = (event: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()!;

    const x = event.x - rect.left!;
    const y = event.y - rect.top!;

    const minX = ctx.canvas.width / 2 - 60;
    const maxX = ctx.canvas.width / 2 + 60;
    const minY = ctx.canvas.height / 2 - 100 - 65;
    const maxY = ctx.canvas.height / 2 - 100 + 65;

    if (x > minX && x < maxX && y > minY && y < maxY) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current = popped0Music;
      backgroundMusicRef.current.play();

      canvasRef.current?.removeEventListener('click', startGame);
      clickListenerRef.current = clickListenerRef.current.filter((element) => element !== startGame);

      balloonsRef.current = [
        balloonFactory(
          ctx.canvas.width / 2,
          ctx.canvas.height / 2,
          1 / lengthRef.current,
          BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
          'none'
        ),
      ];


      if (ctx.canvas.width === 800) {
        buttonsRef.current = [
          buttonFactory(250, 500, 1, 'blue'),
          buttonFactory(350, 500, 1, 'green'),
          buttonFactory(450, 500, 1, 'purple'),
          buttonFactory(550, 500, 1, 'red'),
        ];
      } else {
        buttonsRef.current = [
          buttonFactory(100, 400, 1, 'blue'),
          buttonFactory(200, 400, 1, 'green'),
          buttonFactory(100, 500, 1, 'purple'),
          buttonFactory(200, 500, 1, 'red'),
        ];
      }

      setGameState((prevState) => ({
        ...prevState,
        state: 'playing sequence',
        time: 0,
      }));
    }
  }

  const showInstructions = () => {
    backgroundMusicRef.current.play();

    canvasRef.current?.addEventListener('click', startGame);
    clickListenerRef.current.push(startGame);

    balloonsRef.current = [
      balloonFactory(
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
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
    </div>
  )
}

export default GameState;
