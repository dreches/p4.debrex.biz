	$(document).ready(function() {

		 $("#users_table").tablesorter( {
											widgets: ['zebra'],
											headers: { 
												0: { sorter: false}
											}
										});
										
		$("#users_table a").on( { mousedown : function(e) {
									console.log( "mousedown event");
									e.preventDefault();
									e.stopImmediatePropagation();
									console.log("Calling ajax");
									$.ajax({
										type: 'POST',
										context: this,
										url: $(this).attr("href"),
										dataType: "text",
										success: function(response) { 	
											console.log("success: "+ response);
											if ( response.length > 0 ){
												var action = response.indexOf("unfollow")> -1 ? "Unfollow" : "Follow";
												if (action == "Follow") 
													$(this).removeClass("unfollow").addClass("follow");
												else $(this).removeClass("follow").addClass("unfollow");
												$(this).attr("href",response).html("<span class='ui-button-text'>"+action+"</span>");
												//$(this).css("min-height","2em","vertical-align","center");
												/*
												$anchor = $('<a>',{class : "button "+ (action.toLowerCase()),
																	href: response,
																	color: "yellow"
																	}).text( action );
												// inject the results received from process.php into the results div
												console.log( "text: " + $anchor.text() ); 
												$(this).replaceWith($anchor);
												*/
											}			
											else $(this).attr("color","black");
											return false;
										},
										/*data: {
											name: $('#name').val(),
										},*/
										
									}); // end ajax setup
		
									return false;	
									},
									
									click : function( e ) {
										//e.stopPropagation();
										console.log("click");
										e.preventDefault();
										
										
									}
									
							});
			
							
	});
