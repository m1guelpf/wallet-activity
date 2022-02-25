import { TxData } from '@/types/covalent'
import Insight from './Insight'

type Module = {
	registerInsight?: (Augmenter) => void
	default: Insight
}

class Augmenter {
	#insights: Array<Insight> = []
	insightsPromise: Promise<void[]>

	constructor() {
		const insights = require.context('./insights', true)

		this.insightsPromise = Promise.all(
			insights
				.keys()
				.filter(key => key.endsWith('.ts')) // Prevent insight duplication (due to TS)
				.map(async key => await insights<Module>(key)?.registerInsight?.(this))
		)
	}

	public async ready(): Promise<void> {
		await this.insightsPromise
	}

	public async augment(tx: TxData): Promise<Record<string, unknown>> {
		const insights = await Promise.allSettled(this.#insights.map(insight => insight.apply(tx)))

		/* @TODO: Remove before going to production. */
		insights.forEach(result => result.status == 'rejected' && console.log(result.reason))

		return Object.fromEntries(
			insights
				.filter(result => result.status === 'fulfilled')
				.map((result: PromiseFulfilledResult<Record<string, unknown>>) => Object.entries(result.value))
				.flat()
		)
	}

	public register(module: Insight): void {
		this.#insights.push(module)
	}
}

export default new Augmenter()
