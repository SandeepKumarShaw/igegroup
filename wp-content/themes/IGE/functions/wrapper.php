<?php 

add_theme_support( 'post-thumbnails' );

add_filter('nav_menu_css_class' , 'special_nav_class' , 10 , 2);

function special_nav_class ($classes, $item) {
    if (in_array('current-menu-item', $classes) ){
        $classes[] = 'is-current ';
    }
    return $classes;
}

function custom_custom_form_class_attr( $class ) {
  $class .= 'c-contact_form o-form o-grid -margin -middle js-form';
  return $class;
}
add_filter( 'wpcf7_form_class_attr', 'custom_custom_form_class_attr' );

function my_wpcf7_dropdown_form($html) {
	$text = 'Select a reason';
	$html = str_replace('---', '' . $text . '', $html);
	return $html;
}
add_filter('wpcf7_form_elements', 'my_wpcf7_dropdown_form');


?>