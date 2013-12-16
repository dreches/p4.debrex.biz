<?php
class users_controller extends base_controller {
	
		
    public function __construct() {
        parent::__construct();
        #echo "users_controller construct called<br><br>";
    } 

    public function index() {
        echo "This is the index page";
    }

    public function signup() {
        //echo "This is the signup page";
		# Set up the view
	   $this->template->title = "DocTalk: signup";
       $this->template->content = View::instance('v_users_signup');
	   	# Initiate error - maybe don't need this if checking is in p_signup
		$this->template->content->error = '<br>';
	    # Render the view
       echo $this->template;
	   //echo DB_NAME;
    }
	
	public function p_signup() {
	    /* Perform error checking for the fields submitted 
		   The fields are all required  */
		
		# Innocent until proven guilty
		
		$error = false;
		$errstr = '<br>';
		# Loop through the POST data
		foreach($_POST as $field_name => $value) {
			
			# If a field was blank, add a message to the error View variable
			if($value == "") {
				$errstr .= $field_name.' is blank.<br>';
				$error = true;
				
			}
		}	
		if (!$error) {
			# compare the passwords entered to make sure they are the same
			if( strcmp($_POST['password2'],$_POST['password']) !=0 ) {
			
				unset($_POST['password']);
				unset($_POST['password2']);
				$error = true;
				$errstr .= 'Password inputs do not match. Please reenter.<br>';
			}
			# check to see if the email is already being used
			$email = DB::instance(DB_NAME)->sanitize($_POST['email']);
			# Do we have a user with that email?
			$q = "SELECT email 
			FROM users 
			WHERE email = '".$email."'";
			
			$found_email = DB::instance(DB_NAME)->select_field($q);
					
			# If we found the email, we have an error
			if ($found_email) {
				$error =  true;
				$errstr .=  $found_email.' is already in use.<br>'; 
				unset($_POST['email']);	
			}
			
		}
		# Not using the User signup method because I didn't want the rerouting to the login page if the email is not unique. I did my own check.  
		if (!$error) {
			# remove the variables which aren't in the database
			unset($_POST['password2']);
			unset($_POST['form_id']);
			
			$_POST['created']  = Time::now();
			$_POST['modified'] = Time::now();
			$_POST['password'] = User::hash_password($_POST['password']);
			$_POST['token']    = User::generate_token($_POST['email']);
	        
			/*
			echo "<pre>";
			print_r($_POST);
			echo DB_NAME;
			echo "<pre>";
			*/
			
			$user_id = DB::instance(DB_NAME)->insert_row('users', $_POST);
			
			if( !is_numeric($user_id)) {
				$error = true;
				$errstr .=  'Error creating new user. Signup Failed<br>'; 
			}
			
			else {
				#OLD Send them to the login page
				#OLD Router::redirect('/users/login');
				
				#log them in and send them directly to the profile page
				# note: the password is already hashed and $email is 
				# already sanitized
				$q = 
				'SELECT token 
				FROM users
				WHERE email = "'.$email.'"
				AND password = "'.$_POST['password'].'"';
				
				//echo $q;
		   
				$token = DB::instance(DB_NAME)->select_field($q);
			
				# Success
				if($token) {
					$this->do_login_update($token);
				}
				# Fail. log in failes, for some reason, send them to the login
				# page, not signup. 
				else {
					$error = true;
					$errstr .= 'User created<br>';
					$errstr .= 'Please log in <br>';
					
					$this->template->content = View::instance('v_users_login'); 
					$this->template->content->user['email'] = $email;
					$this->template->content->error = $errstr;			
					echo $this->template;   
					
				}
			}
	    }
		# Success
		if (!$error) {
		#echo "You are logged in!";
			Router::redirect('/users/profile/'.$_POST['first_name'].' '.$_POST['last_name']);
		}
		else {
			$this->template->title = "DocTalk: signup";
			$this->template->content = View::instance('v_users_signup');
			# Put the error messages
			$this->template->content->error = $errstr;
			# Render the view
			echo $this->template;
		}
		
	    
    }
	
	private function do_login_update($token) {
			setcookie('token',$token, strtotime('+1 year'), '/');
			# Update last login timestamp
			DB::instance(DB_NAME)->update("users", Array("last_login" => Time::now()), "WHERE token = '".$token."'");
	}
	

    public function login() {
        //echo "This is the login page";
		$this->template->content = View::instance('v_users_login');    	
    	$this->template->content->error = "<br/>";
		echo $this->template;   
       
    }
	
	public function p_login() {
	   	   
		$password = User::hash_password($_POST['password']);
		$email = DB::instance(DB_NAME)->sanitize($_POST['email']);
		/*
		echo "<pre>";
	    print_r($_POST);
	    echo "</pre>";
		*/
		$q = 
			"SELECT token 
			FROM users
			WHERE email = '".$email."'
			AND password = '".$password."'";
			
			//echo $q;
	   
		$token = DB::instance(DB_NAME)->select_field($q);
		
		# Success
		if($token) {
			$this->do_login_update($token);
			Router::redirect('/users/profile');
		}
		# Fail
		else {
			
			$this->template->content = View::instance('v_users_login'); 
			$this->template->content->error = "Login failed.";			
			echo $this->template;   
		}
	   
    }


