import { ActivityEntry } from '../Activity'
import Inspector, { InspectorResult } from '../Inspector'

class FailedTransaction extends Inspector {
	name = 'Failed Transaction'

	public check(entry: ActivityEntry): boolean {
		return entry.raw.reverted
	}

	resolve(): InspectorResult {
		return { hideTransaction: true }
	}
}

export default FailedTransaction
