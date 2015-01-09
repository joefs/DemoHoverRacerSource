#pragma strict
var creds: String;

var speed = 0.2;
var crawling = false;

function Start(){ // init text here, more space to work than in the Inspector (but you could do that instead)

}

function Update ()
{
    creds = "CREDITS\n";
    creds += "Unless otherwise stated, all components, integration, orchestration and testing were done by Joe Spiro.";
	creds += '\n' + "\nMusic:\n";
	creds += '\n' + "Jake Kauffman:";
	creds += '\n' + "Double Dragon Neon: Title Theme, Mission Bumper, Lab2";
	creds += '\n' + "Mighty Switch Force: Love You Love You Love, Break Up Take Down";
	creds += '\n' + "\nJigsaw:";
	creds += '\n' + "Sky High";
	creds += '\n' + "\nElectric Light Orchestra:";
	creds += '\n' + "Twilight";
	creds += '\n' + "\nTeresa Carpio:";
	creds += '\n' + "Mismatched Couples";
	creds += "\n\n Models:";
	creds += '\n' + "Reikan Studio: Hover_9K Hover Car";
}

function OnGUI(){
	GUI.Box (Rect (20,10,Screen.width-40,Screen.height-20),creds);
    if (GUI.Button (Rect (Screen.width/2-40,Screen.height/2-10,100,20), "MainMenu")) {
        Application.LoadLevel (0);
    }
}