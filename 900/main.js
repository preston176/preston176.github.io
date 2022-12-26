var i = 0;

var payloadData = "";
sessionStorage.setItem("plrunmethod","");
localStorage.setItem("ipaddress","127.0.0.1");



	//Function to 'get' the payload file.	
	var getPayload=function(payload,onLoadEndCallback){
		var req=new XMLHttpRequest();
		req.open('GET',payload);
		req.send();
		req.responseType="arraybuffer";
		req.onload=function(event){
			if(onLoadEndCallback)onLoadEndCallback(req,event);
		};
	};
	
	//Function to 'send' the payload file to the BinLoader server. 
	var sendPayload=function(url,data,onLoadEndCallback){
		var req=new XMLHttpRequest();
		req.open("POST",url,true);
		req.send(data);
		req.onload=function(event){
			if(onLoadEndCallback)onLoadEndCallback(req,event);
		};
	};

  function checkserverstatus(){
	var req = new XMLHttpRequest(); 
	req.open("POST", "http://"+localStorage.ipaddress+":9090/status");
	req.send();
	req.onerror = function(){
		msgs.innerHTML="<h1 style='font-size:25px;text-align:center;'>GoldHen Bin Server Not Detected, Payloads Will Run Via Host!!!</h1>";
		sessionStorage.plrunmethod = "sandboxesc";
		return;
	};
	req.onload = function(){
	var responseJson = JSON.parse(req.responseText);
	if (responseJson.status=="ready"){
		msgs.innerHTML="<h1 style='font-size:25px;text-align:center;'>GoldHen Bin Server Detected, Payloads Will Run Via Port 9090!!!</h1>";
		sessionStorage.plrunmethod = "ghen20binserver";
		return;
		}
	};
}

function wk_keep_alive()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', document.location.href, false);
    xhr.send('');
}
function print(){}

function getScript(source,callback){var gs=document.createElement('script');gs.src=source;gs.onload=callback;gs.async=false;document.body.appendChild(gs);}
function loadScript(name)
{
	getScript(name,function(){});
}

function LoadviaGoldhen(PLfile){
  var req = new XMLHttpRequest(); 
	   req.open("POST", "http://"+localStorage.ipaddress+":9090/status");
	   req.send();
	   req.onerror = function(){
		   alert("Cannot Load Payload Because The BinLoader Server Is Not Running");//<<If server is not running, alert message.
		   return;
	   };
		req.onload = function(){
			var responseJson = JSON.parse(req.responseText);
			if (responseJson.status=="ready"){
		    getPayload(PLfile, function (req) {
				if ((req.status === 200 || req.status === 304) && req.response) {
				   //Sending bins via IP POST Method
					sendPayload("http://" + localStorage.ipaddress + ":9090", req.response, function (req) {
					   if (req.status === 200) {
						allset();
					   }else{msgs.innerHTML = 'Cannot send payload';return;}
					})
				}
			});
			}
			else {
				alert("Cannot Load Payload Because The BinLoader Server Is Busy");//<<If server is busy, alert message.
				return;
			}
		};
	}
