import { createContext, useEffect, useRef, useState } from 'react';
import styles from './Canvas.module.css';

export type CanvasContextType = {
  ctx: CanvasRenderingContext2D;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);

function Canvas({ children }: { children: React.ReactNode }) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas =  document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
      const context = canvas.getContext('2d');


      if (context) {
        setCtx(context);
      }
    }
  }, []);

  return (
    <div>
    <canvas ref={canvasRef} id='canvas' className={styles.canvas} />
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
