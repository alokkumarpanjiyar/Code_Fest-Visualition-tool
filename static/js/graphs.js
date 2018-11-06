var numberFormat = d3.format(".2f");

queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, billionairesData) {
        var ndx = crossfilter(billionairesData);
        
        billionairesData.forEach(function(d){
            d.age = parseInt(d.age);
            d.founded = parseInt(d.founded);
            d.worth = parseFloat(d.worth);
            d.rank = parseInt(d.rank);
        })
            
        var citizenship_dim = ndx.dimension(dc.pluck('citizenship'));
        var count_by_citizenship = citizenship_dim.group();
        dc.pieChart('#citizenship_chart')
            .height(250)
            .radius(250)
            .transitionDuration(1000)
            .dimension(citizenship_dim)
            .group(count_by_citizenship);
       
        var industry_dim = ndx.dimension(dc.pluck('industry'));
        var total_worth = industry_dim.group().reduceSum(dc.pluck('worth'));
        dc.rowChart("#industry_chart")
            .width(800)
            .height(300)
            .dimension(industry_dim)
            .group(total_worth)
            .cap(10)
            .othersGrouper(false)
            .xAxis().ticks(8);
            
        var name_dim = ndx.dimension(dc.pluck('name'));
        var worth_group = name_dim.group().reduceSum(dc.pluck('worth'));
        dc.rowChart("#name_chart")
            .width(500)
            .height(300)
            .dimension(name_dim)
            .group(worth_group)
            .cap(10)
            .othersGrouper(false)
            .xAxis().ticks(5);
         
        //------------Bubble Chart------------------   
        // var nameDim = ndx.dimension(function(d){
        //     return d.name;
        // });
        // var statsByName = nameDim.group().reduce(
        //     function (p, v) {
        //         p.age = +v["age"];
        //         p.worth = +v["worth"];
        //         return p;
        //     },
        //     function (p, v) {
        //         p.age -= +v["age"];
        //         p.worth -= +v["worth"];
        //         return p;
        //     },
        //     function () {
        //         return {worth: 0, age: 0, rank: 0, sector: 0}
        //     }
        // );
        
        // var age_worth_sector_chart = dc.bubbleChart("#age_worth_sector_chart");
        // age_worth_sector_chart.width(600)
        //     .height(300)
        //     .margins({top: 20, right: 20, bottom: 20, left: 20})
        //     .dimension(nameDim)
        //     .group(statsByName)
        //     .colors(d3.scale.category20())
        //     .keyAccessor(function (p) {
        //         return p.value.worth;
        //     })
        //     .valueAccessor(function (p) {
        //         return p.value.age;
        //     })
        //     .radiusValueAccessor(function (p) {
        //         return p.value.worth*50;
        //     })
        //     .x(d3.scale.linear().domain([0, 120]))
        //     .r(d3.scale.linear().domain([0, 100]))
        //     .minRadiusWithLabel(100)
        //     .elasticY(true)
        //     .elasticX(true)
        //     .xAxisPadding(1)
        //     .yAxisPadding(5)
        //     .maxBubbleRelativeSize(0.009)
        //     .renderHorizontalGridLines(true)
        //     .renderVerticalGridLines(true)
        //     .renderLabel(true)
        //     .renderTitle(true)
        //     .title(function (p) {
        //         return p.key
        //             + "\n"
        //             + "Age : " + numberFormat(p.value.age) + "\n"
        //             + "Worth: " + numberFormat(p.value.worth);
        //     });
        // age_worth_sector_chart.yAxis().tickFormat(function (s) {
        //     return s;
        // });
        // age_worth_sector_chart.xAxis().tickFormat(function (s) {
        //     return s;
        // });
        
        var gender_dim = ndx.dimension(dc.pluck('gender'));
        var count_by_gender = gender_dim.group();
        dc.barChart("#gender_chart")
            .height(300)
            .width(600)
            .margins({top: 20, right: 20, bottom: 20, left: 20})
            .dimension(gender_dim)
            .group(count_by_gender)
            .transitionDuration(1000)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks();

   dc.renderAll();
}