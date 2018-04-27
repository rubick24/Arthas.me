---
title: Archlinux笔记(一)
date: 2016-04-12 08:32:30
tags: [Archlinux]
category: Archlinux
---
### 制作启动盘
[archlinux镜像下载](https://www.archlinux.org/download/)<br/>
制作工具推荐[Rufus](https://rufus.akeo.ie)<br/>

### 网络连接
从启动盘启动后，先检查网络连接

`# wifi-menu`

连接无线网络

### 分区&格式化
`# cfdisk`

`# mkfs.ext4 /dev/sdxY`

若是UEFI引导需要创建EFI系统分区并格式化为FAT32格式

`# mkfs.vfat -F32 /dev/sda1`

格式化和启用交换分区

`# mkswap /dev/<swap>`

`# swapon /dev/<swap>`

### 挂载
`# mount /dev/sdxY /mnt`

EFI系统分区挂载到/boot

`# mkdir /mnt/boot`

`# mount /dev/sda1 /mnt/boot`

### 选择镜像源
`# nano /etc/pacman.d/mirrorlist`

编辑 /etc/pacman.d/mirrorlist ，在文件的最顶端添加

`Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch`

### 安装基本系统
`# pacman -Syy`

`# pacstrap /mnt base base-devel`

### 配置fstab
`# genfstab -U /mnt >> /mnt/etc/fstab`

检查是否正确生成

`# cat /mnt/etc/fstab`

### chroot到新系统
`# arch-chroot /mnt /bin/bash`

### 基本配置

设置主机名

`# echo <computer_name> > /etc/hostname`

设置root密码

`# passwd`

设置时间

`# ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime`

`# hwclock --systohc --utc`

设置语言

`# nano /etc/locale.gen`

将`en_US.UTF-8`和`zh_CN.UTF-8`取消注释

`# locale-gen`

`# echo LANG=en_US.UTF-8 > /etc/locale.conf`

安装中文字体

`# pacman -S wqy-zenhei`

网络服务

`# systemctl enable dhcpcd.service`

### 安装引导程序
`# pacman -S grub`

UEFI引导 `# grub-install --target=x86_64-efi --efi-directory=/boot`

MBR引导 `# grub-install --recheck /dev/sda`

如果存在其他系统 需安装os-prober

`# grub-mkconfig -o /boot/grub/grub.cfg`

### 卸载分区并重启
`# exit`

`# umount -R /mnt`

`# reboot`

参考:[https://wiki.archlinux.org/index.php/Installation_guide](https://wiki.archlinux.org/index.php/Installation_guide)
