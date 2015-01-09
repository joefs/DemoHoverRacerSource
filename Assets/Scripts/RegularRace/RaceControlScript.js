//#pragma strict
var pointCounts: Hashtable;
var shipsToTrack: GameObject[];
var gatesToTrack: GameObject[]; // ONLY FOR PLAYER
var finishOrder: Hashtable; //order of finishing STACK
var raceActive;
var startDelay: float;
var startTime;
var endTime;
var currentTime;
var totalLaps=3;
var numDone;
var playersShip : GameObject;
var currentPlace;
var pointer: GameObject;


function Start () {
	pointCounts  = new Hashtable();
	raceActive=false;
	deactivateAllMotors();
	initHash();
	finishOrder = new Hashtable();
	numDone=0;
	currentTime = 0;
	startTime=0;
	currentPlace = 1;
// starting
	// deactivate all motors
	// take time at creation
	// countdown
	// send message allowing cars to move
}
// lap checking
	// add all ships with [0,0,0] to table
	// when a person gets to a gate increment the appropriate one
	// make sure the previous ones are of appropriate value
	// when you get to [lapT,lapT,lapT] then consider finished 
	// ihashtables values to determine place
// positional Reset
function Update () {
	if (!raceActive){
 		startDelay -= Time.deltaTime;
 		if (startDelay < 0){
 			raceActive = true;
 			activateAllMotors();
 			//TODO StartTime
			startTime=Time.time;
 		}
	}
	if(raceActive)currentTime= Time.time-startTime;

	if (Input.GetKeyDown ("space")) {
		YoshiModeLevelSkip();
	}
	calcMinAndSec();

}
function initHash(){
	var inArr;
	for (var i = 0; i < shipsToTrack.length; i++){
		inArr = new Array(0,0,0);
		pointCounts.Add(shipsToTrack[i],inArr);
	}
}

function IncrementTableValue(pCar : GameObject, pGat : GameObject){
	var switcher = 0;
	if(pointCounts.ContainsKey(pCar)){
		Debug.Log("TWAS CONTAINED");
		if(	pGat==gatesToTrack[0]&&pointCounts[pCar][0]<=pointCounts[pCar][2]){
			pointCounts[pCar]=[pointCounts[pCar][0]+1,pointCounts[pCar][1], pointCounts[pCar][2]];
			Debug.Log("0");
			Debug.Log("Value: " + pointCounts[pCar][0]+" "+ pointCounts[pCar][1]+" " + pointCounts[pCar][2]);
			if(pointCounts[pCar][0]==totalLaps+1/*&&pointCounts[pCar][1]==totalLaps*/){
				Debug.Log("ITS DONE");
				numDone++;
				if( pCar == playersShip){
					Debug.Log("YOUR PLACE IS: " + numDone);
					// pass values
					// TODO Implement persistance here.
					var isNewRecord: boolean = false;
					if(PlayerPrefs.GetFloat(Application.currentScene)==0||(Time.time-startTime)<PlayerPrefs.GetFloat(Application.currentScene)){
						PlayerPrefs.SetFloat(Application.currentScene,(Time.time-startTime));
						isNewRecord = true;
					}
					ResultPageScriptReal.Init("" + numDone, String.Format("{0:00}:{1:00}", mins, secs));
					ResultPageScriptReal.Init2(isNewRecord);
					Application.LoadLevel("ResultsPage");
				}
					 
			}
			switcher=0;
		}
		if(	pGat==gatesToTrack[1]&&pointCounts[pCar][1]<=pointCounts[pCar][0]){
			pointCounts[pCar]=[pointCounts[pCar][0],pointCounts[pCar][1]+1, pointCounts[pCar][2]];
			Debug.Log("1");
			Debug.Log("Value: " + pointCounts[pCar][0]+" "+ pointCounts[pCar][1]+" " + pointCounts[pCar][2]);
			switcher=1;
		}
		if(	pGat==gatesToTrack[2]&&pointCounts[pCar][2]<=pointCounts[pCar][1]){
			pointCounts[pCar]=[pointCounts[pCar][0],pointCounts[pCar][1], pointCounts[pCar][2]+1];
			Debug.Log("2");
			Debug.Log("Value: " + pointCounts[pCar][0]+" "+ pointCounts[pCar][1]+" " + pointCounts[pCar][2]);
			switcher=2;
		}
		// CHANGE HUMAN PLACE
		var lapToBeat = pointCounts[playersShip][switcher];
		var numberBetter = 0;
		for (var i = 0; i < shipsToTrack.length; i++){
			if (shipsToTrack[i]==playersShip){

			}else{
				if(pointCounts[shipsToTrack[i]][switcher]>lapToBeat) numberBetter++;
			}
		}
		currentPlace = numberBetter+1;
	}
}

function DetermineFinishingOrder(){
	// pass this to the ending script
}

function deactivateAllMotors(){
	for (var i = 0; i < shipsToTrack.length; i++) {
		if (shipsToTrack[i].GetComponent(CarMotor2)!=null){
			shipsToTrack[i].GetComponent(CarMotor2).motorActive=false;
		}else if( shipsToTrack[i].GetComponent(HumanCar)!=null){
			shipsToTrack[i].GetComponent(HumanCar).motorActive=false;
		}
	}
}

function activateAllMotors(){
	for (var i = 0; i < shipsToTrack.length; i++) {
		if (shipsToTrack[i].GetComponent(CarMotor2)!=null){
			shipsToTrack[i].GetComponent(CarMotor2).motorActive=true;
		}else if( shipsToTrack[i].GetComponent(HumanCar)!=null){
			shipsToTrack[i].GetComponent(HumanCar).motorActive=true;
		}
	}

}


function OnGUI(){
    GUI.Box (Rect (5,5,180,150), "");
	GUI.Label(Rect(10, 10, 100, 20), "Lap: " +pointCounts[playersShip][0]);
	if (raceActive) GUI.Label(Rect(10, 40, 200, 20), "Elapsed Time: " +String.Format("{0:00}:{1:00}", mins, secs));
	else{
		GUI.Box(Rect(Screen.width/2-15, Screen.height/2-15, 30, 30), "" + String.Format("{0:0}", startDelay));
	} 
	GUI.Label(Rect(10, 70, 100, 20), "Place: " +currentPlace);
	GUI.Label(Rect(10, 100, 100, 20), "Speed: " + String.Format("{0:000}mps",playersShip.GetComponent(Rigidbody).velocity.magnitude));
}

var secs: float;
var mins: float;

function calcMinAndSec(){
	secs= currentTime % 60;
	mins = currentTime /60;
}

function YoshiModeLevelSkip(){
	ResultPageScriptReal.Init("1", "0 SECONDS");
	Application.LoadLevel("ResultsPage");
}