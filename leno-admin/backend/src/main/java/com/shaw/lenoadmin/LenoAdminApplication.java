package com.shaw.lenoadmin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude= {SecurityAutoConfiguration.class })
@MapperScan(basePackages = {"com.shaw.lenoadmin.mapper"})
public class LenoAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(LenoAdminApplication.class, args);
    }
}
