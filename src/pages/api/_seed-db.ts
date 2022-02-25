import handler from '@/lib/api-handler'
import { NextApiRequest, NextApiResponse } from 'next'
import { seedTintin } from '@/lib/seeders'

export default handler.get(async ({ query: { network = 'mainnet' } }: NextApiRequest, res: NextApiResponse) => {
	if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not Found')

	await seedTintin({ network: network as string })

	res.status(200).send(0)
})
