import * as React from 'react';
import '@ui5/webcomponents-icons/decline.js';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Option } from '@ui5/webcomponents-react/Option';
import type { SearchHelpToken } from './search-help.type';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Input, type InputPropTypes } from '@ui5/webcomponents-react/Input';
import { Select, type SelectPropTypes } from '@ui5/webcomponents-react/Select';

interface SearchHelpInputProps {
  value: SearchHelpToken;
  options: SearchHelpToken['key'][];
  onChange: (value: SearchHelpToken) => void;
  onDelete: (tokenIds: SearchHelpToken['id'][]) => void;
}

export function SearchHelpInput({ value, options, onChange, onDelete }: SearchHelpInputProps) {
  const selectedOption = value.sign === 'negative' ? `!(${value.key})` : value.key;

  if (options.length === 0) {
    return null;
  }

  const handleTextValueChange: InputPropTypes['onChange'] = function (e) {
    const nextText = e.target.value.trim();
    onChange({
      ...value,
      key: selectedOption.replace('!(', '').replace(')', '') as SearchHelpToken['key'],
      text: nextText,
      sign: selectedOption.startsWith('!') ? 'negative' : 'positive',
    });
  };

  const handleSelectChange: SelectPropTypes['onChange'] = function (e) {
    const nextOption = e.detail.selectedOption.dataset.value as string;
    onChange({
      ...value,
      key: nextOption.replace('!(', '').replace(')', '') as SearchHelpToken['key'],
      text: value.text,
      sign: nextOption.startsWith('!') ? 'negative' : 'positive',
    });
  };

  return (
    <FlexBox className="gap-2" justifyContent="SpaceBetween">
      <Select className="h-6.5" value={selectedOption} onChange={handleSelectChange}>
        <Title className="px-2 pt-1">Include</Title>
        {options.map((option) => (
          <Option key={option} value={option} data-value={option}>
            {option}
          </Option>
        ))}
        <Title className="px-2">Exclude</Title>
        {options.map((option) => (
          <Option key={`!(${option})`} value={`!(${option})`} data-value={`!(${option})`}>
            {option !== 'equal to' ? 'does ' : ''}not {option}
          </Option>
        ))}
      </Select>
      <Input className="h-6.5 flex-1" placeholder="Value" value={value.text} onChange={handleTextValueChange} />
      <Button icon="decline" className="h-6.5" tooltip="Remove Condition" onClick={() => onDelete([value.id])} />
    </FlexBox>
  );
}