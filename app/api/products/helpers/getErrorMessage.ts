export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: string }).message;
    return message || "Unknown error";
  }

  return "Unknown error";
};
