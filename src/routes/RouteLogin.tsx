import { Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Loader2 } from "lucide-react";
import React from "react";

const LoadingFallback = () => <div className="min-w-screen min-h-screen bg-gray-100/70  flex justify-center items-center">
    <Loader2 className="animate-spin text-blue-500" />
</div>;
const Login = React.lazy(() => import("../features/login/Login"));

const withSuspense = (Component: React.ReactNode) => (
    <Suspense fallback={<LoadingFallback />}>{Component}</Suspense>
);

export const RouteLogin: RouteObject[] = [
    {
        path: "",
        element: withSuspense(<Login />),
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
];