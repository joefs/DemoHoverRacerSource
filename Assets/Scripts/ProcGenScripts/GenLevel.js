#pragma strict

import System.Collections.Generic;
import System.IO;
var dim = 30;
var board: GameObject[,] = new GameObject[dim,dim];
var reverseBoard = new Hashtable();
var BlueTile: GameObject;
var PinkTile: GameObject;
var finalArrOfTiles = new Array();
var gates: GameObject[] = new GameObject[3];
var gatesToNode: GameObject[] = new GameObject[3];
var carPlayer: GameObject;
var carAI: GameObject;
var sqWidth: int;
var fileName = "ProcFile.txt";

function Start () {
	GenerateBoard();
}

function Update () {

}


function GenerateBoard(){
	// createobjects
	// add them to array
	var toAdd: GameObject;
	var xPos: int;
	var zPos: int;
	var xZero: int;
	var zZero: int;
	sqWidth = 50;
	xZero = (sqWidth/2) - (sqWidth*(dim/2));
	zZero = xZero;
	for (var i = 0; i < dim; i++) {
		for (var j = 0; j < dim; j++) {
			xPos = xZero + i* sqWidth;
			zPos = zZero + j* sqWidth;
			if((i+j)%2==0){
				toAdd = Instantiate(BlueTile, Vector3 (xPos, 0, zPos), Quaternion.identity);
			}else{
				toAdd = Instantiate(PinkTile, Vector3 (xPos, 0, zPos), Quaternion.identity);
			}
			toAdd.transform.parent = this.gameObject.transform;
			board[i,j] = toAdd;
		}
	}
	//GatherNeighbors(3,3);

	// Change Terrain
	AllLSystemOps();

	// Place Gates In Existant Nodes
		// establish order
	placeGates();

	// explicitly do A* on nodes of existant ones to the other
	// change cars number of gameobject
	// change objects
	//TODO
	carAI.GetComponent(CarMotor2).targetList =aStarAndSendToAI();


	//TODO: Try out my BFS IN C#

}

function placeGates(){
	var gatesPlaced=0;
	var placed: int[]=new int[3];
	placed[0] =-1;
	placed[1] =-1;
	placed[2] =-1;
	
	while(gatesPlaced<3){
		var res:int = Random.Range(0,finalArrOfTiles.length-1);
		if(placed[0]!=res&&placed[1]!=res&&placed[2]!=res){
			placed[gatesPlaced]=res;
			gatesPlaced++;
		}
	}

	for(var i: int =0; i<placed.length; i++){
		// move gates[i] to location of finalArrOfTiles[placed[i]]
		var flashLight : GameObject = finalArrOfTiles[placed[i]];
		gates[i].transform.position = Vector3(flashLight.transform.position.x,1,flashLight.transform.position.z);
		gatesToNode[i]=flashLight;
	}

	carPlayer.transform.parent.position.x= gatesToNode[0].transform.position.x;
	carPlayer.transform.parent.position.z= gatesToNode[0].transform.position.z;
	//direct player towards first gate
	carPlayer.transform.LookAt(gatesToNode[0].transform.position);

}
function placeCars(){
	var flashLight : GameObject = finalArrOfTiles[Random.Range(0,finalArrOfTiles.length-1)];
	carPlayer.transform.position = Vector3(flashLight.transform.position.x,0,flashLight.transform.position.z);
}

function GatherNeighbors(pX:int, pY:int){
	var outArr = new Array();
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if(i==0&&j==0){

			}else{
				if(pX+i>=0&&pX+i<dim&&pY+j>=0&&pY+j<dim&& board[pX+i,pY+j]!=null){
					outArr.push(board[pX+i,pY+j]);
				}
			}
		}
	}
	return outArr;
}

function GatherNeighborsOfObj(pO: GameObject){
	var toConsider: int[] = reverseBoard[pO];
	return GatherNeighbors(toConsider[0],toConsider[1]);
}


