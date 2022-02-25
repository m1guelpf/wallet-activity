import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>({
	onError: (err, _, res) => {
		console.error(err)

		res.status(500).end(err.toString())
	},
})

export default handler
