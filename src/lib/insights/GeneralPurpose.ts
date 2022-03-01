import axios from 'axios'
import Insight from '@/lib/Insight'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'

export enum TX_PURPOSE {
	ETH_TRANSFER = 'eth_transfer',
	CONTRACT_DEPLOY = 'contract_deploy',
	CONTRACT_INTERACTION = 'contract_interaction',
}

class GeneralPurpose extends Insight {
	name = 'General Purpose'
	#fnSigCache: Record<string, string> = {}

	public async apply(tx: TxData): Promise<{ generalPurpose: string; method?: string }> {
		if (!tx.to_address) return { generalPurpose: TX_PURPOSE.CONTRACT_DEPLOY }
		if (tx.data == '0x') return { generalPurpose: TX_PURPOSE.ETH_TRANSFER }

		return {
			method: await this.getMethod(tx.data),
			generalPurpose: TX_PURPOSE.CONTRACT_INTERACTION,
		}
	}

	protected async getMethod(txData: string): Promise<string | null> {
		const fnSig = txData.slice(0, 10)
		if (this.#fnSigCache[fnSig]) return this.#fnSigCache[fnSig]

		const method = await axios
			.get('https://www.4byte.directory/api/v1/signatures', {
				params: { hex_signature: txData.slice(0, 10) },
			})
			.then(({ data: { results } }) => results[results.length - 1]?.text_signature?.split('(')?.[0])

		this.#fnSigCache[fnSig] = method

		return method
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new GeneralPurpose())

export default GeneralPurpose
