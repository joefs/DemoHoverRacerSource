#pragma strict

function Start () {

}

function Update () {

}


function OnGUI () {
    // Make a background box
    GUI.Box (Rect (Screen.width-170,10,160,150), "Main Menu");

    // Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
    if (GUI.Button (Rect (Screen.width-150,40,120,20), "Level Select")) {
        Application.LoadLevel ("LevelSelect");
    }

    // Make the second button.
    if (GUI.Button (Rect (Screen.width-150,70,120,20), "ProceduralMode")) {
        Application.LoadLevel ("ProcHeadsUp");
    }

    // Make the third button.
    if (GUI.Button (Rect (Screen.width-150,100,120,20), "Instructions")) {
        Application.LoadLevel ("InstructionScreen");
    }

    if (GUI.Button (Rect (Screen.width-150,130,120,20), "Credits")) {
        Application.LoadLevel ("Credits");
    }


    
}