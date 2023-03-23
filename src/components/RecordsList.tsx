import { useContext, useState } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import { RecordsContext } from "@/contexts/RecordsContext";
import { RecordsListItem } from "./RecordsListItem";

import axiosJWT from "@/provider/API";

// import iconBlock from '@/assets/images/icons/block.svg';

export function RecordsList() {
	const { records, isShowRemoved, userId, getRemovedFiles, getCurrFiles } = useContext(RecordsContext);
	const [showModal, setShowModal] = useState(false);
	const [filePwd, setFilePwd] = useState("");
	const [filetype, setFiletype] = useState(0);


	const list = records.map(({ id, name, file }) => {
		return <RecordsListItem
			key={id}
			id={id}
			name={name}
			file={file}
		/>;
	});

	const changeFolder = (e: any) => {
		setFiletype(e.target.value);
		if (e.target.value === "1") {
			setShowModal(true);
		} else {
			getCurrFiles();
		}
	}

	const closeFilePwdModal = () => {
		setShowModal(false);
		setFiletype(0);
	}

	const checkFilePwd = () => {
		axiosJWT.user.checkFilePwd({
			userId,
			filePwd
		}).then((res:any)=>{
			setFilePwd("");
			setShowModal(false);
			getRemovedFiles();
		}).catch((err:any)=>{
			setFilePwd("");
			alert(err.response.data.msg);
			// toast.error(err.response.data.msg);
			return;
		});
	}

	return (
		<div className="py-4 px-5 bg-white dark:bg-text rounded-custom shadow-lg h-full relative">
			<h3 className="uppercase text-text dark:text-gray-50 mb-6 text-xl font-bold tracking-wider font-serif">Recordings</h3>
			<select value={filetype} onChange={(e) => changeFolder(e)} className="absolute right-5 top-4">
				<option value={0}>Current Files</option>
				{isShowRemoved && <option value={1}>Removed Files</option>}
			</select>

			<div className="max-h-72 lg:max-h-screen  overflow-y-auto overflow-x-hidden">
				{list.length > 0 ? list : <p className="text-text dark:text-gray-50 font-mono text-sm italic">Nothing recorded yet...</p>}
			</div>

			{/* { list.length > 0 && (
				<button 
					type="button"
					className="bg-button-red rounded-custom p-1 absolute right-5 bottom-4 transition-opacity duration-300 hover:opacity-75"
					title="Delete all recordings"
					onClick={deleteAllRecords}
				>
					<img src={iconBlock} alt="Delete all"/>
				</button>
			) } */}

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
										onClick={() => closeFilePwdModal()}
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
			{/* <ToastContainer /> */}
		</div>
	);
}