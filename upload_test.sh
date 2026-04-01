
npm run build && tar -zcvf dist.tar.gz .output/public  && scp -r ./dist.tar.gz projectdev:/www/wwwroot/ntweb.xgdlandlink.shop

# 服务器上解压压缩文件
# cd /www/wwwroot/ntweb.xgdlandlink.shop && tar -zxvf dist.tar.gz

