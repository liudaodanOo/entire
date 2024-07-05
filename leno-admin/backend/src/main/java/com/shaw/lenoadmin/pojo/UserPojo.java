package com.shaw.lenoadmin.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@TableName("leno_user")
@Data
public class UserPojo implements Serializable {

    public static final Long serialVersionUID = 1L;

    @TableId(value = "user_id", type = IdType.AUTO)
    private Integer userId;

    @TableField("dept_id")
    private Integer deptId;

    @TableField("user_name")
    private String userName;

    @TableField("nick_name")
    private String nickName;

    @TableField("user_type")
    private char userType;

    @TableField("email")
    private String email;

    @TableField("phonenumber")
    private String phonenumber;

    @TableField("sex")
    private char sex;

    @TableField("avatar")
    private String avatar;

    @TableField("password")
    @JsonIgnore
    private String password;

    @TableField("status")
    private char status;

    @TableField("del_flag")
    private int delFlag;

    @TableField("login_ip")
    private String loginIp;

    @TableField("login_date")
    private LocalDateTime loginDate;

    @TableField("create_by")
    private String createBy;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("update_by")
    private  String updateBy;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    @TableField("remark")
    private  String remark;
}
