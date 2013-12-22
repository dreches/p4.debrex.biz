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
		<p>Post a memo, and if desired, tag it by one or more topics of your choosing.<br>
		</p>
		<textarea id="new_post" name='content' autofocus cols='70' rows='7'  ; ></textarea>
		<div id="tags_div">
			<span class='tag_list_title'>Tags:</span>		
			<select id="tag_list" class="tag_list" size=10>
					<!--
					
					-->
			</select>
		<div>
		<h3 class='error_msg'><?php if(isset($error)) echo "$error"; ?></h3>	
		</div>	
		
				
		
		<label for="tag_selector">Select tags for your table</label>
		<br/>
		<br/>
				
		<select id='tag_selector' name='tags[]' multiple size="8" >
			<? foreach($tags as $tag): ?>
				<!--  class attribute to enforce uniqueness -->
				<option value='<?=$tag['tag_id']?>' id='<?="key_".preg_replace('/\s+/','_',$tag['tag_name'])?>'><?=$tag['tag_name']?></option>
			<? endforeach; ?>
		</select>
		<br/>
		<input id="add_val" type="text"></input>
		<button type="button" id="bt_add_val"
		title="Note: Newly created tags will be selected automatically " >Add a new tag </button>		
		<br/><br/>		
		
		<input class="button" id="actual_submit" type='Submit' value='Add new post'></input>
	</form>	
	<script  type="text/javascript" src="../js/createTag.js">
	</script>
<?php else: ?>	
	<h1 class="page_error">No user has been specified</h1>
<?php endif; ?>
