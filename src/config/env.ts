const backendApiUrl = process.env.BACKEND_API_URL;

if (!backendApiUrl) {
  throw new Error(
    'BACKEND_API_URL is not defined in the environment variables.',
  );
}

export const env = {
  backendApiUrl: backendApiUrl.replace(/\/$/, ''),
} as const;