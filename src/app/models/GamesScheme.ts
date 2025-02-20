import { z } from "zod";

export const GameSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  rules : z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GamesArraySchema = z.array(GameSchema);
export type Game = z.infer<typeof GameSchema>;

