
# Installation

## System Requirements

This guide assumes you are using a personal computer, VPS or a bare-metal server. You also need to be on a *nix system, so any Linux Distribution and MacOS is supported. However, we officially support only the following distributions.

1. Debian
1. Ubuntu
1. CentOS
1. Arch Linux
1. MacOS

If you would like to learn more about the architecture, check it out [here](/new-docs/architecture).

## Pre-requisites

1. Python 2.7 (Python 3.5+ also supported)
1. MariaDB 10+
1. Nginx (for production)
1. Git
1. Nodejs
1. yarn
1. Redis
1. cron (crontab is required)
1. wkhtmltopdf with patched Qt (version 0.12.3) (for pdf generation)

## Installation Steps

> These steps assume you want to install Bench in developer mode. If you want install in production mode, follow the [Easy Install](https://github.com/frappe/bench#easy-install) method.

### 1. Install Bench

Install bench as a non-root user

```bash
git clone https://github.com/frappe/bench bench-repo
pip install --user -e bench-repo
```

---

> If you're attempting to revise this page after successfully installing and running frappe, kindly add the required details in the following format only.

| Name   | Version | By           |
|--------|---------|--------------|
| Ubuntu | 16.04.1 | Ameya Shenoy |