import * as React from 'react';
import { toast } from '@/libs/toast';
import { useNavigate } from 'react-router';
import { getError } from '@/libs/error-message';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { BizForm, type BizFormValues } from './biz-form';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { BusyIndicator } from '@/components/busy-indicator';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBizObjectMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';

export function BizCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [errorBoxOpen, setErrorBoxOpen] = React.useState(false);
  const [errorBoxMessages, setErrorBoxMessages] = React.useState<string[]>([]);
  const [values, setValues] = React.useState<BizFormValues>({
    title: '',
    type: '',
    status: '',
  });

  const { mutate: createBizObject, isPending } = useMutation(
    createBizObjectMutationOptions({
      onSuccess: (data) => {
        toast('Business Object created successfully');
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
        navigate(`/business-objects/${data.BoId}`);
      },
      onError: (error) => {
        const messages = getError(error);
        setErrorBoxMessages((prev) => [...messages, ...prev]);
        setValues({
          title: '',
          type: '',
          status: '',
        });
        setOpen(false);
        setErrorBoxOpen(true);
      },
    }),
  );

  const handleSubmit = () => {
    createBizObject({
      BoTitle: values.title,
      BoType: values.type,
      Status: values.status,
    });
  };

  const isOkDisabled = React.useMemo(() => {
    return !values.title || !values.type || !values.status;
  }, [values]);

  return (
    <React.Fragment>
      <ToolbarButton design="Transparent" text="New" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        resizable
        draggable
        headerText="Create Business Object"
        className="md:min-w-3xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button design="Emphasized" onClick={handleSubmit} disabled={isOkDisabled} className="h-8">
                  OK
                </Button>
                <Button design="Transparent" onClick={() => setOpen(false)} className="h-8">
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
      >
        <BizForm value={values} onChange={setValues} inputClassName="md:w-full" />
        {isPending && <BusyIndicator type="pending" />}
      </Dialog>
      {errorBoxOpen && errorBoxMessages.length > 0 && (
        <MessageBox
          open
          title="Error"
          type="Error"
          onClose={() => {
            setErrorBoxOpen(false);
            setErrorBoxMessages([]);
          }}
        >
          <ul className="list-disc list-inside">
            {errorBoxMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </MessageBox>
      )}
    </React.Fragment>
  );
}
