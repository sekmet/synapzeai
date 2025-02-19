import * as path from 'path';
import * as fs from 'fs';

/**
 * Parses a .env file into a record of key-value pairs.
 * 
 * It skips:
 * - Empty lines.
 * - Lines starting with a comment (#).
 * - Keys with empty values or values that are only comments.
 * 
 * For unquoted values, it also removes any inline comments.
 *
 * @param filePath - Path to the .env file.
 * @returns An object with keys and their corresponding values.
 */
function parseEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and lines that start with a full-line comment.
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      // Find the first '=' to support values that may contain '='
      const delimiterIndex = trimmedLine.indexOf('=');
      if (delimiterIndex === -1) continue; // Skip invalid lines

      const key = trimmedLine.substring(0, delimiterIndex).trim();
      let value = trimmedLine.substring(delimiterIndex + 1).trim();

      // If value is empty, skip this key.
      if (!value) continue;

      // Check if the entire value is a comment (e.g. "# only a comment")
      if (value.startsWith('#')) continue;

      // Remove inline comments from unquoted values.
      // If the value is wrapped in matching quotes, we assume its content is literal.
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        // Remove wrapping quotes.
        value = value.substring(1, value.length - 1);
      } else {
        // Remove inline comment: any part starting with a whitespace then a "#"
        const inlineCommentMatch = value.match(/^(.*?)\s+#/);
        if (inlineCommentMatch) {
          value = inlineCommentMatch[1].trim();
        }
      }

      // If removing comments leaves an empty value, skip this key.
      if (!value || value.startsWith('#')) continue;

      env[key] = value;
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }

  return env;
}

/**
 * Extracts key-value pairs from a .env file for the given keys.
 * Only keys with a defined, non-empty value are extracted.
 *
 * @param keys - Array of keys to extract.
 * @param filePath - Path to the .env file.
 * @returns An object with only the keys (and their values) defined in the .env file.
 */
function extractEnvVariables(keys: string[], filePath: string): Record<string, string> {
  const parsedEnv = parseEnvFile(filePath);
  const extracted: Record<string, string> = {};

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(parsedEnv, key) && parsedEnv[key] !== '') {
      extracted[key] = parsedEnv[key];
    }
  });

  return extracted;
}

export function parseAndExtractEnvVariables(keysToExtract: string[]): Record<string, string> {

    const envFilePath = path.join(process.cwd(), 'src', 'lib', 'envs');
    const envVariables = extractEnvVariables(keysToExtract, `${envFilePath}/.env.sample`);
    console.log('Extracted Variables:', envVariables);

    return envVariables;
}