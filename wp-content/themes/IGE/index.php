<?php
/*
Template Name: Home Page
*/
?>

<?php get_header(); ?>
<main data-module="ScrollPage">
<div class="o-page -translate js-template" data-module="Type" data-template="home">
    <section class="c-header-page">
        <section class="c-header-page_section -full js-scroll-section is-active" data-scroll-section="1" data-scroll-section-scale="false">
            <div class="c-header-page_item -content">
                <div class="c-header-page_content -load -padding -noright">
                    <p class="c-header-page_subtitle -load">
                        <?php the_field('home_page_subtitle'); ?>
                    </p>
                    <h1 class="c-header-page_title -small -lowercase js-type-target">
                    <?php if( have_rows('home_page_subtitle1') ): ?>
                      <?php while( have_rows('home_page_subtitle1') ): the_row(); ?>


                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words">
                                <?php the_sub_field('title'); ?>
                            </span>
                        </span>
                      <?php endwhile; ?>
  
                    <?php endif; ?>
                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words">
                                
                            </span>
                        </span>
                    </h1>
                    <div class="c-header-page_text -small -lowercase js-type-target">
                        <p class="c-header-page_text_wrap">
                            Impress your clients, engage, influence, provoke. Enable your brand experience. Achieve your goal at the show. IGE can deliver your trade-show exhibit on time, on budget and with exceptional attention to quality.
                        </p>
                    </div>
                    <button class="o-button-anchor -load js-scroll-section-next" type="button">
                        <span class="o-button-anchor_wrap">
                            <div class="o-button-anchor_icon"></div>                       
                                 <span class="o-button-anchor_label">More</span>
                        </span>
                    </button>
                </div>
            </div>
            

            <div class="c-header-page_item -image -nomobile">
                <div class="c-header-page_image o-background -overlay -load" style="background-image: url('<?php echo esc_url( get_template_directory_uri() ); ?>/image/home-video-bg.jpg');">
                     <video poster="<?php echo esc_url( get_template_directory_uri() ); ?>/image/home-video-bg.jpg" playsinline autoplay muted loop>
            <source src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/video.mp4.crdownload" type="video/mp4">
            </video>
                </div>
            </div>
        </section>
 <?php
    $a=0;$b=0;$c=1;
    $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
    query_posts(array('posts_per_page' =>3,'post_type'=>'work','order'=>'ASC','paged' => $paged));                              
?>
   
        <div class="c-header-page_sections">
        <?php if (have_posts()) : ?>
<?php while (have_posts()) : the_post();$a++;$b++;$c++;?> 
   <?php
$image = get_field('banner_image', $post->ID);
?> 
            <a class="c-header-page_section -dark -scroll js-scroll-section js-scroll" href="<?php the_permalink(); ?>" data-transition="scale" data-scroll-section="<?php echo $c;?>" data-scroll-section-scale="true" data-scroll-section-translate="false">
                <div class="c-header-page_wrap">
                    <div class="c-header-page_item -content">
                        <div class="c-header-page_content -hidden" style="background-color:<?php if(get_field('banner_color_code', $post->ID)){echo get_field('banner_color_code', $post->ID);}else{ echo "#001E74"; }?>;">
                            <p class="c-header-page_subtitle">
                                <span class="c-header-page_subtitle_item"> <?php  
              $content = get_the_content($post->ID);
              echo $content;

           ?></span>
                                
                            </p>
                            <h1 class="c-header-page_title -big">
                                <?php echo get_the_title($post->ID); ?>
                            </h1>
                        </div>
                    </div>
                    <div class="c-header-page_item -image -hidden">
                        <div class="c-header-page_image o-background -overlay-gradient">
                            <div class="c-header-page_image_background o-background" style="background-image: url('<?php echo $image['url']; ?>');"></div>
                        </div>
                    </div>
                </div>
            </a>
   <?php
 endwhile;endif;?>         

        </div>
 <?php
