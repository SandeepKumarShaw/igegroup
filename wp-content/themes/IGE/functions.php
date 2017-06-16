<?php 
ob_start();
include 'functions/theme-function.php';
include 'functions/scripts.php';
include 'functions/menus.php';
include 'functions/works.php';
include 'functions/wrapper.php';
include 'functions/services.php';

add_action( 'init', 'my_add_excerpts_to_pages' );
function my_add_excerpts_to_pages() {
     add_post_type_support( 'page', 'excerpt' );
}

ob_clean();

?>