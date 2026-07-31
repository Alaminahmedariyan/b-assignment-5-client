export interface SpecEntry {
  key: string;
  value: string;
}

export interface GearFormValues {
  name: string;
  description: string;
  brand: string;
  pricePerDay: string;
  originalPricePerDay: string;
  totalQuantity: string;
  categoryId: string;
  specifications: SpecEntry[];
}

export interface CreateGearPayload {
  name: string;
  description: string;
  brand?: string;
  pricePerDay: number;
  originalPricePerDay?: number;
  totalQuantity: number;
  categoryId: string;
  specifications?: Record<string, string>;
}

export type UpdateGearPayload = Partial<CreateGearPayload> & {
  isListed?: boolean;
};