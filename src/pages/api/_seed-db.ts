import handler from '@/lib/api-handler'
import { Network } from '@/types/utils'
import { seedTintin } from '@/lib/seeders'
import { NextApiRequest, NextApiResponse } from 'next'

export default handler().get(async ({ query: { network = 'mainnet' } }: NextApiRequest, res: NextApiResponse) => {
	if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not Found')

	await seedTintin({ network: network as Network })

	res.status(200).send(0)
})
