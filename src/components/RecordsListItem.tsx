import { useContext, useState } from 'react';
import { RecordsContext } from '@/contexts/RecordsContext';
import axiosJWT from "@/provider/API";

import { PlayRecordModal } from './PlayRecordModal';

import iconPlay from '@/assets/images/icons/play.svg';
import iconDownload from '@/assets/images/icons/download.svg';
import iconX from '@/assets/images/icons/close.svg';


interface RecordsListItemProps {
	id: number;
	name: string;
	file: any;
}

export function RecordsListItem({ id, name, file }: RecordsListItemProps) {
	const { userId, isPlaying, deleteRecord, playTheRecord } = useContext(RecordsContext);
	let fileSession = localStorage.getItem("fileSession");
	const [filePwd, setFilePwd] = useState("");
	const [isShowing, setIsShowing] = useState(fileSession ? true : false);
	const [showModal, setShowModal] = useState(false);

	function handleDeleteRecord() {
		deleteRecord(id);
	}

	function handlePlayTheRecord() {
		if(!isShowing) {
			setShowModal(true);
		} else {
			playTheRecord(file);
		}
	}

	const checkFilePwd = () => {
		axiosJWT.user.checkFilePwd({
			userId,
			filePwd
		}).then((res: any) => {
			setFilePwd("");
			setShowModal(false);
			playTheRecord(file);
			localStorage.setItem("fileSession", "Okay");
			setIsShowing(true);
		}).catch((err: any) => {
			setFilePwd("");
			alert(err.response.data.msg);
			return;
		});
	}

	return (
		<div className="bg-bg dark:bg-bg-dark rounded-custom shadow-sm w-full mb-4 relative py-4 flex justify-between items-center pl-20 overflow-hidden lg:flex-nowrap flex-wrap">
			<div className="absolute left-0 top-0 bg-text dark:bg-gray-400 text-white font-serif text-lg font-bold px-5 h-full flex justify-center items-center">
				.{String(id).padStart(2, '0')}
			</div>

			<p className="font-mono text-sm text-text dark:text-gray-50 lg:break-normal break-all">{name}</p>

			<div className="mr-5 flex">
				<button
					type="button"
					className="mr-3 transition-transform duration-300 transform hover:scale-125 dark:invert"
					onClick={handlePlayTheRecord}
				>
					<img src={iconPlay} alt="Play" />
				</button>
				{
					isShowing &&
					<>
						<a
							href={file}
							download={name}
							target="_blank"
							className="mr-3 transition-transform duration-300 transform hover:scale-125 dark:invert"
						>
							<img src={iconDownload} width={18} alt="Save" />
						</a>

						<button
							type="button"
							className="transition-transform duration-300 transform hover:scale-125"
							onClick={handleDeleteRecord}
						>
							<img src={iconX} alt="Delete" />
						</button>
					</>
				}
			</div>
			
			
			{showModal ? (
				<>
					<div
						className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
					>
						<div className="relative w-auto my-6 mx-auto max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*body*/}
								<div className="relative p-6 flex-auto">
									<input
										type="password"
										value={filePwd} onChange={(e) => setFilePwd(e.target.value)}
										className="block border border-grey-light w-full p-3 rounded mb-4"
										name="file_pwd"
										placeholder="Enter File Password" />
								</div>
								{/*footer*/}
								<div className="flex items-center justify-end px-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
									<button
										className="bg-emerald-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => checkFilePwd()}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}

			{isPlaying && <PlayRecordModal />}
		</div>
	);
}