import { NextApiRequest } from 'next'

export const buildUrl = (req: NextApiRequest, page = 0, limit = 100): string => {
	const url = new URL(req.url, `http://${req.headers.host}`)

	url.searchParams.set('page', page.toString())
	url.searchParams.set('limit', limit.toString())

	if (url.searchParams.get('page') == '0') url.searchParams.delete('page')
	if (url.searchParams.get('limit') == '100') url.searchParams.delete('limit')

	return `https://${req.headers.host}${url.pathname}/?${url.searchParams.toString()}`
}
