import type { AxiosError } from 'axios'

interface ApiErrorPayload {
  success?: boolean
  message?: string
  error?: {
    code?: string
    message?: string
  }
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_TAKEN: 'Email đã được sử dụng',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  ACCOUNT_DISABLED: 'Tài khoản đã bị vô hiệu hóa',
  EMAIL_NOT_VERIFIED: 'Vui lòng xác thực email trước khi đăng nhập',
  INVALID_REFRESH: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  REFRESH_EXPIRED: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  USER_INACTIVE: 'Tài khoản không hợp lệ, vui lòng đăng nhập lại',
  INVALID_TOKEN: 'Link không hợp lệ hoặc đã hết hạn',
  TOKEN_EXPIRED: 'Link xác thực đã hết hạn, vui lòng yêu cầu gửi lại',
  ALREADY_VERIFIED: 'Email đã được xác thực',
  RATE_LIMIT: 'Bạn thao tác quá nhanh, vui lòng thử lại sau',
  VALIDATION_ERROR: 'Thông tin không hợp lệ, vui lòng kiểm tra lại',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  NO_TOKEN: 'Bạn cần đăng nhập để tiếp tục',
  NO_REFRESH_TOKEN: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
}

function getApiErrorMessage(error: unknown): string | null {
  const axiosError = error as AxiosError<ApiErrorPayload>
  const payload = axiosError?.response?.data

  if (payload && typeof payload === 'object') {
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message
    }

    if (payload.error?.message && payload.error.message.trim()) {
      return payload.error.message
    }
  }

  return null
}

function getApiErrorCode(error: unknown): string | undefined {
  const axiosError = error as AxiosError<ApiErrorPayload>
  const payload = axiosError?.response?.data

  if (payload && typeof payload === 'object' && payload.error?.code) {
    return payload.error.code
  }

  return undefined
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  const code = getApiErrorCode(error)
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code]
  }

  const message = getApiErrorMessage(error)
  if (message) {
    return message
  }

  const axiosError = error as AxiosError
  if (axiosError?.response?.status === 401) {
    return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
  }

  if (axiosError?.code === 'ERR_NETWORK' || axiosError?.message?.includes('Network Error')) {
    return 'Không thể kết nối máy chủ, vui lòng thử lại'
  }

  if (axiosError?.code === 'ECONNABORTED') {
    return 'Yêu cầu bị timeout, vui lòng thử lại'
  }

  return fallback
}
