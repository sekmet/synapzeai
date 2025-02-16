import { $ } from "bun";
import * as path from 'path';

export const runComposeDown = async (
  composePath: string
) => {
  const agentsComposeDir = path.join(process.cwd(), 'src', 'lib', 'down');
  let result: any;
  try {
    const res =
    await $`sh ${agentsComposeDir}/run_docker_compose_down.sh ${composePath}`;

    result = res.stdout.toString().split('\n');

  } catch (e) {
    console.error("Error running compose down:", e);
  }

  return result;
};