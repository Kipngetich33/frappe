// Copyright (c) 2019, Frappe Technologies and contributors
// For license information, please see license.txt


// global variables
var field_to_hide_unhide = {
	international_ngo: ["part_one_section","organization_address",
		"somaliland_branch_offices_section",
		"somaliland_most_senior_executive_section",
		"ndp_ii_pillars_section","geographical_area",
		"accounting_and_reporting_period_section",
		"declaration","section_break_58",
		"country_director",
		"three_alternative_contact_persons_section",
		"total_number_of_staff_section","section_break_65",
		"part_two","section_break_47"
	],
	local_ngo: ["section_break_98","organization_address_local",
		"section_break_106","section_break_112","community_group",
		"applicant_application","describe_purpose_of_organization",
		"organization_motto_section","organization_activity_section",
		"organization_activity","community_counsel"
	],
	all: [
		// fields for International NGO
		"part_one_section","organization_address",
		"somaliland_branch_offices_section",
		"somaliland_most_senior_executive_section",
		"ndp_ii_pillars_section","geographical_area",
		"accounting_and_reporting_period_section",
		"declaration","section_break_58",
		"country_director",
		"three_alternative_contact_persons_section",
		"total_number_of_staff_section","section_break_65",
		"part_two","section_break_47",
		// fields for counry address
		'directors_address','director_city','director_code','country',
		// fields for local NGO
		"section_break_98","organization_address_local",
		"section_break_106","section_break_112","community_group",
		"applicant_application","describe_purpose_of_organization",
		"organization_motto_section","organization_activity_section",
		"organization_activity","community_counsel"

	],
}

// The section below contains custom scripts for the sales invoice
// ================================================================================================
/* This section contains code from the general functions section
which are called is the form triggered functions section*/

/*function that toogles field to hide or unhide*/
function hide_unhide_fields(frm, list_of_fields, hide_or_unhide) {
	for (var i = 0; i < list_of_fields.length; i++) {
		frm.toggle_display(list_of_fields[i], hide_or_unhide)
	}
}

function hide_unhide_on_refresh(frm) {
	if (frm.doc.organization_type && frm.doc.organization_type == "International NGO") {
		hide_function(frm, field_to_hide_unhide, "international_ngo")
	}
	else if (frm.doc.organization_type && frm.doc.organization_type == "Local NGO") {
		hide_function(frm, field_to_hide_unhide, "local_ngo")
	}
	else {
		hide_function(frm, field_to_hide_unhide, "none")
		if(frm.doc.organization_type =="Select One"){
			// do nothing for now
		}
		else{
			var non_existant_form ="Registration Form for "+frm.doc.organization_type+" is Currently Unavailable"
			frappe.msgprint(non_existant_form)
		}
	}

	function hide_function(frm, field_to_hide_unhide, language) {
		var hide_fields = field_to_hide_unhide["all"]
		var unhide_fields = field_to_hide_unhide[language]
		if (language == "none") {
			hide_unhide_fields(frm, hide_fields, false)
		}
		else {
			hide_unhide_fields(frm, hide_fields, false)
			hide_unhide_fields(frm, unhide_fields, true)
		}
	}
}

// function that checks a user has a pre-existing organization and 
// redirects them to it
function redirect_if_existing_organization(frm){
	// get current username
	var current_user = frappe.session.user
	frappe.call({
		method: "frappe.client.get_list",
		args: 	{
				doctype: "Organization",
				filters: {
					owner:current_user
				},
		fields:["*"]
		},
		callback: function(response) {	
			if(response.message.length == 0){
				// do not do anything let user create an organization
			}
			else if(response.message.length > 0){
				// check if the form is  new
				if(frm.doc.__islocal ? 0 : 1){
					// check if the current form belongs to the user
					if(cur_frm.doc.name == response.message[0].name ){
						// belongs to user hence do nothing
					}else{
						// does not belong to user hence redirect
						msgprint("You Do Not Have Permisions to View Selected Organization, You Have been Redirected To Your Organization")
					}
				}else{
					msgprint("You Have Already Registered Your Organiziation You Have be Redirected to It")
					frappe.set_route("Form", "Organization",response.message[0].name)
				}
			}
		}	
	});
}

// function that sets custom buttons
function add_custom_buttons(button_name,action){
	cur_frm.add_custom_button(__(button_name), function(){
		if(action=="Renew"){
			// untick the validated fiedl and remove the name of validating user
			msgprint("Functionality Under Development")
		}
		
	},__("Organization Management Project"));
}

/* end of the general functions section
// =================================================================================================
/* This section  contains functions that are triggered by the form action refresh or
reload to perform various action*/
frappe.ui.form.on('Organization', {
	refresh: function(frm) {
		// var newrow = cur_frm.grids[0].grid.grid_rows[cur_frm.grids[0].grid.grid_rows.length - 1].doc;
		// hide / unhide fields based on selected options
		hide_unhide_on_refresh(frm)
		// check if user has role Organization Admin Role
		if(frappe.user.has_role("Organization Admin")){
			// let the user create a new organization 
		}else{
			// redirect if user already has a organization
			redirect_if_existing_organization(frm)
		}

		// add Organization Management Button
		add_custom_buttons("Renew Registration","Renew")
	}
});

// function that hide/unhide section based on selected language
frappe.ui.form.on("Organization", "organization_type", function(frm){ 
	// refresh to hide/unhide fields
	frm.refresh()
});


// function that hide/unhide section based on selected language
frappe.ui.form.on("Organization", "select_one", function(frm){ 
	// refresh to hide/unhide fields
	if(frm.doc.select_one =="Select One"){
		hide_unhide_fields(frm,['directors_address','director_city','director_code','country'], false)
	}
	else if(frm.doc.select_one =="Other"){
		hide_unhide_fields(frm,['directors_address','director_city','director_code','country'], true)
	}
	else{
		hide_unhide_fields(frm,['directors_address','director_city','director_code','country'], false)
	}
});

// function that checks the year of first registration
frappe.ui.form.on("Organization", "what_year_registered", function(frm){ 
	// check that input is a int
	var registration_year = parseInt(frm.doc.what_year_registered)
	if(registration_year){
		// check if years are correct
		var dt = new Date();
		var current_year = dt.getFullYear()
		if(registration_year >= 1991 && registration_year <current_year){
			// correct range
		}else{
			frappe.msgprint("Invalid Registration Year, YearShould be Between 1991 and "+String(current_year))
			frm.set_value("what_year_registered","")
		}
	}else{
		if(registration_year.length == 0){
			// do nothing else
		}else{
			frappe.msgprint("Year Entered Should be a Number e.g 2019")
		}
		
	}
});


// function that checks the validity of years when the organization was not registered
frappe.ui.form.on("Unregistered Years Table", "unregistered", function(frm,cdt,cdn){ 
	// check that input is a int
	var child = locals[cdt][cdn];
	var registration_year = parseInt(child.unregistered)
	if(registration_year){
		// check if years are correct
		var dt = new Date();
		var current_year = dt.getFullYear()
		if(registration_year >= 1991 && registration_year <current_year){
			// correct range
		}else{
			frappe.msgprint("Invalid Un-Registered Year, Years Should be Between 1991 and "+String(current_year))
			frm.set_value("what_year_registered","")
		}
	}else{
		if(registration_year.length == 0){
			// do nothing else
		}else{
			frappe.msgprint("Year Entered Should be a Number e.g 2019")
		}
		
	}
});



