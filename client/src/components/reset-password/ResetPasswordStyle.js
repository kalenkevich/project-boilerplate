import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  root: {
    maxWidth: '600px',
  },
  rootWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chooseTypeButton: {
    width: '45%',
  },
  foundedUserRoot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: theme.border,
    borderRadius: theme.borderRadius,
    padding: '10px',
  },
  userInfo: {
    marginLeft: '10px',
  },
  userAvatar: {

  },
  userName: {

  },
  userId: {
    marginTop: '10px',
  },
}));
