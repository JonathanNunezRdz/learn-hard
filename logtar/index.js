class LogLevel {
  static Debug = 0;
  static Info = 1;
  static Warn = 2;
  static Error = 3;
  static Critical = 4;

  static assert(log_level) {
    if (
      ![
        LogLevel.Debug,
        LogLevel.Info,
        LogLevel.Warn,
        LogLevel.Error,
        LogLevel.Critical,
      ].includes(log_level)
    ) {
      throw new Error(
        `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(
          log_level
        )}`
      );
    }
  }
}

class Logger {
  // set a default value for the log level
  #config;

  constructor(log_config) {
    log_config = log_config || LogConfig.with_defaults();
    LogConfig.assert(log_config);
    this.#config = log_config
  }

  get level() {
    return this.#config.level;
  }
}

class LogConfig {
  /** Define necessary member variables, and make them private. */

  // log level will here instead of the Logger class.
  #level = LogLevel.Info;
  // We do no initiate it here, we'll do it inside the constructor.
  #rolling_config = RollingConfig.Hourly;
  // the prefix to be added to new files.
  #file_prefix = "Logtar_";
  // max file size for each log file
  #max_file_size;

  /**
   * Validate options for LogConfig
   */
  static assert(log_config) {
    // if there's an argument, check whether the `log_config` is an instance
    // of the `LogConfig` class. If there's no argument, no checks required
    if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
      throw new Error(`log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(log_config)}`);
    }
  }

  static with_defaults() {
    return new LogConfig();
  }

  /**
   * 
   * @param {LogLevel} log_level The log level to be set
   * @returns {LogConfig} The current instance of LogConfig
   */
  with_log_level(log_level) {
    LogLevel.assert(log_level);
    this.#level = log_level;
    return this;
  }

  with_rolling_config(rolling_config) {
    this.#rolling_config = RollingConfig.from.json(rolling_config);
    return this;
  }

  /**
   * 
   * @param {string} file_prefix The file prefix to be set
   * @returns {LogConfig} The current instance of LogConfig
   * @throws {Error} If file_prefix is not a string
   */
  with_file_prefix(file_prefix) {
    if (typeof file_prefix !== "string") {
      throw new Error(`file_prefix must be a string. Unsupported param ${JSON.stringify(file_prefix)}`);
    }

    this.#file_prefix = file_prefix;
    return this;
  }

  get level() {
    return this.#level;
  }

  get rolling_config() {
    return this.#rolling_config;
  }

  get file_prefix() {
    return this.#file_prefix;
  }

  get file_max_size() {
    return this.#max_file_size;
  }
}

class RollingSizeOptions {
  static OneKB = 1024;
  static FiveKB = 5 * 1024;
  static TenKB = 10 * 1024;
  static TwentyKB = 20 * 1024;
  static FiftyKB = 50 * 1024;
  static HundredKB = 100 * 1024;

  static HalfMB = 512 * 1024;
  static OneMB = 1024 * 1024;
  static FiveMB = 5 * 1024 * 1024;
  static TenMB = 10 * 1024 * 1024;
  static TwentyMB = 20 * 1024 * 1024;
  static FiftyMB = 50 * 1024 * 1024;
  static HundredMB = 100 * 1024 * 1024;

  static assert(size_threshold) {
    if (typeof size_threshold !== "number" || size_threshold < RollingSizeOptions.OneKB) {
      throw new Error(`size_threshold must be at least 1 KB. Unsupported param ${JSON.stringify(size_threshold)}`)
    }
  }
}

module.exports = {
  LogLevel,
  Logger,
  LogConfig
};
