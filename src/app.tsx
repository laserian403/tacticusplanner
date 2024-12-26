﻿import React, { useContext, useEffect, useState } from 'react';
import './i18n/config';
import { Outlet } from 'react-router-dom';

import { StaticDataService } from './services';
import { useAuth } from 'src/contexts/auth';
import { LoginStatusDialog } from 'src/shared-components/user-menu/login-status-dialog';
import { RegisterUserDialog } from 'src/shared-components/user-menu/register-user-dialog';
import { LoginUserDialog } from 'src/shared-components/user-menu/login-user-dialog';
import { SearchParamsStateProvider } from 'src/contexts/search-params.provider';
import { StoreContext } from 'src/reducers/store.provider';
import { Loader } from 'src/v2/components/loader';

export const App = () => {
    localStorage.setItem('appVersion', StaticDataService.whatsNew.currentVersion);
    const { isAuthenticated } = useAuth();
    const { loading, loadingText } = useContext(StoreContext);

    const [showLoginStatus, setShowLoginStatus] = useState(false);
    const [showRegisterUser, setShowRegisterUser] = useState(false);
    const [showLoginUser, setShowLoginUser] = useState(false);

    useEffect(() => {
        const lastVisit = localStorage.getItem('lastVisit');
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (!lastVisit || Date.now() - new Date(lastVisit).getTime() > thirtyDays) {
            setShowLoginStatus(!isAuthenticated);
        }
    }, []);

    const handleContinue = () => {
        localStorage.setItem('lastVisit', new Date().toISOString());
        setShowLoginStatus(false);
    };

    const handleClose = () => {
        setShowLoginStatus(false);
    };

    const handleRegister = () => {
        setShowLoginStatus(false);
        setShowRegisterUser(true);
    };

    const handleLogin = () => {
        setShowLoginStatus(false);
        setShowLoginUser(true);
    };

    return (
        <React.Fragment>
            {showLoginStatus && (
                <LoginStatusDialog
                    onClose={handleClose}
                    onContinue={handleContinue}
                    onRegister={handleRegister}
                    onLogin={handleLogin}
                />
            )}
            <RegisterUserDialog
                isOpen={showRegisterUser}
                onClose={success => {
                    setShowRegisterUser(false);
                    setShowLoginUser(success);
                }}
            />
            <LoginUserDialog isOpen={showLoginUser} onClose={() => setShowLoginUser(false)} />
            <SearchParamsStateProvider>
                <Outlet />
            </SearchParamsStateProvider>
            <Loader loading={!!loading} loadingText={loadingText} />
        </React.Fragment>
    );
};
