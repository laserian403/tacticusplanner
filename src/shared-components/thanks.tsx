﻿import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { StaticDataService } from '../services';
import { ContributorImage } from './contributor-image';
import { Link, useNavigate } from 'react-router-dom';
import { IContentCreator, IContributor, IYoutubeCreator } from '../models/interfaces';
import { BmcIcon } from 'src/shared-components/icons/bmc.icon';
import Button from '@mui/material/Button';
import { FlexBox } from 'src/v2/components/flex-box';
import axios from 'axios';

export const Thanks = ({ sliderMode }: { sliderMode?: boolean }) => {
    const [activeContributorIndex, setActiveContributorIndex] = useState<number>(0);
    const [hide, setHide] = useState<boolean>(false);
    const [contributorsList, setContributorsList] = useState<Array<IContributor | IContentCreator | IYoutubeCreator>>(
        []
    );

    const shuffleArray = (array: any[]): void => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    useEffect(() => {
        const api = axios.create({
            baseURL: 'https://tacticucplannerstorage.blob.core.windows.net',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        api({
            url: '/files/youtubeCreators.json',
            method: 'GET',
        })
            .then(data => {
                const lastContributor = StaticDataService.contentCreators[0];
                const allContributors: Array<IContributor | IContentCreator | IYoutubeCreator> = [
                    ...data.data,
                    ...StaticDataService.contributors,
                ];
                shuffleArray(allContributors);
                allContributors.unshift(lastContributor);
                setContributorsList(allContributors);
            })
            .catch(() => {
                const lastContributor = StaticDataService.contentCreators[0];
                const allContributors: Array<IContributor | IContentCreator | IYoutubeCreator> = [
                    ...StaticDataService.contentCreators.slice(1),
                    ...StaticDataService.contributors,
                ];
                shuffleArray(allContributors);
                allContributors.unshift(lastContributor);
                setContributorsList(allContributors);
            });
    }, []);

    useEffect(() => {
        if (!sliderMode || !contributorsList.length) {
            return;
        }
        setTimeout(() => {
            setHide(true);
        }, 3000);

        const intervalId = setInterval(() => {
            setHide(false);
            setTimeout(() => {
                setHide(true);
            }, 3000);

            setActiveContributorIndex(curr => {
                const increment = isMobile ? 1 : 3;
                const maxStep = isMobile ? 0 : 2;
                const nextContributorId = curr + increment;

                return nextContributorId + maxStep > contributorsList.length - 1 ? 0 : nextContributorId;
            });
        }, 4000);

        return () => clearInterval(intervalId);
    }, [contributorsList.length]);

    return contributorsList.length ? (
        <FlexBox style={{ flexDirection: 'column' }}>
            <Button style={{ textAlign: 'center' }} component={Link} to={isMobile ? '/mobile/ty' : '/ty'}>
                Thank you cards
            </Button>

            {sliderMode ? (
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: 400, gap: 10 }}>
                    {isMobile && <ThankYouCard contributor={contributorsList[activeContributorIndex]} hide={hide} />}
                    {!isMobile && (
                        <>
                            <ThankYouCard contributor={contributorsList[activeContributorIndex]} hide={hide} />
                            <ThankYouCard contributor={contributorsList[activeContributorIndex + 1]} hide={hide} />
                            <ThankYouCard contributor={contributorsList[activeContributorIndex + 2]} hide={hide} />
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                    {contributorsList.map(x => (
                        <ThankYouCard key={x.name} contributor={x} />
                    ))}
                </div>
            )}
        </FlexBox>
    ) : (
        <></>
    );
};

export const ThankYouCard = ({
    contributor,
    hide,
}: {
    contributor: IContributor | IContentCreator | IYoutubeCreator;
    hide?: boolean;
}) => {
    const navigate = useNavigate();
    return (
        <Card
            variant="outlined"
            onClick={() => navigate(isMobile ? '/mobile/ty' : '/ty')}
            sx={{
                opacity: hide ? 0 : 1,
                width: 350,
                height: 'fit-content',
                maxHeight: 400,
                cursor: 'pointer',
                transition: 'opacity 1s ease-in-out',
            }}>
            <CardHeader
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        {isContentMaker(contributor) ? (
                            <Link
                                to={contributor.youtubeLink}
                                target={'_blank'}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                onClick={event => event.stopPropagation()}>
                                <ContributorImage
                                    iconPath={contributor.avatarIcon}
                                    height={50}
                                    width={50}
                                    borderRadius={true}
                                />
                                {contributor.name}
                            </Link>
                        ) : !isYoutubeCreator(contributor) ? (
                            <>
                                {!!contributor.avatarIcon && (
                                    <ContributorImage
                                        iconPath={contributor.avatarIcon}
                                        height={50}
                                        width={50}
                                        borderRadius={true}
                                    />
                                )}
                                {!contributor.avatarIcon && <BmcIcon />}
                                {contributor.name}
                            </>
                        ) : (
                            <>
                                <img
                                    loading={'lazy'}
                                    style={{
                                        contentVisibility: 'auto',
                                        borderRadius: '50%',
                                    }}
                                    src={contributor.avatarLink}
                                    height={50}
                                    width={50}
                                    alt={contributor.name}
                                />
                                {contributor.name}
                            </>
                        )}
                    </div>
                }
                subheader={
                    isContentMaker(contributor)
                        ? 'Content creator'
                        : !isYoutubeCreator(contributor)
                          ? contributor.type
                          : ''
                }
            />
            <CardContent style={{ paddingTop: 0 }}>
                {isContentMaker(contributor) ? (
                    <>
                        <p>{contributor.thankYou}</p>
                        <Link
                            to={contributor.resourceLink}
                            style={{ display: 'block', width: '100%', textAlign: 'center' }}
                            target={'_blank'}
                            onClick={event => event.stopPropagation()}>
                            <ContributorImage
                                iconPath={contributor.resourceIcon}
                                height={200}
                                width={contributor.name.includes('Severyn') ? 200 : 320}
                            />
                        </Link>
                    </>
                ) : !isYoutubeCreator(contributor) ? (
                    <>
                        <p>{contributor.thankYou}</p>
                        {contributor.resourceLink ? (
                            <React.Fragment>
                                Check out{' '}
                                <Link
                                    to={contributor.resourceLink}
                                    target={'_blank'}
                                    onClick={event => event.stopPropagation()}>
                                    {contributor.resourceDescription}
                                </Link>
                            </React.Fragment>
                        ) : undefined}
                    </>
                ) : (
                    <>
                        <Link
                            to={`https://www.youtube.com/watch?v=${contributor.youtubeVideoId}`}
                            style={{ display: 'block', width: '100%', textAlign: 'center' }}
                            target={'_blank'}
                            onClick={event => event.stopPropagation()}>
                            <img
                                loading={'lazy'}
                                style={{
                                    contentVisibility: 'auto',
                                }}
                                src={`https://i3.ytimg.com/vi/${contributor.youtubeVideoId}/mqdefault.jpg`}
                                height={200}
                                width={320}
                                alt={contributor.name}
                            />
                        </Link>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

const isContentMaker = (
    contributor: IContentCreator | IContributor | IYoutubeCreator
): contributor is IContentCreator => {
    return Object.hasOwn(contributor, 'youtubeLink');
};

const isYoutubeCreator = (
    contributor: IContentCreator | IContributor | IYoutubeCreator
): contributor is IYoutubeCreator => {
    return Object.hasOwn(contributor, 'youtubeVideoId');
};
