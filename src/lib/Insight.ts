import { ChainId } from '@/types/utils'
import { TxData } from '@/types/covalent'

export type Config = {
	chainId: ChainId
}

export class InsightFailed extends Error {
	public insight: Insight
	public errors?: Error[]

	constructor(insight: Insight) {
		super(`Resolving insight ${insight.name} failed.`)

		this.insight = insight
	}
}

abstract class Insight {
	name: string

	abstract apply(tx: TxData, config: Config): Promise<Record<string, unknown>>
}

export default Insight
