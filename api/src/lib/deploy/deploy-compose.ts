import { $ } from "bun";
import * as path from 'path';

export const runDeployment = async (
  composePath: string
) => {
  const agentsComposeDir = path.join(process.cwd(), 'src', 'lib', 'deploy');
  let result: any;
  try {
    const res =
    await $`sh ${agentsComposeDir}/run_docker_compose.sh ${composePath}`;

    result = res.stdout.toString().split('\n');

  } catch (e) {
    console.error("Error running deployment:", e);
  }

  return result;
};