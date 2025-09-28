tailwind.config = {
            theme: {
                colors: {
                    transparent: 'transparent',
                    current: 'currentColor',
                    primary: '#f7c72b',
                    primaryTint: '#002644',
                    secondary: '#46444a',
                    offwhite: '#837c85',
                    white: '#ffffff',
                    black: '#000000',
                    grey: '#6C757D',
                    lightgrey: '#E1DEFF',
                    darkgrey: '#333333',
                    green: '#00976A',
                    red: '#F25F5F',
                    amber: '#FFCA7C',
                    blue: '#5CC4FF',
                    success: '#00976A',
                    error: '#C2003A',
                    bronze: '#ECBC90',
                    silver: '#C0C0C0',
                    gold: '#FFCA7C',
                },
                container: {
                    center: true,
                    padding: '1rem',
                },
                extend: {
                    keyframes: {
                        fadeIn: {
                            '0%': {
                                opacity: '0',
                            },
                            '100%': {
                                opacity: '1',
                            }
                        }
                    },
                    animation: {
                        fadeIn: 'fadeIn 0.2s ease-in'
                    }
                }
            },
        }