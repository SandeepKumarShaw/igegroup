
      <footer class="c-footer">
      <?php wp_footer(); ?>

        <a class="c-footer_link -left" href="<?php echo esc_url( get_permalink(7) ); ?>#awards">
          <span>
            <img class="c-footer_icon" src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/cup.png" alt="aeards" title="Awards">
            <span class="c-footer_awards">17</span>
          </span>
        </a>
                <a class="c-footer_link -right" target="_blank" href="#">
                    <span class="c-footer_icon-wrap">
                        <img class="c-footer_icon" src="<?php echo esc_url( get_template_directory_uri() ); ?>/image/download.png" alt="facebook" title="Facebook">
                    </span>
                </a>
      </footer>

    </div>
    <script>
            window.baseUrl = '<?php echo esc_url( get_template_directory_uri() ); ?>/';
        </script>
    <script>window.jQuery || document.write('<script src="<?php echo esc_url( get_template_directory_uri() ); ?>/js/jquery-3.0.0.min.js"><\/script>')</script>
    
  </body>
</html>
