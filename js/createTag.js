function createTag(){
		
			var tagname=prompt("Please enter a new tag name","tag");
			
			if (tagname!=null && (tagname.trim().length > 0))
			  {
				var myoption=document.createElement("option");
				myoption.innerHTML=tagname;
				myoption.setAttribute("value","NEW:"+tagname);
				var selection = document.getElementById("tag_selector");
				selection.appendChild(myoption);
		
					
			  }
			}
			return false;