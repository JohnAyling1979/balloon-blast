import { createContext, useEffect, useRef, useState } from 'react';
import styles from './Canvas.module.css';

export type CanvasContextType = {
  ctx: CanvasRenderingContext2D;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);

type CanvasProps = {
  children: React.ReactNode;
  canvasWidth: number;
  canvasHeight: number;
}

function Canvas({ children, canvasWidth, canvasHeight }: CanvasProps) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('useEffect Canvas', canvasWidth);
    const canvas =  document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas && canvasWidth && canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const context = canvas.getContext('2d');


      if (context) {
        setCtx(context);
      }
    }
  }, [canvasWidth, canvasHeight]);

  return (
    <div className={styles.root}>
    <canvas ref={canvasRef} id='canvas' className={styles.canvas} width={canvasWidth} height={canvasHeight} />
    {ctx && (
      <CanvasContext.Provider value={{
        ctx,
        canvasRef,
      }}>
        {children}
      </CanvasContext.Provider>
    )}
    </div>
  );
}

export default Canvas;
