import {colors} from './colors';

export const cssStyles = {
  list: {
    selectedItem: {
      backgroundColor: colors.grey1,
      color: colors.orange0
    }
  },
  listItem: {
    root: {
      borderWidth: '0 1px 1px 1px',
      borderStyle: 'solid',
      borderColor: colors.grey2,
      fontSize: 10
    },
    innerDiv: {
      padding: '16px 16px 16px 60px'
    }
  },
  appBar: {
    root: {
      borderBottom: 'solid 1px',
      borderColor: colors.grey2,
      boxShadow: 'none'
    },
    title: {
      width: '175px',
      verticalAlign: 'middle'
    }
  },
  toolBar: {
    root: {
      padding: '0 5px',
      backgroundColor: colors.grey3
    }
  },
  flatButton: {
    default: {
      label: {
        color: colors.grey3,
        margin: '0 10px',
        fontWeight: 'bold',
        fontSize: 9
      },
      root: {
        marginRight: 10,
        borderRadius: 14,
        border: 'solid 1px #6d7275',
        height: 28,
        lineHeight: '25px'
      }
    },
    primary: {
      label: {
        color: colors.grey3,
        margin: '0 10px',
        fontWeight: 'bold',
        fontSize: 9
      },
      root: {
        borderRadius: 14,
        height: 28,
        lineHeight: '25px'
      }
    }
  }
};
