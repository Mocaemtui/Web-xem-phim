const { z } = require('zod');

// We use permissive schema
const nguoncListItemSchema = z.object({
  slug: z.string().optional(),
  name: z.string().optional(),
  original_name: z.string().nullable().optional(),
  thumb_url: z.string().nullable().optional(),
  poster_url: z.string().nullable().optional(),
  year: z.union([z.number(), z.string()]).nullable().optional(),
  current_episode: z.union([z.number(), z.string()]).nullable().optional(),
  total_episodes: z.union([z.number(), z.string()]).nullable().optional(),
  quality: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  category: z.any().optional(),
  country: z.any().optional(),
  time: z.string().nullable().optional()
}).passthrough();

const nguoncDetailSchema = nguoncListItemSchema.extend({
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  casts: z.string().nullable().optional(),
  director: z.string().nullable().optional(),
  episodes: z.array(z.any()).optional()
}).passthrough();

const nguoncListResponseSchema = z.object({
  status: z.string().optional(),
  items: z.array(nguoncListItemSchema).optional(),
  paginate: z.object({
    current_page: z.number().optional(),
    total_page: z.number().optional(),
    total_items: z.number().optional()
  }).optional()
}).passthrough();

const nguoncDetailResponseSchema = z.object({
  status: z.string().optional(),
  movie: nguoncDetailSchema.optional()
}).passthrough();

module.exports = {
  nguoncListResponseSchema,
  nguoncDetailResponseSchema
};
