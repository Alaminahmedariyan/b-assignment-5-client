'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Category } from '@/types/gear';
import {
  gearFormSchema,
  type GearFormSchemaValues,
} from '@/lib/validations/gear.schema';

interface GearFormProps {
  mode: 'create' | 'edit';
  categories: Category[];
  gearId?: string;
  initialValues?: Partial<GearFormSchemaValues>;
}

const EMPTY_VALUES: GearFormSchemaValues = {
  name: '',
  description: '',
  brand: '',
  categoryId: '',
  pricePerDay: 0,
  originalPricePerDay: '',
  totalQuantity: 1,
  specifications: [],
};

export function GearForm({
  mode,
  categories,
  gearId,
  initialValues,
}: GearFormProps) {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GearFormSchemaValues>({
    resolver: zodResolver(gearFormSchema),
    mode: 'onBlur',
    defaultValues: { ...EMPTY_VALUES, ...initialValues },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications',
  });

  /* ================================================================ */
  /* Image handling (kept as plain state — file inputs don't benefit   */
  /* much from RHF/zod; validated separately as "optional, max 10")    */
  /* ================================================================ */

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const combined = [...images, ...files].slice(0, 10);
    setImages(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    setImagePreviews(nextImages.map((file) => URL.createObjectURL(file)));
  };

  /* ================================================================ */
  /* Submit                                                             */
  /* ================================================================ */

  const buildSpecificationsObject = (
    specs: GearFormSchemaValues['specifications'],
  ) => {
    const entries = specs
      .filter((spec) => spec.key.trim() && spec.value.trim())
      .map((spec) => [spec.key.trim(), spec.value.trim()]);

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  };

  const onValidSubmit = async (values: GearFormSchemaValues) => {
    setIsSubmitting(true);

    const basePayload = {
      name: values.name,
      description: values.description,
      brand: values.brand || undefined,
      pricePerDay: values.pricePerDay,
      originalPricePerDay: values.originalPricePerDay || undefined,
      totalQuantity: values.totalQuantity,
      categoryId: values.categoryId,
      specifications: buildSpecificationsObject(values.specifications),
    };

    try {
      if (mode === 'create') {
        const formData = new FormData();
        formData.append('data', JSON.stringify(basePayload));
        images.forEach((file) => formData.append('images', file));

        const response = await fetch('/api/provider/gears', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.message ?? 'Failed to create gear.');
        }

        toast.success('Gear listed successfully!');
        router.push('/provider/gears');
        router.refresh();
      } else {
        const response = await fetch(`/api/provider/gears/${gearId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basePayload),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.message ?? 'Failed to update gear.');
        }

        toast.success('Gear updated successfully!');
        router.push('/provider/gears');
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-8">
      {/* ==================================================================
          Basic info
      ================================================================== */}

      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">
          Basic information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Gear name</Label>
            <Input
              id="name"
              aria-invalid={Boolean(errors.name)}
              placeholder="Sony Alpha A7 IV"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" placeholder="Sony" {...register('brand')} />
            {errors.brand && (
              <p className="text-xs text-destructive">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              aria-invalid={Boolean(errors.categoryId)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('categoryId')}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerDay">Price per day (৳)</Label>
            <Input
              id="pricePerDay"
              type="number"
              min={0}
              step="0.01"
              aria-invalid={Boolean(errors.pricePerDay)}
              placeholder="1500"
              {...register('pricePerDay')}
            />
            {errors.pricePerDay && (
              <p className="text-xs text-destructive">
                {errors.pricePerDay.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPricePerDay">
              Original price (৳) — optional
            </Label>
            <Input
              id="originalPricePerDay"
              type="number"
              min={0}
              step="0.01"
              placeholder="2000"
              {...register('originalPricePerDay')}
            />
            {errors.originalPricePerDay ? (
              <p className="text-xs text-destructive">
                {errors.originalPricePerDay.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Set higher than the price above to show a discount badge.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalQuantity">Quantity available</Label>
            <Input
              id="totalQuantity"
              type="number"
              min={1}
              aria-invalid={Boolean(errors.totalQuantity)}
              {...register('totalQuantity')}
            />
            {errors.totalQuantity && (
              <p className="text-xs text-destructive">
                {errors.totalQuantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              aria-invalid={Boolean(errors.description)}
              placeholder="Describe the condition, what's included, and ideal use cases..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================
          Specifications — RHF useFieldArray
      ================================================================== */}

      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Specifications
          </h2>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ key: '', value: '' })}
            className="cursor-pointer"
          >
            <Plus className="mr-1.5 size-3.5" />
            Add spec
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Optional — e.g. "Sensor: Full-frame", "Weight: 650g"
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Sensor"
                  className="flex-1"
                  {...register(`specifications.${index}.key` as const)}
                />
                <Input
                  placeholder="Full-frame"
                  className="flex-1"
                  {...register(`specifications.${index}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================
          Images — create mode only
      ================================================================== */}

      {mode === 'create' && (
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Photos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            First photo becomes the primary image. Up to 10 photos, 5MB
            each (JPG, PNG, WEBP).
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {imagePreviews.map((src, index) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />

                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Primary
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1.5 top-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                <ImagePlus className="size-5" />
                <span className="text-xs">Add photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>
      )}

      {mode === 'edit' && (
        <p className="text-xs text-muted-foreground">
          Photos can't be changed from this form yet — delete and
          re-create the listing if you need to update images.
        </p>
      )}

      {/* ==================================================================
          Submit
      ================================================================== */}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-full px-8"
          size="lg"
        >
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {mode === 'create' ? 'List gear' : 'Save changes'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/provider/gears')}
          className="cursor-pointer rounded-full"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}