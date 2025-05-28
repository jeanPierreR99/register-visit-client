import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom";
import { ArrowLeft, ChevronDown, } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Toaster } from "../ui/sonner";
import { deleteStorage } from "@/lib/functions";
import useStoreLogin from "@/features/login/store/useStoreLogin";

export default function Layout() {
    const { name } = useStoreLogin();


    const nameSplit = () => {
        const nameAux = name.trim().toUpperCase().split(" ");
        const first = nameAux[0]?.[0] ?? "A";
        const second = nameAux[1]?.[0] ?? "A";
        return (first + second) || "A";
    };


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="w-full border-b h-12 flex items-center justify-between ">
                    <SidebarTrigger />
                    <div className="float-right pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center cursor-pointer">
                                    <span className="font-black w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full">{nameSplit()}</span>
                                    <ChevronDown size={18}></ChevronDown>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 text-center">
                                <div className="flex flex-col justify-center items-center"><span className="font-black w-14 h-14 flex items-center justify-center bg-green-500 text-white rounded-full">{nameSplit()}</span>
                                    <span className="text-sm font-black">{name}</span>
                                </div>

                                <DropdownMenuSeparator />
                                <Button variant={"ghost"} onClick={deleteStorage} style={{ fontWeight: 400 }} className="w-full flex justify-start text-gray-700">
                                    <ArrowLeft></ArrowLeft> Cerrar sesión
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu >
                    </div>
                </div>
                <div className="px-5 py-5">
                    <Outlet />
                </div>
            </main>
            <Toaster></Toaster>
        </SidebarProvider >
    )
}