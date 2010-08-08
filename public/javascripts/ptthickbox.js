/*
 * Thickbox 2.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2006 cody lindley
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 * Thickbox is built on top of the very light weight jQuery library.
 */

//add thickbox to href elements that have a class of .thickbox
function TB_init(){
	if (!document.getElementsByTagName){ return; }
	var anchors = document.getElementsByTagName('a');

	// loop through all anchor tags
	for (var i=0; i<anchors.length; i++){
		var anchor = anchors[i];
		
		var cname = String(anchor.className);
		
		// use the string.match() method to catch 'lightbox' references in the rel attribute
		if (anchor.getAttribute('href') && (cname.toLowerCase().match('thickbox'))){
			anchor.onclick = function(){
				var t = this.title || this.name || null;
				var g = this.rel || false;
				TB_show(t,this.href,g);
				this.blur();
				return false;
			}
		}
	}
}

function TB_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link
	try {
		var objBody = document.getElementsByTagName("body").item(0);
		if ($("TB_HideSelect") == null) {
			var objHideSelect = document.createElement("iframe");
			objHideSelect.setAttribute('id','TB_HideSelect');
			objBody.appendChild(objHideSelect);
			var objOverlay = document.createElement("div");
			objOverlay.setAttribute('id','TB_overlay');
			objOverlay.onclick = TB_remove;
			objBody.appendChild(objOverlay);
			var objWindow = document.createElement("div");
			objWindow.setAttribute('id','TB_window');
			objBody.appendChild(objWindow);
		}
		
		if(caption==null){caption=""};

		$(window).onscroll = TB_position;
 		
		TB_overlaySize();
		
		var objLoad = document.createElement("div");
		objLoad.setAttribute('id','TB_load');
		var objLoadingImage = document.createElement("img");
		objLoadingImage.setAttribute('src', 'images/loadingAnimation.gif');
		objLoad.appendChild(objLoadingImage);
		objBody.appendChild(objLoad);

		TB_load_position();
		
		if(url.indexOf("?")!==-1){ //If there is a query string involved
			var baseURL = url.substr(0, url.indexOf("?"));
		}else{ 
			var baseURL = url;
		}
		var urlString = /\.jpg|\.jpeg|\.png|\.gif|\.bmp/g;
		var urlType = baseURL.toLowerCase().match(urlString);

		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;

			if(imageGroup){
				TB_TempArray = $("a[@rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML == "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {						
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);											
						}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){		
			imgPreloader.onload = null;

			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = TB_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth); 
				imageWidth = x; 
				if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
				}
			} else if (imageHeight > y) { 
				imageWidth = imageWidth * (y / imageHeight); 
				imageHeight = y; 
				if (imageWidth > x) { 
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x;
				}
			}
			// End Resizing

			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			var objImageOff = document.createElement("a");
			objImageOff.setAttribute('id','TB_ImageOff');
			objImageOff.setAttribute('title','Close');
			var objImage = document.createElement("img");
			objImage.setAttribute('src', url);
			objImage.setAttribute('width', imageWidth);
			objImage.setAttribute('height', imageHeight);
			objImage.setAttribute('alt', objImage);
			objImageOff.appendChild(objImage);
			$("TB_window").appendChild(objImageOff);
			var objCaption = document.createElement("div");
			objCaption.setAttribute('id','TB_caption');
		    objCaption.appendChild(document.createTextNode(caption));
			$("TB_window").appendChild(objCaption);
			var objCloseWindow = document.createElement("div");
			objCloseWindow.setAttribute('id','TB_closeWindow');
			var objCloseWindowButton = document.createElement("a");
			objCloseWindowButton.setAttribute('id','TB_closeWindowButton');
			objCloseWindowButton.setAttribute('href','#');
			objCloseWindowButton.setAttribute('title','Close');
		    objCloseWindowButton.appendChild(document.createTextNode("close"));
			objCloseWindow.appendChild(objCloseWindowButton);
			$("TB_window").appendChild(objCloseWindow);

			$("TB_closeWindowButton").onclick = TB_remove;

			if (!(TB_PrevHTML == "")) {
				function goPrev(){
					if($(document).unclick(goPrev)){$(document).unclick(goPrev)};
					$("TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					TB_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;	
				}
				$("TB_prev").onclick = goPrev;
			}

			if (!(TB_NextHTML == "")) {		
				function goNext(){
					$("TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					TB_show(TB_NextCaption, TB_NextURL, imageGroup);				
					return false;	
				}
				$("TB_next").onclick = goNext;

			}

			document.onkeydown = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					TB_remove();
				} else if(keycode == 190){ // display previous image
					if(!(TB_NextHTML == "")){
					document.onkeydown = "";
					goNext();
					}
				} else if(keycode == 188){ // display next image
					if(!(TB_PrevHTML == "")){
					document.onkeydown = "";
					goPrev();
					}
				}	
			}

			TB_position();
			$("TB_load").remove();
			$("TB_ImageOff").onclick = TB_remove;
			$("TB_window").style.display = "block"; //for safari using css instead of show
			}

			imgPreloader.src = url;

		}else{//code to show html pages
			
			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = TB_parseQuery( queryString );
			
			TB_WIDTH = (params['width']*1) + 30;
			TB_HEIGHT = (params['height']*1) + 40;
			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;
			
			if(url.indexOf('TB_iframe') != -1){	
				urlNoQuery = url.split('TB_');
				
				var objTitle = document.createElement("div");
				objTitle.setAttribute('id','TB_title');
				var objAjaxTitle = document.createElement("div");
				objAjaxTitle.setAttribute('id','TB_ajaxWindowTitle');
				objAjaxTitle.appendChild(document.createTextNode(caption));
				objTitle.appendChild(objAjaxTitle);
				var objCloseAjaxWindow = document.createElement("div");
				objCloseAjaxWindow.setAttribute('id','TB_closeAjaxWindow');
				var objCloseWindowButton = document.createElement("a");
				objCloseWindowButton.setAttribute('id','TB_closeWindowButton');
				objCloseWindowButton.setAttribute('href','#');
				objCloseWindowButton.setAttribute('title','Close');
				objCloseWindowButton.appendChild(document.createTextNode("close"));
				objCloseAjaxWindow.appendChild(objCloseWindowButton);
				objTitle.appendChild(objCloseAjaxWindow);
				$("TB_window").appendChild(objTitle);
				
				var objIframeContent = document.createElement("iframe");
				objIframeContent.setAttribute('frameborder','0');
				objIframeContent.setAttribute('hspace','0');
				objIframeContent.setAttribute('src',urlNoQuery[0]);
				objIframeContent.setAttribute('id','TB_iframeContent');
				objIframeContent.setAttribute('name','TB_iframeContent');
				objIframeContent.style.width = (ajaxContentW + 29)+"px";
				objIframeContent.style.height = (ajaxContentH + 17)+"px";
				objIframeContent.onload = TB_showIframe;
				$("TB_window").appendChild(objIframeContent);
			}else{
				var objTitle = document.createElement("div");
				objTitle.setAttribute('id','TB_title');
				var objAjaxTitle = document.createElement("div");
				objAjaxTitle.setAttribute('id','TB_ajaxWindowTitle');
				objAjaxTitle.appendChild(document.createTextNode(caption));
				objTitle.appendChild(objAjaxTitle);
				var objCloseAjaxWindow = document.createElement("div");
				objCloseAjaxWindow.setAttribute('id','TB_closeAjaxWindow');
				var objCloseWindowButton = document.createElement("a");
				objCloseWindowButton.setAttribute('id','TB_closeWindowButton');
				objCloseWindowButton.setAttribute('href','#');
				objCloseWindowButton.appendChild(document.createTextNode("close"));
				objCloseAjaxWindow.appendChild(objCloseWindowButton);
				objTitle.appendChild(objCloseAjaxWindow);
				$("TB_window").appendChild(objTitle);
				
				var objAjaxContent = document.createElement("div");
				objAjaxContent.setAttribute('id','TB_ajaxContent');
				objAjaxContent.style.width = ajaxContentW+"px";
				objAjaxContent.style.height = ajaxContentH+"px";
				$("TB_window").appendChild(objAjaxContent);
			}
					
			$("TB_closeWindowButton").onclick = TB_remove;
			
			if(url.indexOf('TB_inline') != -1){	
				$("TB_ajaxContent").innerHTML = $(params['inlineId']).innerHTML;
				TB_position();
				$("TB_load").remove();
				$("TB_window").style.display = "block"; 
			}else if(url.indexOf('TB_iframe') != -1){
				TB_position();
				if(frames['TB_iframeContent'] == undefined){//be nice to safari
					$("TB_load").remove();
					$("TB_window").style.display = "block";
					$(document).keyup = function(e){ var key = e.keyCode; if(key == 27){TB_remove()} };
				}
			}else{
				new Ajax.Updater($("TB_ajaxContent"), url, 
					{asynchronous:true, evalScripts:true, onComplete:function(){
					TB_position();
					$("TB_load").remove();
					$("TB_window").style.display = "block"; }
					}
				);
			}
		}
		
		$(window).onresize = TB_position;
		
		document.onkeyup = function(e){ 	
			if (e == null) { // ie
				keycode = event.keyCode;
			} else { // mozilla
				keycode = e.which;
			}
			if(keycode == 27){ // close
				TB_remove();
			}	
		}
		
	} catch(e) {
		alert( e );
	}
}

