import { useEffect, useState } from 'react'

const getTime = (): Date => new Date()

export const useTime = (refreshCycle = 500): Date => {
	const [now, setNow] = useState<Date>(getTime())

	useEffect(() => {
		const intervalId = setInterval(() => setNow(getTime()), refreshCycle)

		return () => clearInterval(intervalId)
	}, [refreshCycle])

	return now
}
