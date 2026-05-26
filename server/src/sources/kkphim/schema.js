const { z } = require('zod');

const kkphimListItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  origin_name: z.string().nullable().optional(),
  thumb_url: z.string().nullable().optional(),
  poster_url: z.string().nullable().optional(),
  year: z.union([z.number(), z.string()]).nullable().optional(),
  modified: z.object({ time: z.string() }).optional(),
}).passthrough();

const kkphimDetailSchema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  origin_name: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  thumb_url: z.string().nullable().optional(),
  poster_url: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  episode_current: z.string().nullable().optional(),
  episode_total: z.string().nullable().optional(),
  quality: z.string().nullable().optional(),
  lang: z.string().nullable().optional(),
  year: z.union([z.number(), z.string()]).nullable().optional(),
  actor: z.array(z.string()).optional(),
  director: z.array(z.string()).optional(),
  category: z.array(z.object({ name: z.string() }).passthrough()).optional(),
  country: z.array(z.object({ name: z.string() }).passthrough()).optional(),
}).passthrough();

const kkphimListResponseSchema = z.object({
  status: z.boolean().optional(),
  items: z.array(kkphimListItemSchema).optional(),
  pagination: z.object({
    totalItems: z.number().optional(),
    totalPages: z.number().optional(),
    currentPage: z.number().optional()
  }).optional()
}).passthrough();

const kkphimDetailResponseSchema = z.object({
  status: z.boolean().optional(),
  movie: kkphimDetailSchema.optional(),
  episodes: z.array(z.any()).optional()
}).passthrough();

module.exports = {
  kkphimListResponseSchema,
  kkphimDetailResponseSchema
};
