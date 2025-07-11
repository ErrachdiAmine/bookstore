import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
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
                }
            ]

        },
      
    ]
)

export default router;