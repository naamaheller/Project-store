export type ValidationErrorItem = {
  field: string;
  message: string;
};

export type ApiErrorPayload = {
  type: string;
  status: number;
  message: string;
  timestamp?: string;
  validation_errors?: ValidationErrorItem[];
  allowed_methods?: string | string[];
};

export type ApiError = {
  status: number;
  message: string;
  type?: string;
  payload?: ApiErrorPayload;
  isNetworkError?: boolean;
};
