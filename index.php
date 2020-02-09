<?php

/*if (!defined('CMSIMPLE_VERSION') || preg_match('#/database/index.php#i',$_SERVER['SCRIPT_NAME'])) 
{
    die('no direct access');
}*/


define("FORM_CONTENT_BASE", $pth["folder"]["content"]);
define("FORM_DOWNLOADS_BASE", $pth["folder"]["downloads"]);
define("FORM_BASE", $pth["folder"]["plugin"]);


// init class autoloader
// include "autoload.php";
// autoload("form");

spl_autoload_register(function ($path) {

	if ($path && strpos($path, "form\\") !== false) {

		$path = "classes/" . str_replace("form\\", "", strtolower($path)) . ".php";
		$path = str_replace("\\", "/", $path);

		include_once $path; 
	}
});


// init plugin
form\Main::init($plugin_cf, $plugin_tx);

// execute plugin call
form\Api::fetch(form\Session::param("source"));


// plugin to create a form and send the result to an email address
function form($form = false, $format = false, $filter = false) {

	global $onload, $su, $f;

	// execute form actions
	form\Main::action($form);
	form\Main::load($form);
	form\Main::render();
die();



	$ret = "";
	$xsl = false; // output format
	$target = false; // output target (json, display, printer)



	// check form name
	if (!$form) {
		form\Message::failure("fail_noform");
	}

	elseif ($format) {

		// parse format: format[@target] - target is optional (display is default)
		if (preg_match('/([a-z0-9_]+)\@?(.*)/i', $format, $match)) {

			$xsl = $match[1];
			$target = $match[2];

		}


		// load data
		$path = form\Path(FORM_CONTENT_BASE, Config::form_path(), $form);
		// form\Entries::load($path);

		// return script include
		$ret .= '<script type="text/javascript" src="' . FORM_BASE . 'script/form.js"></script>';


		form\Admin::fetch($path);


		// parse xml > add ajax sources
		// form\Parse::load($path);
		// form\Parse::parse($attr);

		$ret .= form\Admin::render($form, ["format" => $xsl, "filter" => $filter, "target" => $target]);
	}

	else {
		form\Message::failure("fail_noformat");
	}


	$ret .= form\Message::render();

	return $ret;
}


?>
