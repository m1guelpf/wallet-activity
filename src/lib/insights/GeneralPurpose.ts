import axios from 'axios'
import Augmenter from '@/lib/Augmenter'
import * as Sentry from '@sentry/nextjs'
import { TxData } from '@/types/covalent'
import Insight, { InsightWarning } from '@/lib/Insight'

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
			method: await this.getMethod(tx),
			generalPurpose: TX_PURPOSE.CONTRACT_INTERACTION,
		}
	}

	protected async getMethod(tx: TxData): Promise<string | null> {
		const hex_signature = tx.data.slice(0, 10)
		if (this.#fnSigCache[hex_signature]) return this.#fnSigCache[hex_signature]

		const method = await axios
			.get('https://sig.eth.samczsun.com/api/v1/signatures', { params: { function: hex_signature } })
			.then(
				({
					data: {
						result: {
							function: { [hex_signature]: result },
						},
					},
				}) => result[result.length - 1]?.name?.split('(')?.[0]
			)

		if (!method) Sentry.captureException(new InsightWarning(this, tx, `Method for [${hex_signature}] not found`))

		this.#fnSigCache[hex_signature] = method

		return method
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new GeneralPurpose())

export default GeneralPurpose
