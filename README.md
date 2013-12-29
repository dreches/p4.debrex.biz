p4.debrex.biz
=============

My P4 is an upgrade of P2. I had many ambitious plans to expand functionality such as viewing posts by date, and being able to define groups, 
but in the end focused on improving the functionality I added in P2 in two areas.  The ability to select users to follow, and the mechanism for
creating and adding new and existing tags to a post. 

In p2, the javascript for adding a new tag was bare bones,  and was directly in the php file. A popup screen would prompt you for a new tag
For p4, I changed it and created the file createTag.js. Instead of a popup field, I added a new input field to add additional tags. A lot of work
went into preventing the page from submitting when enter was hit in that field (I tried the key up, key down but for IE it needed keypress as well).
In addition, I wanted to provide some autocomplete functionality, so that if you typed in an existing tag, it would let you select that one right
away. I investigated using various widgets, including combobox, but in the end created my own version, with my own search mechanism for matching
existing tags. In my version, existing tags can either be selected by typing them into the input box, or clicking on them in the select box(may not work for all browsers).
If you enter a value in the input box that doesn't exist, it will create a new tag. Tags that are new will appear in green. The tags that are added will show up
in a new desplay under the future post, so it is clear which tags have been added, and no duplicates are allowed. In addition,
typing in the input box will cause the select box to highlight the first matching tag that it finds, in case that is the one you want.
Clicking on the tags that have been added to the new post will remove them and put them back in the selection box.  I did not use ajax to retrieve existing tags,
or store newly created ones, but might be a future enhancement.

 The other thing I did was change my user table when selecting users to follow. I used tablesorter to allow fields to be sorted
 by first or last name, email and whether or not they were currently being followed.  In addition, I clicking the link for the follow/unfollow 
 button now uses an ajax call which updates the user_user table, so that the entire table of users doesn't have to get redisplayed.
 It took me quite a while to get the functionality working on different browsers, and ultimately I had to go with the mousedown event
 instead of the click event to prevent the button from following the link.  I also spent time making the user table fit
 in with my existing theme, even though that is not required for the assignment.  I thought about deleting the anchor element entirely, 
 but then the sorting on that field stopped working. I did not have time to create a custom sort function for tablesorter.
 
 I also made someone follow themselves by default.
 
 Features (I hope this shows up as a bullet point list)
 <ul >
			<li>Edit your profile (name/uploading an avatar)</li>
			<li>3 ways of viewing posts.
				<ol id='inner_list'>
					<li><span class="bold">By user</span> - see posts of people you are following</li>
					<li><span class="bold">By self</span> - See your own posts (automatic when you add a new post)</li>
					<li><span class="bold">By tag</span> - View posts by tag. When creating a post, add one or more tags.<br>
						When viewing posts, click on a tab to view ALL posts with that tag.</li>
				</ol>
			</li>
		
		<li>P4 improvements:User table is now sortable. </li>
		<li>Adding new tags is now even easier with a custom autocomplete feature and a clearer way of seeing 
		tags selected for a post.</li>
		<li>New user is automatically signed up to view own posts</li> 
 </ul>
 
 Javascript functionality includes a custom theme, the tablesorter and ajax call to follow/unfollow a user,
 the ability to create tags on the fly and autocomplete, as well as making sure a post doesn't get submitted by hitting enter
 on the input field.
 
 My sql file doesn't include the data.  

 My Github includes files that I accidentally added and committed (primarily downloads jquery widgets and all the stuff that comes with it)
 I tried various git commands to remove files, and others to stop tracking, but several made it to the live server, so I resorted to deleting them.
I could still use help with git hub. 

 


