// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var cards = new Array("A1","B1","C1","D1","E1","F1","A2","B2","C2","D2","E2","F2","A3","B3","C3","D3","E3","F3","A4","B4","C4","D4","E4","F4");
var periodic_update = true;

// functions below 
soundManager.url = '/soundmanager2.swf'; // override default SWF url
soundManager.debugMode = false;
soundManager.onload = function(){}

function ImageToggle(theImage, src1, src2){
	if (document.getElementById){
		if(document.getElementById(theImage).src.match(src1)){
			document.getElementById(theImage).src = src2;
		}
		else {
			document.getElementById(theImage).src = src1;
		}
	}
	else if(document.all){
		if(document.all[theImage].src == src1){

			document.all[theImage].src = src2;

		} else {
			document.all[theImage].src = src1;

		}

	}
}
function DivToggle(theDiv){
	if (document.getElementById){
		if(document.getElementById(theDiv).style.display == 'block'){
			document.getElementById(theDiv).style.display = 'none';
		}
		else {
			document.getElementById(theDiv).style.display = 'block';
		}
	}
	else if(document.all){
		if(document.all[theDiv].style.display == 'block'){
			document.all[theDiv].style.display = 'none';
		} else {
			document.all[theDiv].style.display = 'block';
		}

	}
}
function update_off(){
	periodic_update = false
}
function update_on(){
	periodic_update = true
}

function findCardState(){
	var cardsRemainingCount=0
	var cardsRemaining= new Array();
	var Columns=new Array("A","B","C","D","E","F");
	for (i=1; i < 5; i++) {
		for (j=0; j < 6; j++){
			var image_id = "image-" + Columns[j] + i.toString();
			var div_id = "div-" + Columns[j] + i.toString();
			if(!document.getElementById(image_id).src.match("eliminated") && document.getElementById(div_id).className != "card_choice"){
				cardsRemainingCount++;
				cardsRemaining.push(Columns[j] + i.toString())
			}
		}
	}
	if (cardsRemainingCount == 1 && document.getElementById('TB_overlay') == null){
		update_off();
		TB_show("","/last_card?width=400&height=300&last_card=" + cardsRemaining[0], false );
		document.getElementById('TB_overlay').style.height = window.innerHeight + "px";
	}

	document.getElementById('cardState').value=cardsRemainingCount;
}

function flipcards(){
	chosenCard_src = findChosenCard();
	var chosenCard_src_regular_expression = new RegExp(chosenCard_src)
	var Columns=new Array("A","B","C","D","E","F");
	for (i=1; i < 5; i++) {
		for (j=0; j < 6; j++){
			var image_id = "image-" + Columns[j] + i.toString();
			var image_src = "images/" + Columns[j] + i.toString() + ".png";
			var image_src_regular_expression = new RegExp(image_src)
			if (document.getElementById(image_id).src.match(image_src_regular_expression)){
				if (!document.getElementById(image_id).src.match(chosenCard_src_regular_expression)){
					document.getElementById(image_id).src = "images/eliminated.png";
				}
			}
			else {
				document.getElementById(image_id).src = image_src;
			}
		}
	}
}

function resetCards(){
	var Columns=new Array("A","B","C","D","E","F");
	for (i=1; i < 5; i++) {
		for (j=0; j < 6; j++){
			var image_id = "image-" + Columns[j] + i.toString();
			var image_src = "images/" + Columns[j] + i.toString() + ".png";
			document.getElementById(image_id).src = image_src;
		}
	}
}
function findChosenCard(){
	var divs = document.getElementsByTagName('div') ;
	for(var i=0; i < divs.length; i++) { 
		var div = divs[i];
		if(div.className == "card_choice"){
			relativeRegExp = new RegExp("(images\/.+\.png)");
			matches = div.firstChild.src.match(relativeRegExp);
			return matches[0];
		}
	} 
}

function changeChosenCard(){
	var divs = document.getElementsByTagName('div');
	for(var i=0; i < divs.length; i++) { 
		var div = divs[i];
		if(div.className == "card_choice"){
			div.firstChild.src="images/A1.png";
		}
	} 
}
function clearQuestion(){
	document.form1.question.value="";
}

