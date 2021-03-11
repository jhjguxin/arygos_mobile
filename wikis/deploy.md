# 部署

unicloud 支持云发布


## H5 部署

unicloud 有云空间可以用于发布 h5, 也可以自行上传打包好的文件到自建服务器

```shell
ssh -p 40022 crm_deploy@crm-private.ikcrm.com "rm -rf /data0/crm_deploy/arygos_h5_staging/*"
scp -r -P40022 unpackage/dist/build/h5/* crm_deploy@crm-private.ikcrm.com:/data0/crm_deploy/arygos_h5_staging/
```
