'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryWithRelations } from '@/types/gear';
import {
  categorySchema,
  type CategoryFormValues,
} from '@/lib/validations/misc.schema';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  categoryId?: string;
  parentOptions: CategoryWithRelations[];
  initialValues?: CategoryFormValues;
  onDone: () => void;
}

export function CategoryForm({
  mode,
  categoryId,
  parentOptions,
  initialValues,
  onDone,
}: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: 'onBlur',
    defaultValues: initialValues ?? { name: '', description: '', parentId: '' },
  });

  const onValidSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);

    const payload = {
      name: values.name,
      description: values.description || undefined,
      parentId: values.parentId || undefined,
    };

    try {
      const response = await fetch(
        mode === 'create'
          ? '/api/admin/categories'
          : `/api/admin/categories/${categoryId}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to save category.');
      }

      toast.success(mode === 'create' ? 'Category created.' : 'Category updated.');
      router.refresh();
      onDone();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
      className="mt-3 space-y-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cat-name" className="text-xs">
            Name
          </Label>
          <Input
            id="cat-name"
            aria-invalid={Boolean(errors.name)}
            placeholder="Camera & Photography"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-parent" className="text-xs">
            Parent category (optional)
          </Label>
          <select
            id="cat-parent"
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register('parentId')}
          >
            <option value="">None (top-level)</option>
            {parentOptions
              .filter((option) => option.id !== categoryId)
              .map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-description" className="text-xs">
          Description (optional)
        </Label>
        <Input
          id="cat-description"
          placeholder="Short description shown to customers"
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="cursor-pointer rounded-full"
        >
          {isSubmitting ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 size-3.5" />
          )}
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDone}
          className="cursor-pointer rounded-full"
        >
          <X className="mr-1.5 size-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}