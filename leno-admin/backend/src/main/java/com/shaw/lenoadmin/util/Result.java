package com.shaw.lenoadmin.util;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    private Integer code;

    private String message;

    private T result;

    public static Result ok() {
        return new Result(200, "操作成功", null);
    }

    public static <M> Result ok(M result) {
        return new Result<M>(200, "操作成功", result);
    }

    public static <M> Result ok(String message, M result) {
        return new Result<M>(200, message, result);
    }

    public static Result fail(Integer code, String message) {
        return new Result(code, message, null);
    }
}
