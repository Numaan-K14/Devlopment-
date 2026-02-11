import { useField } from "formik";
import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Label } from "../label";
interface RichTextEditorProps {
  name: string;
  required?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  toolbarId?: any;
}

const formats: string[] = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "image",
];
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  required,
  label,
  disabled,
  onChange,
  className = "",
  toolbarId,
}) => {
  const [field, meta, helpers] = useField(name);

  const modules = {
    toolbar: toolbarId
      ? `#${toolbarId}`
      : [
          ["bold", "italic", "underline", "strike"],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
    clipboard: {
      matchVisual: false,
    },
  };
  return (
    <div className={className}>
      {label && (
        <Label required={required}>
          <span style={{ textTransform: "capitalize" }}>{label}</span>
        </Label>
      )}
      {toolbarId && (
        <div id={toolbarId} className='custom-toolbar'>
          <span className='ql-formats'>
            <select className='ql-size' />
            <button className='ql-bold' />
            <button className='ql-italic' />
            <button className='ql-underline' />
            <button className='ql-strike' />
          </span>
          <span className='ql-formats'>
            <select className='ql-color' />
            <select className='ql-background' />
          </span>
          <span className='ql-formats'>
            <select className='ql-align' />
          </span>
          <span className='ql-formats'>
            <button className='ql-list' value='ordered' />
            <button className='ql-list' value='bullet' />
          </span>
          <span className='ql-formats'>
            <button className='ql-link' />
            <button className='ql-image' />
          </span>
        </div>
      )}

      <ReactQuill
        readOnly={disabled}
        value={field.value}
        onChange={(value) => {
          helpers.setValue(value);
          onChange?.(value);
        }}
        onBlur={() => helpers.setTouched(true)}
        modules={modules}
        formats={formats}
        className='mt-2 !h-full'
      />

      {meta.touched && meta.error && (
        <p className='text-red-500 text-sm mt-1'>{meta.error}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
