<?php
/*
Template Name: About
*/
?>

<?php get_header(); ?>


            <main data-module="ScrollPage">

<div class="o-page -translate js-template" data-template="about">
    <header class="c-header-page">
        <div class="c-header-page_section js-scroll-section is-active" data-scroll-section-translate="false">
            <div class="c-header-page_item -content">
                <div class="c-header-page_content -load -padding -noright">
                    <p class="c-header-page_subtitle"> <?php the_title(); ?></p>
                    <h1 class="c-header-page_title -small -lowercase">
                       <?php the_field('about_page_subtitle'); ?>
                    </h1>
                 
                        <?php the_field('about_page_content'); ?>
                 
                    <button class="o-button-anchor js-scroll-section-next" type="button">
                       <div class="o-button-anchor_icon"></div> 
                        <span class="o-button-anchor_label">More</span>
                    </button>
                </div>
            </div>
            <div class="c-header-page_item -image -big">
            <?php $img11=get_field('about_banner_image');?>
                <div class="c-header-page_image o-background -overlay-gradient -load" style="background-image: url('<?php echo $img11;?>');"></div>
            </div>
            <button class="o-button-next -load -white js-scroll-section-last" type="button">
                <span>
                    <span class="o-button-next_label"><?php the_field('about_page_title'); ?></span>
                </span>
            </button>
        </div>
    </header>

    <section class="o-section-scroll js-scroll-section js-scroll-container" data-scroll-section-scrollbar="true" data-scroll-section-translate="true">
        <div class="o-section-scroll_content">
            <div class="o-container">

                <div class="c-carousel-content o-grid" data-module="CarouselContent">
                    <div class="c-carousel-content_half -dark o-grid_item -half">
                        <div>
                            <h2 class="c-carousel-content_title o-h1">Process</h2>
                            <nav class="c-carousel_nav">
                                <ul class="c-carousel_nav_list">
                               
                              
                                    <li class="c-carousel_nav_item">
                                        <button class="c-carousel_nav_link is-active js-carousel-dot" data-slide="0">
                                            <span class="c-carousel_nav_indicator">
                                                <span class="c-carousel_nav_number"><?php echo get_field('process_no1'); ?></span>
                                                <span class="c-carousel_nav_line"></span>
                                            </span>
                                            <span class="c-carousel_nav_label"><?php echo get_field('process_label1'); ?></span>
                                        </button>
                                    </li>
                            
                                    <li class="c-carousel_nav_item">
                                        <button class="c-carousel_nav_link js-carousel-dot" data-slide="1">
                                            <span class="c-carousel_nav_indicator">
                                                <span class="c-carousel_nav_number"><?php echo get_field('process_no2'); ?></span>
                                                <span class="c-carousel_nav_line"></span>
                                            </span>
                                            <span class="c-carousel_nav_label"><?php echo get_field('process_label2'); ?></span>
                                        </button>
                                    </li>
                                    <li class="c-carousel_nav_item">
                                        <button class="c-carousel_nav_link js-carousel-dot" data-slide="2">
                                            <span class="c-carousel_nav_indicator">
                                                <span class="c-carousel_nav_number"><?php echo get_field('process_no3'); ?></span>
                                                <span class="c-carousel_nav_line"></span>
                                            </span>
                                            <span class="c-carousel_nav_label"><?php echo get_field('process_label3'); ?></span>
                                        </button>
                                    </li>
                                    <li class="c-carousel_nav_item">
                                        <button class="c-carousel_nav_link js-carousel-dot" data-slide="3">
                                            <span class="c-carousel_nav_indicator">
                                                <span class="c-carousel_nav_number"><?php echo get_field('process_no4'); ?></span>
                                                <span class="c-carousel_nav_line"></span>
                                            </span>
                                            <span class="c-carousel_nav_label"><?php echo get_field('process_label4'); ?></span>
                                        </button>
                                    </li>
                                    <li class="c-carousel_nav_item">
                                        <button class="c-carousel_nav_link js-carousel-dot" data-slide="4">
                                            <span class="c-carousel_nav_indicator">
                                                <span class="c-carousel_nav_number"><?php echo get_field('process_no5'); ?></span>
                                                <span class="c-carousel_nav_line"></span>
                                            </span>
                                            <span class="c-carousel_nav_label"><?php echo get_field('process_label5'); ?></span>
                                        </button>
                                    </li>
                                    <li class="c-carousel_nav_item">
                                        <button class="c-carousel_nav_link js-carousel-dot" data-slide="5">
                                            <span class="c-carousel_nav_indicator">
                                                <span class="c-carousel_nav_number"><?php echo get_field('process_no6'); ?></span>
                                                <span class="c-carousel_nav_line"></span>
                                            </span>
                                            <span class="c-carousel_nav_label"><?php echo get_field('process_label6'); ?></span>
                                        </button>
                                    </li> 

                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div class="c-carousel-content_half -light o-grid_item -half">
                        <div class="c-carousel -full js-carousel-content">
                      
                            <div class="c-carousel-content_slide">
                                <div class="c-carousel-content_number"><?php echo get_field('process_no1'); ?></div>
                                <div class="c-carousel-content_wrap s-wysiwyg">
                                    <span class="c-carousel-content_subtitle"><?php echo get_field('process_label1'); ?></span>
                                    <h2><?php echo get_field('process_title1'); ?></h2>
                                    <p><?php echo get_field('process_description1'); ?></p>
                                </div>
                            </div>
                      
                         <div class="c-carousel-content_slide">
                                <div class="c-carousel-content_number"><?php echo get_field('process_no2'); ?></div>
                                <div class="c-carousel-content_wrap s-wysiwyg">
                                    <span class="c-carousel-content_subtitle"><?php echo get_field('process_label2'); ?></span>
                                    <h2><?php echo get_field('process_title2'); ?></h2>
                                    <p><?php echo get_field('process_description2'); ?></p>
                                </div>
                            </div>
                            <div class="c-carousel-content_slide">
                                <div class="c-carousel-content_number"><?php echo get_field('process_no3'); ?></div>
                                <div class="c-carousel-content_wrap s-wysiwyg">
                                    <span class="c-carousel-content_subtitle"><?php echo get_field('process_label3'); ?></span>
                                    <h2><?php echo get_field('process_title3'); ?></h2>
                                    <p><?php echo get_field('process_description3'); ?></p>
                                </div>
                            </div>
                            <div class="c-carousel-content_slide">
                                <div class="c-carousel-content_number"><?php echo get_field('process_no4'); ?></div>
                                <div class="c-carousel-content_wrap s-wysiwyg">
                                    <span class="c-carousel-content_subtitle"><?php echo get_field('process_label4'); ?></span>
                                    <h2><?php echo get_field('process_title4'); ?></h2>
                                    <p><?php echo get_field('process_description4'); ?></p>
                                </div>
                            </div>
                            <div class="c-carousel-content_slide">
                                <div class="c-carousel-content_number"><?php echo get_field('process_no5'); ?></div>
                                <div class="c-carousel-content_wrap s-wysiwyg">
                                    <span class="c-carousel-content_subtitle"><?php echo get_field('process_label5'); ?></span>
                                    <h2><?php echo get_field('process_title5'); ?></h2>
                                    <p><?php echo get_field('process_description5'); ?></p>
                                </div>
                            </div>
                            <div class="c-carousel-content_slide">
                                <div class="c-carousel-content_number"><?php echo get_field('process_no6'); ?></div>
                                <div class="c-carousel-content_wrap s-wysiwyg">
                                    <span class="c-carousel-content_subtitle"><?php echo get_field('process_label6'); ?></span>
                                    <h2><?php echo get_field('process_title6'); ?></h2>
                                    <p><?php echo get_field('process_description6'); ?></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <section class="o-section -padding" data-module="CarouselContent">
                <div class="o-container">
                    <div class="o-container">
                        <div class="o-grid -margin-large">
                            <div class="o-grid_item -third">
                                <h2 class="o-h1">Our main clients</h2>
                               
                            </div>
                            <div class="o-grid_item -two-thirds">
                                <div class="c-clients js-carousel-content js-scroll">
                                <?php if(get_field('client_images')): ?>
                                <?php while(has_sub_field('client_images')) : ?>
                                    <div class="c-clients_grid o-grid">
                                        <?php if(get_sub_field('client_images_slide')): ?>
                                        <?php while(has_sub_field('client_images_slide')) : ?>
                                        <div class="c-clients_item o-grid_item -third">
                                            <figure class="c-clients_link">
                                             <?php $image=get_sub_field("client_image1"); ?>
                                          <img src="<?php echo $image; ?>" alt="">
                                            </figure>
                                        </div>
                                         <?php endwhile; ?>
                                         <?php endif; ?>
                                    </div>
                                     <?php endwhile; ?>
                                     <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div id="awards"></div>
            <section class="c-awards o-section -padding -gray">
                <div class="o-container">
                    <div class="o-container">
                        <div class="c-awards_header">
                            <div class="o-grid">
                                <div class="o-grid_item -two-thirds">
                                    <h2 class="o-h1">17 <br>Awards</h2>
                                </div>
                                <div class="o-grid_item -third">
                                    <div class="c-awards_text">
                                        <p>Though we appreciate the compliment, we are proud to put our clients back in the spotlight, gaining increased brand visibility with added media coverage and organizer promotions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="js-scroll">
                        <div class="c-awards_list-header">
                            <div class="c-awards_link">
                                <p class="c-awards_data">Year</p>
                                <p class="c-awards_data">Award</p>
                                <p class="c-awards_data">Category</p>
                                <p class="c-awards_data">Client</p>
                                <p class="c-awards_data">Location</p>
                            </div>
                        </div>
                        <div data-module="CarouselContent">
                            <div class="js-carousel-content">
                            <?php if(get_field('awards_section')): ?>
                            <?php while(has_sub_field('awards_section')) : ?>
                                <div>
                                    <ul class="c-awards_list">
                                        <?php if(get_sub_field('awards_lists')): ?>
                                        <?php while(has_sub_field('awards_lists')) : ?>
                                        <li class="c-awards_item">
                                       <?php if( get_sub_field('linkto') ){?>
                                         <a class="c-awards_link" href="<?php echo get_sub_field('linkto'); ?>">
                                                <p class="c-awards_data">2014</p>
                                                <p class="c-awards_data">Silver Award / Displays - Large Exhibits</p>
                                                <p class="c-awards_data">BMA Awards</p>
                                                <p class="c-awards_data">Crest Oral-B</p>
                                                <p class="c-awards_data">New Orleans, Louisiana, United States</p>
                                            </a>
                                           <?php } else {?> 
                                            <span class="c-awards_link">
                                                <p class="c-awards_data"><?php echo get_sub_field('year'); ?></p>
                                                <p class="c-awards_data"><?php echo get_sub_field('award'); ?></p>
                                                <p class="c-awards_data"><?php echo get_sub_field('category'); ?></p>
                                                <p class="c-awards_data"><?php echo get_sub_field('client'); ?></p>
                                                <p class="c-awards_data"><?php echo get_sub_field('location'); ?></p>
                                            </span>
                                           <?php } ?>
                                        </li>
                                         <?php endwhile; ?>
                                         <?php endif; ?>
                                       
                                    </ul>
                                </div>
                                <?php endwhile; ?>
                                     <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="c-footer-action">
                <a class="c-footer-action_link" href="<?php echo esc_url( get_permalink(13) ); ?>">Start your project</a>
            </footer>

        </div>
    </section>
</div>

            </main>

<?php get_footer(); ?>