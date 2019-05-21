# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
import frappe.sessions

def get_context(context):	
	if frappe.session.user=='Guest':
		frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)
	
	return context