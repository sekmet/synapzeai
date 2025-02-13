import { $ } from "bun";
import * as path from 'path';

export const runDeployment = async (
  composePath: string
) => {
  const agentsComposeDir = path.join(process.cwd(), 'src', 'lib', 'deploy');
  try {
    const res =
    await $`sh ${agentsComposeDir}/run_docker_compose.sh ${composePath}`;

    return res.stdout.toString();
  } catch (e) {
    console.error("Error running deployment:", e);
    throw {
      success: false,
      error: e,
    };
  }
};