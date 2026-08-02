'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { UserProfileDetail } from '@/types/profile';

import {
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validations/misc.schema';

interface ProfileFormProps {
  user: UserProfileDetail;
}

export function ProfileForm({
  user,
}: ProfileFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [preview, setPreview] = useState(
    user.image ?? '',
  );

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      name: user.name,
      phone: user.phone ?? '',
      address: user.address ?? '',
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onValidSubmit = async (
    values: ProfileFormValues,
  ) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append(
        'phone',
        values.phone || '',
      );
      formData.append(
        'address',
        values.address || '',
      );

      if (imageFile) {
        formData.append(
          'image',
          imageFile,
        );
      }

      const response = await fetch(
        '/api/profile',
        {
          method: 'PATCH',
          body: formData,
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data?.message ??
            'Failed to update profile.',
        );
      }

      toast.success(
        'Profile updated successfully.',
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onValidSubmit,
      )}
      className="space-y-6"
    >
      {/* Avatar */}

      <div className="flex flex-col items-center gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-border">
          {preview ? (
            <Image
              src={preview}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary text-3xl font-bold text-primary-foreground">
              {user.name
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>

        <Input
          type="file"
          accept="image/*"
          onChange={
            handleImageChange
          }
        />
      </div>

      {/* Email */}

      <div className="space-y-2">
        <Label>Email</Label>

        <Input
          value={user.email}
          disabled
        />

        <p className="text-xs text-muted-foreground">
          Email {"can't"} be changed.
        </p>
      </div>

      {/* Name */}

      <div className="space-y-2">
        <Label htmlFor="name">
          Full name
        </Label>

        <Input
          id="name"
          aria-invalid={Boolean(
            errors.name,
          )}
          {...register('name')}
        />

        {errors.name && (
          <p className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Phone */}

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone
        </Label>

        <Input
          id="phone"
          type="tel"
          placeholder="+880 1XXXXXXXXX"
          aria-invalid={Boolean(
            errors.phone,
          )}
          {...register('phone')}
        />

        {errors.phone && (
          <p className="text-xs text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Address */}

      <div className="space-y-2">
        <Label htmlFor="address">
          Address
        </Label>

        <Input
          id="address"
          placeholder="Your address"
          aria-invalid={Boolean(
            errors.address,
          )}
          {...register('address')}
        />

        {errors.address && (
          <p className="text-xs text-destructive">
            {
              errors.address
                .message
            }
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer rounded-full"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}

        Save Changes
      </Button>
    </form>
  );
}