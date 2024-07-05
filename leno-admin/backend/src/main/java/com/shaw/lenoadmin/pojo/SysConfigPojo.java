package com.shaw.lenoadmin.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@TableName("sys_config")
@Data
public class SysConfigPojo implements Serializable {

    public static final Long serialVersionUID = 1L;

    @TableId(value = "config_id", type = IdType.AUTO)
    private Integer configId;

    @TableField("config_key")
    private String configKey;

    @TableField("config_value")
    private String configValue;

    @TableField("config_type")
    private String configType;

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
