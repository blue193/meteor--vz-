import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {colors} from './colors';

export const darkTheme = getMuiTheme({
  fontFamily: 'Lato, sans-serif',
  palette: {
    primary1Color: colors.orange0,
    accent1Color: colors.orange0,
    textColor: colors.grey4,
    alternateTextColor: colors.grey3
  },
  listItem: {
    selectedTextColor: colors.orange0
  },
  appBar: {
    height: 100,
    color: colors.grey2
  },
  dialog: {
    bodyColor: colors.grey3
  }
});
