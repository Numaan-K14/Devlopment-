import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

const AlertComponent = ({
  message,
  type,
  className,
}: {
  message: string;
  type: any;
  className?: string;
}) => {
  return (
    <Alert
      variant={type}
      className={`ml-[-10px] w-fit  flex items-center border-0 !rounded-sm ${className} `}
    >
      <AlertCircle className='h-4 w-4 ' />
      <AlertDescription className='mt-1 '>{message}</AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
