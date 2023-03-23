import { useEffect, useState } from "react";

import API from '@/provider/API';

const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [userId, setUserId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [isShowRemoved, setIsShowRemoved] = useState(false);
    const [filePwd, setFilePwd] = useState("");

    const [users, setUsers] = useState([]);

    const saveUserInfo = async () => {
        await API.user.save({
            name,
            email,
            pin_code: pinCode,
            userId,
            isShowRemoved,
            isEdit,
            filePwd
        }).then((res: any) => {
            let userlist: any = [...users];
            if (isEdit) {
                let ind = userlist.findIndex((x: any) => x._id === userId);
                userlist[ind]['name'] = name;
                userlist[ind]['email'] = email;
                userlist[ind]['pin_code'] = pinCode;
                userlist[ind]['isShowRemoved'] = isShowRemoved;
            } else {
                userlist.push(res?.data);
            }
            setUsers(userlist);
            setShowModal(false);
            setName("");
            setEmail("");
            setPinCode("");
            setFilePwd("");
            setIsShowRemoved(false);
        })
    }

    const addUserModal = () => {
        setShowModal(true);
        setIsEdit(false);
    }

    const editUserModal = (userId: string) => {
        API.user.getInfo(userId).then((res: any) => {
            const userinfo = res.data;
            setName(userinfo.name);
            setEmail(userinfo.email);
            setPinCode(userinfo.pin_code);
            setUserId(userinfo._id);
            // setFilePwd(userinfo.filePwd);
            setIsShowRemoved(userinfo.isShowRemoved);

            setShowModal(true);
            setIsEdit(true);
        })
    }

    const delteRow = (userId: string) => {
        API.user.delete(userId).then((res: any) => {
            let userlist = users.filter((v: any, i) => {
                if (v._id !== userId) return true;
            })
            setUsers(userlist);
        })
    }

    useEffect(() => {
        API.user.getUsers().then((res: any) => {
            setUsers(res.data);
        })
    }, [])

    return (
        <div className="flex flex-col lg:mt-20 md:mx-10 mx-3">
            <div className="overflow-x-auto">
                <div className="py-3 pl-2">
                    <div className="relative max-w-xs">
                        <button onClick={() => addUserModal()} className="text-center py-2 px-8 rounded bg-button-green text-white">Add +</button>
                    </div>
                </div>

                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="overflow-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                        Pin Code
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                        Showing
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                                        Edit
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users &&
                                    users.map((v: any, i) =>
                                        <tr key={i}>
                                            <td className="px-6 py-4 dark:text-white text-sm font-medium text-gray-800 whitespace-nowrap">
                                                {i + 1}
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-sm text-gray-800 whitespace-nowrap">
                                                {v.name}
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-sm text-gray-800 whitespace-nowrap">
                                                {v.email}
                                            </td>
                                            <td className="px-6 py-3 dark:text-white text-sm text-gray-800 whitespace-nowrap">
                                                {v.pin_code}
                                            </td>
                                            <td className="px-6 py-3 dark:text-white text-sm text-gray-800 whitespace-nowrap">
                                                {v.isShowRemoved ? "true" : "false"}
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-sm font-medium text-right whitespace-nowrap">
                                                <button onClick={() => editUserModal(v._id)} className="text-green-500 hover:text-green-700">
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-sm font-medium text-right whitespace-nowrap">
                                                {
                                                    v.role !== "admin" &&
                                                    <button onClick={() => delteRow(v._id)} className="text-red-500 hover:text-red-700">
                                                        Delete
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }

                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between px-5 py-2 border-b border-solid border-slate-200 rounded-t">
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 opacity-90 float-right leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className="bg-transparent opacity-90 h-5 w-5 text-xl block outline-none focus:outline-none">
                                                ×
                                            </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        <input
                                            type="text"
                                            value={name} onChange={(e) => setName(e.target.value)}
                                            className="block border border-grey-light w-full p-3 rounded mb-4"
                                            name="fullname"
                                            placeholder="Full Name" />
                                        <input
                                            type="email"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="block border border-grey-light w-full p-3 rounded mb-4"
                                            name="email"
                                            placeholder="Email" />
                                        <input
                                            type="text"
                                            value={pinCode} onChange={(e) => setPinCode(e.target.value)}
                                            className="block border border-grey-light w-full p-3 rounded mb-4"
                                            name="Pin Code"
                                            placeholder="Pin Code" />
                                        <input
                                            type="password"
                                            value={filePwd} onChange={(e) => setFilePwd(e.target.value)}
                                            className="block border border-grey-light w-full p-3 rounded mb-4"
                                            name="file_pwd"
                                            placeholder="New File Password" />
                                        <div>
                                            <label htmlFor="showRemoved">Showing Removed Files</label>
                                            <input type="checkbox"
                                                checked={isShowRemoved ? true : false}
                                                onChange={(e) => setIsShowRemoved(e.target.checked)}
                                                id="showRemoved" />
                                        </div>
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
                                            onClick={() => saveUserInfo()}
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
            </div>
        </div>
    );
}

export default Users;