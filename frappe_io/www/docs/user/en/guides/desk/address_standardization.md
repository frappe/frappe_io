<!-- add-breadcrumbs -->
# Address Standardization

Address standardization enables you to let users select address fields like state, county city, postal code from predefined values and also allows entry of only valid addresses for eg. once a city is selected only postal codes inside the city and the state in which the city lies will be available for selection

**To enable address standardization** in System Settings check on the field *Enable Address Check* 

**Storing Administrative Areas Data**
* Address Standardization uses the Administrative Area doctype
* Files having administrative areas for each country are stored in 
geo -> administrative regions -> <country_name>.json
* Currently only india.json is provided
* To enable feature for other countries add respective files and modify country filter in install_fixtures.py

**To add a new administrative area** add an entry in the list in <country_name>.json file with the following structure


	{
		"administrative_area_type": "city",
		"parent": [
			"Telangana",
			"Mahabub Nagar"
		],
		"title": "Balanagar"
	}

* Here the hierarchy followed in administrative areas is
country -> state -> county -> city -> pincode. So, in the example to insert a city named *Balanagar* in the parent list add the complete hierarchy [*state*,*county*] which is [*Telangana*, *Mahbub Nagar*]
* Care must be taken that the entries in the parent list must already exist higher up in the list in <country_name>.json

* The administrative areas in <country_name>.json  are parsed on system setup 
* To add custom administrative area later simply go to Desk -> Administrative Area List and Create 

**Sample Address Data Entry**

![address_data_entry](/assets/address_data_entry.gif)
