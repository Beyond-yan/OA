package com.gdssoft.oa.service.system.impl;
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
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.xml.crypto.Data;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.WordSegmentTool;
import com.gdssoft.oa.dao.system.SysArchivesFilesDao;
import com.gdssoft.oa.dao.system.SysDataTransferDao;
import com.gdssoft.oa.dao.system.SysDepartmentConfigDao;
import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.SysArchivesFiles;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.system.SysDepartmentConfig;
import com.gdssoft.oa.service.system.SysDataTransferService;

public class SysDataTransferServiceImpl extends BaseServiceImpl<SysDataTransfer> implements SysDataTransferService{
	@SuppressWarnings("unused")
	public static final String HOST = "http://10.224.5.183:8080/cq_search";
	public static final String SCORE = "JW_RECEIVE_MONITOR";
	public static final String QT = "select";
	public static final String SHEADER = HOST + "/" + SCORE + "/" + QT;
	public static String EMPTY_RESULT = "[]";
	
	private SysDataTransferDao dao;
	@Resource
	private SysDepartmentConfigDao sysDepartmentConfigDao;
	@Resource
	private SysArchivesFilesDao sysArchivesFilesDao;
	
	public SysDataTransferServiceImpl(SysDataTransferDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<SysDataTransfer> getListByArchivesId(Long archivesId){
		return dao.getListByArchivesId(archivesId);
	}
	public SysDataTransfer getDep(Long id){
		SysDataTransfer sysDataTransfer = dao.get(id);
		SysDepartmentConfig sysDepartmentConfig;
		String receiveDep = sysDataTransfer.getReceiveDep();
		if(null != receiveDep && "" != receiveDep){
			sysDepartmentConfig = sysDepartmentConfigDao.findByDepCode(receiveDep);
			sysDataTransfer.setConfs(sysDepartmentConfig);
		}
		List<SysArchivesFiles> archivesFile = sysArchivesFilesDao.findByDataIdAndFileType(id, new Long(2));
		if(null != archivesFile && archivesFile.size()>0){
			sysDataTransfer.setArchivesFiles(archivesFile);
		}
		return sysDataTransfer;
	}

	@Override
	public void updateDownload(Long id) {
		AppUser user = ContextUtil.getCurrentUser();
		SysDataTransfer sysDataTransfer = dao.get(id);
		sysDataTransfer.setReceiveDate(new Date());
		sysDataTransfer.setReceiveFlag(1l);
		sysDataTransfer.setReceiveUser(user.getUsername());
		sysDataTransfer.setReceiveUserName(user.getFullname());
		dao.save(sysDataTransfer);
	}
	
	public int getListMonitorCount(Long archivesId, String depName, String receiveDate, Long receiveFlag, String receiveUserName){
		return dao.getListMonitorCount(archivesId, depName, receiveDate, receiveFlag, receiveUserName);
	}
	
	public List<SysDataTransfer> getListMonitor(int start, int limit, Long archivesId, String depName, String receiveDate, Long receiveFlag, String receiveUserName){
		return dao.getListMonitor(start, limit, archivesId, depName, receiveDate, receiveFlag, receiveUserName);
	}
	@Override
	public List<SysDataTransfer> getdepcode(Long depId,String fromShcemaid, String toShcemaid,
			String receiveDep, String receivetype, String subject,
			String sendDep, String receiveFlag, String issuer, int size,
			int start,String sourceType) {
		return dao.getdepcode(depId, fromShcemaid,toShcemaid, receiveDep, receivetype, subject, sendDep, receiveFlag, issuer, size, start,sourceType);
	}
	@Override
	public Long count(Long depId,String fromShcemaid, String toShcemaid, String receiveDep,
			String receivetype, String subject, String sendDep,
			String receiveFlag, String issuer, String sourceType) {
		return dao.count(depId,fromShcemaid, toShcemaid, receiveDep, receivetype, subject, sendDep, receiveFlag, issuer,sourceType);
	}
	@Override
	public List<SysDataTransfer> getReceiveDownload(int start, int limit, String subject,
			String archivesno, Date endtime, Date creattime, String UserName,String archtype){
		return dao.getReceiveDownload(start, limit, subject, archivesno, endtime, creattime, UserName,archtype);
		
	}
	@Override
   public	Long count(String subject, String archivesno, Date endtime, Date creattime,
			String UserName,String archtype){
	   return dao.count(subject, archivesno, endtime, creattime, UserName,archtype);
   }
	@Override
	public List<SysDataTransfer> getReceiveDownloadJW(int start, int limit, String subject,
			String archivesno, Date endtime, Date creattime, String UserName){

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(subject, archivesno,
							endtime, creattime, UserName);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&start=" + start + "&rows=" + (limit)
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
		List<SysDataTransfer> resultList = tranFromJSONObject(docs);
		return resultList;
	}
	/**
	 * 调用搜索引擎获取收发文待办及在办件查出总数
	 * 
	 * @return
	 */
	@Override
	public int count(int start, int limit, String subject,
			String archivesno, Date endtime, Date creattime, String UserName) {

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(subject, archivesno,
							endtime, creattime, UserName);
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

	private String getParamForQuerySubjectAndDocnum( String subject,
			String archivesno, Date endtime, Date creattime, String UserName)
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
		if (null != archivesno && !"".equals(archivesno)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("archivesno:");
			param.append(java.net.URLEncoder.encode(archivesno, "utf-8"));
		}
		if (null != UserName && !"".equals(UserName)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("create_user:");
			param.append(java.net.URLEncoder.encode(UserName, "utf-8"));
		}
		if (null != endtime && !"".equals(endtime) && null != creattime
				&& !"".equals(creattime)) {
			String str = creattime + "T00:00:00";
			String end = endtime + "T00:00:00";
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("create_date:[");
			param.append(java.net.URLEncoder.encode(str, "utf-8"));
			param.append(java.net.URLEncoder.encode(TO, "utf-8"));
			param.append(java.net.URLEncoder.encode(end, "utf-8"));
			param.append("]");
		}
		return param.toString();
	}

	/* 把搜索引擎查到的数据添加进新的model中 */
	private static List<SysDataTransfer> tranFromJSONObject(JSONArray array) {
		List<SysDataTransfer> archs = new ArrayList<SysDataTransfer>();
		for (int i = 0; i < array.size(); i++) {
			SysDataTransfer arch = new SysDataTransfer();
			try {
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
				JSONObject json = array.getJSONObject(i);
				arch.setSources(getValueByName(json, "sources"));
				arch.setArchivesId(new Long(getValueByName(json, "archives_id")));
				arch.setArchivesno(getValueByName(json, "archivesno"));
				arch.setId(new Long(getValueByName(json, "ID")));
				arch.setSubject(getValueByName(json, "subject"));
				arch.setSendDep(getValueByName(json, "send_dep"));
				arch.setDataSource(new Long(getValueByName(json, "data_source")));
				arch.setWrittenDate(formatter.parse(getValueByName(json, "written_date")));
				arch.setCreateDate(formatter.parse(getValueByName(json, "create_date")));
				arch.setIssuer(getValueByName(json, "issuer"));
				arch.setArchtype(new Long(getValueByName(json, "archtype")));
				arch.setFromSchema(new Long(getValueByName(json, "from_schema")));
				arch.setReceiveFlag(new Long(getValueByName(json, "receive_flag")));
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