import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

interface AlertWrapperProps {
    type: "success" | "error" | "info";
    title: string;
    description: string;
}

export function AlertWrapper({ type, title, description }: AlertWrapperProps) {
    const config = {
        success: {
            icon: <CheckCircle2 className="h-4 w-4 !text-green-600" />,
            bg: "bg-green-100 border-green-300",
            text: "text-green-600",
        },
        error: {
            icon: <AlertCircle className="h-4 w-4 !text-red-600" />,
            bg: "bg-red-100 border-red-300",
            text: "text-red-600",
        },
        info: {
            icon: <Info className="h-4 w-4 !text-blue-600" />,
            bg: "bg-blue-100 border-blue-300",
            text: "text-blue-600",
        },
    }[type];

    return (
        <Alert variant="default" className={config.bg}>
            {config.icon}
            <AlertTitle className={`${config.text} font-bold`}>{title}</AlertTitle>
            <AlertDescription className={config.text}>{description}</AlertDescription>
        </Alert>
    );
}
