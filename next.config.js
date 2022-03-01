const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	sentry: {
		hideSourceMaps: true,
	},
}

module.exports = withSentryConfig(nextConfig, { silent: true })
