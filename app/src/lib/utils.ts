import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

dayjs.extend(localizedFormat);

export const moment = dayjs;

export const formatAgentName = (name: string) => {
    return name.substring(0, 2);
};

/**
 * Converts a string into a number by treating it as a base-256 number.
 *
 * Note:
 * - For very long strings, the true numeric value can exceed Number.MAX_SAFE_INTEGER.
 *   In that case, we use modulo Number.MAX_SAFE_INTEGER to keep the result within safe bounds.
 * - This method works well for shorter strings but may not be collision-free for arbitrarily long inputs.
 *
 * @param str - The input string to convert.
 * @returns A number representing the unique number for the string.
 */
export function stringToUniqueNumber(str: string | undefined): number {
  if (!str) return 0;

  let uniqueNum = 0;
  const base = 256;

  for (let i = 0; i < str.length; i++) {
    uniqueNum = (uniqueNum * base + str.charCodeAt(i)) % Number.MAX_SAFE_INTEGER;
  }

  return uniqueNum;
}

/**
 * Converts a string into a unique BigInt.
 *
 * This function treats the string as a number in base 256,
 * where each character is converted to its character code.
 * This ensures that different strings produce different numbers.
 *
 * @param str - The input string to convert.
 * @returns A BigInt representing the unique number for the string.
 */
export function stringToUniqueBigNumber(str: string | undefined): bigint {
  if (!str) return BigInt(0);
  
  let uniqueNum = BigInt(0);
  const base = BigInt(256); // Using 256 ensures uniqueness for extended ASCII/Unicode BMP characters.
  
  for (let i = 0; i < str.length; i++) {
    uniqueNum = uniqueNum * base + BigInt(str.charCodeAt(i));
  }
  
  return uniqueNum;
}


export function capitalizeSpecificWords(input: string): string {
    // Helper function to capitalize a word (first letter uppercase, rest lowercase)
    function capitalize(word: string): string {
      if (word.length === 0) return '';
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  // Define the words to capitalize
  const words = ['ai', 'chat', 'network', 'api'];

  // Replace all underscores and hyphens with spaces
  const replaced = input.replace(/[_-]/g, ' ');

  // Split by one or more whitespace characters to get an array of words
  const wordsArray = replaced.split(/\s+/);

  // Create a set of words to capitalize, in lowercase for case-insensitive comparison
  const wordsSet = new Set(words.map(w => w.toLowerCase()));

  // Process each word: capitalize if it is in the set, otherwise leave unchanged
  const processedWords = wordsArray.map(word => {
      if (wordsSet.has(word.toLowerCase())) {
          return capitalize(word);
      } else {
          return word;
      }
  });

  // Join the words back with single spaces
  const result = processedWords.join(' ');
  return result;
}


export function uppercaseSpecificWords(input: string): string {
  // Helper function to escape special characters for regex
  function escapeRegExp(string: string): string {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Define the words to uppercase (example words; can be modified as needed)
  const words = ['ai', 'key', 'id', 'fid', 'api', 'uuid', 'url'];

  // Start with the original input string
  let result = input;

  // Process each word in the words array
  for (const word of words) {
      // Uppercase the word
      const uppercased = word.toUpperCase();
      // Create a regex to match the word case-insensitively, ensuring whole words only
      const regex = new RegExp('\\b' + escapeRegExp(word) + '\\b', 'gi');
      // Replace all occurrences of the word with its uppercased version
      result = result.replace(regex, uppercased);
  }

  // Return the modified string
  return result;
}