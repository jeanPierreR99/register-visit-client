import { ChartBarra } from '@/components/ChartBarra';
import { Card, CardContent } from '@/components/ui/card';
import TablePending from './components/TablePending';
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface IDashboard {
    today: number;
    thisWeek: number;
    openVisits: number;
    employees: number;
}
const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState<IDashboard>();

    const getDashboard = async () => {
        try {
            setIsLoading(true);
            const res = await API.getDashBoard();
            setRecords(res.data);
        } catch (error) {
            console.error("Error al cargar sedes:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getDashboard()
    }, [])

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <br />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                <NavLink to={"visits"}>
                    <Card className='shadow-lg hover:shadow-xl hover:scale-95 duration-500 bg-blue-400 text-white'>
                        <CardContent>
                            <p className="text-sm">Visitas hoy</p>
                            <h2 className="text-2xl font-bold">{isLoading ? <Loader2 className='animate-spin text-green-500' /> : records?.today}</h2>
                        </CardContent>
                    </Card>
                </NavLink>
                <NavLink to={"visits"}>
                    <Card className='shadow-lg hover:shadow-xl hover:scale-95 duration-500 bg-yellow-200 text-black'>
                        <CardContent>
                            <p className="text-sm">Visitas esta semana</p>
                            <h2 className="text-2xl font-bold">{isLoading ? <Loader2 className='animate-spin text-green-500' /> : records?.thisWeek}</h2>
                        </CardContent>
                    </Card>
                </NavLink>
                <NavLink to={"visits"}>
                    <Card className='shadow-lg hover:shadow-xl hover:scale-95 duration-500 bg-red-400 text-white'>
                        <CardContent>
                            <p className="text-sm">Visitas sin cerrar</p>
                            <h2 className="text-2xl font-bold">{isLoading ? <Loader2 className='animate-spin text-green-500' /> : records?.openVisits}</h2>
                        </CardContent>
                    </Card>
                </NavLink>
                <NavLink to={"visits"}>
                    <Card className='shadow-lg hover:shadow-xl hover:scale-95 duration-500 bg-cyan-300 text-black'>
                        <CardContent>
                            <p className="text-sm">Funcionarios</p>
                            <h2 className="text-2xl font-bold">{isLoading ? <Loader2 className='animate-spin text-green-500' /> : records?.employees}</h2>
                        </CardContent>
                    </Card>
                </NavLink>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <ChartBarra record={records}></ChartBarra>
                <TablePending getDashboard={getDashboard} />
            </div>
        </div>
    );
};

export default Home;