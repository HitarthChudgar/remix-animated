'use client';

import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface AirplaneIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AirplaneIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SPEED_LINES = [
  { x1: 6, y1: 16, x2: 2, y2: 20, delay: 0.1 },
  { x1: 8, y1: 18, x2: 4, y2: 22, delay: 0.2 },
  { x1: 10, y1: 20, x2: 6, y2: 24, delay: 0.3 },
];

const AirplaneIcon = forwardRef<AirplaneIconHandle, AirplaneIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Animated airplane */}
          <motion.path
            initial="normal"
            animate={controls}
            variants={{
              normal: { x: 0, y: 0, scale: 1 },
              animate: {
                x: [0, 5, 3],
                y: [0, -5, -3],
                scale: 0.9,
                transition: {
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                },
              },
            }}
            d="M21.949 10.1118C22.1634 10.912 21.6886 11.7345 20.8884 11.9489L5.2218 16.1467C4.77856 16.2655 4.31138 16.0674 4.08866 15.6662L1.46582 10.9415L2.91471 10.5533L5.3825 12.9979L10.4778 11.6326L5.96728 4.55896L7.89913 4.04132L14.8505 10.4609L20.1119 9.05113C20.9121 8.83671 21.7346 9.31159 21.949 10.1118Z"
          />

          {/* Speed lines */}
          {SPEED_LINES.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              variants={{
                normal: {
                  opacity: 0,
                  translateX: -3,
                  translateY: 3,
                },
                animate: {
                  opacity: 1,
                  translateX: 0,
                  translateY: 0,
                  transition: {
                    duration: 0.15,
                    delay: line.delay,
                    type: 'spring',
                    stiffness: 200,
                    damping: 12,
                  },
                },
              }}
              animate={controls}
            />
          ))}

          {/* Static runway */}
          <path d="M4 19H20V21H4V19Z" />
        </svg>
      </div>
    );
  }
);

AirplaneIcon.displayName = 'AirplaneIcon';

export { AirplaneIcon };
