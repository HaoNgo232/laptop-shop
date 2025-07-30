/**
 * Format rating display text
 */
export function formatRating(
  averageRating: number | string | null | undefined,
  reviewCount: number | string | null | undefined,
): string {
  const safeReviewCount = Number(reviewCount) || 0;
  const safeAverageRating = Number(averageRating) || 0;

  if (safeReviewCount === 0) {
    return "Chưa có đánh giá";
  }

  return `${safeAverageRating.toFixed(1)} / 5 từ ${safeReviewCount} đánh giá`;
}

/**
 * Get rating stars count for display
 */
export function getRatingStars(
  rating: number | string | null | undefined,
): number {
  const safeRating = Number(rating) || 0;
  return Math.round(safeRating * 2) / 2; // Round to nearest 0.5
}

/**
 * Format short rating text
 */
export function formatShortRating(
  averageRating: number | string | null | undefined,
  reviewCount: number | string | null | undefined,
): string {
  const safeReviewCount = Number(reviewCount) || 0;
  const safeAverageRating = Number(averageRating) || 0;

  if (safeReviewCount === 0) {
    return "Chưa có đánh giá";
  }

  return `${safeAverageRating.toFixed(1)} (${safeReviewCount})`;
}
