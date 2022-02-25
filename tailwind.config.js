const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors,
			fontFamily: {
				sans: ['-apple-system', ...fontFamily.sans],
			},
			maxHeight: {
				'4xl': '56rem',
			},
			minHeight: {
				'3xl': '48rem',
			},
			backgroundImage: {
				ios: "linear-gradient(rgba(0, 0, 0, .1) 0%, rgba(0, 0,  0, .1) 100%), url('https://i.imgur.com/H5lPJLP.jpg')",
			},
			keyframes: {
				reveal: {
					'0%, 100%': {
						opacity: 0,
					},
					'10%': {
						'background-size': '0% 100%',
						opacity: 0,
					},
					'15%': {
						opacity: 1,
					},
					'30%': {
						'background-size': '200% 100%',
					},
					'90%': {
						'background-size': '200% 100%',
						opacity: 1,
					},
				},
			},
			animation: {
				reveal: 'reveal 8s ease-in-out infinite',
			},
		},
	},
	plugins: [],
}
