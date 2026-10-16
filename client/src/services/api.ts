const API_BASE = '/api';

class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

const getToken = (): string | null => {
  return localStorage.getItem('careerlens_token');
};

const setToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('careerlens_token', token);
  } else {
    localStorage.removeItem('careerlens_token');
  }
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers || {});

  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Don't set Content-Type if sending FormData (browser automatically sets boundary)
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // send cookies for HTTP-only cookie support
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Network request failed', response.status, data.details);
  }

  return data as T;
};

export const api = {
  setToken,
  getToken,

  // Auth
  auth: {
    register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request<any>('/auth/logout', { method: 'POST' }),
    me: () => request<any>('/auth/me'),
    forgotPassword: (body: any) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
    resetPassword: (body: any) => request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  },

  // Resumes
  resumes: {
    upload: (formData: FormData) => request<any>('/resumes', { method: 'POST', body: formData }),
    list: () => request<any>('/resumes'),
    getById: (id: string) => request<any>(`/resumes/${id}`),
    update: (id: string, body: any) => request<any>(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<any>(`/resumes/${id}`, { method: 'DELETE' }),
    downloadUrl: (id: string) => `${API_BASE}/resumes/${id}/file`,
  },

  // Analyses
  analyses: {
    create: (body: any) => request<any>('/analyses', { method: 'POST', body: JSON.stringify(body) }),
    list: (page = 1, limit = 10) => request<any>(`/analyses?page=${page}&limit=${limit}`),
    getById: (id: string) => request<any>(`/analyses/${id}`),
    delete: (id: string) => request<any>(`/analyses/${id}`, { method: 'DELETE' }),
    stats: () => request<any>('/analyses/stats/summary'),
  },

  // Jobs
  jobs: {
    list: (params: Record<string, string | number> = {}) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any>(`/jobs?${query}`);
    },
    getById: (id: string) => request<any>(`/jobs/${id}`),
    save: (id: string) => request<any>(`/jobs/${id}/save`, { method: 'POST' }),
    removeSaved: (id: string) => request<any>(`/jobs/${id}/save`, { method: 'DELETE' }),
    updateStatus: (id: string, body: any) => request<any>(`/jobs/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
    getSaved: () => request<any>('/jobs/saved/all'),
  },

  // Skills
  skills: {
    taxonomy: () => request<any>('/skills'),
    gapAnalysis: (analysisId: string) => request<any>(`/skills/gap-analysis/${analysisId}`),
  },

  // Interviews
  interviews: {
    create: (body: any) => request<any>('/interviews', { method: 'POST', body: JSON.stringify(body) }),
    list: () => request<any>('/interviews'),
    getById: (id: string) => request<any>(`/interviews/${id}`),
    submitAnswer: (id: string, body: { questionId: string; userResponse: string }) =>
      request<any>(`/interviews/${id}/answer`, { method: 'PUT', body: JSON.stringify(body) }),
  },

  // Admin
  admin: {
    analytics: () => request<any>('/admin/analytics'),
    users: (page = 1) => request<any>(`/admin/users?page=${page}`),
    createJob: (body: any) => request<any>('/admin/jobs', { method: 'POST', body: JSON.stringify(body) }),
    updateJob: (id: string, body: any) => request<any>(`/admin/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteJob: (id: string) => request<any>(`/admin/jobs/${id}`, { method: 'DELETE' }),
    addSkill: (body: any) => request<any>('/admin/skills', { method: 'POST', body: JSON.stringify(body) }),
  },
};
