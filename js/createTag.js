function toggleSelected ($option) {
	if (($option['selected'])) { alert("option deselected");$option.removeAttr('selected');}
	else $option.attr('selected','selected');
	
}


function replaceWhiteSpace( token ) {
	if (!token) return "";
	tagLabel = token.trim();
	return tagLabel.replace(/\s+/g,"_"); 
}

function createKey(token) {
	tag = replaceWhiteSpace( token.toLowerCase() );
	
	return "key_" +tag; 
}

function findClosestSelect(token){
	var $firstMatch =  $("#tag_selector option[id^='" + createKey(token) + "']")
		.first();
	return $firstMatch;
	}
function clearSelection() {
	$firstMatch = null;
	$('#add_val').val("");	
}

$(document).ready(function(){
    var submit_flag = false;
	var $firstMatch = null;
	
	$( "form" ).submit(function( event ) {		   
			//console.log("Submit:" + submit_flag);
			if (!submit_flag) { event.preventDefault(); return false;}
			else {
				$(".error_msg").text("Post submitted ...");
				// Deselect any items not associated with the post
				$("#tag_selector option[selected]").attr("selected","");
				// Make sure all tags added to the post are selected
				$("#selected_tags option").attr("selected","selected");
				return true;
			}
		});
	$("#actual_submit").click(function(e) {

		e.preventDefault();
		//console.log( "Target:" + e.target + " is " + e.target.nodeName );
		var $postContent = $("textarea#new_post");
		if ($postContent.val().length == 0)
		{	
			//alert("Empty content");
			submit_flag = false;
			$(".error_msg").
						text("Please enter some text.")
						.show().fadeOut(3000,function(){ new_post.focus();});
			//$(".error_msg").text().show().fadeOut(3000);
		}
		else  {
			submit_flag = true;
			$("form").submit();
		}
	});
	
	$('#bt_add_val').click(function(e){
					e.preventDefault();

					// Store the value in a variable
					var tagLabel = $('#add_val').val();
					tagLabel = (tagLabel != null)? tagLabel.trim() : "";
					var newtag;
					console.log("Click event");
					
					var tagID = createKey(tagLabel);
					// Make sure value isn't null and is not a duplicate of one we have
					if (tagLabel.length > 0)
					{	
						// There should be at most one matching. Select it.
						var $matching = $("#"+tagID);
						console.log("Match!="+$matching.parent().attr("id"));
						if ($matching.length > 0) {
							if ($matching.parent().attr("id") == 'tag_selector') {
								console.log("found match:"+$matching.val());
								$matching.click();
							}
						}
						else {
							$matching = $("<option>",{selected: "selected",
															value : "NEW:"+tagLabel,
															id: tagID}).text(tagLabel);
							// Append to original select
							$matching.appendTo($('#tag_selector')).click();
							//$('#tag_list').append($matching);
							//$matching.select();

							// Refresh Selectric
							//$('#dynamic').selectric('refresh');
						}
						//$('#add_val').val("");
						clearSelection();
					}
					
					return false;
				});	
			
	$('#add_val').on({
		change: function(e){
			console.log("Change event");
			e.preventDefault();
			//$('#bt_add_val').click();
			return false;
		},
		keypress: function(e) {
			console.log("KEYPRESS event");
			var keyCode = e.keyCode || e.which;
			if (keyCode == 13) return false;
		},
		keydown: function(e) {
			var keyCode = e.keyCode || e.which;
			var content = $(this).val();
			if (keyCode == 13) {
				//$(this).parents('form').submit();
				// Prevent from from submitting
				e.preventDefault();
				//e.stopImmediatePropagation();
				//alert( "Enter was hit");
				return false;
			}
			
		},
		keyup: function(e) {
			var keyCode = e.keyCode || e.which;
			var content = $(this).val();
			if (keyCode == 13) {
				e.preventDefault();
				//e.stopImmediatePropagation();
				if ( content.length > 0 ) $('#bt_add_val').click();
				return false;
			}
			else if (e.which >= 32 && (e.which <= 127))
			{
				if (content.length > 0){
					$firstMatch = findClosestSelect(content);
					if ($firstMatch.length > 0)
					{						
						$firstMatch.attr("selected","selected");
						var newPosition = $("#tag_selector").scrollTop()+$firstMatch.position().top - 1;
						//$("#tag_selector").scrollTop(newPosition);
						if (e.which == 38) // the up arrow key was hit
							$(this).val( $firstMatch.text() );
					}
					else {  // Nothing was found so dehighlight any existing selected elements in the selector list
						$("#tag_selector option[selected]").attr("selected","");
					}
					
				}
				
			}
		
		}
		
	});
	
	$('#tag_selector').on({
		
		
		click: function(e){
			e.preventDefault();
			console.log("click event for " + $(this).text());
			//var o = $(this).detach();
			//toggleSelected($(this));
			//$(this).select();
			
			$newtag = $('<li>',{class:"tag",
						// Added the D to make sure no conflict with hidden select option
						id: "D_" + $(this).attr("id"),
						value : $(this).attr("value")
						}).css({"cursor": "pointer"});
			$newtag.text($(this).text());
									
			//$(this).remove();	
			// In addition to adding it to the list, add it to our hidden select
			$(this).detach().appendTo( $("#selected_tags")).attr("selected","selected");	
			$newtag.appendTo($("#tag_list"));
		}
	},	"option");
	$('#tag_list').on( "click","li",function(e)
				{
					e.preventDefault();
					
					/*
					$newoption = $('<option>',{	id: $(this).attr("id"),
						value : $(this).attr("value")});
					$newoption.text($(this).text());
					*/
					// Remove the D_ to get the option
					optionID = "#" + $(this).attr("id").substr(2);
					$option = $(optionID);
					$(this).remove();
					$option.detach().appendTo($("#tag_selector")).removeAttr("selected");
					//$('#tag_selector').append($newoption);
				});

	
});
/////////////////////////////////////////////////////////////////////////////////////

 

 
	
	
