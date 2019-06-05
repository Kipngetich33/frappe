// Copyright (c) 2019, Frappe Technologies and contributors
// For license information, please see license.txt



// ================================================================================================
/* This section contains code from the general functions section
which are called is the form triggered functions section*/



function toggle_fields_using_roles(frm){
	if(frappe.user.has_role("Project Admin")){
		// show the unverify button
		add_custom_buttons("Unvalidate Project","Unvalidate")
	}else{
		// this is a basic organization login role user make fields readonly
		cur_frm.fields.forEach(function(l){ cur_frm.set_df_property(l.df.fieldname, "read_only", 1); })

	}
}

// function that sets custom buttons
function add_custom_buttons(button_name,action){
	cur_frm.add_custom_button(__(button_name), function(){
		if(action=="Unvalidate"){
			// untick the validated fiedl and remove the name of validating user
			cur_frm.set_value("validated",0)
			cur_frm.set_value("name_of_verifying_user","")
			cur_frm.save()
		}
		
	},__("Project Management Menu"));
}



/* end of the general functions section
// =================================================================================================
/* This section  contains functions that are triggered by the form action refresh or
reload to perform various action*/

frappe.ui.form.on('Project', {
	refresh: function(frm) {
		// check if document is saved
		if(frm.doc.__islocal ? 0 : 1){
			// make fields read only for user
			if(frm.doc.validated == 1){
				// make fields read only for basic users
				toggle_fields_using_roles(frm)
				
			}else{
				// do nothing for now
			}
		}else{
			// do nothing 
		}
	}
});

// function that asks the user if they have verified all the information before
// all the fields are made read only
frappe.ui.form.on("Project","validate_button",function(frm){
	frappe.confirm(
		'Once Validated,You Cannot Change the Information. Do You Want to Continue?',
		// If user choose to continue
		function(){
			// set the validating user and validation status
			frm.set_value("name_of_verifying_user","test3@gmail.com")
			frm.set_value("validated",1)
			// save the document
			cur_frm.save()
		},
		// if user choses No
		function(){
			// show_alert('Thanks for continue here!')
		}
	)
});


// function that checks if correct funding status has been selected
frappe.ui.form.on("Source Organization", "amount", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	// check if a funging status has been selected
	if(child.funding_status_select_one == "&lt; Select One&gt;"){
		frappe.throw("Please Select a Funding Status")
	}

});

// function that a source organization has been selected
frappe.ui.form.on("Source Organization", "funding_status_select_one", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	// check if a funging status has been selected
	if(child.source_organization_name || child.enter_name_of_source_organization){
		// source is defined do nothing
	}else{
		frappe.throw("Give a Source Organization First")
	}
});

// function that a source organization type has been selected
frappe.ui.form.on("Source Organization", "enter_name_of_source_organization", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	// check if a funging status has been selected
	if(child.enter_the_name_of_source_organization || child.source_organization_type){
		// source is defined do nothing
	}else{
		frappe.throw("Give The Source Organization Type First")
	}
});

// function that a source organization type has been selected
frappe.ui.form.on("Source Organization", "source_organization_name", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	// check if a funging status has been selected
	if(child.enter_the_name_of_source_organization || child.source_organization_type){
		// source is defined do nothing
	}else{
		frappe.throw("Give The Source Organization Type First")
	}
});
