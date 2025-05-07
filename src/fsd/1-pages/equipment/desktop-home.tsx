import { Tooltip } from '@mui/material';
import React from 'react';

// eslint-disable-next-line import-x/no-internal-modules
import { StaticDataService } from 'src/services';
// eslint-disable-next-line import-x/no-internal-modules
import { FactionImage } from 'src/v2/components/images/faction-image';
// eslint-disable-next-line import-x/no-internal-modules
import { RarityImage } from 'src/v2/components/images/rarity-image';

import { Rarity } from '@/fsd/5-shared/model';

import { CharacterShardIcon } from '@/fsd/4-entities/character';

// const equipmentData = Object.values(StaticDataService.equipmentData).reduce((acc, unitData) => {}, {

// })

const ed = Object.values(StaticDataService.unitsData).reduce<{ [key: string]: string | object }>((acc, unitData) => {
    acc[unitData.faction] = acc[unitData.faction] || {};

    for (const equipment of [unitData.equipment1, unitData.equipment2, unitData.equipment3]) {
        const parsed = equipment === 'Defense' ? 'Defensive' : equipment;
        acc[unitData.faction][parsed] = acc[unitData.faction][parsed] || {};
        acc[unitData.faction][parsed][unitData.id] = unitData.icon;
    }
    return acc;
}, {});

function unitsForSlot(factions, slot) {
    const xx = factions.reduce((acc, faction) => {
        const units = ed[faction][slot];
        console.debug(units);
        if (typeof units !== 'undefined' && Object.keys(units).length > 0) {
            acc = { ...acc, ...units };
        }
        return acc;
    }, {});
    console.debug(xx);
    return xx;
}

export const DesktopHome = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Slot</th>
                    <th>Rarity</th>
                    <th>Factions</th>
                    <th>Characters</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(StaticDataService.equipmentData).map(([k, v]) => (
                    <tr key={k}>
                        <td>
                            {v.displayName}
                            {v.rarity > 0 && (
                                <>
                                    <br />({v.clazz})
                                </>
                            )}
                        </td>
                        <td>{v.slot}</td>
                        <td>
                            {/* {Rarity[v.rarity]} */}
                            <RarityImage rarity={v.rarity} />
                        </td>
                        <td>
                            {/* {v.factions.join(', ')} */}
                            {v.factions.map(faction => (
                                <Tooltip title={faction} key={faction}>
                                    <span>
                                        <FactionImage faction={faction} />
                                    </span>
                                </Tooltip>
                            ))}
                        </td>
                        {/* <td>{Object.keys(unitsForSlot(v.factions, v.slot)).join(', ')}</td> */}

                        {Object.entries(unitsForSlot(v.factions, v.slot)).map(([unit, icon]) => (
                            <Tooltip title={unit} key={unit}>
                                <span>
                                    <CharacterShardIcon icon={icon} name={unit} height={30} />
                                </span>
                            </Tooltip>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
