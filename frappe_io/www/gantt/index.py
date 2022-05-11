# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe


def get_context(context):
    context.title = 'Open Source Javascript Gantt'
    context.description = 'A simple, interactive, modern gantt chart library for the web with drag, resize, dependencies and time scales'