wp_reset_query();
?>            
        <div class="c-header-page_dots">

            <span class="c-header-page_dots_button js-scroll-section-dot" data-scroll-section="2">
                <span class="c-header-page_dots_dot" style="background-color: #E00007;"></span>
            </span>
            <span class="c-header-page_dots_button js-scroll-section-dot" data-scroll-section="3">
                <span class="c-header-page_dots_dot" style="background-color: #001E74;"></span>
            </span>
            <span class="c-header-page_dots_button js-scroll-section-dot" data-scroll-section="4">
                <span class="c-header-page_dots_dot" style="background-color: #EFC40B;"></span>
            </span>
        </div>

        <button class="c-header-page_next o-button-next js-scroll-section-last" type="button">
            <span>
                <span class="o-button-next_label">Work</span>
            </span>
        </button>

        <div class="c-header-page_border-horizontal"></div>
        <div class="c-header-page_border-vertical"></div>
    </section>
    
    <section class="o-section-scroll -white js-scroll-section js-scroll-container" data-scroll-section="5" data-scroll-section-scrollbar="true" data-scroll-section-translate="true" >
        <div class="o-section-scroll_content">
            <div class="o-container">
                <div class="o-section" >
                    <div class="o-grid -margin-medium -bottom">
                        <div class="o-grid_item -two-thirds">
                            <div class="c-block-heading s-wysiwyg">
                                <div class="o-container -noright -nosmall">
                                    <h2 class="o-h1"><?php the_field('home_page_subtitle2'); ?></h2>
                                    <div class="o-grid -margin-medium -nobottom">
                                    <div class="o-grid_item -half -small"><p><?php the_field('home_page_content'); ?></p></div>
                                    <div class="o-grid_item -half -small"><p><?php the_field('home_page_content2'); ?></p></div>
                                    </div>
                                </div>
                                 
                            </div>
                        </div>
                        
                      <?php
    $p=0;
    $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
    query_posts(array('posts_per_page' =>-1,'post_type'=>'work','order'=>'ASC','paged' => $paged));                              
?>
<?php if (have_posts()) : ?>
<?php while (have_posts()) : the_post();$p++;?>    
                        <div <?php if ($p==1) {?> class="o-grid_item -third -medium-half js-scroll"<?php }else{?> class="o-grid_item -third -medium-half js-scroll is-show" <?php } ?>>
                            <a class="c-block" href="<?php the_permalink(); ?>">
                                <div class="c-block_wrap">
                                <?php
$src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), array( 5600,1000 ), false, '' );
?> 
                                    <div class="c-block_background">
                                     <div class="o-background" style="background-image: url(<?php echo $src[0]; ?>);"></div>
                                    </div>
                                    <div class="c-block_content">
                                        <div class="c-block_content_background" style="background-color:<?php if(get_field('banner_color_code', $post->ID)){echo get_field('banner_color_code', $post->ID);}else{ echo "#001E74"; }?>;"></div>
                                        <h4 class="c-block_title">
                                           <?php the_title();?> 
                                        </h4>
                                        
                                        <div class="c-block_text"><?php the_content();?></div>
                                       
                                        <img class="c-block_plus" src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/plus-sign-icon.png" alt="">
                                    </div>
                                </div>
                            </a>
                        </div>
               <?php
endwhile;endif;
wp_reset_query();
?>            
                  </div>
                </div>
                                <div class="o-section -padding-bottom">
                    <div class="o-grid -margin-medium -bottom">
                    <?php if( have_rows('home_page_content3') ): ?>
                      <?php while( have_rows('home_page_content3') ): the_row(); ?>
                      	 <div class="o-grid_item -third -half-medium -small">
                            <div class="o-grid_content">
                                <h3><?php the_sub_field('title'); ?></h3>
                                <p><?php the_sub_field('content'); ?></p>
                            </div>
                        </div>
                      <?php endwhile; ?>                      
                     <?php endif; ?>
                    </div>
                </div>
                <footer class="c-footer-action">
                  <a class="c-footer-action_link" href="<?php echo site_url();?>/contact/">Start your project</a>
                </footer>
            </div>
        </div>
    </section>    
</div>
</main>
<?php get_footer(); ?>