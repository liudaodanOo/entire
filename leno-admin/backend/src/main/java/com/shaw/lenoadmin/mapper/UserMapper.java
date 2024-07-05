package com.shaw.lenoadmin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shaw.lenoadmin.pojo.UserPojo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<UserPojo> {
}
