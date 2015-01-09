#pragma strict

function Start () {

}

function Update () {
	gameObject.transform.Rotate(Vector3.up *30* Time.deltaTime);
}