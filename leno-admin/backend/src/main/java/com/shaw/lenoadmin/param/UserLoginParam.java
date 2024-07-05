package com.shaw.lenoadmin.param;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginParam {
    @NotBlank
    private String password;

    @NotBlank
    private String userName;

    @NotBlank
    private String uuid;

    @NotBlank
    private String code;
}
