import { Input } from "@/components/ui/input";
import { useField } from "formik";
import CustomButton from "../button";
import { Label } from "../label";

export function InputFile({ name, label }: { name: string; label?: string }) {
  const [, , helpers] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    helpers.setValue(file);
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label>{label}</Label>
      <div className='flex '>
        <Input
          id={name}
          type='file'
          onChange={handleChange}
          placeholder='upload'
          className='rounded-r-none '
        />
        <CustomButton className='!h-[48px] rounded-l-none bg-[#008A88]'>
          <img src='/icons/upload2.svg' alt='upload' />
          Upload
        </CustomButton>
      </div>
    </div>
  );
}
