import millify from 'millify'
import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

class GnosisCall extends Inspector {
	name = 'Gnosis Safe Call'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			entry.insights.method == 'execTransaction'
		)
	}

	resolve(): InspectorResult {
		return {
			title: `Executed a Gnosis Safe transaction`,
		}
	}
}

export default GnosisCall
