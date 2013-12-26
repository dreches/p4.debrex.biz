function toggleSelected ($option) {
	if (($option['selected'])) { alert("option deselected");$option.removeAttr('selected');}
	else $option.attr('selected','selected');
	
}

function replaceWhiteSpace( token ) {
	tagname = (token != null)? token.trim() : "";
	return tagname.replace(/\s+/g,"_"); 
}

function findClosestSelect(token){
	var $firstMatch =  $("#tag_selector option[id^='key_" + replaceWhiteSpace(token) + "']")
					  .first();
	console.log( "First matching option = " + $firstMatch.text() + 
	     " position: " + $firstMatch.position().top  + 
		 " offset: " + $firstMatch.offset().top + 
		 " scrollTop: " + $("#tag_selector").scrollTop());
	return $firstMatch;
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
		console.log( "Target:" + e.target + " is " + e.target.nodeName );
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
						if ($matching.length > 0) {
							if ($matching.parent().attr("id") == 'tag_selector') {
								console.log("found match:"+$matching.val());
								$matching.click();
							}
						}
						else {
							$matching = $("<option>",{selected: "selected",
															value : "NEW:"+tagname,
															id: "key_"+tagclass}).text(tagname);
							// Append to original select
							$matching.appendTo($('#tag_selector')).click();
							//$('#tag_list').append($matching);
							//$matching.select();

							// Refresh Selectric
							//$('#dynamic').selectric('refresh');
						}
						$('#add_val').val("");
						
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
				e.stopImmediatePropagation();
				alert( "Enter was hit");
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
					var $firstMatch = findClosestSelect(content);
					if ($firstMatch)
					{	
						var newPosition = $("#tag_selector").scrollTop()+$firstMatch.position().top - 1;
						$("#tag_selector").scrollTop(newPosition);
						
					}
				}
			}
		}
		
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
		focusin: function(e){
			console.log("Focus event");
		},
		
		click: function(e){
			e.preventDefault();
			console.log("click event for " + $(this).text());
			//var o = $(this).detach();
			//toggleSelected($(this));
			//$(this).select();
			
			$newtag = $('<li>',{class:"tag",
						id: $(this).attr("id"),
						value : $(this).attr("value")});
			$newtag.text($(this).text());
									
			$(this).remove();								
			$newtag.appendTo($("#tag_list"));
		}
	},	"option");
	$('#tag_list').on( "click","li",function(e)
				{
					e.preventDefault();
					//$parent = $(this).parent();
					$newoption = $('<option>',{	id: $(this).attr("id"),
						value : $(this).attr("value")});
					$newoption.text($(this).text());
					$(this).remove();
					$('#tag_selector').append($newoption);
				});
	/*** USING AUTOCOMPLETE FEATURE ***/

    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }
 
    $( "#tag_finder" ).autocomplete( {
		/*
	   source: function( request, response ) {
          var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
          response( $.grep( tags, function( item ){
              return matcher.test( item );
          }) );
      }*/
	 
      source: function( request, response ) {
        $.ajax({
          url: "http://ws.geonames.org/searchJSON",
          dataType: "jsonp",
          data: {
            featureClass: "P",
            style: "full",
            maxRows: 12,
            name_startsWith: request.term
          },
          success: function( data ) {
            response( $.map( data.geonames, function( item ) {
              return {
                label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                value: item.name
              }
            }));
          }
        });
      },
      minLength: 1,
      select: function( event, ui ) {
        console.log( ui.item ?
          "Selected: " + ui.item.label :
          "Nothing selected, input was " + this.value);
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    });

	
});
	
	
	
