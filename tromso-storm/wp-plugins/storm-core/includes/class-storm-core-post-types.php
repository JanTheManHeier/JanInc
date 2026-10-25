<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Post_Types
{
    /**
     * @return array<string, array<string, mixed>>
     */
    public static function definitions(): array
    {
        return array(
            'storm_season' => array(
                'singular' => 'Sesong',
                'plural'   => 'Sesonger',
                'icon'     => 'dashicons-calendar-alt',
                'public'   => true,
                'rewrite'  => 'sesonger',
                'supports' => array('title', 'editor', 'revisions', 'custom-fields'),
            ),
            'storm_game' => array(
                'singular' => 'Kamp',
                'plural'   => 'Kamper',
                'icon'     => 'dashicons-awards',
                'public'   => true,
                'rewrite'  => 'kamper',
                'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
            ),
            'storm_player' => array(
                'singular' => 'Spiller',
                'plural'   => 'Spillere',
                'icon'     => 'dashicons-groups',
                'public'   => true,
                'rewrite'  => 'spillere',
                'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
            ),
            'storm_staff' => array(
                'singular' => 'Trener eller støtteapparat',
                'plural'   => 'Trenere og støtteapparat',
                'icon'     => 'dashicons-businessperson',
                'public'   => true,
                'rewrite'  => 'trenerteam',
                'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
            ),
            'storm_roster_entry' => array(
                'singular' => 'Stalltilknytning',
                'plural'   => 'Stalltilknytninger',
                'icon'     => 'dashicons-networking',
                'public'   => false,
                'supports' => array('title', 'revisions', 'custom-fields'),
            ),
            'storm_sponsor' => array(
                'singular' => 'Sponsor',
                'plural'   => 'Sponsorer',
                'icon'     => 'dashicons-heart',
                'public'   => true,
                'rewrite'  => 'partnere',
                'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
            ),
            'storm_sponsor_deal' => array(
                'singular' => 'Sponsoravtale',
                'plural'   => 'Sponsoravtaler',
                'icon'     => 'dashicons-portfolio',
                'public'   => false,
                'supports' => array('title', 'revisions', 'custom-fields'),
            ),
            'storm_training' => array(
                'singular' => 'Treningstid',
                'plural'   => 'Treningstider',
                'icon'     => 'dashicons-clock',
                'public'   => false,
                'supports' => array('title', 'editor', 'revisions', 'custom-fields'),
            ),
            'storm_social' => array(
                'singular' => 'SOME-innlegg',
                'plural'   => 'SOME-innlegg',
                'icon'     => 'dashicons-share',
                'public'   => false,
                'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
            ),
        );
    }

    public static function register(): void
    {
        foreach (self::definitions() as $post_type => $definition) {
            $public = (bool) $definition['public'];
            $rewrite = $public && isset($definition['rewrite'])
                ? array('slug' => $definition['rewrite'], 'with_front' => false)
                : false;

            register_post_type(
                $post_type,
                array(
                    'labels'              => self::labels($definition['singular'], $definition['plural']),
                    'description'         => sprintf('Administrasjon av %s for Tromsø Storm.', strtolower($definition['plural'])),
                    'public'              => $public,
                    'publicly_queryable'  => $public,
                    'show_ui'             => true,
                    'show_in_menu'        => 'storm-club',
                    'show_in_nav_menus'   => $public,
                    'show_in_admin_bar'   => $public,
                    'show_in_rest'        => true,
                    'rest_base'           => str_replace('_', '-', $post_type),
                    'menu_icon'           => $definition['icon'],
                    'supports'            => $definition['supports'],
                    'has_archive'         => $public,
                    'rewrite'             => $rewrite,
                    'exclude_from_search' => !$public,
                    'hierarchical'        => false,
                    'capability_type'     => array('storm_record', 'storm_records'),
                    'map_meta_cap'        => true,
                    'delete_with_user'    => false,
                )
            );
        }
    }

    /**
     * @return array<string, string>
     */
    private static function labels(string $singular, string $plural): array
    {
        return array(
            'name'                  => $plural,
            'singular_name'         => $singular,
            'menu_name'             => $plural,
            'name_admin_bar'        => $singular,
            'add_new'               => 'Legg til',
            'add_new_item'          => sprintf('Legg til %s', strtolower($singular)),
            'new_item'              => sprintf('Ny %s', strtolower($singular)),
            'edit_item'             => sprintf('Rediger %s', strtolower($singular)),
            'view_item'             => sprintf('Vis %s', strtolower($singular)),
            'all_items'             => sprintf('Alle %s', strtolower($plural)),
            'search_items'          => sprintf('Søk i %s', strtolower($plural)),
            'not_found'             => 'Ingen treff.',
            'not_found_in_trash'    => 'Ingen treff i papirkurven.',
            'featured_image'        => 'Bilde',
            'set_featured_image'    => 'Velg bilde',
            'remove_featured_image' => 'Fjern bilde',
            'use_featured_image'    => 'Bruk som bilde',
            'archives'              => sprintf('%sarkiv', $singular),
        );
    }
}
