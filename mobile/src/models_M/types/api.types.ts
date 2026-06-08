/** Format standard de réponse API du backend Next.js. */
export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: unknown;
};
