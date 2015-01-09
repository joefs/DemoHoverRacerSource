#pragma strict


static var  placeString: String ="0";
static var  timeString: String="1";
static var isNewRecord: boolean = false;


function Start () {

}

static function Init(pPlace: String, pTime: String){
	placeString = pPlace;
	timeString = pTime;
}

static function Init2(pIsNewRecord:boolean){
	isNewRecord = pIsNewRecord;
}
	
function Update () {

}

function OnGUI(){
	    // Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
    if (GUI.Button (Rect (Screen.width/2-40,Screen.height/2-10,100,20), "MainMenu")) {
        Application.LoadLevel (0);
    }
	GUI.Label(Rect(10, 10, 100, 20), "Your Place: " +placeString);
	GUI.Label(Rect(10, 40, 200, 20), "Your Time: " +timeString);
	if(isNewRecord)GUI.Label(Rect(10, 70, 300, 20), "NEW RECORD!");


}



