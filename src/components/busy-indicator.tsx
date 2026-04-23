import type { CSSProperties } from 'react';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator as UI5BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';

interface BusyIndicatorProps {
  type: 'loading' | 'pending';
  show?: boolean;
  style?: CSSProperties;
}

export function BusyIndicator({ type, show = true, style }: BusyIndicatorProps) {
  if (!show) return null;
  return (
    <FlexBox
      alignItems="Center"
      justifyContent="Center"
      style={{
        padding: '1rem',
        minHeight: '50dvh',
        ...(type === 'pending' ? { position: 'absolute', inset: 0 } : {}),
        ...style,
      }}
    >
      <UI5BusyIndicator delay={0} active size="L" />
    </FlexBox>
  );
}
