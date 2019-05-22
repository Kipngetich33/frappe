# -*- coding: utf-8 -*-
# Copyright (c) 2019, Frappe Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

# class AdministrativeUnit(Document):
# 	pass

from frappe.utils.nestedset import NestedSet

# make the class Test inherit from the NestedSet
class AdministrativeUnit(NestedSet):
	nsm_parent_field = 'parent_administrative_unit'
