'use client';

import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface RouteIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface RouteIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RouteIcon = forwardRef<RouteIconHandle, RouteIconProps>(
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
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Start circle */}
          <motion.circle
            cx="6"
            cy="18"
            r="2"
            animate={controls}
            initial="normal"
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: { pathLength: [0, 1], opacity: [0, 1] },
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />

          {/* Curved path */}
          <motion.path
            d="M6 18 C8 14, 16 10, 18 6"
            animate={controls}
            initial="normal"
            variants={{
              normal: {
                pathLength: 1,
                opacity: 1,
                pathOffset: 0,
              },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                pathOffset: [1, 0],
              },
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: 'easeInOut',
            }}
          />

          {/* End circle */}
          <motion.circle
            cx="18"
            cy="6"
            r="2"
            animate={controls}
            initial="normal"
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: { pathLength: [0, 1], opacity: [0, 1] },
            }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
        </svg>
      </div>
    );
  }
);

RouteIcon.displayName = 'RouteIcon';

export { RouteIcon };
