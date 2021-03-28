## 配置阿里yum源

#### 1.备份repo数据

```bash
#备份
cd /etc/yum.repos.d
mkdir bak_repo
mv *repo bak_repo
```

#### 2.创建源文件，并且输入以下内容

+ `network.repo`
+ `epel.repo`

```bash
# epel.repo
[epel]
name=Extra Packages for Enterprise Linux 6 - $basearch
baseurl=http://mirrors.aliyun.com/epel-archive/6/$basearch
failovermethod=priority
#gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6
gpgkey=http://mirrors.aliyun.com/epel/RPM-GPG-KEY-EPEL-6
enabled=1
gpgcheck=0

[epel-debuginfo]
name=Extra Packages for Enterprise Linux 6 - $basearch - Debug
baseurl=http://mirrors.aliyun.com/epel-archive/6/$basearch/debug
failovermethod=priority
#gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6
gpgkey=http://mirrors.aliyun.com/epel/RPM-GPG-KEY-EPEL-6
enabled=0
gpgcheck=0
 
[epel-source]
name=Extra Packages for Enterprise Linux 6 - $basearch - Source
baseurl=http://mirrors.aliyun.com/epel-archive/6/SRPMS
failovermethod=priority
#gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6
gpgkey=http://mirrors.aliyun.com/epel/RPM-GPG-KEY-EPEL-6
enabled=0
gpgcheck=0



```

`network.repo`文件

```bash
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#
 
[base]
name=CentOS-$releasever - Base - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.10/os/$basearch/
        http://mirrors.aliyuncs.com/centos-vault/6.10/os/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos-vault/6.10/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6
 
#released updates 
[updates]
name=CentOS-$releasever - Updates - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.10/updates/$basearch/
        http://mirrors.aliyuncs.com/centos-vault/6.10/updates/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos-vault/6.10/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6
 
#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.10/extras/$basearch/
        http://mirrors.aliyuncs.com/centos-vault/6.10/extras/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos-vault/6.10/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6
 
#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.10/centosplus/$basearch/
        http://mirrors.aliyuncs.com/centos-vault/6.10/centosplus/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos-vault/6.10/centosplus/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6
 
#contrib - packages by Centos Users
[contrib]
name=CentOS-$releasever - Contrib - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.10/contrib/$basearch/
        http://mirrors.aliyuncs.com/centos-vault/6.10/contrib/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos-vault/6.10/contrib/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6
```

#### 3.清空源，并更新源

```bash
yum clean all
yum makecache
```

#### 更新open ssh

更新前使用telnet登录，防止ssh更新失败

```bash
##安装telnet 
yum install telnet-server
##  配置root 登录
vi /etc/xinetd.d/telnet

service telnet

{

        flags           = REUSE

        socket_type          = stream

        wait           = no

        user           = root

        server           = /usr/sbin/in.telnetd

        log_on_failure  += USERID

        disable           = no

}
##添加终端
vi /etc/securetty增加
pts/0
pts/1
pts/2
#重启telnet服务
/etc/init.d/xinetd restart
```

更新openssh

```bash
#github中下载未编译的版本
https://github.com/openssh/openssh-portable/releases
#生成configure文件
autoreconf
##进行编译
./configure --prefix=/usr --sysconfdir=/etc/ssh
##编译
make
##安装前先卸载旧版openssh
rpm -e --nodeps `rpm -qa | grep openssh`
## 安装ssh
make install
```

剩下的就是配置权限和服务的问题了

参考这篇博客 https://blog.csdn.net/qq_24795117/article/details/105765869

> 在重启ssh的服务的时候，有可能失败，所以最好还是配置一下telnet登录

### 参考

1. https://www.acgist.com/article/748.html
2. https://www.openssh.com/portable.html#http
3. windows启用telnet服务https://jingyan.baidu.com/article/e73e26c09f6f4724adb6a7de.html
4. https://blog.csdn.net/qq_24795117/article/details/105765869