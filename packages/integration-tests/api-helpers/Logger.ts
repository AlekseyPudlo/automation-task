/**
 * Log levels for the test logger
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Configuration options for the logger
 */
export interface LoggerConfig {
  /** Minimum log level that will be output */
  minLevel: LogLevel;
  /** Whether to include timestamps in logs */
  showTimestamps: boolean;
  /** Whether to use colors in console output */
  useColors: boolean;
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  showTimestamps: true,
  useColors: true,
};

/**
 * Console colors for different log levels
 */
const COLORS = {
  [LogLevel.DEBUG]: '\x1b[36m', // Cyan
  [LogLevel.INFO]: '\x1b[32m', // Green
  [LogLevel.WARN]: '\x1b[33m', // Yellow
  [LogLevel.ERROR]: '\x1b[31m', // Red
  RESET: '\x1b[0m', // Reset color
};

/**
 * Logger utility for test automation
 * Provides formatted logging with configurable levels and formatting options
 */
export class Logger {
  private config: LoggerConfig;
  private testInfo?: string;

  /**
   * Create a new logger instance
   * @param config Configuration options
   */
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set test identifier for context in logs
   * @param testName Name or identifier for current test
   */
  setTestContext(testName: string): void {
    this.testInfo = testName;
  }

  /**
   * Clear test context
   */
  clearTestContext(): void {
    this.testInfo = undefined;
  }

  /**
   * Log a debug message
   * @param message Message to log
   * @param data Optional data to include
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log an info message
   * @param message Message to log
   * @param data Optional data to include
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log a warning message
   * @param message Message to log
   * @param data Optional data to include
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log an error message
   * @param message Message to log
   * @param error Optional error to include
   */
  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Internal method to handle logging
   */
  private log(level: LogLevel, message: string, data?: any): void {
    // Skip if below minimum log level
    if (
      this.getLevelPriority(level) < this.getLevelPriority(this.config.minLevel)
    ) {
      return;
    }

    const timestamp = this.config.showTimestamps
      ? `[${new Date().toISOString()}] `
      : '';
    const testContext = this.testInfo ? `[${this.testInfo}] ` : '';
    const prefix = `${timestamp}${level} ${testContext}`;

    const formattedMessage = `${prefix}${message}`;

    if (this.config.useColors) {
      console.log(`${COLORS[level]}${formattedMessage}${COLORS.RESET}`);
    } else {
      console.log(formattedMessage);
    }

    // Log additional data if provided
    if (data !== undefined) {
      if (data instanceof Error) {
        console.log(data.stack || data.message);
      } else if (typeof data === 'object') {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(data);
      }
    }
  }

  /**
   * Get numeric priority for log level (for filtering)
   */
  private getLevelPriority(level: LogLevel): number {
    switch (level) {
      case LogLevel.DEBUG:
        return 0;
      case LogLevel.INFO:
        return 1;
      case LogLevel.WARN:
        return 2;
      case LogLevel.ERROR:
        return 3;
      default:
        return 1;
    }
  }
}

/**
 * Create a singleton instance of the logger for easy import
 */
export const logger = new Logger();

/**
 * Helper functions to simplify logging
 */
export const debug = (message: string, data?: any) =>
  logger.debug(message, data);
export const info = (message: string, data?: any) => logger.info(message, data);
export const warn = (message: string, data?: any) => logger.warn(message, data);
export const error = (message: string, error?: any) =>
  logger.error(message, error);
