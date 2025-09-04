import { createBrowserRouter } from "react-router-dom";
import Home from "../src/pages/home";
import Register from "../src/pages/register";
import Login from "../src/pages/login";
import Verification from "./pages/verification";
import App from "../src/App";
import Notfound from "../src/pages/notfound";





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
        {
            path: '/login',
            element: <App />,
            errorElement: <Notfound />,
            children: [
                {
                    index: true,
                    element: <Login />
                }, 
            ]

        },
        {
            path: '/verification',
            element: <App />,
            errorElement: <Notfound />,
            children: [
                {
                    index: true,
                    element: <Verification />
                }, 
            ]

        },
      
    ]
)

export default router;