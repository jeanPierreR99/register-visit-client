import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStoreLogin from "./store/useStoreLogin";
import { saveStorage } from "@/lib/functions";
import { API } from "@/lib/api";
import { AlertMessage } from "@/components/AlertMessage";

const LoginSchema = z.object({
    user: z.string().min(1, "Campo requerido."),
    password_hash: z.string().min(1, "Campo requerido."),
});

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<any>("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useStoreLogin();

    const loginForm = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    async function onSubmitLogin(user: z.infer<typeof LoginSchema>) {
        setMessage("");
        try {
            setLoading(true);
            const response = await API.loginUser(user);
            const userData = response.data;
            saveStorage(userData);
            login(
                userData.id,
                userData.role.name,
                userData.name,
                userData.office?.sede.name || null,
                userData.office?.name || null,
                userData.office?.id || null
            );
            window.location.reload();
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if ((error as any)?.response?.data?.error == "Unauthorized") {
                setMessage("Credenciales incorrectas");
                return;
            }
            setMessage("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid h-[100dvh] bg-gray-50 grid-cols-1 md:grid-cols-2">
            <div className="hidden relative md:flex items-center justify-center bg-white">
                <div className="background-image"></div>
            </div>

            <div className="flex items-center justify-center p-8 sm:p-4 bg-white md:bg-transparent">
                <div className="w-full max-w-lg space-y-8 bg-white p-8 sm:p-6 rounded-2xl shadow-green-300/20 shadow-2xl">
                    <img src="logo.png" className="w-full object-contain h-40 m-auto" alt="" />
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-xl font-black text-orange-500 mb-2">MUNIVISITAS</h1>
                        <p className="mt-2 text-sm text-gray-400">Inicia sesión para continuar</p>
                    </div>


                    {loading && (
                        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl">
                            <Loader2 className="animate-spin text-green-500 w-10 h-10" />
                        </div>
                    )}

                    <FormProvider {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-6 relative">
                            <div className="space-y-4">
                                <FormField
                                    control={loginForm.control}
                                    name="user"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Usuario</FormLabel>
                                            <FormControl>
                                                <Input className="bg-gray-100 w-full rounded-md" placeholder="Usuario" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password_hash"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Contraseña</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        className="bg-gray-100 w-full rounded-md pr-10"
                                                        placeholder="Contraseña"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {message && <AlertMessage message={message} />}
                            </div>

                            <div className="flex flex-col md:flex-row items-left gap-2 justify-between">
                                <div className="flex items-center">
                                    <input type="checkbox" id="rememberMe" className="mr-2" />
                                    <label htmlFor="rememberMe" className="text-sm text-gray-600">Recordar contraseña</label>
                                </div>
                                <a href="#" className="text-sm text-green-500 hover:underline">¿Olvidaste tu contraseña?</a>
                            </div>

                            <div className="my-4 border-t border-gray-200"></div>

                            <Button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-400 text-white text-lg font-semibold rounded-lg py-3 transition-all"
                            >
                                Iniciar sesión
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">¿No tienes cuenta? <a href="#" className="text-green-500 hover:underline">Regístrate</a></p>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
};

export default Login;
