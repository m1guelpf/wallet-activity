import logger from '../logger'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, formatAddressShort } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

class ContractInteraction extends Inspector {
	name = 'Contract Interaction'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		logger.debug('interaction', entry)
		return {
			title: 'Interacted with a Smart Contract',
			description:
				(entry.insights.contractName || entry.insights.method) &&
				`${entry.insights.method ? `Called ${entry.insights.method}() on` : 'Interacted with'} ${
					entry.insights.contractName || formatAddressShort(entry.insights.toENS || entry.raw.to)
				}`,
		}
	}
}

export default ContractInteraction
