import { create } from 'zustand';


interface ILogin {
    isLogIn: boolean;
    id: string;
    role: string;
    name: string;
    sede: string;
    office: string;
    officeId: string | null;
    login: (id: string, role: string, name: string, sede: string, office: string, officeId: string) => void;
    logout: () => void;
}



const useStoreLogin = create<ILogin>((set) => ({
    isLogIn: false,
    id: "",
    role: "",
    name: "",
    sede: "",
    office: "",
    officeId: null,
    login: (id, role, name, sede, office, officeId) => set(() => ({ isLogIn: true, id, role, name, sede, office, officeId })),
    logout: () => set(() => ({ isLogIn: false, id: "", role: "", name: "", sede: "", office: "", officeId: "" }))
}));

export default useStoreLogin;