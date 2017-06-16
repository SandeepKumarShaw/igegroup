<?php get_header(); ?>

 <main data-module="ScrollPage">
<div class="o-page js-template" data-template="news">

    <header class="c-header-page -fixed -news">
        <div class="c-header-page_section -auto-medium js-scroll-section is-active" data-scroll-section="1" data-scroll-section-translate="false">
            <div class="c-header-page_item">
                <div class="c-header-page_content -load -dark -noright">
                    <p class="c-header-page_subtitle">Blog</p>
                    <h1 class="c-header-page_title -small -lowercase -white">
                        Flying <br>colors                    
                    </h1>
                    <a class="o-button-anchor js-scroll-section-next" href="https://www.facebook.com/igegroup" target="_blank">
                        <svg class="o-button-anchor_icon -noanim" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/sprite.svg#arrow-right"></use></svg>
                        <span class="o-button-anchor_label">Follow us on Facebook</span>
                    </a>
                    <!-- <a class="o-button-anchor -hover" href="<?php echo site_url();?>#projects">
                        <svg class="o-button-anchor_icon -noanim" role="img"><use xlink:href="assets/images/sprite.svg#arrow-right"></use></svg>
                        <span class="o-button-anchor_label">Check out the work</span>
                    </a> -->
                </div>
            </div>
            <div class="c-header-page_item">
                <div class="c-header-page_image -load -dark o-background"></div>
            </div>
            <div class="o-button-next -load -white -nomedium"></div>
        </div>
    </header>

    <div class="c-news-wrap o-container">
        <div class="o-grid -margin">
            <div class="o-grid_item -third -whole-medium"></div>
            <div class="o-grid_item -two-thirds -medium -whole-medium">
                <div class="c-news" data-module="EntryList">


                
<?php if (have_posts()) : ?>
<?php while (have_posts()) : the_post();$a++;?>
<article class="c-news_item -open is-open">
    <div class="c-news_wrap">
        <header class="c-news_header">
            <p class="c-news_subtitle">
                <?php echo get_field('post_title_1', $post->ID);?> — <time datetime="01-10-2016"><?php echo get_field('post_date', $post->ID); ?></time>
            </p> 
            <h1 class="c-news_title o-h2">
                <?php echo get_the_title($post->ID); ?>
            </h1>
        </header> 
        <div class="c-news_main s-wysiwyg">
            <div class="c-news_content">
            <?php  $src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), array( 5600,1000 ), false, '' ); ?>
            <?php if ($src !=false){?>
            <img src="<?php echo $src[0]; ?>" alt="">
            <?php } ?>
                <div class="o-big">
                <p><?php echo get_field('post_content_1', $post->ID);?></p>
                <p>&nbsp;</p>
                </div> 
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

</article>
               <?php
 endwhile;endif;?>         
           
                </div>
            </div>
        </div>
    </div>

    <footer class="c-footer-action">
        <a class="c-footer-action_link" href="<?php echo site_url();?>/contact/">Start your project</a>
    </footer>
</div>

<?php get_footer(); ?>