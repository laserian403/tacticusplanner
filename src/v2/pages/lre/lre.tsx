﻿import React, { useContext } from 'react';
import { useLre } from 'src/v2/pages/lre/lre-hook';
import { LreSettings } from 'src/v2/features/lre/lre-settings';
import { Divider, Switch, Tab, Tabs } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import { DispatchContext, StoreContext } from 'src/reducers/store.provider';
import { LreSection } from 'src/v2/features/lre/lre.models';
import { LreSectionsSettings } from 'src/v2/features/lre/lre-sections-settings';
import { IAutoTeamsPreferences, ILreViewSettings } from 'src/models/interfaces';
import { isMobile } from 'react-device-detect';
import { LegendaryEvent } from 'src/routes/legendary-events/legendary-event';
import { LeProgress } from 'src/shared-components/le-progress';
import PointsTable from 'src/routes/legendary-events/points-table';
import { SetGoalDialog } from 'src/shared-components/goals/set-goal-dialog';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';

export const Lre: React.FC = () => {
    const { viewPreferences, autoTeamsPreferences, characters } = useContext(StoreContext);
    const dispatch = useContext(DispatchContext);
    const updatePreferencesOption = (setting: keyof ILreViewSettings, value: boolean) => {
        dispatch.viewPreferences({ type: 'Update', setting, value });
    };

    const updateSettings = (
        settings: ILreViewSettings,
        autoTeamsSettings: IAutoTeamsPreferences,
        recommendedFirst: string[],
        recommendedLast: string[]
    ) => {
        for (const setting in settings) {
            const value = settings[setting as keyof ILreViewSettings];
            dispatch.viewPreferences({ type: 'Update', setting: setting as keyof ILreViewSettings, value });
        }
        for (const setting in autoTeamsSettings) {
            const value = autoTeamsSettings[setting as keyof IAutoTeamsPreferences];
            dispatch.autoTeamsPreferences({ type: 'Update', setting: setting as keyof IAutoTeamsPreferences, value });
        }
        dispatch.characters({ type: 'UpdateBias', recommendedFirst, recommendedLast });
    };

    const updateView = (gridView: boolean): void => {
        dispatch.viewPreferences({ type: 'Update', setting: 'lreGridView', value: gridView });
    };

    const { legendaryEvent, section, showSettings, openSettings, closeSettings, changeTab } = useLre();

    const renderTabContent = () => {
        switch (section) {
            case LreSection.teams:
                return <LegendaryEvent legendaryEvent={legendaryEvent} />;
            case LreSection.progress:
                return <LeProgress legendaryEvent={legendaryEvent} />;
            case LreSection.leaderboard:
                return <PointsTable legendaryEvent={legendaryEvent} />;
            default:
                return <div>Default Content</div>;
        }
    };

    function toggleView() {
        updateView(!viewPreferences.lreGridView);
    }

    return (
        <>
            <div className="flex-box between wrap">
                <Tabs
                    value={section}
                    onChange={changeTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example">
                    <Tab label="Teams" value={LreSection.teams} />
                    <Tab label="My Progress" value={LreSection.progress} />
                    <Tab label="Leaderboard" value={LreSection.leaderboard} />
                </Tabs>
                {[LreSection.teams].includes(section) && (
                    <>
                        <LreSectionsSettings lreViewSettings={viewPreferences} save={updatePreferencesOption} />
                        {/*<Divider style={{ height: 42, margin: '0 10px' }} orientation={'vertical'} />*/}
                    </>
                )}

                {[LreSection.teams].includes(section) && (
                    <div className="flex-box gap10 wrap">
                        <div className="flex-box" onClick={toggleView}>
                            <TableRowsIcon color={!viewPreferences.lreGridView ? 'primary' : 'disabled'} />
                            <Switch checked={viewPreferences.lreGridView} />
                            <GridViewIcon color={viewPreferences.lreGridView ? 'primary' : 'disabled'} />
                        </div>
                        <Button size="small" variant="outlined" onClick={openSettings}>
                            {isMobile ? '' : 'Settings'} <SettingsIcon />
                        </Button>

                        <SetGoalDialog />
                    </div>
                )}
            </div>

            <div style={{ marginTop: 10 }}>{renderTabContent()}</div>

            {showSettings && (
                <LreSettings
                    onClose={closeSettings}
                    lreViewSettings={viewPreferences}
                    autoTeamsSettings={autoTeamsPreferences}
                    characters={characters}
                    save={updateSettings}
                />
            )}
        </>
    );
};
