import a from 'indefinite'
import { addressEquals, formatAddressShort, parseTransferData } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

class TokensSent extends Inspector {
	name = 'Tokens Sent'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			entry.insights.method?.toLowerCase()?.includes('transfer')
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		const transfers = parseTransferData(entry)

		if (transfers.length > 1) {
			return {
				title: `Sent ${transfers.length} NFTs`,
				description: `Sent ${transfers.map(transfer => a(transfer.contract.name)).join(', ')} to ${transfers
					.map(transfer => formatAddressShort(transfer.to))
					.join(', ')}`,
			}
		}

		if (transfers[0].isNFT) {
			return {
				title: 'Sent an NFT',
				description: `Sent ${
					entry.insights.contractName ? a(entry.insights.contractName) : 'an NFT'
				} to ${formatAddressShort(transfers[0].to as string)}`,
			}
		}

		return {
			title: `Sent ${transfers[0].value} $${transfers[0].contract.symbol}`,
			description: `Sent ${transfers[0].contract.name} to ${formatAddressShort(transfers[0].to)}`,
		}
	}
}

export default TokensSent
