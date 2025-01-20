﻿import { SetStateAction } from '../models/interfaces';
import { IMow, IMowDb } from 'src/v2/features/characters/characters.models';
import { rarityToStars } from 'src/models/constants';

export type MowsAction =
    | {
          type: 'Update';
          mow: IMowDb;
      }
    | {
          type: 'UpdateAbilities';
          mowId: string;
          abilities: [primary: number, secondary: number];
      }
    | {
          type: 'SyncWithTacticus';
          mows: IMowDb[];
      }
    | SetStateAction<IMow[]>;

export const mowsReducer = (state: IMow[], action: MowsAction) => {
    switch (action.type) {
        case 'Set': {
            return action.value;
        }
        case 'Update': {
            const { mow } = action;
            const existingMowIndex = state.findIndex(x => x.id === mow.id);
            const existingMow = state[existingMowIndex];

            if (!existingMow) {
                return state;
            }
            const rarityStars = rarityToStars[mow.rarity];

            state[existingMowIndex] = {
                ...existingMow,
                ...mow,
                stars: mow.stars <= rarityStars ? rarityStars : mow.stars,
            };

            return [...state];
        }
        case 'SyncWithTacticus': {
            const { mows } = action;

            for (const mow of mows) {
                const existingMowIndex = state.findIndex(x => x.id === mow.id);
                const existingMow = state[existingMowIndex];

                if (!existingMow) {
                    continue;
                }
                state[existingMowIndex] = {
                    ...existingMow,
                    unlocked: mow.unlocked,
                    rarity: mow.rarity,
                    stars: mow.stars,
                    primaryAbilityLevel: mow.primaryAbilityLevel,
                    secondaryAbilityLevel: mow.secondaryAbilityLevel,
                    shards: mow.shards,
                };
            }

            return [...state];
        }
        case 'UpdateAbilities': {
            const { mowId, abilities } = action;
            const existingMowIndex = state.findIndex(x => x.id === mowId);
            const existingMow = state[existingMowIndex];

            if (!existingMow) {
                return state;
            }

            state[existingMowIndex] = {
                ...existingMow,
                primaryAbilityLevel: abilities[0],
                secondaryAbilityLevel: abilities[1],
            };

            return [...state];
        }
        default: {
            throw new Error();
        }
    }
};
