import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

const SAFE_PROXY = '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2'

class GnosisCreate extends Inspector {
	name = 'Gnosis Safe Create'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, SAFE_PROXY) &&
			entry.insights.method.startsWith('createProxy')
		)
	}

	resolve(): InspectorResult {
		return {
			title: `Deployed a new Gnosis Safe`,
		}
	}
}

export default GnosisCreate
