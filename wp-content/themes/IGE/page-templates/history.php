<?php
/*
Template Name: Story Page
*/
?>

<?php get_header(); ?>
            <main data-module="ScrollPage">

<div class="o-page js-template" data-template="history">

    <nav class="c-history_dots">
    <?php if( have_rows('story_page_section1', 11) ): ?>
<?php while( have_rows('story_page_section1', 11) ): the_row(); ?>
    <?php
       $date      = get_sub_field('date');?>
        <button class="c-history_dots_item js-scroll-section-dot js-scroll-section-to" data-scroll-group="<?php echo $date;?>">
            <span class="c-history_dots_year"><?php echo $date;?></span>
        </button>
    <?php endwhile; ?>                      
<?php endif; ?>
    </nav>

    <div class="o-page -translate">
        <header class="c-header-page o-section-scroll -translate -dark js-scroll-section">
            <div class="c-header-page_section -dark -auto-medium is-active">
                <div class="c-header-page_item -content">
                    <div class="c-header-page_content -load -padding -dark -noright">
                        <p class="c-header-page_subtitle"><?php the_field('section_title'); ?></p>
                        <h1 class="c-header-page_title -small -lowercase"><?php the_field('story_page_section'); ?></h1>
                        <button class="o-button-anchor js-scroll-section-next" type="button">
                            <div class="o-button-anchor_icon"></div> 
                        </button>
                    </div>
                </div>
                <div class="c-header-page_item">
                    <div class="c-header-page_image -load o-background"></div>
                    <div class="c-header-page_content -reverse -load -dark -padding-left">
                        <div class="c-history_description">
                            <p><?php the_field('story_page_section2'); ?></p>
                        </div>
                    </div>
                </div>
        </header>
<?php if( have_rows('story_page_section1', 11) ):

 ?>
<?php while( have_rows('story_page_section1', 11) ): the_row(); ?>
    <?php
       $date      = get_sub_field('date');

       $title1    = get_sub_field('title1');
       $content1  = get_sub_field('content1');
       $carouse1  = get_sub_field('image1');

       $title2    = get_sub_field('title2');
       $content2  = get_sub_field('conten2');
       $carouse2  = get_sub_field('image2'); 



    ?>
        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="<?php echo $date; ?>">
            <div class="c-history_year">
                <div class="c-history_year_text">
                <?php
                   $pieces = str_split($date);
                ?>
                    <span><?php echo $pieces[0]; ?></span><span><?php echo $pieces[1]; ?></span><span><?php echo $pieces[2]; ?></span><span><?php echo $pieces[3]; ?></span>
                </div>
            </div>
        </section>
    <?php if( get_sub_field('title1') || get_sub_field('image1') || get_sub_field('content1') ): ?>
        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="<?php echo $date; ?>">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                        <?php if( get_sub_field('date') ): ?>
                            <p class="c-history_subtitle"><?php echo $date; ?></p>
                        <?php endif; ?>
    
                            <?php if( get_sub_field('title1') ): ?>
                            <h2 class="c-history_title o-h2"><?php echo $title1; ?></h2>
                            <?php endif; ?>
                            <?php if( get_sub_field('content1') ): ?>                        
                            <p class="c-history_text"><?php echo $content1; ?></p>
                            <?php endif; ?>                            
                        </div>
                    </div>
                    <?php if( get_sub_field('image1') ): ?> 
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo $carouse1['url']; ?>">
                    </div>
                <?php endif; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>    
    <?php if( get_sub_field('title2') || get_sub_field('image2') || get_sub_field('conten2') ): ?>
        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="<?php echo $date; ?>">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle"><?php echo $date; ?></p>
                            <?php if( get_sub_field('title2') ): ?>
                            <h2 class="c-history_title o-h2"><?php echo $title2; ?></h2>
                            <?php endif; ?>
                            <?php if( get_sub_field('conten2') ): ?>                        
                            <p class="c-history_text"><?php echo $content2; ?></p>
                            <?php endif; ?>                           
                        </div>
                    </div>
                    <?php if( get_sub_field('image2') ): ?>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo $carouse2['url']; ?>">
                    </div>
                <?php endif; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>    
