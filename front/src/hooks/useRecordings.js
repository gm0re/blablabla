import { useState } from 'react';

import recordingsSvc from '../services/recordings';
import userSvc from '../services/user';

const RECORDINGS_PER_PAGE = 10;

const useRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [recordingsDictionary, setRecordingsDictionary] = useState({});
  const [recordingsCreatedCount, setRecordingsCreatedCount] = useState(0);
  const [isLastPageReached, setIsLastPageReached] = useState(false);

  const sortRecordings = (recA, recB) => ((recA.createdAt > recB.createdAt) ? -1 : 1);

  const recordingsDictReducer = (newRecsDict, recording) => ({
    ...newRecsDict,
    [recording.id]: recording
  });

  const fetchRecordings = async (filters, page = 0, sorting = undefined, refresh = true) => {
    if (refresh || !isLastPageReached) {
      const nextPage = RECORDINGS_PER_PAGE * page;

      const newRecordings = await recordingsSvc.get(RECORDINGS_PER_PAGE, nextPage, filters, sorting);

      if (newRecordings.length) {
        const shouldResetRecsDictionary = refresh ? {} : { ...recordingsDictionary };
        const newRecsDictionary = newRecordings.reduce(recordingsDictReducer, shouldResetRecsDictionary);

        setRecordingsDictionary(() => newRecsDictionary);
        setRecordings(() => Object.values(newRecsDictionary).sort(sortRecordings));
      }

      // 🧯 sailsjs blueprint api does not return pages
      if (newRecordings.length !== RECORDINGS_PER_PAGE) {
        setIsLastPageReached(true);
      }
    }
  };

  const attachUserToRecording = recording => ({
    ...recording,
    user: userSvc.get()
  });

  const setNewRecording = async ({ data: blob }) => {
    const filename = URL.createObjectURL(blob);
    const { size: filesize, type: filetype } = blob;

    const newRecording = {
      duration: 0,
      filename,
      filesize,
      filetype,
      user: 1
    };

    const recording = attachUserToRecording(await recordingsSvc.save(newRecording));

    setRecordingsCreatedCount(oldRecordingsCreatedCount => oldRecordingsCreatedCount + 1);
    setRecordingsDictionary(oldRecsDictionary => ({
      [recording[recording.id]]: recording,
      ...oldRecsDictionary
    }));
    setRecordings(oldRecordings => [
      recording,
      ...oldRecordings
    ]);
  };

  return [
    fetchRecordings,
    isLastPageReached,
    recordings,
    recordingsCreatedCount,
    setNewRecording
  ];
};

export default useRecordings;