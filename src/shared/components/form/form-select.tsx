'use client';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorText, RequiredSymbol } from '@/shared/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';

export type FormSelectType = {
  id: number;
  label: string;
  name: string;
};
interface Props extends React.InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  data: FormSelectType[];
}

export const FormSelect: React.FC<Props> = ({ name, label, required, data }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorText = errors[name]?.message as string;

  return (
    <div className='relative'>
      {label && (
        <p className='font-medium mb-0.5 text-sm'>
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = field.value ?? '';
          return (
            <div className='relative'>
              <Select value={value} onValueChange={field.onChange}>
                <SelectTrigger className=' text-sm w-full' size='sm'>
                  <SelectValue placeholder='Выберите...' />
                </SelectTrigger>
                <SelectContent>
                  {data.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
      />

      {errorText && <ErrorText text={errorText} className='absolute text-[12px] right-0' />}
    </div>
  );
};
