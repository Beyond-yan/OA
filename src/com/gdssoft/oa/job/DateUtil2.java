package com.gdssoft.oa.job;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.MissingResourceException;

import javax.print.CancelablePrintJob;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * Date Utility Class used to convert Strings to Dates and Timestamps
 * 
 * @author <a href="mailto:matt@raibledesigns.com">Matt Raible</a> Modified by
 *         <a href="mailto:dan@getrolling.com">Dan Kibler </a> to correct time
 *         pattern. Minutes should be mm not MM (MM is month).
 */
public class DateUtil2 {
	private static Log log = LogFactory.getLog(DateUtil2.class);
	private static final String TIME_PATTERN = "HH:mm";
	
	/** 完整时间 yyyy-MM-dd */
    public static final String dtSimple = "yyyy-MM-dd";
    
    public static final String dtSimpleYmdhms = "yyyy-MM-dd HH:mm:ss";

	/**
	 * Checkstyle rule: utility classes should not have public constructor
	 */
	private DateUtil2() {
	}

	/**
	 * Return default datePattern (MM/dd/yyyy)
	 * 
	 * @return a string representing the date pattern on the UI
	 */
	public static String getDatePattern() {
		Locale locale = LocaleContextHolder.getLocale();
		String defaultDatePattern;
		try {
			defaultDatePattern = "MM/dd/yyyy";
			// defaultDatePattern =
			// ResourceBundle.getBundle(Constants.BUNDLE_KEY,
			// locale).getString("date.format");
		} catch (MissingResourceException mse) {
			defaultDatePattern = "MM/dd/yyyy";
		}

		return defaultDatePattern;
	}

	public static String getDateTimePattern() {
		return DateUtil2.getDatePattern() + " HH:mm:ss.S";
	}

	/**
	 * This method attempts to convert an Oracle-formatted date in the form
	 * dd-MMM-yyyy to mm/dd/yyyy.
	 * 
	 * @param aDate
	 *            date from database as a string
	 * @return formatted string for the ui
	 */
	public static String getDate(Date aDate) {
		SimpleDateFormat df;
		String returnValue = "";

		if (aDate != null) {
			df = new SimpleDateFormat(getDatePattern());
			returnValue = df.format(aDate);
		}

		return (returnValue);
	}

	/**
	 * This method generates a string representation of a date/time in the
	 * format you specify on input
	 * 
	 * @param aMask
	 *            the date pattern the string is in
	 * @param strDate
	 *            a string representation of a date
	 * @return a converted Date object
	 * @see java.text.SimpleDateFormat
	 * @throws ParseException
	 *             when String doesn't match the expected format
	 */
	public static Date convertStringToDate(String aMask, String strDate)
			throws ParseException {
		SimpleDateFormat df;
		Date date;
		df = new SimpleDateFormat(aMask);

		if (log.isDebugEnabled()) {
			log.debug("converting '" + strDate + "' to date with mask '"
					+ aMask + "'");
		}

		try {
			date = df.parse(strDate);
		} catch (ParseException pe) {
			// log.error("ParseException: " + pe);
			throw new ParseException(pe.getMessage(), pe.getErrorOffset());
		}

		return (date);
	}

	/**
	 * This method returns the current date time in the format: MM/dd/yyyy HH:MM
	 * a
	 * 
	 * @param theTime
	 *            the current time
	 * @return the current date/time
	 */
	public static String getTimeNow(Date theTime) {
		return getDateTime(TIME_PATTERN, theTime);
	}

	/**
	 * This method returns the current date in the format: MM/dd/yyyy
	 * 
	 * @return the current date
	 * @throws ParseException
	 *             when String doesn't match the expected format
	 */
	public static Calendar getToday() throws ParseException {
		Date today = new Date();
		SimpleDateFormat df = new SimpleDateFormat(getDatePattern());

		// This seems like quite a hack (date -> string -> date),
		// but it works ;-)
		String todayAsString = df.format(today);
		Calendar cal = new GregorianCalendar();
		cal.setTime(convertStringToDate(todayAsString));

		return cal;
	}

	/**
	 * This method generates a string representation of a date's date/time in
	 * the format you specify on input
	 * 
	 * @param aMask
	 *            the date pattern the string is in
	 * @param aDate
	 *            a date object
	 * @return a formatted string representation of the date
	 * 
	 * @see java.text.SimpleDateFormat
	 */
	public static String getDateTime(String aMask, Date aDate) {
		SimpleDateFormat df = null;
		String returnValue = "";

		if (aDate == null) {
			log.error("aDate is null!");
		} else {
			df = new SimpleDateFormat(aMask);
			returnValue = df.format(aDate);
		}

		return (returnValue);
	}

