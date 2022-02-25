import Insight, { InsightFailed } from '@/lib/Insight'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import axios from 'axios'

type NameMapping = {
	name: string
	address: string
}

class ContractName extends Insight {
	name = 'Contract Name'

	#lookup: NameMapping[]

	constructor(lookup: NameMapping[]) {
		super()

		this.#lookup = lookup
	}

	public static async init(): Promise<ContractName> {
		const db = await axios
			.get(
				'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-ethereum/eb6b57e33f0a157c3688024a1eead4ea85753bd1/contracts/mainnet/contracts.json'
			)
			.then(res => JSON.parse(`[${res.data.replaceAll('}', '},').slice(0, -2)}]`) as NameMapping[])

		return new this(db)
	}

	public async apply(tx: TxData): Promise<{ contractName: string | null }> {
		const contractName = this.getNameFor(tx.to_address)

		return { contractName }
	}

	protected getNameFor(contract: string): string | null {
		return this.#lookup.find(entry => entry.address.toLowerCase() == contract?.toLowerCase())?.name
	}
}

export const registerInsight = async (augmenter: typeof Augmenter) => augmenter.register(await ContractName.init())

export default ContractName
