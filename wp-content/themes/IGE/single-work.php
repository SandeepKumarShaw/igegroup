<?php get_header(); ?>

 <main data-module="ScrollPage">
 <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

<div class="o-page">

    <header class="c-header-page -translate">
        <div class="c-header-page_section -full -dark js-scroll-section is-active" data-scroll-section="1" data-scroll-section-next="false">
            <div class="c-header-page_item">
                <div class="c-header-page_content -padding -hidden -load" style="background-color: <?php if(get_field('banner_color_code')){echo get_field('banner_color_code');}else{ echo "#001E74"; }?>;">
                    <p class="c-header-page_subtitle">
                        <span class="c-header-page_subtitle_item"><?php  
              $content = get_the_content();
             // $content = explode('<br>', $content);
              echo $content;

           ?></span>
                       
                    </p>
                    <h1 class="c-header-page_title -big">
                        <?php the_title(); ?>
                    </h1>
                </div>
            </div>
            <div class="c-header-page_item">
                <div class="c-header-page_image -absolute -load">
                <?php $image = get_field('banner_image'); ?>
                    <div class="o-background -overlay-gradient" style="background-image: url('<?php echo $image['url']; ?>');"></div>
                </div>
            </div>
            <button class="o-button-next -load -white js-scroll-section-last" type="button">
                <span>
                    <svg class="o-button-next_icon" role="img"><use xlink:href="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/sprite.svg#arrow-small-down"></use></svg>
                </span>
            </button>
        </div>
    </header>

    <div class="c-project o-section-scroll js-scroll-section js-scroll-container" data-scroll-section="2" data-scroll-section-scrollbar="true" data-scroll-section-next="true">
        <div class="o-section-scroll_content">

            <div class="c-project_wrap js-scroll-section-content">
                <section class="c-project_section -small">
                    <div class="o-container -small">
                        <h2 class="o-h1">Specifications</h2>

                        <div class="c-project_info o-grid">
                            <div class="o-grid_item -two-thirds">

                                <ul class="c-project_specs js-scroll">
								<?php if( have_rows('specifications', $post->ID) ): ?>
                                    <li class="c-project_specs_row">
                                        <span class="c-project_specs_heading">Year</span>
                                        <?php while( have_rows('specifications', $post->ID) ): the_row(); ?>
                                        <span class="c-project_specs_data"><?php the_sub_field('year'); ?></span>
                                        <?php endwhile; ?>

                                    </li>
                                    <li class="c-project_specs_row">
                                        <span class="c-project_specs_heading">Client</span>
                                        <?php while( have_rows('specifications', $post->ID) ): the_row(); ?>
                                        <span class="c-project_specs_data"><?php the_sub_field('client'); ?></span>
                                        <?php endwhile; ?>
                                    </li>
                                    <li class="c-project_specs_row">
                                        <span class="c-project_specs_heading">Mandate</span>
                                        <?php while( have_rows('specifications', $post->ID) ): the_row(); ?>
                                        <span class="c-project_specs_data"><?php the_sub_field('mandate'); ?></span>
                                        <?php endwhile; ?>
                                    </li>
                                    <li class="c-project_specs_row">
                                        <span class="c-project_specs_heading">Location</span>
                                        <?php while( have_rows('specifications', $post->ID) ): the_row(); ?>
                                        <span class="c-project_specs_data"><?php the_sub_field('location'); ?></span>
                                        <?php endwhile; ?>
                                    </li>
                                <?php endif; ?>

                                </ul>

                            </div>
                            <div class="o-grid_item -third">
                                <div class="c-project_what">
                                    <p class="c-project_what_title">What we did</p>
                                  
                                    <ul class="c-project_what_list">
										<?php if( have_rows('what_we_did', $post->ID) ): ?>
										<?php while( have_rows('what_we_did', $post->ID) ): the_row(); ?>

										<li class="c-project_what_item">

										<?php the_sub_field('title'); ?>
										</li>
										<?php endwhile; ?>

										<?php endif; ?>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="o-container">
                    <div class="c-carousel -anim js-scroll" data-module="Carousel">
                    <?php if( have_rows('section_slider', $post->ID) ): ?>
					<?php while( have_rows('section_slider', $post->ID) ): the_row(); ?>
                     <?php $carousel = get_sub_field('image'); ?>
                        <div class="c-carousel_slide">
                            <img class="c-project_image" src="<?php echo $carousel['url']; ?>" alt="<?php echo $carousel['alt']; ?>">
                        </div>
                    <?php endwhile; ?>
                    <?php endif; ?>    
                     
                    </div>
                </div>
                <div class="c-project_section">
                    <div class="o-container -small">
                        <div class="o-grid -margin-huge -alternate">
                         <?php if( have_rows('section_middle', $post->ID) ): ?>
					     <?php while( have_rows('section_middle', $post->ID) ): the_row(); ?>
                         <?php 
                               $carouse2 = get_sub_field('image'); 
                               $title    = get_sub_field('title');
                               $content  =get_sub_field('content');
                         ?>
                            <section class="c-project_subsection o-grid_row">
                                <div class="o-grid_item -three-fifths">
                                    <div class="c-project_image-wrap js-scroll">
                                        <img class="c-project_image -small" src="<?php echo $carouse2['url']; ?>" alt="<?php echo $carouse2['alt']; ?>">
                                    </div>
                                </div>
                                <div class="o-grid_item -two-fifths">
                                    <h2 class="o-h1"><?php echo $title; ?></h2>
                                    <div class="c-project_text s-wysiwyg">
                                        <p><?php echo $content; ?> </p>
                                    </div>
                                </div>
                            </section>
                        <?php endwhile; ?>
                        <?php endif; ?> 
                        
                        </div>
                    </div>
                </div>
                <div class="c-project_image-wrap js-scroll">
                <?php $carouse3 = get_field('section_middle1', $post->ID); ?>

                    <img class="c-project_image -full" src="<?php echo $carouse3['url']; ?>" alt="<?php echo $carouse3['alt']; ?>">
                </div>

                <section class="c-project_section">
                    <div class="o-container -small">
                        <div class="o-grid">

                         <?php if( have_rows('section_end', $post->ID) ): ?>
					     <?php while( have_rows('section_end', $post->ID) ): the_row(); ?>
                         <?php 
                               $title1    = get_sub_field('title');
                               $content1  =get_sub_field('content');
                         ?>
                            <div class="o-grid_item -third -medium">
                                <p class="c-project_stats">
                                    <?php echo $title1; ?>
                                    <span class="c-project_stats_number">
                                    <?php echo $content1; ?>
                                    </span>
                                </p>
                            </div>
                        <?php endwhile; ?>
                        <?php endif; ?>    
                           <!--  <div class="o-grid_item -third -medium">
                                <p class="c-project_stats">
                                    Monitors
                                    <span class="c-project_stats_number">
                                        18
                                    </span>
                                </p>
                            </div>
                            <div class="o-grid_item -third -medium">
                                <p class="c-project_stats">
                                    Acrylic Rods
                                    <span class="c-project_stats_number">
                                        60
                                    </span>
                                </p>
                            </div> -->
                        </div>
                    </div>
                </section>
