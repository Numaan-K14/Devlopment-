import { cn, getValueByKey } from "@/lib";
import { Trash2 } from "lucide-react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import { FieldError, useFormContext } from "react-hook-form";
import { MdOutlineBackup } from "react-icons/md";
import { Button } from "../ui";
import { HelpText } from "./help-text";

interface DropZoneProps extends DropzoneProps {
  name: string;
  label?: string;
  onChange?: any;
  accept?: any;
  aspectRatio?: number;
  crop?: boolean;
  placeholder?: string;
  hideIfDisable?: boolean;
  componentDataRef?: string;
  helpText?: string;
  inputContainerClassName?: string;
  dropDownContainerClassName?: string;
  [key: string]: any;
}

interface PreviewFile extends File {
  preview?: string;
}

export const FileInput = ({
  name,
  label,
  onChange,
  accept,
  aspectRatio,
  crop = false, // Default to false
  componentDataRef = "file-input",
  helpText,
  required,
  inputContainerClassName,
  dropDownContainerClassName,
  ...otherProps
}: DropZoneProps) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useFormContext(); // Access the react-hook-form context

  let value = watch(name);

  const error = getValueByKey(errors, name) as FieldError | undefined;
  const typeValidator = () => {
    // if (file.type.startsWith("image/") && file.size > 2 * 1024 * 1024) {
    //   return {
    //     code: "size-too-large",
    //     message: "Image file is larger than 2MB",
    //   };
    // }
    return null;
  };

  const handleDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errMessages = rejectedFiles.flatMap((file) =>
        file.errors.map((error: { message: any }) => error.message),
      );
      setError(name, { message: errMessages[0] });
      return;
    }

    // setError([]);
    const filesWithPreview: PreviewFile[] = acceptedFiles.map((file) => {
      const previewFile: PreviewFile = file;
      previewFile.preview = URL.createObjectURL(file);
      return previewFile;
    });

    const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
    const updatedFiles = [...currentFiles, ...filesWithPreview];

    if (otherProps?.multiple) {
      setValue(name, updatedFiles);
      onChange?.(updatedFiles, name); // pass both value + field name
    } else if (filesWithPreview.length > 0) {
      setValue(name, [filesWithPreview[0]]);
      onChange?.([filesWithPreview[0]], name);
    }
  };

  // console.log(value,"valllllllll")

  //   const handleFileUpload = (file: File) => {
  //     if (Array.isArray(value)) {
  //       setValue(name, [...value, file]);
  //     } else {
  //       setValue(name, [file]);
  //     }
  //     if (onChange) {
  //       onChange([file], []);
  //     }
  //   };

  return (
    <>
      <Dropzone
        minSize={0}
        accept={
          accept ||
          {
            // "image/*": [".png", ".gif", ".jpeg", ".jpg"],
            // "*/*": [],
          }
        }
        validator={typeValidator}
        onDrop={handleDrop}
        {...otherProps}
        {...register}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className={cn("flex flex-col", inputContainerClassName)}>
            {label && <label>{label}</label>}
            <div
              {...getRootProps()}
              className={cn(
                "drop-zone border border-dashed border-primary-p5  min-h-[90px] mt-2 !flex !flex-col !justify-center items-center gap-1 cursor-pointer rounded-sm",
                dropDownContainerClassName,
              )}
              style={{
                background: isDragActive
                  ? "var(--color-primary-p2)"
                  : "var(--color-primary-p0)",
                display: otherProps?.hideIfDisable
                  ? otherProps?.disabled
                    ? "none"
                    : "block"
                  : "block",
                opacity: otherProps?.disabled ? 0.5 : 1,
                pointerEvents: otherProps?.disabled ? "none" : "auto",
              }}
            >
              <input {...getInputProps()} />
              <MdOutlineBackup className='text-primary size-7' />

              <p className='text-sm text-gray-7'>
                {otherProps?.placeholder || "Drop file"} or{" "}
                <span className='font-medium underline text-other-info'>
                  browse
                </span>{" "}
                {required && <span className='text-destructive'>*</span>}
              </p>
              {/* <Button className='flex justify-center items-center !w-full text-[#0F62FE]'>
                
              </Button> */}
            </div>

            {value &&
              (!Array.isArray(value) ? (
                <div className='w-full flex items-center gap-2 mt-4'>
                  {/* <img
                    src={
                      value?.path?.includes(".pdf") ||
                      value?.url?.includes(".pdf")
                        ? "/images/pdf-icon.svg"
                        : "/images/file-logo.svg"
                    }
                    alt='File icon'
                  /> */}

                  {/* <Paperclip2
                    color='var(--color-other-info)'
                    className='size-4 text-other-info'
                  /> */}
                  <img src='/icons/file-attachment-02.svg' alt='aramex logo' />

                  <a
                    className='no-underline'
                    href={
                      value?.preview
                        ? value?.preview
                        : `${import.meta.env.VITE_BE_URL}${value?.file ? value?.file?.split("/").slice(2).join("/") : ""}`
                    }
                    target='_blank'
                  >
                    <p className='text-other-info font-medium max-w-[100px] truncate'>
                      {value?.name ||
                        (value?.file ? value?.file?.split("/")?.slice(-1) : "")}
                    </p>
                  </a>
                  <Button
                    variant={"ghost"}
                    type='button'
                    onClick={() => setValue(name, null)}
                  >
                    <Trash2 className='size-4 text-destructive' />
                  </Button>
                </div>
              ) : (
                value?.length > 0 && (
                  <div className='w-full   flex flex-wrap gap-x-1 gap-y-2 overflow-x-auto mt-4'>
                    {value?.map((item: any, index: number) => (
                      <div
                        className='flex items-center gap-2 mb-1 '
                        key={item?.path || item.url}
                      >
                        {/* <img
                            src={
                              (item.path && item.path?.includes(".pdf")) ||
                              item.url?.includes(".pdf")
                                ? "/images/pdf-icon.svg"
                                : "/images/file-logo.svg"
                            }
                            alt='File icon'
                          /> */}
                        {/* <Paperclip2
                          color='var(--color-other-info)'
                          className='size-4 text-other-info'
                        /> */}
                        <img
                          src='/icons/file-attachment-02.svg'
                          alt='aramex logo'
                        />

                        <a
                          className='no-underline'
                          href={
                            item.preview
                              ? item.preview
                              : `${import.meta.env.VITE_BE_URL}${item.file ? item.file : ""}`
                          }
                          target='_blank'
                        >
                          <p
                            className='text-other-info font-medium max-w-[100px] truncate'
                            title={
                              item?.name ||
                              (item?.file
                                ? item?.file?.split("/")?.slice(-1)
                                : "")
                            }
                          >
                            {item.name ||
                              (item.file
                                ? item.file?.split("/")?.slice(-1)
                                : "")}
                          </p>
                        </a>
                        {!otherProps?.disabled && (
                          <Button
                            variant={"ghost"}
                            disabled={otherProps?.disabled}
                            type='button'
                            onClick={() => {
                              const updated = value.filter(
                                (_: any, i: any) => i !== index,
                              );
                              setValue(name, updated);
                              onChange?.(updated, name); // also trigger onChange
                            }}
                          >
                            {/* <img src='/images/close.svg' alt='Remove' /> */}
                            <Trash2 className='size-4 text-destructive' />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ))}

            {(error || helpText) && (
              <HelpText dataRef={`${componentDataRef}`} error={!!error}>
                {error ? error?.message : helpText}
              </HelpText>
            )}
          </div>
        )}
      </Dropzone>
    </>
  );
};
