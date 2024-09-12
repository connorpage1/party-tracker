import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/GlobalProvider"
import toast from "react-hot-toast"
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const RevenueChart = () => {
    const { JWTHeader } = useContext(GlobalContext)
    const [data, setData] = useState({})
    
    useEffect(() => {
        fetch(`/api/v1/parties/revenue_by_month`, {
            method: 'GET',
            headers: {
                ...JWTHeader
            }
        })
            .then(res => {
                const data = res.json()
                if (res.ok) {
                    data.then(setData)
                } else {
                    const error = data.error || data.msg
                    throw (error)
                }
            })
            .catch(error => toast.error(error))

    }, [])

    const chartData = []

    for (const year in data) {
        chartData.push({
            type: "spline",
            name: year,
            showInLegend: true,
            dataPoints: [
                { y: data[year].January, label: "Jan" },
                { y: data[year].February, label: "Feb" },
                { y: data[year].March, label: "Mar" },
                { y: data[year].April, label: "Apr" },
                { y: data[year].May, label: "May" },
                { y: data[year].June, label: "Jun" },
                { y: data[year].July, label: "Jul" },
                { y: data[year].August, label: "Aug" },
                { y: data[year].September, label: "Sept" },
                { y: data[year].October, label: "Oct" },
                { y: data[year].November, label: "Nov" },
                { y: data[year].December, label: "Dec" }
            ]
        })
    }

    const options = {
        animationEnabled: true,	
        title:{
            text: "Party Revenue by Month"
        },
        axisY : {
            title: "Revenue ($)"
        },
        toolTip: {
            shared: true
        },
        data: chartData
    }
    
    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    )
}

export default RevenueChart