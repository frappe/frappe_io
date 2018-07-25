
# Installation

To the best of our knowledge, this will be the only page you'd ever require to install [frappe](https://github.com/frappe/frappe) right from scratch. This script also believes to be a foolproof setup to have [frappe](https://github.com/frappe/frappe) onto your system. **In case if you run into some problems, feel free to raise an issue [here](https://github.com/frappe/frappe/issues)** with the title <code>[frappe-install]</code> followed by your issue. Your issue must have the following - System (OS) version, Dependency versions, Error Log.

**NOTE:** To see if your Linux OS distribution has been tested for the following script, check [here](#tried-and-tested). You're free to revise this page in order to add your Linux OS distribution if you're successful with this script too (_psst_, helps others).

Note that the method described here will install Frappe's developer branch. If you want the stable production branch, follow the [Easy Install](https://github.com/frappe/bench#easy-install) method.

#### Getting [frappe](https://github.com/frappe/frappe) onto your system

Before going further, here's something you need to know. [frappe](https://github.com/frappe/frappe) is not just a web framework as a whole but also an app itself.

##### Q. Wait, what's an app?

You can think of an app in the [frappe](https://github.com/frappe/frappe) jargon as a collection of mutable definitions and custom functionalities for a said use-case (basically, a codebase). You then install such apps on sites (which consists of one database at a domain, files, etc.) that acts as the view layer to your app (just like any other website).

##### Q. Apps? Sites? Why would you do such a thing?

**Multi-tenancy**. [frappe](https://github.com/frappe/frappe) was built with an intention for you to reuse a codebase, definitions, functions, views, etc. Both, apps and sites are contained within what we call as - _drum rolls_ - **the Bench!**

<p align="center"><img src="https://i.imgur.com/dZBThmp.png" height="150"/></p>

You then manage your apps and sites within your Bench. To know more, click [here](https://www.youtube.com/watch?v=eCAMPcl7NKc&feature=youtu.be&t=32s) to completely know the architecture from the author of [frappe](https://github.com/frappe/frappe), [Rushabh Mehta](https://github.com/rmehta) himself.

##### Q. Apps? Sites? And now Bench?
Yes, the Bench! You can think of the bench as the guardian for both, your apps and sites. Bench is the heart and soul of apps and sites built using the [frappe](https://github.com/frappe/frappe) framework. You store, update, manage and mutate apps within your bench. Not just that
> [`bench`](https://github.com/frappe/bench) #faris(why isn't this rendering as codeblock with link) is to frappe, what `apt-get` is to Debian-based Linux OS :wink:


We provide you the [<code>bench</code>](https://github.com/frappe/bench) command-line tool for you to create Benches, Apps and Sites. For installing apps built on frappe, we use [<code>git</code>](https://git-scm.com) as our Source Control Manager (SCM) to have them fetched from remote repositories.

![](https://i.imgur.com/QwNrzPo.png)


To know more about **the Bench**, check out [this](https://www.youtube.com/watch?v=GVWrKuj-EAc&feature=youtu.be&t=41s) talk from the author of [bench](https://github.com/frappe/bench) ([Pratik Vyas](https://github.com/pdvyas)).

### Installation

### Dependencies

* Install [`git`](https://git-scm.com)

**Debian/Ubuntu**
```sh
$ apt install git
```

**MacOS**
```sh
$ brew install git
```

**CentOS**
```sh
$ yum install git
```

**Arch Linux**
```sh
$ pacman -S git
```

* Check whether **git** has been installed correctly
```sh
$ git --version
```


You should then see <code>X.Y.Z</code> on your terminal screen.


[frappe](https://github.com/frappe/frappe) requires Python 2.7 or 3.6 (or above) installed. To our luck, Python comes shipped with most Linux OS distributions. However, we might require the <code>python-dev</code> package installed for using Python's C API.

* To install Python 2.7.X `dev` package on your Linux OS, simply:

**Python 2**
**Debian/Ubuntu**
```sh
$ apt install python-dev
```
**MacOS**
```shell
$ # nothing to do
```
**CentOS**
```sh
$ yum install python-devel
```
**Arch Linux**
```sh
$ pacman -S python2 # You might also need base-devel, but I presume you already have it
```

**Python 3**
**Debian/Ubuntu**
```sh
$ apt install python3-dev
```
**MacOS** #faris(some mac user needs to verify if this is needed or not)
```sh
$ # nothing to do :)
```
**CentOS**
```sh
$ yum -y install https://centos7.iuscommunity.org/ius-release.rpm
$ yum install python36u-devel
```
**Arch Linux**
```sh
$ pacman -S python3
```

* Install `pip` (Python's Package Manager):
```sh
$ wget https://bootstrap.pypa.io/get-pip.py
$ python get-pip.py
```


[frappe](https://github.com/frappe/frappe) uses [MariaDB](https://mariadb.org) (for [RDBMS](https://en.wikipedia.org/wiki/Relational_database_management_system)) as its database engine, [Redis](https://redis.io) for caching and as a message broker and [Node.js](https://nodejs.org) for everything JavaScript. Go ahead and install 'em all.

* To install MariaDB 10.3 `stable` package on your Linux OS, simply:

**Debian/Ubuntu**
```sh
$ apt install -y software-properties-common
$ apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
$ add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://ftp.ubuntu-tw.org/mirror/mariadb/repo/10.3/ubuntu xenial main'

$ apt update
$ apt install -y mariadb-server-10.3
$ apt install libmysqlclient-dev
```
**MacOS** #faris (bold issue)
```sh
$ brew install mariadb
```
**CentOS**
Edit the `/etc/yum.repos.d/mariadb.repo` with you favorite editor (`nano`, `vim` etc.) #faris(why no next line)
```txt
# MariaDB 10.2 CentOS repository list - created 2018-05-28 18:30 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.2/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
```
Now install MariaDB #faris(bold issue)
```shell
yum -y install MariaDB-server MariaDB-client
```
**Arch Linux**
```sh
$ pacman -S mariadb
```

During this installation you'll be prompted to set the MySQL root password. If you are not prompted for the same, you'll have to initialize the MySQL server setup yourself after the above command completes. You can initialize the MySQL server setup by executing the following command `mysql_secure_installation`. **Remember**: only run it if you're not prompted the password during setup.

It is really important that you remember this password, since it'll be useful later on!

You also need to edit the mariadb configuration
Edit the file `/etc/mysql/my.cnf` if you're using a Linux OS or `/usr/local/etc/my.cnf` if you're on Mac OS using your favorite editor and add this to the file

**MariaDB 10.2 or 10.1**
```txt
[mysqld]
innodb-file-format=barracuda
innodb-file-per-table=1
innodb-large-prefix=1
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

[mysql]
default-character-set = utf8mb4
```
**MariaDB 10.3**
```txt
[mysqld]
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

[mysql]
default-character-set = utf8mb4
```

Finally restart the mysql server and you'll be good to go!
**Linux OS**
```sh
$ systemctl mysql restart
```
**Mac OS**
```shell
service.mysql start
```

* To install Redis on your Linux OS, simply:
**Debian/Ubuntu**
```sh
$ apt install redis-server
```
**MacOS** #faris(why is brew install bold)
```sh
$ brew install redis
```
**CentOS**
```sh
$ yum -y install epel-release
$ yum -y install redis
```
**Arch Linux**
```sh
$ pacman -S redis
```

* To install Node.js 8.X package on your system, simply:
```sh
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
$ exec bash
$ nvm install v8
$ nvm use v8
```

#### Getting [Bench](https://github.com/frappe/bench) onto your system

Install Bench via [<code>pip</code>](https://pip.pypa.io)
```sh
$ git clone https://github.com/frappe/bench
$ pip install ./bench
```

NOTE: We're having Bench [<code>pip</code>](https://pip.pypa.io)ed soon (Click [here](https://github.com/frappe/bench/pull/490) for more details).

* Check whether **Bench** has been installed correctly
```sh
$ bench --version
```

You should then see <code>X.Y.Z</code> on your terminal screen.


And there you have it! You're now ready to build something awesome using [frappe](https://github.com/frappe/frappe)

#### Bench - Quickstart
To create a new bench, simply use the `bench init` command as follows:
```sh
$ bench init <MY_BENCH>
```
e.g.
```sh
$ bench init frappe-bench
```


This goes ahead and creates a folder named <code>frappe-bench</code> with a whole lot of stuff inside! This might take a while (depending on your internet speed). We, at frappe love our coffee with flavour. Go get one brewed for yourself.

Once done, simply change to your bench directory:
```sh
$ cd <MY_BENCH>
```
e.g.
```sh
$ cd frappe-bench
```

#### What should you see?
Typing an `ls` on your terminal, you should see the following:
```sh
├── 🗄️ apps               # frappe apps
├── 🗄️ config             # all configuration files (*.conf)
├── 🗄️ env                # virtual environment (an isolated python environment catering to python dependencies for frappe apps only)
├── 🗄️ logs               # all log files
├── 🗄️ node_modules       # collective node dependencies for frappe apps
├── 🗄️ sites              # frappe sites
├── 📁 package.json       # list of node dependencies
├── 📁 package-lock.json  # locking the list of node dependencies
├── 📁 patches.txt        # list of patches patched
├── 📁 Procfile           # process file (to let honcho activate a list of all processes)
```

Go ahead and start bench as follows:
```sh
$ bench start
```

#### Creating Sites

**NOTE:** You might need another terminal instance to run the following commands within the path to your <code>MY_BENCH</code> directory.

```sh
$ bench new-site <MY_SITE>
```
e.g.
```sh
$ bench new-site foo.bar
```


You'll be then prompted to type your MySQL root password (which then goes ahead and creates a new database for your site). You'd also be prompted to create a new password for the System Administrator. A site comes with frappe installed by default. Like I mentioned

> frappe is not just a web framework as a whole but also an app itself.

#### Site based multi-tenancy

frappe lets you create multiple sites, in a single instance. To enable site based multi-tenancy empty the contents of the file <code>currentsite.txt</code> using the text-editor of your choice (I'm using nano here)

```sh
$ nano sites/currentsite.txt
```


Then add an entry of the site you just created into the <code>/etc/hosts</code> file.

```sh
$ sudo nano /etc/hosts
```

Add the following line and save the file
```sh
$ 127.0.0.1	foo.bar
```

#### Fetching frappe Apps

[ERPNext](https://erpnext.org) happens to be two things - a frappe App and [the world's best 100% Open Source ERP](https://opensource.com/resources/top-4-open-source-erp-systems). You can have [erpnext](https://github.com/frappe/erpnext) fetched and stored within your bench using the following command:

```sh
$ bench get-app <APP_REMOTE_URL|VALID_FRAPPE_APP>
```
e.g.
```sh
$ bench get-app erpnext
```

This goes ahead and fetches the complete source code and places it within your <code>MY_BENCH/apps/MY_APP_NAME</code> folder. In this case - <code>frappe-bench/apps/erpnext</code>

#### Installing frappe Apps onto Sites
```sh
$ bench --site <MY_SITE> install-app <MY_APP_NAME>
```
e.g.
```sh
$ bench --site foo.bar install-app erpnext
```

#### You're all set!

Now you can simply access the site you just created using the link [foo.bar:8000](http://foo.bar:8000)

#### Tried and Tested #faris (table doesn't work)

**NOTE:** If you're attempting to revise this page after successfully installing and running frappe, kindly add the required details in the following format only.

+--------------+---------+---+
| Name         | Version | By
+--------------+---------+---+
| Ubuntu       | 16.04.1 | Ameya Shenoy <br/> [@codingCoffee](https://github.com/codingCoffee), <[ameya@frappe.io](mailto:ameya@frappe.io)>
| Ubuntu       | 18.04   | Ameya Shenoy <br/> [@codingCoffee](https://github.com/codingCoffee), <[ameya@frappe.io](mailto:ameya@frappe.io)>
| CentOS       | 7.4     | Ameya Shenoy <br/> [@codingCoffee](https://github.com/codingCoffee), <[ameya@frappe.io](mailto:ameya@frappe.io)>
| CentOS       | 7.5     | Ameya Shenoy <br/> [@codingCoffee](https://github.com/codingCoffee), <[ameya@frappe.io](mailto:ameya@frappe.io)>
| Arch Linux   |         | Ameya Shenoy <br/> [@codingCoffee](https://github.com/codingCoffee), <[ameya@frappe.io](mailto:ameya@frappe.io)>
+--------------+---------+---+

<!-- TODO -->
<!-- ameya -->

- [] Tone should be more formal
- [] Remove HTML tags, use proper markdown