<?php
$next_post = get_next_post();
$nextID = $next_post->ID ;
$nextimage = get_field('banner_image', $nextID);
$content1 = get_the_content($nextID);
?>

                <div class="c-header-page -next js-scroll">
                    <a class="c-header-page_section -dark -relative is-active" href="<?php echo get_permalink($nextID); ?>" data-transition="next">
                        <div class="c-header-page_item -content">
                            <div class="c-header-page_content -hidden" style="background-color: <?php if(get_field('banner_color_code', $nextID)){echo get_field('banner_color_code', $nextID);}else{ echo "#001E74"; }?>;">
                                <p class="c-header-page_subtitle">
                                    <span class="c-header-page_subtitle_item"><?php echo $content1;?></span>
                                </p>
                                <h1 class="c-header-page_title -big">
                                    <?php echo get_the_title($nextID); ?>
                                </h1>
                            </div>
                        </div>
                        <div class="c-header-page_item -image">
                            <div class="c-header-page_image o-background -overlay-gradient" style="background-image: url('<?php echo $nextimage['url']; ?>');"></div>
                        </div>
                        <div class="o-button-next -next -white js-scroll-section-last">
                            <span>
                            <div class="o-button-next_icon -big"></div> 
                                
                            </span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endwhile;  ?>

<?php endif; ?>
</main>

<?php get_footer(); ?>
