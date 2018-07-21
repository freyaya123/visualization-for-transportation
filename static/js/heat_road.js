var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
option = null;
app.title = '热力图与百度地图扩展';

var all_position=new Array;
var all_value=new Array;
var convertData = function (index) {
    console.log(index);
    var res=[];
    for (var i=0;i< all_position[index].length;i++){
        var tmp=all_position[index][i];
        tmp.concat(all_value[index][i]);
        res.push(tmp);
    }

    return res;
};
$.getJSON('../static/data/2016_3_1_9_10_915-945.json', function (data) {
    //var data = eval("("+data+")");
    /*var points = [].concat.apply([], data.map(function (track) {
        return track.map(function (seg) {
            return seg.coord.concat([1]);
        });
    }));
    console.log(points);*/

    for (var i = 0; i < data.data.length; i += 1) {
        var tmp_position=new Array;
        var tmp_value=new Array;
        console.log(data.data[i].time);
        console.log(data.data[i].positions);

        for (var j=0;j<data.data[i].positions.length;j++){
            tmp_position.push(data.data[i].positions[j]);
            tmp_value.push(1);
        }
        all_position.push(tmp_position);
        all_value.push(tmp_value);
    }

    console.log(all_position);
    console.log(all_position.length);
    console.log(all_value);

    myChart.setOption(
        option = {
            baseOption:{
                animation: false,
                timeline: {
                    autoPlay:true,
                    data: ["9:15","9:45"],
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
                    zoom: 13,
                    roam: true
                },
                visualMap: {
                    show: false,
                    top: 'top',
                    min: 0,
                    max: 5,
                    seriesIndex: 0,
                    calculable: true,
                    inRange: {
                        color: ['blue', 'blue', 'green', 'yellow', 'red']
                    }
                },
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'bmap',

                    pointSize: 5,
                    blurSize: 6
                }]
            },
            options: [
                {
                    series:[{
                        data : convertData(0)
                    }]
                },
                {
                    series:[{
                        data : convertData(1)
                    }]
                }

            ],
        });
    if (!app.inNode) {
        // 添加百度地图插件
        var bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.MapTypeControl());
    }
});
;
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}