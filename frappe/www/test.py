# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
import frappe.sessions
# import  Chart  from frappe-charts

def get_context(context):	
    # check if user is allowed to visit page
	if frappe.session.user=='Guest':
		# frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)

    # get varibles from frappe
    pass
	
	return context
