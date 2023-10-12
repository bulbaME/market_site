/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './modules/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'b-d': '#615529',
                'b-m': '#E0C45E',
                'b-l': '#E6D8A5',
                'g2-d': '#2E6146',
                'g2-l': '#1DAD61',
                'g': '#87DA46'
            }
        },
        transitionProperty: {
            'height': 'height',
            'width': 'width'
        }
    },
}
