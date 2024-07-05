package com.shaw.lenoadmin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.shaw.lenoadmin.param.UserLoginParam;
import com.shaw.lenoadmin.vo.CaptchaVo;
import com.shaw.lenoadmin.pojo.UserPojo;
import com.shaw.lenoadmin.util.Result;
import com.shaw.lenoadmin.vo.UserLoginVo;

public interface UserService extends IService<UserPojo> {

    /**
     * 获取验证码信息
     * @return
     */
    Result<CaptchaVo> captcha();

    /**
     * 用户登录
     * @param param
     * @return
     */
    Result<UserLoginVo> login(UserLoginParam param);
}
