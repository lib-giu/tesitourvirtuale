#pragma strict

//
// Callbacks invoked when buttons are pressed
//

function Start () {
	/* nothing to do */
}

function Update () {
	/* nothing to do */
}

function onClickExit() {
	Application.Quit();
}

function onClickPlay() {
	Application.LoadLevel("test web");
}

function onClickHistory() {
	Application.LoadLevel("history");
}

function onClickHelp() {
	Application.LoadLevel("help");
}

function onClickBack() {
	Application.LoadLevel("main_menu");
}

function openWebsite() {
	Application.OpenURL("https://www.google.it");
	//Application.ExternalEval("https://www.google.it");
}
