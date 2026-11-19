import { env, isApiConfigured } from './env'

export class ApiConfigurationError extends Error {
  constructor() {
    super('Backend API belum dikonfigurasi. Isi NEXT_PUBLIC_API_BASE_URL atau gunakan mode demo.')
    this.name = 'ApiConfigurationError'
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isApiConfigured) throw new ApiConfigurationError()

  const response = await fetch(`${env.apiBaseUrl}/${path.replace(/^\//, '')}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request gagal (${response.status} ${response.statusText})`)
  }

  return response.json() as Promise<T>
}
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL !== undefined && process.env.NEXT_PUBLIC_API_URL !== ''
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== 'undefined'
      ? ''
      : 'http://127.0.0.1:5001'

export function getFullUploadUrl(fileUrl?: string | null, download = false): string {
  if (!fileUrl) return ''
  const base = fileUrl.startsWith('http')
    ? fileUrl
    : `${API_BASE_URL}${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`
  return download ? `${base}${base.includes('?') ? '&' : '?'}download=1` : base
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/api/auth/me'),

  // Dashboard
  getDashboardSummary: () => apiRequest('/api/dashboard/summary'),
  getDashboardPrograms: () => apiRequest('/api/dashboard/programs'),
  getDashboardTasks: () => apiRequest('/api/dashboard/tasks'),
  getDashboardActivities: () => apiRequest('/api/dashboard/activities'),

  // Proposals
  getProposals: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/proposals${qs}`)
  },
  getProposalDetail: (id: string) => apiRequest(`/api/proposals/${id}`),
  createProposal: (data: any) =>
    apiRequest('/api/proposals', { method: 'POST', body: JSON.stringify(data) }),
  updateProposalStatus: (id: string, status: string, statusNote?: string, extra?: Record<string, any>) =>
    apiRequest(`/api/proposals/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, statusNote, ...(extra || {}) }),
    }),

  // MOUs
  getMous: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/mous${qs}`)
  },
  getMouDetail: (id: string) => apiRequest(`/api/mous/${id}`),
  createMou: (data: any) =>
    apiRequest('/api/mous', { method: 'POST', body: JSON.stringify(data) }),
  updateMouStatus: (id: string, status: string, statusNote?: string) =>
    apiRequest(`/api/mous/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, statusNote }),
    }),

  // Assessments
  getAssessments: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/assessments${qs}`)
  },
  getAssessmentDetail: (id: string) => apiRequest(`/api/assessments/${id}`),
  createAssessment: (data: any) =>
    apiRequest('/api/assessments', { method: 'POST', body: JSON.stringify(data) }),
  updateAssessment: (id: string, data: any) =>
    apiRequest(`/api/assessments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAssessment: (id: string) =>
    apiRequest(`/api/assessments/${id}`, { method: 'DELETE' }),

  // Request Program
  getRequestPrograms: () => apiRequest('/api/request-program'),
  createRequestProgram: (data: any) =>
    apiRequest('/api/request-program', { method: 'POST', body: JSON.stringify(data) }),

  // DSS (Decision Support System)
  getDssEvaluations: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/dss${qs}`)
  },
  getDssDetail: (id: string) => apiRequest(`/api/dss/${id}`),
  createDssEvaluation: (data: any) =>
    apiRequest('/api/dss', { method: 'POST', body: JSON.stringify(data) }),
  updateDssStatus: (id: string, status: string, notes?: string, extra?: Record<string, any>) =>
    apiRequest(`/api/dss/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, evaluationNotes: notes, notes, recommendationAction: notes, ...(extra || {}) }),
    }),
  deleteDssEvaluation: (id: string) =>
    apiRequest(`/api/dss/${id}`, { method: 'DELETE' }),
  updateDssDisbursement: (id: string, data: Record<string, any>) =>
    apiRequest(`/api/dss/${id}/disbursement`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // MIPro (Memo Internal Project)
  getMiproList: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/mipro${qs}`)
  },
  getMiproDetail: (id: string) => apiRequest(`/api/mipro/${id}`),
  createMipro: (data: any) =>
    apiRequest('/api/mipro', { method: 'POST', body: JSON.stringify(data) }),
  deleteMipro: (id: string) =>
    apiRequest(`/api/mipro/${id}`, { method: 'DELETE' }),

  // SPK (Surat Perintah Kerja)
  getSpkList: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/spk${qs}`)
  },
  getSpkDetail: (id: string) => apiRequest(`/api/spk/${id}`),
  createSpk: (data: any) =>
    apiRequest('/api/spk', { method: 'POST', body: JSON.stringify(data) }),
  updateSpkStatus: (id: string, status: string, statusNote?: string) =>
    apiRequest(`/api/spk/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, statusNote }),
    }),
  deleteSpk: (id: string) =>
    apiRequest(`/api/spk/${id}`, { method: 'DELETE' }),

  // Monev (Monitoring & Evaluasi)
  getMonevList: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/monev${qs}`)
  },
  getMonevDetail: (id: string) => apiRequest(`/api/monev/${id}`),
  createMonev: (data: any) =>
    apiRequest('/api/monev', { method: 'POST', body: JSON.stringify(data) }),
  updateMonev: (id: string, data: any) =>
    apiRequest(`/api/monev/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMonev: (id: string) =>
    apiRequest(`/api/monev/${id}`, { method: 'DELETE' }),

  // File Upload
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest('/api/uploads', {
      method: 'POST',
      body: formData,
    })
  },
  getUploadPreview: (fileUrlOrName: string) => {
    const cleanName = fileUrlOrName.split('/').pop()?.split('?')[0] || fileUrlOrName
    return apiRequest(`/api/uploads/${encodeURIComponent(cleanName)}/preview`)
  },
}

