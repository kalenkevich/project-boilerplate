import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/input';
import Button from '../../components/common/button';
import Form, { FormSection, FormSectionAction } from '../../components/common/form';
import useStyle from './ResetPasswordStyle';
import LoadingContext from '../../contexts/LoadingContext';
import FoundedUserCard from './FoundedUserCard';

const FinishWithPincodeStep = (props) => {
  const {
    user,
    formData,
    onFormDataChange,
    onBackButtonClick,
    onFinishButtonClick,
  } = props;

  const { t } = useTranslation();
  const classes = useStyle();
  const { isLoading } = useContext(LoadingContext);
  const isFormLoading = isLoading('finishWithPhoneStep');

  return (
    <div className={classes.rootWrapper}>
      <Form
        className={classes.root}
        title={t('RESET_PASSWORD_FINISH_WITH_PINCODE_FORM_TITLE')}
        onEnter={() => {
          if (!formData.isValid || isFormLoading) {
            return;
          }

          onFinishButtonClick();
        }}
      >
        <FormSection>
          <FoundedUserCard user={user}/>
        </FormSection>
        <FormSection>
          <Input
            autoFocus
            type='password'
            label={t('RESET_PASSWORD_RESET_PINCODE')}
            disabled={isFormLoading}
            error={formData.pincode.error}
            value={formData.pincode.value}
            onChange={(e) => onFormDataChange('pincode', e.target.value)}
          />
          <Input
            type='password'
            label={t('RESET_PASSWORD_RESET_REPEAT_PINCODE')}
            disabled={isFormLoading}
            error={formData.repeatPincode.error}
            value={formData.repeatPincode.value}
            onChange={(e) => onFormDataChange('repeatPincode', e.target.value)}
          />
          <Input
            type='password'
            label={t('RESET_PASSWORD_RESET_PASSWORD')}
            disabled={isFormLoading}
            error={formData.password.error}
            value={formData.password.value}
            onChange={(e) => onFormDataChange('password', e.target.value)}
          />
          <Input
            type='password'
            label={t('RESET_PASSWORD_RESET_REPEAT_PASSWORD')}
            disabled={isFormLoading}
            error={formData.repeatPassword.error}
            value={formData.repeatPassword.value}
            onChange={(e) => onFormDataChange('repeatPassword', e.target.value)}
          />
        </FormSection>
        <FormSectionAction>
          <Button
            onClick={onBackButtonClick}
          >
            {t('BACK')}
          </Button>
          <Button
            onClick={onFinishButtonClick}
            type='primary'
            disabled={!formData.isValid || isFormLoading}
            spin={isFormLoading}
          >
            {t('RESET_PASSWORD_RESET_FINISH_BUTTON')}
          </Button>
        </FormSectionAction>
      </Form>
    </div>
  );
};

FinishWithPincodeStep.propTypes = {
  user: PropTypes.object,
  formData: PropTypes.object,
  onFormDataChange: PropTypes.func,
  onBackButtonClick: PropTypes.func,
  onFinishButtonClick: PropTypes.func,
};

export default FinishWithPincodeStep;
