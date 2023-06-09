import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import axiosJWT from "@/provider/API";

const pinBtn = "rounded-full m-auto w-24 h-24 md:w-32 md:h-32 shadow-md lg:w-36 lg:h-36 flex justify-center items-center text-5xl border border-border dark:text-white font-bold cursor-pointer";

const ConfirmPins = ({ pins }: any) => {
    return (
        <div className="flex py-4 px-5 rounded-full" style={{ background: "#77B0E3" }}>
            <div className={`rounded-full bg-main mx-1 ${pins[0] > -1 ? "" : "opacity-50"}`} style={{ width: "50px", height: "50px" }}></div>
            <div className={`rounded-full bg-main mx-1 ${pins[1] > -1 ? "" : "opacity-50"}`} style={{ width: "50px", height: "50px" }}></div>
            <div className={`rounded-full bg-main mx-1 ${pins[2] > -1 ? "" : "opacity-50"}`} style={{ width: "50px", height: "50px" }}></div>
            <div className={`rounded-full bg-main mx-1 ${pins[3] > -1 ? "" : "opacity-50"}`} style={{ width: "50px", height: "50px" }}></div>
            <div className={`rounded-full bg-main mx-1 ${pins[4] > -1 ? "" : "opacity-50"}`} style={{ width: "50px", height: "50px" }}></div>
            <div className={`rounded-full bg-main mx-1 ${pins[5] > -1 ? "" : "opacity-50"}`} style={{ width: "50px", height: "50px" }}></div>
        </div>
    );
}

const Login = () => {
    // const navigate = useNavigate();
    const [pins, setPins] = useState([-1, -1, -1, -1, -1, -1]);
    const [pinLen, setPinLen] = useState(0);
    const [isConfirmBtn, setIsConfirmBtn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');

    const handleClickNumber = (Num: number) => {
        const curPinlen = pinLen + 1;
        if (curPinlen <= 6) {
            let temPins = [...pins];
            temPins[curPinlen - 1] = Num;
            setPins(temPins);
            setPinLen(curPinlen);
        } else { return; }
    }
    useEffect(() => {
        if (pinLen === 6) {
            setIsConfirmBtn(true);
        } else {
            setIsConfirmBtn(false);
        }
    }, [pinLen]);

    const handleClickBackspace = () => {
        if (pinLen === 0) return;
        let temPins = [...pins];
        temPins[pinLen - 1] = -1;
        setPins(temPins);
        setPinLen(pinLen - 1);
    }

    const handleCheckPwd = async () => {
        const checkPwdRes = await axiosJWT.auth.checkPwd({
            pin_code: pins,
            password
        }).then((res:any)=>{
            window.location.href = "/admin";
        }).catch((err:any) => {
            console.log(err);
            axiosJWT.auth.logout();
            setIsConfirmBtn(false);
            setPins([-1, -1, -1, -1, -1, -1]);
            setPinLen(0);
            alert("Password not matched.");
            setShowModal(false);
            return;
        });
    }

    const handleClickLogin = async () => {
        // setShowModal(!showModal);
        doLogin()
    }

    const doLogin = () => {
        axiosJWT.auth.login(pins).then((res: any) => {
            const jwtDecoded: any = jwt_decode(res.data?.accessToken);
            if (jwtDecoded.role === "admin") {
                setShowModal(!showModal);
            } else {
                window.location.href = "/";
                setIsConfirmBtn(false);
                setPins([-1, -1, -1, -1, -1, -1]);
                setPinLen(0);
            }
        }).catch(() => {
            alert("Pin code not found."); return;
        })
    }

    const cancelPwdModal = () => {
        axiosJWT.auth.logout();
        setIsConfirmBtn(false);
        setPins([-1, -1, -1, -1, -1, -1]);
        setPinLen(0);
        setShowModal(false);
    }

    return (
        <div className="lg:mt-20">
            <div className="lg:flex justify-center px-8 text-center">
                <h1 className="lg:hidden text-7xl italic font-bold text-main pb-5 drop-shadow-sm dark:text-white">Login</h1>
                <div className="max-w-[1200px] lg:flex">
                    <div className="grid gap-4 grid-cols-3 m-auto" style={{ maxWidth: "480px" }}>
                        <div onClick={() => handleClickNumber(1)} className={pinBtn}>1</div>
                        <div onClick={() => handleClickNumber(2)} className={pinBtn}>2</div>
                        <div onClick={() => handleClickNumber(3)} className={pinBtn}>3</div>
                        <div onClick={() => handleClickNumber(4)} className={pinBtn}>4</div>
                        <div onClick={() => handleClickNumber(5)} className={pinBtn}>5</div>
                        <div onClick={() => handleClickNumber(6)} className={pinBtn}>6</div>
                        <div onClick={() => handleClickNumber(7)} className={pinBtn}>7</div>
                        <div onClick={() => handleClickNumber(8)} className={pinBtn}>8</div>
                        <div onClick={() => handleClickNumber(9)} className={pinBtn}>9</div>
                        <div onClick={() => handleClickBackspace()} className={pinBtn}> ⬅ </div>
                        <div onClick={() => handleClickNumber(0)} className={pinBtn}>0</div>
                    </div>
                    <div className="hidden lg:inline lg:px-16" style={{ maxWidth: "600px" }}>
                        <h1 className="text-9xl italic font-bold text-main dark:text-white">Login</h1>
                        <div className="text-5xl py-10 dark:text-white font-bold">WMO Dictation Recording System</div>
                        <div className="flex justify-center">
                            <ConfirmPins pins={pins} />
                        </div>
                        {
                            isConfirmBtn &&
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleClickLogin()}
                                    className="text-center py-3 px-8 rounded-full bg-button-green text-white text-2xl my-7">Confirm</button>
                            </div>
                        }
                    </div>
                </div>
                <div className="lg:hidden m-auto my-10">
                    <div className="flex justify-center">
                        <ConfirmPins pins={pins} />
                    </div>
                    {
                        isConfirmBtn &&
                        <div className="flex justify-center">
                            <button
                                onClick={() => handleClickLogin()}
                                className="text-center py-3 px-8 rounded-full bg-button-green text-white text-2xl my-7">Confirm</button>
                        </div>
                    }
                </div>
            </div>

            <div className="w-full text-center pb-10">
                <Link to="/register" className="dark:text-white">Go to Register</Link>
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
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="block border border-grey-light w-full p-3 rounded mb-4"
                                        name="password"
                                        placeholder="Password" />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end px-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => cancelPwdModal()}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleCheckPwd()}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    )
}


export default Login;