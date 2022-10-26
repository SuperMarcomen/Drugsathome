var barcodeDetector;
var decoding = false;
var localStream;
var interval;

loadDevicesAndPlay();

document.getElementsByClassName("camera")[0].addEventListener('loadeddata',onPlayed, false);
initBarcodeDetector();


async function initBarcodeDetector(){
  var barcodeDetectorUsable = false;
  if ('BarcodeDetector' in window) {
    let formats = await window.BarcodeDetector.getSupportedFormats();
    if (formats.length > 0) {
      barcodeDetectorUsable = true;
    }
  }

  if (barcodeDetectorUsable === false) {
    alert('Barcode Detector is not supported by this browser');
  }
  barcodeDetector = new window.BarcodeDetector();
}

var deviceId;

document.getElementById('closeButton').addEventListener("click", stop);

function loadDevicesAndPlay(){
  var constraints = {video: true, audio: false};
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      localStream = stream;
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
          var count = 0;
          var cameraDevices = [];
          var defaultIndex = 0;
          for (var i=0;i<devices.length;i++){
              var device = devices[i];
              if (device.kind == 'videoinput'){
                  cameraDevices.push(device);
                  var label = device.label || `Camera ${count++}`;
                  if (label.toLowerCase().indexOf("back") != -1) {
                    defaultIndex = cameraDevices.length - 1;
                  }
              }
          }

          if (cameraDevices.length>0) {
            deviceId = cameraDevices[defaultIndex].deviceId;
            play(cameraDevices[defaultIndex].deviceId);
          }else{
            alert("No camera detected.");
          }
      });

  });
}

function play(deviceId, HDUnsupported) {
  stop();
  var constraints = {};

  if (!!deviceId){
      constraints = {
          video: {deviceId: deviceId},
          audio: false
      }
  }else{
      constraints = {
          video: true,
          audio: false
      }
  }

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      localStream = stream;
      var camera = document.getElementsByClassName("camera")[0];
      // Attach local stream to video element
      camera.srcObject = stream;

  }).catch(function(err) {
      console.error('getUserMediaError', err, err.stack);
      alert(err.message);
  });
}

function stop(){
  clearInterval(interval);
  
}

function onPlayed() {
  updateSVGViewBoxBasedOnVideoSize();
  startDecoding();
}

function updateSVGViewBoxBasedOnVideoSize(){
  var camera = document.getElementsByClassName("camera")[0];
  var svg = document.getElementsByTagName("svg")[0];
  svg.setAttribute("viewBox","0 0 "+camera.videoWidth+" "+camera.videoHeight);
}

function startDecoding(){
  clearInterval(interval);
  //1000/25=40
  interval = setInterval(decode, 40);
}

async function decode(){
  if (decoding === false) {
    var video = document.getElementsByClassName("camera")[0];
    decoding = true;
    var barcodes = await barcodeDetector.detect(video);
    decoding = false;
    drawOverlay(barcodes);
  }
}

function drawOverlay(barcodes){
  var svg = document.getElementsByTagName("svg")[0];
  svg.innerHTML = "";
  for (var i=0;i<barcodes.length;i++) {
    var barcode = barcodes[i];
    console.log(barcode);
    var lr = {};
    lr.x1 = barcode.cornerPoints[0].x;
    lr.x2 = barcode.cornerPoints[1].x;
    lr.x3 = barcode.cornerPoints[2].x;
    lr.x4 = barcode.cornerPoints[3].x;
    lr.y1 = barcode.cornerPoints[0].y;
    lr.y2 = barcode.cornerPoints[1].y;
    lr.y3 = barcode.cornerPoints[2].y;
    lr.y4 = barcode.cornerPoints[3].y;
    var points = getPointsData(lr);
    var polygon = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    polygon.setAttribute("points",points);
    polygon.setAttribute("class","barcode-polygon");
    var text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.innerHTML = barcode.rawValue.replace('-', '');
    text.setAttribute("x",lr.x1);
    text.setAttribute("y",lr.y1);
    //text.classList.add("text");
    text.setAttribute("fill","red");
    text.setAttribute("fontSize","20");
    svg.append(polygon);
    svg.append(text);
    stop();

    const pzn = barcodes[0].rawValue.replace('-', '');
    addNewDrug(pzn);
    break;
  }
}

function getPointsData(lr){
  var pointsData = lr.x1+","+lr.y1 + " ";
  pointsData = pointsData+ lr.x2+","+lr.y2 + " ";
  pointsData = pointsData+ lr.x3+","+lr.y3 + " ";
  pointsData = pointsData+ lr.x4+","+lr.y4;
  return pointsData;
}
