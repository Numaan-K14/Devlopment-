
import { useGetDataRef } from "@/hooks/useGetDataRef";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useState } from "react";
// import { AspectRatio } from "react-advanced-cropper";
import { useFormContext } from "react-hook-form";
import { MdOutlineBackup } from "react-icons/md";
type Props = {
  name: string;
  label: string;
  accept?: string;
  className?: string;
  dataRef?: string;
  onChange?: (value: string | null) => void;
};

export function FileUpload({
  accept,
  label,
  name,
  dataRef,
  className,
  onChange,
}: Props) {
  const [_image, setImage] = useState("");
  const inputRef = React.useRef<any>(null);
  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.file-upload",
  );

  const { setValue, watch, register } = useFormContext();

  const finalImage = watch(name);

  const onFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // code for converting image to base64
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { disabled } = register(name);

  return (
    <div>
      <div
        data-ref={`${componentDataRef}.container`}
        onClick={() => {
          !disabled && inputRef.current?.click();
        }}
        className={cn(
          " gap-1 flex justify-center items-center text-gray-7 text-sm border-2  border-primary-p5 bg-primary-p0 border-dashed rounded-sm flex-col cursor-pointer hover:bg-primary-p1 relative z-[5]",
          {
            "border-none": !!finalImage,
            "py-2": !finalImage,
            // "size-[196px]": aspectRatio.maximum === 1,
            "cursor-default": disabled,
            "opacity-50 hover:bg-[#4F83CC12]": disabled && !finalImage,
          },
          className,
        )}
      >
        {finalImage ? (
          <>
            <img
              src={finalImage}
              data-ref={`${componentDataRef}.image`}
              alt='cropped image'
              className='w-full h-full rounded-sm '
            />
            {!disabled && (
              <div
                onClick={() => {
                  setValue(name, null, { shouldValidate: true });
                  onChange && onChange(null);
                }}
                data-ref={`${componentDataRef}.clear-image`}
                className='absolute top-0 -right-7 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex justify-center items-center text-background border-[3px] border-white bg-destructive hover:bg-red-700 rounded-full size-7'
              >
                <X strokeWidth={2} size={16} />
              </div>
            )}
          </>
        ) : (
          <>
            <input
              data-ref={`${componentDataRef}.input`}
              id={`${componentDataRef}.input`}
              accept={accept}
              ref={inputRef}
              type='file'
              className='opacity-0 w-1 h-1'
              name={name}
              onChange={onFileSelectChange}
            />
            <MdOutlineBackup className='text-primary size-7' />
            <p className='text-inherit font-normal text-center'>
              {label} <span className='text-destructive ml-1'>*</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
