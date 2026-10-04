type ValidationErrorItem = {
  loc?: Array<string | number>;
  msg?: string;
};

type ApiErrorResponse = {
  detail?: string | ValidationErrorItem[];
};

export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const errorData = (await response.json()) as ApiErrorResponse;

    if (typeof errorData.detail === "string") {
      return errorData.detail;
    }

    if (Array.isArray(errorData.detail)) {
      return errorData.detail
        .map((error) => {
          const message = error.msg ?? "Invalid value";

          return message.replace("Value error, ", "");
        })
        .join(". ");
    }
  } catch {
    // Response body is not JSON
  }

  return `${fallbackMessage}: ${response.status}`;
}
