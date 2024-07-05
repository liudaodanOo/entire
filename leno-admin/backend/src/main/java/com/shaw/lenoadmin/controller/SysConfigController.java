package com.shaw.lenoadmin.controller;

import com.shaw.lenoadmin.param.SysConfigKeyParam;
import com.shaw.lenoadmin.service.SysConfigService;
import com.shaw.lenoadmin.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system/config")
public class SysConfigController {

    @Autowired
    private SysConfigService sysConfigService;

    @PostMapping("/configKey")
    public Result<String> configKey(@RequestBody SysConfigKeyParam param) {
        return sysConfigService.configKey(param);
    }
}
