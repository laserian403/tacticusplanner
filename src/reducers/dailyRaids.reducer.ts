﻿import { TacticusCampaignProgress } from '@/fsd/5-shared/lib/tacticus-api/tacticus-api.models';

import { Campaign, CampaignsService, ICampaingsFilters } from '@/fsd/4-entities/campaign';
import { campaignEventsLocations } from '@/fsd/4-entities/campaign/campaigns.constants';

import { IItemRaidLocation } from 'src/v2/features/goals/goals.models';

import { defaultData, idToCampaign } from '../models/constants';
import { IDailyRaids, SetStateAction } from '../models/interfaces';

export type DailyRaidsAction =
    | {
          type: 'AddCompletedBattle';
          location: IItemRaidLocation;
      }
    | {
          type: 'ResetCompletedBattles';
      }
    | {
          type: 'ResetCompletedBattlesDaily';
      }
    | {
          type: 'UpdateFilters';
          value: ICampaingsFilters;
      }
    | {
          type: 'SyncWithTacticus';
          progress: TacticusCampaignProgress[];
      }
    | SetStateAction<IDailyRaids>;

export const dailyRaidsReducer = (state: IDailyRaids, action: DailyRaidsAction): IDailyRaids => {
    switch (action.type) {
        case 'Set': {
            return action.value ?? defaultData.dailyRaids;
        }
        case 'AddCompletedBattle': {
            const battleIndex = state.raidedLocations.findIndex(x => x.id === action.location.id);
            if (battleIndex >= 0) {
                const raidedLocations = [...state.raidedLocations];
                const finalCount = raidedLocations[battleIndex].raidsCount + action.location.raidsCount;
                raidedLocations[battleIndex] = {
                    ...raidedLocations[battleIndex],
                    raidsCount: finalCount,
                    isCompleted: finalCount === action.location.dailyBattleCount,
                };
                return {
                    ...state,
                    raidedLocations,
                };
            }

            return {
                ...state,
                raidedLocations: [...state.raidedLocations, action.location],
            };
        }
        case 'SyncWithTacticus': {
            // Workaround to not reset CE data automatically
            const raidedLocations: IItemRaidLocation[] = state.raidedLocations.filter(x =>
                campaignEventsLocations.includes(x.campaign)
            );

            for (const campaign of action.progress) {
                const completedBattles = campaign.battles.filter(battle => battle.attemptsUsed !== 0);
                if (completedBattles.length > 0) {
                    const campaignName = idToCampaign[campaign.id];
                    const campaignShortId = Object.keys(Campaign).find(
                        key => Campaign[key as keyof typeof Campaign] === campaignName
                    );
                    if (campaignShortId) {
                        for (const battle of completedBattles) {
                            const campaignComposed =
                                CampaignsService.campaignsComposed[campaignShortId + (battle.battleIndex + 1)];
                            raidedLocations.push({
                                ...campaignComposed,
                                raidsCount: battle.attemptsUsed,
                                energySpent: battle.attemptsUsed * campaignComposed.energyCost,
                                farmedItems: battle.attemptsUsed * campaignComposed.dropRate,
                                isShardsLocation: false,
                                isCompleted: battle.attemptsLeft < battle.attemptsUsed,
                            });
                        }
                    }
                }
            }

            return { ...state, raidedLocations };
        }
        case 'ResetCompletedBattles': {
            return { ...state, raidedLocations: [] };
        }
        case 'ResetCompletedBattlesDaily': {
            return {
                ...state,
                raidedLocations: [],
                lastRefreshDateUTC: new Date().toUTCString(),
            };
        }
        case 'UpdateFilters': {
            const { value } = action;
            return {
                ...state,
                filters: value,
            };
        }
        default: {
            throw new Error();
        }
    }
};
