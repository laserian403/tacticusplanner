﻿import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Tooltip } from '@mui/material';
import ThemeSwitch from '../../shared-components/theme-switch';
import { UserMenu } from '../../shared-components/user-menu/user-menu';
import { bmcLink, discordInvitationLink } from '../../models/constants';
import CampaignIcon from '@mui/icons-material/Campaign';
import { StoreContext } from '../../reducers/store.provider';
import { WhatsNewDialog } from '../../shared-components/whats-new.dialog';
import IconButton from '@mui/material/IconButton';
import { DiscordIcon } from '../../shared-components/icons/discord.icon';
import { Home } from '../../features/misc/home/home';
import { menuItemById } from 'src/models/menu-items';
import { BmcIcon } from 'src/shared-components/icons/bmc.icon';
import { usePwaInstall } from '@/v2/hooks/usePwaInstall';
import { AddToHomeScreen } from '@/v2/features/pwa/addToHomeScreen';
import { isMobile } from 'react-device-detect';

export const MobileHome = () => {
    const { seenAppVersion } = useContext(StoreContext);
    const navigate = useNavigate();
    const { deviceLink, isInstalled } = usePwaInstall();

    const [showPwaInstall, setShowPwaInstall] = useState(isMobile);
    const [showWhatsNew, setShowWhatsNew] = useState(false);

    const seenNewVersion = useMemo(() => {
        const currentAppVersion = localStorage.getItem('appVersion');
        return currentAppVersion === seenAppVersion;
    }, [seenAppVersion]);

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         if (!seenNewVersion) {
    //             setShowWhatsNew(true);
    //         }
    //     }, 3000);
    //
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ThemeSwitch />
                    <IconButton color="inherit" onClick={() => navigate('/mobile/faq')}>
                        <Tooltip title="Frequently Asked Questions">{menuItemById.faq.icon}</Tooltip>
                    </IconButton>
                    <Tooltip title="What's new">
                        <IconButton onClick={() => setShowWhatsNew(true)}>
                            <Badge color="secondary" variant="dot" invisible={seenNewVersion}>
                                <CampaignIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Join Tacticus Planner community on Discord">
                        <IconButton component={Link} to={discordInvitationLink} target={'_blank'}>
                            <DiscordIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Buy me a trooper">
                        <IconButton color="inherit" component={Link} to={bmcLink} target={'_blank'}>
                            <BmcIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <UserMenu />
            </div>

            {!isInstalled && showPwaInstall && (
                <AddToHomeScreen link={deviceLink} dismiss={() => setShowPwaInstall(false)} />
            )}
            <Home />

            <WhatsNewDialog isOpen={showWhatsNew} onClose={() => setShowWhatsNew(false)} />
        </div>
    );
};
