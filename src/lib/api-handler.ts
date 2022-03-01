import nc from 'next-connect'
import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = () =>
	nc<NextApiRequest, NextApiResponse>({
		onError: (err, req, res, next) => {
			// Sentry integration throws the request on successful requests
			if (err == req) return next()

			console.error(err)

			res.status(500).end(err.toString())
		},
	}).use((req, res, next) => withSentry(next)(req, res))

export default handler
