import { CustomDialog, Label } from "@/components";
import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import OtpInput from "@/components/inputs/otp-input";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const ForgotPass = ({
  handleClose,
  email,
}: {
  handleClose: any;
  email: string;
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { mutate: GenrateOTPMutate, isPending: GenrateOTPPending } =
    useMutation({
      mutationFn: (data: any) => axios.put("/user/generate-otp", data),
      onSuccess(data) {
        toast.success(data.data.message || "OTP sent to your email.");
        setStep(2);
      },
      onError(error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });

  const { mutate: ResetPassMutate, isPending: ResetPassPending } = useMutation({
    mutationFn: (data: any) => axios.put("/user/update-password", data),
    onSuccess(data) {
      toast.success(data.data.message || "Password reset successful!");
      handleClose(false);
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  const { mutate: verifyOTPMutate, isPending: verifyOtpPending } = useMutation({
    mutationFn: (data: any) => axios.post("/user/verify-otp", data),
    onSuccess(data) {
      toast.success(data.data.message || "OTP verified successfully");
      setStep(3);
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    ...(step === 2 && {
      otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
    }),
    ...(step === 3 && {
      password: Yup.string()
        .required("New password is required")
        .min(
          6,
          "Password must be 6+ chars with at least 1 uppercase, 1 number, and 1 symbol.",
        )
        .matches(
          /[A-Za-z]/,
          "Password must be 6+ chars with at least 1 uppercase, 1 number, and 1 symbol.",
        )
        .matches(
          /\d/,
          "Password must be 6+ chars with at least 1 uppercase, 1 number, and 1 symbol.",
        )
        .matches(
          /[@$!%*?&#^()_\-+={}[\]|:;"'<>,.~]/,
          "Password must be 6+ chars with at least 1 uppercase, 1 number, and 1 symbol.",
        ),

      confirm_password: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
  });
  return (
    <div>
      <CustomDialog
        title={"Forgot Password"}
        className={"max-w-[500px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      >
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: email || "",
            otp: "",
            password: "",
            confirm_password: "",
          }}
          onSubmit={(values) => {
            if (step === 1) {
              GenrateOTPMutate({ email: values.email });
            } else if (step === 2) {
              verifyOTPMutate({ email: values.email, otp: values.otp });
            } else {
              ResetPassMutate({
                email: values.email,
                otp: values.otp,
                password: values.password,
                confirm_password: values.confirm_password,
              });
            }
          }}
        >
          {({ values, errors, touched, handleSubmit, setFieldValue }) => (
            <Form>
              <div className='space-y-4 mb-6'>
                <CustomInput
                  name='email'
                  label='Email'
                  required
                  disabled={step === 2 || step === 3}
                />

                {step === 2 && (
                  <>
                    <div className='flex flex-col  gap-2'>
                      <Label>Enter OTP</Label>
                      <OtpInput
                        name='otp'
                        value={values.otp}
                        onChange={(val) => setFieldValue("otp", val)}
                        error={touched.otp && errors.otp ? errors.otp : ""}
                      />
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <CustomInput
                      name='password'
                      label='New Password'
                      type='password'
                      required
                      error={
                        touched.password && errors.password
                          ? errors.password
                          : ""
                      }
                    />
                    <CustomInput
                      name='confirm_password'
                      label='Confirm Password'
                      type='password'
                      required
                      error={
                        touched.confirm_password && errors.confirm_password
                          ? errors.confirm_password
                          : ""
                      }
                    />
                  </>
                )}
              </div>

              <DialogFooter className='py-4 px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton variant='outline' onClick={() => handleClose()}>
                    Cancel
                  </CustomButton>

                  <CustomButton
                    variant='default'
                    type='submit'
                    isPending={
                      step === 1
                        ? GenrateOTPPending
                        : step === 2
                          ? verifyOtpPending
                          : ResetPassPending
                    }
                  >
                    {step === 1
                      ? "Generate OTP"
                      : step === 2
                        ? "Verify OTP"
                        : "Reset Password"}
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default ForgotPass;
