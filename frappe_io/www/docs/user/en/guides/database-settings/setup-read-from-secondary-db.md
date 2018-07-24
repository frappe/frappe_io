# Setup read operations from slave/secondary mysql system

In normal, the system does read and write operations on the same database. As data size increases or the number of concurrent activities increases, you may start facing a lag in operations.

One immediate solution to avoid such delay is, separate out the read and write activities, i.e. read all data from slave / secondary database and write all information to master / primary database.

Now, in frappe, you can split read and write activities between master and slave.

## Steps to setup readonly environment

1. **Pre-requisites** :
	You should have setup for [MariaDB Master-Slave](https://mariadb.com/kb/en/library/setting-up-replication/) or [Cluster](https://mariadb.com/kb/en/library/getting-started-with-mariadb-galera-cluster/) environment.

2. **Configurations for read-only slave** :

	In your site_config.json, add following keys to enable read from slave / secondary system.

	```
		...
		"use_slave_for_read_only": 1,
		"slave_host": "IP address for slave" ,
		"slave_db_name": "Slave DB name",
		"slave_db_password": "Slave DB password",
		...
	```

	**Note**: If you have enabled MariaDB master-slave environment, then DB name and DB password are same on both.
	
3. [Grant access permissions](https://dev.mysql.com/doc/refman/8.0/en/grant.html) for master host on slave / secondary system.


