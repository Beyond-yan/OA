
package com.gdssoft.oa.util;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 去掉文本
 * @author lxwhappy
 *
 */
public class StringUtil {

	public static String  replaceBlank(String str)
	{
		Pattern p = Pattern.compile("\\s*|\t|\r|\n");
		Matcher m = p.matcher(str);
		String after = m.replaceAll("");
		return after;
	}
	public static String getNo(String no){
		if(no.indexOf("〔")!=-1){
			return no.split("〔")[0].trim();
		}else if(no.indexOf("(")!=-1){
			return no.split("(")[0].trim();
		}else {
			return no.replaceAll("[^\u4e00-\u9fa5]", "").trim();
		}
	}

	public static Integer nullObject2Integer(Object obj){
		if(obj==null||obj.equals("")){
			return 0;
		}else{
			return new Integer(obj.toString());
		}
	}
	public static Short nullObject2Short(Object obj){
		if(obj==null||obj.equals("")){
			return 0;
		}else{
			return new Short(obj.toString());
		}
	}
	public static String nullObject2String(Object obj){
		if(obj==null||obj.equals("")){
			return "";
		}else{
			return obj.toString();
		}
	}
}
