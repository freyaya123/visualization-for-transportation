var chart2option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['Number of Taxi Running','Average Speed']
    },
    xAxis: [
        {
            type: 'category',
            data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
            '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: 'Number',
            min: 0,
            max: 600,
            interval: 50,
            axisLabel: {
                formatter: '{value} ml'
            }
        },
        {
            type: 'value',
            name: 'Speed',
            min: 0,
            max: 15,
            interval: 5,
            axisLabel: {
                formatter: '{value} °C'
            }
        }
    ],
    series: [
        {
            name:'Number',
            type:'bar',
            data:[125, 86, 51, 45, 26, 59, 207, 364, 416, 406, 324, 316, 331, 330, 344, 386, 339, 397, 453, 502, 434, 429, 393, 286]
        },
        {
            name:'Speed',
            type:'line',
            yAxisIndex: 1,
            data:[8.118087055769834, 8.480844278313999, 9.300150287768576, 8.48554108500016, 11.755780053804186, 10.57430946407759, 8.042057633825037, 5.498799122557736, 3.5213793790937484, 4.520899789297898, 4.555298087808668, 3.3721010969980463, 3.3271842502337976, 3.842833015813565, 4.8487851277065, 5.1768866116286105, 3.893180152965215, 5.008225402343332, 4.69831144196241, 4.656487002304538, 5.00380977819788, 5.752256712525308, 7.099563870069367, 7.706313651921054]
        }
    ]
};

function getLineBar() {
    /*
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            data:['Number of Taxi Running','Average Speed']
        },
        xAxis: [
            {
                type: 'category',
                data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
                '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Number',
                min: 0,
                max: 600,
                interval: 50,
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: 'Speed',
                min: 0,
                max: 15,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name:'Number',
                type:'bar',
                data:[125, 86, 51, 45, 26, 59, 207, 364, 416, 406, 324, 316, 331, 330, 344, 386, 339, 397, 453, 502, 434, 429, 393, 286]
            },
            {
                name:'Speed',
                type:'line',
                yAxisIndex: 1,
                data:[8.118087055769834, 8.480844278313999, 9.300150287768576, 8.48554108500016, 11.755780053804186, 10.57430946407759, 8.042057633825037, 5.498799122557736, 3.5213793790937484, 4.520899789297898, 4.555298087808668, 3.3721010969980463, 3.3271842502337976, 3.842833015813565, 4.8487851277065, 5.1768866116286105, 3.893180152965215, 5.008225402343332, 4.69831144196241, 4.656487002304538, 5.00380977819788, 5.752256712525308, 7.099563870069367, 7.706313651921054]
            }
        ]
    };
    */
    var domChart2 = document.getElementById("statsChart2");
    var statChart2_ = echarts.init(domChart2);
    if (chart2option && typeof chart2option === "object") {
    statChart2_.setOption(chart2option, true);
    }
}