    public function logout() {
	 # Generate a new token they'll use next time they login
       $new_token = sha1(TOKEN_SALT.$this->user->email.Utils::generate_random_string());
       
       # Update their row in the DB with the new token
       $data = Array(
       	'token' => $new_token
       );
       DB::instance(DB_NAME)->update('users',$data, "WHERE user_id ='". $this->user->user_id."'");
       
       # Delete their old token cookie by expiring it
       setcookie('token', '', strtotime('-1 year'), '/');
       
       # Send them back to the homepage
       Router::redirect('/');
       
	}

    public function profile($user_name = NULL) {
		/*
		if($user_name == NULL) {
            echo "No user specified";
        }
        else {
            echo "This is the profile for ".$user_name;
        }
		*/
		# Only logged in users are allowed...
		if(!$this->user) {
			$this->template->content = View::instance('v_users_login');
			$this->template->content->error = "<br/>Profile page for members only. Please log in.";
			die("$this->template");
			#die('<br/><br/><span class="error">Members only.</span><a class="button" href="/users/login">Login</a>');
		}
		# If user is defined, but not user_name, get it from user.
		# For now, we only show the user their own profile, so this is OK.
		if ($user_name == NULL) {
			$user_name = $this->user->first_name.' '.$this->user->last_name;
		}
		
				
		# Set up the View
		$this->template->content = View::instance('v_users_profile');
		$this->template->title = "DocTalk: Profile";
		
		
		# Load client files
		$client_files_head = Array(
			'/css/profile.css',
			);
		
		$this->template->client_files_head = Utils::load_client_files($client_files_head);
		
		$client_files_body = Array(
			'/js/profile.js'
			);
		
		$this->template->client_files_body = Utils::load_client_files($client_files_body);
		
		# Pass the data to the View
		$this->template->content->user_name = $user_name;
		
		# Display the view
		echo $this->template;
			
		//$view = View::instance('v_users_profile');
		//$view->user_name = $user_name;		
		//echo $view;
		
    }
	
	public function p_profile (){
		$errstr = '<br>';
		$error = false;
		foreach($_POST as $field_name => $value) {
			
			# Just ignore fields that were blanked out.
			if(empty($value)) {
				unset($_POST[$field_name]);
			}
			# if there is no matching field in $this->user, remove so
			# it won't go into the table
			# (future option - use such field for something else)
			else if (!isset($this->user->$field_name)){
				#echo $field_name.' is not defined in user. <br>';
				unset($_POST[$field_name]);
			}
			# or fields that haven't changed
			else if ($val =(strcmp($value, $this->user->$field_name)==0))
				{
					#echo $field_name.' matched the value: '.$value.'<br>';
					unset($_POST[$field_name]);
				}
			
			else {
				#echo "[strcmp value =".$val."]";
				#echo $field_name.' did not match '.$value.'<br>';
			}
		}
		# Check if an avatar was actually loaded
		$key = key($_FILES);
		$f_error = $_FILES[$key]['error'];
		$filename = $_FILES[$key]['name'];
		#$errstr = '';
		if ( $f_error>0) {
			#echo "error value: $f_error";
			# if a file was specified, but not loaded, report an error so user can retry 
			if ($f_error <> 4) {
				$error = true;
				$errstr .= "Error attempting to upload $filename: ";
				switch ($f_error) {
					case 1:
					case 2: 
						$errstr .= "File size was too large. <br>";
						break;
					case 3:
						$errstr .= "File only partially uploaded<br>";
						break;
					default:
						$errstr .= "Error code: $f_error.<br>";
				}
				# Set up the View
				$this->template->content = View::instance('v_users_profile');
				$this->template->title = "DocTalk: Profile";
			    $this->template->content->error = $errstr;
				$this->template->content->user_name = $this->user->first_name.' '.$this->user->last_name;
				echo $this->template;
			}
			else
			{
				$errstr .= "No file was specified for upload. Press Skip button to leave the page.<br>";
			}
			
		}
		
		
		# At this point, either no file was specified, in which case proceed, or a file was uploaded to a temp directory.
		if (!$error) {
			if (!empty($filename))
			{
				# Give the file a unique name by incorporating the user_id.
				$new_name = "mypic".$this->user->user_id;
				$new_name = Upload::upload($_FILES,AVATAR_PATH,array("jpg","JPG","jpeg","JPEG","gif","GIF","png","PNG"),$new_name);
				if ($new_name === "Invalid file type.") {
					#echo "Invalid file type";
					$errstr .= "Invalid file type for $filename.<br>";
					$error = true;
				}
				else {
					# Put the avatar in $_POST 
					#echo ($new_name);
					$_POST["avatar"]= $new_name;
				}
			}
			else
			{
				$errstr .= "No file uploaded.";
			}
		}
		/**
		echo "This is your profile.<br>";
		echo "<pre>";
		echo print_r($_POST);
		echo print_r($_FILES);
		
		echo key($_FILES)."<br>";
		echo print_r(pathinfo($_FILES["avatar"]["name"]));
		echo getcwd();
		echo "</pre><br>";
		**/
		if (!$error and !(empty($_POST))) {
			$where_condition = "WHERE user_id = '".$this->user->user_id."'";
			# Update the database
			DB::instance(DB_NAME)->update('users',$_POST,$where_condition );
		}
		if ($error) {
		# Set up the View
			$this->template->content = View::instance('v_users_profile');
			$this->template->title = "DocTalk: Profile";
			$this->template->content->error = $errstr;
			$this->template->content->user_name = $this->user->first_name.' '.$this->user->last_name;
			echo $this->template;
		}
		else {
		
			Router::redirect('/posts/add');
		}
		
	}

} # end of the class