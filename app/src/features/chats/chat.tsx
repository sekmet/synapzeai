import { UUID } from '@/types/elizaosv1'
import { useParams } from '@tanstack/react-router'
import { AgentChat } from './components/chat'

export default function Chat() {
  const { agentId: agentIdParam } = useParams({ strict: false })
  const agentId = agentIdParam as UUID

  if (!agentId) return <div>No data.</div>;

  return (<AgentChat agentId={agentId} />);
}