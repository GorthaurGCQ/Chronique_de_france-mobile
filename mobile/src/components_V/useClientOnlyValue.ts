/** Natif — retourne directement la valeur client (pas de SSR). */
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  return client;
}
