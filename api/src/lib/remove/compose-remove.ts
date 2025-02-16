import { $ } from "bun";
import * as path from 'path';

export const runComposeRemove = async (
  composePath: string
) => {
  const agentsComposeDir = path.join(process.cwd(), 'src', 'lib', 'remove');
  let result: any;
  try {
    const res =
    await $`sh ${agentsComposeDir}/run_delete_compose.sh ${composePath}`;

    result = res.stdout.toString().split('\n');

  } catch (e) {
    console.error("Error running compose remove:", e);
  }

  return result;
};