<?php endwhile; ?>                      
<?php endif; ?>
        <!-- <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1997">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>1</span><span>9</span><span>9</span><span>7</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1997">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">1997</p>
                            <h2 class="c-history_title o-h2">Expansion</h2>
                            <p class="c-history_text">In order to expand our capabilities IGE moved to a larger facility in Littleton Colorado and the company implemented a full graphic production department in order to manage in house all the graphics for the exhibits. Also more designers and detailers were</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/1997_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1998">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>1</span><span>9</span><span>9</span><span>8</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1998">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">1998</p>
                            <h2 class="c-history_title o-h2">Global Platform</h2>
                            <p class="c-history_text">Our business platform grew from Latin America to Europe and Asia., building exhibits for major US corporations around the world. Our sales and exhibit design skills also grew exponentially during this period. By the end of the 90’s IGE had done work in mo</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">

                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1998">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">1998</p>
                            <h2 class="c-history_title o-h2">US Exhibits</h2>
                            <p class="c-history_text">By the end of the 90’s IGE started working at US shows and quickly become known. Started doing trade show exhibits in the US. Our design skills was required in the US by former clients using our services overseas.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/1998_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1999">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>1</span><span>9</span><span>9</span><span>9</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="1999">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">1999</p>
                            <h2 class="c-history_title o-h2">Corporate Events</h2>
                            <p class="c-history_text">Soon IGE was growing by doing corporate events and product launch experiences all over the world.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/1999_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2000">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>0</span><span>0</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2000">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2000</p>
                            <h2 class="c-history_title o-h2">Domestic Exhibit Company</h2>
                            <p class="c-history_text">IGE become a consolidated US Exhibit Company serving the domestic and international market. All this thanks to a an innovative design which many called elegant and simple. Many US based companies started hiring IGE for US domestic work due to the design o</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2000_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2003">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>0</span><span>3</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2003">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2003</p>
                            <h2 class="c-history_title o-h2">Retail Industry</h2>
                            <p class="c-history_text">IGE expanded its services to the retail industry doing global retail programs for companies such as Nokia all over the world. Our work consisted on the design, build and implementation of retail displays and full retail environments.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2003_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2006">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>0</span><span>6</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2006">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2006</p>
                            <h2 class="c-history_title o-h2">New Facilities</h2>
                            <p class="c-history_text">IGE relocated its operations and bought two new facilites in Englewood Colorado in order to accommodate growth and increase the fabrication and warehouse capacity for the domestic market.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2008">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>0</span><span>8</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2008">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2008</p>
                            <h2 class="c-history_title o-h2">Designer of the Year Award</h2>
                            <p class="c-history_text">IGE starts winning multiple exhibit design awards. The industry has continually recognized the founder of IGE Gino Pellegrini for his sophisticated design and ability to bring his clients’ brands to life. In 2008, Gino was named EDPA’s Designer of the Yea</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2010">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>1</span><span>0</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2010">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2010</p>
                            <h2 class="c-history_title o-h2">Dubai & Saudi Arabia</h2>
                            <p class="c-history_text">IGE starts doing major trade show exhibits overseas for companies like Toyota and Mobily in Saudi Arabia and Dubai</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2010_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2011">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>1</span><span>1</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2011">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2011</p>
                            <h2 class="c-history_title o-h2">US Operations</h2>
                            <p class="c-history_text">IGE starts consolidating its operations in the US with new larger accounts such as Procter and Gamble, Lockheed Martin and other major clients. The facilities expand into a state of the art design studio in Denver as well as CNC Fabrication, Warehousing.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2011_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2012">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>1</span><span>2</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2012">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2012</p>
                            <h2 class="c-history_title o-h2">Innovation Award</h2>
                            <p class="c-history_text">IGE designed and built a new large mega trade show experience for Sea Ray. The same year at the Miami International Boat Show IGE won both, best of show and innovation award.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2012_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2013">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>1</span><span>3</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2013">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2013</p>
                            <h2 class="c-history_title o-h2">The 2013<br> Fab 50</h2>
                            <p class="c-history_text">IGE was selected as one of the top fabricators serving the U.S. event and exhibit industry by event marketer.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2013_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2014">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>1</span><span>4</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2014">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2014</p>
                            <h2 class="c-history_title o-h2">Design Studio</h2>
                            <p class="c-history_text">IGE expands its design studio and acquires the latest technology for its 3D designs with the inclusion of BOXX machines for real time exhibit design renderings.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2014_01.jpg">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2016">
            <div class="c-history_year">
                <div class="c-history_year_text">
                    <span>2</span><span>0</span><span>1</span><span>6</span>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2016">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2016</p>
                            <h2 class="c-history_title o-h2">IGE writes its own software</h2>
                            <p class="c-history_text">After years of work, finally in 2016 we finally implemented VOS. A visual operating system to manage our overall company on a single application via ipad, including sales briefing, work orders, event schedules, warehouse to inventory and shipping as well </p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                    </div>
                </div>
            </div>
        </section>

        <section class="c-history_section o-section-scroll -translate -center -dark js-scroll-section" data-scroll-group="2016">
            <div class="o-container -small">
                <div class="c-history_grid o-grid">
                    <div class="c-history_item -text o-grid_item">
                        <div class="c-history_content">
                            <p class="c-history_subtitle">2016</p>
                            <h2 class="c-history_title o-h2">Today</h2>
                            <p class="c-history_text">IGE remains at the forefront of event and experiential marketing, trailblazing new technologies for building and measuring brand affinity for the world's top brands.</p>
                        </div>
                    </div>
                    <div class="c-history_item -image o-grid_item">
                        <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/2016_02.jpg">
                    </div>
                </div>
            </div>
        </section> -->
        <footer class="c-footer-action">
            <a class="c-footer-action_link" href="<?php echo site_url();?>/contact/">Start your project</a>
        </footer>
    </div>

</div>

            </main>
<?php get_footer(); ?>