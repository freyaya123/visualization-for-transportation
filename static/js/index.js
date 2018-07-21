/*页面上定义的js事件*/

//将map定义为全局变量，以便各个方法对其进行调用
var map;

var heatDate, traceDate;

function demo(){
    document.getElementById("toolBox").style.visibility="visible";
    $("#toolBox").toggle();
}

//页面初始化执行的内容
$(function () {

    //设置地图容器的高度，不然不能正确显示
    responsiveView();

    //窗口的自适应变化
    $(window).on('resize', responsiveView);

    //加载地图
    addMap();

    //加载日期时间轴
    setDateSlider();

    //监听事件
    //draw block heatmap
    $("#searchHeatBlock").click(function() {
        console.log(heatDate);

    })

    //draw street heatmap
    $("#searchHeatStreet").click(function() {
        console.log(searchHeatStreet);

    })
});

//设置地图容器高度
let responsiveView=()=>{
    $("#mapContainer").css("height",document.body.clientHeight);
};

//加载地图方法
let addMap=()=>{
    map = new BMap.Map("mapContainer");
    let centerPoint = new BMap.Point(-73.97,40.75);
    map.centerAndZoom(centerPoint, 14);
};

//日期时间轴
let setDateSlider=()=>{
    let mindate='2016-01-01';
    let maxdate='2016-06-30';
    let dateLength=getDays(mindate,maxdate);

    let now =new Date(),year=now.getFullYear(),month=now.getMonth()+1,day=now.getDate();
    let thisDay =year+"-"+(month<10?'0'+month:month)+"-"+(day<10?'0'+day:day);
    let today=getDays(mindate,thisDay);
    let length=$("#slider").width();
    let thisValue=today+1;
    $("#slider").slider({
        value:thisValue,
        min: 0,
        max: dateLength,
        step: 1,
        create:function(){
            $("#date-label").css("margin-left",length*(today/dateLength));
            $("#date-label").text(getAfterDate(mindate,today));
        },
        slide: function( event, ui ) {
            $("#date-label").css("margin-left",length*(ui.value/dateLength));
            $("#date-label").text(getAfterDate(mindate,ui.value));
            thisValue=ui.value;
        },
        change: function( event, ui ) {
            //这边定义拖拽日期结束后的事件
            $("#date-label").css("margin-left",length*(ui.value/dateLength));
            $("#date-label").text(getAfterDate(mindate,ui.value));
            console.log(thisValue);
            heatDate = thisValue;
        }
    });
};
/*-------------------------------------------------------计算日期的通用方法部分-----------------------------------------------------------*/
//获取某个日期之后N天的日期
function getAfterDate(minDate,days){
    let defaultDate = new Date(minDate);
    defaultDate.setTime(defaultDate.getTime()+864e5*days);
    let year=defaultDate.getFullYear(),month=defaultDate.getMonth()+1,day=defaultDate.getDate();
    return year+"/"+(month<10?'0'+month:month)+"/"+(day<10?'0'+day:day);
}
//计算两个日期之间相差多少天
function getDays(minDate , maxDate){
    let minDateObj = new Date(minDate),maxDateObj = new Date(maxDate)
        ,minTime = minDateObj.getTime(),maxTime = maxDateObj.getTime()
        ,minusDays = Math.floor(((maxTime-minTime)/864e5));//计算出两个日期的天数差
    return Math.abs(minusDays);//取绝对值
}
//计算某年的某月一共有多少天
function getDaysInMonth(year, month) {
    let date = new Date(year, month, 1);
    return new Date(date.getTime() - 864e5).getDate();
}

