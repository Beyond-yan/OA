package com.gdssoft.core.log;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.net.SyslogAppender;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * @author: lgaoyi
 * @date: 2018/5/7 22:06
 */
public class CustomerLog {
    /**
     * 继承Level
     *
     * @author Sevencm
     */
    private static class CustomerLogLevel extends Level {
        public CustomerLogLevel(int level, String levelStr, int syslogEquivalent) {
            super(level, levelStr, syslogEquivalent);
        }
    }

    /**
     * 自定义级别名称，以及级别范围
     */
    private static final Level CustomerLevel = new CustomerLogLevel(20050, "CUSTOMER", SyslogAppender.LOG_LOCAL0);

    /**
     * 使用日志打印logger中的log方法
     *
     * @param logger
     * @param objLogInfo
     */
    public static void customerLog(Logger logger, Object objLogInfo) {
        if (objLogInfo instanceof  Throwable) {
            logger.log(CustomerLevel, getStackTraceAsString((Throwable) objLogInfo));
            return;
        }
        logger.log(CustomerLevel, objLogInfo);
    }

    /**
     * 将ErrorStack转化为String.
     */
    public static String getStackTraceAsString(Throwable e) {
        if (e == null){
            return "";
        }
        StringWriter stringWriter = new StringWriter();
        e.printStackTrace(new PrintWriter(stringWriter));
        return stringWriter.toString();
    }
}
