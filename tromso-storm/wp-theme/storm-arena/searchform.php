<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <label>
        <span class="screen-reader-text"><?php esc_html_e('Søk etter:', 'storm-arena'); ?></span>
        <input type="search" class="search-field" placeholder="<?php esc_attr_e('Søk i artikler, spillere eller sider …', 'storm-arena'); ?>" value="<?php echo esc_attr(get_search_query()); ?>" name="s">
    </label>
    <button type="submit" class="button primary"><?php esc_html_e('Søk', 'storm-arena'); ?></button>
</form>
