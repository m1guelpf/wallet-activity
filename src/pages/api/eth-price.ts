import handler from '@/lib/api-handler'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default handler().get(async (req: NextApiRequest, res: NextApiResponse<{ price: number }>) => {
	const { ethereum } = await axios
		.get('https://api.coingecko.com/api/v3/simple/price', {
			params: {
				ids: 'ethereum',
				vs_currencies: 'usd',
			},
		})
		.then(res => res.data as { ethereum: { usd: number } })

	res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600, stale-while-revalidate')
	res.json({ price: ethereum.usd })
})
