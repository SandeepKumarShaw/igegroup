<?php

/*-----------------------------------------------------------------------------------*/
/* Widgetize the Email Signup Area
/*-----------------------------------------------------------------------------------*/

if ( function_exists('register_sidebar') )

    register_sidebar(array(
	"name" => "Mail Chimp Newsletter Sign Up Area",
	"description" => "Place your downloaded Mail Chimp Wordpress plugin widget here. If you need to download it, check the theme documentation for instructions."
	));

/*-----------------------------------------------------------------------------------*/
/* Options Framework Functions
/*-----------------------------------------------------------------------------------*/

/* Set the file path based on whether the Options Framework is in a parent theme or child theme */

if ( get_stylesheet_directory() == get_template_directory() ) {
	define('OF_FILEPATH', get_template_directory());
	define('OF_DIRECTORY', get_template_directory_uri());
} else {
	define('OF_FILEPATH', get_stylesheet_directory());
	define('OF_DIRECTORY', get_stylesheet_directory_uri());
}

/* These files build out the options interface.  Likely won't need to edit these. */

//include (get_template_part('OF_FILEPATH') . '/admin/admin-functions.php');		// Custom functions and plugins
//require_once (OF_FILEPATH . '/admin/admin-interface.php');		// Admin Interfaces (options,framework, seo)

/* These files build out the theme specific options and associated functions. */

//require_once (OF_FILEPATH . '/admin/theme-options.php'); 		// Options panel settings and custom settings
//require_once (OF_FILEPATH . '/admin/theme-functions.php'); 	// Theme actions based on options settings

?>