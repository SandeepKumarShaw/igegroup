<?php
/*
Template Name: Contact Page
*/
?>

<?php get_header(); ?>
            <main data-module="ScrollPage">

<div class="o-page -translate js-template" data-template="contact">
    <header class="c-header-page" data-module="Map">
        <div class="c-header-page_background -load -map"></div>
        <div class="c-header-page_section js-scroll-section is-active" data-scroll-section="1" data-scroll-section-translate="false">
            <div class="c-header-page_item -top -nopointer">
                <div class="c-header-page_content -transparent -padding -noright c-map-text">
                    <p class="c-header-page_subtitle -load -contact">
                        <span>InterGlobal</span> <span>Exhibits</span>
                    </p>
                    <h1 class="c-header-page_title -contact -small -tiny -lowercase -current">
                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words-wrap">
                                <span class="c-header-page_title_words"><span>Let</span> <span>us</span></span>
                                <span class="c-header-page_title_words -hidden"><span>whether</span></span>
                            </span>
                        </span>
                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words-wrap">
                                <span class="c-header-page_title_words"><span>maximize</span></span>
                                <span class="c-header-page_title_words -hidden"><span>in Dubai,</span></span>
                            </span>
                        </span>
                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words-wrap">
                                <span class="c-header-page_title_words"><span>your</span></span>
                                <span class="c-header-page_title_words -hidden"><span>Las Vegas,</span></span>
                            </span>
                        </span>
                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words-wrap">
                                <span class="c-header-page_title_words"><span>trade-show</span></span>
                                <span class="c-header-page_title_words -hidden"><span>London or</span></span>
                            </span>
                        </span>
                        <span class="c-header-page_title_line">
                            <span class="c-header-page_title_words-wrap">
                                <span class="c-header-page_title_words"><span>success</span></span>
                                <span class="c-header-page_title_words -hidden"><span>Shanghai.</span></span>
                            </span>
                        </span>
                        <span class="c-header-page_title_line">
                            <button class="o-button-anchor -load -contact js-scroll-section-next" type="button">
                                <span class="o-button-anchor_wrap">
                                    <div class="o-button-anchor_icon"></div>
                                    <span class="o-button-anchor_label">More</span>
                                </span>
                            </button>
                        </span>
                    </h1>
                </div>
            </div>
            <div class="c-header-page_item -full -absolute -map">
                <div class="c-map -overlay-gradient -load">
                    <div class="o-background" id="map"></div>
                </div>
            </div>
            <div class="c-header-page_button -contact">
                <div class="c-header-page_button_item -visible">
                    <button class="o-button -orange js-map-open" type="button">
                        Around the world
                        
                        <div class="o-button_icon"></div>
                    </button>
                </div>
                <div class="c-header-page_button_item -hidden">
                    <button class="o-button -orange -icon js-map-close" type="button">
                        <div class="o-button_icon"></div>
                    </button>
                </div>
            </div>
            <button class="o-button-next -load -white js-scroll-section-last" type="button">
                <span>
                    <span class="o-button-next_label">Get in touch</span>
                </span>
            </button>
        </div>
    </header>

    <section class="o-section-scroll js-scroll-section" data-scroll-section="2" data-scroll-section-scrollbar="true" data-scroll-section-translate="true">
        <div class="o-section-scroll_content">
            <div class="o-container -small">
                <div class="c-contact o-section">
                    <div class="o-grid -margin">
                        <div class="c-contact_grid o-grid_item -third">
                            <div class="c-contact_item">
                                <p class="c-contact_subtitle">Headquarters</p>
                                <h2 class="c-contact_title">IGE Denver</h2>
                                <p>
                                    8674 Concord Center Drive<br>
                                    Englewood, Colorado 80112, USA
                                </p>
                                <div class="c-contact_links">
                                    <a class="c-contact_link" href="tel:1 800 557‑1227">
                                        <span class="c-contact_link_label">1 800 557‑1227</span>
                                    </a><br>
                                    <a class="c-contact_link" href="tel:+1 303 932‑9356">
                                        <span class="c-contact_link_label">+1 303 932‑9356</span>
                                    </a><br>
                                </div>
                            </div>
                            <div class="c-contact_item">
                                <p class="c-contact_subtitle">Manufacturing Workshop</p>
                                <h2 class="c-contact_title">IGE Brazil</h2>
                                <p>
                                    Rua Tupã, 72<br>
                                    Cajamar, São Paulo, Brazil
                                </p>
                            </div>
                        </div>

                        <div class="o-grid_item -two-thirds" data-module="ContactForm">
                            <div class="js-pre-submit">
                          
                                <?php echo do_shortcode('[contact-form-7 id="157" title="contact form"]'); ?>
                            </div>
                            <div class="js-post-submit" style="display: none;">
                                <div class="o-form_feedback">
                                    <h2 class="c-contact_title">Thank you for your interest!</h2>
                                    <p>Your request was successfully submitted.</p>
                                    <div class="o-form_feedback_check"></div>
                                </div>
                                <div class="o-form_feedback-link"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="c-footer-action">
                <a class="c-footer-action_link" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
            </footer>
        </div>
    </section>
</div>

<script>
    /*window.templateData = window.templateData || {};
    
    window.templateData.recaptcha = '6LfrxycTAAAAAObOw7rO6lS6rn8A_lAIxA0ml4Yv';
    function initMap() {
        setTimeout(function() {
            $(document).trigger('init.Map');
        }, 2000);
    }*/
</script>
<script>
    window.templateData = window.templateData || {};
    window.templateData.officeLocations = [[39.559605,-104.8303789],[-23.4163652,-46.8396049]];
    window.templateData.projectLocations = [[39.7392358,-104.990251],[36.1699412,-115.1398296],[42.3600825,-71.0588801],[25.7616798,-80.1917902],[24.7135517,46.6752957],[29.9510658,-90.0715323],[39.7392358,-104.990251],[24.7135517,46.6752957],[28.5383355,-81.3792365],[28.5383355,-81.3792365],[36.1626638,-86.7816016],[32.715738,-117.1610838],[32.715738,-117.1610838],[33.7489954,-84.3879824],[36.1699412,-115.1398296],[51.165691,10.451526],[31.230416,121.473701],[27.950575,-82.4571776],[42.3600825,-71.0588801]];
/*    window.templateData.recaptcha = '6LfrxycTAAAAAObOw7rO6lS6rn8A_lAIxA0ml4Yv';
*/    function initMap() {
       
        setTimeout(function() {
            $(document).trigger('init.Map');
        }, 2000);
    }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBJgSAU62XbdfRCUpot_N9XXAzOsWss2zQ&callback=initMap" async defer></script>
<script src="https://www.google.com/recaptcha/api.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

<!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCp_TgBdcYo023S2mNT02VIjquSZvfCbqA&callback=initMap" async defer></script>
 -->

            </main>
<?php get_footer(); ?>