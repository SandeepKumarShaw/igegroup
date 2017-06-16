<?php
/*
Template Name: Service Page
*/
?>

<?php get_header(); ?>
 <main data-module="ScrollPage">

<div class="o-page js-template" data-template="services">

    <header class="c-header-page -fixed -news">
        <div class="c-header-page_section -auto-medium js-scroll-section is-active" data-scroll-section="1" data-scroll-section-translate="false">
            <div class="c-header-page_item">
                <div class="c-header-page_content -load -orange -noright">
                    <p class="c-header-page_subtitle">Our Services</p>
                    <h1 class="c-header-page_title -small -lowercase -white">
                        We excell <br>at these
                    </h1>
                    <a class="o-button-anchor -hover" href="<?php echo site_url();?>#projects">
                        <svg class="o-button-anchor_icon -noanim" role="img"><use xlink:href="assets/images/sprite.svg#arrow-right"></use></svg>
                        <span class="o-button-anchor_label">Check out the work</span>
                    </a>
                </div>
            </div>
            <div class="c-header-page_item">
                <div class="c-header-page_image -load -orange o-background"></div>
            </div>
            <div class="o-button-next -load -white -nomedium"></div>
        </div>
    </header>

    <div class="c-news-wrap o-container">
        <div class="o-grid -margin">
            <div class="o-grid_item -third -whole-medium"></div>
            <div class="o-grid_item -two-thirds -medium -whole-medium">
                <div class="c-news" data-module="EntryList">


                 <?php
    $a=2;
    $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
    query_posts(array('posts_per_page' =>-1,'post_type'=>'service','order'=>'ASC','paged' => $paged));                              
?>
<?php if (have_posts()) : ?>
<?php while (have_posts()) : the_post();$a++;?>
                    <article class="c-news_item js-entry-item" style="transition-delay:0.<?php echo $a;?>s" >
                        <div class="c-news_wrap">
                            <header class="c-news_header">
                                <h1 class="c-news_title o-h2"><?php echo get_the_title($post->ID); ?></h1>
                                <p class="c-news_subtitle"><?php echo get_field('service_title_2', $post->ID);?></p>
                            </header>
                            <div class="c-news_main s-wysiwyg js-entry-main">
                                <div class="c-news_content">
                                    <?php  
              $content = get_the_content($post->ID);
              echo $content;

           ?>
                                    <div class="c-news_share">
                                        <a class="o-link -underline" href="<?php the_permalink($post->ID); ?>">Direct link</a>
                                        &nbsp;&nbsp;
                                        <a class="o-link -underline" href="#" onclick="javascript:window.open(this.href,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=600');return false;">Share on Facebook</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span class="c-news_plus js-entry-close"><span class="c-news_plus_wrap"></span></span>
                    </article>
               <?php
 endwhile;endif;?>         

 <?php
wp_reset_query();
?>                 
                </div>
            </div>
        </div>
    </div>

    <footer class="c-footer-action">
        <a class="c-footer-action_link" href="<?php echo site_url();?>/contact/">Start your project</a>
    </footer>
</div>

            </main>
<?php get_footer(); ?>