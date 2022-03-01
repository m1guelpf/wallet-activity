import millify from 'millify'
import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

const JUICEBOX_TERMINAL = '0x981c8ecd009e3e84ee1ff99266bf1461a12e5c68'

class JuiceboxContribution extends Inspector {
	name = 'Juicebox Contribution'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			addressEquals(entry.raw.to, JUICEBOX_TERMINAL) &&
			entry.insights.method == 'pay'
		)
	}

	resolve(): InspectorResult {
		return {
			title: `Contributed to a Juicebox campaign`,
		}
	}
}

export default JuiceboxContribution
