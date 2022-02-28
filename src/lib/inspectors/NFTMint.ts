import a from 'indefinite'
import { addressEquals, parseTransferData } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

class NFTMint extends Inspector {
	name = 'NFT Mint'

	public check(entry: ActivityEntry, config: Config): boolean {
		const transfers = parseTransferData(entry).filter(
			transfer => addressEquals(transfer.to, config.userAddress) && transfer.isNFT
		)

		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			(entry.insights.method?.toLowerCase()?.includes('mint') || transfers.length > 0)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		if (entry.insights.contractName === 'ENS') {
			return { title: 'Registered an ENS name' }
		}

		return {
			title: 'Minted an NFT',
			description: `Minted ${entry.insights.contractName ? a(entry.insights.contractName) : 'an'} NFT`,
		}
	}
}

export default NFTMint