# -*- coding: utf-8 -*-
# Copyright (c) 2019, Frappe Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Project(Document):
	
	def validate(self):
		# ensure that a funding status is select in the source doctypes
		# loop through source organization table
		for source_org in self.source_organization_table:
			if source_org.funding_status_select_one == "&lt; Select One&gt;":
				frappe.throw("Select a Funding Status for Source Organization {}".format(source_org.source_organization_name))
