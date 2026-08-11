export interface ExceptionInfo {
  status: number;
  code: string;
  message: string;
}

export interface VerifyConnectionOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}
