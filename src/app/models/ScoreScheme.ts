import z from 'zod'

  export const GameSchemaToView = z.object({
    name: z.string(),
  });
  
  export const ScoreSchema = z.object({
    id: z.number(),
    score: z.number(),
    Game: GameSchemaToView, // Usa el esquema que valida solo "name"
  });
  
  export const ScoresResponseSchema = z.object({
    message: z.string(),
    scores: z.array(ScoreSchema),
  });
  