import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import API from "@/provider/API";
import { SET_USER_INFO } from "@/store/types/app.types";

const AuthProvider = ({ children }:any) => {
    const dispatch = useDispatch();
    const sapp = useSelector((state:any) => state.sapp);

    useEffect(() => {
        if (!sapp.accToken) {
            API.auth.getToken().then((tokenRes:any) => {
                dispatch({
                    type: SET_USER_INFO,
                    payload: tokenRes.data
                })
            }).catch((err:any)=>{
                dispatch({
                    type: SET_USER_INFO,
                    payload: "Invalid_Token"
                })
            })
        }
    }, [sapp])

    return (
        <>
            { children }
        </>
    )
}

export default AuthProvider;