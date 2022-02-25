import Insight from '@/lib/Insight'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import { PrismaClient } from '@prisma/client'

type NameMapping = {
	name: string
	address: string
}

class ContractName extends Insight {
	name = 'Contract Name'
	#client: PrismaClient

	constructor() {
		super()

		this.#client = new PrismaClient()
	}

	public async apply(tx: TxData): Promise<{ contractName: string | null }> {
		const contractName = await this.getNameFor(tx.to_address)

		return { contractName }
	}

	protected getNameFor(contract: string): Promise<string | null> {
		if (!contract) return

		return this.#client.contract.findUnique({ where: { id: contract } }).then(res => res?.name)
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new ContractName())

export default ContractName
