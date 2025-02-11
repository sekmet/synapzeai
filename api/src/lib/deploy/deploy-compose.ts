import { $ } from "bun";

export const runDeployment = async (
  composePath: string
) => {
  try {
    const res =
      await $`deploy-container.sh ${composePath}`;

    return res.stdout.toString();
  } catch (e) {
    console.error("Error running deployment:", e);
    throw {
      success: false,
      error: e,
    };
  }
};