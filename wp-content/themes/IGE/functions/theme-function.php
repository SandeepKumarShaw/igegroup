<?php 


if ( get_stylesheet_directory() == get_template_directory() ) {
    define('OF_FILEPATH', get_template_directory());
    define('OF_DIRECTORY', get_template_directory_uri());
} else {
    define('OF_FILEPATH', get_stylesheet_directory());
    define('OF_DIRECTORY', get_template_directory_uri());
}

/* These files build out the options interface.  Likely won't need to edit these. */

require_once (OF_FILEPATH . '/admin/admin-functions.php');      // Custom functions and plugins
require_once (OF_FILEPATH . '/admin/admin-interface.php');      // Admin Interfaces (options,framework, seo)

/* These files build out the theme specific options and associated functions. */

require_once (OF_FILEPATH . '/admin/theme-options.php');        // Options panel settings and custom settings
require_once (OF_FILEPATH . '/admin/theme-functions.php');  // Theme actions based on options settings





?>