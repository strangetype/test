<?phpdefine('HOST', 'http://test/BE');define('HOSTNAME', 'test/BE');define('DOCUMENT_ROOT', $_SERVER['DOCUMENT_ROOT']);define('ACTIONS_FOLDER', 'actions/');define('VIEWS_FOLDER', 'views/');define('HEADERS_FOLDER','templates/headers/');define('TEMPLATES_FOLER','templates/');define('LIB_FOLDER', 'library/');define('IMG_FOLDER', '/images/');define('PLUGINS_FOLDER', 'plugins/');define('TEMP_IMAGES', DOCUMENT_ROOT.'/images/temp');define('UPLOAD_IMAGES_REL_PATH', '../images/');define('UPLOAD_ARTIKLES_REL_PATH', '../artikles/');define('IMAGES_PATH', DOCUMENT_ROOT.'/images/');define('PHOTOS_PATH', IMAGES_PATH.'photos/');define('PHOTOS_MINI_PATH', IMAGES_PATH.'photos_mini/');session_start();$HEADERS = getallheaders();$ACTION = false;$INCOMING = json_decode($HTTP_RAW_POST_DATA,true);if (isset($HEADERS['action'])) {    $ACTION = $HEADERS['action'];}if (isset($INCOMING['action'])) {    $ACTION = $INCOMING['action'];}function __autoload($class_name) {    require_once(LIB_FOLDER.$class_name.'.php');}if ($ACTION) {    $DATA = (object) $INCOMING['data'];    $RESPONSE = array(        'error'=>0,        'errorMessage'=>''    );    include(ACTIONS_FOLDER.$ACTION.'.php');    header('Content-Type: application/json');    echo json_encode($RESPONSE);}exit;?>