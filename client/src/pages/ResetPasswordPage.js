import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ResetWithPhone from '../components/reset-password/ResetWithPhone';
import SecurityStep from '../components/sign-up/SecurityStep';
import FinishWithPhoneStep from '../components/reset-password/FinishWithPhoneStep';
import AuthorizationAPI from '../APIs/AuthorizationAPI';
import AuthorizationContext from '../contexts/AuthorizationContext';
import NotificationContext from '../contexts/NotificationContext';
import LoadingContext from '../contexts/LoadingContext';
import useValidation from '../hooks/UseValidation';
import Logger from '../services/Logger';
import {
  OnlyNumberRegex,
  PasswordRegex,
} from '../constants/Regex';
import {
  CodeStateSchema,
  CodeValidationSchema,
} from './SignUpPage';

export const PhoneStateSchema = {
  phone: {
    value: '',
    error: null,
  },
};
export const PhoneValidationSchema = {
  phone: {
    required: true,
    validator: {
      regEx: OnlyNumberRegex,
      error: 'VALIDATION_ERROR_SIGN_UP_FORM_PHONE',
    },
  },
};
export const FinishWithPhoneStateSchema = {
  password: {
    value: '',
    error: null,
  },
  repeatPassword: {
    value: '',
    error: null,
  },
};
export const FinishWithPhoneValidationSchema = {
  password: {
    required: true,
    validator: {
      regEx: PasswordRegex,
      error: 'VALIDATION_ERROR_SIGN_UP_FORM_PASSWORD',
    },
  },
  repeatPassword: {
    required: true,
    validator: (currentValue, currentState) => {
      if (currentValue !== currentState.password.value) {
        return 'VALIDATION_ERROR_SIGN_UP_FORM_REPEAT_PASSWORD';
      }

      return null;
    },
  },
};

export const RESET_PASSWORD_STEPS = {
  RESET_WITH_PHONE: 'RESET_WITH_PHONE',
  VERIFY_PHONE: 'VERIFY_PHONE',
  FINISH_WITH_PHONE_STEP: 'FINISH_WITH_PHONE_STEP',
};

const ResetPasswordContainer = (props) => {
  const { history } = props;
  const { authorize } = useContext(AuthorizationContext);
  const { showErrorNotification } = useContext(NotificationContext);
  const { startSavingData, stopSavingData } = useContext(LoadingContext);
  const [currentStep, setCurrentStep] = useState(RESET_PASSWORD_STEPS.RESET_WITH_PHONE);
  const [foundedUser, setFoundedUser] = useState({
    firstName: 'Alexey',
    lastName: 'Kalenkevich',
    id: '12',
    avatarUrl: 'https://avatars.mds.yandex.net/get-yapic/30431/0wjIY4G9jXDSHIbBZHHomrDiQ-1572719295/islands-retina-middle',
  });
  const [verificationToken, setVerificationToken] = useState(null);
  const [resetPasswordToken, setResetPasswordToken] = useState(null);
  const [
    phoneStepFormData,
    onPhoneStepFormDataChange,
  ] = useValidation(PhoneStateSchema, PhoneValidationSchema);
  const [
    codeStepFormData,
    onCodeStepFormDataChange,
  ] = useValidation(CodeStateSchema, CodeValidationSchema);
  const [
    finishWithPhoneStepFormData,
    onFinishWithPhoneStepFormDataChange,
  ] = useValidation(FinishWithPhoneStateSchema, FinishWithPhoneValidationSchema);

  const onResetWithPhoneContinueButtonClick = async () => {
    try {
      startSavingData('resetWithPhone');

      const verificationToken = await AuthorizationAPI.initiateResetPasswordWithPhone({
        phone: phoneStepFormData.phone.value,
      });

      setVerificationToken(verificationToken);
      setCurrentStep(RESET_PASSWORD_STEPS.VERIFY_PHONE);
    } catch (error) {
      Logger.error(error);
      showErrorNotification(error.message);
    } finally {
      stopSavingData('resetWithPhone');
    }
  };

  const onVerifyCodeContinueButtonClick = async () => {
    try {
      startSavingData('verifyCode');

      const {
        user,
        resetPasswordToken,
      } = await AuthorizationAPI.verifyResetPasswordCode({
        code: codeStepFormData.code.value,
        verificationToken,
      });

      setFoundedUser(user);
      setResetPasswordToken(resetPasswordToken);
      setCurrentStep(RESET_PASSWORD_STEPS.FINISH_WITH_PHONE_STEP);
    } catch (error) {
      Logger.error(error);
      showErrorNotification(error.message);
    } finally {
      stopSavingData('verifyCode');
    }
  };

  const onFinishFinishWithPhoneStepButtonClick = async () => {
    try {
      startSavingData('finishWithPhoneStep');

      await AuthorizationAPI.resetPasswordWithPhone({
        password: finishWithPhoneStepFormData.password.value,
        resetPasswordToken,
      });

      authorize();
      history.push('/');
    } catch (error) {
      Logger.error(error);
      showErrorNotification(error.message);
    } finally {
      stopSavingData('finishWithPhoneStep');
    }
  };

  if (currentStep === RESET_PASSWORD_STEPS.RESET_WITH_PHONE) {
    return <ResetWithPhone
      formData={phoneStepFormData}
      onFormDataChange={onPhoneStepFormDataChange}
      onBackButtonClick={() => setCurrentStep(RESET_PASSWORD_STEPS.RESET_WITH_PHONE)}
      onContinueButtonClick={onResetWithPhoneContinueButtonClick}
    />;
  }

  if (currentStep === RESET_PASSWORD_STEPS.VERIFY_PHONE) {
    return <SecurityStep
      formData={codeStepFormData}
      onFormDataChange={onCodeStepFormDataChange}
      onBackButtonClick={() => setCurrentStep(RESET_PASSWORD_STEPS.RESET_WITH_PHONE)}
      onContinueClick={onVerifyCodeContinueButtonClick}
    />;
  }

  if (currentStep === RESET_PASSWORD_STEPS.FINISH_WITH_PHONE_STEP) {
    return <FinishWithPhoneStep
      user={foundedUser}
      formData={finishWithPhoneStepFormData}
      onFormDataChange={onFinishWithPhoneStepFormDataChange}
      onBackButtonClick={() => setCurrentStep(RESET_PASSWORD_STEPS.RESET_WITH_PHONE)}
      onFinishButtonClick={onFinishFinishWithPhoneStepButtonClick}
    />;
  }

  return null;
};

ResetPasswordContainer.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ResetPasswordContainer);
