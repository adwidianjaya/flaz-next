/**
 * A performant and safe templating engine with Handlebars-like helper support.
 * It uses a compile-once, cache-and-run strategy and provides robust,
 * configurable error handling for runtime expression evaluation.
 */
export const SimpleTemplatingEngine = {
  /**
   * Cache to store compiled template functions.
   * @type {Map<string, string>}
   */
  _cache: new Map(),

  /**
   * Object to store registered helper functions.
   * @type {Object.<string, Function>}
   */
  _helpers: {},

  /**
   * Registers a new helper function.
   * @param {string} name - The name of the helper.
   * @param {Function} func - The helper function.
   */
  registerHelper: function (name, func) {
    if (typeof func !== "function") {
      console.error(`Helper "${name}" must be a function.`);
      return;
    }
    this._helpers[name] = func;
  },

  /**
   * Escapes a string for safe inclusion in a JavaScript string literal.
   * @param {string} str The string to escape.
   * @returns {string} The escaped string.
   */
  _jsStringEscape: function (str) {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n");
  },

  /**
   * Compiles a template string into a reusable function body for high performance.
   * Each dynamic part is wrapped in a try-catch block for safe evaluation.
   * @param {string} templateString - The template string with `{}` placeholders.
   * @returns {string} A string containing the body of the compiled function.
   */
  compile: function (templateString) {
    const regex = /\{(.*?)\}/g;
    const bodyParts = [];
    let lastIndex = 0;
    let match;

    // 1. Parse the template into static text and dynamic expressions.
    while ((match = regex.exec(templateString)) !== null) {
      // Add the static text part before the match.
      if (match.index > lastIndex) {
        bodyParts.push(
          JSON.stringify(templateString.slice(lastIndex, match.index)),
        );
      }

      function rewriteWithOptionalChaining(input) {
        return input.replace(
          /\$states(\??(\.[a-zA-Z_$][a-zA-Z0-9_$]*|\?\.\[['"][^'"]*['"]\]|\['[^']*'\]|\["[^"]*"\]))+/g,
          (match) => {
            return match
              .replace(/^\$states(?!\?)/, "$states?") // $states → $states? (only if not already $states?)
              .replace(/(?<!\?)\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g, "?.$1") // .prop → ?.prop (skip if already ?.)
              .replace(/(?<!\?)\[/g, "?.["); // [ → ?. [ (skip if already ?.[)
          },
        );
      }

      // Add the dynamic expression, now wrapped in a safe execution block.
      const expression = rewriteWithOptionalChaining(match[1].trim());
      // console.log({ expression })

      // This IIFE (Immediately Invoked Function Expression) creates an isolated scope.
      // - It tries to evaluate the user's expression.
      // - On failure, it calls a special __handleError function.
      const safeExpressionWrapper = `((() => { 
        try { 
          return (${expression}) || ""; 
        } catch (e) { 
          return __handleError(e, '${this._jsStringEscape(expression)}'); 
        } 
      })())`;

      bodyParts.push(safeExpressionWrapper);
      lastIndex = regex.lastIndex;
    }

    // Add any remaining static text part.
    if (lastIndex < templateString.length) {
      bodyParts.push(JSON.stringify(templateString.slice(lastIndex)));
    }

    // 2. Construct the final function body string.
    return (
      "return " + (bodyParts.length > 0 ? bodyParts.join(" + ") : "''") + ";"
    );
  },

  /**
   * Renders a template string using provided data and registered helpers.
   * It uses a cached, pre-compiled function for maximum performance and safety.
   *
   * @param {string} templateString - The template string with `{}` placeholders.
   * @param {Object} data - The data object to use for evaluating expressions.
   * @param {Object} [options] - Rendering options.
   * @param {function(error: Error, expression: string): any} [options.onError] - A function to call when an expression fails. It should return the fallback value. Defaults to returning an empty string.
   * @returns {string} The rendered template string.
   */
  render: function (templateString, states, options) {
    // 1. Check the cache. If not present, compile and cache the function body.
    let functionBody = this._cache.get(templateString);
    if (!functionBody) {
      functionBody = this.compile(templateString);
      this._cache.set(templateString, functionBody);
      // console.log({
      //   templateString,
      //   functionBody,
      // });
    }

    // 2. Define the error handler for this specific render call.
    // This allows different error handling for the same template if needed.
    const handleError =
      options?.onError ??
      ((error, expression) => {
        // Default behavior: log a warning and return an empty string.
        console.warn(`Expression failed: {${expression}}`, error.message);
        return "";
      });

    // 3. IMPORTANT: Inject our internal error handler into the function's scope.
    // We use a reserved name to avoid conflicts with user data.

    try {
      // 4. Create the final executable function from the cached body.
      const renderFn = new Function(
        "$states",
        "$helpers",
        "__handleError",
        functionBody,
      );

      // 5. Execute the function with the data, returning the result.
      return renderFn(states, this._helpers, handleError);
    } catch (error) {
      // This outer catch handles syntax errors in the template itself or fatal errors during setup.
      console.warn(
        "SimpleTemplatingEngine... A fatal error occurred during template rendering:",
        error.message,
        "\nTemplate:",
        templateString,
      );
      // return `[Template Syntax Error]`;
      return (templateString || "").replace(/\{.*?\}/g, "");
    }
  },
};
