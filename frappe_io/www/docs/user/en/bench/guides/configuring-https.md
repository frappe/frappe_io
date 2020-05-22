<!-- add-breadcrumbs -->
# Configuring HTTPS

### Get the required files

You can get a SSL certificate from a trusted Certificate Authority or generate your own. For self signed certificates the browser will show a warning that the certificate is not trusted. [Here's a tutorial for using Let's Encrypt to get a free SSL Certificate](lets-encrypt-ssl-setup.html)

The files required are

* Certificate (usually with extension .crt)
* Decrypted private key

### Prequisites

1. You need to have a [DNS Multitenant Setup](https://frappe.io/docs/user/en/bench/guides/setup-multitenancy)
2. Your site should be accessible via a valid domain
3. You need root permissions on your server
4. You need a valid certificate generated through a trusted Certificate Authority or a Self-Signed Certificate.

To generate .crt from private authority, generally you would have to generate a CSR (Certificate Signing Request). You may skip this step if you already have a certificate (.crt) file. To generate a CSR and the corresponding key file, run the following command:

	openssl req -new -newkey rsa:2048 -nodes -keyout mydomain.com.key -out mydomain.com.csr

You need to upload this CSR (.csr) file to the private certificate authority (eg. GoDaddy, ComodoSSL) to generate a valid certificate (.crt) file against it.

If you have multiple certificates (primary and intermediate), you will have to concatenate them. For example:

	cat your_certificate.crt CA.crt >> certificate_bundle.crt

Also make sure that your private key is readable only by the root user:

	chown root private.key
	chmod 600 private.key

### Move the two files to an appropriate location

	mkdir /etc/nginx/conf.d/ssl
	mv private.key /etc/nginx/conf.d/ssl/private.key
	mv certificate_bundle.crt /etc/nginx/conf.d/ssl/certificate_bundle.crt

### Setup nginx config

Set the paths to the certificate and private key for your site

	bench set-ssl-certificate site1.local /etc/nginx/conf.d/ssl/certificate_bundle.crt
	bench set-ssl-key site1.local /etc/nginx/conf.d/ssl/private.key

### Generate nginx config

	bench setup nginx

### Reload nginx

	sudo service nginx reload

or

	systemctl reload nginx # for CentOS 7

Now that you have configured SSL, all HTTP traffic will be redirected to HTTPS
