	$(document).ready(function() {

		 $("#users_table").tablesorter( {
											widgets: ['zebra'],
											headers: { 
												0: { sorter: false}
											}
										});
	});
