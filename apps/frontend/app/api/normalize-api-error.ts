import type { AxiosError } from "axios";
import type { ApiError, ApiErrorPayload } from "./api-error";

function isApiPayload(x: any): x is ApiErrorPayload {
  return (
    x &&
    typeof x === "object" &&
    typeof x.status === "number" &&
    typeof x.message === "string"
  );
}

export function normalizeApiError(err: unknown): ApiError {
  const ax = err as AxiosError<any>;

  if (ax?.isAxiosError && !ax.response) {
    return {
      status: 0,
      message: "Network error. Please try again.",
      isNetworkError: true,
    };
  }

  const status = ax?.response?.status ?? 500;
  const data = ax?.response?.data;

  const payload: ApiErrorPayload | undefined =
    isApiPayload(data)
      ? data
      : isApiPayload(data?.error)
        ? data.error
        : undefined;

  return {
    status,
    message: payload?.message ?? ax?.message ?? "Request failed",
    type: payload?.type,
    payload,
  };
}
