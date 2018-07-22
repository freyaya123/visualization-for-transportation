var COLORS = ["#070093", "#1c3fbf", "#1482e5", "#70b4eb", "#b4e0f3", "#ffffff"];
var lngExtent = [40.5, 41];
var latExtent = [-74.1, -73.6];
var cellCount = [10, 30];
var cellSizeCoord = [
    (lngExtent[1] - lngExtent[0]) / cellCount[0],
    (latExtent[1] - latExtent[0]) / cellCount[1]
];
var gapSize = 0;
function getGrid(hour=0) {


    data0 = {"data": [[0, 0, "Unknown"], [0, 1, "Unknown"], [0, 2, "Unknown"], [0, 3, "Unknown"], [0, 4, "Unknown"], [0, 5, "Unknown"], [0, 6, "Unknown"], [0, 7, "Unknown"], [0, 8, "Unknown"], [0, 9, "Unknown"], [1, 0, "Unknown"], [1, 1, "Unknown"], [1, 2, "Unknown"], [1, 3, "Unknown"], [1, 4, "Unknown"], [1, 5, "Unknown"], [1, 6, "Unknown"], [1, 7, "Unknown"], [1, 8, "Unknown"], [1, 9, "Unknown"], [2, 0, "Unknown"], [2, 1, "Unknown"], [2, 2, "Unknown"], [2, 3, "Unknown"], [2, 4, "Unknown"], [2, 5, "Unknown"], [2, 6, "Unknown"], [2, 7, "Unknown"], [2, 8, "Unknown"], [2, 9, "Unknown"], [3, 0, "Unknown"], [3, 1, "Unknown"], [3, 2, "Unknown"], [3, 3, "Unknown"], [3, 4, "Unknown"], [3, 5, "Unknown"], [3, 6, "Unknown"], [3, 7, "Unknown"], [3, 8, "Unknown"], [3, 9, "Unknown"], [4, 0, "Unknown"], [4, 1, "Unknown"], [4, 2, "Unknown"], [4, 3, "Unknown"], [4, 4, "Unknown"], [4, 5, "Unknown"], [4, 6, "Unknown"], [4, 7, "Unknown"], [4, 8, "Unknown"], [4, 9, "Unknown"], [5, 0, "Unknown"], [5, 1, "Unknown"], [5, 2, "Unknown"], [5, 3, "Unknown"], [5, 4, "Unknown"], [5, 5, "Unknown"], [5, 6, "Unknown"], [5, 7, "Unknown"], [5, 8, "Unknown"], [5, 9, "Unknown"], [6, 0, "Unknown"], [6, 1, "Unknown"], [6, 2, "Unknown"], [6, 3, "Unknown"], [6, 4, "Unknown"], [6, 5, "Unknown"], [6, 6, "Unknown"], [6, 7, "Unknown"], [6, 8, "Unknown"], [6, 9, "Unknown"], [7, 0, "Unknown"], [7, 1, "Unknown"], [7, 2, "Unknown"], [7, 3, "Unknown"], [7, 4, "Unknown"], [7, 5, "Unknown"], [7, 6, "Unknown"], [7, 7, "Unknown"], [7, 8, "Unknown"], [7, 9, "Unknown"], [8, 0, "Unknown"], [8, 1, "Unknown"], [8, 2, "Unknown"], [8, 3, "Unknown"], [8, 4, "Unknown"], [8, 5, "Unknown"], [8, 6, "Unknown"], [8, 7, "Unknown"], [8, 8, "Unknown"], [8, 9, "Unknown"], [9, 0, "Unknown"], [9, 1, "Unknown"], [9, 2, "Unknown"], [9, 3, "Unknown"], [9, 4, "Unknown"], [9, 5, "Unknown"], [9, 6, "Unknown"], [9, 7, 3], [9, 8, "Unknown"], [9, 9, "Unknown"], [10, 0, "Unknown"], [10, 1, "Unknown"], [10, 2, "Unknown"], [10, 3, "Unknown"], [10, 4, "Unknown"], [10, 5, "Unknown"], [10, 6, 4], [10, 7, 4], [10, 8, 4], [10, 9, "Unknown"], [11, 0, "Unknown"], [11, 1, "Unknown"], [11, 2, "Unknown"], [11, 3, "Unknown"], [11, 4, "Unknown"], [11, 5, "Unknown"], [11, 6, 2], [11, 7, 3], [11, 8, 4], [11, 9, 4], [12, 0, "Unknown"], [12, 1, "Unknown"], [12, 2, "Unknown"], [12, 3, "Unknown"], [12, 4, "Unknown"], [12, 5, "Unknown"], [12, 6, 4], [12, 7, 2], [12, 8, 2], [12, 9, "Unknown"], [13, 0, "Unknown"], [13, 1, "Unknown"], [13, 2, "Unknown"], [13, 3, "Unknown"], [13, 4, "Unknown"], [13, 5, "Unknown"], [13, 6, 3], [13, 7, 2], [13, 8, "Unknown"], [13, 9, "Unknown"], [14, 0, "Unknown"], [14, 1, "Unknown"], [14, 2, "Unknown"], [14, 3, "Unknown"], [14, 4, "Unknown"], [14, 5, "Unknown"], [14, 6, "Unknown"], [14, 7, "Unknown"], [14, 8, "Unknown"], [14, 9, "Unknown"], [15, 0, "Unknown"], [15, 1, "Unknown"], [15, 2, "Unknown"], [15, 3, "Unknown"], [15, 4, "Unknown"], [15, 5, "Unknown"], [15, 6, "Unknown"], [15, 7, "Unknown"], [15, 8, "Unknown"], [15, 9, "Unknown"], [16, 0, "Unknown"], [16, 1, "Unknown"], [16, 2, "Unknown"], [16, 3, "Unknown"], [16, 4, "Unknown"], [16, 5, "Unknown"], [16, 6, "Unknown"], [16, 7, "Unknown"], [16, 8, "Unknown"], [16, 9, "Unknown"], [17, 0, "Unknown"], [17, 1, "Unknown"], [17, 2, "Unknown"], [17, 3, "Unknown"], [17, 4, "Unknown"], [17, 5, "Unknown"], [17, 6, "Unknown"], [17, 7, "Unknown"], [17, 8, "Unknown"], [17, 9, "Unknown"], [18, 0, "Unknown"], [18, 1, "Unknown"], [18, 2, "Unknown"], [18, 3, "Unknown"], [18, 4, "Unknown"], [18, 5, "Unknown"], [18, 6, "Unknown"], [18, 7, "Unknown"], [18, 8, "Unknown"], [18, 9, "Unknown"], [19, 0, "Unknown"], [19, 1, "Unknown"], [19, 2, "Unknown"], [19, 3, "Unknown"], [19, 4, "Unknown"], [19, 5, "Unknown"], [19, 6, "Unknown"], [19, 7, "Unknown"], [19, 8, "Unknown"], [19, 9, "Unknown"], [20, 0, "Unknown"], [20, 1, "Unknown"], [20, 2, "Unknown"], [20, 3, "Unknown"], [20, 4, "Unknown"], [20, 5, "Unknown"], [20, 6, "Unknown"], [20, 7, "Unknown"], [20, 8, "Unknown"], [20, 9, "Unknown"], [21, 0, "Unknown"], [21, 1, "Unknown"], [21, 2, "Unknown"], [21, 3, "Unknown"], [21, 4, "Unknown"], [21, 5, "Unknown"], [21, 6, "Unknown"], [21, 7, "Unknown"], [21, 8, "Unknown"], [21, 9, "Unknown"], [22, 0, "Unknown"], [22, 1, "Unknown"], [22, 2, "Unknown"], [22, 3, "Unknown"], [22, 4, "Unknown"], [22, 5, "Unknown"], [22, 6, "Unknown"], [22, 7, "Unknown"], [22, 8, "Unknown"], [22, 9, "Unknown"], [23, 0, "Unknown"], [23, 1, "Unknown"], [23, 2, "Unknown"], [23, 3, "Unknown"], [23, 4, "Unknown"], [23, 5, "Unknown"], [23, 6, "Unknown"], [23, 7, "Unknown"], [23, 8, "Unknown"], [23, 9, "Unknown"], [24, 0, "Unknown"], [24, 1, "Unknown"], [24, 2, "Unknown"], [24, 3, "Unknown"], [24, 4, "Unknown"], [24, 5, "Unknown"], [24, 6, "Unknown"], [24, 7, "Unknown"], [24, 8, "Unknown"], [24, 9, "Unknown"], [25, 0, "Unknown"], [25, 1, "Unknown"], [25, 2, "Unknown"], [25, 3, "Unknown"], [25, 4, "Unknown"], [25, 5, "Unknown"], [25, 6, "Unknown"], [25, 7, "Unknown"], [25, 8, "Unknown"], [25, 9, "Unknown"], [26, 0, "Unknown"], [26, 1, "Unknown"], [26, 2, "Unknown"], [26, 3, "Unknown"], [26, 4, "Unknown"], [26, 5, "Unknown"], [26, 6, "Unknown"], [26, 7, "Unknown"], [26, 8, "Unknown"], [26, 9, "Unknown"], [27, 0, "Unknown"], [27, 1, "Unknown"], [27, 2, "Unknown"], [27, 3, "Unknown"], [27, 4, "Unknown"], [27, 5, "Unknown"], [27, 6, "Unknown"], [27, 7, "Unknown"], [27, 8, "Unknown"], [27, 9, "Unknown"], [28, 0, "Unknown"], [28, 1, "Unknown"], [28, 2, "Unknown"], [28, 3, "Unknown"], [28, 4, "Unknown"], [28, 5, "Unknown"], [28, 6, "Unknown"], [28, 7, "Unknown"], [28, 8, "Unknown"], [28, 9, "Unknown"], [29, 0, "Unknown"], [29, 1, "Unknown"], [29, 2, "Unknown"], [29, 3, "Unknown"], [29, 4, "Unknown"], [29, 5, "Unknown"], [29, 6, "Unknown"], [29, 7, "Unknown"], [29, 8, "Unknown"], [29, 9, "Unknown"]]};
    //filepath="../static/data/grid/"+hour+".json";
    //console.log(filepath);
    data = data0.data;
    option = {
        tooltip: {},
        visualMap: {
            type: 'piecewise',
            inverse: true,
            top: 10,
            left: 10,
            pieces: [{
                value: "unknown", color: COLORS[0]
            }, {
                value: 1, color: COLORS[1]
            }, {
                value: 2, color: COLORS[2]
            }, {
                value: 3, color: COLORS[3]
            }, {
                value: 4, color: COLORS[4]
            }, {
                value: 5, color: COLORS[5]
            }],
            borderColor: '#ccc',
            borderWidth: 2,
            backgroundColor: '#eee',
            dimension: 2,
            inRange: {
                color: COLORS,
                opacity: 0.7
            }
        },
        series: [
            {
                type: 'custom',
                coordinateSystem: 'bmap',
                renderItem: renderItem,
                animation: false,
                itemStyle: {
                    emphasis: {
                        color: 'yellow'
                    }
                },
                encode: {
                    tooltip: 2
                },
                data: data
            }
        ],
        bmap: {
            center: [-73.97, 40.75],
            zoom: 10,
            roam: true,
            mapStyle: {
                styleJson: [{
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'land',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#f3f3f3'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#999999'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'poi',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'label',
                    'elementType': 'labels.text.fill',
                    'stylers': {
                        'color': 'rgba(0,0,0,0)'
                    }
                }]
            }
        }
    };
    $("#mapContainer").empty();
        var dom = document.getElementById("mapContainer");
        var myChart = echarts.init(dom);
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
    }
    /*
    $.getJSON(filepath, function(data) {
        console.log(".....");
        console.log(data);
        option = {
            tooltip: {},
            visualMap: {
                type: 'piecewise',
                inverse: true,
                top: 10,
                left: 10,
                pieces: [{
                    value: 0, color: COLORS[0]
                }, {
                    value: 1, color: COLORS[1]
                }, {
                    value: 2, color: COLORS[2]
                }, {
                    value: 3, color: COLORS[3]
                }, {
                    value: 4, color: COLORS[4]
                }, {
                    value: 5, color: COLORS[5]
                }],
                borderColor: '#ccc',
                borderWidth: 2,
                backgroundColor: '#eee',
                dimension: 2,
                inRange: {
                    color: COLORS,
                    opacity: 0.7
                }
            },
            series: [
                {
                    type: 'custom',
                    coordinateSystem: 'bmap',
                    renderItem: renderItem,
                    animation: false,
                    itemStyle: {
                        emphasis: {
                            color: 'yellow'
                        }
                    },
                    encode: {
                        tooltip: 2
                    },
                    data: data
                }
            ],
            bmap: {
                center: [-73.97, 40.75],
                zoom: 14,
                roam: true,
                mapStyle: {
                    styleJson: [{
                        'featureType': 'water',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'land',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#f3f3f3'
                        }
                    }, {
                        'featureType': 'railway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'highway',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#999999'
                        }
                    }, {
                        'featureType': 'highway',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'geometry',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'geometry.fill',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'poi',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'green',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'subway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'manmade',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'local',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'boundary',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'building',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'label',
                        'elementType': 'labels.text.fill',
                        'stylers': {
                            'color': 'rgba(0,0,0,0)'
                        }
                    }]
                }
            }
        };
        $("#mapContainer").empty();
        var dom = document.getElementById("mapContainer");
        var myChart = echarts.init(dom);
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    });
    */
}

function renderItem(params, api) {
    var context = params.context;
    var lngIndex = api.value(0);
    var latIndex = api.value(1);
    var coordLeftTop = [
        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ];
    var pointLeftTop = getCoord(params, api, lngIndex, latIndex);
    var pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);

    return {
        type: 'rect',
        shape: {
            x: pointLeftTop[0],
            y: pointLeftTop[1],
            width: pointRightBottom[0] - pointLeftTop[0],
            height: pointRightBottom[1] - pointLeftTop[1]
        },
        style: api.style({
            stroke: 'rgba(0,0,0,0.1)'
        }),
        styleEmphasis: api.styleEmphasis()
    };
}

function getCoord(params, api, lngIndex, latIndex) {
    var coords = params.context.coords || (params.context.coords = []);
    var key = lngIndex + '-' + latIndex;

    // bmap returns point in integer, which makes cell width unstable.
    // So we have to use right bottom point.
    return coords[key] || (coords[key] = api.coord([
        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ]));
}

