'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CategoryWithRelations } from '@/types/gear';

import { CategoryForm } from './CategoryForm';
import { CategoryRow } from './CategoryRow';

interface CategoriesPageClientProps {
  topLevelCategories: CategoryWithRelations[];
  allCategories: CategoryWithRelations[];
}

export function CategoriesPageClient({
  topLevelCategories,
  allCategories,
}: CategoriesPageClientProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button
          type="button"
          onClick={() => setShowCreateForm((previous) => !previous)}
          className="cursor-pointer rounded-full"
        >
          {showCreateForm ? (
            <>
              <X className="mr-1.5 size-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-1.5 size-4" />
              Add category
            </>
          )}
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CategoryForm
            mode="create"
            parentOptions={allCategories}
            onDone={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {topLevelCategories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 p-12 text-center text-sm text-muted-foreground">
          No categories yet. Add your first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {topLevelCategories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              allCategories={allCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
}