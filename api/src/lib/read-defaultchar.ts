import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the `default.character.json` file from the specified directory path.
 *
 * @param composePath - The path to the compose file. The function will extract the directory from this path.
 * @returns The parsed JSON content of the default.character.json file, or null if the file doesn't exist or can't be parsed.
 */
export function readDefaultCharacterJson(composePath: string): any {
  try {
    // Extract the directory from the composePath.
    const dirPath = path.dirname(composePath);

    // Construct the full file path for default.character.json.
    const filePath = path.join(dirPath, 'default.character.json');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return null;
    }

    // Read the file
    const jsonString = fs.readFileSync(filePath, 'utf8');
    
    // Parse the JSON
    const jsonContent = JSON.parse(jsonString);
    
    console.log(`File read from ${filePath}`);
    return jsonContent;
  } catch (error) {
    console.error(`Error reading default character JSON: ${error}`);
    return null;
  }
}