function AllLSystemOps(){
	//var inString: String = "A[|A]>>[|A]>>[|A]>>[|A]>>[|A]";
	var inString: String = "A[|A]>>[|A]>>[|A]>>[|A]>>[|A]";
	

	var fullPath = Application.dataPath + "/" + fileName;

	if (Application.platform == RuntimePlatform.WindowsEditor&&
		System.IO.File.Exists(fullPath))
	{
	    var sr = new StreamReader(fullPath);
	    var fileContents = sr.ReadToEnd();
	    sr.Close();


	    //check if file contents are valid
	    // for loop that checks for matching brackets
	    // number ++ and -- end with 0
	    var numBrackets = 0;
	    var charIndex = 0;
	    var curChar;
	    var wentNegative = false;
	    while(charIndex<fileContents.length){
	    	curChar = fileContents[charIndex];
	    	if(curChar=='[') numBrackets++;
	    	if(curChar==']') numBrackets--;
	    	if(numBrackets<0) wentNegative=true;
	    	charIndex++;
	    	Debug.Log(curChar);
	    }



	    if(numBrackets==0&&wentNegative==false) inString = fileContents;
	}



	//var inString: String = "A";
	//var inString: String = "[||||||A][>>>>||||||||A]";
	var rules: Hashtable;
	rules= new Hashtable();
	// [ store state
	// ] pop state
	// | go forward
	// > rotate 45 degrees clockwise
	// < rotate 45 counterclockwise
	// x place
	rules.Add("A","[x[|B]>>[|B]>>[|B]>>[|B]]");
	rules.Add("B","[x[|D]>>[|C]]");
	rules.Add("C","x");
	rules.Add("D","[x[|E][<|F][>|F]]");
	rules.Add("E","x");
	rules.Add("F","[x[|G]");
	rules.Add("G","[x[<<|H][>>|H]");
	rules.Add("H","x");

	// make a boolean array of falses
	var existArr: boolean[,] = new boolean[dim,dim];
	for (var i = 0; i < dim; i++) {
		for (var j = 0; j < dim; j++) {
			existArr[i,j] = false;
		}
	}
	// generate string
	var incrementalGeneratedString = inString;
	var generatedString = "";
	var numberOfProcessings = 9;
	for (i = 0; i < numberOfProcessings; i++) {// num of processing
		generatedString = "";
		for (j = 0; j < incrementalGeneratedString.length; j++){// length of incremental string
			// check if its in the hash, if not then just add it regardless
			// if it is in the has add the value that that points to
			var curIncr: String = "" + incrementalGeneratedString[j];
			if(rules.Contains(curIncr)){
				//Debug.Log(incrementalGeneratedString[j]);
				generatedString+=rules[curIncr];
			}else{
				generatedString+=curIncr;
			}
		}
		incrementalGeneratedString = generatedString;
	}
	Debug.Log(generatedString);
	//Debug.Log(rules["A"]);


	// use generatedString
	// turtle through and change corresponding ones

	var rot = 0;
	var curPos: Vector2;
	var cent: Vector2;
	var positionStack = new Array();
	var rotationStack =new Array();
	cent = Vector2(dim/2,dim/2);
	curPos = cent;

	var expression: char;
	for(i=0; i< generatedString.length; i++){
		expression = generatedString[i];
		switch(expression) {
				// [ store state
				// ] pop state
				// | go forward
				// > rotate 45 degrees clockwise
				// < rotate 45 counterclockwise
				// x place
		    case '[':
		        positionStack.push(curPos);
		        rotationStack.push(rot);
		        break;
		    case ']':
		        curPos = positionStack.pop();
		        rot = rotationStack.pop();
		        break;
		    case '|':
		    	existArr[curPos.x,curPos.y] = true;
		    	if(rot ==0){
		    		curPos= Vector2(curPos.x+1,curPos.y);
		    	}else if(rot ==1){
					curPos= Vector2(curPos.x+1,curPos.y-1);
		    	}else if(rot ==2){
					curPos= Vector2(curPos.x,curPos.y-1);
		    	}else if(rot ==3){
		    		curPos= Vector2(curPos.x-1,curPos.y-1);
		    	}else if(rot ==4){
		    		curPos= Vector2(curPos.x-1,curPos.y);
		    	}else if(rot ==5){
		    		curPos= Vector2(curPos.x-1,curPos.y+1);
		    	}else if(rot ==6){
		    		curPos= Vector2(curPos.x,curPos.y+1);
		    	}else if(rot ==7){
		    		curPos= Vector2(curPos.x+1,curPos.y+1);
		    	}
		        break;
		    case '>':
		    	rot=(rot+1)%8;
		        break;
		    case '<':
		        rot=(rot-1)%8;
		        break;
		    case 'x':
		    	if(curPos.x>=0&&curPos.x<dim&&curPos.y>=0&&curPos.y<dim){
			    	existArr[curPos.x,curPos.y] = true;
		    	}
		        break;
		    default:
		        break;
		}
	}



	for (i = 0; i < dim; i++) {
		for (j = 0; j < dim; j++) {
			if(!existArr[i,j]){
				Destroy(board[i,j]);
				board[i,j]=null;
			}else{
				finalArrOfTiles.Add(board[i,j]);

				var can:int[] = [i,j];
				reverseBoard.Add(board[i,j],can);
			}
		}
	}

}



