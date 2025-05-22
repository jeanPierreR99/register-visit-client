"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export function ChartBarra({ record }: any) {

    const chartData = [
        { name: "Visitas hoy", value: record?.today },
        { name: "Visitas esta semana", value: record?.thisWeek },
        { name: "Visitas sin cerrar", value: record?.openVisits },
        { name: "Funcionarios", value: record?.employees },
    ]

    const chartConfig = {
        value: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
        mobile: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    } satisfies ChartConfig

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Descripción de la actividad durante la semana </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-[480px]  w-full" config={chartConfig} >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="value"
                            layout="vertical"
                            fill="#00C950"
                            radius={4}
                        >
                            <LabelList
                                dataKey="name"
                                position="insideLeft"
                                offset={8}
                                className="fill-[white] font-bold text-sm"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={8}
                                className="fill-[#00C950]"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
