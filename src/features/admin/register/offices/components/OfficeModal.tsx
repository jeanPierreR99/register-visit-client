import { useEffect, useState } from "react";
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
import { IOffice, ISede } from "@/lib/interface";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { API } from "@/lib/api";

interface SedeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IOffice) => void;
    defaultValues?: IOffice;
    isEdit: boolean;
}

const schema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    floor: z.string().min(1, "La dirección es obligatoria"),
    sedeId: z.string().min(1, "La sede es obligatoria"),
});

type FormValues = z.infer<typeof schema>;

export const OfficeModal = ({
    isOpen,
    onClose,
    onSubmit,
    defaultValues,
    isEdit,
}: SedeModalProps) => {
    const [sedes, setSedes] = useState<ISede[]>([]);

    const handleSedes = async () => {
        try {
            const response = await API.getSedes();
            setSedes(response.data);
        }
        catch (error) {
            console.error("Error fetching sedes:", error);
        }
    }
    useEffect(() => {
        handleSedes()
    }, [isOpen]);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues || {
            name: "",
            floor: "",
            sedeId: "",
        },
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
        form.reset();
    };

    useEffect(() => {
        if (isOpen) {
            if (defaultValues) {
                form.reset({
                    ...defaultValues,
                    sedeId: defaultValues.sede?.id || "",
                });
            } else {
                form.reset({ name: "", floor: "", sedeId: "" });
            }
        }
    }, [isOpen, defaultValues, form]);


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Editar oficina" : "Registrar nueva oficina"}
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
                            name="floor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Piso</FormLabel>
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
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={sedes.length === 0}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona una sede" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sedes.map((sede) => (
                                                    <SelectItem key={sede.id} value={sede.id!}>
                                                        {sede.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
