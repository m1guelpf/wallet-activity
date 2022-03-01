import a from 'indefinite'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, formatAddressShort } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

class MintReceived extends Inspector {
	name = 'Mint Received'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			!addressEquals(entry.raw.from, config.userAddress) &&
			entry.insights.method?.toLowerCase()?.includes('mint')
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		return {
			title: `Received ${entry.insights.contractName ? a(entry.insights.contractName) : 'an'} NFT`,
			description: `${formatAddressShort(entry.insights.fromENS || entry.raw.from)} sent you an NFT.`,
		}
	}
}

export default MintReceived
