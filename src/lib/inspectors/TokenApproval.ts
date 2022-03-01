import { ethers } from 'ethers'
import { ActivityEntry } from '../Activity'
import { formatAddressShort } from '../utils'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { InspectorResult } from '../Inspector'

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

	resolve(entry: ActivityEntry): InspectorResult {
		if (entry.insights.method === APPROVAL_METHODS.NFT) {
			const delegatedTo = this.getOperator(entry.raw.input)

			return {
				title: `Delegated NFT access`,
				description: `${formatAddressShort(delegatedTo)} can now manage your ${
					entry.insights.contractName || formatAddressShort(entry.insights.toENS || entry.raw.to)
				} NFTs`,
			}
		}

		const ticker = entry.insights.interactions[0].contract_symbol
		const approvalEvent = entry.insights.interactions?.[0]?.details?.find(event =>
			event.event.toLowerCase().includes('approval')
		)

		return {
			title: `Delegated $${ticker} access`,
			description: `${formatAddressShort(approvalEvent.spender as string)} can now spend your $${ticker}`,
		}
	}

	protected getOperator(data: string): string | null {
		return ethers.utils.defaultAbiCoder.decode(['address', 'bool'], ethers.utils.hexDataSlice(data, 4))?.[0]
	}
}

export default TokenApproval
