import logger from './logger'
import { TxData } from '@/types/covalent'
import Insight, { Config } from './Insight'

type Module = {
	registerInsight?: (Augmenter) => void
	default: Insight
}

class Augmenter {
	#insights: Array<Insight> = []
	insightsPromise: Promise<void[]>

	constructor() {
		const insights = require.context('./insights', true)

		insights
			.keys()
			.filter(key => key.endsWith('.ts')) // Prevent insight duplication (due to TS)
			.map(key => insights<Module>(key)?.registerInsight?.(this))
	}

	public async augment(tx: TxData, config: Config): Promise<Record<string, unknown>> {
		const insights = await Promise.allSettled(this.#insights.map(insight => insight.apply(tx, config)))

		/* @TODO: Remove before going to production. */
		insights.forEach(result => result.status == 'rejected' && logger.debug(result.reason))

		return insights
			.filter(result => result.status === 'fulfilled')
			.map((result: PromiseFulfilledResult<Record<string, unknown>>) => result.value)
			.reduce((A, B) => {
				let res = {}

				Object.keys({ ...A, ...B }).map(key => (res[key] = B[key] || A[key]))

				return res
			})
	}

	public register(module: Insight): void {
		this.#insights.push(module)
	}
}

export default new Augmenter()
