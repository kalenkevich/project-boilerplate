import React from 'react';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('MAIN_PAGE_TITLE')}</h2>
    </div>
  );
};

export default MainPage;
