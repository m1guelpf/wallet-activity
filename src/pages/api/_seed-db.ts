import handler from '@/lib/api-handler'
import { NextApiRequest, NextApiResponse } from 'next'
import { seedTintin } from '@/lib/seeders'

export default handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not Found')

	await seedTintin()

	res.status(200).send(0)
})