	/**
	 * This method generates a string representation of a date based on the
	 * System Property 'dateFormat' in the format you specify on input
	 * 
	 * @param aDate
	 *            A date to convert
	 * @return a string representation of the date
	 */
	public static String convertDateToString(Date aDate) {
		return getDateTime(getDatePattern(), aDate);
	}

	/**
	 * This method converts a String to a date using the datePattern
	 * 
	 * @param strDate
	 *            the date to convert (in format MM/dd/yyyy)
	 * @return a date object
	 * @throws ParseException
	 *             when String doesn't match the expected format
	 */
	public static Date convertStringToDate(String strDate)
			throws ParseException {
		Date aDate = null;

		try {
			if (log.isDebugEnabled()) {
				log.debug("converting date with pattern: " + getDatePattern());
			}

			aDate = convertStringToDate(getDatePattern(), strDate);
		} catch (ParseException pe) {
			log.error("Could not convert '" + strDate
					+ "' to a date, throwing exception");
			pe.printStackTrace();
			throw new ParseException(pe.getMessage(), pe.getErrorOffset());
		}

		return aDate;
	}

	public static Date StringToDate(String time) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		Date date = null;
		try {
			date = simpleDateFormat.parse(time);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return date;
	}

	public static String DateToString(Date time, String type) {
		SimpleDateFormat simpleDateFormat = null;
		if (type == null) {
			simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		} else {
			simpleDateFormat = new SimpleDateFormat(type);
		}
		String dateTime = null;
		dateTime = simpleDateFormat.format(time);
		return dateTime;
	}
	
	

	public static Date StringToDatePart(String time, String type) {
		SimpleDateFormat simpleDateFormat = null;
		if (type == null) {
			simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		} else {
			simpleDateFormat = new SimpleDateFormat(type);
		}
		Date date = null;
		try {
			date = simpleDateFormat.parse(time);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * method 将字符串类型的日期转换为一个timestamp（时间戳记java.sql.Timestamp）
	 * 
	 * @param dateString
	 *            需要转换为timestamp的字符串
	 * @return dataTime timestamp
	 */
	public final static Date convertString2Time(String dateString)
			throws java.text.ParseException {
		DateFormat dateFormat;
		dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
		dateFormat.setLenient(false);
		java.util.Date timeDate = dateFormat.parse(dateString);// util类型
		// Timestamp dateTime = new Timestamp(timeDate.getTime());//
		// Timestamp类型,timeDate.getTime()返回一个long型
		return timeDate;
	}

	/**
	 * method 将字符串类型的日期按照转换为一个timestamp（时间戳记java.sql.Timestamp）
	 * 
	 * @param dateString
	 *            需要转换为timestamp的字符串
	 * @param formaterString
	 *            dateString字符串的解析格式
	 * @return
	 * @throws java.text.ParseException
	 */
	public final static java.sql.Timestamp string2Time(String dateString)
			throws java.text.ParseException {
		DateFormat dateFormat;
		// dateFormat = new SimpleDateFormat(formaterString);// 设定格式
		dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
		dateFormat.setLenient(false);
		java.util.Date timeDate = dateFormat.parse(dateString);// util类型
		java.sql.Timestamp dateTime = new java.sql.Timestamp(timeDate.getTime());// Timestamp类型,timeDate.getTime()返回一个long型
		return dateTime;
	}

	public static Integer getDayOfMonth() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.DAY_OF_MONTH);
	}

