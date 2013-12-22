function toggleSelected ($option) {
	if (($option['selected'])) { alert("option deselected");$option.removeAttr('selected');}
	else $option.attr('selected','selected');
	
}

$(document).ready(function(){
    var submit_flag = false;
	
	$( "form" ).submit(function( event ) {		   
			console.log("Submit:" + submit_flag);
			if (!submit_flag) { event.preventDefault(); return false;}
			else {
				$(".error_msg").text("Post submitted ...");
				return true;
			}
		});
	$("#actual_submit").click(function(e) {

		e.preventDefault();
		var $postContent = $("textarea#new_post");
		if ($postContent.val().length == 0)
		{	
			alert("Empty content");
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
					var tagname = $('#add_val').val();
					var newtag;
					console.log("Click event");
					tagname = (tagname != null)? tagname.trim() : "";
					var tagclass = tagname.replace(/\s+/g,"_");
					// Make sure value isn't null and is not a duplicate of one we have
					if (tagname.length > 0)
					{	
						// There should be at most one matching. Select it.
						var $matching = $("#key_"+tagclass);
						console.log("Match!="+$matching.parent().attr("id"));
						if ($matching.length > 0 && ($matching.parent().attr("id") == 'tag_selector')) {
							console.log("found match:"+$matching.val());
							$matching.click();
						}
						else {
							$matching = $("<option>",{selected: "selected",
															value : "NEW:"+tagname,
															id: "key_"+tagclass}).text(tagname);
							// Append to original select
							$('#tag_list').append($matching);
							//$matching.select();

							// Refresh Selectric
							//$('#dynamic').selectric('refresh');
						}
						$('#add_val').val("");
						
					}
					
					return false;
				});	
			
	$('#add_val').change(function(e){
		console.log("Change event");
		e.preventDefault();
		$('#bt_add_val').click();
		return false;
	});
	
	$('#tag_selector').on({
		select:function(){
			console.log("select event for option " + $(this).text());
			var $newTagList = $('<ul>',{id: "tag_list"});
			$('#tag_selector option[selected]').each( function(){
									$newtag = $('<li>',{class:"tag"});
									$newtag.html("<a href='#'>"+$(this).text()+"</a>");
									$newTagList.append($newtag);
											});
			// remove the old tag list
			$newTagList.replaceAll('ul.tag_list');
			},
		
		click: function(e){
			e.preventDefault();
			console.log("click event for " + $(this).text());
			var o = $(this).detach();
			//toggleSelected($(this));
			//$(this).select();
			o.appendTo($("#tag_list"));
		}
	},	"option");
	$('#tag_list').on( "click","option",function(e)
				{
					e.preventDefault();
					$('#tag_selector').append($(this).detach());
				})
	
	
});
	
	
	
