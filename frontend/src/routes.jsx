import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Register from "../pages/register";
import App from "./App";
import Notfound from "../pages/notfound";





const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            errorElement: <Notfound />,
            children: [
                {
                    index: true,
                    element: <Home />
                }, 
            ]

        },
        {
            path: '/register',
            element: <App />,
            errorElement: <Notfound />,
            children: [
                {
                    index: true,
                    element: <Register />
                }, 
            ]

        },
      
    ]
)

export default router;