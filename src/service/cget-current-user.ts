import { getCurrentUser } from "./auth.service";

export async function getSafeCurrentUser() {
  try {
    const response = await getCurrentUser();

    if (!response || !response.success || !response.data) {
      return null;
    }

    return response.data;
  } catch {
    return null;
  }
}