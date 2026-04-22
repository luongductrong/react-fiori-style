import * as React from 'react';
import '@ui5/webcomponents-icons/value-help.js';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { SearchHelpInput } from './search-help-input';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import type { SearchHelpToken } from './search-help.type';
import { SearchHelpPreview } from './search-help-preview';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';

interface SearchHelpDialogProps {
  options?: SearchHelpToken['key'][];
  field: string;
  label: string;
  useApostrophe?: boolean;
  afterFilterStringBuild: (s: string) => void;
}

function createToken(defaultKey: SearchHelpToken['key'], text?: string): SearchHelpToken {
  return {
    id: crypto.randomUUID(),
    key: defaultKey,
    text: text ?? '',
    sign: 'positive',
  };
}
const defaultOptions: SearchHelpToken['key'][] = ['contains', 'equal to', 'starts with', 'ends with'];

export function SearchHelpDialog({ options = defaultOptions, field, label, ...props }: SearchHelpDialogProps) {
  const { afterFilterStringBuild, useApostrophe = true } = props;
  const [open, setOpen] = React.useState(false);
  const [tokens, setTokens] = React.useState<SearchHelpToken[]>(() => [createToken(options[0])]);
  const cleanTokens = React.useMemo(() => tokens.filter((token) => token.text.trim() !== ''), [tokens]);

  const onClose = function () {
    setOpen(false);
  };

  const handleAddToken = function () {
    setTokens((prev) => [...prev, createToken(options[0])]);
  };

  const handleTokensDelete = function (tokenIdsToDelete: SearchHelpToken['id'][]) {
    setTokens((prev) => {
      const newTokens = prev.filter((token) => !tokenIdsToDelete.includes(token.id));
      if (newTokens.length === 0) {
        return [createToken(options[0])];
      }
      return newTokens;
    });
  };

  const handleTokenChange = function (tokenId: SearchHelpToken['id'], value: SearchHelpToken) {
    setTokens((prev) => {
      return prev.map((token) => (token.id === tokenId ? value : token));
    });
  };

  const handleCancel = function () {
    setTokens([createToken(options[0])]);
    onClose();
  };

  const handleOk = function () {
    onClose();
  };

  React.useEffect(() => {
    const buildFilterString = function () {
      if (cleanTokens.length === 0) {
        return '';
      }

      const escapeValue = function (value: string) {
        return value.replaceAll("'", "''");
      };

      const buildExpression = function (token: SearchHelpToken) {
        const escapedText = escapeValue(token.text);
        const text = useApostrophe ? `'${escapedText}'` : escapedText;

        switch (token.key) {
          case 'contains':
            return `contains(${field},${text})`;
          case 'equal to':
            return token.sign === 'negative' ? `${field} ne ${text}` : `${field} eq ${text}`;
          case 'starts with':
            return `startswith(${field},${text})`;
          case 'ends with':
            return `endswith(${field},${text})`;
        }
      };

      const wrapGroup = function (expressions: string[], operator: 'or' | 'and') {
        if (expressions.length === 0) {
          return '';
        }

        const result = expressions.join(` ${operator} `);
        return expressions.length > 1 ? `(${result})` : result;
      };

      const positiveExpressions = cleanTokens.filter((token) => token.sign === 'positive').map(buildExpression);
      const negativeExpressions = cleanTokens
        .filter((token) => token.sign === 'negative')
        .map((token) => (token.key === 'equal to' ? buildExpression(token) : `not ${buildExpression(token)}`));

      return [wrapGroup(positiveExpressions, 'or'), wrapGroup(negativeExpressions, 'and')]
        .filter(Boolean)
        .join(' and ');
    };
    afterFilterStringBuild(buildFilterString());
  }, [cleanTokens, afterFilterStringBuild, field, useApostrophe]);

  const handleInputValue = function (value: string) {
    setTokens((prev) => [...prev, createToken(options[0], value)]);
  };

  return (
    <React.Fragment>
      <SearchHelpPreview
        tokens={cleanTokens}
        onTokensDelete={handleTokensDelete}
        icon={<Icon className="h-full" name="value-help" onClick={() => setOpen(true)} />}
        onValueHelpTrigger={() => setOpen(true)}
        onInputValue={handleInputValue}
      />
      <Dialog
        headerText={`Conditions: ${label}`}
        footer={
          <Bar
            design="Footer"
            endContent={
              <FlexBox className="gap-2" justifyContent="End">
                <Button design="Emphasized" className="h-6.5" onClick={handleOk}>
                  OK
                </Button>
                <Button className="h-6.5" onClick={handleCancel}>
                  Cancel
                </Button>
              </FlexBox>
            }
          />
        }
        className="w-2/3 max-w-6xl h-9/10"
        resizable={true}
        draggable={true}
        open={open}
      >
        <FlexBox className="gap-2 h-full" direction="Column" justifyContent="SpaceBetween">
          <div className="space-y-2">
            <Title>{label}</Title>
            {tokens.map((token) => (
              <SearchHelpInput
                key={token.id}
                value={token}
                options={options}
                onChange={(value) => {
                  handleTokenChange(token.id, value);
                }}
                onDelete={handleTokensDelete}
              />
            ))}
            <FlexBox justifyContent="End" className="pr-11">
              <Button design="Default" className="h-6.5 border" onClick={handleAddToken}>
                Add
              </Button>
            </FlexBox>
          </div>
          <SearchHelpPreview
            insideDialog={true}
            style={{ flex: 'none' }}
            tokens={cleanTokens}
            onTokensDelete={handleTokensDelete}
            onInputValue={handleInputValue}
          />
        </FlexBox>
      </Dialog>
    </React.Fragment>
  );
}
