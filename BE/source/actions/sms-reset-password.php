<?phpif ($ACTION == 'sms-reset-password')  {    $_OK = false;    $info = array();    $Auth = new Auth();    $Users = new Users();    if (isset($DATA->phone)) {        $isUserExist = $Users->checkRepeatedUsersByPhone($DATA->phone);        if ($isUserExist) {            $password = Chiper::generateSmallPassword();            $encodedPassword = Chiper::passwordEncode($password);            if ($Users->setPassword($DATA->phone, $encodedPassword)) {                $info['password'] = $password;                $info['phone'] = $DATA->phone;                $RESPONSE['testPassword'] = $info['password'];                $RESPONSE['phone'] = $info['phone'];                $_OK = true;            } else {                $RESPONSE['error'] = 3;                $RESPONSE['errorMessage'] = 'ошибка изменения пароля';            }        } else {            $RESPONSE['error'] = 2;            $RESPONSE['errorMessage'] = 'неверный телефон';        }    }    if (!isset($DATA->phone)) {        if ($Auth->authCheck()) {            $info = $Auth->resetPassword();            if (isset($info['password']) && isset($info['phone'])) {                $Auth->signOut();                $RESPONSE['testPassword'] = $info['password'];                $RESPONSE['phone'] = $info['phone'];                $_OK = true;            }        } else {            $RESPONSE['error'] = 2;            $RESPONSE['errorMessage'] = 'авторизируйтесь или зарегестрируйтесь';        }    }    if ($_OK) {        $src = '<?xml version="1.0" encoding="UTF-8"?>        <SMS>            <operations>                <operation>SEND</operation>            </operations>            <authentification>                <username>macsimusfactorre@gmail.com</username>                <password>vg3#c6C@62G@^4</password>            </authentification>            <message>                <sender>FstandART</sender>                <text>Ваш пароль для входа на сайт '.$password.' [UTF-8]</text>            </message>            <numbers>                <number messageID="msg11">375298763696</number>            </numbers>        </SMS>';        /*        $Curl = curl_init();        $CurlOptions = array(            CURLOPT_URL=>'http://atompark.com/members/sms/xml.php',            CURLOPT_FOLLOWLOCATION=>false,            CURLOPT_POST=>true,            CURLOPT_HEADER=>false,            CURLOPT_RETURNTRANSFER=>true,            CURLOPT_CONNECTTIMEOUT=>15,            CURLOPT_TIMEOUT=>100,            CURLOPT_POSTFIELDS=>array('XML'=>$src),        );        curl_setopt_array($Curl, $CurlOptions);        if(false === ($Result = curl_exec($Curl))) {            throw new Exception('Http request failed');        }        curl_close($Curl);        $p = xml_parser_create();        xml_parse_into_struct($p, $Result, $RESPONSE['answer'], $index);        xml_parser_free($p);        */    }} else {    $RESPONSE['error'] = 1;    $RESPONSE['errorMessage'] = 'неправильный запрос';}?>