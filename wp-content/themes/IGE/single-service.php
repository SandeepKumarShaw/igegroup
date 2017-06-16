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
 <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

                 <article class="c-news_item -open is-open">
                         <div class="c-news_wrap">
                            <header class="c-news_header">
                                <h1 class="c-news_title o-h2"><?php echo get_the_title($post->ID); ?></h1>
                                <p class="c-news_subtitle"><?php echo get_field('service_title_2', $post->ID);?></p>
                            </header>
                            <div class="c-news_main s-wysiwyg">
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
                    </article>
  <?php endwhile; ?>
                        <?php endif; ?>    
                </div>
            </div>
        </div>
    </div>
</div>

            </main>

<?php get_footer(); ?>
