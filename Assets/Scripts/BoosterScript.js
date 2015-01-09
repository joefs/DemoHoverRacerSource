#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	var objInQues : GameObject = other.gameObject;
	if(objInQues.name=="Car"){
		//Debug.Log("TWAS A CAR");
		//objInQues.GetComponent("CarMotor2").setBoostToMax();
		objInQues.SendMessage("setBoostToMax");
	}else if(objInQues.name=="Human Car"){
		//Debug.Log("TWAS A HUMAN CAR");
		//objInQues.GetComponent("HumanCar").setBoostToMax();
		objInQues.SendMessage("setBoostToMax");
	}else{
		//Debug.Log("TWAS NEITHER"+ " It was actually: " + objInQues.name);
	}
}