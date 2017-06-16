<?php
function add_theme_scripts() {
  
wp_enqueue_style( 'main', get_template_directory_uri() . '/css/main.css', array(), '1.1', 'all');
wp_enqueue_style( 'style', get_template_directory_uri() . '/css/style.css', array(), '1.1', 'all');


wp_enqueue_script( 'jquery.min', 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js', array ( 'jquery' ), 1.1, true);

wp_enqueue_script( 'vendors', get_template_directory_uri() . '/js/vendors.js', array ( 'jquery' ), 1.1, true);
wp_enqueue_script( 'app', get_template_directory_uri() . '/js/app.js', array ( 'jquery' ), 1.1, true);


}
add_action( 'wp_enqueue_scripts', 'add_theme_scripts' );

?>