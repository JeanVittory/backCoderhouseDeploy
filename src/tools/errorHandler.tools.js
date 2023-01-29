class ErrorHandler extends Error {
  constructor(data) {
    super(data.message);
    this.status = data.status;
  }
}

export { ErrorHandler };
