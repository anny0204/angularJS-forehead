angular.module("foreheadApp", ["ng-fusioncharts"])
.controller("foreheadCtrl", function ($scope, $http) {
    let appId = "1892956717a319db86851b7cfdcd4949";

    //Handle "Enter" in input
    document.getElementById('searcingCity').addEventListener('keypress', function (e) {
        if (e.charCode == 13) $scope.findId();
    });

    //Array with datas for building the char
    $scope.arrForChart = [];

    //View/show datas
    $scope.isViewVisible = false;

    //Searching information for current date
    $scope.currentDate = function (item) {
        return item.dt_txt.split(' ')[0] === $scope.activeDate.date;
    };

    $scope.selectDate = function (selectedDate) {
        $scope.activeDate = selectedDate;
    };

    //Setting css-class for chosen date
    $scope.selectedDateClass = function (selectedDate) {
        return (selectedDate == $scope.activeDate) ? 'active' : '';
    };

    //Getting icon for view
    $scope.getImageSrc = function (icon) {
        return "images/icons/" + icon + ".png";
    };

    //Gettin whole information about forehead
    $scope.findId = function () {

        $http.get("../Data_Folder/city.list.json").success(response => {
            //Getting cityId from city.list.json
            let selected = response.filter(el => el.name.toUpperCase() == $scope.currentCityName.toUpperCase());
            $scope.selectedCityName = selected[0].name;
            getForehead(selected[0].id);
        });

        //Gettin forehead using url-string
        function getForehead(selectedCityId) {
            let urlWeatherStr = "http://api.openweathermap.org/data/2.5/forecast?id=" + selectedCityId + "&APPID=" + appId;
            $scope.datesArr = []; // dates for forehead

            $http.get(urlWeatherStr).success(response => {
                $scope.foreheadArr = response.list;

                //Selecting dates from the receiving data
                $scope.foreheadArr.forEach(el =>
                    $scope.datesArr.push({ date: el.dt_txt.split(' ')[0], temp: el.main.temp, pressure: el.main.pressure }));

                //Deleting repeating dates
                for (let i = 0; i < $scope.datesArr.length; i++) {

                    //Getting array for one day forehead 
                    let currentDay = $scope.datesArr.filter(el => el.date === $scope.datesArr[i].date);

                    //Finding temp_min for one day
                    $scope.datesArr[i].temp_min = Math.min.apply(Math, currentDay.map(item => +item.temp));

                    //Finding temp_max for one day
                    $scope.datesArr[i].temp_max = Math.max.apply(Math, currentDay.map(item => +item.temp));

                    //Finding temp_average for one day
                    $scope.datesArr[i].temp_average = Math.round(($scope.datesArr[i].temp_min + $scope.datesArr[i].temp_max) / 2);

                    //Finding ev_pressure for one day
                    $scope.datesArr[i].av_pressure = (currentDay.map(item => +item.pressure).reduce((sum, current) => sum + current, 0)) / currentDay.length;

                    for (let j = i + 1; j < $scope.datesArr.length;) {
                        if ($scope.datesArr[i].date === $scope.datesArr[j].date) {
                            $scope.datesArr.splice(j, 1)
                        }
                        else
                            j++;
                    }
                };

                $scope.arrForChart = $scope.datesArr.map(function (el) { return { label: el.date, value: (Math.round(el.temp_average - 273.15) + '&#0176;C') } });

                $scope.activeDate = $scope.datesArr[0];

                $scope.isViewVisible = true;
            });

        };
    };

    $scope.$watch("arrForChart", function (newValue) {
        $scope.myDataSource.data = newValue;
    })

    //Drawing the chart
    $scope.myDataSource = {
        chart: {
            caption: "Temperatures",
            numberPrefix: "T: ",
            theme: "ocean"
        },
        data: []
    };
})
