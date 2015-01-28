#pragma strict

//
// The overlay that appears when you press Esc
//

var pauseGame : boolean = false;
var canvasMenu : Canvas;
var canvasInfoBook : Canvas;

function Start () {
	/* nothing to do */
}

function Update () {
	if (canvasInfoBook.enabled) {
		return;	/* nothing to do if we're seeing the help screen */
	}

	if (Input.GetKeyDown("escape")) {
		pauseGame = !pauseGame;

		if (pauseGame == true) {
			Time.timeScale = 0;
			GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = false;
			GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = false;
			canvasMenu.enabled = true;

		} else {
			Time.timeScale = 1;
			GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = true;
			GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = true;
			canvasMenu.enabled = false;
		}
	}
}

function Resume () {
	Time.timeScale = 1;
	GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = true;
	GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = true;
	pauseGame = !pauseGame;
	canvasMenu.enabled = false;	
}
