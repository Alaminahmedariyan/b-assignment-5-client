import { getCurrentUser } from "./auth.service";


export async function getSafeCurrentUser() {
  try {
    const response = await getCurrentUser();

    if (!response.success) {
      return null;
    }

    return response.data;
  } catch {
    return null;
  }
}