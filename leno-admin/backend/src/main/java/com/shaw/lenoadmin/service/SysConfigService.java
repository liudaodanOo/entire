package com.shaw.lenoadmin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.shaw.lenoadmin.param.SysConfigKeyParam;
import com.shaw.lenoadmin.pojo.SysConfigPojo;
import com.shaw.lenoadmin.util.Result;
import org.springframework.stereotype.Service;

@Service
public interface SysConfigService extends IService<SysConfigPojo> {

    /**
     * 根据key查询配置的值
     * @param param
     * @return
     */
    Result<String> configKey(SysConfigKeyParam param);

}