//helper functions below

function TB_showIframe(){
	$("TB_load").remove();
	$("TB_window").style.display = "block";
}

function TB_remove() {
 	if ($("TB_ImageOff")) $("TB_ImageOff").onclick = null;
	$("TB_overlay").onclick = null;
	$("TB_closeWindowButton").onclick = null;
	var options = Object.extend({
	from: $("TB_window").getOpacity() || 1.0,
	to:   0.0,
	afterFinishInternal: function(effect) { 
	  $("TB_window").remove(); 
 	  $("TB_overlay").remove();
	  $("TB_HideSelect").remove();
	},
	duration: .25}, arguments[1] || {});
	new Effect.Opacity($("TB_window"),options);
	if ($("TB_load")) $("TB_load").remove();
	update_on();
	return false;
}

function TB_position() {
	var pagesize = TB_getPageSize();	
	var arrayPageScroll = TB_getPageScrollTop();
	var sty = $("TB_window").style;
	sty.width = TB_WIDTH + "px";
	sty.left = (arrayPageScroll[0] + (pagesize[0]-TB_WIDTH)/2)+"px";
	sty.top = (arrayPageScroll[1] + (pagesize[1]-TB_HEIGHT)/2)+"px";
}

function TB_overlaySize(){
	if (window.innerHeight && window.scrollMaxY || window.innerWidth && window.scrollMaxX) {	
		yScroll = window.innerHeight + window.scrollMaxY;
		xScroll = window.innerWidth + window.scrollMaxX;
		var deff = document.documentElement;
		var wff = (deff&&deff.clientWidth) || document.body.clientWidth || window.innerWidth || self.innerWidth;
		var hff = (deff&&deff.clientHeight) || document.body.clientHeight || window.innerHeight || self.innerHeight;
		xScroll -= (window.innerWidth - wff);
		yScroll -= (window.innerHeight - hff);
	} else if (document.body.scrollHeight > document.body.offsetHeight || document.body.scrollWidth > document.body.offsetWidth){ // all but Explorer Mac
		yScroll = document.body.scrollHeight;
		xScroll = document.body.scrollWidth;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		yScroll = document.body.offsetHeight;
		xScroll = document.body.offsetWidth;
  	}
	var sty = $("TB_overlay").style;
	sty.height = yScroll +"px";
	sty.width = xScroll +"px";
	sty = $("TB_HideSelect").style;
	sty.height = yScroll +"px";
	sty.width = xScroll +"px";
}

