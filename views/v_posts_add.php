<?php if(isset($user)): ?>

	<form method='post' action='/posts/p_add'>
		
		<div id='user_header' class = 'ui-widget-header'>
			<?if (isset($user->avatar)):?>
				<img id="user_avatar" src='<?=$user->avatar?>' alt='' height='100' width='100'></img>
			<?endif;?> 
			<h2 id="title"><?=$user->first_name?> <?=$user->last_name?></h2>
			<span id="user_email" class="subheader"><?=$user->email?></span>			
		</div>
		
		<div id="post_entry">
		<div class="error_div">
			<span class='error_msg enlarge_font'><?php if(isset($error)) echo "$error"; ?></span>	
		</div>	
			<p>Post a memo, and if desired, tag it by one or more topics of your choosing. 
			<button class="button" id="actual_submit" type='Submit' value='Add new post'>Add a new post</button><br>
			</p>
			<textarea id="new_post" name='content' autofocus cols='70' rows='7'  ; ></textarea>
		</div>
		<div id="tags_div">
			<ul id="tag_list" class="tag_list">
			<span class='tag_list_title'>Tags:</span>		
					<!--
					Tags will be added as they are selected from tag_selector
					-->
			</ul>
			<p>
				
			
			</p>
			<select  multiple id="selected_tags" name="selected_tags[]">
			</select>
		</div>
		
		<br/>
		<div id="selector_div">		
			<label for="tag_selector">Select or <span value="NEW:">create</span> tags for your table. <span value="NEW:">Green</span> indicates a newly created tag. New tags attached to the post will be saved.</label>
			<br/>
			<select class='enlarge_font' id='tag_selector' name='tags[]'  size="6" >
				<? foreach($tags as $tag): ?>
					<!--  create id attribute to enforce uniqueness for searches-->
					<? $tagname = strtolower($tag['tag_name']); ?>
					<option value='<?=$tag['tag_id']?>' id='<?="key_".preg_replace('/\s+/','_',$tagname	)?>'><?=$tag['tag_name']?></option>
				<? endforeach; ?>
			</select>	
			<input class="enlarge_font" id="add_val" type="text" size="35" placeholder = ""></input>			
			<button type="button" class="button" id="bt_add_val" title="Note: Newly created tags will be added when the post is filed" >Add or select a tag</button>		
			<p class="reduced_font">Search for an existing tag. Hitting &uarr; will select the highlighted tag. Clicking an option will also add it.<br/>
			Clicking on a tag attached to the post will remove it.</p> 			
			
		</div>			
		
		<br/><br/>		
		
		
	</form>	
	<script  type="text/javascript" src="../js/createTag.js">
	</script>
<?php else: ?>	
	<h1 class="page_error">No user has been specified</h1>
<?php endif; ?>
