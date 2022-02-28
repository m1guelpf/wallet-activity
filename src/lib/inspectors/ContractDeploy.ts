import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { InspectorResult } from '../Inspector'

class ContractDeploy extends Inspector {
	name = 'Contract Deployment'

	public check(entry: ActivityEntry): boolean {
		return entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_DEPLOY
	}

	resolve(entry: ActivityEntry): InspectorResult {
		return {
			title: 'Deployed a Smart Contract',
			description: `Deployed ${
				entry.insights.contractName ? entry.insights.contractName : 'Contract'
			} to the Ethereum Mainnet`,
		}
	}
}

export default ContractDeploy
