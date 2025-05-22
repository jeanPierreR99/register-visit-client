import { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Loader2 } from "lucide-react";
import React from "react";
import Layout from "@/components/layout/Layout";

const LoadingFallback = () => <div className="min-w-screen min-h-screen bg-gray-100/70  flex justify-center items-center">
    <Loader2 className="animate-spin text-green-500" />
</div>;

const Home = React.lazy(() => import("@/features/admin/apps/home/Home"));
const Visit = React.lazy(() => import("@/features/admin/apps/visit/Visit"));
const Functionary = React.lazy(() => import("@/features/admin/apps/functionary/Functionary"));

const withSuspense = (Component: React.ReactNode) => (
    <Suspense fallback={<LoadingFallback />}>{Component}</Suspense>
);

export const RouteUser: RouteObject[] = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <div>Ocurrio un error</div>,
        children: [
            {
                index: true,
                element: withSuspense(<Home />),
            },
            {
                path: "visits",
                element: withSuspense(<Visit />),
            },
            {
                path: "functionaries",
                element: withSuspense(<Functionary />),
            },
        ],
    },
];