function aStarAndSendToAI(){
	// do A* 3 times (once for each gate to gate including last to first)
	var outArr: GameObject[] = [];
	
	outArr= stubAStar(gatesToNode[0],gatesToNode[1]);
	Debug.Log("FIRST");
	outArr += stubAStar(gatesToNode[1],gatesToNode[2]);
	Debug.Log("SECOND");
	outArr += stubAStar(gatesToNode[2],gatesToNode[0]);
	Debug.Log("THIRD");

	return outArr;
	// outArr= DFS(gatesToNode[0],gatesToNode[1]);
	// Debug.Log("FIRST");
	// outArr += DFS(gatesToNode[1],gatesToNode[2]);
	// Debug.Log("SECOND");
	// outArr += DFS(gatesToNode[2],gatesToNode[0]);
	// Debug.Log("THIRD");

	// return outArr;

}



function stubAStar(pStart: GameObject,pGoal: GameObject){
	var outArr: GameObject[] = new GameObject[1];
	if(pStart==pGoal){
		outArr[0]=pStart;
		return outArr;
	}
	outArr= new GameObject[3];
	outArr[0]=pStart;

	outArr[1]=Random.Range(0,1)==true ? 
		Instantiate(PinkTile, Vector3 (pStart.transform.position.x, -2, pGoal.transform.position.z), Quaternion.identity):
		Instantiate(PinkTile, Vector3 (pGoal.transform.position.x, -2, pStart.transform.position.z), Quaternion.identity);

	outArr[2]=pGoal;



	//
	return outArr;
}

function AStar(pStart: GameObject,pGoal: GameObject){
	var outArr: GameObject[];
	outArr[0]=pStart;
	outArr[1]=pGoal;
	//



	return outArr;
}



// discovered hash
// parent

// 1  procedure DFS(G,v):
// 2      label v as discovered
// 3      for all edges from v to w in GatherNeighbors(pX, pY) do
// 4          if vertex w is not labeled as discovered then
				  //makes its parent the current
// 5              recursively call DFS(G,w)
						// if you get -1 then...
						// else return something good



// reconstruct path

var discovered: Hashtable = new Hashtable();
var parent: Hashtable = new Hashtable();


function DFS(pCur: GameObject, pGoal: GameObject): GameObject[]{
	discovered.Add(pCur, true);
	var curNeighbors = GatherNeighborsOfObj(pCur);
	for(var i:int = 0; i<curNeighbors.length; i++){
		var curChild = curNeighbors[i];
		if(!parent.ContainsKey(curChild)){
			parent.Add(curChild, pCur);
		}else{
			parent[curChild] = pCur;
		}
		if(!discovered[curChild]){
			DFS(curChild, pGoal);
		}
		if(curChild==pGoal){
			return reconPath(pGoal);
		}
	}
	return stubAStar(pCur, pGoal);
}


function reconPath(pEnd: GameObject){
	var curPiece: GameObject = pEnd;
	var outArr: GameObject[] = [];
	var objAr: GameObject[] = new GameObject[1];
	while(parent.ContainsKey(curPiece)){
		objAr[0] = parent[curPiece];
		outArr =  objAr+ outArr;
		curPiece = parent[curPiece];
	}
	return outArr;
}


function transformToString():String{
	var outString : String = "";
	outString += "" + dim + ',' +dim + ',';
}