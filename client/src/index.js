import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppWithSettings } from './contexts/SettingsContext';
import { MobileApp } from './contexts/MobileContext';
import { LoadingApp } from './contexts/LoadingContext';
import { AuthorizedApp } from './contexts/AuthorizationContext';
import { ThemedApp } from './contexts/ThemeContext';
import { I18NApp } from './contexts/I18NContext';
import { NotificationApp } from './contexts/NotificationContext';
import Application from './application/Application';
import { AppWithModalDialog } from './contexts/ModalDialogContext'

ReactDom.render(
    <BrowserRouter>
      <AuthorizedApp>
      <AppWithSettings>
        <MobileApp>
          <LoadingApp>
            <ThemedApp>
              <I18NApp>
                <NotificationApp>
                  <AppWithModalDialog>
                    <AuthorizedApp>
                      <Application/>
                    </AuthorizedApp>
                  </AppWithModalDialog>
                </NotificationApp>
              </I18NApp>
            </ThemedApp>
          </LoadingApp>
        </MobileApp>
      </AppWithSettings>
      </AuthorizedApp>
    </BrowserRouter>,
  document.getElementById('root'),
);