function initScrollLayers() {
  // arguments: id of layer containing scrolling layers (clipped layer), id of layer to scroll, 
  // if horizontal scrolling, id of element containing scrolling content (table?)
  var wndo1 = new dw_scrollObj('wn1', 'lyr1', null);

  // arguments: dragBar id, track id, axis ("v" or "h"), x offset, y offset
  // (x/y offsets of dragBar in track)
  wndo1.setUpScrollbar("dragBar1", "track1", "v", 1, 1);
  

  dw_showLayers("scrollbar1");
}

function dw_showLayers() {
  if ( document.getElementById ) {
    var lyr, i;
    for (i=0; arguments[i]; i++) {
      lyr = document.getElementById( arguments[i] );
      lyr.style.visibility = "visible";
    }
  }
}

function processXML(){
	var xmlstring = document.form1.XML.value;
  // alert(xmlstring);
	var xmlobject = (new DOMParser()).parseFromString(xmlstring, "text/xml");
	var htmlString="";
	var numMessages=xmlobject.getElementsByTagName("message").length;
	for (var i=0;i<numMessages;i++){
		var name = xmlobject.getElementsByTagName("message")[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		var img_src = xmlobject.getElementsByTagName("message")[i].getElementsByTagName("img_src")[0].firstChild.nodeValue;
		var content= xmlobject.getElementsByTagName("message")[i].getElementsByTagName("content")[0].firstChild.nodeValue;
		if (xmlobject.getElementsByTagName("message")[i].getElementsByTagName("color")[0].firstChild.nodeValue == "red"){
			htmlString += "<div class=\"cssbox-red\">\n<div class=\"cssbox_head-red\"><h2>" + name + "&nbsp;<img src=\"" + img_src+ "\"/></h2></div>\n<div class=\"cssbox_body-red\">" + content + "</div>\n</div>"	
		}
		else if (xmlobject.getElementsByTagName("message")[i].getElementsByTagName("color")[0].firstChild.nodeValue == "blue"){
			htmlString += "<div class=\"cssbox-blue\">\n<div class=\"cssbox_head-blue\"><h2>" + name + "&nbsp;<img src=\"" + img_src+ "\"/></h2></div>\n<div class=\"cssbox_body-blue\">" + content + "</div>\n</div>"	
		}
	}
	insertAtTop("lyr1", htmlString);
	if (numMessages>0){
		soundManager.play('message','/message.mp3');
	}
	var action = xmlobject.getElementsByTagName("action")[0].firstChild.nodeValue;
	return action;
/*	alert(last_message_id);*/

	
}
function insertAtTop(id, htmlString){
	var element= document.getElementById(id);
	var range= element.ownerDocument.createRange();
	range.setStartBefore(element);
	var parsedHTML= range.createContextualFragment(htmlString);
	element.insertBefore(parsedHTML,element.firstChild);
}
function process_messages_returned(){
	action = processXML();
	document.getElementById('gameState').value=action;
	initScrollLayers();
	performActions(action);
}
function add_text(el){
	var text = el.innerHTML;
	document.form1.question.value = document.form1.question.value + text + " ";
}
function performActions(action){
	if (action == "wait_for_your_response"){
		deactivateQuestionButtons();
		activateResponseButtons();
		document.getElementById('notice').innerHTML="Waiting for your answer";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_your_question"){
		activateQuestionButtons();
		deactivateResponseButtons();
		document.getElementById('notice').innerHTML="Waiting for your question";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_other_player_question"){
		deactivateQuestionButtons();
		deactivateResponseButtons();
		document.getElementById('notice').innerHTML="Waiting for " + document.getElementById('otherPlayerName').value + "'s question";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_other_player_response"){
		deactivateQuestionButtons();
		deactivateResponseButtons();
		document.getElementById('notice').innerHTML="Waiting for " + document.getElementById('otherPlayerName').value + "'s answer";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_your_question_and_chat"){
		activateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		document.getElementById('notice').innerHTML="Waiting for your question";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_other_player_question_and_chat"){
		deactivateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		document.getElementById('notice').innerHTML="Waiting for " + document.getElementById('otherPlayerName').value + "'s question";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_your_response_and_chat"){
		deactivateQuestionButtons();
		activateResponseButtons();
		activateChatButton();
		document.getElementById('notice').innerHTML="Waiting for your answer";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "wait_for_other_player_response_and_chat"){
		deactivateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		document.getElementById('notice').innerHTML="Waiting for " + document.getElementById('otherPlayerName').value + "'s answer";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
	}
	else if (action == "correct_choice"){
		deactivateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		TB_remove_no_update();
		document.getElementById('notice').innerHTML="You are the winner";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
		setTimeout('TB_show("","guess_who/display_winner?width=400&height=150&result=correct_choice", false )', 250);
		document.getElementById('TB_overlay').style.height = window.innerHeight + "px";
	}
	else if (action == "incorrect_choice"){
		deactivateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		TB_remove_no_update();
		document.getElementById('notice').innerHTML= document.getElementById('otherPlayerName').value + " is the winner";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
		setTimeout('TB_show("","guess_who/display_winner?width=400&height=150&result=incorrect_choice", false )', 250);
		document.getElementById('TB_overlay').style.height = window.innerHeight + "px";
	}
	else if (action == "other_player_correct_choice"){
		update_off();
		deactivateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		document.getElementById('notice').innerHTML= document.getElementById('otherPlayerName').value + " is the winner";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
		TB_show("","guess_who/display_winner?width=400&height=250&result=other_player_correct_choice", false );
		document.getElementById('TB_overlay').style.height = window.innerHeight + "px";
	}
	else if (action == "other_player_incorrect_choice"){
		update_off();
		deactivateQuestionButtons();
		deactivateResponseButtons();
		activateChatButton();
		document.getElementById('notice').innerHTML= "You are the winner";
		new Effect.Highlight('notice', {startcolor:'#CC0000', endcolor:'#FFF6BF',duration:2.0});
		TB_show("","guess_who/display_winner?width=400&height=250&result=other_player_incorrect_choice", false );
		document.getElementById('TB_overlay').style.height = window.innerHeight + "px";
	}
}
function deactivateQuestionButtons(){
	var divs= document.getElementsByTagName('div');
	for(i=0;i<divs.length;i++){
		if (divs[i].className == "button"){
			divs[i].style.background = "url(\"images/greyed_out_button.png\")";
			divs[i].style.border= "2px solid #AAAAAA"
			divs[i].onclick= null;
		}
	}
	document.getElementById('sendQuestion').disabled=true;
}
function activateQuestionButtons(){
	var divs= document.getElementsByTagName('div');
	for(i=0;i<divs.length;i++){
		if (divs[i].className == "button"){
			divs[i].style.background = "url(\"images/question_button.png\")";
			divs[i].style.border= "2px solid #313131";
			divs[i].onclick= function(){add_text(this);};
		}
	}
	document.getElementById('sendQuestion').disabled=false;
}
function deactivateResponseButtons(){
	var yes = document.getElementById('yesButton');
	var no = document.getElementById('noButton');
	yes.style.background = "url(\"images/greyed_out_button.png\")";
	yes.style.border= "2px solid #AAAAAA";
	yes.getElementsByTagName('a')[0].onclick=null;
	
	no.style.background = "url(\"images/greyed_out_button.png\")";
	no.style.border = "2px solid #AAAAAA";
	no.getElementsByTagName('a')[0].onclick=null;
}
function activateResponseButtons(){
	var yes = document.getElementById('yesButton');
	var no = document.getElementById('noButton');
	yes.style.background = "url(\"images/yes_button.png\")";
	yes.style.border= "2px solid #313131";
	yes.getElementsByTagName('a')[0].onclick=function(){new Ajax.Updater('returnedXML', '/guess_who/submit_yes_response', {asynchronous:true, evalScripts:true, onComplete:function(request){process_messages_returned();}}); return false;};
	
	no.style.background = "url(\"images/no_button.png\")";
	no.style.border = "2px solid #313131";
	no.getElementsByTagName('a')[0].onclick=function(){new Ajax.Updater('returnedXML', '/guess_who/submit_no_response', {asynchronous:true, evalScripts:true, onComplete:function(request){process_messages_returned();}}); return false;};
}
function deactivateChatButton(){
	var chat = document.getElementById('chat_submit');
	chat.src = "images/greyed_out_chat.png";
	chat.disabled = true;
}
function activateChatButton(){
	var chat = document.getElementById('chat_submit');
	chat.src = "images/chat.png";
	chat.disabled = false;
}
function TB_remove_no_update() {
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
	return false;
}