import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, formatAddressShort } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

class ETHTransfer extends Inspector {
	name = 'ETH Transfer'

	public check(entry: ActivityEntry): boolean {
		return entry.insights.generalPurpose === TX_PURPOSE.ETH_TRANSFER
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		if (addressEquals(entry.raw.from, config.userAddress)) {
			return {
				title: 'Sent ETH',
				description: `You sent ${parseFloat(entry.value_in_eth).toFixed(2)} ETH to ${formatAddressShort(
					entry.insights.toENS || entry.raw.to
				)}`,
			}
		}

		return {
			title: 'Received ETH',
			description: `You got ${parseFloat(entry.value_in_eth).toFixed(2)} ETH from ${formatAddressShort(
				entry.insights.fromENS || entry.raw.from
			)}`,
		}
	}
}

export default ETHTransfer
