/*
 * form plugin script
 */

// init form plugin script
function form_init() {

	update();

	// add events
	// bind event to input changes
	jQuery('.form_input')
		.keyup(function (e) {
			update();
		});

	// bind event to selections
	jQuery('.form_select,.form_checkbox,.form_radio')
		.change(function (e) {
			update();
		});

}


// update mandatory and submit buttons, hide
function update() {

	nodes = jQuery("[mandatory]");

	// iterate nodes
	jQuery.each(nodes, function (k, v) {

		switch (v.nodeName) {

			case "SELECT":
				update_sel_content(jQuery(v));
				update_select(jQuery(v));
				break;

			case "INPUT":
				update_input(jQuery(v));
				break;
		}
	});

	update_hide();
	form_check_submit();
}


// update input fields
function update_input(obj) {

	var type = jQuery(obj).attr("type");
	var val = jQuery(obj).val();
	var check = jQuery(obj).attr("check");

	switch (type) {

		case "text":
			update_input_text(obj, val, check);
			break;

		case "checkbox":
			update_input_checkbox(obj, val, check);
			break;

		case "radio":
			update_input_radio(obj, val, check);
			break;
	}
}

// update input type="text"
function update_input_text(obj, val, check) {

	if (check) {

		check_ary = check.split(":");

		// set valid on check function
		switch (check_ary[0]) {

			// minimal character count
			case "count":

				if (val.length >= check_ary[1]) {
					jQuery(obj)
						.removeClass("form_mandatory")
						.addClass("form_mand_ok");
				}

				else {
					jQuery(obj)
						.removeClass("form_mand_ok")
						.addClass("form_mandatory");
				}
				break;


			// regex match
			case "regex":

				reg = val.match(check_ary[1]);						

				if (reg != null) {
					jQuery(obj)
						.removeClass("form_mandatory")
						.addClass("form_mand_ok");
				}

				else {
					jQuery(obj)
						.removeClass("form_mand_ok")
						.addClass("form_mandatory");
				}
				break;
		}
	}
}

// update input type="checkbox"
function update_input_checkbox(obj, val, check) {

	// check mandatory
	if (obj.attr("mandatory")) {

		if (obj.attr('checked') !== undefined) {

			jQuery(obj)
				.removeClass("form_mandatory")
				.addClass("form_mand_ok");
		}

		else {

			jQuery(obj)
				.removeClass("form_mand_ok")
				.addClass("form_mandatory");
		}
	}
}


// update input type="radio"
function update_input_radio(obj, val, check) {

}


// update select content via ajax
function update_sel_content(obj) {

	var ajax = jQuery(obj).attr("ajax");
	var ajaxVal = obj.attr("ajaxVal");
	var update = false;
	var ajaxCnt = 0;

	// dynamic update parameter found
	if (ajax) {

		m = ajax.match(/\$([^\@\,\^]+)/gm);

		// variables found
		if (m.length > 0) {

			// iterate values
			jQuery.each(m, function (k, v) {

				val = jQuery("[name='_form_" + v.substring(1) + "']").val();

				// value found
				if (val) {

					// check for new values
					if (ajaxVal) {
						ajaxVal = ajaxVal.split("|");
						ajaxCnt = ajaxVal.length;

						if (val == ajaxVal[k]) {
							update++;
						}
					}

					// update ajax attribute string
					ajax = ajax.replace(v, val);

					// add value
					if (obj.attr("ajaxVal")) {
						obj.attr("ajaxVal", obj.attr("ajaxVal") + "|" + val);
					}

					// set value
					else {

						obj.attr("ajaxVal", val);
					}

				}

			});


console.log(update+" "+ajaxCnt);
			// is new data
			if (update && update != ajaxCnt) {


				// make ajax call
				jQuery.ajax({
					"url": "?source=" + ajax,
					"dataType": "json",
					"success": function(result) {

						// add options
						if (result != "") {

							// remove options
							obj.empty();
							obj.append("<option></option>");

							jQuery.each(result, function () {

								obj.append("<option value=\"" + this.number + "\">" + this.name + " (" + this.number + ")</option>");
								obj.removeAttr("disabled");
								// obj.removeAttr("ajaxVal");

								// obj.removeAttr("ajax");
							})

						}

						// no data > disable
						else {
							// remove options
							obj.empty();
							obj.removeAttr("ajaxVal");
							// obj.addAttr("disabled", "disabled");
						}

						update_select(obj);
					}
				});
			}

		}
	}
}


// update select fields
function update_select(obj) {

	// select = jQuery('select[name="filmblock"]').attr("fields");
	sel = obj.children('option:selected');

	// has children
	if (sel.length) {

		if (sel[0].value) {
			jQuery(obj)
				.removeClass("form_mandatory")
				.addClass("form_mand_ok");
		}

		else {
			jQuery(obj)
				.removeClass("form_mand_ok")
				.addClass("form_mandatory");
		}
	}
}


// update hidden blocks
function update_hide() {

	var hides = jQuery('[hide]');

	// iterate tags with hide attributes
	jQuery.each(hides, function (k, v) {
		set_hide(jQuery(v).attr("hide"));
	})
}


// check if area with name has all mandatory data
function set_hide(name) {

	source = jQuery("[hide='"+name+"']");
	nodes = jQuery("[cond='"+name+"'][mandatory]");

	if (nodes.length == jQuery(".form_mand_ok[cond='"+name+"']").length) {
		jQuery(source).show();
	}

	else {
		jQuery(source).hide();
	}
}


// insert data into form
function form_insert_data(fields, values) {

	fields = fields.split("|");
	values = values.split("|");

	// iterate fields
	jQuery.each(values, function (idx) {

		jQuery('*[name="'+fields[idx]+'"]')
			.attr("value", values[idx])
			.removeClass("form_mandatory")
			.addClass("form_mand_ok");

	})
}


function form_check_submit() {

	// check all mandatory
	// enable submit
	if(jQuery('.form_mandatory:visible').length == 0) {
		jQuery('input[type="submit"]')
			.removeAttr("disabled","disabled");
	}

	// disable submit
	else {
		jQuery('input[type="submit"]')
			.attr("disabled","disabled");
	}
	
}