#pragma strict
var target: GameObject;
var targetList: GameObject[];
var targetIndex: int;
var max_velocity: float;
var carBody: Rigidbody;
var desired_velocity: Vector3;
var steering: Vector3;
var max_steer_force: float;
var max_turn_rate: float;
var accels: Vector3[];
var avoid_max_distance: float;
var max_avoid_force: float;
var motorActive;

function Start () {
	accels = [Vector3(0, 0, 0),  Vector3(0, 0, 0)];
	//motorActive = true;
}

function Update () {
	floorBoostLevel();
	Debug.Log(boostLevel);
}

function FixedUpdate(){
	if(motorActive){
		accels[1]=Avoid();
		if(accels[1].magnitude < 1) accels[0]=Seek();
		Accumulate();
		HasArrived();
	}
}

function Truncate(aVec: Vector3, aMax : float) {
	if (aVec.magnitude< aMax){
		return aVec;
	}else{
		return aVec.normalized * aMax;
	}
}

function floorBoostLevel(){
	boostLevel -= boostDecreaseRate * Time.deltaTime;
	boostLevel = (boostLevel>=0)? boostLevel: 0;
}


var boostLevel : float;
var boostDecreaseRate: float;
var maxBoostLevel: float;

function setBoostToMax(){
	boostLevel = maxBoostLevel;
}

function Seek(){
	// desired_velocity = 
	// 	(target.transform.position- gameObject.transform.position).normalized
	// 	 * max_velocity;
	desired_velocity = 
	(Vector3(target.transform.position.x, 4, target.transform.position.z)- gameObject.transform.position).normalized
	 * (max_velocity + boostLevel);
	steering = desired_velocity - carBody.velocity;
	steering = Truncate(steering, max_steer_force);
	steering = steering /carBody.mass;
	//steering.y=0;
	Debug.DrawLine (gameObject.transform.position, gameObject.transform.position+(steering*50), Color.red, .5, false);
	return steering;
}

function Avoid(){
	var direction: Vector3 = Vector3(carBody.velocity.x,0,carBody.velocity.z);
	 Vector3.Normalize(direction);
	// direction*= avoid_max_distance;
	var hit : RaycastHit;
	var ray :Ray;
	ray = Ray(gameObject.transform.position ,gameObject.transform.forward);
	Debug.DrawLine(gameObject.transform.position , gameObject.transform.position +(direction* 20),Color.blue, .5, false);
	// forward raycast
	if ( Physics.Raycast(ray, hit, 20)){

		if (hit.transform != this.transform && hit.collider.gameObject.GetComponent("Rigidbody")!= null){
			// test left and right
			var angleBetween = 0.0;
			//var targetDir = hit.collider.attachedRigidbody.position - gameObject.transform.position;
			var targetDir = hit.collider.gameObject.transform.position - gameObject.transform.position;
			angleBetween = Vector3.Angle (transform.forward, targetDir);
			steering = transform.right *  (max_avoid_force/carBody.mass);
			if(angleBetween >0){
				//Debug.Log("RIGHT!");

			}else{
				//Debug.Log("LEFT!");
				steering *=-1;
			}
			//Debug.Log("Avoid Accel is " + steering);
			return steering;
        }
	}
	return Vector3(0,0,0);
}

function Accumulate(){
	for (var i = 0; i < accels.length; i++) {
		carBody.velocity = Truncate(carBody.velocity + accels[i] , max_velocity+ boostLevel);
		accels[i]= Vector3(0,0,0);
	}
	//carBody.velocity = Truncate(carBody.velocity + steering , max_velocity);
	Debug.DrawLine (gameObject.transform.position, gameObject.transform.position+(carBody.velocity*.8), Color.green, .5, false);
	carBody.velocity.y = 0;
	carBody.rotation = Quaternion.LookRotation(carBody.velocity);
	gameObject.transform.rotation = carBody.rotation;
	gameObject.transform.position = carBody.position;
}


function HasArrived(){
	if (Vector3.Distance(gameObject.transform.position, target.transform.position)<30){
		IncrTarget();
	}
}

function IncrTarget(){
	targetIndex = (targetIndex+1)%targetList.length;
	target = targetList[targetIndex];
}

