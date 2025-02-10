"use server";

import { env } from "../../env";

interface AuthenticationResponse {
  status_code: number;
  status_message: string;
  success: boolean;
}

export const getAuthentication = async (): Promise<AuthenticationResponse> => {
  const url = "https://api.themoviedb.org/3/authentication";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${env.MOVIE_DB_API_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Error code: ${res.status}`);
  const data: AuthenticationResponse = await res.json();

  return data;
};
