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
import { useEffect } from "react";
import { z } from "zod";
import { ISede } from "@/lib/interface";

interface SedeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ISede) => void;
    defaultValues?: ISede;
    isEdit: boolean;
}

const schema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    address: z.string().min(1, "La dirección es obligatoria"),
});

type FormValues = z.infer<typeof schema>;

export const SedeModal = ({
    isOpen,
    onClose,
    onSubmit,
    defaultValues,
    isEdit,
}: SedeModalProps) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues || {
            name: "",
            address: "",
        },
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
        form.reset();
    };

    useEffect(() => {
        if (isOpen) {
            form.reset(defaultValues || { name: "", address: "" });
        }
    }, [isOpen, defaultValues, form]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Editar sede" : "Registrar nueva sede"}
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
