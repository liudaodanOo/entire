package com.shaw.lenoadmin.controller;

import com.shaw.lenoadmin.param.UserLoginParam;
import com.shaw.lenoadmin.vo.CaptchaVo;
import com.shaw.lenoadmin.service.UserService;
import com.shaw.lenoadmin.util.Result;
import com.shaw.lenoadmin.vo.UserLoginVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    /**
     * 获取验证码
     * @return
     */
    @GetMapping("/captchaImage")
    public Result<CaptchaVo> captcha() {
        return userService.captcha();
    }

    @PostMapping("/login")
    public Result<UserLoginVo> login(@RequestBody UserLoginParam param) {
        return userService.login(param);
    }

}
