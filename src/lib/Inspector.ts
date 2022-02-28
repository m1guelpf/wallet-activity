import { ActivityEntry } from './Activity'

export type InspectorResult =
	| { title: string; description?: string; hideTransaction?: false }
	| { hideTransaction: true; title?: undefined; description?: undefined }
export type Config = {
	userAddress: string
}

abstract class Inspector {
	name: string

	abstract check(entry: ActivityEntry, config: Config): boolean
	abstract resolve(entry: ActivityEntry, config: Config): InspectorResult
}

export default Inspector
