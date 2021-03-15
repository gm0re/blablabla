import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Waveform from './Waveform';

const PlayButtonWrappper = styled.div`
  :hover {
    background-color: #00000038;
  }

  height: 48px;
  width: 48px;
  border-radius: 100%;
`;

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
}`;

const PlayButton = styled.button`
  width: 48px;
  height: 48px;
  outline: none;
  border: 0;
  padding: 0;
  background-color: transparent;
  background-repeat: no-repeat;
  cursor: pointer;
}`;

const AudioTime = styled.div`
  display: flex;
  align-items: center;
  cursor: default;
}`

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin: 4px;
  line-height: 18px;
`;

const PlayerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: row;
  margin: 4px;
  line-height: 18px;
`;

const PLAYER_STATES = {
  paused: 'paused',
  playing: 'playing'
};

const PLAYER_DURATION_LABEL = '00:00 / 00:00';

const Player = ({
  header,
  playButton,
  recording
}) => {
  const playerRef = useRef(null);
  const [audioTime, setAudioTime] = useState(PLAYER_DURATION_LABEL);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.paused);
  const [audioSamples, setAudioSamples] = useState([]);

  let { current: player } = playerRef;

  const fixPlayerDuration = () => {
    if (player.duration !== Infinity) {
      player.currentTime = 0;
    }
  };

  // weird stuff to get audio duration on chrome
  const setPlayerDuration = () => {
    player.addEventListener('durationchange', fixPlayerDuration, false);
    // fake big time
    player.currentTime = 24 * 60 * 60;
  };

  const getFormattedTime = secs => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const minutesLabel = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsLabel = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutesLabel}:${secondsLabel}`;
  };

  const playAudio = () => {
    if (playerState === PLAYER_STATES.playing) {
      player.pause();
      setPlayerState(PLAYER_STATES.paused);
      // Show pause btn
    } else {
      player.play();
      setPlayerState(PLAYER_STATES.playing);
      // Show play btn
    }
  };

  const onTimeUpdate = () => {
    setAudioTime(`${getFormattedTime(player.currentTime)} / ${getFormattedTime(player.duration)}`);
  };

  const fetchAudioSamples = () => {
    fetch(`http://localhost:1337/${recording.filename}.json`)
      .then(recordingSamplesRaw => recordingSamplesRaw.json())
      .then(recordingSamples => {
        setAudioSamples(recordingSamples.data)
      })
      .catch(error => {
        console.error(error)
      });
  };

  const removeListenersOnUnmount = () => {
    player.removeEventListener('timeupdate', onTimeUpdate);
    player.removeEventListener('durationchange', fixPlayerDuration);
  };

  useEffect(() => {
    fetchAudioSamples();

    player = playerRef.current;

    player.addEventListener('timeupdate', onTimeUpdate);

    setPlayerDuration();

    return removeListenersOnUnmount;
  }, [playerRef, setAudioSamples]);

  return (
    <PlayerWrapper>
      <audio
        src={`http://localhost:1337/${recording.filepath}`}
        type={recording.filetype}
        ref={playerRef}
      />
      <PlayerHeader>
        {header}
        <AudioTime>{audioTime}</AudioTime>
      </PlayerHeader>
      <PlayerContent onClick={e => e.stopPropagation()}>
        <PlayButtonWrappper>
          <PlayButton onClick={playAudio}>{playButton}</PlayButton>
        </PlayButtonWrappper>
        {audioSamples.length && (
          <Waveform
            audioSamples={recording.samples?.length
              ? recording.samples
              : audioSamples}
            playerRef={playerRef}
          />
        )}
      </PlayerContent>
    </PlayerWrapper>
  );
};

Player.propTypes = {
  header: PropTypes.node,
  playButton: PropTypes.node,
  recording: PropTypes.shape({
    filename: PropTypes.string,
    filepath: PropTypes.string,
    filetype: PropTypes.string,
    samples: PropTypes.array
  })
};

export default Player;
