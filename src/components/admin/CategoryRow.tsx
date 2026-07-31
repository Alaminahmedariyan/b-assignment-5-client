'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { CategoryWithRelations } from '@/types/gear';

import { CategoryForm } from './CategoryForm';

interface CategoryRowProps {
  category: CategoryWithRelations;
  allCategories: CategoryWithRelations[];
  depth?: number;
}

export function CategoryRow({
  category,
  allCategories,
  depth = 0,
}: CategoryRowProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const childCategories = allCategories.filter(
    (candidate) => candidate.parentId === category.id,
  );

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${category.name}"? This can't be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        { method: 'DELETE' },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Backend rejects deletion if the category has child categories
        // or gear items — surface that reason instead of a generic error.
        throw new Error(data?.message ?? 'Failed to delete category.');
      }

      toast.success('Category deleted.');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div className="card-elevate flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 shadow-sm">
        {childCategories.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsExpanded((previous) => !previous)}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <span className="size-4" />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{category.name}</p>
          {category.description && (
            <p className="truncate text-xs text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        {childCategories.length > 0 && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {childCategories.length} sub
          </span>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing((previous) => !previous)}
          className="shrink-0 cursor-pointer text-xs"
        >
          <Pencil className="mr-1.5 size-3.5" />
          Edit
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="shrink-0 cursor-pointer text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {isDeleting ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <Trash2 className="mr-1.5 size-3.5" />
          )}
          Delete
        </Button>
      </div>

      {isEditing && (
        <CategoryForm
          mode="edit"
          categoryId={category.id}
          parentOptions={allCategories}
          initialValues={{
            name: category.name,
            description: category.description ?? '',
            parentId: category.parentId ?? '',
          }}
          onDone={() => setIsEditing(false)}
        />
      )}

      {isExpanded && childCategories.length > 0 && (
        <div className="mt-2 space-y-2">
          {childCategories.map((child) => (
            <CategoryRow
              key={child.id}
              category={child}
              allCategories={allCategories}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}