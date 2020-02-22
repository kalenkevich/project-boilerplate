import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/input';
import Button from '../../components/common/button';
import Form, { FormSection, FormSectionAction } from '../../components/common/form';
import useStyle from './ResetPasswordStyle';
import LoadingContext from '../../contexts/LoadingContext';

const ResetWithPhone = (props) => {
  const {
    formData,
    onFormDataChange,
    onBackButtonClick,
    onContinueButtonClick,
  } = props;

  const { t } = useTranslation();
  const classes = useStyle();
  const { isLoading } = useContext(LoadingContext);
  const isFormLoading = isLoading('resetWithPhone');

  return (
    <div className={classes.rootWrapper}>
      <Form
        className={classes.root}
        title={t('RESET_PASSWORD_RESET_WITH_PHONE_FORM_TITLE')}
        onEnter={() => {
          if (!formData.isValid || isFormLoading) {
            return;
          }

          onContinueButtonClick();
        }}
      >
        <FormSection>
          {t('RESET_PASSWORD_RESET_WITH_PHONE_LABEL')}
        </FormSection>
        <FormSection>
          <Input
            autoFocus
            label={t('SIGN_IN_FORM_PHONE')}
            disabled={isFormLoading}
            error={formData.phone.error}
            value={formData.phone.value}
            onChange={(e) => onFormDataChange('phone', e.target.value)}
          />
        </FormSection>
        <FormSectionAction>
          <Button
            onClick={onBackButtonClick}
          >
            {t('BACK')}
          </Button>
          <Button
            onClick={onContinueButtonClick}
            type='primary'
            disabled={!formData.isValid || isFormLoading}
            spin={isFormLoading}
          >
            {t('CONTINUE')}
          </Button>
        </FormSectionAction>
      </Form>
    </div>
  );
};

ResetWithPhone.propTypes = {
  formData: PropTypes.object,
  onFormDataChange: PropTypes.func,
};

export default ResetWithPhone;
