import jwt_decode from "jwt-decode";
import localstore from "@/utils/localstore";

import {
    SET_USER_INFO,
} from "../types/app.types";

const initialState = {
    topBarShow: true,
    email: "",
    exp: 0,
    userId: "",
    accToken: "",
    pinCode: "",
    isShowRemoved: false
}

export function appState(state = initialState, action:any) {
    switch (action.type) {
        case SET_USER_INFO:
            if(action.payload === "Invalid_Token"){
                return {
                    ...state,
                    accToken: action.payload
                }
            }
            const accToken = action.payload?.accessToken;
            const jwtDecoded = jwt_decode(accToken);
            localstore.saveObj("userInfo", jwtDecoded);
            localStorage.setItem("accToken", accToken);
            return {
                ...state,
                ...(jwtDecoded as any),
                accToken,
            } as any
        default:
            return { ...state };
    }
}
