import { ethers } from 'ethers'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { Interaction } from '../insights/InterpretEvents'
import Inspector, { InspectorResult } from '../Inspector'

const ENS_BASE_REGISTRAR = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'

class ENSRenewal extends Inspector {
	name = 'ENS Renewal'

	public check(entry: ActivityEntry): boolean {
		if (entry.insights.generalPurpose !== TX_PURPOSE.CONTRACT_INTERACTION) return false

		const ensContract = entry.insights.interactions?.find(
			contract => contract.contract_address == ENS_BASE_REGISTRAR
		) as Interaction

		if (!ensContract) return false

		return ensContract.details.some(event => event.event === 'NameRenewed')
	}

	resolve(entry: ActivityEntry): InspectorResult {
		const { name, duration } = this.getRenewalDetails(entry)

		return { title: 'Renewed ENS Domain', description: `Renewed ${name} for ${duration} years.` }
	}

	getRenewalDetails(entry: ActivityEntry): { name: string; duration: number } {
		const [name, duration] = ethers.utils.defaultAbiCoder.decode(
			['string', 'uint256'],
			ethers.utils.hexDataSlice(entry.raw.input, 4)
		)

		return { name: `${name}.eth`, duration: Math.floor(duration / 3600 / 24 / 360) }
	}
}

export default ENSRenewal
