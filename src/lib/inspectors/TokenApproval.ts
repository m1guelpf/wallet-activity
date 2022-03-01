import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { formatAddressShort } from '../utils'

enum APPROVAL_METHODS {
	ERC20 = 'approve',
	NFT = 'setApprovalForAll',
}

class TokenApproval extends Inspector {
	name = 'Token Approval'

	public check(entry: ActivityEntry): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			[APPROVAL_METHODS.ERC20, APPROVAL_METHODS.NFT].includes(entry.insights.method as APPROVAL_METHODS)
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const approvalEvent = entry.insights.interactions[0].details.find(event =>
			event.event.toLowerCase().includes('approval')
		)

		if (entry.insights.method === APPROVAL_METHODS.ERC20) {
			const ticker = entry.insights.interactions[0].contract_symbol

			return {
				title: `Delegated $${ticker} access`,
				description: `${formatAddressShort(approvalEvent.spender as string)} can now spend your $${ticker}`,
			}
		}

		return {
			title: `Delegated NFT access`,
			description: `${formatAddressShort(approvalEvent._operator as string)} can now manage your ${
				entry.insights.contractName
			} NFTs`,
		}
	}
}

export default TokenApproval
