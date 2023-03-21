import {
  createBrowserRouter,
  redirect
} from "react-router-dom";
import API from "@/provider/API";

import Record from '@/pages/Record';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Admin from '@/pages/Admin/Users';

const authentication = async () => {
    await API.auth.getToken().then((tokenRes:any) => {
    }).catch((err:any)=>{
      console.log("error ===>   ",  err);
      throw redirect('/login');
    });
    return "successfully";
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: authentication,
    element: <Record />,
  },{
    path: "/admin",
    loader: authentication,
    element: <Admin />,
  },{
    path: "/login",
    element: <Login />,
  },{
    path: "/register",
    element: <Register />,
  }
]);


export default router;