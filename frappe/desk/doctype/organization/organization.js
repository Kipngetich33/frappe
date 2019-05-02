// Copyright (c) 2019, Frappe Technologies and contributors
// For license information, please see license.txt


// global variables
var field_to_hide_unhide = {
	english: ["part_one_section","organization_address",
		"somaliland_branch_offices_section",
		"somaliland_most_senior_executive_section",
		"ndp_ii_pillars_section","geographical_area",
		"accounting_and_reporting_period_section",
		"declaration","section_break_58",
		"country_director",
		"three_alternative_contact_persons_section",
		"total_number_of_staff_section","section_break_65",
		"part_two"
	],
	somali: ["section_break_98","organization_address_local",
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
		"part_two",
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
	if (frm.doc.language && frm.doc.language == "English") {
		hide_function(frm, field_to_hide_unhide, "english")
	}
	else if (frm.doc.language && frm.doc.language == "Somali") {
		hide_function(frm, field_to_hide_unhide, "somali")
	}
	else {
		hide_function(frm, field_to_hide_unhide, "none")
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

/* end of the general functions section
// =================================================================================================
/* This section  contains functions that are triggered by the form action refresh or
reload to perform various action*/
frappe.ui.form.on('Organization', {
	refresh: function(frm) {
		hide_unhide_on_refresh(frm)
	}
});

// function that hide/unhide section based on selected language
frappe.ui.form.on("Organization", "language", function(frm){ 
	// refresh to hide/unhide fields
	frm.refresh()
});




