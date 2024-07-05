let ggbApplet;

export function initializeGeoGebra() {
    ggbApplet = new GGBApplet({
        "appName": "classic3d",
        "width": "100%",
        "height": 600,
        "showToolBar": true,
        "showAlgebraInput": true,
        "showMenuBar": true
    }, true);

    ggbApplet.inject('ggbApplet', 'preferHTML5', function() {
        console.log("GeoGebra Applet Loaded");
    });
}

window.addEventListener("load", initializeGeoGebra);
