import axios from 'axios'
import { ethers } from 'ethers'
import Insight, { Config } from '@/lib/Insight'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import type { TransactionResponse } from '@ethersproject/abstract-provider'

export enum CONTRACT_PURPOSE {
	ETH_TRANSFER = 'eth_transfer',
	CONTRACT_DEPLOY = 'contract_deploy',
	CONTRACT_INTERACTION = 'contract_interaction',
}

class GeneralPurpose extends Insight {
	name = 'General Purpose'
	#fnSigCache: Record<string, string> = {}

	public async apply(tx: TxData, config: Config): Promise<{ generalPurpose: string; method?: string }> {
		const provider = new ethers.providers.InfuraProvider(config.chainId, process.env.NEXT_PUBLIC_INFURA_ID)

		if (!tx.to_address) return { generalPurpose: CONTRACT_PURPOSE.CONTRACT_DEPLOY }

		const txData = await provider.getTransaction(tx.tx_hash)
		if (txData.data == '0x') return { generalPurpose: CONTRACT_PURPOSE.ETH_TRANSFER }

		return {
			method: await this.getMethod(txData),
			generalPurpose: CONTRACT_PURPOSE.CONTRACT_INTERACTION,
		}
	}

	protected async getMethod(txData: TransactionResponse): Promise<string | null> {
		const fnSig = txData.data.slice(0, 10)
		if (this.#fnSigCache[fnSig]) return this.#fnSigCache[fnSig]

		const method = await axios
			.get('https://www.4byte.directory/api/v1/signatures', {
				params: { hex_signature: txData.data.slice(0, 10) },
			})
			.then(({ data: { results } }) => results[results.length - 1]?.text_signature?.split('(')?.[0])

		this.#fnSigCache[fnSig] = method

		return method
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new GeneralPurpose())

export default GeneralPurpose
