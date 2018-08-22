---
title: Archlinux笔记(二)
date: 2016-04-12 18:24:50
tags: [Archlinux]
category: Archlinux
---
### 添加用户
使用`useradd`命令
```
# useradd -m -g users -G wheel -s /bin/bash username
```
`# vim /etc/sudoers`

取消`%wheel ALL=(root)  ALL`的注释

设置密码

`# passwd username`


### 安装桌面环境xfce
安装显卡驱动

`# lspci | grep VGA`    --确定显卡型号
`# pacman -S <驱动包>`
 官方仓库提供的驱动包：



|                      |        开源        |     私有      |
| :-------------------:|:-----------------:|:-------------:|
|         通用          |   xf86-video-vesa  |              |
|         Intel        |  xf86-video-intel  |              |
|    Nvdia GeForce 7+  |                    |    nvidia    |
|    Nvdia GeForce 6/7 |                    | nvidia-304xx |
|       AMD/ATI        |   xf86-video-ati   |              |

`# pacman -S xorg-server xorg-xinit gdm`

`# systemctl enable gdm.service`

`$ vim ~/.xinitrc`

在文件底部添加 `exec startxfce4`

### 安装zsh
`# pacman -S zsh`

`$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`

`$ chsh -s /bin/zsh`

配置zsh

`$ vim ~/.zshrc`

保存后运行`$ source ~/.zshrc`使配置立即生效

语法高亮

`$ cd ~/.oh-my-zsh/custom/plugins`

`$ git clone git://github.com/zsh-users/zsh-syntax-highlighting.git`

在`.zshrc`的`plugins`中增加 `zsh-syntax-highlighting`

### 使用archlinuxcn源并安装yaourt
`# vim /etc/pacman.conf`
```
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```
`# pacman -S archlinuxcn-keyring`

`# pacman -S yaourt`