import { useField, useFormikContext } from "formik";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import { LuUpload } from "react-icons/lu";
import { Link } from "react-router-dom";
import CustomButton from "../button";
import { Label } from "../label";

interface DropZonesProps extends DropzoneProps {
  name: string;
  label?: string;
  onChange?: any;
  accept?: any;
  placeholder?: string;
  hideIfDisable?: boolean;
  className?: string;
  type?: string;
}

interface PreviewFile extends File {
  preview?: string;
}

export const DropZone = <T extends {}>({
  name,
  label,
  onChange,
  accept,
  className,
  type = "primary",
  ...otherProps
}: DropZonesProps) => {
  // console.log(accept, "<---- accept");
  const { setFieldValue, resetForm } = useFormikContext<T | any>();
  const [field, { error: fieldError, touched }] = useField(name);
  const [errors, setError] = useState<string[]>([]);
  const typeValidator = (file: any) => {
    if (file.size > 10 * 1024 * 1024) {
      return {
        code: "size-too-large",
        message: "Image file is larger than 10MB",
      };
    }
    return null;
  };

  const handleDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errMessages = rejectedFiles.flatMap((file) =>
        file.errors.map((error: { message: any }) => error.message),
      );
      setError(errMessages);
      return;
    }
    if (onChange) {
      onChange(acceptedFiles, rejectedFiles);
    }

    setError([]);
    const filesWithPreview: PreviewFile[] = acceptedFiles.map((file) => {
      const previewFile: PreviewFile = file;
      previewFile.preview = URL.createObjectURL(file);
      return previewFile;
    });

    const currentFiles = Array.isArray(field.value)
      ? field.value
      : field.value
        ? [field.value]
        : [];
    const updatedFiles = [...currentFiles, ...filesWithPreview];

    if (otherProps?.multiple) {
      setFieldValue(name, updatedFiles);
    } else if (filesWithPreview.length > 0) {
      setFieldValue(name, [filesWithPreview[0]]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (Array.isArray(field.value)) {
      setFieldValue(name, [...field.value, file]);
    } else {
      setFieldValue(name, [file]);
    }
    if (onChange) {
      onChange([file], []);
    }
  };

  return (
    <>
      <Dropzone
        minSize={0}
        accept={
          accept || {
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
          }
        }
        validator={typeValidator}
        onDrop={handleDrop}
        {...otherProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <>
            {label && <Label>{label}</Label>}
            {type === "primary" && (
              <>
                <div
                  {...getRootProps()}
                  className={`drop-zone  h-[219px] w-full !flex !justify-center !items-center border-dashed border-[#4F46E5] border-[1.5px] !rounded-[4px]  !bg-[#F5F8FF] px-8 py-4 mt-2 ${className}`}
                  style={{
                    background: isDragActive ? "#0F62FE" : "#fff",
                    display: otherProps?.hideIfDisable
                      ? otherProps?.disabled
                        ? "none"
                        : "block"
                      : "block",
                  }}
                >
                  <input {...getInputProps()} />

                  <div className='flex flex-col items-center gap-5'>
                    {" "}
                    <img
                      src={"/icons/upload.svg"}
                      alt='File icon'
                      className='h-6 w-[38px]'
                    />
                    <div className='flex flex-col items-center gap-2'>
                      <h5 className='text-base font-normal text-[#2C3444]'>
                        Drag your file(s) here or{" "}
                        <span className='text-primary underline cursor-pointer'>
                          browse
                        </span>
                      </h5>
                      <p className='text-sm text-[#7C8B9D] '>
                        Max 10 MB files are allowed
                      </p>
                    </div>
                  </div>
                </div>
                {errors.length > 0 && (
                  <div className='mt-2'>
                    {errors.map((err, i) => (
                      <p key={i} className='text-red-500 text-sm'>
                        {err}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
            {type === "secondary" && (
              <>
                <div
                  {...getRootProps()}
                  className={`drop-zone w-full !flex !h-[44px] !rounded-[8px]  items-center border-[1px] border-[#DAE0E6] mt-2 ${className}`}
                >
                  <input {...getInputProps()} />
                  <span className='text-[#919BA7] text-[13px] ml-4'></span>
                  <div className='flex w-full  items-center !justify-end gap-5'>
                    <CustomButton
                      className='!h-[44px] rounded-l-none '
                      variant='outline'
                    >
                      <LuUpload className='size-5' />
                      {/* Upload */}
                    </CustomButton>
                  </div>
                </div>
                {touched && fieldError && (
                  <div className='text-red-500 text-xs'>{fieldError}</div>
                )}
                {errors.length > 0 && (
                  <div className='mt-2'>
                    {errors.map((err, i) => (
                      <p key={i} className='text-red-500 text-sm'>
                        {err}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}

            {field.value ? (
              !Array.isArray(field.value) ? (
                <div
                  className={`w-full flex items-center gap-2 mt-4 ${className}`}
                >
                  <div className='flex gap-3'>
                    <img
                      src={"/icons/fielicon.svg"}
                      alt='File icon'
                      className='h-[28.8px] w-6'
                    />

                    <Link
                      className='no-underline'
                      to={
                        field?.value?.preview
                          ? field?.value?.preview
                          : `${process.env.REACT_APP_API_BASE_URL}/${
                              field?.value?.url
                                ? field?.value?.url
                                    ?.split("/")
                                    .slice(2)
                                    .join("/")
                                : field?.value?.split("/").slice(2).join("/")
                            }`
                      }
                      target='_blank'
                    >
                      <p className='text-[#0756EA]'>
                        {field.value?.name ||
                          (field.value?.url
                            ? field.value?.url?.split("/")?.slice(-1)
                            : field.value?.split("/")?.slice(-1))}
                      </p>
                    </Link>
                  </div>
                  <button
                    type='button'
                    onClick={() => setFieldValue(field.name, null)}
                  >
                    <Trash2 className='text-red-500 size-5' />
                  </button>
                </div>
              ) : (
                <div className='w-full overflow-x-auto gap-5 mt-4'>
                  {field.value.map((item: any, index: number) => (
                    <div
                      className={`flex justify-between items-center gap-2 mb-1 p-4  border-[#DAE0E6] border-[1px] ${className}`}
                      key={item?.path || item.url}
                    >
                      <div className='flex gap-3'>
                        <img
                          src={
                            item.path.endsWith(".pdf")
                              ? "/icons/pdficon.svg"
                              : item.path.endsWith(".xlsx") ||
                                  item.path.endsWith(".csv")
                                ? "/icons/xlsicon.svg"
                                : item.path.endsWith(".jpg") ||
                                    item.path.endsWith(".png") ||
                                    item.path.endsWith(".svg")
                                  ? "/icons/photo.svg"
                                  : "/icons/fielicon.svg"
                          }
                          alt='File icon'
                          className='h-[29px] w-6'
                        />
                        <Link
                          className='no-underline'
                          to={
                            item.preview
                              ? item.preview
                              : `${process.env.REACT_APP_API_BASE_URL}/${
                                  item.url
                                    ? item.url?.split("/").slice(2).join("/")
                                    : ""
                                }`
                          }
                          target='_blank'
                        >
                          <p className='text-[#0756EA]'>
                            {item.name ||
                              (item.url ? item.url?.split("/")?.slice(-1) : "")}
                          </p>
                        </Link>
                      </div>
                      <button
                        disabled={otherProps?.disabled}
                        type='button'
                        onClick={() => {
                          // setFieldValue(
                          //   field.name,
                          //   field.value.filter((_: any, i: any) => i !== index),
                          // );
                          // resetForm();
                          const updatedFiles = field.value.filter(
                            (_: any, i: any) => i !== index,
                          );
                          setFieldValue(field.name, updatedFiles);
                        }}
                        className='p-2 hover:bg-gray-200 rounded transition-all duration-150 z-50'
                      >
                        <Trash2 className='text-red-500 size-5' />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </>
        )}
      </Dropzone>
    </>
  );
};
