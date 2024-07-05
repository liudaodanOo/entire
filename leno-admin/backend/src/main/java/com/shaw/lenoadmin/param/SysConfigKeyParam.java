package com.shaw.lenoadmin.param;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SysConfigKeyParam {

    @NotBlank
    private String key;
}
