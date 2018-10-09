package com.gdssoft.core.util;


import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Properties;

public class PropertiesFileUtil {
	private static Properties config = null;
	private static String dirverType;
	
	static {
		  InputStream in = PropertiesFileUtil.class.getClassLoader().getResourceAsStream(
		    "conf/config.properties");
		  config = new Properties();
		  try {
		   config.load(in);
		   String value = config.getProperty("archive.tidyType");
		   dirverType = value;
		   System.out.println("--------dirverType-------:"+dirverType);
		   in.close();
		  } catch (IOException e) {
		   System.out.println("No AreaPhone.properties defined error");
		  }
		 }

	// 根据key读取value
	 public static String readValue(String key) {
	  // Properties props = new Properties();
	  try {
	   String value = config.getProperty(key);
	   return value;
	  } catch (Exception e) {
	   e.printStackTrace();
	   System.err.println("ConfigInfoError" + e.toString());
	   return null;
	  }
	 }
	// 读取properties的全部信息
	 public static void readAllProperties() {
	  try {

	   Enumeration en = config.propertyNames();
	   while (en.hasMoreElements()) {
	    String key = (String) en.nextElement();
	    String Property = config.getProperty(key);
	    System.out.println(key + Property);
	   }
	  } catch (Exception e) {
	   e.printStackTrace();
	   System.err.println("ConfigInfoError" + e.toString());
	  }
	 }

	 
	public static String getDirverType() {
		return dirverType;
	}
	public static void setDirverType(String dirverType) {
		PropertiesFileUtil.dirverType = dirverType;
	}
	
	/**
	  * 获取公文归档类型
	 * @return
	 */
	public static String getArchiveTidyType(){
		 String archiveTidyType=(String)readValue("archive.tidyType");
		 return archiveTidyType;
	 }
	/**
	  * 获取公文归档全宗号
	 * @return
	 */
	public static String getArchFondNo(){
		 String archiveAfNo=(String)readValue("archive.afNo");
		 return archiveAfNo;
	 }
	/**
	  * 获取公文归档案卷号
	 * @return
	 */
	public static String getArchRollNo(){
		 String archiveRollNo=(String)readValue("archive.rollNo");
		 return archiveRollNo;
	 }
	/**
	  * 获取公文归档案id
	 * @return
	 */
	public static String getArchRollId(){
		 String archiveRollId=(String)readValue("archive.rollId");
		 return archiveRollId;
	 }
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(PropertiesFileUtil.readValue("mysql.driverClassName"));
	}

}
