import { TooltipWrapper } from "@/components/TooltipWrapper"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { API_BASE } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, DownloadCloudIcon } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"


const today = new Date();


export function DateRangePicker({ id }: any) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: today,
        to: today,
    });
    const from = dateRange?.from ? format(dateRange.from, "PPP", { locale: es }) : ""
    const to = dateRange?.to ? format(dateRange.to, "PPP", { locale: es }) : ""

    return (
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-fit md:max-w-full max-w-[300px] overflow-hidden justify-start text-left font-normal ",
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {from} - {to}
                                </>
                            ) : (
                                from
                            )
                        ) : (
                            <span>Seleccionar fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={es}
                    />
                </PopoverContent>
            </Popover>
            <TooltipWrapper content="Descargar datos">
                <a href={`${API_BASE}/report/office/${id}?start=${dateRange?.from}&end=${dateRange?.to}`} className=" text-gray-500 hover:bg-gray-100 duration-500 rounded-md hover:text-gray-600 p-2">
                    <DownloadCloudIcon />
                </a>
            </TooltipWrapper>
        </div >
    )
}
