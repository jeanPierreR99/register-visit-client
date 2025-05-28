import { useEffect, useState } from "react";
import { Trash2, } from "lucide-react";
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
import { API, API_UPLOAD } from "@/lib/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { useParams } from "react-router-dom";
import { DateRangePicker } from "./components/DateRangePicker";

const ObservationOffice = () => {
    const { id } = useParams();
    const { name } = useParams();
    const { sede } = useParams();
    const [records, setRecords] = useState<IVisit[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await API.getVisitsFilter(currentPage, itemsPerPage, id);
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

    const handleDelete = async (id: string) => {
        try {
            await API.deleteVisit(id);
            fetchData();
        } catch (err) {
            console.error("Error al eliminar sede:", err);
        }
    };

    const filtered = records.filter((record) =>
        record.name.toLowerCase().includes(search.toLowerCase()) || record.dni.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(total / itemsPerPage);

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-xl font-semibold mb-2">Registro de Visitas</h2>
            {name && sede && <div className="text-sm text-gray-400">
                <p className="font-black">{name}</p>
                <p>{sede}</p>
            </div>}
            <DateRangePicker id={id} />
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
                            <th className="px-4 py-3 border">Descripción</th>
                            <th className="px-4 py-3 border">Funcionario público</th>
                            <th className="px-4 py-3 border ">Oficina</th>
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
                                    </td>
                                    <td className="px-4 py-2">{record.reason}</td>
                                    <td className="px-4 py-2">{record.description || "____"}</td>
                                    <td className="px-4 py-2">{record.functionary?.name || "____"}</td>
                                    <td className="px-4 py-2 max-w-[220px]">{`${record.functionary?.office?.name || ""} - ${record.functionary?.office?.floor || ""} (${record.functionary?.office?.sede?.name || "s/o"})`}</td>
                                    <td className="px-4 py-2">{new Date(record.check_in_time).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2">{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : "____"}</td>
                                    <td className="px-4 py-2 text-end">

                                        <TooltipWrapper content="Eliminar Visita">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDelete(record.id!)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TooltipWrapper>
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

            {
                totalPages > 1 && (
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
                )
            }

        </div >
    );
};

export default ObservationOffice;
