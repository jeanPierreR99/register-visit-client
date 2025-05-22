import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Ifunctionary, IVisit } from "@/lib/interface"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { API } from "@/lib/api"
import { getDay } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import useStoreLogin from "@/features/login/store/useStoreLogin"

interface VisitModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    defaultValues?: IVisit
    isEdit: boolean
}

const schema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    dni: z.string()
        .length(8, "El DNI debe tener exactamente 8 caracteres"),
    entity: z.string().min(1, "La entidad es obligatoria"),
    reason: z.string().min(1, "El motivo es obligatorio"),
    functionaryId: z.string().min(1, "El funcionario es obligatorio"),
    check_in_time: z.string().optional(),
    check_out_time: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export const VisitModal = ({
    isOpen,
    onClose,
    onSubmit,
    defaultValues,
    isEdit,
}: VisitModalProps) => {
    const [functionaries, setFunctionaries] = useState<Ifunctionary[]>([])
    const [photoBase64, setPhotoBase64] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { id } = useStoreLogin();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            dni: "",
            entity: "",
            reason: "",
            functionaryId: "",
            check_in_time: "",
            check_out_time: "",
        },
    })

    const fetchFunctionaries = async () => {
        try {
            const response = await API.getFunctionaries()
            setFunctionaries(response.data)
        } catch (error) {
            console.error("Error al obtener funcionarios", error)
        }

    }

    const isoDate = (value: string) => {
        const [hours, minutes] = value.split(':').map(Number);
        const baseDate = new Date();
        baseDate.setHours(hours);
        baseDate.setMinutes(minutes);
        baseDate.setSeconds(0);
        baseDate.setMilliseconds(0);
        return baseDate.toISOString();
    }

    function base64ToFile(base64: string, filename: string): File {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }


    const handleSubmit = async (values: FormValues) => {
        const formData = new FormData();

        if (photoBase64) {
            const file = base64ToFile(photoBase64, 'photo.jpg');
            formData.append('photo', file);
        }

        formData.append('name', values.name);
        formData.append('dni', values.dni);
        formData.append('reason', values.reason);
        formData.append('entity', values.entity || '');
        formData.append('check_in_time', isEdit ? isoDate(values.check_in_time!) : getDay());

        if (isEdit && values.check_out_time) {
            formData.append('check_out_time', isoDate(values.check_out_time!));
        }

        if (values.functionaryId) {
            formData.append('functionaryId', values.functionaryId);
        }

        formData.append('registeredById', id);

        onSubmit(formData);

        form.reset();
        setPhotoBase64(null);
    };


    const fetchPersonData = async (dni: string) => {
        if (dni.length !== 8) return
        setLoading(true)
        try {
            const response = await API.getDashBoardDni(dni)
            const datos = response.data?.datosPersona
            if (datos) {
                const fullName = `${datos.apPrimer} ${datos.apSegundo} ${datos.prenombres}`.trim()
                form.setValue("name", fullName)
                if (datos.foto) {
                    setPhotoBase64(`data:image/jpeg;base64,${datos.foto}`)
                } else {
                    setPhotoBase64(null)
                }
            }
        } catch (error) {
            console.error("Error al consultar datos de persona", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen && defaultValues) {
            form.reset({
                name: defaultValues.name,
                dni: defaultValues.dni,
                entity: defaultValues.entity,
                reason: defaultValues.reason,
                functionaryId: defaultValues.functionary?.id || "",
                check_in_time: defaultValues.check_in_time
                    ? new Date(defaultValues.check_in_time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })
                    : "",
                check_out_time: defaultValues.check_out_time
                    ? new Date(defaultValues.check_out_time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })
                    : "",
            })
        } else {
            form.reset({})
            fetchFunctionaries()
            setPhotoBase64(null)
        }
    }, [isOpen, defaultValues])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar visita" : "Registrar visita"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dni"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DNI</FormLabel>
                                        <FormControl>
                                            <Input disabled={isEdit && true} type="number" {...field} onChange={(e) => {
                                                if (e.target.value.length <= 8) {
                                                    field.onChange(e);
                                                    fetchPersonData(e.target.value);
                                                }
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre completo</FormLabel>
                                        <FormControl>
                                            <Input disabled={isEdit && true} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {loading && <Loader2 className="animate-spin text-green-500" />}
                            {photoBase64 && (
                                <div className="flex justify-left">
                                    <img
                                        src={photoBase64}
                                        alt="Foto del visitante"
                                        className="w-30 h-30 rounded-md object-contain bg-gray-200 border-green-400 border-2"
                                    />
                                </div>
                            )}
                            <div>
                                <FormField
                                    control={form.control}
                                    name="entity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Entidad</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Motivo</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona un motivo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Reunión de Trabajo">Reunión de Trabajo</SelectItem>
                                                <SelectItem value="Motivos Académicos">Motivos Académicos</SelectItem>
                                                <SelectItem value="Entrega de Documentos">Entrega de Documentos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="functionaryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Funcionario</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona un funcionario" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {functionaries.map((f) => (
                                                    <SelectItem key={f.id} value={f.id!}>
                                                        {f.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isEdit && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="check_in_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hora de ingreso</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="check_out_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hora de salida</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button className="bg-green-500 hover:bg-green-400" type="submit">
                                {isEdit ? "Actualizar" : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
