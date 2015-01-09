#pragma strict

var instructionString: String = "Mode Explanation \n General, Multiple opponents on a premade course \n Procedural,1v1 race on a generated course";

function Start () {

}

function Update () {

}


function OnGUI () {
    GUI.Box (Rect (Screen.width/2-150,150,300,70), instructionString);


}