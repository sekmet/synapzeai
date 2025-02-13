import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateAgentDeployment, getAgentById } from "../lib/api/agent";

export function useAgentDeployment(agentId: string) {
  const queryClient = useQueryClient();

  // Query for fetching agent data
  const agentQuery = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getAgentById(agentId),
  });

  // Mutation for updating agent deployment
  const mutation = useMutation({
    mutationFn: updateAgentDeployment,
    onMutate: async (newAgentData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["agent", agentId] });

      // Snapshot the previous value
      const previousAgentData = queryClient.getQueryData(["agent", agentId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["agent", agentId], (old: any) => ({
        ...old,
        ...newAgentData,
      }));

      // Return a context object with the snapshotted value
      return { previousAgentData };
    },
    onError: (err, newAgentData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["agent", agentId], context?.previousAgentData);
      console.log(err, newAgentData);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["agent", agentId] });
    },
  });

  return {
    agent: agentQuery.data,
    isLoading: agentQuery.isLoading,
    isError: agentQuery.isError,
    error: agentQuery.error,
    updateAgent: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
}
