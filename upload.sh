
npm run generate && tar -zcvf dist.tar.gz .output/public  && scp -r ./dist.tar.gz rztggiqs:/www/wwwroot/www.novatravelexplore.com

#windows 文件压缩
tar -zcvf dist.tar.gz -C .output/public .

# 服务器上解压压缩文件
# cd /www/wwwroot/www.novatravelexplore.com && tar -zxvf dist.tar.gz

