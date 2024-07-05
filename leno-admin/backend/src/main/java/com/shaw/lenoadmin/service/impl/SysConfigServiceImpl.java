package com.shaw.lenoadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shaw.lenoadmin.mapper.SysConfigMapper;
import com.shaw.lenoadmin.param.SysConfigKeyParam;
import com.shaw.lenoadmin.pojo.SysConfigPojo;
import com.shaw.lenoadmin.service.SysConfigService;
import com.shaw.lenoadmin.util.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class SysConfigServiceImpl extends ServiceImpl<SysConfigMapper, SysConfigPojo> implements SysConfigService {

    /**
     * 根据key查询配置的值
     * @param param
     * @return
     */
    @Override
    public Result<String> configKey(SysConfigKeyParam param) {
        QueryWrapper<SysConfigPojo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("config_key", param.getKey());

        List<SysConfigPojo> configList = list(queryWrapper);
        SysConfigPojo sysConfigPojo = configList.get(0);

        return Result.ok(sysConfigPojo.getConfigValue());
    }
}
