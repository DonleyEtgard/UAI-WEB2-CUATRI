// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import ContactPage from "./pages/contact/index.tsx";
import Layout from "./components/layout/Layout.tsx";
import AboutPage from "./pages/about/index.tsx";
import { ErrorPage } from "./components/ErrorPage";
import { FormDemo } from "./pages/FormDemo/FormDemo.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import ReduxDemoPage from "./pages/redux-demo/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: App,
        errorElement: <ErrorPage />,
      },
      {
        path: "contact",
        Component: ContactPage,
        errorElement: <ErrorPage />,
      },
      {
        path: "about",
        Component: AboutPage,
        errorElement: <ErrorPage />,
      },
      {
        path: "form-demo",
        Component: FormDemo,
        errorElement: <ErrorPage />,
      },
      {
        path: "redux-demo",
        Component: ReduxDemoPage,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);