import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useStyle from './ResetPasswordStyle';
import Avatar from '../common/avatar';
import { getClassName } from '../../utils/ClassUtils';

const FoundedUserCard = (props) => {
  const { className, user } = props;
  const classes = useStyle();
  const { t } = useTranslation();
  const rootClasses = getClassName([
    classes.foundedUserRoot,
    className,
  ]);

  return (
    <div className={rootClasses}>
      <Avatar
        url={user.avatarUrl}
        size='sm'
        className={classes.userAvatar}
      />
      <div className={classes.userInfo}>
        <div className={classes.userName}>
          {user.firstName} {user.lastName}
        </div>
        <div className={classes.userId}>
          {t('ID')} {user.id}
        </div>
      </div>
    </div>
  );
};

FoundedUserCard.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
};

export default FoundedUserCard;
