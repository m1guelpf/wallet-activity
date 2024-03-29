import logger from '../logger'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, formatAddressShort } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

class ExternalInteraction extends Inspector {
	name = 'External Interaction'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			!addressEquals(entry.raw.from, config.userAddress)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		logger.debug('external', entry)

		return {
			title: 'Smart Contract Call',
			description: `${formatAddressShort(entry.insights.fromENS ?? entry.raw.to)} called a smart contract`,
		}
	}
}

export default ExternalInteraction
