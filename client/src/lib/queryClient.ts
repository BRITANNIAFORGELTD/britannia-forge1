import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { ADMIN_TOKEN_KEY } from './auth';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const isAdminApi = url.startsWith('/api/admin') || url.startsWith('/api/auth');
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (isAdminApi && adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const isAdminApi = url.startsWith('/api/admin') || url.startsWith('/api/auth');
    const headers: Record<string, string> = {};
    if (isAdminApi && adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(url, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    let json: any = null;
    try {
      json = await res.json();
    } catch {}

    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      if ((json as any).success) return (json as any).data;
      const message = (json as any).error || `Request failed with ${res.status}`;
      throw new Error(message);
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return json;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
