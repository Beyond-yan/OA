package com.gdssoft.core.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;

public class ApiUtils {
	private static Logger logger = Logger.getLogger(ApiUtils.class);
	
	
	public static String parseString(Object obj){
		String result = null;
		if(obj != null){
			result = String.valueOf(obj);
			if("".equals(result)){
				result = null;
			}
		}
		return result;
	}
	
	public static Long parseLong(Object obj){
		Long result = null;
		String s = parseString(obj);
		if(s != null){
			result = Long.valueOf(s);
		}
		return result;
	}
	
	public static Integer parseInteger(Object obj){
		Integer result = null;
		String s = parseString(obj);
		if(s != null){
			result = Integer.valueOf(s);
		}
		return result;
	}
	
	public static Date parseDateTime(Object obj){
		Date result = null;
		String s = parseString(obj);
		if(s != null){
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				result = format.parse(s);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	public static Date parseDate(Object obj){
		Date result = null;
		String s = parseString(obj);
		if(s != null){
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			try {
				result = format.parse(s);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	public static String parseDateStr(Object obj){
		String result = null;
		if(obj != null){
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			result = format.format(obj);
		}
		return result;
	}
	public static String parseDateTimeStr(Object obj){
		String result = null;
		if(obj != null){
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			result = format.format(obj);
		}
		return result;
	}
	
	//得到当前时间 2011-01-12 12:20:20
	public static Date getNowDateTime() {
		return new Timestamp(System.currentTimeMillis());
	} 
	public static void clearTime(Calendar calendar) {
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
	}
	//得到当前时间 如：2011-01-12 00:00:00
	public static Date getNowDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(System.currentTimeMillis());
		clearTime(calendar);
		return new Timestamp(calendar.getTimeInMillis());
	}
	/**
	 * 获取相差天数的日期
	 * @param date
	 * @param days 正数表示后几天日期，负责表示前几天日期
	 * @return
	 */
	public static Date getDateOfDays(Date date, int days){
		Calendar cal = Calendar.getInstance();  
        cal.setTime(date);  
        cal.add(Calendar.DAY_OF_YEAR, days);  
        return cal.getTime();
	}
	
	public static int getWeekOfDate(Date dt) {
//        String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Calendar cal = Calendar.getInstance();
        cal.setTime(dt);
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
        if (w < 0)
            w = 0;
//        return weekDays[w];
        return w;
    }
	
	public static void main(String[] args) {
		Date d  = getWeekBeginDate();
		System.out.println(getDateOfDays(d, 7));
	}
	
	/**
	 * 判断是否为数字
	 * @param str
	 * @return
	 */
	public static boolean isNumeric(String str){ 
		Pattern pattern = Pattern.compile("[0-9]*"); 
		Matcher isNum = pattern.matcher(str);
		if( !isNum.matches() ){
			return false; 
		} 
		return true; 
	}
	
	public static Date getWeekBeginDate(){
		int mondayPlus;
		Calendar cd = Calendar.getInstance();
		// 获得今天是一周的第几天，星期日是第一天，星期二是第二天......
		int dayOfWeek = cd.get(Calendar.DAY_OF_WEEK) - 1; // 因为按中国礼拜一作为第一天所以这里减1
		if (dayOfWeek == 1) {
			mondayPlus = 0;
		} else {
			mondayPlus = 1 - dayOfWeek;
		}
		
		return getDateOfDays(getNowDate(), mondayPlus);
	}
}
