import { z } from 'zod';

export const createStreamSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, 'Stream name is required')
      .max(100, 'Stream name must be less than 100 characters')
      .trim(),
    description: z.string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
    source_url: z.string()
      .url('Invalid source URL')
      .max(2000, 'URL must be less than 2000 characters'),
    platform: z.enum(['youtube', 'facebook', 'twitch', 'custom']),
    stream_key: z.string()
      .min(1, 'Stream key is required')
      .max(255, 'Stream key must be less than 255 characters'),
    rtmp_url: z.string()
      .url('Invalid RTMP URL')
      .optional(),
    quality: z.enum(['720p', '1080p', '4k']).default('1080p'),
    is_24h: z.boolean().default(false)
  })
});

export const updateStreamSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, 'Stream name is required')
      .max(100, 'Stream name must be less than 100 characters')
      .trim()
      .optional(),
    description: z.string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
    source_url: z.string()
      .url('Invalid source URL')
      .max(2000, 'URL must be less than 2000 characters')
      .optional(),
    stream_key: z.string()
      .max(255, 'Stream key must be less than 255 characters')
      .optional(),
    quality: z.enum(['720p', '1080p', '4k']).optional(),
    is_24h: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().uuid('Invalid stream ID')
  })
});

export const streamIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid stream ID')
  })
});

export type CreateStreamInput = z.infer<typeof createStreamSchema>['body'];
export type UpdateStreamInput = z.infer<typeof updateStreamSchema>['body'];
