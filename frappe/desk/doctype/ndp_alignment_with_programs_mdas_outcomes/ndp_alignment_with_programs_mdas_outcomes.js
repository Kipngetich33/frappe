// Copyright (c) 2019, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('NDP Alignment With Programs MDAs Outcomes', {
	refresh: function(frm) {

	}
});


// function that checks if priority programs have been given
frappe.ui.form.on("Priority Programs Table", "contributes_to", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	if(child.contributes_to == 1){
		// check if the other fields have been filled
		if(child.priority_program){
			// do nothing 
		}else{
			child.contributes_to = 0
			cur_frm.refresh_fields();
			frappe.throw("No Priority Program Found")
		}
	}
});

// check if relevant MDA has been provided
frappe.ui.form.on("Relevant MDAs Table", "lead_mda", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	if(child.lead_mda == 1){
		// check if the other fields have been filled
		if(child.relevant_mda_per_sector && child.sector ){
			// do nothing 
		}else{
			child.lead_mda = 0
			cur_frm.refresh_fields();
			frappe.throw("No Priority Program or Sector Found")
		}
	}
});


// check if relevant MDA has been provided
frappe.ui.form.on("Outcome by Selected Priority Program Table", "attached_to_priority_program", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	if(child.attached_to_priority_program == 1){
		// check if the other fields have been filled
		if(child.outcome && child.priority_program && child.sector ){
			// do nothing 
		}else{
			child.attached_to_priority_program = 0
			cur_frm.refresh_fields();
			frappe.throw("No Outcome,Priority Program or Sector Found")
		}
	}
});

// function that fetches relevant priority Programs for Relevant Priority Programs 
frappe.ui.form.on("Project", "fetch_ndp_ii_alignment__details", function(frm,cdt,cdn){ 
	var list_of_sector_fields = ["health","education","WASH","economy","energy_and_extractives",
	"production","infrastructure","governance","environment","cross_cutting_employment_and_labor",
	"cross_cutting_social_protection","cross_cutting_youth"]
		
});