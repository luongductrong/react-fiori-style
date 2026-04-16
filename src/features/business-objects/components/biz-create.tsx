import * as React from 'react';
import { toast } from '@/libs/toast';
import { useNavigate } from 'react-router';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { BizForm, type BizFormValues } from './biz-form';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { BusyIndicator } from '@/components/busy-indicator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBizObjectMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';

export function BizCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
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
      onError: () => {
        setValues({
          title: '',
          type: '',
          status: '',
        });
        setOpen(false);
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
      <ToolbarButton design="Transparent" text="Create" onClick={() => setOpen(true)} />
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
                <Button design="Transparent" onClick={() => setOpen(false)} className="h-8" disabled={isPending}>
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
      >
        <BizForm value={values} onChange={setValues} inputClassName="md:w-full" />
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    </React.Fragment>
  );
}
