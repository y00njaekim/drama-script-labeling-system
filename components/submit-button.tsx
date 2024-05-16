'use client';
import React from 'react';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';
import { type ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

const baseStyles = 'flex justify-center items-center rounded-lg transition-colors';
const textStyles = 'text-white font-medium text-sm';
const sizeStyles = 'h-10 px-4';
const colorStyles = 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600';
const focusStyles =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

type Props = ComponentProps<'button'> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button asChild>
      <button
        {...props}
        type="submit"
        aria-disabled={pending}
        className={clsx(baseStyles, textStyles, sizeStyles, colorStyles, focusStyles)}
      >
        {isPending ? (
          <span className="flex">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            {pendingText}
          </span>
        ) : (
          children
        )}
      </button>
    </Button>
  );
}
