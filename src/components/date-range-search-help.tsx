import * as React from 'react';
import { Text } from '@ui5/webcomponents-react/Text';
import { DateRangePicker, type DateRangePickerPropTypes } from '@ui5/webcomponents-react/DateRangePicker';

interface DateRangeSearchHelpProps {
  field: string;
  afterFilterStringBuild: (s: string) => void;
}

export function DateRangeSearchHelp({ field, afterFilterStringBuild }: DateRangeSearchHelpProps) {
  const [valueState, setValueState] = React.useState<'None' | 'Negative'>('None');
  const [message, setMessage] = React.useState('');

  const handleOnChange: DateRangePickerPropTypes['onChange'] = (e) => {
    const { value, valid } = e.detail;
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      setValueState('None');
      setMessage('');
      afterFilterStringBuild('');
      return;
    }

    if (!valid) {
      setValueState('Negative');
      setMessage('Invalid date range');
      afterFilterStringBuild('');
      return;
    }

    const [from, to] = trimmedValue.split(' - ').map((item) => item.trim());
    if (!from || !to) {
      setValueState('Negative');
      setMessage('Invalid date range');
      afterFilterStringBuild('');
      return;
    }

    setValueState('None');
    setMessage('');
    afterFilterStringBuild(`${field} ge ${from} and ${field} le ${to}`);
  };

  return (
    <DateRangePicker
      onChange={handleOnChange}
      primaryCalendarType="Gregorian"
      valueState={valueState}
      showClearIcon
      className="w-full h-6.5"
      valueStateMessage={message ? <Text>{message}</Text> : undefined}
    />
  );
}
