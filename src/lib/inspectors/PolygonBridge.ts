import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

const POLYGON_BRIDGE = '0xa0c68c638235ee32657e8f720a23cec1bfc77c77'

class PolygonBridge extends Inspector {
	name = 'Polygon Bridge'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			addressEquals(entry.raw.to, POLYGON_BRIDGE) &&
			['depositEtherFor', 'exit'].includes(entry.insights.method)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		if (entry.insights.method === 'exit') return { title: 'Bridged back from Polygon' }

		return {
			title: `Bridged ${parseFloat(entry.value_in_eth).toFixed(2)} ETH to Polygon`,
		}
	}
}

export default PolygonBridge
