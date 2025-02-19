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