package com.gdssoft.oa.service.flow.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.WordSegmentTool;
import com.gdssoft.oa.dao.flow.FlowTaskReportDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.SolrArchives;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.flow.FlowTaskReportService;
import com.gdssoft.oa.service.system.SysConfigService;

public class FlowTaskReportServiceImpl extends BaseServiceImpl<FlowTaskReport>
		implements FlowTaskReportService {
	private FlowTaskReportDao dao;
	public static final String HOST = "http://10.224.5.183:8080/cq_search";
	public static final String QT = "select";
	public static String EMPTY_RESULT = "[]";
	public static final String OA_OFFICE_HELPER = HOST
			+ "/JW_ARCHIVES_OA_AIDE/" + QT;

	@Resource
	private SysConfigService sysConfigService;

	public FlowTaskReportServiceImpl(FlowTaskReportDao dao) {
		super(dao);
		this.dao = dao;
	}

	public List<FlowTaskReport> getFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate, final int currentPage, final int pageSize) {
		return dao.getFlowTaskList(userId, toDoType, archiveType, subject,
				depName, defId, startDate, endDate, currentPage, pageSize);
	}

	/**                                      
	 * 获取收发文待办及在办件
	 */
	public List<FlowTaskReport> getNewFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate, final int currentPage, final int pageSize,
			final String orgDepId, final String archiveNo, final Long signId,
			final String depSignNo, final String issuerName,
			final Long issuerDepid, final String assignUserName) {
		if(toDoType==15){//在办件查询
			List<FlowTaskReport> list =dao.getDoingFlowTaskList(userId, toDoType, archiveType, subject, depName, defId, startDate, endDate, currentPage, pageSize, orgDepId, archiveNo, signId, depSignNo, issuerName, issuerDepid, assignUserName);
		    for(FlowTaskReport taskReport:list){
				String preTask = dao.getPreTaskInfo(taskReport.getTaskId(), taskReport.getRunId());
				if (StringUtils.isNotEmpty(preTask)) {
					String[] preTaskInfos = preTask.split(";");
					String[] processInfos=preTaskInfos[2].split(",");
					taskReport.setPreActivityname(processInfos[0]);
					if(processInfos.length>1&&processInfos[1]!=null&&"并发流程".equals(processInfos[1])){
						taskReport.setIsEnd(1);
					}else{
						taskReport.setIsEnd(0);
					}
					taskReport.setPreDepName(preTaskInfos[4]);
					taskReport.setPreUserName(preTaskInfos[1]);
					if (null != preTaskInfos[0]
							&& preTaskInfos[0] != "") {
						taskReport.setPreUserId(Long
								.parseLong(preTaskInfos[0]));
					}
					if (null != preTaskInfos[3]
							&& preTaskInfos[3] != "") {
						taskReport.setPreDepId(Long
								.parseLong(preTaskInfos[3]));
					}
				}
		    }
		    return list;
		}else{
			return dao.getNewFlowTaskList(userId, toDoType, archiveType, subject,
					depName, defId, startDate, endDate, currentPage, pageSize,
					orgDepId, archiveNo, signId, depSignNo, issuerName,
					issuerDepid, assignUserName);
		}
	}

	/**
	 * 调用搜索引擎获取收发文待办及在办件
	 */
	public List<FlowTaskReport> getnewJwArchives(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate, final int currentPage, final int pageSize,
			final String orgDepId, final String archiveNo, final Long signId,
			final String depSignNo, final String issuerName,
			final Long issuerDepid) {
		AppUser user = ContextUtil.getCurrentUser();
		String url = null;
		if (archiveType == 0) {
			try {
				url = HOST
						+ "/"
						+ user.getOwnerSchema().toUpperCase()
						+ "_JW_DISPATCH"
						+ "/"
						+ QT
						+ "?"
						+ getParamForQuerySubjectAndDocnum(userId, subject,
								depName, archiveNo, depSignNo, startDate,
								endDate, toDoType, archiveType, signId,
								orgDepId,issuerName,defId);
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		if (archiveType == 1 || archiveType == 2) {
			try {
				url = HOST
						+ "/"
						+ user.getOwnerSchema().toUpperCase()
						+ "_JW_RECEIVE"
						+ "/"
						+ QT
						+ "?"
						+ getParamForQuerySubjectAndDocnum(userId, subject,
								depName, archiveNo, depSignNo, startDate,
								endDate, toDoType, archiveType, signId,
								orgDepId,issuerName,defId);
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&sort=createtime+desc&start=" + currentPage + "&rows="
				+ (pageSize) + "&wt=json&indent=true";
		String result = null;
		try {
			result = call(url);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<FlowTaskReport> resultList = new ArrayList<FlowTaskReport>();
		if (!"".equals(result) && null != result) { 
			JSONObject all = JSONObject.fromObject(result);
			// 解析一般下获取response节点
			JSONObject res = all.getJSONObject("response");
			// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
			int total = res.getInt("numFound");
			// 获取最终结果
			JSONArray docs = res.getJSONArray("docs");
			JSONObject highlighting = all.getJSONObject("highlighting");
			resultList = tranFromJSONObject(docs, highlighting);
		}
		return resultList;
	}

	/**
	 * 调用搜索引擎获取收发文待办及在办件获取总数
	 * 
	 * @return
	 */
	public int count(final Long userId, final int toDoType,
			final int archiveType, final String subject, final String depName,
			final Long defId, final String startDate, final String endDate,
			final int currentPage, final int pageSize, final String orgDepId,
			final String archiveNo, final Long signId, final String depSignNo,
			final String issuerName, final Long issuerDepid) {
		AppUser user = ContextUtil.getCurrentUser();
		String url = null;
		if (archiveType == 0) {
			try {
				url = HOST
						+ "/"
						+ user.getOwnerSchema().toUpperCase()
						+ "_JW_DISPATCH"
						+ "/"
						+ QT
						+ "?"
						+ getParamForQuerySubjectAndDocnum(userId, subject,
								depName, archiveNo, depSignNo, startDate,
								endDate, toDoType, archiveType, signId,
								orgDepId,issuerName,defId);
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		if (archiveType == 1 || archiveType == 2) {
			try {
				url = HOST
						+ "/"
						+ user.getOwnerSchema().toUpperCase()
						+ "_JW_RECEIVE"
						+ "/"
						+ QT
						+ "?"
						+ getParamForQuerySubjectAndDocnum(userId, subject,
								depName, archiveNo, depSignNo, startDate,
								endDate, toDoType, archiveType, signId,
								orgDepId,issuerName,defId);
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&sort=createtime+desc&start=" + 0 + "&rows=" + 10
				+ "&wt=json&indent=true";
		String result = null;
		try {
			result = call(url);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		int count = 0;
		if (!"".equals(result) && null != result) {
			JSONObject all = JSONObject.fromObject(result);
			// 解析一般下获取response节点
			JSONObject res = all.getJSONObject("response");
			// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
			int total = res.getInt("numFound");
			// 获取最终结果
			count = total;
		}
		return count;
	}

	public String call(String url) throws IOException {
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
			String startDate, String endDate, int toDoType, int archiveType,
			Long signId, String orgDepId, String issuerName,Long defId)
			throws UnsupportedEncodingException {
		StringBuffer param = new StringBuffer();
		WordSegmentTool wordSegmentTool = new WordSegmentTool();
		AppUser user = ContextUtil.getCurrentUser();
		SysConfig iscommonAdminID = sysConfigService.findByKey("commonAdminId");
		SysConfig isArchivesManagerID = sysConfigService
				.findByKey("archivesManagerID");
		SysConfig isOfficeStaffRoleId = sysConfigService
				.findByKey("officeStaffRoleId");
		SysConfig isOfficeStaffAdminRoleId = sysConfigService
				.findByKey("officeStaffAdminRoleId");
		Set<AppRole> roles = user.getRoles();
		boolean isAdmin = false;
		boolean iscommonAdmin = false;
		boolean isArchivesManager = false;
		boolean isOfficeStaffRole = false;
		boolean isOfficeStaffAdminRole = false;
		for (AppRole role : roles) {
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
			}
			if ((role.getRoleId().toString().equals(iscommonAdminID
					.getDataValue()))) {
				iscommonAdmin = true;
			}
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				isArchivesManager = true;
			}
			if (null != isOfficeStaffRoleId
					&& role.getRoleId().toString()
							.equals(isOfficeStaffRoleId.getDataValue())) {
				isOfficeStaffRole = true;
			}
			if (null != isOfficeStaffAdminRoleId
					&& role.getRoleId().toString()
							.equals(isOfficeStaffAdminRoleId.getDataValue())) {
				isOfficeStaffAdminRole = true;
			}

		}
		String AND = " AND ";
		String TO = " TO ";
		param.append("q=");
		param.append("*:*");
		if (isAdmin || iscommonAdmin || isArchivesManager) {
			// 收发文库
			if (toDoType == -2) {
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("archtype:");
				param.append(java.net.URLEncoder.encode(
						String.valueOf(archiveType), "utf-8"));
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("runstatus:");
				param.append(java.net.URLEncoder.encode(String.valueOf(2),
						"utf-8")); 
			}
			// 收发文查询
			if (toDoType == -1 && archiveType != 2) {
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("archtype:");
				param.append(java.net.URLEncoder.encode(
						String.valueOf(archiveType), "utf-8"));
//				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
//				param.append("todotype:");
//				param.append(java.net.URLEncoder.encode(String.valueOf(0),
//						"utf-8"));
			}
		} else if (isOfficeStaffRole || isOfficeStaffAdminRole) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("depids:");
			param.append(java.net.URLEncoder.encode("*"
					+ user.getDepartment().getDepId() + "*", "utf-8"));
			// 收发文查询
			if (toDoType == -1 && archiveType != 2) {
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("archtype:");
				param.append(java.net.URLEncoder.encode(
						String.valueOf(archiveType), "utf-8"));
//				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
//				param.append("todotype:");
//				param.append(java.net.URLEncoder.encode(String.valueOf(0),
//						"utf-8"));
			}
			// 收发文库
			if (toDoType == -2) {
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("archtype:");
				param.append(java.net.URLEncoder.encode(
						String.valueOf(archiveType), "utf-8"));
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("runstatus:");
				param.append(java.net.URLEncoder.encode(String.valueOf(2),
						"utf-8"));
			}
		} else {
			// 收发文查询
			if (toDoType == -1 && archiveType != 2) {
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("archtype:");
				param.append(java.net.URLEncoder.encode(
						String.valueOf(archiveType), "utf-8"));
//				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
//				param.append("todotype:");
//				param.append(java.net.URLEncoder.encode(String.valueOf(0),
//						"utf-8"));
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("userids:");
				param.append(java.net.URLEncoder.encode("*" + userId.toString()
						+ "*", "utf-8"));
			}
			// 收发文库
			if (toDoType == -2) {
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("archtype:");
				param.append(java.net.URLEncoder.encode(
						String.valueOf(archiveType), "utf-8"));
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("runstatus:");
				param.append(java.net.URLEncoder.encode(String.valueOf(2),
						"utf-8"));
				param.append(java.net.URLEncoder.encode(AND, "utf-8"));
				param.append("userids:");
				param.append(java.net.URLEncoder.encode("*" + userId.toString()
						+ "*", "utf-8"));
			}
		}
		if (null != subject && !"".equals(subject)) {
			String putWord = "";
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("subject:");
			try {
				putWord = wordSegmentTool.segmentWord(subject);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			param.append(java.net.URLEncoder.encode(putWord, "utf-8"));
		}
		if (null != depName && !"".equals(depName)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("issuedep:");
			param.append(java.net.URLEncoder.encode(depName, "utf-8"));
		}
		if (null != issuerName && !"".equals(issuerName)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("issuer:");
			param.append(java.net.URLEncoder.encode(issuerName, "utf-8"));
		}
		if (null != archiveNo && !"".equals(archiveNo)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("archivesno:");
			param.append(java.net.URLEncoder.encode(archiveNo, "utf-8"));
		}
		if (null != depSignNo && !"".equals(depSignNo)) {
			String putWord = "";
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("depsignno:");
			try {
				putWord = wordSegmentTool.segmentWord(depSignNo);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			param.append(java.net.URLEncoder.encode(putWord, "utf-8"));
		}
		if (null != orgDepId && !"".equals(orgDepId)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("orgdep_id:");
			param.append(java.net.URLEncoder.encode(orgDepId, "utf-8"));
		}
		if (null != startDate && !"".equals(startDate) && null != endDate
				&& !"".equals(endDate)) {
			String str = startDate + "T00:00:00Z";
			String end = endDate + "T00:00:00Z";
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("createtime:[");
			param.append(java.net.URLEncoder.encode(str, "utf-8"));
			param.append(java.net.URLEncoder.encode(TO, "utf-8"));
			param.append(java.net.URLEncoder.encode(end, "utf-8"));
			param.append("]");
		}
		if (null != signId && !"".equals(signId)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("sn_config_id:");
			param.append(java.net.URLEncoder.encode(signId.toString(), "utf-8"));
		}	
		if (null != defId && !"".equals(defId)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("defid:");
			param.append(java.net.URLEncoder.encode(defId.toString(), "utf-8"));
		}
		return param.toString();
	}

	/* 把搜索引擎查到的数据添加进新的model中 */
	private static List<FlowTaskReport> tranFromJSONObject(JSONArray array,
			JSONObject highlighting) {
		List<FlowTaskReport> archs = new ArrayList<FlowTaskReport>();

		for (int i = 0; i < array.size(); i++) {
			FlowTaskReport arch = new FlowTaskReport();
			try {
				JSONObject json = array.getJSONObject(i);
				JSONObject subjectHighLight = highlighting
						.getJSONObject(getValueByName(json, "archivesid"));
				String highLightSubject = getValueByName(subjectHighLight,
						"subject");
				if (!"".equals(highLightSubject) && highLightSubject != null) {
					highLightSubject = highLightSubject.substring(2,
							highLightSubject.length() - 2);
					highLightSubject = highLightSubject.replace("\\", "");
				}
				System.out.print(highLightSubject);
				if (!"".equals(highLightSubject) && highLightSubject != null) {
					arch.setRunSubject(highLightSubject);

				} else {
					arch.setRunSubject(getValueByName(json, "subject"));
				}
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
				if (null != getValueByName(json, "activity_name_")
						&& !"".equals(getValueByName(json, "activity_name_")))
					arch.setActivityname(getValueByName(json, "activity_name_"));
				if (null != getValueByName(json, "subject")
						&& !"".equals(getValueByName(json, "subject")))
					/* arch.setRunSubject(getValueByName(json, "subject")); */
					arch.setStandardApprover(getValueByName(json, "subject"));
				if (null != getValueByName(json, "name_")
						&& !"".equals(getValueByName(json, "name_")))
					arch.setTaskName(getValueByName(json, "name_"));
				if (null != getValueByName(json, "NAME")
						&& !"".equals(getValueByName(json, "NAME")))
					arch.setFlowName(getValueByName(json, "NAME"));
				/* arch.setCurDepId(getValueByName(json, "create_")); */
				if (null != getValueByName(json, "issuerid")
						&& !"".equals(getValueByName(json, "issuerid")))
					arch.setIssuerId(new Long(getValueByName(json, "issuerid")));
				if (null != getValueByName(json, "assignee_")
						&& !"".equals(getValueByName(json, "assignee_")))
					arch.setAssignUserId(new Long(getValueByName(json,
							"assignee_")));
				if (null != getValueByName(json, "createtime")
						&& !"".equals(getValueByName(json, "createtime")))
					arch.setIssueDate(formatter.parse(getValueByName(json,
							"createtime")));
				/* arch.setp(getValueByName(json, "pre_task")); */
				if (null != getValueByName(json, "dbid_")
						&& !"".equals(getValueByName(json, "dbid_")))
					arch.setTaskId(new Long(getValueByName(json, "dbid_")));
				if (null != getValueByName(json, "defid")
						&& !"".equals(getValueByName(json, "defid")))
					/*
					 * arch.setContentformat(getValueByName(json,
					 * "content_format"));
					 */
					arch.setDefId(new Long(getValueByName(json, "defid")));
				if (null != getValueByName(json, "archivesid")
						&& !"".equals(getValueByName(json, "archivesid")))
					arch.setArchiveId(new Long(getValueByName(json,
							"archivesid")));
				if (null != getValueByName(json, "piid")
						&& !"".equals(getValueByName(json, "piid")))
					arch.setPiid(getValueByName(json, "piid"));
				if (null != getValueByName(json, "issuedep")
						&& !"".equals(getValueByName(json, "issuedep")))
					arch.setIssuedep(getValueByName(json, "issuedep"));
				if (null != getValueByName(json, "archivesno")
						&& !"".equals(getValueByName(json, "archivesno")))
					arch.setArchivesNo(getValueByName(json, "archivesno"));
				if (null != getValueByName(json, "runid")
						&& !"".equals(getValueByName(json, "runid")))
					arch.setRunId(new Long(getValueByName(json, "runid")));
				if (null != getValueByName(json, "issuer")
						&& !"".equals(getValueByName(json, "issuer")))
					arch.setIssuer(getValueByName(json, "issuer"));
				/* arch.set(getValueByName(json, "popularity")); */
				if (null != getValueByName(json, "fullname")
						&& !"".equals(getValueByName(json, "fullname")))
					arch.setAssignUserName(getValueByName(json, "fullname"));
				if (null != getValueByName(json, "depname")
						&& !"".equals(getValueByName(json, "depname")))
					arch.setCurDepName(getValueByName(json, "depname"));
				if (null != getValueByName(json, "issuedep")
						&& !"".equals(getValueByName(json, "issuedep")))
					arch.setCreatorDepName(getValueByName(json, "issuedep"));
				if (null != getValueByName(json, "orgdep_name")
						&& !"".equals(getValueByName(json, "orgdep_name")))
					arch.setOrgdepName(getValueByName(json, "orgdep_name"));
				if (null != getValueByName(json, "depsignno")
						&& !"".equals(getValueByName(json, "depsignno")))
					arch.setDepSignNo(getValueByName(json, "depsignno"));
				if (null != getValueByName(json, "pre_task")
						&& !"".equals(getValueByName(json, "pre_task"))) {
					String preusername = null;
					String pretask = getValueByName(json, "pre_task");
					String[] names = pretask.split("\\;");
					for (int j = 0; j < names.length; j++) {
						preusername = names[1];
					}
					arch.setPreUserName(preusername);
				}
				if (null != getValueByName(json, "createtime")
						&& !"".equals(getValueByName(json, "createtime")))
					arch.setArchCreateTime(formatter.parse(getValueByName(json,
							"createtime")));
				if (null != getValueByName(json, "content_format")
						&& !"".equals(getValueByName(json, "content_format")))
					arch.setIsComSetting(new Long(getValueByName(json,
							"content_format")));
				if (null != getValueByName(json, "limited_date")
						&& !"".equals(getValueByName(json, "limited_date")))
					arch.setLimitedDate(formatter.parse(getValueByName(json,
							"limited_date")));
				if (null != getValueByName(json, "written_date")
						&& !"".equals(getValueByName(json, "written_date")))
					arch.setWrittenDate(formatter.parse(getValueByName(json,
							"written_date")));
				if (null != getValueByName(json, "sign_date")
						&& !"".equals(getValueByName(json, "sign_date")))
					arch.setSignDate(formatter.parse(getValueByName(json,
							"sign_date")));
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

	/**
	 * OA办公小助手搜索查询
	 */
	public List<Archives> getSearchList(String subject, String archiveNo,
			String docName, String fileName, int currentPage, int pageSize,
			String archType) {
		String url = "";
		String text = "";
		String putWord = "";
		String word = "";
		String searchWord = " " + "AND" + " " + "archtype:" + archType;
		WordSegmentTool wordSegmentTool = new WordSegmentTool();
		if (null != subject && !"".equals(subject)) {
			word += subject;
		}
		if (null != archiveNo && !"".equals(archiveNo)
				&& !"0".equals(archiveNo)) {
			word += archiveNo;
		}
		if (null != word && !"".equals(word)) {
			try {
				putWord = wordSegmentTool.segmentWord(word);
			} catch (IOException e2) {
				e2.printStackTrace();
			}
		}
		if (null != putWord && !"".equals(putWord)) {
			text += putWord;
		}
		if (null != docName && !"".equals(docName)) {
			text += docName + " ";
		}
		if (null != fileName && !"".equals(fileName)) {
			text += fileName + " ";
		}
		StringBuffer buff = new StringBuffer();
		try {
			buff.append("q=(text:")
					.append(java.net.URLEncoder.encode(text, "utf-8"))
					.append(")")
					.append(java.net.URLEncoder.encode(searchWord, "utf-8"));
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		AppUser user = ContextUtil.getCurrentUser();
		// 动态获取Schema
		String host = HOST + "/" + user.getOwnerSchema().toUpperCase()
				+ "_JW_ARCHIVES_OA_AIDE/" + QT;
		url = host + "?" + buff.toString();
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&start=0&rows=600&wt=json&indent=true";
		String result = "";
		try {
			result = call(url);
		} catch (IOException e) {
			e.printStackTrace();
		}
		List<Archives> resultList = new ArrayList<Archives>();
		if (!"".equals(result) && null != result) {
			JSONObject all = JSONObject.fromObject(result);
			// 解析一般下获取response节点
			JSONObject res = all.getJSONObject("response");
			// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
			int total = res.getInt("numFound");
			// 获取最终结果
			JSONArray docs = res.getJSONArray("docs");

			for (int i = 0; i < docs.size(); i++) {
				try {
					Archives archive = new Archives();
					JSONObject json = docs.getJSONObject(i);
					archive.setSubject(getValueByName(json, "subject"));
					archive.setArchivesId(new Long(getValueByName(json,
							"archivesid")));
					archive.setArchivesNo(getValueByName(json, "archivesno"));
					if (!"".equals(getValueByName(json, "defid"))) {
						archive.setIsdraft(new Long(getValueByName(json,
								"defid")));
					}
					if (!"".equals(getValueByName(json, "runid"))) {
						archive.setIsreceive(new Long(getValueByName(json,
								"runid")));
					}
					archive.setKeywords(getValueByName(json, "datatype")
							.toString());
					resultList.add(archive);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return resultList;
	}

	/**
	 * OA办公小助手菜单搜索查询
	 */
	public List<Archives> getMenuSearchList(String searchText, int currentPage,
			int pageSize, String archType) {
		String url = "";
		String text = "";
		String putWord = "";
		String word = "";
		AppUser user = ContextUtil.getCurrentUser();
		SysConfig iscommonAdminID = sysConfigService.findByKey("commonAdminId");
		SysConfig isArchivesManagerID = sysConfigService
				.findByKey("archivesManagerID");
		SysConfig isOfficeStaffRoleId = sysConfigService
				.findByKey("officeStaffRoleId");
		SysConfig isOfficeStaffAdminRoleId = sysConfigService
				.findByKey("officeStaffAdminRoleId");
		Set<AppRole> roles = user.getRoles();
		boolean isAdmin = false;
		boolean iscommonAdmin = false;
		boolean isArchivesManager = false;
		boolean isOfficeStaffRole = false;
		boolean isOfficeStaffAdminRole = false;
		for (AppRole role : roles) {
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
			}
			if ((role.getRoleId().toString().equals(iscommonAdminID
					.getDataValue()))) {
				iscommonAdmin = true;
			}
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				isArchivesManager = true;
			}
			if (null != isOfficeStaffRoleId
					&& role.getRoleId().toString()
							.equals(isOfficeStaffRoleId.getDataValue())) {
				isOfficeStaffRole = true;
			}
			if (null != isOfficeStaffAdminRoleId
					&& role.getRoleId().toString()
							.equals(isOfficeStaffAdminRoleId.getDataValue())) {
				isOfficeStaffAdminRole = true;
			}

		}
		String searchWord = "+AND+userids:*" + user.getUserId() + "*)" + "+OR+";
		String officeStaffSearchWord = "+AND+depids:*"
				+ user.getDepartment().getDepId() + "*)" + "+OR+";
		WordSegmentTool wordSegmentTool = new WordSegmentTool();
		if (null != searchText && !"".equals(searchText)) {
			word += searchText;
		}
		if (null != word && !"".equals(word)) {
			try {
				putWord = wordSegmentTool.segmentWord(word);
			} catch (IOException e2) {
				e2.printStackTrace();
			}
		}
		if (null != putWord && !"".equals(putWord)) {
			text += putWord;
		}
		StringBuffer buff = new StringBuffer();
		try {
			if (isAdmin || iscommonAdmin || isArchivesManager) {
				buff.append("q=text:").append(
						java.net.URLEncoder.encode(text, "utf-8"));
			} else if (isOfficeStaffRole || isOfficeStaffAdminRole) {
				buff.append("q=(text:")
						.append(java.net.URLEncoder.encode(text, "utf-8"))
						.append(officeStaffSearchWord).append("(text:")
						.append(java.net.URLEncoder.encode(text, "utf-8"))
						.append("+AND+depids:5YY)");
			} else {
				buff.append("q=(text:")
						.append(java.net.URLEncoder.encode(text, "utf-8"))
						.append(searchWord).append("(text:")
						.append(java.net.URLEncoder.encode(text, "utf-8"))
						.append("+AND+userids:5YY)");
			}
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		// 动态获取Schema
		String host = HOST + "/" + user.getOwnerSchema().toUpperCase()
				+ "_JW_ARCHIVES_OA_AIDE/" + QT;
		url = host + "?" + buff.toString();
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&start=0&rows=1000&wt=json&indent=true";
		String result = "";
		try {
			result = call(url);
		} catch (IOException e) {
			e.printStackTrace();
		}
		List<Archives> resultList = new ArrayList<Archives>();
		if (!"".equals(result) && null != result) {
			JSONObject all = JSONObject.fromObject(result);
			// 解析一般下获取response节点
			JSONObject res = all.getJSONObject("response");
			// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
			int total = res.getInt("numFound");
			// 获取最终结果
			JSONArray docs = res.getJSONArray("docs");
			// 解析highlighting节点
			JSONObject highlighting = all.getJSONObject("highlighting");
			for (int i = 0; i < docs.size(); i++) {
				try {
					Archives archive = new Archives();
					JSONObject json = docs.getJSONObject(i);
					JSONObject subjectHighLight = highlighting
							.getJSONObject(getValueByName(json, "archivesid"));
					String highLightSubject = getValueByName(subjectHighLight,
							"subject");
					if (!"".equals(highLightSubject)
							&& highLightSubject != null) {
						highLightSubject = highLightSubject.substring(2,
								highLightSubject.length() - 2);
						highLightSubject = highLightSubject.replace("\\", "");
					}
					System.out.print(highLightSubject);
					if (!"".equals(highLightSubject)
							&& highLightSubject != null) {
						archive.setSubject(highLightSubject);

					} else {
						archive.setSubject(getValueByName(json, "subject"));
					}
					archive.setArchivesId(new Long(getValueByName(json,
							"archivesid")));
					archive.setArchivesNo(getValueByName(json, "archivesno"));
					if (!"".equals(getValueByName(json, "defid"))) {
						archive.setIsdraft(new Long(getValueByName(json,
								"defid")));
					}
					if (!"".equals(getValueByName(json, "runid"))) {
						archive.setIsreceive(new Long(getValueByName(json,
								"runid")));
					}
					archive.setArchChecker(getValueByName(json, "createtime")
							.toString());
					archive.setIssueDep(getValueByName(json, "issuedep")
							.toString());
					archive.setKeywords(getValueByName(json, "datatype")
							.toString());
					archive.setCcTo(getValueByName(json, "subject"));
					resultList.add(archive);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return resultList;
	}
	
	@Override
	public List<FlowTaskReport> getNewFlowTaskListDetail(Long runId,
			Long userId, int archiveType, int currentPage, int pageSize) {
		return dao.getNewFlowTaskListDetail(runId, userId, archiveType, currentPage, pageSize);
	}

	@Override
	public List<Map<String, Object>> getOfficeMeetingTimes(String subject, String timesId,
			int currentPage, int pageSize) {
		return dao.getOfficeMeetingTimes(subject, timesId, currentPage, pageSize);
	}

	@Override
	public List<Map<String, Object>> OfficeMeetingWleaderlist(String subject, String timesId,
			int currentPage, int pageSize) {
		return dao.OfficeMeetingWleaderlist(subject, timesId, currentPage, pageSize);
	}

	@Override
	public List<Map<String, Object>> OfficeMeetingBGSZRlist(String subject, String timesId,
			int currentPage, int pageSize) {
		return dao.OfficeMeetingBGSZRlist(subject, timesId, currentPage, pageSize);
	}
}
