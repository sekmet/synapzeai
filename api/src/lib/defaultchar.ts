import * as fs from 'fs';
import * as path from 'path';

/**
 * Writes the provided JSON configuration to a file named `default.character.json`
 * in the directory extracted from the provided compose configuration's composePath.
 *
 * @param composeConfig - A JSON object containing the key "composePath".
 * @param jsonConfiguration - The JSON configuration to write to the file.
 */
export function writeDefaultCharacterJson(
  composePath: string,
  jsonConfiguration: any
): void {
  // Extract the directory from the composePath.
  const dirPath = path.dirname(composePath);

  // Ensure the directory exists; if not, create it.
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Construct the full file path for default.character.json.
  const filePath = path.join(dirPath, 'default.character.json');

  // Convert the JSON configuration object to a pretty printed JSON string.
  const jsonString = JSON.stringify(jsonConfiguration, null, 2);

  // Write the JSON string to the file.
  fs.writeFileSync(filePath, jsonString, 'utf8');

  console.log(`File written to ${filePath}`);
}