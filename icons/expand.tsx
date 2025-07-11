'use client';

import type { Transition } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ExpandIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ExpandIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
};

const ExpandIcon = forwardRef<ExpandIconHandle, ExpandIconProps>(
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
          {/* Top-right arrow */}
          <motion.path
            initial="normal"
            animate={controls}
            transition={defaultTransition}
            variants={{
              normal: { x: 0, y: 0 },
              animate: { x: 2, y: -2 },
            }}
            d="M17.5858 5H14V3H21V10H19V6.41421L14.7071 10.7071L13.2929 9.29289L17.5858 5Z"
          />

          {/* Bottom-left arrow */}
          <motion.path
            initial="normal"
            animate={controls}
            transition={defaultTransition}
            variants={{
              normal: { x: 0, y: 0 },
              animate: { x: -2, y: 2 },
            }}
            d="M3 14H5V17.5858L9.29289 13.2929L10.7071 14.7071L6.41421 19H10V21H3V14Z"
          />
        </svg>
      </div>
    );
  }
);

ExpandIcon.displayName = 'ExpandIcon';

export { ExpandIcon };
