import { CalendarDays, Home, Hotel, TvMinimal, UserPlus, UsersRound } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"
import useStoreLogin from "@/features/login/store/useStoreLogin"

export function AppSidebar() {
    const { name, office, sede, role } = useStoreLogin();

    const nameSplit = () => {
        const nameAux = name.trim().toUpperCase().split(" ");
        const first = nameAux[0]?.[0] ?? "A";
        const second = nameAux[1]?.[0] ?? "A";
        return (first + second) || "A";
    };


    const itemsAssists = [
        {
            title: "Inicio",
            url: "/",
            icon: Home,
            visible: true,
        },
        {
            title: "Visitas",
            url: "visits",
            icon: CalendarDays,
            visible: role === "Asistente" || role === "Administrador",
        },
        {
            title: "Visitas",
            url: "visits-auxs",
            icon: CalendarDays,
            visible: role !== "Administrador" && role !== "Asistente",
        },
        {
            title: "Funcionarios",
            url: "functionaries",
            icon: UsersRound,
            visible: role === "Asistente",
        },
    ].filter(item => item.visible);

    const itemsUsers = [
        {
            title: "Sedes",
            url: "/sedes",
            icon: Hotel,
        },
        {
            title: "Oficinas",
            url: "/offices",
            icon: TvMinimal,
        },
        {
            title: "Usuarios",
            url: "/users",
            icon: UserPlus,
        },
    ]


    return (
        <Sidebar>
            <SidebarContent>
                <div className="w-full text-center max-h-[220px] py-2 px-5 mb-4 flex flex-col items-center">
                    <span className="font-black w-20 h-20 text-4xl flex items-center justify-center bg-green-500 text-white rounded-full">{nameSplit()}</span>
                    <span className="text-sm font-black">{name}</span>
                    <span className="text-sm text-gray-400">{office} - {sede}</span>
                </div>
                {role !== "Administrador" &&
                    <SidebarGroup>
                        <SidebarGroupLabel>Aplicaciones</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {itemsAssists.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <NavLink to={item.url}>
                                                <item.icon />
                                                {item.title}
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                }
                {role == "Administrador" &&
                    <SidebarGroup>
                        <SidebarGroupLabel>Registrar</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {itemsUsers.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <NavLink to={item.url}>
                                                <item.icon />
                                                {item.title}
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                }
            </SidebarContent>
        </Sidebar>
    )
}
