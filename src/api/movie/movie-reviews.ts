import { MovieReviewsResponse } from "@/types/movie";
import { upfetch } from "../_upfetch";

export const getMovieReviews = async (
  movieId: number,
  page = 1
): Promise<MovieReviewsResponse> => {
  return upfetch<MovieReviewsResponse>(`/movie/${movieId}/reviews`, {
    params: { page },
  });
};
