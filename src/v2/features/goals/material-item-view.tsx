﻿import React from 'react';

import { CampaignLocation } from '@/fsd/4-entities/campaign/campaign-location';

import { IUpgradeRaid } from 'src/v2/features/goals/goals.models';
import { MaterialItemTitle } from 'src/v2/features/goals/material-item-title';

interface Props {
    upgradeRaid: IUpgradeRaid;
}

export const MaterialItemView: React.FC<Props> = ({ upgradeRaid }) => {
    return (
        <div style={{ opacity: upgradeRaid.isBlocked ? 0.5 : 1 }}>
            <MaterialItemTitle upgradeRaid={upgradeRaid} />
            <ul style={{ paddingInlineStart: 15 }}>
                {upgradeRaid.raidLocations.map(location => {
                    return (
                        <li
                            key={location.id}
                            className="flex-box gap5"
                            style={{
                                justifyContent: 'space-between',
                            }}>
                            <CampaignLocation location={location} unlocked={true} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
