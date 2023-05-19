import { ThemeProvider, Typography } from '@mui/material';
import { useDarkMode } from 'storybook-dark-mode';
import { createTheme } from '../src';
import { version } from '../package.json';

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  backgrounds: {
    values: [
      {
        name: 'white',
        value: '#fff',
      },
      {
        name: 'lightgrey',
        value: '#fafeff',
      },
      {
        name: 'darkgrey',
        value: '#333',
      },
      {
        name: 'black',
        value: '#000',
      },
    ],
  },
  controls: { expanded: true, sort: 'requiredFirst' },
  darkMode: { current: 'light' },
  options: { showPanel: false, },
};

const withThemeProvider = (Story, context) => {
  const defaultTheme = createTheme({
    palette: { mode: useDarkMode() ? 'dark' : 'light' },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Typography
        variant="subtitle2"
        sx={{
          pb: '1rem',
          color: useDarkMode() ? '#fff' : '#666',
        }}
      >
        [table-component v{version}]
        <br />
        View source code below in the story tab on Canvas or the Show Code
        Button in Docs. Toggle dark and light mode in the toolbar buttons above.
      </Typography>
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];
