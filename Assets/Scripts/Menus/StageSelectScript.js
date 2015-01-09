#pragma strict

function Start () {

}

function Update () {

}

function OnGUI () {
    // Make a background box
    GUI.Box (Rect (10,10,100,180), "Loader Menu");

    // Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
    if (GUI.Button (Rect (20,40,80,20), "Collider")) {
        Application.LoadLevel ("Collider");
    }

    // Make the second button.
    if (GUI.Button (Rect (20,70,80,20), "HorseShoe")) {
        Application.LoadLevel ("Horseshoe");
    }
    // Make the second button.
    if (GUI.Button (Rect (20,100,80,20), "Oval")) {
        Application.LoadLevel ("Oval");
    }
        // Make the second button.
    if (GUI.Button (Rect (20,130,80,20), "Splitsecond")) {
        Application.LoadLevel ("Splitsecond");
    }

}