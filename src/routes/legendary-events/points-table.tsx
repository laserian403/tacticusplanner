﻿import React, { useContext, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { CellClassParams, ColDef, ColGroupDef, ICellRendererParams, ITooltipParams } from 'ag-grid-community';
import { ILegendaryEvent, ILegendaryEventTrack, ILreTeam } from 'src/models/interfaces';
import { Rank } from 'src/models/enums';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { sum, uniq } from 'lodash';
import { CharactersSelection, ITableRow } from './legendary-events.interfaces';
import { StoreContext } from 'src/reducers/store.provider';
import { CharacterTitle } from 'src/shared-components/character-title';
import { isMobile } from 'react-device-detect';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { RarityImage } from 'src/shared-components/rarity-image';
import { RankImage } from 'src/shared-components/rank-image';

const PointsTable = (props: { legendaryEvent: ILegendaryEvent }) => {
    const { legendaryEvent } = props;
    const { leSelectedTeams } = useContext(StoreContext);

    const { teams } = leSelectedTeams[legendaryEvent.id] ?? { teams: [] };

    const selectedChars = useMemo(() => {
        return uniq(teams.flatMap(t => t.charactersIds));
    }, [legendaryEvent.id]);

    const [selection, setSelection] = useState<CharactersSelection>(
        selectedChars.length ? CharactersSelection.Selected : CharactersSelection.All
    );
    const [filter, setFilter] = useState('');

    const gridRef = useRef<AgGridReact>(null);

    const columnsDef: Array<ColDef | ColGroupDef> = useMemo(() => {
        return [
            {
                headerName: 'Character',
                pinned: !isMobile,
                openByDefault: !isMobile,
                cellClass: (params: CellClassParams<ITableRow>) => params.data?.className,
                tooltipValueGetter: (params: ITooltipParams<ITableRow>) => params.data?.tooltip,
                children: [
                    {
                        headerName: 'Position',
                        field: 'position',
                        pinned: !isMobile,
                        maxWidth: 50,
                        width: 50,
                        minWidth: 50,
                        sortable: true,
                        sort: 'asc',
                    },
                    {
                        headerName: 'Name',
                        width: isMobile ? 75 : 180,
                        pinned: !isMobile,
                        cellRenderer: (props: ICellRendererParams<ITableRow>) => {
                            const character = props.data?.character;
                            if (character) {
                                return (
                                    <CharacterTitle
                                        character={character}
                                        hideName={isMobile}
                                        short={true}
                                        imageSize={30}
                                    />
                                );
                            }
                        },
                        cellClass: (params: CellClassParams<ITableRow>) => params.data?.className,
                        tooltipValueGetter: (params: ITooltipParams<ITableRow>) => params.data?.tooltip,
                    },
                    {
                        headerName: 'Rarity',
                        width: 80,
                        columnGroupShow: 'open',
                        pinned: !isMobile,
                        valueGetter: (props: ValueGetterParams<ITableRow>) => {
                            return props.data?.character.rarity;
                        },
                        cellRenderer: (props: ICellRendererParams<ITableRow>) => {
                            const rarity = props.value ?? 0;
                            return <RarityImage rarity={rarity} />;
                        },
                    },
                    {
                        headerName: 'Rank',
                        width: 80,
                        columnGroupShow: 'open',
                        pinned: !isMobile,
                        valueGetter: (props: ValueGetterParams<ITableRow>) => {
                            return props.data?.character.rank;
                        },
                        cellRenderer: (props: ICellRendererParams<ITableRow>) => {
                            const rank = props.value ?? 0;
                            return <RankImage rank={rank} />;
                        },
                    },
                ],
            },
            {
                headerName: 'Total',
                children: [
                    {
                        field: 'totalPoints',
                        headerName: 'Points',
                        width: 100,
                        sortable: true,
                    },
                    {
                        field: 'totalSlots',
                        headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                        width: 100,
                        sortable: true,
                    },
                ],
            },
            {
                headerName: legendaryEvent.alpha.name,
                children: [
                    {
                        field: 'alphaPoints',
                        headerName: 'Points',
                        width: 100,
                        sortable: true,
                    },
                    {
                        field: 'alphaSlots',
                        headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                        width: 100,
                        sortable: true,
                    },
                ],
            },
            {
                headerName: legendaryEvent.beta.name,
                children: [
                    {
                        field: 'betaPoints',
                        headerName: 'Points',
                        width: 100,
                        sortable: true,
                    },
                    {
                        field: 'betaSlots',
                        headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                        width: 100,
                        sortable: true,
                    },
                ],
            },
            {
                headerName: legendaryEvent.gamma.name,
                children: [
                    {
                        field: 'gammaPoints',
                        headerName: 'Points',
                        width: 100,
                        sortable: true,
                    },
                    {
                        field: 'gammaSlots',
                        headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                        width: 100,
                        sortable: true,
                    },
                ],
            },
        ];
    }, [selection]);

    const selectedCharsRows: ITableRow[] = useMemo(() => {
        const alpha = getPointsAndSlots(
            legendaryEvent.alpha,
            getRestrictionsByChar(teams.filter(t => t.section === 'alpha'))
        );
        const beta = getPointsAndSlots(
            legendaryEvent.beta,
            getRestrictionsByChar(teams.filter(t => t.section === 'beta'))
        );
        const gamma = getPointsAndSlots(
            legendaryEvent.gamma,
            getRestrictionsByChar(teams.filter(t => t.section === 'gamma'))
        );

        return legendaryEvent.allowedUnits
            .filter(x => selectedChars.includes(x.name))
            .sort((a, b) => {
                const aTotal =
                    (alpha[a.name]?.points ?? 0) + (beta[a.name]?.points ?? 0) + (gamma[a.name]?.points ?? 0);
                const bTotal =
                    (alpha[b.name]?.points ?? 0) + (beta[b.name]?.points ?? 0) + (gamma[b.name]?.points ?? 0);

                return bTotal - aTotal;
            })
            .filter(x => (filter ? x.name.toLowerCase().includes(filter.toLowerCase()) : true))
            .map((x, index) => ({
                character: x,
                position: index + 1,
                className: Rank[x.rank].toLowerCase(),
                tooltip: x.name + ' - ' + Rank[x.rank ?? 0],
                alphaPoints: alpha[x.name]?.points ?? 0,
                alphaSlots: alpha[x.name]?.slots ?? 0,
                betaPoints: beta[x.name]?.points ?? 0,
                betaSlots: beta[x.name]?.slots ?? 0,
                gammaPoints: gamma[x.name]?.points ?? 0,
                gammaSlots: gamma[x.name]?.slots ?? 0,
                totalPoints: (alpha[x.name]?.points ?? 0) + (beta[x.name]?.points ?? 0) + (gamma[x.name]?.points ?? 0),
                totalSlots: (alpha[x.name]?.slots ?? 0) + (beta[x.name]?.slots ?? 0) + (gamma[x.name]?.slots ?? 0),
            }));

        function getRestrictionsByChar(selectedTeams: ILreTeam[]): Record<string, string[]> {
            const result: Record<string, string[]> = {};

            for (const team of selectedTeams) {
                team.charactersIds.forEach(character => {
                    if (!result[character]) {
                        result[character] = [];
                    }
                    result[character] = uniq([...result[character], ...team.restrictionsIds]);
                });
            }
            return result;
        }

        function getPointsAndSlots(
            track: ILegendaryEventTrack,
            restrictionsByChar: Record<string, string[]>
        ): Record<
            string,
            {
                name: string;
                slots: number;
                points: number;
            }
        > {
            const result: Record<
                string,
                {
                    name: string;
                    slots: number;
                    points: number;
                }
            > = {};

            for (const key in restrictionsByChar) {
                const restrictions = restrictionsByChar[key];
                result[key] = {
                    name: key,
                    slots: restrictionsByChar[key].length,
                    points: sum(restrictions.map(x => track.getRestrictionPoints(x))),
                };
            }
            return result;
        }
    }, [legendaryEvent.id, filter]);

    const rows = useMemo<ITableRow[]>(() => {
        const chars =
            selection === 'all'
                ? legendaryEvent.allowedUnits
                : selection === 'unlocked'
                ? legendaryEvent.allowedUnits.filter(x => x.rank > Rank.Locked)
                : [];

        return chars
            .sort(
                (a, b) =>
                    b.legendaryEvents[legendaryEvent.id].totalPoints - a.legendaryEvents[legendaryEvent.id].totalPoints
            )
            .filter(x => (filter ? x.name.toLowerCase().includes(filter.toLowerCase()) : true))
            .map((x, index) => ({
                character: x,
                position: index + 1,
                className: Rank[x.rank].toLowerCase(),
                tooltip: x.name + ' - ' + Rank[x.rank ?? 0],
                alphaPoints: x.legendaryEvents[legendaryEvent.id].alphaPoints,
                alphaSlots: x.legendaryEvents[legendaryEvent.id].alphaSlots,

                betaPoints: x.legendaryEvents[legendaryEvent.id].betaPoints,
                betaSlots: x.legendaryEvents[legendaryEvent.id].betaSlots,

                gammaPoints: x.legendaryEvents[legendaryEvent.id].gammaPoints,
                gammaSlots: x.legendaryEvents[legendaryEvent.id].gammaSlots,

                totalPoints: x.legendaryEvents[legendaryEvent.id].totalPoints,
                totalSlots: x.legendaryEvents[legendaryEvent.id].totalSlots,
            }));
    }, [selection, filter]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <TextField
                    size="small"
                    sx={{ margin: '10px', width: '300px' }}
                    label="Quick Filter"
                    variant="outlined"
                    onChange={event => setFilter(event.target.value)}
                />
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label" style={{ fontWeight: 700 }}>
                        Characters Selection
                    </FormLabel>
                    <RadioGroup
                        style={{ display: 'flex', flexDirection: 'row' }}
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={selection}
                        onChange={(_, value) => setSelection(value as CharactersSelection)}
                        name="radio-buttons-group">
                        <FormControlLabel
                            value={CharactersSelection.Selected}
                            control={<Radio />}
                            label="Only selected"
                        />
                        <FormControlLabel
                            value={CharactersSelection.Unlocked}
                            control={<Radio />}
                            label="Only unlocked"
                        />
                        <FormControlLabel value={CharactersSelection.All} control={<Radio />} label="All" />
                    </RadioGroup>
                </FormControl>
                {selection !== CharactersSelection.Selected && (
                    <span>
                        Take this list with the grain of salt, not everyone who scores the most points is the best LRE
                        character
                    </span>
                )}
            </div>
            <div className="ag-theme-material" style={{ height: 'calc(100vh - 250px)', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    tooltipShowDelay={100}
                    rowData={selection === 'selected' ? selectedCharsRows : rows}
                    columnDefs={columnsDef}
                    onSortChanged={() => gridRef.current?.api?.refreshCells()}
                    onFilterChanged={() => gridRef.current?.api?.refreshCells()}></AgGridReact>
            </div>
        </div>
    );
};

export default PointsTable;
