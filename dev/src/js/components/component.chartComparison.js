import { createChart, LineStyle } from 'lightweight-charts'

export default {
    globals: {
        elem: document.querySelectorAll(".chart-comparison"),
    },

    init() {
        this.globals.elem.forEach((chartComparison) => {
            this.createChart({
                elem: chartComparison,
                endpoint1: chartComparison.dataset.endpoint1,
                endpoint2: chartComparison.dataset.endpoint2,
            })
        })
    },

    createChart(obj) {
        const chart = createChart(obj.elem, {
            width: 520,
            height: 320,
            layout: {
                background: { color: "#171B26" },
                textColor: "#ADB0B9"
            },
            grid: {
                vertLines: { color: "#31343F" },
                horzLines: { color: "#31343F" },
            },
        })

        const areaSeries1 = chart.addAreaSeries({
            lastValueVisible: true,
            crosshairMarkerVisible: true,
            lineColor: "#3F81FF",
            topColor: "rgba(63, 129, 255, 0.5)",
            bottomColor: "rgba(63, 129, 255, 0.1)",
        })

        if (obj.areaSeries1Data) {
            areaSeries1.setData(obj.areaSeries1Data)
        } else {
            this.dataChart(areaSeries1, obj.endpoint1) //"https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=325"
        }
        const lineWidth = 2
        // areaSeries1.createPriceLine({ price: obj.linedata[0], color: '#be1238', lineWidth: lineWidth, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: 'inception level'})
        areaSeries1.createPriceLine({ price: obj.linedata[1], color: '#f5a742', lineWidth: lineWidth, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: 'soft ceiling' })
        areaSeries1.createPriceLine({ price: obj.linedata[2], color: '#42f5dd', lineWidth: lineWidth, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: 'buffer start' })
        areaSeries1.createPriceLine({ price: obj.linedata[3], color: '#be1238', lineWidth: lineWidth, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: 'buffer end' })

        // const areaSeries2 = chart.addAreaSeries({
        //     lastValueVisible: true,
        //     crosshairMarkerVisible: true,
        //     lineColor: "#A3FF5B",
        //     topColor: "rgba(163, 255, 91, 0.5)",
        //     bottomColor: "rgba(163, 255, 91, 0.1)",
        // })
        
        // if (obj.areaSeries2Data) {
        //     areaSeries2.setData(obj.areaSeries2Data)
        // } else {
        //     this.dataChart(areaSeries2, obj.endpoint2) //"https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=1d&limit=325"
        // }

        chart.timeScale().fitContent()
        chart.resize(obj.elem.parentElement.offsetWidth, obj.elem.parentElement.offsetHeight)
        window.addEventListener("resize", () => {
            chart.resize(obj.elem.parentElement.offsetWidth, obj.elem.parentElement.offsetHeight)
        })
    },

    dataChart(chartSeries, chartEndpoint) {
        fetch(chartEndpoint)
            .then((res) => res.json())
            .then((data) => {
                const chartData = data.map((d) => {
                    return {
                        time: d[0]/1000, 
                        value: parseFloat(d[4])
                    }
                })
                chartSeries.setData(chartData)
            })
            .catch((err) => console.error(err))
    },
}