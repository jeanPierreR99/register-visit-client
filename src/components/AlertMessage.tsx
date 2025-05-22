import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

export function AlertMessage({ message }: any) {
    return (
        <Alert className="border-red-500 bg-red-50">
            <Terminal className="h-4 w-4" color="red" />
            <AlertTitle className="text-red-500">Aviso</AlertTitle>
            <AlertDescription className="text-red-600">
                {message}
            </AlertDescription>
        </Alert>
    )
}
