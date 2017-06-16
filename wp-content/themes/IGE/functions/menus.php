<?php 
if ( function_exists( 'register_nav_menu' ) ) {
 register_nav_menu( 'primary', 'primary menu' );
 register_nav_menu( 'secondary', 'secondary menu' );
 
}

function add_classes_on_li($classes, $item, $args) {
  $classes[] = 'c-header_nav_item';
  return $classes;
}
add_filter('nav_menu_css_class','add_classes_on_li',1,3);

add_filter( 'nav_menu_link_attributes', 'wpse156165_menu_add_class', 10, 3 );

function wpse156165_menu_add_class( $atts, $item, $args ) {
	if ($item->menu_order == 1) {
          $class = 'c-header_nav_link js-scroll-section-last';
    }else{
          $class = 'c-header_nav_link';
    }
    $atts['class'] = $class;
    return $atts;
}

?>