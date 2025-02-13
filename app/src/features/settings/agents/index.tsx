import ContentSection from '../components/content-section'
import AgentsProvider from './context/agents-context'
import { AgentsDialogs } from './components/agents-dialogs'
import { AgentDanger } from './agent-danger'

export default function SettingsAgent() {
  return (
    <AgentsProvider>
    <ContentSection
      title='Danger zone'
      desc="Delete your agent"
    >
      <AgentDanger />
    </ContentSection>
    <AgentsDialogs />
    </AgentsProvider>
  ) 
}
