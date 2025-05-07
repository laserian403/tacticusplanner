﻿import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Switch } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { rarityToMaxStars, rarityToStars } from 'src/models/constants';
import { RaritySelect } from 'src/shared-components/rarity-select';
import { StarsSelect } from 'src/shared-components/stars-select';
import { getEnumValues } from 'src/shared-logic/functions';
import { RarityImage } from 'src/v2/components/images/rarity-image';
import { NumberInput } from 'src/v2/components/inputs/number-input';

import { RarityStars, Rarity } from '@/fsd/5-shared/model';
import { MiscIcon } from '@/fsd/5-shared/ui/icons';

import { CharacterShardIcon } from '@/fsd/4-entities/character';

import { IMow } from 'src/v2/features/characters/characters.models';
import { MowUpgrades } from 'src/v2/features/characters/components/mow-upgrades';
import { MowUpgradesUpdate } from 'src/v2/features/characters/components/mow-upgrades-update';

interface Props {
    mow: IMow;
    saveChanges: (mow: IMow) => void;
    isOpen: boolean;
    onClose: () => void;
    showNextUnit?: (mow: IMow) => void;
    showPreviousUnit?: (mow: IMow) => void;
    inventory: Record<string, number>;
    inventoryUpdate: (value: Record<string, number>) => void;
}

export const EditMowDialog: React.FC<Props> = ({
    mow,
    saveChanges,
    onClose,
    isOpen,
    showPreviousUnit,
    showNextUnit,
    inventory,
    inventoryUpdate,
}) => {
    const [editedMow, setEditedMow] = useState(() => ({ ...mow }));

    const starsEntries = useMemo(() => {
        const minStars = rarityToStars[editedMow.rarity];
        const maxStars = rarityToMaxStars[editedMow.rarity];

        return getEnumValues(RarityStars).filter(x => x >= minStars && x <= maxStars);
    }, [editedMow.rarity]);

    const rarityEntries: number[] = getEnumValues(Rarity);

    const handleInputChange = (name: keyof IMow, value: boolean | number) => {
        setEditedMow(curr => ({
            ...curr,
            [name]: value,
        }));
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth fullScreen={isMobile}>
            <DialogTitle className="flex-box between">
                {showPreviousUnit && (
                    <IconButton onClick={() => showPreviousUnit(editedMow)}>
                        <ArrowBack />
                    </IconButton>
                )}
                <div className="flex-box gap10">
                    <CharacterShardIcon icon={mow.badgeIcon} />
                    <span>{mow.name}</span>
                    <RarityImage rarity={mow.rarity} />
                    <MiscIcon icon={'mow'} width={22} height={25} />
                </div>
                {showNextUnit && (
                    <IconButton onClick={() => showNextUnit(editedMow)}>
                        <ArrowForward />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20, minHeight: 200 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <RaritySelect
                            label="Rarity"
                            rarityValues={rarityEntries}
                            value={editedMow.rarity}
                            valueChanges={value => handleInputChange('rarity', value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <StarsSelect
                            label="Stars"
                            starsValues={starsEntries}
                            value={editedMow.stars}
                            valueChanges={value => handleInputChange('stars', value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControlLabel
                            label="Unlocked"
                            control={
                                <Switch
                                    checked={editedMow.unlocked}
                                    onChange={event => handleInputChange('unlocked', event.target.checked)}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <NumberInput
                            fullWidth
                            label="Shards"
                            max={1000}
                            value={editedMow.shards}
                            valueChange={value => handleInputChange('shards', value)}
                        />
                    </Grid>

                    {editedMow.unlocked && (
                        <>
                            <Grid item xs={6}>
                                <NumberInput
                                    fullWidth
                                    label="Primary Ability"
                                    value={editedMow.primaryAbilityLevel}
                                    valueChange={value => handleInputChange('primaryAbilityLevel', value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <NumberInput
                                    fullWidth
                                    label="Secondary Ability"
                                    value={editedMow.secondaryAbilityLevel}
                                    valueChange={value => handleInputChange('secondaryAbilityLevel', value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MowUpgrades
                                    mowId={editedMow.id}
                                    alliance={editedMow.alliance}
                                    primaryLevel={editedMow.primaryAbilityLevel}
                                    secondaryLevel={editedMow.secondaryAbilityLevel}
                                />
                                <MowUpgradesUpdate
                                    mowId={editedMow.id}
                                    inventory={inventory}
                                    currPrimaryLevel={editedMow.primaryAbilityLevel}
                                    currSecondaryLevel={editedMow.secondaryAbilityLevel}
                                    originalPrimaryLevel={mow.primaryAbilityLevel}
                                    originalSecondaryLevel={mow.secondaryAbilityLevel}
                                    inventoryDecrement={inventoryUpdate}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="success" onClick={() => saveChanges(editedMow)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
