import { z } from "zod";
import { CreateReview, UpdateReview } from "@/types/interfaces/reviews";

export const UpdateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
}) satisfies z.ZodType<UpdateReview>;

export const CreateReviewSchema = UpdateReviewSchema.extend({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
}) satisfies z.ZodType<CreateReview>;
