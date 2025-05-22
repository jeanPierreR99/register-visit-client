import { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Loader2 } from "lucide-react";
import React from "react";
import Layout from "@/components/layout/Layout";

const LoadingFallback = () => <div className="min-w-screen min-h-screen bg-gray-100/70  flex justify-center items-center">
    <Loader2 className="animate-spin text-green-500" />
</div>;


const User = React.lazy(() => import("@/features/admin/register/user/User"));
const Sedes = React.lazy(() => import("@/features/admin/register/sedes/Sede"));
const Office = React.lazy(() => import("@/features/admin/register/offices/Office"));
const Observation = React.lazy(() => import("@/features/admin/register/observationOffice/ObservationOffice"));

const withSuspense = (Component: React.ReactNode) => (
    <Suspense fallback={<LoadingFallback />}>{Component}</Suspense>
);

export const RouteAdmin: RouteObject[] = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <div>Ocurrio un error</div>,
        children: [
            {
                index: true,
                element: withSuspense(<Sedes />),
            },
            {
                path: "users",
                element: withSuspense(<User />),
            },
            {
                path: "sedes",
                index: true,
                element: withSuspense(<Sedes />),
            },
            {
                path: "visits/:id/:name/:sede",
                element: withSuspense(<Observation />),
            },
            {
                path: "offices",
                element: withSuspense(<Office />),
            }
        ],
    },
];