//docker cp default.character.json edc16c8ba1dc:/app/characters/default.character.json
/*

<task>generate a bash script to receive a srcpath, containerid and destpath as input, and execute the command """docker cp <srcpath> <containerid>:<destpath>"""</task>
*/
import { $ } from "bun";
import * as path from 'path';

export const runCopyFile = async (
  containerId: string,
  srcPath: string,
  destPath: string
) => {
  const agentsComposeDir = path.join(process.cwd(), 'src', 'lib', 'copy');
  try {
    const res =
    await $`sh ${agentsComposeDir}/run_docker_copy_file.sh ${srcPath} ${containerId} ${destPath}`;

    return res.stdout.toString();
  } catch (e) {
    console.error("Error running copy file:", e);
    throw {
      success: false,
      error: e,
    };
  }
};