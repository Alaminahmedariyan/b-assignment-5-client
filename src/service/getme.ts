"use server";

import { User } from "@/types/user";
import { cookies } from "next/headers";

interface GetMeResponse {
  success: boolean;
  data: {
    profile: User;
  };
}

export const getMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/users/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: GetMeResponse = await response.json();

    if (!result.success || !result.data.profile) {
      return null;
    }

    return result.data.profile;
  } catch (error) {
    console.error(error);
    return null;
  }
};