import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Notfound from "./pages/notfound";
import Home from "./pages/home";
import Books from "./pages/books";
import BookDetail from "./pages/bookDetail";
import AddBook from "./pages/addBook";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import AccountSettings from "./pages/accountSettings";
import MyListings from "./pages/myListings";
import EditBook from "./pages/editBook";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Notfound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'books', element: <Books /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'books/add', element: <AddBook /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'account/settings', element: <AccountSettings /> },
      { path: 'account/listings', element: <MyListings /> },
      { path: 'books/:id/edit', element: <EditBook /> },
    ],
  },
]);

export default router;
