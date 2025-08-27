import React, { useMemo } from 'react';

import { CampaignsLocationsUsage } from 'src/models/enums';
import { ICampaignBattleComposed, IPersonalGoal } from 'src/models/interfaces';

import { getEnumValues } from '@/fsd/5-shared/lib';
import { Rarity, RarityStars } from '@/fsd/5-shared/model';

import { AscendGoalBase } from './set-ascend-goal-base';

interface Props {
    currentRarity: Rarity;
    currentStars: RarityStars;
    targetStars: RarityStars;
    possibleLocations: ICampaignBattleComposed[];
    unlockedLocations: string[];
    campaignsUsage: CampaignsLocationsUsage;
    shardsPerToken: number;
    onChange: (key: keyof IPersonalGoal, value: number) => void;
}

export const SetAscendMythicGoal: React.FC<Props> = ({
    currentRarity,
    currentStars,
    targetStars,
    possibleLocations,
    unlockedLocations,
    campaignsUsage,
    shardsPerToken,
    onChange,
}) => {
    const rarityValues = [Rarity.Mythic];

    const starsValues = useMemo(() => {
        return getEnumValues(RarityStars).filter(x => x >= RarityStars.OneBlueStar && x <= RarityStars.MythicWings);
    }, []);

    // Rarity is always Mythic, this no-op is to satisfy the interface of the base component
    const handleRarityChange = () => {};

    return (
        <AscendGoalBase
            currentRarity={currentRarity}
            targetRarity={Rarity.Mythic}
            currentStars={currentStars}
            targetStars={targetStars}
            possibleLocations={possibleLocations}
            unlockedLocations={unlockedLocations}
            campaignsUsage={campaignsUsage}
            rarityValues={rarityValues}
            starsValues={starsValues}
            shardsPerTokenValue={shardsPerToken}
            shardsInputConfig={{
                title: 'Mythic shards per onslaught',
                helperText: 'Put 0 to ignore Onslaught raids',
                noLocationsHelperText: 'You should put more than 0 mythic shards to be able to create the goal',
            }}
            onChange={onChange}
            onRarityChange={handleRarityChange}
        />
    );
};
