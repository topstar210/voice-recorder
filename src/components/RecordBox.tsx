import { useContext } from 'react';

import { RecordsContext } from '../contexts/RecordsContext';

import { RecordTimer } from './RecordTimer';
import { SaveRecordModal } from './SaveRecordModal';

import iconPlay from '../assets/images/icons/play-circle.svg';
import iconStop from '../assets/images/icons/stop.svg';
import iconPause from '../assets/images/icons/pause-24.png';
import iconResume from '../assets/images/icons/play-32.png';

export function RecordBox() {
	const {
		isRecordingAuthorized,
		isRecording,
		isPause,
		isRecordingFinished,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording
	} = useContext(RecordsContext);

	return (
		<div className="flex flex-col justify-center items-center p-16 bg-white dark:bg-text rounded-custom shadow-lg text-center">
			<h1 className="uppercase text-text dark:text-gray-50 mb-10 text-4xl font-bold tracking-wider font-serif">
				{isRecording ? 'Recording' : 'Record'}
			</h1>

			{isRecordingAuthorized ? (
				<>
					{isRecording ? (
						<>
							<RecordTimer />

							<div className=" flex items-center justify-center">
								<button
									type="button"
									className="flex items-center justify-center mx-2 bg-button-red text-white uppercase py-3.5 px-12 rounded-custom text-center font-mono transition-opacity duration-300 hover:opacity-75"
									onClick={isPause ? resumeRecording : pauseRecording}
								>
									{isPause ? "Resume" : "Pause"}
									{isPause ?
										<img src={iconResume} alt="Resume" width={16} className="ml-2.5" />
										:
										<img src={iconPause} alt="Pause" width={16} className="ml-2.5" />
									}

								</button>

								<button
									type="button"
									className="flex items-center justify-center mx-2 bg-button-red text-white uppercase py-3.5 px-12 rounded-custom text-center font-mono transition-opacity duration-300 hover:opacity-75"
									onClick={stopRecording}
								>
									Stop
									<img src={iconStop} alt="Stop" className="ml-2.5" />
								</button>
							</div>
						</>
					) : (
						<>
							<p className="text-text dark:text-gray-50 mb-12">Press the button below and start a new <br /> recording.</p>

							<button
								type="button"
								className="bg-button-green text-white uppercase py-3.5 px-12 flex items-center justify-center rounded-custom text-center font-mono transition-opacity duration-300 hover:opacity-75"
								onClick={startRecording}
							>
								Start
								<img src={iconPlay} alt="Play" className="ml-2.5" />
							</button>
						</>
					)}
				</>
			) : (
				<p className="text-text dark:text-gray-50 mb-12">The use of the microphone has not been authorized, please authorize it.</p>
			)}



			{isRecordingFinished && <SaveRecordModal />}
		</div>
	);
}