import { createUseStyles } from 'react-jss';

export default createUseStyles(() => ({
  '@global': {
    'html, body, #root': {
      margin: '0',
      padding: '0',
    },
    html: {
      fontFamily: '"Inter", sans-serif',
      fontStyle: '',
      fontDisplay: 'swap',
      fontWeight: '400',
      minHeight: '100%',
      position: 'relative',
    },
    body: {
    },
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    '@keyframes roadRunnerIn': {
      '0%': {
        transform: 'translateX(-1500px) skewX(30deg) scaleX(1.3)',
      },
      '70%': {
        transform: 'translateX(30px) skewX(0deg) scaleX(.9)',
      },
      '100%': {
        transform: 'translateX(0px) skewX(0deg) scaleX(1)',
      }
    },
    '@keyframes roadRunnerOut': {
      '0%': {
        transform: 'translateX(0px) skewX(0deg) scaleX(1)',
      },
      '30%': {
        transform: 'translateX(-30px) skewX(-5deg) scaleX(.9)',
      },
      '100%': {
        transform: 'translateX(1500px) skewX(30deg) scaleX(1.3)',
      }
    }
  },
  applicationContent: {
    width: '100%',
    maxWidth: '1355px',
    padding: ({ isMobile }) => (isMobile ? '40px 10px 165px 10px' : '40px 10px 117px 10px'),
    boxSizing: 'border-box',
  },
}));
