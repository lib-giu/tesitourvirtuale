#pragma strict
//
// Callbacks invoked when buttons are pressed
//
import UnityEngine.UI;

var creditsCanvas : Canvas;

function Start () {
	/* nothing to do */
}

function Update () {
	/* nothing to do */
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

function onClickCredits() {
	Application.LoadLevel("credits");
}