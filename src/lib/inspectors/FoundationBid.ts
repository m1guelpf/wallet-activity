import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

const FND_CONTRACT = '0xcda72070e455bb31c7690a170224ce43623d0b6f'

class FoundationBid extends Inspector {
	name = 'Foundation Bid'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, FND_CONTRACT) &&
			entry.insights.method === 'placeBidV2'
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		return {
			title: `Bid on an NFT`,
			description: `Bid ${entry.value_in_eth} ETH for an NFT on Foundation.`,
		}
	}
}

export default FoundationBid
