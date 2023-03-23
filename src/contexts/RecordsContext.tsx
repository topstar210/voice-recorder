// import { time } from "console";
import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import slugify from 'slugify';

const _axios = axios.create({
	baseURL: process.env.REACT_APP_SERVERURL,
	headers: {
		"Access-Control-Allow-Origin": "*",
	},
});

type Record = {
	id: number;
	name: string;
	file: any;
	uploadedName?: string;
}

interface RecordsContextData {
	isRecordingAuthorized: boolean;
	isRecording: boolean;
	isPause: boolean;
	isRecordingFinished: boolean;
	records: Record[];
	hours: number;
	minutes: number;
	seconds: number;
	currentRecord: Record;
	lastId: number;
	isPlaying: boolean;
	currentPlaying: string;
	isShowRemoved:boolean;
	userId:string;
	startRecording: () => void;
	stopRecording: () => void;
	pauseRecording: () => void;
	resumeRecording: () => void;
	deleteRecord: (toDeleteId: number) => void;
	deleteAllRecords: () => void;
	getRemovedFiles: () => void;
	getCurrFiles: () => void;
	cancelSaveRecord: () => void;
	setCurrentRecordName: (name: string) => void;
	saveRecord: () => void;
	playTheRecord: (src: string) => void;
	stopTheRecord: () => void;
}

interface RecordsProviderProps {
	children: ReactNode;
}

export const RecordsContext = createContext({} as RecordsContextData);

let recorder: MediaRecorder;
let recordingChunks: BlobPart[] = [];
let timerTimeout: NodeJS.Timeout;

