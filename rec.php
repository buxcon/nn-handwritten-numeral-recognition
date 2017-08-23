<?php
	include 'ImageResize.php';

	$timestamp = time();
	$tmp_dir = dirname(__FILE__) . '/tmp';
	if (!is_dir($tmp_dir)) mkdir($tmp_dir);

	$img = $_POST['image'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$img = base64_decode($img);
	$img = \Eventviva\ImageResize::createFromString($img);
	$img->resizeToHeight(28);
	$img->save($tmp_dir . '/' . $timestamp . '.png');

	$out = exec('python3 rec.py ' . $timestamp);
	file_put_contents($tmp_dir . '/' . $timestamp . '.out', $out);
	echo $out;
?>