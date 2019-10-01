$(document).ready(function() {
	var $button = $('#btn-gerar');
	var $input = $('#txt-input');
	
	$button.click(function() { 
		var lines = $input.val().split('\n');
		process(lines);
		$button.attr('disabled', 'disabled');
		copyToClipboard($input, $button);
	});
	
	$('#btn-reset').click(function() { 
		$button.removeAttr('disabled');
		$input.val('')		
	});	
});

function copyToClipboard($input, $button) {
	$input.select();
	document.execCommand('copy');	
}

function getFormatNewFile() {
	return "RCS file: /ti/{fullname},v\r\n" +
			"done\r\n" +
			"Checking in {filename};\r\n" +
			"/ti/{fullname},v  <--  {filename}\r\n" +
			"initial revision: 1.1\r\n" +
			"done\r\n\r\n";
}


function getFormatCommitedFile() {
	return "Checking in {fullname};\r\n" +
		   "/ti/{fullname},v  <--  {filename}\r\n" +
		   "new revision: {newrevision}; previous revision: {previous}\r\n" +
		   "done\r\n\r\n";
}

function formatOutput(obj) {
	var format = null;
	if (obj.isNew) {
		format = getFormatNewFile();
	} else {
		format = getFormatCommitedFile();		
	}
	return createOutput(format, obj);
}

function createOutput(format, obj) {
	var fullname = obj.source;
	var filename = getFilename(obj);
	var previous = getPreviousVersion(obj);
	var output = format.replace(/{fullname}/g, obj.source)
					   .replace(/{filename}/g, filename)
					   .replace(/{newrevision}/g, obj.version)
					   .replace(/{previous}/g, previous);
	return output;
	
}

function getPreviousVersion(obj) {
	var version = obj.version;
	var arr = version.split('.');
	var revision = parseInt(arr[arr.length -1]);
	var value = '';
	for (var i = 0; i < arr.length -1; i++) {
		value += arr[i] + '.'
	}
	
	return value + (--revision);
}

function getFilename(obj) {
	var fullname = obj.source;
	var arr = fullname.split("/");
	return arr[arr.length -1];
}

function itemToObject(item) {
	var sourceVersion =	item.split('\t');
	return {
		'isNew'		: sourceVersion[0] == 'The file was added',
		'version'	: sourceVersion[1],
		'source'	: sourceVersion[2]
	}
}

function process(list) {
	document.getElementById('txt-input').value = '';
	
	var output = '';
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var obj = itemToObject(item);
		output += formatOutput(obj);
	}
	document.getElementById('txt-input').value = output;
}