function TB_load_position() {
	var pagesize = TB_getPageSize();
	var arrayPageScroll = TB_getPageScrollTop();
	var sty = $("TB_load").style;
	sty.left = (arrayPageScroll[0] + (pagesize[0] - 100)/2)+"px";
	sty.top = (arrayPageScroll[1] + ((pagesize[1]-100)/2))+"px";
	sty.display = "block";
}

function TB_parseQuery ( query ) {
   var Params = new Object ();
   if ( ! query ) return Params; // return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) continue;
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function TB_getPageScrollTop(){
	var yScrolltop;
	var xScrollleft;
	if (self.pageYOffset || self.pageXOffset) {
		yScrolltop = self.pageYOffset;
		xScrollleft = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop || document.documentElement.scrollLeft ){	 // Explorer 6 Strict
		yScrolltop = document.documentElement.scrollTop;
		xScrollleft = document.documentElement.scrollLeft;
	} else if (document.body) {// all other Explorers
		yScrolltop = document.body.scrollTop;
		xScrollleft = document.body.scrollLeft;
	}
	arrayPageScroll = new Array(xScrollleft,yScrolltop) 
	return arrayPageScroll;
}

function TB_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight
	arrayPageSize = new Array(w,h) 
	return arrayPageSize;
}

function initThickbox() { TB_init(); }
Event.observe(window, 'load', initThickbox, false);