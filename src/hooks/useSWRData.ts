import useSWR from 'swr';
import type { Product, Seller, Blog } from '@/lib/types';
import { getProducts, getSellers, getBlogs } from '@/lib/firebase/firestore';

// Custom hook for products
export const useProducts = (status?: Product['status'] | 'all') => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Product[]>(
    ['products', status],
    () => getProducts(status),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
    }
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
};

// Custom hook for sellers
export const useSellers = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Seller[]>(
    'sellers',
    () => getSellers(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
    }
  );

  return {
    sellers: data || [],
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
};

// Custom hook for blogs
export const useBlogs = (status?: Blog['status'] | 'all') => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Blog[]>(
    ['blogs', status],
    () => getBlogs(status),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
    }
  );

  return {
    blogs: data || [],
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
};