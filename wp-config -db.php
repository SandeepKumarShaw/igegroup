<?php


/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'igegroup');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'Y ?]szei0|x&GoH@CK#QPFjqir2{5O4b,26;(yhRoPT?Q2Fe*^33&#o`/csj1ayh');
define('SECURE_AUTH_KEY',  '%O)#|:u?(8RqQd*ECqMLvJz6sd2]ttr^Kp<PXuT{379T3W5WFQ,O,uIi,iDh5^?V');
define('LOGGED_IN_KEY',    'hK-EyOO=AnZ26hpv-S~.)vz#VT_.D#?8LP1f}7LB6Y%0Z2Nx*+8a{9ul:Z.iV!Em');
define('NONCE_KEY',        '^^b,?~((HdCgpDXsxGVLrW NnkxBAR`gSaZBR}wbJ3FI7?2.Eq/Hav9WBBl)aw^C');
define('AUTH_SALT',        '[2F@0d0N+QXFNE5N/{4NLy*!~)K]Aq7izMr1a3=$Ifz^;n-bM2w/Jq]KIwD!v1(]');
define('SECURE_AUTH_SALT', '80t~G#(uH~C~hX#nB3osAh<n{Eo20E6xo]S2J`Sk:Zq&v?<.7-xB!y_UsB<&<Yqn');
define('LOGGED_IN_SALT',   'b,`dutDbJ+K}CZ.!j.2CR/q8_[Qi:Mrt1d1^gBXP:|C$~XF%<AW#B%HWOo1*cPt4');
define('NONCE_SALT',       '63`YW`8<fMAFU9tWfv1ou&++#7S/`Mm2*N})(QN/?ZsC5J}/[+#2VOeDJ&>^lc,R');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);
define('WPCF7_AUTOP', false );
/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

