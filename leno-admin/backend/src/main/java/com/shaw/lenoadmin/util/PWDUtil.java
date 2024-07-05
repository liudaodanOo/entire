package com.shaw.lenoadmin.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PWDUtil {

    // 创建BCryptPasswordEncoder对象
    private static BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();;

    public static String encode(String rawPwd) {
        String encodedPwd = encoder.encode(rawPwd);

        return encodedPwd;
    }

    public static boolean compare(String rawPwd, String encodedPwd) {
        return encoder.matches(rawPwd, encodedPwd);
    }
}
