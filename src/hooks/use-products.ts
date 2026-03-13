import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: z.object({
    rate: z.number(),
    count: z.number()
  })
});

export type Product = z.infer<typeof ProductSchema>;

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return z.array(ProductSchema).parse(data);
    },
    staleTime: 1000 * 60 * 60, // Cache for an hour since fake store rarely changes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const data = await res.json();
      return ProductSchema.parse(data);
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('https://fakestoreapi.com/products/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return z.array(z.string()).parse(await res.json());
    },
    staleTime: 1000 * 60 * 60,
  });
}
