import { Dot } from "lucide-react";
import React, { useState } from "react";
import CustomButton from "./button";
import { Separator } from "./ui/separator";

interface StepperProps {
  steps: { title: string; subTitle: string }[];
  children: (currentStep: number) => React.ReactNode;
}

const Stepper: React.FC<StepperProps> = ({ steps, children }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <div className='flex items-center justify-between w-full '>
        {steps.map((step, index) => (
          <>
            {index === 0 ||
              (index <= steps?.length && (
                <Separator
                  className={`max-w-[300px] h-[3px]  ${
                    index <= currentStep
                      ? "bg-[#55AA55] border-[#55AA55] text-[#55AA55]"
                      : "bg-[#DAE0E6] border-[#DAE0E6] text-[#DAE0E6]"
                  }`}
                />
              ))}
            <div
              key={step.title}
              className='flex items-center justify-between relative'
            >
              <div className='flex relative flex-col items-center '>
                <Dot
                  className={`w-2 h-2 flex items-center justify-center rounded-full border-2 ${
                    index <= currentStep
                      ? "bg-[#55AA55] border-[#55AA55] text-[#55AA55]"
                      : "bg-[#DAE0E6] border-[#DAE0E6] text-[#DAE0E6]"
                  }`}
                />
                <div className='text-center absolute mt-4 '>
                  <p className='text-sm text-[#2E3545] capitalize '>
                    {step?.title}
                  </p>
                  <p className='text-sm text-[#919BA7]  capitalize'>
                    {step?.subTitle}
                  </p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      <div className='mt-16 w-full'>{children(currentStep)}</div>

      <div className='mt-24 flex w-full  justify-end gap-3'>
        <CustomButton
          onClick={prevStep}
          disabled={currentStep === 0}
          variant='outline'
        >
          Previous
        </CustomButton>
        <CustomButton
          variant='default'
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </CustomButton>
      </div>
    </div>
  );
};

export default Stepper;
