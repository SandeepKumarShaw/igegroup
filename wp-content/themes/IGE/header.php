<!doctype html>

<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>>

        <base href="">
        <?php wp_title('|', true, 'right'); ?> <?php //bloginfo('name'); ?>
        <link rel="apple-touch-icon" href="<?php echo esc_url( get_template_directory_uri() ); ?>/image/apple-touch-icon.png">
        <link rel="icon" href="<?php echo esc_url( get_template_directory_uri() ); ?>/image/favicon.png">

        
<?php wp_head(); ?>

    </head>
    <?php
        if ( is_home() ) {?>
        <body data-template="home">
        <?php }elseif ( is_page('about') ) {?>
        <body data-template="about">
        <?php }elseif ( is_page('contact') ) {?>
        <body data-template="contact">
         <?php }elseif ( is_page('story') ) {?>
        <body data-template="history">
        <?php }elseif ( is_page('blog') ) {?>
        <body data-template="news">      
    <?php
    }
    ?>

        <div class="o-spinner">
            <div class="o-spinner_inner"></div>
        </div>
        <div class="o-loader -first"></div>
        <div class="o-loader -transition"></div>

        <div class="o-main" id="main">
            <header class="c-header js-header" data-module="Nav">
                <a class="c-header_logo js-header-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <img class="logo1" src="<?php echo get_option('of_lyhlogoimg1'); ?>" alt="" title="IGEGROUP">
                    <img class="logo2" src="<?php echo get_option('of_lyhlogoimg2'); ?>" alt="" title="IGEGROUP">
                </a>
                <h1 class="c-header_name">InterGlobal Exhibits</h1>
                <button class="c-header_nav-button js-nav-toggle" type="button">
                    <span class="c-header_nav-button_line"></span>
                    <span class="c-header_nav-button_line"></span>
                    <span class="c-header_nav-button_line"></span>
                </button>
                <nav class="c-header_nav">
                    
                     <?php
                                     $defaults = array(
                                                        'theme_location'  => '',
                                                        'menu'            => 'Main-menu',
                                                        'container'       => 'false',
                                                        'container_class' => '',
                                                        'container_id'    => '',
                                                        'menu_class'      => 'menu',
                                                        'menu_id'         => '',
                                                        'echo'            => true,
                                                        'fallback_cb'     => 'wp_page_menu',
                                                        'before'          => '',
                                                        'after'           => '',
                                                        'link_before'     => '<span class="c-header_nav_text">',
                                                        'link_after'      => '</span>',
                                                        'items_wrap'      => '<ul id="%1$s" class="c-header_nav_list">%3$s</ul>',
                                                        'depth'           => 0,
                                                        'walker'          => ''
                                                      );
    
                                     wp_nav_menu( $defaults );

                              ?>
                </nav>
            </header>