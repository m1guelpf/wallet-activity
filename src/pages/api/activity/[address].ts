import handler from '@/lib/api-handler'
import { ChainId, Network } from '@/types/utils'
import { buildUrl, getChainId } from '@/lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import Activity, { ActivityData } from '@/lib/Activity'

type Response = ActivityData & {
	links: {
		prev: string | null
		next: string
		_self: string | null
	}
}

export default handler().get(async (req: NextApiRequest, res: NextApiResponse<Response | string>) => {
	const { address, chainId, page, limit } = getConfig(req)

	if (!address) return res.status(400).send('No wallet specified.')

	const activity = await Activity.forAddress(address, { chainId, page: page - 1, limit })

	res.setHeader('Cache-Control', 'max-age=0, s-maxage=300, stale-while-revalidate')
	res.status(200).json({
		...activity,
		links: {
			prev: page == 1 ? null : buildUrl(req, page - 1, limit),
			_self: buildUrl(req, page, limit),
			next: activity.pagination.last_page ? null : buildUrl(req, page + 1, limit),
		},
	})
})

const getConfig = (req: NextApiRequest): { address: string; chainId: ChainId; page: number; limit: number } => {
	let {
		query: { address, page = '1', limit = '100', network = Network.MAINNET },
	} = req

	return {
		address: address as string,
		chainId: getChainId(network as Network),
		page: parseInt(page as string),
		limit: parseInt(limit as string),
	}
}
