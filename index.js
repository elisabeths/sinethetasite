// map.fitWorld().zoomIn();
// // map.setZoom(10);
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.scrollWheelZoom.disable();
// map.boxZoom.disable();
// map.keyboard.disable();


$(function() {
var map = L.map('map').setView([0, -50], 2);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiY2FrZXNvZndyYXRoIiwiYSI6Ijk5YWI3OTlhMGIxN2I1OWYzYjhlOWJmYjEwNTRjODU0In0._RjYIzLsA5cU-YM6dxGOLQ'
    }).addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map);

$("#modal").iziModal({
    overlayColor: "rgba(0, 0, 0, .6)",
    overlayClose: false,
    closeOnEscape: false,
    closeButton: false,
    // width: ""
});

$("a[title]").qtip({
    position: {
        my: "top center",
        at: "bottom center"
    },
    style: {
        classes: "qtip-dark qtip-shadow"
    }
});

var markers = new L.FeatureGroup();

var hashChanged = function() {
    var hash = window.location.hash;
    // console.log("hash changed!", hash, /#issue\d$/.test(hash));
    if(/#issue\d$/.test(hash)) { //is an issue #
        markers.clearLayers();
        var issue_num = parseInt(hash[hash.length - 1]);
        if((issue_num > 0) && (issue_num < 6)) {
            $("#sidebar").css("opacity", "1");
            $(".leaflet-control").css("opacity", "1");
            sidebar.open("issueInfo");
            $("#modal").iziModal("close");
            $("#sidebar-header-img").remove();
            $("#sidebar-header").prepend('<img class="titleImg" id="sidebar-header-img" src="./images/issue' + issue_num + '_color.png">');
            $.getJSON("./issues/issue" + issue_num + ".json", function(data) {
                // console.log(data);
                $("#issueInfoContainer").empty();
                $("#issueInfoContainer").append(data.about);
                $("#contributorsInfoContainer").empty();
                $("#contributorsInfoContainer").append(data.contributors.map(function(contrib, i) {
                    if(contrib.location) {
                        var marker = L.marker(contrib["location"]);
                        marker.bindPopup(contrib["bio"]);
                        markers.addLayer(marker);
                    }
                    return "<p>" + contrib.bio + "</p>";
                }));
                $("#tictail").empty();
                $("#tictail").append("<a href=\"" + data.purchase.tictail + "\">tictail</a> (shipping included)");
                $("#blurb").empty();
                $("#blurb").append("<a href=\"" + data.purchase.blurb + "\">blurb</a> (shipping not included)");
                if(data.purchase.zine) {
                    $("#zine").empty();
                    $("#zine").append("<a href=\"" + data.purchase.zine + "\">digital zine</a> (abridged version)")
                }
                map.addLayer(markers);
            });            
        }
        else if((issue_num > 5) && (issue_num < 9)){ 
            console.log("not released yet");
            $("#sidebar").css("opacity", "0");
            $(".leaflet-control").css("opacity", "0");
            if($("#modal").iziModal("getState") === "closed") {
                $("#modal").iziModal("open");
            }
            $("#navbar").children().children().removeClass("active");
            $("#navbar").children().children("#issues").addClass("active");
            setTimeout(function() {
                $("#content").load("./issues/issue" + issue_num + ".html", function(res, status, xhr) {
                    // console.log(res, status, xhr);
                });
            }, 100);
        }
    }
    else if(/(issueInfo|contributorsInfo|buyInfo)/.test(hash)) {
        return;
    }
    else {
        $("#sidebar").css("opacity", "0");
        $(".leaflet-control").css("opacity", "0");
        markers.clearLayers();
        if($("#modal").iziModal("getState") === "closed") {
            $("#modal").iziModal("open");
        }
        // console.log("not issues");
        var about_id = hash.replace("#", "");
        var match = about_id.match(/(team|submit|issues)/);
        // console.log("about_id", about_id, "match", match);
        if(match) {
            // console.log("match!", "./about/" + match[0] + ".html");
            $("#navbar").children().children().removeClass("active");
            $("#navbar").children().children("#" + match[0]).addClass("active");
            setTimeout(function() {
                $("#content").load("./about/" + match[0] + ".html", function(res, status, xhr) {
                    // console.log(res, status, xhr);
                });
            }, 100);
        }
        else {
            $("#navbar").children().children().removeClass("active");
            $("#navbar").children().children("#home").addClass("active");
            setTimeout(function() {
                $("#content").load("./about/home.html", function(res, status, xhr) {
                    // console.log(res, status, xhr);
                });
            }, 100);
        }
    }
}

window.onhashchange = hashChanged;

hashChanged();
});
// else if(/(issueInfo|contributorsInfo|buyInfo)/.test(hash)) {
        // console.log(e);
    // }





// setTimeout(function() {
//     console.log("hi");
//     $("#content").load("./about/home.html");
// }, 3000)

// var root = null;
// // var useHash = true; // Defaults to: false
// // var hash = '#!'; // Defaults to: '#'
// var router = new Navigo(root);

// router.on("/issues/:id", function(params) {
//     console.log(params);
// }).resolve();

// router.on(/(home|team|submit|issues)/, function(page) {
//     // home|team|submit|issues
//     // if(/home|team|submit|issues/)
//     console.log(page);
//     $("#navbar").children().children().removeClass("active");
//     $("#navbar").children().children("#" + page).addClass("active");
//     $("#content").load("./about/" + page + ".html");
// }).resolve();

// router.on("", function() {
    // router.navigate("/home");
    // console.log("lol?")
    // $("#content").load("./about/home.html");
// }).resolve();

// router.notFound(function () {
//   // called when there is path specified but
//   // there is no route matching
//   // router.navigate("/home");
//   console.log("")
// });

// router
//   .on({
//     "/issues/:id": function(params) {
//         console.log(params);
//     },
//     "about": function() {
//         console.log("About");
//     },

//     "": function() {
//         console.log("Home");
//     }
//   })
//   .resolve();

