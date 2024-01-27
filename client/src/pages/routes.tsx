import { Navigate, createBrowserRouter } from "react-router-dom";
import MainPage from "./MainPage";
import ErrorPage from "./ErrorPage";
import MainLayout from "../layouts/MainLayout";

const router = createBrowserRouter([
  { path: "", element: <Navigate to="/game" /> },
  {
    path: "/game",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> }
      //   { path: "games/:slug", element: <GameDetailPage /> },
    ]
  }
]);

export default router;
