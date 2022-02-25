import { ethers } from 'ethers'
import logger from '@/lib/logger'
import handler from '@/lib/api-handler'
import Augmenter from '@/lib/Augmenter'
import Covalent from '@/lib/clients/Covalent'
import { NextApiRequest, NextApiResponse } from 'next'
import Activity, { ActivityData, ActivityEntry } from '@/lib/Activity'
import { buildUrl } from '@/lib/utils'

type Response = ActivityData & {
	links: {
		prev: string | null
		next: string
		_self: string | null
	}
}

export default handler.get(async (req: NextApiRequest, res: NextApiResponse<Response | string>) => {
	const { wallet, page, limit } = getConfig(req)

	if (!wallet) return res.status(400).send('No wallet specified.')

	const activity = await Activity.forAddress(wallet, { page, limit })

	res.setHeader('Cache-Control', 'max-age=0, s-maxage=300, stale-while-revalidate')
	res.status(200).json({
		...activity,
		links: {
			prev: page == 0 ? null : buildUrl(req, page - 1, limit),
			_self: buildUrl(req, page, limit),
			next: activity.pagination.last_page ? null : buildUrl(req, page + 1, limit),
		},
	})
})

const getConfig = (req: NextApiRequest): { wallet: string; page: number; limit: number } => {
	let {
		query: { wallet, page = '0', limit = '100' },
	} = req

	return { wallet: wallet as string, page: parseInt(page as string), limit: parseInt(limit as string) }
}
