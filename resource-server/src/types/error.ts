export interface ErrorWithCode extends Error {
    code: string;
  }
  export class ErrorWithStatus extends Error {
    constructor(
      readonly message: string,
      readonly status?: number,
      readonly errorCode?: string
    ) {
      super(message);
    }
  }
  