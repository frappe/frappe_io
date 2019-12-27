---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Biometric integration ERPNext
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe framework supports biometric integration for.
---

# Integrating Biometric devices
Currently [Auto Attendance](https://erpnext.com/docs/user/manual/en/human-resources/auto-attendance) in ERPNext helps mark attendance based on IN/OUT logs of employees. These IN/OUT logs are stored in the Employee Checkin Doctype. You can then set up the [Shift Type](https://erpnext.com/docs/user/manual/en/human-resources/shift-management#24-enable-auto-attendance) and assign the shift to employees in order to enable Auto Attendance. We use Python Script to poll for biometric logs and push to ERPNext via API.


## Instructions to run this script
1. Install python3.6+ and git (python versions below 3.6 is **NOT** supported)
2. Clone this repository using `git clone https://github.com/frappe/push-biometric-erpnext`
3. Setup dependencies using `cd push-biometric-erpnext && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
4. Setup `local_config.py` by making a copy of and renaming `local_config.py.template` file.
5. Run this script using `python3 push_to_erpnext.py`

## Setting local config
1. You need to make a copy of `local_config.py.template` file and rename it to `local_config.py`
1. Please fill in the relevant sections in this file as per the comments in it.
1. Below are the delineation of the keys contained in `local_config.py`:
  - ERPNext connection configs:
      - `ERPNEXT_API_KEY`: The API Key of the ERPNext User
      - `ERPNEXT_API_SECRET`: The API Secret of the ERPNext User
      - Please refer to [this link](docs/user/en/guides/integration/how_to_set_up_token_based_auth#generate-a-token) to learn how to generate API key and secret for a user in ERPNext.
      - The ERPNext User who's API key and secret is used, needs to have at least the following permissions:
      - Create Permissions for 'Employee Checkin' DocType.
      - Write Permissions for 'Shift Type' DocType.
      - `ERPNEXT_URL`: The web address at which you would access your ERPNext. eg:`'https://yourcompany.erpnext.com'`, `'https://erp.yourcompany.com'`

  - This script's operational configs:
     - `PULL_FREQUENCY`: The time in minutes after which a pull for punches from the biometric device and push to ERPNext is attempted again.
     - `LOGS_DIRECTORY`: The Directory in which the logs related to this script's whereabouts are stored. For most cases you can leave the above two keys unchanged.
     - `IMPORT_START_DATE`: The date after which the punches are pushed to ERPNext. Expected Format: `YYYYMMDD`. For some cases you would have a lot of old punches in the biometric device. But, you would want to only import punches after certain date. You could set this key appropriately. Also, you can leave this as `None` if this case does not apply to you.

## Installing as a windows service
1. Install pywin32 using `pip install pywin32`.
2. Go to this repository's Directory.
3. Install the windows service using `python push_biometric_windows_service.py install`.

#### Update the installed windows service
`python push_biometric_windows_service.py update`

#### Stop the windows service
`net stop ERPNextBiometricPushService`

#### To see the status of the service
`mmc Services.msc`

## Installing as a linux service
  - By using Cron job.
     - Open terminal and type `crontab -e`. Press Enter.
     - Type `<corn-string> python -c 'from push_to_erpnext import main; main()'` and save.
  - You can set up 'push_to_erpnext.py' as a service using Systemd. Please refer to this [link](https://tecadmin.net/setup-autorun-python-script-using-systemd/).

