import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { formatAddressShort } from '../utils'

class TokenApproval extends Inspector {
	name = 'Token Approval'

	public check(entry: ActivityEntry): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			entry.insights.method === 'setApprovalForAll'
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const approvalEvent = entry.insights.interactions[0].details.find(event =>
			event.event.toLowerCase().includes('approval')
		)

		console.log(entry)

		return {
			title: `Delegated NFT access`,
			description: `Gave ${formatAddressShort(approvalEvent._operator as string)} access to your ${
				entry.insights.contractName
			}`,
		}
	}
}

export default TokenApproval
