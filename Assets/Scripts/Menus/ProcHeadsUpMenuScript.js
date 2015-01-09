#pragma strict

function Start () {

}

function Update () {

}


function OnGUI () {
    // Make a background box
    GUI.Box (Rect (Screen.width-170,Screen.height-200,160,150), "");

    // Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
    if (GUI.Button (Rect (Screen.width-150,Screen.height-160,120,20), "Back to Title")) {
        Application.LoadLevel ("TopMenu");
    }

    // Make the second button.
    if (GUI.Button (Rect (Screen.width-150,Screen.height-130,120,20), "Continue")) {
        Application.LoadLevel ("Proc");
    }


    
}