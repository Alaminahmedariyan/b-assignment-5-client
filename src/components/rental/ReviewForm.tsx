'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  reviewSchema,
  type ReviewFormValues,
} from '@/lib/validations/misc.schema';

interface ReviewFormProps {
  rentalOrderItemId: string;
  onDone: () => void;
}

export function ReviewForm({ rentalOrderItemId, onDone }: ReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = watch('rating');

  const onValidSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: values.rating,
          comment: values.comment?.trim() || undefined,
          rentalOrderItemId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to submit review.');
      }

      toast.success('Thanks for your review!');
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
      className="mt-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-4"
    >
      <p className="text-sm font-medium">Rate this gear</p>

      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue('rating', star, { shouldValidate: true })}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} stars`}
            className="cursor-pointer p-0.5"
          >
            <Star
              className={`size-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-current text-amber-500'
                  : 'text-muted'
              }`}
            />
          </button>
        ))}
      </div>

      {errors.rating && (
        <p className="mt-1 text-xs text-destructive">
          {errors.rating.message}
        </p>
      )}

      <textarea
        placeholder="Share your experience (optional)"
        rows={2}
        className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...register('comment')}
      />
      {errors.comment && (
        <p className="mt-1 text-xs text-destructive">
          {errors.comment.message}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="cursor-pointer rounded-full"
        >
          {isSubmitting && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
          Submit review
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDone}
          className="cursor-pointer rounded-full"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}