import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/products' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    tagline: z.string(),
    price: z.string().optional(),
    category: z.string(),
    badge: z.string().optional().nullable(),
    order: z.number().default(0),
    image: z.string().optional(),
    images: z.array(z.string()),
    details: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    description: z.string(),
    phone: z.string(),
    whatsappNumber: z.string(),
    defaultMessage: z.string(),
    instagramHandle: z.string(),
    instagramUrl: z.string(),
    location: z.string(),
    announcement: z.string(),
    hero: z.object({
      badge: z.string(),
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
      highlights: z.array(z.object({
        icon: z.string(),
        text: z.string(),
      })),
    }),
    personalized: z.object({
      badge: z.string(),
      title: z.string(),
      description: z.string(),
      items: z.array(z.object({
        title: z.string(),
        rows: z.array(z.string()),
      })),
      notice: z.string(),
      ctaText: z.string(),
      gallery: z.array(z.string()),
    }),
    cta: z.object({
      title: z.string(),
      description: z.string(),
      buttonText: z.string(),
    }),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { products, settings, categories };
