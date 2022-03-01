import { ethers } from 'ethers'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { Interaction } from '../insights/InterpretEvents'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { addressEquals } from '../utils'

const ENS_REVERSE_REGISTRAR = '0x084b1c3c81545d370f3634392de611caabff8148'

class ENSReverseRecord extends Inspector {
	name = 'ENS Renewal'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			addressEquals(entry.raw.to, ENS_REVERSE_REGISTRAR) &&
			entry.insights.method === 'setName'
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		const name = this.getName(entry.raw.input)

		return {
			title: 'Set ENS Reverse Record',
			description: name ? `Your address now points to ${name}` : '',
		}
	}

	protected getName(data: string): string | null {
		return ethers.utils.defaultAbiCoder.decode(['string'], ethers.utils.hexDataSlice(data, 4))?.[0]
	}
}

export default ENSReverseRecord
