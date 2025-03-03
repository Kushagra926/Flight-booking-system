document.getElementById('bookNow').addEventListener('click', function () {
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");

    const fromCity = fromInput.value;
    const toCity = toInput.value;

    const cityCoordinates = {
        "Mumbai": [72.8777, 19.0760],
        "Hyderabad": [78.4867, 17.3850],
        "Bengaluru": [77.5946, 12.9716],
        "Delhi": [77.1025, 28.7041],
        "Ahmedabad": [72.5714, 23.0225],
        "Kolkata": [88.3639, 22.5726],
        "Chennai": [80.2707, 13.0827],
        "Kashmir": [74.7973, 34.0837],
        "Punjab": [75.3412, 31.1471],
        "Goa": [74.1240, 15.2993],
        "Lucknow": [80.9462, 26.8467]
    };

    const fromCoords = ol.proj.fromLonLat(cityCoordinates[fromCity]);
    const toCoords = ol.proj.fromLonLat(cityCoordinates[toCity]);

    const oldMapDiv = document.getElementById("map");
    if (oldMapDiv) {
        oldMapDiv.remove();
    }

    const newMapDiv = document.createElement("div");
    newMapDiv.id = "map";
    newMapDiv.style.width = "80%";
    newMapDiv.style.height = "500px";
    newMapDiv.style.margin = "20px auto";
    newMapDiv.style.borderRadius = "10px";
    document.body.appendChild(newMapDiv);

    const map = new ol.Map({
        target: 'map',
        controls: [],
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([78.5, 22.5]), 
            zoom: 5,
        }),
    });

    const flightPath = new ol.geom.LineString([fromCoords, toCoords]);

    const flightLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({ geometry: flightPath })],
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'blue', width: 2 }),
        }),
    });

    map.addLayer(flightLayer);

    const planeFeature = new ol.Feature({
        geometry: new ol.geom.Point(fromCoords),
    });

    const planeStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            scale: 0.05,
        }),
    });

    planeFeature.setStyle(planeStyle);

    const planeLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [planeFeature],
        }),
    });

    map.addLayer(planeLayer);

    const extent = flightPath.getExtent();
    map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 1000 });

    let index = 0;
    const totalSteps = 100;
    const intervalTime = 90;

    function animatePlane() {
        if (index < totalSteps) {
            const fraction = index / totalSteps;
            const newLon = fromCoords[0] + fraction * (toCoords[0] - fromCoords[0]);
            const newLat = fromCoords[1] + fraction * (toCoords[1] - fromCoords[1]);
            planeFeature.getGeometry().setCoordinates([newLon, newLat]);
            index++;
            setTimeout(animatePlane, intervalTime);
        } else {
            setTimeout(() => {
                window.location.href = "confirmation.html";
            }, 2000); 
        }
    }

    animatePlane();
    
    setTimeout(() => {
        fromInput.value = "";
        toInput.value = "";
    }, 2000);
});
