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
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.WordSegmentTool;
import com.gdssoft.oa.dao.jw.JwArchivesDao;
import com.gdssoft.oa.dao.jw.JwRecArchivesDao;
import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.model.jw.JwRecArchives;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.jw.JwRecArchivesService;

public class JwRecArchivesServiceImpl extends BaseServiceImpl<JwRecArchives> implements JwRecArchivesService{
	@SuppressWarnings("unused")
	public static final String HOST = "http://10.224.5.183:8080/cq_search";
	public static final String SCORE = "JW_REC_ARCHIVES";
	public static final String QT = "select";
	public static final String SHEADER = HOST + "/" + SCORE + "/" + QT;
	public static String EMPTY_RESULT = "[]";

	private JwRecArchivesDao dao;
	
	public JwRecArchivesServiceImpl(JwRecArchivesDao dao) {
		super(dao);
		this.dao=dao;
	}

	/**
	 * 调用搜索引擎获取数据
	 */
	@Override
	public List<JwRecArchives> getJwArchives(final Long userId,
			final String subject, final String depName, final String startDate,
			final String endDate, final int currentPage, final int pageSize,
			final String archiveNo, final String depSignNo) {

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(userId, subject,
							depName, archiveNo, depSignNo, startDate, endDate);
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
		List<JwRecArchives> resultList = tranFromJSONObject(docs);
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
			final String archiveNo, final String depSignNo) {

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(userId, subject,
							depName, archiveNo, depSignNo, startDate, endDate);
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
			String subject, String depName, String archiveNo, String depSignNo,
			String startDate, String endDate)
			throws UnsupportedEncodingException {
		StringBuffer param = new StringBuffer();
		WordSegmentTool wordSegmentTool=new WordSegmentTool();
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
		if (null != archiveNo && !"".equals(archiveNo)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("inbumfno:");
			param.append(java.net.URLEncoder.encode(archiveNo, "utf-8"));
		}
		if (null != depSignNo && !"".equals(depSignNo)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("bumfno:");
			param.append(java.net.URLEncoder.encode(depSignNo, "utf-8"));
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
	private static List<JwRecArchives> tranFromJSONObject(JSONArray array) {
		List<JwRecArchives> archs = new ArrayList<JwRecArchives>();
		for (int i = 0; i < array.size(); i++) {
			JwRecArchives arch = new JwRecArchives();
			try {
				JSONObject json = array.getJSONObject(i);
				arch.setInbumfday(getValueByName(json, "inbumfday"));
				arch.setBumfday(getValueByName(json, "bumfday"));
				arch.setSubject(getValueByName(json,
						"subject"));
				arch.setNiban(getValueByName(json, "niban"));
				arch.setTitle(getValueByName(json, "title"));
				arch.setSourcedepartment(getValueByName(json, "sourcedepartment"));
				arch.setZhuban(getValueByName(json, "zhuban"));
				arch.setFilepath(getValueByName(json, "filepath"));
				arch.setId(new Long(getValueByName(json, "id")));
				arch.setBumfno(getValueByName(json, "bumfno"));
				arch.setInbumfno(getValueByName(json, "inbumfno"));
				arch.setPopularity(getValueByName(json, "popularity"));
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