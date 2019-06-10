// Copyright (c) 2019, Frappe Technologies and contributors
// For license information, please see license.txt



// ================================================================================================
/* This section contains code from the general functions section
which are called is the form triggered functions section*/



function toggle_fields_using_roles(frm){
	// add the Renew Menu
	add_renew_menu("Renew","renew")
	
	// add the Project Management Menu if user has correct Privillages
	if(frappe.user.has_role("Project Admin") || frappe.user.has_role("Administrator") ){
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

// function that sets custom buttons
function add_renew_menu(button_name,action){
	cur_frm.add_custom_button(__(button_name), function(){
		if(action=="renew"){
			project_renew_function()
		}
		
	},__("Project Renew Menu"));
}

// function that renews a project
function project_renew_function(){
	// check if enddate has been reached
	if(cur_frm.doc.project_end_date){
		var project_end_date = new Date(cur_frm.doc.project_end_date)
		var todays_date = new Date()
		if(project_end_date >= todays_date ){
			frappe.throw("You Cannot Renew a Project Before Its End Date")
		}else{
			var new_phase = parseInt(cur_frm.doc.project_phase) +1

			if(cur_frm.doc.project_phase == "1"){
				// do nothing to the name
			}else{
				// restructure the name
				var name_with_phase = cur_frm.doc.name
				var new_name = name_with_phase.slice(0,(name_with_phase.length -8))
			}

			frappe.route_options ={
				"project_name":new_name + "-Phase "+String(new_phase),
				"project_code":cur_frm.doc.project_code,
				"project_renewed_from":cur_frm.doc.name,
				"project_phase":String(new_phase)
				// add more things to be set to options

			}
			frappe.set_route("Form", "Project","New Project 1")
		}
	}else{
		frappe.throw("You Cannot Renew A Project Whose End Date is Not Defined")
	}
}

// function that adds priority program to the priority programs table
function add_priority_programs(frm,program_description,sector,priority_program){
	var priority_programs = frm.add_child("relevant_priority_programs")
	priority_programs.priority_program_description = program_description 
	priority_programs.sector = sector
	priority_programs.priority_program = priority_program
	cur_frm.refresh_fields();
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
	
		// if project is a renewal make name read only
		if(cur_frm.doc.project_renewed_from){
			cur_frm.set_df_property("project_name", "read_only", 1)
		}
	}
});

// function that asks the user if they have verified all the information before
// all the fields are made read only
frappe.ui.form.on("Project","validate_button",function(frm){
	// check if the document has been saved
	if(frm.doc.__islocal ? 0 : 1){
		// check if NDP Aligment with Sector , Programs and Outcomes has Been Defined
		if(frm.doc.ndp_aligment_sector_program_outcome){
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
			
		}else{
			console.log("form name")
			console.log(frm.doc.name)
			frappe.confirm(
				'You Have Not Defined an NDP Alignment.Do You Want to Create One?',
				
				// If user choose to continue
				function(){
					frappe.route_options ={
						"name_of_organization":frm.doc.your_organization,
						"project":cur_frm.doc.name,
		
					}
					frappe.set_route("Form", "NDP Alignment With Programs MDAs Outcomes","New NDP Alignment With Programs MDAs Outcomes 1")
				},
				// if user choses No
				function(){
					frappe.throw("Please Note that You Cannot Validate A Project Before Creating an NDP Aligment Record")
				}
			)
		}
	}else{
		frappe.throw("Please Save The Project First")
	}
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
	
	if(child.source_organization_name){
		if(child.source_organization_name == "Other"){
			if(child.enter_name_of_source_organization){
				// do nothing
			}else{
				frappe.throw("Give The Source Organization First")
			}
			
		}
	}else{
		frappe.throw("Give The Source Organization First")
	}
});

// function that a source organization type has been selected
frappe.ui.form.on("Source Organization", "enter_name_of_source_organization", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	
	if(child.source_organization_type){
		if(child.source_organization_type == "Other"){
			if(child.enter_organization_type){
				// do nothing
			}else{
				frappe.throw("Give The Source Organization Type First")
			}
			
		}
	}else{
		frappe.throw("Give The Source Organization Type First")
	}

});

// function that a source organization type has been selected
frappe.ui.form.on("Source Organization", "source_organization_name", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];

	if(child.source_organization_type){
		if(child.source_organization_type == "Other"){
			if(child.enter_organization_type){
				// do nothing
			}else{
				frappe.throw("Give The Source Organization Type First")
			}
			
		}
	}else{
		frappe.throw("Give The Source Organization Type First")
	}

	// if source organization selected is other unhude the field enter_the_name_of_source_organization
	if(child.source_organization_name == "Other"){
		child.source_organization_does_not_exist_in_the_list_above = 1
		cur_frm.refresh_fields();
		
	}else{
		child.source_organization_does_not_exist_in_the_list_above = 0
		cur_frm.refresh_fields();
	}
	
});

// function that checks the source organization type selected
frappe.ui.form.on("Source Organization", "source_organization_type", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	// check if a funging status has been selected
	if(child.source_organization_type == "Other"){
		child.organization_type_is_not_in_the_list_above = 1
		cur_frm.refresh_fields();
	}
});



// function that allows the users set points of the Project on the Map
frappe.ui.form.on("Source Organization", "source_organization_type", function(frm,cdt,cdn){ 
	var child = locals[cdt][cdn];
	// check if a funging status has been selected
	if(child.source_organization_type == "Other"){
		child.organization_type_is_not_in_the_list_above = 1
		cur_frm.refresh_fields();
	}
});


// function that fetches relevant priority Programs for Relevant Priority Programs 
frappe.ui.form.on("Project", "economy", function(frm,cdt,cdn){ 
	// get priority programs
	frappe.call({
		method: "frappe.client.get_list",
		args: 	{
				doctype: "Program",
				filters: {
					sector:"Economy",
					priority_program:1
				},
		fields:["*"]
		},
		callback: function(response) {
			console.log(response.message)
			$.each(response.message,function(i,v){
				add_priority_programs(frm,v.program,v.sector,v.program_code)
			})


			// if(frm.doc.economy){
			// 	console.log("economyu")
			// 	var program_description = "Test"
			// 	var sector = "Economy"
			// 	var priority_program = "Test Program"
			// }else{
			// 	console.log("noe")
			// }
		}
	})
});




