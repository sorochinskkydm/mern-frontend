import { createTheme } from '@mui/material/styles';
import shadows from '@mui/material/styles/shadows';

export const theme = createTheme({
  shadows: ['none'],
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
});
