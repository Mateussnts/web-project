// src/utils/errors.ts
export class ExternalServiceError extends Error {
  constructor(message = "Falha ao consultar serviço externo") {
    super(message);
    this.name = "ExternalServiceError";
  }
}

export class ValidationError extends Error {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
