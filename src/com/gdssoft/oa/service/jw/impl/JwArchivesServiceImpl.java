package com.gdssoft.oa.service.jw.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.WordSegmentTool;
import com.gdssoft.oa.dao.jw.JwArchivesDao;
import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.jw.JwArchivesService;
import com.gdssoft.oa.service.jw.JwRecArchivesService;

public class JwArchivesServiceImpl extends BaseServiceImpl<JwArchives> implements JwArchivesService{
	@SuppressWarnings("unused")
	public static final String HOST = "http://10.224.5.183:8080/cq_search";
	public static final String SCORE = "JW_ARCHIVES";
	public static final String QT = "select";
	public static final String SHEADER = HOST + "/" + SCORE + "/" + QT;
	public static String EMPTY_RESULT = "[]";

	private JwArchivesDao dao;
	
	public JwArchivesServiceImpl(JwArchivesDao dao) {
		super(dao);
		this.dao=dao;
	}

	/**
	 * 调用搜索引擎获取数据
	 */
	@Override
	public List<JwArchives> getJwArchives(final Long userId,
			final String subject, final String depName, final String startDate,
			final String endDate, final int currentPage, final int pageSize,
			final String docnum, final String doctype, final String burden) {

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(userId, subject,
							depName, docnum, doctype, startDate, endDate,burden);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&start=" + currentPage + "&rows=" + (pageSize)
				+ "&wt=json&indent=true";
		String result = null;
		try {
			result = call(url);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JSONObject all = JSONObject.fromObject(result);
		// 解析一般下获取response节点
		JSONObject res = all.getJSONObject("response");
		// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
		int total = res.getInt("numFound");
		// 获取最终结果
		JSONArray docs = res.getJSONArray("docs");
		List<JwArchives> resultList = tranFromJSONObject(docs);
		return resultList;
	}

	/**
	 * 调用搜索引擎获取收发文待办及在办件查出总数
	 * 
	 * @return
	 */
	@Override
	public int count(final Long userId, final String subject,
			final String depName, final String startDate, final String endDate,
			final String docnum, final String doctype, final String burden) {

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(userId, subject,
							depName, docnum, doctype, startDate, endDate,burden);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&start=" + 0 + "&rows=" + 10
				+ "&wt=json&indent=true";
		String result = null;
		try {
			result = call(url);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JSONObject all = JSONObject.fromObject(result);
		// 解析一般下获取response节点
		JSONObject res = all.getJSONObject("response");
		// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
		int total = res.getInt("numFound");
		// 获取最终结果
		int count = total;
		return count;
	}

	public static String call(String url) throws IOException {
		// 創建一個鏈接遠端服務的客戶端
		HttpURLConnection httpurlconnection = null;
		// String temourl=java.net.URLEncoder.encode(url.toString(),
		// "ISO-8859-1");
		// URL my_url = new URL(temourl);
		URL my_url = new URL(url);
		httpurlconnection = (HttpURLConnection) my_url.openConnection();
		httpurlconnection.setDoOutput(true);
		httpurlconnection.setRequestMethod("GET");
		httpurlconnection.setRequestProperty("Content-type",
				"text/xml; charset=UTF-8");
		// 接受結果
		BufferedReader br = new BufferedReader(new InputStreamReader(
				httpurlconnection.getInputStream(), "UTF-8"));
		StringBuilder stringBulider = new StringBuilder();
		String linerep = null;
		while ((linerep = br.readLine()) != null) {
			stringBulider.append(linerep);
		}
		br.close();
		br = null;
		return stringBulider.toString();
	}

	private String getParamForQuerySubjectAndDocnum(Long userId,
			String subject, String depName, String docnum, String doctype,
			String startDate, String endDate,String burden)
			throws UnsupportedEncodingException {
		WordSegmentTool wordSegmentTool=new WordSegmentTool();
		StringBuffer param = new StringBuffer();
		AppUser user = ContextUtil.getCurrentUser();
		boolean isAdmin = false;
		Set<AppRole> roles = user.getRoles();
		for (AppRole role : roles) {
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
				logger.info("当前用户具有系统超级管理员");
				break;
			}
		}
		String AND = " AND ";
		String TO = " TO ";
		param.append("q=");
		param.append("*:*");
		if (null != subject && !"".equals(subject)) {
			String putWord="";
			try {
				putWord=wordSegmentTool.segmentWord(subject);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("subject:");
			param.append(java.net.URLEncoder.encode(putWord, "utf-8"));
		}
		if (null != depName && !"".equals(depName)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("sourcedepartment:");
			param.append(java.net.URLEncoder.encode(depName, "utf-8"));
		}
		if (null != docnum && !"".equals(docnum)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("docnum:");
			param.append(java.net.URLEncoder.encode(docnum, "utf-8"));
		}
		if (null != doctype && !"".equals(doctype)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("doctype:");
			param.append(java.net.URLEncoder.encode(doctype, "utf-8"));
		}
		if (null != burden && !"".equals(burden)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("burden:");
			param.append(java.net.URLEncoder.encode(burden, "utf-8"));
		}
		if (null != startDate && !"".equals(startDate) && null != endDate
				&& !"".equals(endDate)) {
			String str = startDate + "T00:00:00";
			String end = endDate + "T00:00:00";
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("day:[");
			param.append(java.net.URLEncoder.encode(str, "utf-8"));
			param.append(java.net.URLEncoder.encode(TO, "utf-8"));
			param.append(java.net.URLEncoder.encode(end, "utf-8"));
			param.append("]");
		}
		return param.toString();
	}

	/* 把搜索引擎查到的数据添加进新的model中 */
	private static List<JwArchives> tranFromJSONObject(JSONArray array) {
		List<JwArchives> archs = new ArrayList<JwArchives>();
		for (int i = 0; i < array.size(); i++) {
			JwArchives arch = new JwArchives();
			try {
				JSONObject json = array.getJSONObject(i);
				arch.setBumfyear(getValueByName(json, "bumfyear"));
				arch.setSubject(getValueByName(json, "subject"));
				arch.setSourcedepartment(getValueByName(json,
						"sourcedepartment"));
				arch.setId(new Long(getValueByName(json, "id")));
				arch.setDocnum(getValueByName(json, "docnum"));
				arch.setDoctype(getValueByName(json, "doctype"));
				arch.setBurden(getValueByName(json, "burden"));
				arch.setDay(getValueByName(json, "day"));
				arch.setKeywords(getValueByName(json, "keywords"));
				arch.setAttachcode(getValueByName(json, "attachcode"));
				archs.add(arch);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return archs;
	}

	// 獲取屬性的值
	public static String getValueByName(JSONObject json, String pName) {
		String result = "";
		try {
			if (json != null) {
				result = json.getString(pName);
			}
		}
		// 處理異常
		catch (Exception e) {
			result = "";
		} finally {
			return result;
		}
	}


}