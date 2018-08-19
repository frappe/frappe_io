# Architecture

## What is Bench?

Frappe apps are managed by our command-line utility called Bench. It helps you to install, setup, manage multiple sites and apps based on Frappe Framework. It will also create nginx and supervisor config files, setup backups and much more.

<p align="center"><img src="https://i.imgur.com/dZBThmp.png" height="150"/></p>

## What is an app?

A Frappe app is just like any Python app. It is a collection of Modules which in turn are a collection of models which we call DocTypes. You then install such apps on sites which bundles all these concepts together into a web application.

## What is a site?

A site in bench is a container for database and files (public and private). Multiple apps can be installed on a single site and each bring their own set of Modules and DocTypes. A single app can be installed on multiple sites as well.

> Tip: Frappe is framework as well as an app. If you create any site, frappe is installed on it.

## Why apps and sites?

**Multi-tenancy**. Bench allows us to host multiple sites. Sites are differentiated by their name, so, you can have `test-site-1` and `test-site-2` running on the same port. Bench also supports port based multi-tenancy where you can host multiple sites that run on different ports. You then manage your apps and sites within your Bench. [Here](https://www.youtube.com/watch?v=eCAMPcl7NKc&feature=youtu.be&t=32s) is a video explanation of the architecture.

![](https://i.imgur.com/QwNrzPo.png)

---

Have more questions? Ask us on the [developer forum](https://discuss.erpnext.com)