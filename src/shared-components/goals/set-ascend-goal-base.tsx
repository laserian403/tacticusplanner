import React from 'react';

import { CampaignsLocationsUsage } from 'src/models/enums';
import { ICampaignBattleComposed, IPersonalGoal } from 'src/models/interfaces';
import { CampaignsUsageSelect } from 'src/shared-components/goals/campaigns-usage-select';
import { NumbersInput } from 'src/shared-components/goals/numbers-input';

import { Rarity, RarityStars } from '@/fsd/5-shared/model';
import { RaritySelect, StarsSelect } from '@/fsd/5-shared/ui';

import { CampaignLocation } from '@/fsd/4-entities/campaign/campaign-location';

interface AscendGoalBaseProps {
    currentRarity: Rarity;
    targetRarity: Rarity;
    currentStars: RarityStars;
    targetStars: RarityStars;
    possibleLocations: ICampaignBattleComposed[];
    unlockedLocations: string[];
    campaignsUsage: CampaignsLocationsUsage;

    rarityValues: Rarity[];
    starsValues: RarityStars[];
    shardsPerTokenValue: number;
    shardsInputConfig: {
        title: string;
        helperText: string;
        noLocationsHelperText: string;
    };

    onChange: (key: keyof IPersonalGoal, value: number) => void;
    onRarityChange: (rarity: Rarity) => void;
}

export const AscendGoalBase: React.FC<AscendGoalBaseProps> = ({
    targetStars,
    targetRarity,
    possibleLocations,
    unlockedLocations,
    campaignsUsage,
    rarityValues,
    starsValues,
    shardsPerTokenValue,
    shardsInputConfig,
    onChange,
    onRarityChange,
}) => {
    return (
        <>
            <div className="flex gap-3 items-center">
                <RaritySelect
                    label={'Target Rarity'}
                    rarityValues={rarityValues}
                    value={targetRarity}
                    valueChanges={onRarityChange}
                />

                <StarsSelect
                    label={'Target stars'}
                    starsValues={starsValues}
                    value={targetStars}
                    valueChanges={value => onChange('targetStars', value)}
                />
            </div>

            <div className="flex-box gap5 wrap">
                {possibleLocations.map(location => (
                    <CampaignLocation
                        key={location.id}
                        location={location}
                        unlocked={unlockedLocations.includes(location.id)}
                    />
                ))}
            </div>

            {!!possibleLocations.length && (
                <div className="flex gap-3 items-center">
                    <div style={{ width: '50%' }}>
                        <CampaignsUsageSelect
                            disabled={!unlockedLocations.length}
                            value={campaignsUsage ?? CampaignsLocationsUsage.LeastEnergy}
                            valueChange={value => onChange('campaignsUsage', value)}
                        />
                    </div>
                    <div style={{ width: '50%' }}>
                        <NumbersInput
                            title={shardsInputConfig.title}
                            helperText={shardsInputConfig.helperText}
                            value={shardsPerTokenValue}
                            valueChange={value => onChange('shardsPerToken', value)}
                        />
                    </div>
                </div>
            )}

            {!possibleLocations.length && (
                <div className="flex-box gap10 full-width">
                    <NumbersInput
                        title={shardsInputConfig.title}
                        helperText={shardsInputConfig.noLocationsHelperText}
                        value={shardsPerTokenValue}
                        valueChange={value => onChange('shardsPerToken', value)}
                    />
                </div>
            )}
        </>
    );
};
