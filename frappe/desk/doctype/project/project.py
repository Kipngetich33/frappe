# -*- coding: utf-8 -*-
# Copyright (c) 2019, Frappe Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

# global variables

class Project(Document):
	
	def validate(self):
		# ensure that a funding status is select in the source doctypes
		# loop through source organization table
		for source_org in self.source_organization_table:
			if source_org.funding_status_select_one == "&lt; Select One&gt;":
				frappe.throw("Select a Funding Status for Source Organization {}".format(source_org.source_organization_name))

		# ensure that all the required felds are given
		check_required_fields(self)

		# check if atlease one sector is seleted
		single_fields_required_from_group(self)


# general functions
def check_required_fields(self):
	'''
	Function that checks if all the required fields are given 
	before saving
	'''
	required_fields_before_saving = [
		{"field_name":"Project Start Date","field_value":self.project_start_date},
		{"field_name":"Project End Date","field_value":self.project_end_date},
		{"field_name":"Project Description","field_value":self.description},
		# {"field_name":"Attach The Projects Log Frame","field_value":self.attach_the_projects_log_frame}
	]
	# looping throught fields
	for field in required_fields_before_saving:
		if field["field_value"]:
			# pass because field is available
			pass
		else:	
			frappe.throw("You Have Not Filled Required Field '{}'".format(field["field_name"]))

def single_fields_required_from_group(self):
	'''
	Function that checks that atleast one field from the list of 
	given fields is filled or true
	'''
	return_value = False # return value is initialized to False

	required_sectors_before_saving = [
		{"field_name":"Health","field_value":self.health},
		{"field_name":"Education","field_value":self.education},
		{"field_name":"Wash Sector","field_value":self.wash_sector},
		{"field_name":"Economy","field_value":self.economy},
		{"field_name":"Energy and Extractives","field_value":self.energy_and_extractives},
		{"field_name":"Production","field_value":self.production},
		{"field_name":"Infrastructure","field_value":self.infrastructure},
		{"field_name":"Governance ","field_value":self.governance},
		{"field_name":"Environment","field_value":self.environment},
		{"field_name":"Cross Cutting Employment and Labor","field_value":self.cross_cutting_employment_and_labor},
		{"field_name":"Cross Cutting Social Protection","field_value":self.cross_cutting_social_protection},
		{"field_name":"Cross Cutting Youth","field_value":self.cross_cutting_youth},
	]

	# looping through list of required fields
	for field in required_sectors_before_saving:
		if field["field_value"]:
			# pass because field is available
			return_value = True
		else:
			pass

	if(return_value):
		pass
	else:
		frappe.throw("You Need to Specify Atleast One Sector The Project Conributes To")