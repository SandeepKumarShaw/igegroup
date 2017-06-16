<?php get_header(); ?>

 <main data-module="ScrollPage">

<div class="o-page -translate js-template" data-template="about">
    <header class="c-header-page">
        <div class="c-header-page_section js-scroll-section is-active" data-scroll-section-translate="false">
            <div class="c-header-page_item -content">
                <div class="c-header-page_content -load -padding -noright">
                    <p class="c-header-page_subtitle"><?php the_title(); ?></p>
                    <h1 class="c-header-page_title -small -lowercase">
                        Be your <br>colors
                    </h1>
                    <p class="c-header-page_text">
                        <?php the_excerpt(); ?>

                    </p>
                    <button class="o-button-anchor js-scroll-section-next" type="button">
                       <div class="o-button-anchor_icon"></div> 
                        <span class="o-button-anchor_label">More</span>
                    </button>
                </div>
            </div>
            <div class="c-header-page_item -image -big">
                <div class="c-header-page_image o-background -overlay-gradient -load" style="background-image: url('<?php echo esc_url( get_template_directory_uri() ); ?>/image/about-header.jpg');"></div>
            </div>
            <button class="o-button-next -load -white js-scroll-section-last" type="button">
                <span>
                    <span class="o-button-next_label"><?php the_title(); ?></span>
                </span>
            </button>
        </div>
    </header>

    <section class="o-section-scroll js-scroll-section js-scroll-container" data-scroll-section-scrollbar="true" data-scroll-section-translate="true">
        <div class="o-section-scroll_content">
            <div class="o-container">

               
                        <div>
                           <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <?php the_content(); ?>
           <?php endwhile; endif; ?>
                            
                        </div>
                    </div>
                
         

                </div>
          


            
            

            <footer class="c-footer-action">
                <a class="c-footer-action_link" href="contact.htm">Start your project</a>
            </footer>


    </section>
</div>

            </main>

<?php get_footer(); ?>