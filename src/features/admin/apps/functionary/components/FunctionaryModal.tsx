import { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ifunctionary } from "@/lib/interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API } from "@/lib/api";
import { getStorage } from "@/lib/functions";

interface SedeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Ifunctionary) => void;
    defaultValues?: Ifunctionary;
    isEdit: boolean;
}

interface Site {
    id: string;
    name: string;
    address: string;
    offices: {
        id: string;
        name: string;
        floor: string;
    }[];
}


const schema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    sedeId: z.string().min(1, "La sede es obligatoria"),
    officeId: z.string().min(1, "La oficina es obligatoria"),
});

type FormValues = z.infer<typeof schema>;

export const FunctionaryModal = ({
    isOpen,
    onClose,
    onSubmit,
    defaultValues,
    isEdit,
}: SedeModalProps) => {
    const [sites, setSites] = useState<Site[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState<string>("");

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            sedeId: "",
            officeId: "",
        },
    });

    const offices = useMemo(() => {
        const site = sites.find((s) => s.id === selectedSiteId);
        return site?.offices ?? [];
    }, [selectedSiteId, sites]);

    const fetchSites = async () => {
        try {
            const response = await API.getSedes();
            setSites(response.data);
        } catch (error) {
            console.error("Error al obtener las sedes:", error);
        }
    };

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
        form.reset();
    };

    const user = getStorage();

    useEffect(() => {
        if (isOpen) {
            fetchSites();

            if (defaultValues) {
                const sedeId = defaultValues.office?.sede?.id || "";
                const officeId = defaultValues.office?.id || "";

                setSelectedSiteId(sedeId);

                form.reset({
                    name: defaultValues.name,
                    sedeId,
                    officeId,
                });
            } else {
                const sedeId = user?.office?.sede?.id || "";
                const officeId = user?.office?.id || "";

                setSelectedSiteId(sedeId);

                form.reset({
                    name: "",
                    sedeId,
                    officeId,
                });
            }
        }
    }, [isOpen, defaultValues]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Editar funcionario" : "Registrar nuevo funcionario"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sedeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sede</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedSiteId(value);
                                            form.setValue("officeId", "");
                                        }}
                                        value={field.value}
                                        disabled
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una sede" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sites.map((site) => (
                                                <SelectItem key={site.id} value={site.id}>
                                                    {site.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="officeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Oficina</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una oficina" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {offices.map((office) => (
                                                <SelectItem key={office.id} value={office.id}>
                                                    {office.name} ({office.floor})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
    );
};
