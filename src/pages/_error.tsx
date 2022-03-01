import * as Sentry from '@sentry/nextjs'
import { NextPage, NextPageContext } from 'next'
import NextErrorView, { ErrorProps as NextErrorProps } from 'next/error'

type ErrorProps = NextErrorProps & { hasGetInitialPropsRun?: boolean }

const NextError: NextPage<ErrorProps & { err?: Error }> = ({ statusCode, hasGetInitialPropsRun, err }) => {
	if (!hasGetInitialPropsRun && err) Sentry.captureException(err)

	return <NextErrorView statusCode={statusCode} />
}

NextError.getInitialProps = async (context: NextPageContext): Promise<ErrorProps> => {
	const errorInitialProps: ErrorProps = await NextErrorView.getInitialProps(context)

	const { res, err, asPath } = context
	errorInitialProps.hasGetInitialPropsRun = true

	if (res?.statusCode === 404) return errorInitialProps

	if (err) {
		Sentry.captureException(err)
		await Sentry.flush(2000)

		return errorInitialProps
	}

	Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`))
	await Sentry.flush(2000)

	return errorInitialProps
}

export default NextError
