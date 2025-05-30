﻿import { Card, CardContent, CardHeader } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { menuItemById } from 'src/models/menu-items';

import { UnitShardIcon } from '@/fsd/5-shared/ui/icons';

import { CharactersService } from '@/fsd/4-entities/character';
import { LegendaryEventEnum } from '@/fsd/4-entities/lre';

export const PlanLeRoutes = () => {
    const navigate = useNavigate();
    const leMasterTableMenuItem = menuItemById['leMasterTable'];
    return (
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column', alignItems: 'center' }}>
            <Card
                variant="outlined"
                onClick={() => navigate(leMasterTableMenuItem.routeMobile)}
                sx={{
                    width: 350,
                    minHeight: 140,
                }}>
                <CardHeader
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {leMasterTableMenuItem.icon} {leMasterTableMenuItem.label}
                        </div>
                    }
                />
            </Card>

            {CharactersService.lreCharacters.map(le => {
                const isFinished = !!le.lre?.finished;
                return (
                    <Card
                        variant="outlined"
                        key={le.name}
                        onClick={() => navigate(`/mobile/plan/lre?character=${LegendaryEventEnum[le.lre!.id]}`)}
                        sx={{
                            width: 350,
                            minHeight: 140,
                            opacity: isFinished ? 0.5 : 1,
                        }}>
                        <CardHeader
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <UnitShardIcon icon={le.icon} name={le.name} /> {le.name}
                                </div>
                            }
                            subheader={'Legendary Event'}
                        />
                        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                            {isFinished ? (
                                <span>Finished</span>
                            ) : (
                                <>
                                    <span>Stage: {le.lre?.eventStage}/3</span>
                                    <span>Next event: {le.lre?.nextEventDate}</span>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