	public static Integer getWeekOfYear() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.WEEK_OF_YEAR);
	}

	public static Integer getMonthOfYear() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.MONTH) + 1;
	}

	public static Integer getYear() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.YEAR);
	}

	public static Integer getlastWeek() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.WEEK_OF_YEAR, -1);
		return calendar.get(Calendar.WEEK_OF_YEAR);
	}

	/**
	 * 
	 * 昨天
	 * 
	 * @return
	 */
	public static Date getThisYesterday() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_YEAR, -1);
		return StringToDatePart(DateToString(calendar.getTime(), null), null);
	}

	/**
	 * 这个星期的第几天
	 * 
	 * @return
	 */
	public static Integer getDayOfWeek() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.DAY_OF_WEEK);
	}

	/**
	 * 
	 * 上月一号
	 * 
	 * @return
	 */
	public static Date getLastMonthOneDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(calendar.MONTH, -1);
		calendar.set(calendar.DAY_OF_MONTH, 1);
		return StringToDatePart(DateToString(calendar.getTime(), null), null);
	}

	/**
	 * 
	 * 上月底(即这个月初)
	 * 
	 * @return
	 */
	public static Date getLastMonthLastDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.DAY_OF_MONTH, 1);
		return StringToDatePart(DateToString(calendar.getTime(), null), null);
	}

	/**
	 * 上个星期一
	 * 
	 * @return
	 */
	public static Date getWeekFirstDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.DAY_OF_WEEK, 2);
		calendar.add(calendar.WEEK_OF_YEAR, -1);
		return StringToDatePart(DateToString(calendar.getTime(), null), null);

	}

	/**
	 * 
	 * 上周是第几周
	 * 
	 * @return
	 */
	public static Integer getlastWeekOfYear() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.WEEK_OF_YEAR, -2);
		return calendar.get(Calendar.WEEK_OF_YEAR);
	}

	public static Date getLasthourTime() {
		long curTime = new Date().getTime();
		long lastHourTime = curTime - (60 * 60 * 1000);
		Date date = new Date(lastHourTime);
		return date;

	}

	public static Date StringToDateTime(String time) {
		SimpleDateFormat simpleDateFormat = null;

		simpleDateFormat = new SimpleDateFormat(TIME_PATTERN);

		Date date = null;
		try {
			date = simpleDateFormat.parse(time);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * 
	 * 上个月有多少天
	 * 
	 * @return
	 */
	public static Integer getLastMonthAllDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.DAY_OF_MONTH, -1);
		return calendar.getActualMaximum(Calendar.DATE);
	}
	
	/**
	 * 
	 * 获取当前时间的time
	 * 
	 * @param time 13:00
	 * @return
	 */
	public static long getTimeOut(String time) {
		String[] times= time.split(":");
		long timeout=Integer.valueOf(times[0])*3600000+ (Integer.valueOf(times[1])*60000);
		return timeout;

	}
	
	public static Date getLastMonth(){
		Calendar calendar=Calendar.getInstance();
		calendar.add(calendar.MONTH, -1);
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM");
		String time= simpleDateFormat.format(calendar.getTime());
		Date curDate=null;
		try {
			curDate = simpleDateFormat.parse(time);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	     return curDate;
	}
	
	/**
     * 日期加月
     * 
     * @param date
     * @param months
     * @return
     */
    public static Date getDateByMonth(Date date, int months) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, months);
        return calendar.getTime();
    }
    
    public static final String dtSimple(Date date) {
        if (date == null) {
            return "";
        }
        return new SimpleDateFormat(dtSimple).format(date);
    }
    
    public static final String dtSimpleYmdhms(Date date) {
        if (date == null) {
            return "";
        }
        return new SimpleDateFormat(dtSimpleYmdhms).format(date);
    }
    
    /**
     * 获得一天的开始时间
     * 
     * @param date
     * @return
     */
    public static Date getStartTimeOfTheDate(Date date) {
        if(date == null) {
            return null;
        } else {
            Calendar c = Calendar.getInstance();
            c.setTime(date);
            c.set(11, 0);
            c.set(12, 0);
            c.set(13, 0);
            c.set(14, 0);
            return c.getTime();
        }
    }

    /**
     * 获得一天的结束时间
     * 
     * @param date
     * @return
     */
    public static Date getEndTimeOfTheDate(Date date) {
        if(date == null) {
            return null;
        } else {
            Calendar c = Calendar.getInstance();
            c.setTime(date);
            c.set(11, 23);
            c.set(12, 59);
            c.set(13, 59);
            c.set(14, 0);
            return c.getTime();
        }
    }

	public static void main(String[] args) {
		System.out.println("=====" + getDayOfMonth());
		System.out.println("=====" + getWeekOfYear());
		System.out.println("=====" + getYear());
		System.out.println("=====" + getMonthOfYear());
		System.out.println("=====" + getThisYesterday());
		System.out.println("====wwww=" + getlastWeekOfYear());
		System.out.println("=====" + getLastMonthOneDay());
		System.out.println("=11111111111====" + getLastMonth());
		try {
			System.out.println("=22222222222====" + convertString2Time("2011-05-26 15:25:00"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// String firstDay = "2010-10-10";
		//
		// String lastDay = "2010-11-10";
		// Calendar calendar1 = Calendar.getInstance();
		// Calendar calendar2 = Calendar.getInstance();
		// calendar1.setTime(StringToDatePart(firstDay, null));
		// calendar2.setTime(StringToDatePart(lastDay, null));
		// System.out.println("=====" + calendar1.compareTo(calendar2));
		// while (calendar1.compareTo(calendar2) < 0) {
		// calendar1.add(calendar1.DATE, 1);
		// System.out.println("-------"
		// + DateToString(calendar1.getTime(), null));
		//
		// }
		System.out.println("=============" + System.currentTimeMillis());
		System.out.println("=============" + new Date().getTime());
		System.out.println("=============" + getTimeOut("1:30"));
		try {
			System.out.println("=============" + convertString2Time("1970-1-1 01:30:00").getTime());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
