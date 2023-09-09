/**
 * Logger with timestamp
 */
export const logger = {
  /**
   * Log info message
   * @param message {string}
   */
  log: (message: string) => {
    const date = new Date();
    // eslint-disable-next-line no-console
    console.log(`${date.toISOString()} -> ${message}`);
  },
  /**
   * Log error message
   * @param message {string}
   */
  error: (message: string) => {
    const date = new Date();
    // eslint-disable-next-line no-console
    console.error(`${date.toISOString()} -> \x1b[31m${message} \x1b[0m`);
  }
};
