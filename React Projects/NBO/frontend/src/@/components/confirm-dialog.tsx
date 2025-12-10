import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { ReactNode } from "react";
import CustomButton from "./button";
import { CustomDialog } from "./dialog";

type Props = {
  endPoint?: string;
  title: any;
  button?: ReactNode;
  confirmMessage: string;
  method?: "get" | "put" | "post" | "delete";
  data?: any;
  refetchUrl?: string[];
  onSuccess?: VoidFunction;
  onClose?: any;
  cancelButtonName?: string;
  confirmButtonName?: string;
  warningMessage?: string;
  isPending?: any;
  onConfirm?: VoidFunction;
};

export const ConfirmDialog = (props: Props) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (endPoint: string) =>
      axios[props.method || "get"](endPoint, props.data),
  });

  return (
    <CustomDialog
      title={props.title}
      button={props.button}
      onClose={() => {
        if (props.onClose) {
          props.onClose();
        }
      }}
      footer={({ onClose }) => (
        <div className='flex justify-end items-center gap-5'>
          <CustomButton variant='outline' onClick={onClose}>
            {props.cancelButtonName ? props.cancelButtonName : "Close"}
          </CustomButton>
          <CustomButton
            variant='default'
            disabled={isPending || props.isPending}
            isPending={isPending || props.isPending}
            onClick={() => {
              if (props.onConfirm) {
                props.onConfirm();
              }
              if (props.endPoint) {
                mutate(props.endPoint, {
                  onSuccess: () => {
                    onClose();
                    if (props.onSuccess) {
                      props.onSuccess();
                    }
                    if (props.refetchUrl) {
                      queryClient.refetchQueries({
                        queryKey: props.refetchUrl,
                      });
                    }
                  },
                });
              } else if (props.onSuccess) {
                props.onSuccess();
              }
            }}
          >
            {props.confirmButtonName ? props.confirmButtonName : "Submit"}
          </CustomButton>
        </div>
      )}
    >
      <div className='text-primary-text text-md px-6 pb-5'>
        {props.confirmMessage}
        {props?.warningMessage && (
          <small className='text-red-500 block mt-2'>
            Warning: {props.warningMessage}
          </small>
        )}
      </div>
    </CustomDialog>
  );
};
