<table id="users_table" class="follower_list tablesorter">
	<thead>
		<tr>
			<th>User</th>
			<th>First
		</tr>
	</thead>
	<?php foreach($users as $user): ?>
		<?if(strlen($user['avatar_url'])== strlen(AVATAR_PATH)) $user['avatar_url']=PLACE_HOLDER_IMAGE;?>
		<!-- Create a sortable table of users -->
		<div class="user_item">
			<img src='<?=$user["avatar_url"]?>' alt='<?=$user["avatar_url"]?>' height='75' width='75'></img>
			<br>
			<?=$user['first_name']?> <?=$user['last_name']?>
		
			<?php if(isset($connections[$user['user_id']])): ?>
				<a class="button unfollow" href='/posts/unfollow/<?=$user['user_id']?>'>Unfollow</a>
			<?php else: ?>
				<a class="button follow" href='/posts/follow/<?=$user['user_id']?>'>Follow</a>
			<?php endif; ?>	
			<br>
		</div>	
		

	<?php endforeach ?>
</table>