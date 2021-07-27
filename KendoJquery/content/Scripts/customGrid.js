function generateGrid(gridData) {
    var model = generateModel(gridData[0]);
    var grid = $("#grid").kendoGrid({
        dataSource: {
            data: gridData,
            model: model,
            pageSize: 5
        },
        editable: true,
        sortable: true,
        columns: ColumnGeneration(gridData),
        pageable: {
            pageSizes: true,
            buttonCount: 2
        }
    });

}

function nonEditor(container, options) {
    container.text(options.model[options.field]);
    container.removeClass("k-edit-cell");
}

function generateModel(gridData) {
    var model = {};
    model.id = "id";
    var fields = {};
    for (var property in gridData) {
        var propType = typeof gridData[property];
        if (propType == "number") {
            fields[property] = {
                type: "number",
                validation: {
                    required: true
                }
            };
        } else if (propType == "boolean") {
            fields[property] = {
                type: "boolean",
                validation: {
                    required: true
                }
            };
        } else if (propType == "string") {
            var parsedDate = kendo.parseDate(gridData[property]);
            if (parsedDate) {
                fields[property] = {
                    type: "date",
                    validation: {
                        required: true
                    }
                };
                dateFields.push(property);
            } else {
                fields[property] = {
                    validation: {
                        required: true
                    }
                };
            }
        } else {
            fields[property] = {
                validation: {
                    required: true
                }
            };
        }

    }
    model.fields = fields;

    return model;
}

function ColumnGeneration(gridData) {
    var gridObj = gridData[0];
    GridTitleArray = [];

    $.each(gridObj, function (gridTitle, element) {
        GridTitleArray.push(gridTitle)
    });
    GridColumnGeneration = [];
    for (var i = 0; i < GridTitleArray.length; i++) {

        if (GridTitleArray[i] == 'name') {
            GridColumnGeneration.push({ title: "Name", field: GridTitleArray[i], editor: nonEditor })
        }

        if (GridTitleArray[i] == 'username') {
            GridColumnGeneration.push({ title: "Username", field: GridTitleArray[i], editor: nonEditor })
        }

        if (GridTitleArray[i] == 'email') {
            GridColumnGeneration.push({ title: "Email", field: GridTitleArray[i], editor: nonEditor })
        }

        if (GridTitleArray[i] == 'address') {
            //debugger
            //let geoLocation = '# = address.geo #';
            GridColumnGeneration.push({ title: "Address", field: GridTitleArray[i], template: '<a onclick="rowFunction(#= address.geo.lat #,#= address.geo.lng #)" href="javascript:;">#= address.street #, #= address.suite #, #= address.city #, #= address.zipcode #</a>', editor: nonEditor })
        }


    }
    return GridColumnGeneration;

}

//function InitializeMap(maPId) {
//    var mapOptions = { center: new google.maps.LatLng(0, 0), zoom: 0, mapTypeId: google.maps.MapTypeId.ROADMAP }
//    var map = new google.maps.Map(maPId, mapOptions);
//}

function rowFunction(lat, lng) {
    $("#dialog").dialog({
        modal: true,
        title: "Google Map",
        width: 600,
        hright: 450,
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }
        },
        open: function () {
            //var mapOptions = {
            //    center: new google.maps.LatLng(lat, lng),
            //    zoom: 18,
            //    mapTypeId: google.maps.MapTypeId.ROADMAP
            //}
            //var map = new google.maps.Map($("#dvMap")[0], mapOptions);
            initialize({ lat, lng });
        }
    });
}

function initialize(obj) {
    debugger
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(obj.lat, obj.lng);
    var mapOptions = { zoom: 7, mapTypeId: google.maps.MapTypeId.ROADMAP, center: chicago }
    map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
    directionsDisplay.setMap(map);
}

function GetLocation(obj, mapId) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var location = {};
            location.lattitude = obj.let;
            location.longitude = obj.lng;
            location.address = results[0].formatted_address;
            var mapOptions = { center: new google.maps.LatLng(location.lattitude, location.longitude), zoom: 18, mapTypeId: google.maps.MapTypeId.ROADMAP };
            var infoWindow = new google.maps.InfoWindow();
            var latlngbounds = new google.maps.LatLngBounds();
            var map = new google.maps.Map(mapId, mapOptions);
            var myLatLng = new google.maps.LatLng(location.lattitude, location.longitude);
            var marker = new google.maps.Marker({ position: myLatLng, map: map });
            google.maps.event.addListener(marker, "click", function (e) {
                infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + location.address + "</div>");
                infoWindow.open(map, marker);
            });
        }
    });
};




//"address": {
//    "street": "Kulas Light",
//        "suite": "Apt. 556",
//            "city": "Gwenborough",
//                "zipcode": "92998-3874",
//                    "geo": {
//        "lat": "-37.3159",
//            "lng": "81.1496"
//    }