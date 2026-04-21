import * as React from 'react';
import { cn } from '@/libs/utils';

interface LoadMoreTriggerProps {
  hasMore?: boolean;
  isLoading?: boolean;
  enabled?: boolean;
  onLoadMore: () => Promise<unknown> | unknown;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LoadMoreTrigger({
  hasMore = false,
  isLoading = false,
  enabled = true,
  onLoadMore,
  rootMargin = '180px 0px',
  threshold = 0,
  className,
}: LoadMoreTriggerProps) {
  const targetRef = React.useRef<HTMLDivElement | null>(null);
  const pendingRef = React.useRef(false);
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const isActive = enabled && hasMore;

  React.useEffect(() => {
    const target = targetRef.current;

    if (!target || !isActive || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry?.isIntersecting ?? false);
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isActive, rootMargin, threshold]);

  React.useEffect(() => {
    if (!isActive || !isIntersecting || isLoading || pendingRef.current) {
      return;
    }

    pendingRef.current = true;

    void Promise.resolve()
      .then(() => onLoadMore())
      .catch(() => undefined)
      .finally(() => {
        pendingRef.current = false;
      });
  }, [isActive, isIntersecting, isLoading, onLoadMore]);

  if (!isActive) {
    return null;
  }

  return (
    <div ref={targetRef} aria-hidden="true" className={cn('pointer-events-none h-px w-full opacity-0', className)} />
  );
}
