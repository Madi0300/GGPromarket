export async function fetchFromApi<T>(request: Request, endpoint: string): Promise<T> {
  const base = new URL(request.url);
  const url = new URL(endpoint, base.origin);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Response(`Failed to fetch ${endpoint}`, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return (await response.json()) as T;
}
