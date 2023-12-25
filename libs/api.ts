export const getAPIURL = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiURL) {
    throw new Error("Missing API_URL env var");
  }
  return apiURL;
};
