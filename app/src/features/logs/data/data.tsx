import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconExclamationCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: IconCircle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: IconStopwatch,
  },
  {
    value: 'done',
    label: 'Done',
    icon: IconCircleCheck,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: IconCircleX,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]

// Define the type for our log objects.
interface LogEntry {
  id: string;
  log: string;
  status: "in progress" | "backlog" | "todo";
  label: string;
  priority: "high" | "medium" | "low";
}

/**
 * A helper function to generate a UUID.
 * (This is a simple implementation. In production you might use a library or crypto.randomUUID.)
 */
function generateUUID(): string {
  return 'x-4xx-yxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Removes ANSI escape codes from a string.
 * ANSI escape codes are often used for coloring the terminal output.
 *
 * @param text The string that may contain ANSI escape codes.
 * @returns The cleaned string without ANSI escape codes.
 */
function removeAnsiCodes(text: string): string {
  // Regular expression to match ANSI escape codes.
  const ansiRegex = /\x1B\[[0-?]*[ -/]*[@-~]/g;
  return text.replace(ansiRegex, '');
}

/**
 * Converts an array of strings (splited log lines) into an array of log objects.
 *
 * This function trims each line and ignores empty lines. It then maps each
 * non-empty line to a LogEntry with default values for status, label, and priority.
 *
 * @param splitedArray - The array of strings to convert.
 * @returns An array of LogEntry objects.
 */
export function convertSplitedArrayToObjectArray(splitedArray: string[]): LogEntry[] {
  return splitedArray
    // Trim each line.
    .map(line => line.trim())
    // Remove ANSI escape codes.
    .map(line => removeAnsiCodes(line))
    // Filter out any empty lines.
    .filter(line => line !== '')
    // Map each line to a log object.
    .map(line => ({
      id: `LOG-${generateUUID()}`,
      log: line,
      status: "todo",         // default status; modify as needed
      label: "documentation", // default label; modify as needed
      priority: "medium"      // default priority; modify as needed
    }));
}

export const fetchAgentLogs = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers/${id}/logs`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }});
  
  return response.json();
};

