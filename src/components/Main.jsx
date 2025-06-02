import React, { useState } from 'react';
import { regionData } from './regionData';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const Main = () => {
    const [embedType, setEmbedType] = useState(''); // 'twitter' or 'youtube'
    const [embedId, setEmbedId] = useState('');
    const [clickIndexMap, setClickIndexMap] = useState({});

    const handleClick = (rounds, regionKey) => {
        console.log(rounds)
        let currentIndex = clickIndexMap[regionKey] || 0;
        let nextIndex = currentIndex;

        for (let i = 0; i < rounds.length; i++) {
            const idx = (currentIndex + i) % rounds.length;
            const candidate = rounds[idx];

            if (!candidate.url) continue;

            if (candidate.url.includes('status/')) {
                const match = candidate.url.match(/status\/(\d+)/);
                if (match) {
                    setEmbedType('x');
                    setEmbedId(match[1]);
                    nextIndex = (idx + 1) % rounds.length;
                    break;
                }
            } else if (candidate.url.includes('youtu')) {
                const match = candidate.url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
                if (match) {
                    setEmbedType('youtube');
                    setEmbedId(match[1]);
                    nextIndex = (idx + 1) % rounds.length;
                    break;
                }
            }
        }

        setClickIndexMap(prev => ({
            ...prev,
            [regionKey]: nextIndex,
        }));
    };

    const renderRegion = (regionArray, regionKey) => (
        regionArray.map((item, key) => (
            <div
                className={`img-wrapper ${item.class ? item.class : ''}`}
                key={key}
                onClick={() => handleClick(item.rounds, `${regionKey}-${key}`)}
            >
                <img src={item.image} alt={item.name} />
            </div>
        ))
    );

    return (
        <div className='Main_wrap'>
            <div className="box">
                <div className="first">
                    {renderRegion(regionData.top, 'top')}
                </div>

                <div className="center">
                    <div className="left">
                        {renderRegion(regionData.left, 'left')}
                    </div>

                    <div className="twitter-embed">
                        {embedType === 'x' && embedId && (
                            <TwitterTweetEmbed key={embedId} tweetId={embedId} />
                        )}
                        {embedType === 'youtube' && embedId && (
                            <iframe
                                key={embedId}
                                width="100%"
                                height="550"
                                src={`https://www.youtube.com/embed/${embedId}`}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>

                    <div className="right">
                        {renderRegion(regionData.right, 'right')}
                    </div>
                </div>

                <div className="bottom">
                    {renderRegion(regionData.bottom, 'bottom')}
                </div>
            </div>
        </div>
    );
};

export default Main;
