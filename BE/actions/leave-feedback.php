<?php
if ($DATA->name && $DATA->text && isset($DATA->confirmed) && $DATA->date) {
    $jsonData = file_get_contents("data.json");
    $data = json_decode($jsonData);
    $feedback = array (
                    "name"  => $DATA->name,
                    "text" => $DATA->text,
                    "confirmed"   => $DATA->confirmed,
                    "date"   => $DATA->date
                );
    array_push($data->feedbacks, $feedback);
    file_put_contents ("data.json",json_encode($data));
    $RESPONSE['data'] = $data;

} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'no params';
}
