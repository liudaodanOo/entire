package com.shaw.lenoadmin.util;

import com.shaw.lenoadmin.pojo.UserPojo;
import io.jsonwebtoken.*;
import org.springframework.util.StringUtils;

import java.util.Date;

public class JWTUtil {

    private static final String SIGN_KEY = "lenoAdmin";

    private static final long EXPIRATION = 24 * 60 * 60 * 1000;

    /**
     * 创建token
     * @param user
     * @return
     */
    public static String createToken(UserPojo user) {
        String token = Jwts.builder()
                .setSubject("leno_user")
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .claim("userId", user.getUserId())
                .claim("userName", user.getUserName())
                .signWith(SignatureAlgorithm.HS512, SIGN_KEY)
                .compressWith(CompressionCodecs.GZIP)
                .compact();

        return token;
    }

    /**
     * 从token中获取userId
     * @param token
     * @return
     */
    public static Integer getUserId(String token) {
        if (StringUtils.isEmpty(token)) {
            return null;
        }

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(SIGN_KEY).parseClaimsJws(token);
        Claims claims = claimsJws.getBody();
        Integer userId = (Integer) claims.get("userId");
        return userId;
    }

    /**
     * 从token中获取userName
     * @param token
     * @return
     */
    public static Integer getUserName(String token) {
        if (StringUtils.isEmpty(token)) {
            return null;
        }

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(SIGN_KEY).parseClaimsJws(token);
        Claims claims = claimsJws.getBody();
        Integer userId = (Integer) claims.get("userName");
        return userId;
    }
}
