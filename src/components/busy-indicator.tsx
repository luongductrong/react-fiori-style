import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator as UI5BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';

export function BusyIndicator({ type }: { type: 'loading' | 'pending' }) {
  return (
    <FlexBox
      alignItems="Center"
      justifyContent="Center"
      style={{
        padding: '1rem',
        minHeight: '50dvh',
        ...(type === 'pending' ? { position: 'absolute', inset: 0 } : {}),
      }}
    >
      <UI5BusyIndicator delay={0} active size="L" />
    </FlexBox>
  );
}
