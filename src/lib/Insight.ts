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

export class InsightWarning extends Error {
	public tx: TxData
	public insight: Insight
	public errors?: Error[]

	constructor(insight: Insight, tx: TxData, message: string) {
		super(`Warning on ${insight.name}: ${message} (tx: ${tx.tx_hash})`)

		this.insight = insight
		this.tx = tx
	}
}

abstract class Insight {
	name: string

	public async applyAll(txs: TxData[], config: Config): Promise<TxData[]> {
		return txs
	}

	abstract apply(tx: TxData, config: Config): Promise<Record<string, unknown>>
}

export default Insight
