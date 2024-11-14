﻿import { useTitle } from 'src/contexts/title.context';
import { useQueryState } from 'src/v2/hooks/query-state';
import { LegendaryEventEnum } from 'src/models/enums';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StaticDataService } from 'src/services';
import { LreSection } from 'src/v2/features/lre/lre.models';
import { getLegendaryEvent } from 'src/models/constants';
import { StoreContext } from 'src/reducers/store.provider';

export const useLre = () => {
    const { setHeaderTitle } = useTitle();
    const { characters } = useContext(StoreContext);
    const [legendaryEventId] = useQueryState<LegendaryEventEnum>(
        'character',
        initQueryParam =>
            initQueryParam
                ? (LegendaryEventEnum[initQueryParam as keyof typeof LegendaryEventEnum] as LegendaryEventEnum)
                : LegendaryEventEnum.Mephiston,
        value => LegendaryEventEnum[value]
    );

    const [section, setSection] = useQueryState<LreSection>(
        'section',
        initQueryParam => (initQueryParam ? +initQueryParam : LreSection.teams),
        value => value.toString()
    );

    const [showSettings, setShowSettings] = useState(false);

    const openSettings = () => setShowSettings(true);
    const closeSettings = () => setShowSettings(false);

    const changeTab = (_: React.SyntheticEvent, value: LreSection) => setSection(value);

    useEffect(() => {
        const relatedLre = StaticDataService.lreCharacters.find(x => x.lre!.id === legendaryEventId);
        if (relatedLre) {
            setHeaderTitle(
                relatedLre.lre!.finished
                    ? `${relatedLre.name} (Finished)`
                    : `${relatedLre.name} ${relatedLre.lre!.eventStage}/3 (${relatedLre.lre!.nextEventDate})`
            );
        }
    }, [legendaryEventId]);

    const legendaryEvent = useMemo(() => getLegendaryEvent(legendaryEventId, characters), [legendaryEventId]);

    return { legendaryEvent, section, showSettings, openSettings, closeSettings, changeTab };
};