export function RecordsProvider({ children }: RecordsProviderProps) {
	const app = useSelector((state:any)=>state.sapp);
	const [isRecordingAuthorized, setIsRecordingAuthorized] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
	const [isPause, setIsPause] = useState(false);
	const [isRecordingFinished, setIsRecordingFinished] = useState(false);
	const [records, setRecords] = useState<Record[]>([]);
	const [timer, setTimer] = useState(0);
	const [currentRecord, setCurrentRecord] = useState<Record>({
		id: -1,
		name: '',
		file: null,
		uploadedName: ''
	});
	const [lastId, setLastId] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaying, setCurrentPlaying] = useState('');
	const [pinCode, setPinCode] = useState("");
	const [isShowRemoved, setIsShowRemoved] = useState(false);
	const [userId, setUserId] = useState("");

	const hours = Math.floor(timer / 3600);
	const minutes = Math.floor(timer / 60);
	const seconds = timer % 60;

	function startRecording() {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({
				audio: true
			})
				.then(stream => {
					setIsRecording(true);

					recorder = new MediaRecorder(stream);

					recorder.start();

					recorder.ondataavailable = e => {
						recordingChunks.push(e.data);
					}
				})
				.catch(error => {
					console.error(error);

					setIsRecordingAuthorized(false);
				});
		}
	}

	function pauseRecording() {
		recorder.pause();
		recorder.onpause = () => {
			clearTimeout(timerTimeout);
			setIsPause(!isPause);
		}
	}

	function resumeRecording() {
		recorder.resume();
		recorder.onresume = () => {
			setTimer(timer + 1);
			setIsPause(!isPause);
		}
	}

	function stopRecording() {
		recorder.onstop = () => {
			const recordBlob = new Blob(recordingChunks, {
				type: 'audio/ogg; codecs=opus'
			});

			setCurrentRecord({
				...currentRecord,
				name: (Math.random() + 1).toString(36).substring(7) + ".mp3",
				file: window.URL.createObjectURL(recordBlob)
			});

			recordingChunks = [];
		}

		recorder.stop();

		setIsRecording(false);
		setIsRecordingFinished(true);
		setTimer(0);
		clearTimeout(timerTimeout);
	}

	function deleteRecord(toDeleteId: number) {
		const filteredRecords = records.filter(({ id }) => id !== toDeleteId);

		setRecords(filteredRecords);

		deleteRecordFromBN(toDeleteId);
	}

	function deleteAllRecords() {
		setRecords([]);
		deleteRecordFromBN('all');
	}

	function cancelSaveRecord() {
		setIsRecordingFinished(false);
		setCurrentRecord({
			id: -1,
			name: '',
			file: null
		});
	}

	function setCurrentRecordName(name: string) {
		setCurrentRecord({
			...currentRecord,
			name: name ? `${slugify(name, '_')}.mp3` : ''
		});
	}

	function saveRecord() {
		saveToBackend();
		setRecords([...records, { ...currentRecord, id: lastId + 1 }]);
		setCurrentRecord({
			id: -1,
			name: '',
			file: null
		});
		setLastId(lastId + 1);
		setIsRecordingFinished(false);
	}

	// private function
	async function saveToBackend() {
		const file = await fetch(currentRecord.file)
			.then(r => r.blob())
			.then(blobFile => new File([blobFile], currentRecord.name, { type: blobFile.type }))
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			},
		};
		const formData = new FormData();
		formData.append('audio', file);
		formData.append('pinCode', pinCode);
		
		_axios.post("/file/save",formData, config).then((res) => {
			// console.log(res);
			getMyfiles();
		});
	}

	// load records files
	async function getMyfiles() {
		_axios.get("/file/get/"+pinCode).then((res) => {
			if(!res.data) return;
			const records = res.data?.map((file:any, i:number) => {
				const fileNameStr = file.split("___");
				const fileName = fileNameStr[1];
				const filePath = process.env.REACT_APP_FILEURL;
				const fullFilePath = filePath + pinCode + "/" + file;
				return {
					id: i + 1,
					name: fileName,
					file: fullFilePath,
					uploadedName: file
				}
			});
			setRecords(records);
			setLastId(res.data?.length);
		});
	}
	
	function deleteRecordFromBN(toDeleteId:any) {
		if(toDeleteId === 'all'){
			_axios.delete("/file/delete/"+pinCode);
		} else {
			const deleteRecord = records.filter(({ id }) => id === toDeleteId);
			_axios.delete("/file/delete/"+pinCode+"/"+deleteRecord[0]?.uploadedName);	
		}
	}

	function playTheRecord(src: string) {
		setIsPlaying(true);
		setCurrentPlaying(src);
	}

	function stopTheRecord() {
		setIsPlaying(false);
		setCurrentPlaying('');
	}

	function getRemovedFiles() {
		if (!pinCode) return;
		_axios.get("/file/get_removed/"+pinCode).then((res) => {
			let records = []; 
			if(res.data) {
				records = res.data?.map((file:any, i:number) => {
					const fileNameStr = file.split("___");
					const fileName = fileNameStr[1];
					const filePath = process.env.REACT_APP_FILEURL;
					const fullFilePath = filePath + pinCode + "/removed_files/" + file;
					return {
						id: i + 1,
						name: fileName,
						file: fullFilePath,
						uploadedName: file
					}
				});
			}
			setRecords(records);
		});
	}

	function getCurrFiles() {
		if (!pinCode) return;
		getMyfiles();
	}

	useEffect(() => {
		if (isRecording) {
			timerTimeout = setTimeout(() => {
				setTimer(timer + 1);
			}, 1000);
		}
	}, [isRecording, timer]);

	useEffect(()=>{
		if(currentRecord.file){
			saveRecord();
		}
	},[currentRecord])

	useEffect(()=>{
		setIsShowRemoved(app?.isShowRemoved?true:false);
		setPinCode(app.pinCode);
		setUserId(app.userId);
	},[app]);

	useEffect(()=>{
		if (!pinCode) return;
		getMyfiles();
	},[pinCode])

	return (
		<RecordsContext.Provider
			value={{
				isRecordingAuthorized,
				isRecording,
				isPause,
				isRecordingFinished,
				records,
				hours,
				minutes,
				seconds,
				currentRecord,
				lastId,
				isPlaying,
				currentPlaying,
				isShowRemoved,
				userId,
				startRecording,
				stopRecording,
				pauseRecording,
				resumeRecording,
				deleteRecord,
				deleteAllRecords,
				getRemovedFiles,
				getCurrFiles,
				setCurrentRecordName,
				saveRecord,
				cancelSaveRecord,
				playTheRecord,
				stopTheRecord,
			}}
		>
			{children}
		</RecordsContext.Provider>
	);
}