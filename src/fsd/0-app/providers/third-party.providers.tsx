import { SnackbarOrigin, SnackbarProvider, closeSnackbar } from 'notistack';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { PopupProvider } from 'react-popup-manager';
import { RouterProvider } from 'react-router-dom';
import { AnalyticsProvider } from 'use-analytics';
import { routes } from '../routing/app-routing';
import analytics from '../monitoring/analytics';

const webSnackbarOrigin: SnackbarOrigin = { vertical: 'bottom', horizontal: 'right' };
const mobileSnackbarOrigin: SnackbarOrigin = { vertical: 'top', horizontal: 'center' };

export const ThirdPartyProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <AnalyticsProvider instance={analytics}>
            <SnackbarProvider
                autoHideDuration={5000}
                anchorOrigin={isMobile ? mobileSnackbarOrigin : webSnackbarOrigin}
                onEntered={(node, isAppearing, key) => (node.onclick = () => closeSnackbar(key))}
            />

            {/*// @ts-expect-error Ts being weird */}
            <PopupProvider>
                <RouterProvider router={routes} />
            </PopupProvider>
        </AnalyticsProvider>
    );
};
