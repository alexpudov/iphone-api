export function getErrorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "Something went wrong";
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU");
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}