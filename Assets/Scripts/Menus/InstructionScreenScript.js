#pragma strict

var instructionString: String;

function Start () {
	instructionString = "How to Play \n Up,Left,Right = Accelerate, Left and Right \n Down = Stabilize Angular Velocity \n SPACE = Yoshi Mode Level Skip (Instant win)";
}

function Update () {

}


function OnGUI () {
    GUI.Box (Rect (Screen.width/2-150,10,300,100), instructionString);



    if (GUI.Button (Rect (Screen.width/2-150,Screen.height-100,300,50), "Return to Main Menu")) {
        Application.LoadLevel ("TopMenu");
    }

}