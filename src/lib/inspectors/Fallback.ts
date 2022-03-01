import logger from '../logger'
import { ActivityEntry } from '../Activity'
import Inspector, { InspectorResult } from '../Inspector'

class Fallback extends Inspector {
	name = 'Fallback'

	public check(): boolean {
		return true
	}

	resolve(entry: ActivityEntry): InspectorResult {
		if (process.env.NODE_ENV === 'production') return { hideTransaction: true }

		logger.debug('missed', entry)

		throw Error('Inspector Not Found')
	}
}

export default Fallback
