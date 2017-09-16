const Gfycat = require('gfycat-sdk');
const firebase = require('firebase');


//
// crawler settings
//
const NUM_OF_BATCHES = 2;
const BATCH_SIZE = 10;
const SEARCH_TEXT = "PUBATTLEGROUNDS"



// config
var firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyBj7uFGKWDuKFDx_6nQOhMSRC0cx3vJpCI",
    authDomain: "pubgaddicts-b4ff7.firebaseapp.com",
    databaseURL: "https://pubgaddicts-b4ff7.firebaseio.com",
    projectId: "pubgaddicts-b4ff7",
    storageBucket: "pubgaddicts-b4ff7.appspot.com",
    messagingSenderId: "355134315397",
    functionsURL: "https://us-central1-pubgaddicts-b4ff7.cloudfunctions.net"
});

var gfycat = new Gfycat({
    clientId: "2_1TzT3X",
    clientSecret: "sKXzXuGryoat8BDJWeiElHJQvOF4R-EvhUpectK4sWXRfpoXYbZF5x-0jKnkOuTS"
});


// logic
gfycat.authenticate().then(res => {
    //Your app is now authenticated
    console.log('token', gfycat.token);

    let options = {
        search_text: SEARCH_TEXT,
        count: BATCH_SIZE,
        cursor : ""
        //first: batchCount * BATCH_SIZE
    };
    batchRequest(options);
});

var batchCount = 0;
function batchRequest(options) {

    if (batchCount < NUM_OF_BATCHES) {

        console.log(options);

        gfycat.search(options).then(data => {
            //console.log('gfycats', data);
            var gfycats = data.gfycats;
            for (var i=0,len=gfycats.length; i < len; i++) {
                writeGfycat(gfycats[i]);
            }
            options.cursor = data.cursor;
            batchCount++;
            batchRequest(options);
        });
    }
}

function writeGfycat(gfycat) {

    firebase.database().ref('gfycatindex/' + gfycat.gfyName).once("value", function(snapshot) {
        if (!snapshot.exists()) {
            firebase.database().ref('gfycatindex/' + gfycat.gfyName).set({
                ex: true
            });

            firebase.database().ref('temp').push({
                date: gfycat.createDate,
                displayName: gfycat.userName,
                strategy: "gfycat",
                tags: ["gfycat"],
                title: gfycat.title,
                videoId: gfycat.gfyName
            });
        }
    });
}