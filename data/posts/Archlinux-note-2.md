---
title: Archlinux笔记(三)
date: 2016-04-20 10:22:39
tags: [Archlinux]
category: Archlinux
---

### 在 arch 下安装 google-chrome

`$ yaourt -S google-chrome`

或者从官网下载 deb 包解压

```bash
$ ar -x google-chrome-stable_current_amd64.deb
$ xz -d data.tar.xz
$ tar -xvf data.tar
$ tar -vxf control.tar.gz
```

经过 4 次解压后 进入 google-chrome 所在目录
`$ cd opt/google/chrome/`
更改 chrome-sadbox 的所有者和权限
`# chown root:root chrome-sandbox`
`# chmod 4755 chrome-sandbox`

直接运行
`$ ./google-chrome`

为 chrome 增加应用列表启动方式

`# vim /usr/share/applications/google-chrome.desktop`

```
[Desktop Entry]
Name=google-chrome
#GenericName=browser
Comment=google-chrome
Exec=path/to/my_chrome/opt/google/chrome/google-chrome
Terminal=false
Type=Application
Encoding=UTF-8
Icon=chrome
Categories=System;
Keywords=chrome;
```

### 添加主题或者图标主题

主题文件：`/usr/share/themes`

图标：`/usr/share/icons`
