var myChart = echarts.init(document.getElementById('main'));
var geoCoordMap = {
'p1':[113.331788,23.121235],
'p2':[113.332788,23.121335],
'p3':[113.330188,23.122135],
'p4':[113.33128,23.123135],
'p5':[113.33104,23.120135],
'p6':[113.3342,23.1222135],
'p7':[113.3333,23.1235],
'p8':[113.332288,23.124435],
'p9':[113.334588,23.120035],
'p10':[113.333288,23.119935],
'p11':[113.335688,23.11835],
'p12':[113.337888,23.1210135],
'p13':[113.330188,23.121935],
'p14':[113.329088,23.120135],
'p15':[113.333988,23.120035],
'p16':[113.331588,23.122235],
'p17':[113.331688,23.121335],
'p18':[113.333388,23.124435],
'p19':[113.334488,23.125535],
'p20':[113.335588,23.123335],
'p21':[113.331788,23.121235],
'p22':[113.332788,23.121335],
'p23':[113.330188,23.122135],
'p24':[113.33128,23.123135],
'p25':[113.33104,23.120135],
'p26':[113.3342,23.1222135],
'p27':[113.3333,23.1235],
'p28':[113.332288,23.124435],
'p29':[113.334588,23.120035],
'p30':[113.333288,23.119935],
'p31':[113.335688,23.11835],
'p32':[113.337888,23.1210135],
'p33':[113.330188,23.121935],
'p34':[113.329088,23.120135],
'p35':[113.333988,23.120035],
'p36':[113.331588,23.122235],
'p37':[113.331688,23.121335],
'p38':[113.333388,23.124435],
'p39':[113.334488,23.125535],
'p40':[113.335588,23.123335]
};
var value = [
{name:'p1',value:100},
{name:'p2',value:120},
{name:'p3',value:130},
{name:'p4',value:122},
{name:'p5',value:144},
{name:'p6',value:100},
{name:'p7',value:156},
{name:'p8',value:199},
{name:'p9',value:122},
{name:'p10',value:100},
{name:'p11',value:140},
{name:'p12',value:140},
{name:'p13',value:143},
{name:'p14',value:199},
{name:'p15',value:111},
{name:'p16',value:133},
{name:'p17',value:155},
{name:'p18',value:135},
{name:'p19',value:210},
{name:'p20',value:229},
{name:'p21',value:100},
{name:'p22',value:120},
{name:'p23',value:130},
{name:'p24',value:122},
{name:'p25',value:144},
{name:'p26',value:100},
{name:'p27',value:156},
{name:'p28',value:199},
{name:'p29',value:122},
{name:'p30',value:100},
{name:'p31',value:100},
{name:'p32',value:120},
{name:'p33',value:130},
{name:'p34',value:122},
{name:'p35',value:144},
{name:'p36',value:100},
{name:'p37',value:156},
{name:'p38',value:199},
{name:'p39',value:122},
{name:'p40',value:100}
];

var convertData = function (data,n) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push(geoCoord.concat(data[i].value+ (Math.random()-0.5)*n ));
        }
    }
    return res;
};

var option = {
    baseOption: {
        title:{
            text: "Traffic Heat Map",
            link: 'http://blog.csdn.net/yc_1993',
            subtext: "数据模拟,仅为测试",
            left: 'center',
            top: 20,
            textStyle:{
                color: 'red',
                fontSize: 20
            },
            subtextStyle:{
                color: 'white',
                fontSize: 16
            }
        },
        timeline: {
            autoPlay:true,
            data: ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
            axisType: 'category',
            padding: [5,5,5,5],
            playInterval:1500,
            lineStyle:{color:'white'},
            label:{
                normal:{
                    textStyle:{
                        color: 'white',
                        fontSize: 13
                    }
                }
            }
        },
        bmap: {
        center: [-73.97,40.75],
        zoom: 16,
        roam: true,
        mapStyle: {
                       styleJson: [
          {
                    'featureType': 'land',     //调整土地颜色
                    'elementType': 'geometry',
                    'stylers': {
                              'color': '#081734'
                    }
          },
          {
                    'featureType': 'building',   //调整建筑物颜色
                    'elementType': 'geometry',
                    'stylers': {
                              'color': '#04406F'
                    }
          },
         {
                    'featureType': 'building',   //调整建筑物标签是否可视
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'highway',     //调整高速道路颜色
                    'elementType': 'geometry',
                    'stylers': {
                    'color': '#015B99'
                    }
          },
          {
                    'featureType': 'highway',    //调整高速名字是否可视
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'arterial',   //调整一些干道颜色
                    'elementType': 'geometry',
                    'stylers': {
                    'color':'#003051'
                    }
          },
          {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'green',
                    'elementType': 'geometry',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'water',
                    'elementType': 'geometry',
                    'stylers': {
                              'color': '#044161'
                    }
          },
          {
                    'featureType': 'subway',    //调整地铁颜色
                    'elementType': 'geometry.stroke',
                    'stylers': {
                    'color': '#003051'
                    }
          },
          {
                    'featureType': 'subway',
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'railway',
                    'elementType': 'geometry',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'railway',
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'all',     //调整所有的标签的边缘颜色
                    'elementType': 'labels.text.stroke',
                    'stylers': {
                              'color': '#313131'
                    }
          },
          {
                    'featureType': 'all',     //调整所有标签的填充颜色
                    'elementType': 'labels.text.fill',
                    'stylers': {
                              'color': '#FFFFFF'
                    }
          },
          {
                    'featureType': 'manmade',   
                    'elementType': 'geometry',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'manmade',
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'local',
                    'elementType': 'geometry',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'local',
                    'elementType': 'labels',
                    'stylers': {
                    'visibility': 'off'
                    }
          },
          {
                    'featureType': 'subway',
                    'elementType': 'geometry',
                    'stylers': {
                              'lightness': -65
                    }
          },
          {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                              'lightness': -40
                    }
          },
          {
                    'featureType': 'boundary',
                    'elementType': 'geometry',
                    'stylers': {
                              'color': '#8b8787',
                              'weight': '1',
                              'lightness': -29
                    }
          }]
        }
        },
        visualMap: {
           min: 0,
           max: 500,
           splitNumber: 5,
           inRange: {
               color: ['blue', 'green', 'yellow', 'red']
           },
           textStyle: {
               color: '#fff'
           },
           bottom: 30
        },
        series: [{
            type: 'heatmap',
            mapType: 'china',
            coordinateSystem: 'bmap',
            blurSize:50
        }]
    },
    options: [
        {
            series:[{
                data : convertData(value,100)
            }]
        },
        {
            series:[{
                data : convertData(value,200)
            }]
        },
        {
            series:[{
                data : convertData(value,300)
            }]
        },
        {
            series:[{
                data : convertData(value,400)
            }]
        },
        {
            series:[{
                data : convertData(value,500)
            }]
        },
        {
            series:[{
                data : convertData(value,600)
            }]
        },
        {
            series:[{
                data : convertData(value,900)
            }]
        },
        {
            series:[{
                data : convertData(value,700)
            }]
        },
        {
            series:[{
                data : convertData(value,600)
            }]
        },
        {
            series:[{
                data : convertData(value,500)
            }]
        },
        {
            series:[{
                data: convertData(value,300)
            }]
        }
    ]
}
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);