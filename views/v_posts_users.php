<table id="users_table" class="follower_list tablesorter">
	<thead  class = 'ui-widget-header'>
		
		<tr>
			<th class="user_img_column">User</th>
			<th >First Name</th>
			<th >Last Name</th>
			<th>email</th>
			<th>Following</th>
		</tr>
		
	</thead>
	<tbody>
	<?php foreach($users as $user): ?>
		<?if(strlen($user['avatar_url'])== strlen(AVATAR_PATH)) $user['avatar_url']=PLACE_HOLDER_IMAGE;?>
		<!-- Create a sortable table of users -->
		<tr class="user_item">
			<td class="user_img_column" >
				<img src='<?=$user["avatar_url"]?>' alt='<?=$user["avatar_url"]?>' height='60' width='60'></img>
			</td>
			<td>
				<?=$user['first_name']?>
			</td>
			<td>
				<?=$user['last_name']?>
			</td>
			<td>
				this is a really long let's see what happens email address
			</td>
			<td class = "ui-widget-header">
				<?php if(isset($connections[$user['user_id']])): ?>
					<a class="button unfollow" href='/posts/unfollow/<?=$user['user_id']?>'>Unfollow</a>
				<?php else: ?>
					<a class="button follow" href='/posts/follow/<?=$user['user_id']?>'>Follow</a>
				<?php endif; ?>	
			</td>
			
		</tr>	
		

	<?php endforeach ?>
	</tbody>
</table>