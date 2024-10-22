import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useId } from "react";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  placeholder?: string;
  labelCn?: string;
  inputCn?: string;
};

export default function InputField(props: FieldProps) {
  const {
    className = "",
    label,
    labelCn = "",
    inputCn = "",
    id: excternalId,
    ...rest
  } = props;

  const internalId = useId();

  const id = excternalId || internalId;

  return (
    <div className={className}>
      {label && (
        <label className={cn("ml-2 text-sm font-medium", labelCn)} htmlFor={id}>
          {label}
        </label>
      )}
      <Input
        className={cn("mt-1 mb-3 bg-background", inputCn)}
        id={id}
        {...rest}
      />
    </div>
  );
}
