// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
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
function findCardState(){
	var cardsRemaining=0;
	var imageID="";
	var Columns=new Array("A","B","C","D","E","F");
	for (var i=1; i < 2; i++) {
		for (j in Columns){
			imageId = "image-" + Columns[j] + i;
			if(document.getElementById(imageId).src.match("alien")){
				cardsRemaining = cardsRemaining + 1;
			}
			else{
				
			}
		
		}
	}
	document.getElementById('cardState').value=cardsRemaining;
}