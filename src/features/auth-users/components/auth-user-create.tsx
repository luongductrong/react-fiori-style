import * as React from 'react';
import { toast } from '@/libs/helpers/toast';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { useMutation } from '@tanstack/react-query';
import { Text } from '@ui5/webcomponents-react/Text';
import { DEFAULT_AUTH_USER_ROLE } from '../constants';
import { useInvalidateAuthUserQuery } from '../hooks';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator } from '@/components/busy-indicator';
import { createAuthUserMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';

export function AuthUserCreate({ onCreated }: { onCreated: () => void }) {
  const invalidateAuthUser = useInvalidateAuthUserQuery();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({ Uname: '' });

  const { mutate: createAuthUser, isPending } = useMutation(
    createAuthUserMutationOptions({
      onSuccess: () => {
        invalidateAuthUser.invalidateAuthUserList();
        onCreated();
        setOpen(false);
        setValues({ Uname: '' });
        toast('User created successfully');
      },
    }),
  );

  const handleClose = function () {
    if (isPending) {
      return;
    }

    setOpen(false);
    setValues({ Uname: '' });
  };

  const handleSubmit = function () {
    createAuthUser({
      Uname: values.Uname.trim(),
      Role: DEFAULT_AUTH_USER_ROLE,
    });
  };

  return (
    <React.Fragment>
      <ToolbarButton design="Transparent" text="Create" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        resizable
        draggable
        headerText="Create User"
        className="md:min-w-xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button design="Emphasized" onClick={handleSubmit} disabled={!values.Uname.trim() || isPending}>
                  Save
                </Button>
                <Button design="Transparent" onClick={handleClose} disabled={isPending}>
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
        onClose={handleClose}
      >
        <FlexBox direction="Column" className="gap-4 p-2">
          <FlexBox direction="Column" className="gap-1">
            <Label showColon required>
              User Name
            </Label>
            <Input
              value={values.Uname}
              placeholder="Enter user name"
              onInput={(event) => {
                setValues({
                  Uname: event.target.value,
                });
              }}
            />
          </FlexBox>
          <FlexBox direction="Column" className="gap-1">
            <Label showColon>Role</Label>
            <Text>{DEFAULT_AUTH_USER_ROLE}</Text>
          </FlexBox>
        </FlexBox>
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    </React.Fragment>
  );
}
