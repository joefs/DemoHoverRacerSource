#pragma strict
var target: GameObject;
var targetList: GameObject[];
var targetIndex: int;
var max_velocity: float;
var carBody: Rigidbody;
var desired_velocity: Vector3;
var steering: Vector3;
var max_steer_force: float;
var absolute_max_steer_force: float;
var max_turn_rate: float;
var motorActive;



function Start () {
	//motorActive = true;
}

function Update () {
	floorBoostLevel();
	//Debug.Log(boostLevel);
}


function FixedUpdate(){//TODO
	if(motorActive){
		if(Input.GetKey("up")){
			max_steer_force= Mathf.Min(max_steer_force+.01,absolute_max_steer_force);
		}
		else if(carBody.velocity.magnitude>.1){
				carBody.velocity*=.95;
		}

		if(Input.GetKey("left")){
			target.transform.localPosition.z=5;
			target.transform.localPosition.x=-5;
			if (Input.GetKey("down"))target.transform.localPosition.z=0;
		}else if(Input.GetKey("right")){;
			target.transform.localPosition.z=5;
			target.transform.localPosition.x=5;
			if (Input.GetKey("down"))target.transform.localPosition.z=0;
		}else{
			target.transform.localPosition.z=5;
			target.transform.localPosition.x=0;
		}

		// if (Input.GetKey("down"))target.transform.localPosition.z*=-1;

		if(Input.GetKey("up")||target.transform.localPosition.magnitude>.01&&carBody.velocity.magnitude>.01){

		Seek();
		if (Input.GetKey("down")) stabilize();
		Accumulate();
		}
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
var boostSound : AudioSource;
function setBoostToMax(){
	Debug.Log("Prior: " + boostLevel);
	boostLevel = maxBoostLevel;
	boostSound.Play();
	Debug.Log("Post: " + boostLevel);
}

function Seek(){
	// desired_velocity = 
	// 	(target.transform.position- gameObject.transform.position).normalized
	// 	 * max_velocity;
	desired_velocity = 
	(Vector3(target.transform.position.x, 5, target.transform.position.z)- gameObject.transform.position).normalized
	 * (max_velocity + boostLevel);
	steering = desired_velocity - carBody.velocity;
	steering = Truncate(steering, max_steer_force);
	steering = steering /carBody.mass;
	//steering.y=0;
	Debug.DrawLine (gameObject.transform.position, gameObject.transform.position+(steering*50), Color.red, .5, false);
	carBody.velocity = Truncate(carBody.velocity + steering , max_velocity+ maxBoostLevel);
	Debug.DrawLine (gameObject.transform.position, gameObject.transform.position+(carBody.velocity*.8), Color.green, .5, false);
	carBody.velocity.y = 0;
	//Debug.Log(carBody.velocity.magnitude);
}

function Accumulate(){
	carBody.rotation = Quaternion.LookRotation(carBody.velocity);
	gameObject.transform.rotation = carBody.rotation;
	gameObject.transform.position = carBody.position;
}



function stabilize(){
	carBody.angularVelocity = Vector3(0,0,0);
	boostSound.Play();
}



