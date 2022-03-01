import logger from './logger'
import { ActivityEntry } from './Activity'

export type InspectorResult =
	| { title: string; description?: string; hideTransaction?: false }
	| { hideTransaction: true; title?: undefined; description?: undefined }
export type Config = {
	userAddress: string
}

export class InspectorError extends Error {
	inspector: Inspector
	entry: ActivityEntry
	error: Error

	constructor(inspector: Inspector, entry: ActivityEntry, error?: Error) {
		super(`Inspector ${inspector.name} failed to resolve ${entry.id}.`)

		this.inspector = inspector
		this.entry = entry
		this.error = error

		if (error) this.stack = error.stack

		logger.debug('error!!!', inspector.name, entry)
	}
}

abstract class Inspector {
	name: string

	abstract check(entry: ActivityEntry, config: Config): boolean
	abstract resolve(entry: ActivityEntry, config: Config): InspectorResult
}

export default Inspector
