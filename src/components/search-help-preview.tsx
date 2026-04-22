import * as React from 'react';
import { cn } from '@/libs/utils';
import '@ui5/webcomponents-icons/decline.js';
import { Title } from '@ui5/webcomponents-react/Title';
import { Token } from '@ui5/webcomponents-react/Token';
import { Button } from '@ui5/webcomponents-react/Button';
import type { SearchHelpToken } from './search-help.type';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { MultiInput, type MultiInputPropTypes } from '@ui5/webcomponents-react/MultiInput';

interface SearchHelpPreviewProps extends React.ComponentProps<typeof FlexBox> {
  tokens: SearchHelpToken[];
  onTokensDelete: (tokenIds: SearchHelpToken['id'][]) => void;
  insideDialog?: boolean;
  icon?: MultiInputPropTypes['icon'];
  onValueHelpTrigger?: () => void;
  onInputValue?: (value: string) => void;
}

function tokenStandardization(token: SearchHelpToken): string {
  let result = token.text;
  switch (token.key) {
    case 'contains':
      result = `*${result}*`;
      break;
    case 'equal to':
      result = `=${result}`;
      break;
    case 'starts with':
      result = `${result}*`;
      break;
    case 'ends with':
      result = `*${result}`;
      break;
  }
  if (token.sign === 'negative') {
    result = `!(${result})`;
  }
  return result;
}

export function SearchHelpPreview({
  tokens,
  onTokensDelete,
  insideDialog,
  icon,
  onInputValue,
  onValueHelpTrigger,
  ...props
}: SearchHelpPreviewProps) {
  const handleTokenDelete: MultiInputPropTypes['onTokenDelete'] = function (e) {
    const tokenIds = e.detail.tokens
      .map((token) => token.dataset.id)
      .filter((tokenId): tokenId is SearchHelpToken['id'] => Boolean(tokenId));
    onTokensDelete(tokenIds);
  };

  const handleInputValue: MultiInputPropTypes['onChange'] = function (e) {
    onInputValue?.(e.target.value);
    e.target.value = '';
  };

  if (insideDialog) {
    return (
      <div className="space-y-2">
        <Title>{tokens.length > 0 ? `Conditions (${tokens.length})` : 'No Conditions Entered'}</Title>
        <FlexBox {...props} className={cn('gap-2 h-6.5', props.className)}>
          <MultiInput
            onTokenDelete={handleTokenDelete}
            className="w-full h-full"
            type="Text"
            tokens={tokens.map((token) => (
              <Token
                key={token.id}
                data-id={token.id}
                text={tokenStandardization(token)}
                closeIcon={null}
                className="border mx-px h-5"
              />
            ))}
            onChange={handleInputValue}
          />
          <Button
            icon="decline"
            tooltip="Remove All"
            className="h-full"
            onClick={() => onTokensDelete(tokens.map((token) => token.id))}
          />
        </FlexBox>
      </div>
    );
  }

  return (
    <MultiInput
      onChange={handleInputValue}
      onTokenDelete={handleTokenDelete}
      className="w-full h-6.5"
      type="Text"
      icon={icon}
      tokens={tokens.map((token) => (
        <Token
          key={token.id}
          data-id={token.id}
          text={tokenStandardization(token)}
          closeIcon={null}
          className="border mx-px h-5"
        />
      ))}
      onValueHelpTrigger={onValueHelpTrigger}
    />
  );
}
