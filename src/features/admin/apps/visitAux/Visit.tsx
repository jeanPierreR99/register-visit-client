import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { IVisit } from "@/lib/interface";
import { API, API_UPLOAD, user } from "@/lib/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisitModal } from "./components/VisitModal";
import useStoreLogin from "@/features/login/store/useStoreLogin";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { AlertWrapper } from "@/components/AlertWrapper";
import { DateRangePicker } from "../../register/observationOffice/components/DateRangePicker";

const Functionary = () => {
    const [records, setRecords] = useState<IVisit[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSede, setSelectedSede] = useState<IVisit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { id } = useStoreLogin();
    const [message, setMessage] = useState<{ type: any, title: string, description: string } | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await API.getVisitsFilter(currentPage, itemsPerPage);
            setRecords(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Error al cargar sedes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage]);


    const handleCreate = async (data: IVisit) => {
        try {
            data.registeredById = id;
            await API.createVisit(data);
            fetchData();
            setMessage({ type: "success", title: "Operación exitosa", description: "Se llevo a cabo la solicitud, Creado" })
        } catch (err) {
            setMessage({ type: "error", title: "Ocurrio un error", description: "No se pudo llevar a cabo la solicitud" })
            console.error("Error al eliminar sede:", err);
        }
    };

    const handleUpdate = async (data: IVisit) => {
        try {
            if (!selectedSede?.id) return;
            await API.updateVisit(selectedSede.id, data);
            fetchData();
            setMessage({ type: "success", title: "Operación exitosa", description: "Se llevo a cabo la solicitud, actualizado" })
        } catch (err) {
            setMessage({ type: "error", title: "Ocurrio un error", description: "No se pudo llevar a cabo la solicitud" })
            console.error("Error al eliminar sede:", err);
        }
    };

    const handleUpdateOut = async (idVisit: string) => {
        try {
            const payload = {
                check_out_time: new Date().toISOString(),
            }
            await API.updateVisitCheck(idVisit, payload);
            fetchData();
            setMessage({ type: "success", title: "Operación exitosa", description: "Se llevo a cabo la solicitud, visita terminada" })
        } catch (err) {
            setMessage({ type: "error", title: "Ocurrio un error", description: "No se pudo llevar a cabo la solicitud" })
            console.error("Error al eliminar sede:", err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await API.deleteVisit(id);
            fetchData();
        } catch (err) {
            setMessage({ type: "error", title: "Ocurrio un error", description: "No se pudo llevar a cabo la solicitud" })
            console.error("Error al eliminar sede:", err);
        }
    };
    const handleModalSubmit = (data: IVisit) => {
        if (selectedSede) {
            handleUpdate(data);
        } else {
            handleCreate(data);
        }
        setIsModalOpen(false);
        setSelectedSede(null);
    };

    const filtered = records.filter((record) =>
        record.name.toLowerCase().includes(search.toLowerCase()) || record.dni.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(total / itemsPerPage);

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-xl font-semibold mb-2">Registro de Otras Visitas</h2>
            <br />
            <Button
                className="bg-green-500 hover:bg-green-400"
                onClick={() => {
                    setSelectedSede(null);
                    setIsModalOpen(true);
                }}
            >
                <Plus className="w-4 h-4 mr-2" /> Nueva Visita
            </Button>
            <DateRangePicker id={user.office.id} />

            {message && <AlertWrapper type={message.type} title={message.title} description={message.description} />}


            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <label htmlFor="perPage" className="text-sm">Mostrar:</label>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                            setItemsPerPage(parseInt(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Input
                    placeholder="Buscar por Nombre o DNI"
                    className="mb-4 w-full max-w-xs"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="overflow-x-auto w-full shadow-xl shadow-green-100/60 rounded-lg">
                <table className="w-full text-sm text-left text-gray-600 bg-white rounded-lg overflow-hidden">
                    <thead className="bg-green-500 text-white text-base">
                        <tr>
                            <th className="px-4 py-3 border text-center">#</th>
                            <th className="px-4 py-3 border">Fecha</th>
                            <th className="px-4 py-3 border">Visitante</th>
                            <th className="px-4 py-3 border">Motivo</th>
                            <th className="px-4 py-3 border">Oficina</th>
                            <th className="px-4 py-3 border">Hora de entrada</th>
                            <th className="px-4 py-3 border">Hora de salida</th>
                            <th className="px-4 py-3 border text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    Cargando sedes...
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map((record, idx) => (
                                <tr
                                    key={record.id || idx}
                                    className="hover:bg-green-50 odd:bg-white even:bg-green-100"
                                >
                                    <td className="px-4 py-2 text-center font-black">
                                        {(currentPage - 1) * itemsPerPage + idx + 1}
                                    </td>
                                    <td className="px-4 py-2">{new Date(record.check_in_time).toLocaleDateString()}</td>
                                    <td className="px-4 py-2  min-w-[300px]">
                                        <p className="flex gap-2">
                                            <img className="h-26 w-26 object-contain" src={`${API_UPLOAD}/${record.visit_url ? record.visit_url : ""}`} alt="" />
                                            <div>
                                                {record.name}
                                                <p className="text-blue-500 font-bold">DNI: {record.dni}</p>
                                            </div></p>
                                    </td>                                    <td className="px-4 py-2">{record.reason}</td>
                                    <td className="px-4 py-2">{record.description}</td>
                                    <td className="px-4 py-2">{new Date(record.check_in_time).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2">{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : "____"}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            {
                                                !record.check_out_time && <TooltipWrapper content="Marcar Salida">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleUpdateOut(record.id!)}
                                                    >
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    </Button>
                                                </TooltipWrapper>
                                            }
                                            <TooltipWrapper content="Editar Visita">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedSede(record);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4 text-orange-400" />
                                                </Button>
                                            </TooltipWrapper>
                                            <TooltipWrapper content="Eliminar Visita">
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(record.id!)}
                                                >
                                                    <Trash2 className="w-4 h-4 " />
                                                </Button>
                                            </TooltipWrapper>
                                        </div>
                                    </td>
                                </tr>

                            ))

                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-4 text-gray-500">
                                    No se encontraron registros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <div className="text-sm px-4 py-2 text-gray-700">
                                    Página {currentPage} de {totalPages}
                                </div>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                                    }
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <VisitModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSede(null);
                }}
                onSubmit={handleModalSubmit}
                defaultValues={selectedSede ?? undefined}
                isEdit={!!selectedSede}
            />
        </div>
    );
};

export default Functionary;
