import { cn } from '@/libs/utils';
import type { PropsWithChildren } from 'react';
import { Card } from '@ui5/webcomponents-react/Card';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({ title, subtitle, className, contentClassName, children }: SectionCardProps) {
  return (
    <Card className={cn('h-full', className)} header={<CardHeader titleText={title} subtitleText={subtitle} />}>
      <div className={cn('space-y-4 p-4', contentClassName)}>{children}</div>
    </Card>
  );
}
