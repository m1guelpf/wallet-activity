import { ethers } from 'ethers'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import { PrismaClient } from '@prisma/client'
import { correctContractName, getTx } from '../utils'
import Insight, { Config } from '@/lib/Insight'
import { TransactionResponse } from '@ethersproject/abstract-provider'

class ContractName extends Insight {
	name = 'Contract Name'
	#client: PrismaClient

	constructor() {
		super()

		this.#client = new PrismaClient()
	}

	public async apply(tx: TxData, config: Config): Promise<{ contractName: string | null }> {
		if (tx.to_address) {
			const contractName = correctContractName(
				await this.getNameFor(tx.to_address?.toLowerCase(), config.chainId)
			)

			return { contractName }
		}

		const contractName = correctContractName(await this.getNameFor(tx.creates?.toLowerCase(), config.chainId))

		return { contractName }
	}

	protected getNameFor(address: string, chainId: number): Promise<string | null> {
		if (!address) return

		return this.#client.contract.findUnique({ where: { fqAddr: { address, chainId } } }).then(res => res?.name)
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new ContractName())

export default ContractName
