'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CleareButton, ErrorText, RequiredSymbol } from '@/shared/components';
import { Input } from '@/shared/components/ui';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FormInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  children,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickCleare = () => {
    setValue(name, name === 'phone' ? '+7' : '', { shouldValidate: true });
  };
  return (
    <div className={className}>
      {label && (
        <p className='font-medium mb-1 text-sm'>
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className='relative'>
        {children}

        <Input {...props} {...register(name)} className={children?.valueOf && 'pl-9'} />
        {value && <CleareButton onClick={onClickCleare} />}
      </div>

      {errorText && <ErrorText className='' text={errorText} />}
    </div>
  );
};
