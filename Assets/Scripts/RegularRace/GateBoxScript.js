#pragma strict

var controllerObject: GameObject;

function Start () {
	controllerObject=gameObject.transform.parent.gameObject;
}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	Debug.Log("FIRE");
	controllerObject.GetComponent(RaceControlScript).IncrementTableValue(other.gameObject, gameObject);
}