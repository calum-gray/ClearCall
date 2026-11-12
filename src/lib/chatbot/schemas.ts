import { z } from "zod";

export const chatRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(2000),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
