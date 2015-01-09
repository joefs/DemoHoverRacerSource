#pragma strict
var player: GameObject;
function Start () {

}

function Update () {

}

function OnTriggerExit (other : Collider) {
		Debug.Log("HES OUTTTTTTTTTTTTT");
	if(other.gameObject.GetComponent(Rigidbody)!=null){
		other.gameObject.GetComponent(Rigidbody).useGravity=true;
		other.gameObject.GetComponent(HumanCar).motorActive=false;
	}
}