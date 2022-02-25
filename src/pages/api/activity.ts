import { ethers } from 'ethers'
import logger from '@/lib/logger'
import handler from '@/lib/api-handler'
import Augmenter from '@/lib/Augmenter'
import Covalent from '@/lib/clients/Covalent'
import { NextApiRequest, NextApiResponse } from 'next'
import Activity from '@/lib/Activity'

export default handler.get(async ({ query: { wallet } }: NextApiRequest, res: NextApiResponse) => {
	if (!wallet) return res.status(400).send('No wallet specified.')

	res.setHeader('Cache-Control', 'max-age=0, s-maxage=300, stale-while-revalidate')
	res.status(200).json(await Activity.forAddress(wallet as string))
})
