﻿import { Tooltip } from '@mui/material';
import { orderBy } from 'lodash';
import React, { useContext } from 'react';

import { charsUnlockShards } from 'src/models/constants';
import { CharacterPortraitImage } from 'src/v2/components/images/character-portrait.image';
import { MiscIcon } from 'src/v2/components/images/misc-image';
import { RarityImage } from 'src/v2/components/images/rarity-image';
import { StarsImage } from 'src/v2/components/images/stars-image';
import { AccessibleTooltip } from 'src/v2/components/tooltip';
import { numberToThousandsStringOld } from 'src/v2/functions/number-to-thousands-string';

import { Conditional } from '@/fsd/5-shared/ui';

import { CharactersPowerService } from 'src/v2/features/characters/characters-power.service';
import { CharactersViewContext } from 'src/v2/features/characters/characters-view.context';
import { IMow } from 'src/v2/features/characters/characters.models';

import './character-tile.css';

interface Props {
    mow: IMow;
    onClick?: (mow: IMow) => void;
    disableClick?: boolean;
}

export const MowTile: React.FC<Props> = ({ mow, disableClick, onClick }) => {
    const viewContext = useContext(CharactersViewContext);

    const unlockShards = charsUnlockShards[mow.rarity];
    const unlockProgress = (mow.shards / unlockShards) * 100;
    const hasAbilities = mow.unlocked && (mow.primaryAbilityLevel || mow.secondaryAbilityLevel);

    return (
        <div
            className="character-tile"
            style={{
                opacity: viewContext.getOpacity ? viewContext.getOpacity(mow) : mow.unlocked ? 1 : 0.5,
                cursor: onClick && !disableClick ? 'pointer' : undefined,
            }}
            onClick={onClick && !disableClick ? () => onClick!(mow) : undefined}>
            <StarsImage stars={mow.stars} />
            <div>
                <Tooltip
                    placement={'top'}
                    title={
                        <span>
                            {mow.name}
                            <br />
                            Power: {numberToThousandsStringOld(CharactersPowerService.getCharacterAbilityPower(mow))}
                        </span>
                    }>
                    <div>
                        <CharacterPortraitImage icon={mow.portraitIcon} />
                    </div>
                </Tooltip>

                <div
                    className="abilities"
                    style={{ visibility: hasAbilities && viewContext.showAbilitiesLevel ? 'visible' : 'hidden' }}>
                    <div className="ability-level">{mow.primaryAbilityLevel}</div>
                    <div className="ability-level">{mow.secondaryAbilityLevel}</div>
                </div>
                <Conditional condition={viewContext.showCharacterLevel}>
                    {mow.unlocked ? (
                        <div className="character-level">{mow.shards}</div>
                    ) : (
                        <div
                            className="character-level"
                            style={{
                                background: `linear-gradient(to right, green ${unlockProgress}%, #012A41 ${unlockProgress}%)`,
                            }}>
                            {`${mow.shards}/${unlockShards}`}
                        </div>
                    )}
                </Conditional>
            </div>
            <div className="character-rarity-rank">
                {viewContext.showCharacterRarity && <RarityImage rarity={mow.rarity} />}
                <MiscIcon icon={'mow'} width={22} height={25} />
            </div>
            {!!mow.numberOfUnlocked && (
                <AccessibleTooltip
                    title={
                        !mow.statsByOwner?.length ? (
                            `${mow.numberOfUnlocked}% of players unlocked this MoW`
                        ) : (
                            <div>
                                ${mow.numberOfUnlocked}% of players unlocked this MoW:
                                <ul>
                                    {orderBy(
                                        mow.statsByOwner,
                                        x => x.primaryAbilityLevel + x.secondaryAbilityLevel
                                    ).map(x => (
                                        <li key={x.owner}>
                                            {x.owner} P{x.primaryAbilityLevel} S{x.secondaryAbilityLevel}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }>
                    <div
                        className="character-unlock"
                        style={{
                            background: `linear-gradient(to right, green ${mow.numberOfUnlocked}%, #012A41 ${mow.numberOfUnlocked}%)`,
                        }}>
                        {`${mow.numberOfUnlocked}%`}
                    </div>
                </AccessibleTooltip>
            )}
        </div>
    );
};
