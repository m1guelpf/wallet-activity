class Logger {
	#timers: Record<string, number> = {}

	public startTimer(key: string): void {
		this.#timers[key] = new Date().getTime()
	}

	public endTimer(key: string, msg: string = ''): number {
		const elapsed = (new Date().getTime() - this.#timers[key]) / 1000
		delete this.#timers[key]

		this.debug(`${key} took ${elapsed}s`, msg)

		return elapsed
	}

	public debug(...data: any[]): void {
		if (process.env.NODE_ENV !== 'development') return

		console.log(...data)
	}
}

export default new Logger()
