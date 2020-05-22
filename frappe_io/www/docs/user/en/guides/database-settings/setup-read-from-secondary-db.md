
# Setup read operations from slave/secondary mysql system

In normal, the system does read and write operations on the same database. As data size increases or the number of concurrent activities increases, you may start facing a lag in operations.

One immediate solution to avoid such delay is, separate out the read and write activities, i.e. read all data from replica / secondary database and write all information to master / primary database.

Now, in frappe, you can split read and write activities between master and replica.

## Steps to setup readonly environment

1. **Pre-requisites** :
	You should have setup for [MariaDB Master-Slave](https://mariadb.com/kb/en/library/setting-up-replication/) or [Cluster](https://mariadb.com/kb/en/library/getting-started-with-mariadb-galera-cluster/) environment.

2. **Configurations for read-only replica** :

	In your site_config.json, add following keys to enable read from replica / secondary system.

	```
		...
		"read_from_replica"                 : 1/0  # to enable disable read from replica
		"different_credentials_for_replica" : 1/0 #if database creadetials are different on replica then set 1 else 0
		"replica_host"                      : "IP address for repica" ,
		"replica_db_name"                   : "Replica DB name",
		"replica_db_password"               : "Replica DB password",
		...
	```

	**Note**: If you have enabled MariaDB master-replica environment, then DB name and DB password are same on both.

3. [Grant access permissions](https://dev.mysql.com/doc/refman/8.0/en/grant.html) for master host on slave / secondary system.


