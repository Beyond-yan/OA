package com.gdssoft.oa.action.system;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.ArchivesType;
import com.gdssoft.oa.model.archive.DocHistory;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysArchivesFiles;
import com.gdssoft.oa.model.system.SysArchivesFilesHis;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.system.SysDataTransferHis;
import com.gdssoft.oa.model.system.SysDepartmentConfig;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.ArchivesTypeService;
import com.gdssoft.oa.service.archive.DocHistoryService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysArchivesFilesHisService;
import com.gdssoft.oa.service.system.SysArchivesFilesService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysDataTransferHisService;
import com.gdssoft.oa.service.system.SysDataTransferService;
import com.gdssoft.oa.service.system.SysDepartmentConfigService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
import com.gdssoft.oa.service.system.SysUserAllService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.Action;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class SysDataTransferAction extends BaseAction {
	@Resource
	private SysDataTransferService sysDataTransferService;
	private SysDataTransfer sysDataTransfer;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private ArchivesDocService archivesDocService;
	@Resource
	private DocHistoryService docHistoryService;
	@Resource
	private ArchivesTypeService archivesTypeService;
	@Resource
	private SysArchivesFilesService sysArchivesFilesService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private SysDepartmentConfigService sysDepartmentConfigService;
	@Resource
	private SysUserAllService sysUserAllService;
	@Resource
	private SysDataTransferHisService sysDataTransferHisService;
	@Resource
	private SysArchivesFilesHisService sysArchivesFilesHisService;
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private SmsMobileService smsMobileServie;
	@Resource
	private SysConfigService sysConfigService;

	// private SysArchivesFiles sysArchivesFiles;

	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysDataTransfer getSysDataTransfer() {
		return sysDataTransfer;
	}

	public void setSysDataTransfer(SysDataTransfer sysDataTransfer) {
		this.sysDataTransfer = sysDataTransfer;
	}

	/*
	 * public SysArchivesFiles getSysArchivesFiles() { return sysArchivesFiles;
	 * }
	 * 
	 * public void setSysArchivesFiles(SysArchivesFiles sysArchivesFiles) {
	 * this.sysArchivesFiles = sysArchivesFiles; }
	 */

	/**
	 * 显示列表
	 */
	public String list() {
		String queryType = this.getRequest().getParameter("queryType");
		if (StringUtils.isBlank(queryType))
			queryType = "send";
		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysUserAll sysUserAll = sysUserAllService.findByUserName(user
				.getUsername());
		Long userdepId = user.getDepartment().getDepId();
		List<Department> deplist = departmentService.findByParentId(userdepId);
		Department deplist2 = departmentService.get(userdepId);
		deplist.add(deplist2);
		for (Department deplist3 : deplist) {
			String depcode = deplist3.getDepUnitCode();
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
		}
		if (!user.getIsAdmin()) {
			if (queryType.equals("send")) {
				filter.addFilter("Q_issuerid_L_EQ", user.getUserId().toString());
				filter.addFilter("Q_fromSchema_L_EQ", sysUserAll.getSchemaId()
						.toString());
				filter.addFilter("Q_dataSource_L_EQ", "1");
			}else if (queryType.equals("back")) {
				filter.addFilter("Q_fromSchema_L_EQ", sysUserAll.getSchemaId().toString());
			}else {
				filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
						.toString());
				filter.addFilter("Q_receiveType_N_NEQ", "1");
				//OA下面比较特殊，许多区县也在此SCHEMA下
				if(user.getOwnerSchema().equals("OA")){
					//获取父级部门信息
					Department dept=departmentService.get(user.getDepartment().getParentId());
					//委机关
					if(dept!=null&&dept.getDepName().equals("委机关")){
						filter.addFilter("Q_receiveDep_S_EQ", user.getOwnerSchema()+"_"+user.getDepartment().getParentId());
					}else{//没用系统的区县
						filter.addFilter("Q_receiveDep_S_EQ", user.getOwnerSchema()+"_"+user.getDepartment().getDepId());
					}
				}else{//拥有独立的SCHEMA
					filter.addFilter("Q_fromSchema_L_NEQ", sysUserAll.getSchemaId().toString());
				}
			}
		}
		filter.addSorted("createDate", "desc");
		List<SysDataTransfer> list = sysDataTransferService.getAll(filter);
		for (SysDataTransfer dep : list) {
			Long schemaId = dep.getFromSchema();
			Long archivesId = dep.getArchivesId();
			Long runid = null;
			String schemacode = null;
			if (null != schemaId) {
				SysSchemaConfig schema = sysSchemaConfigService.get(schemaId);
				schemacode = schema.getSchemaCode();
				runid = archivesService.getrun(archivesId, schemacode);
			}
			String depcode = dep.getReceiveDep();
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
			dep.setConfs(department);
			dep.setRunid(runid);
			dep.setSchemacode(schemacode);
			String userName = dep.getCreateUser();
			if (StringUtils.isNotBlank(userName)) {
				AppUser appuser = appUserService.findByUserName(userName);
				if (null != appuser) {
					dep.setCreateUserFullName(appuser.getFullname());
				}
			}
		}
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		/*
		 * Gson gson=new Gson(); buff.append(gson.toJson(list, type));
		 * buff.append("}");
		 */
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"receiveDate", "createDate");
		json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String listDownload() {
		String searchType = getRequest().getParameter("searchType");
		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysUserAll sysUserAll = sysUserAllService.findByUserName(user
				.getUsername());
		if (null != searchType
				&& (searchType.equals("moniter") || searchType == "moniter")) {
			String archivesId = getRequest().getParameter("archivesId");
			filter.addFilter("Q_archivesId_L_EQ", archivesId);
			filter.addFilter("Q_dataSource_L_EQ", "0");
			List<SysDataTransfer> list = sysDataTransferService.getAll(filter);
			for (SysDataTransfer dep : list) {
				Long schemaId = dep.getFromSchema();
				Long archives = dep.getArchivesId();
				Long runid = null;
				String schemacode = null;
				if (null != schemaId) {
					SysSchemaConfig schema = sysSchemaConfigService
							.get(schemaId);
					schemacode = schema.getSchemaCode();
					runid = archivesService.getrun(archives, schemacode);
				}
				QueryFilter filter2 = new QueryFilter(getRequest());
				String depcode = dep.getReceiveDep();
				filter2.addFilter("Q_depCode_S_EQ", depcode);
				SysDepartmentConfig department = sysDepartmentConfigService
						.findByDepCode(depcode);
				String depname = "";
				if (null == department) {
					depname = "";
				}
				dep.setConfs(department);
				dep.setRunid(runid);
				dep.setSchemacode(schemacode);
			}
			Type type = new TypeToken<List<SysDataTransfer>>() {
			}.getType();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
					.append(filter.getPagingBean().getTotalItems()).append(
							",result:");
			JSONSerializer json = JsonUtil.getJSONSerializer();
			json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
					"receiveDate", "createDate");
			json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
			buff.append(json.exclude(new String[] { "class" }).serialize(list));
			buff.append("}");
			jsonString = buff.toString();
			return SUCCESS;
		} else {
			if (!user.getIsAdmin()) {
				String subject = getRequest().getParameter("Q_subject_S_LK");
				String sendDep = getRequest().getParameter("Q_sendDep_S_LK");
				String receiveFlag = getRequest().getParameter(
						"Q_receiveFlag_L_EQ");
				String sourceType = getRequest().getParameter(
						"Q_sourceType_L_EQ");
				String issuer = getRequest().getParameter("Q_issuer_S_LK");
				Long depId = user.getDepartment().getDepId();
				String fromShcemaid = null;
				String toShcemaid = null;
				String receivetype = null;
				String receiveDep = null;
				int size = Integer.parseInt(getRequest().getParameter("limit"));
				int start = Integer
						.parseInt(getRequest().getParameter("start"));
				toShcemaid = sysUserAll.getSchemaId().toString();
				Department dept=departmentService.get(user.getDepartment().getParentId());
				//委机关
				if(dept.getDepName().equals("委机关")||!user.getOwnerSchema().equals("OA")){
					fromShcemaid=toShcemaid;
				}
				receiveDep = user.getDepartment().getDepUnitCode();
				filter.addFilter("Q_receiveType_N_LE", "1");
				List<SysDataTransfer> list = sysDataTransferService.getdepcode(
						depId,fromShcemaid, toShcemaid, receiveDep, receivetype, subject,
						sendDep, receiveFlag, issuer, size, start, sourceType);
				Long con = sysDataTransferService.count(depId,fromShcemaid, toShcemaid,
						receiveDep, receivetype, subject, sendDep, receiveFlag,
						issuer, sourceType);
				for (SysDataTransfer dep : list) {
					Long schemaId = dep.getFromSchema();
					Long archivesId = dep.getArchivesId();
					Long runid = null;
					String schemacode = null;
					if (null != schemaId) {
						SysSchemaConfig schema = sysSchemaConfigService
								.get(schemaId);
						schemacode = schema.getSchemaCode();
						runid = archivesService.getrun(archivesId, schemacode);
					}
					String depcode = dep.getReceiveDep();
					SysDepartmentConfig department = sysDepartmentConfigService
							.findByDepCode(depcode);
					dep.setConfs(department);
					dep.setRunid(runid);
					dep.setSchemacode(schemacode);
				}
				Type type = new TypeToken<List<SysDataTransfer>>() {
				}.getType();
				StringBuffer buff = new StringBuffer(
						"{success:true,'totalCounts':").append(con).append(
						",result:");
				JSONSerializer json = JsonUtil.getJSONSerializer();
				json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
						"receiveDate", "createDate");
				json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
				buff.append(json.exclude(new String[] { "class" }).serialize(
						list));
				buff.append("}");
				jsonString = buff.toString();
				return SUCCESS;
			} else {
				filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
						.toString());
				filter.addFilter("Q_receiveType_N_GE", "1");
				filter.addFilter("Q_receiveType_N_LE", "2");
				List<SysDataTransfer> list = sysDataTransferService
						.getAll(filter);
				for (SysDataTransfer dep : list) {
					Long schemaId = dep.getFromSchema();
					Long archivesId = dep.getArchivesId();
					Long runid = null;
					String schemacode = null;
					if (null != schemaId) {
						SysSchemaConfig schema = sysSchemaConfigService
								.get(schemaId);
						schemacode = schema.getSchemaCode();
						runid = archivesService.getrun(archivesId, schemacode);
					}
					QueryFilter filter2 = new QueryFilter(getRequest());
					String depcode = dep.getReceiveDep();
					filter2.addFilter("Q_depCode_S_EQ", depcode);
					SysDepartmentConfig department = sysDepartmentConfigService
							.findByDepCode(depcode);
					String depname = "";
					if (null == department) {
						depname = "";
					}
					dep.setConfs(department);
					dep.setRunid(runid);
					dep.setSchemacode(schemacode);
				}
				Type type = new TypeToken<List<SysDataTransfer>>() {
				}.getType();
				StringBuffer buff = new StringBuffer(
						"{success:true,'totalCounts':").append(
						filter.getPagingBean().getTotalItems()).append(
						",result:");
				JSONSerializer json = JsonUtil.getJSONSerializer();
				json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
						"receiveDate", "createDate");
				json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
				buff.append(json.exclude(new String[] { "class" }).serialize(
						list));
				buff.append("}");
				jsonString = buff.toString();
				return SUCCESS;
			}

		}

		/*
		 * String searchType=getRequest().getParameter("searchType"); String
		 * toSchemaId=null; String receiveDep=null; String
		 * archivesId=getRequest().getParameter("archivesId"); Long
		 * archives=null; String toShcemaid=null; String receivetype=null;
		 * String datasource=null; int size =
		 * Integer.parseInt(getRequest().getParameter("limit")); int start =
		 * Integer.parseInt(getRequest().getParameter("start")); QueryFilter
		 * filter = new QueryFilter(getRequest()); AppUser user =
		 * ContextUtil.getCurrentUser(); Long
		 * depId=user.getDepartment().getDepId(); SysUserAll sysUserAll =
		 * sysUserAllService.findByUserName(user.getUsername()); if(null !=
		 * searchType&&(searchType.equals("moniter")||searchType=="moniter")){
		 * archives=new Long(archivesId); datasource="0";
		 * filter.addFilter("Q_archivesId_L_EQ",archivesId);
		 * filter.addFilter("Q_dataSource_L_EQ", "0");
		 * toShcemaid=sysUserAll.getSchemaId().toString();
		 * filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
		 * .toString()); filter.addFilter("Q_receiveType_N_GE","1");
		 * filter.addFilter("Q_receiveType_N_LE", "2"); List<SysDataTransfer>
		 * list = sysDataTransferService.getAll(filter); for(SysDataTransfer
		 * dep:list){ String depcode=dep.getReceiveDep(); SysDepartmentConfig
		 * department = sysDepartmentConfigService.findByDepCode(depcode);
		 * dep.setConfs(department); } Type type = new
		 * TypeToken<List<SysDataTransfer>>() { }.getType(); StringBuffer buff =
		 * new StringBuffer("{success:true,'totalCounts':")
		 * .append(con).append(",result:"); JSONSerializer json =
		 * JsonUtil.getJSONSerializer(); json.transform(new
		 * DateTransformer("yyyy-MM-dd HH:mm:ss"), "receiveDate", "createDate");
		 * json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		 * buff.append(json.exclude(new String[] { "class" }).serialize(list));
		 * buff.append("}");
		 * 
		 * jsonString = buff.toString();
		 * 
		 * return SUCCESS; }else{ if (!user.getIsAdmin()) {
		 * toShcemaid=sysUserAll.getSchemaId().toString();
		 * receiveDep=user.getDepartment().getDepUnitCode(); receivetype="1";
		 * List<SysDataTransfer> list = sysDataTransferService.getdepcode(depId,
		 * archives, toShcemaid, receiveDep, receivetype, datasource, size,
		 * start); Long con = sysDataTransferService.count(depId, archives,
		 * toShcemaid, receiveDep, receivetype, datasource); for(SysDataTransfer
		 * dep:list){ String depcode=dep.getReceiveDep(); SysDepartmentConfig
		 * department = sysDepartmentConfigService.findByDepCode(depcode);
		 * dep.setConfs(department); } Type type = new
		 * TypeToken<List<SysDataTransfer>>() { }.getType(); StringBuffer buff =
		 * new StringBuffer("{success:true,'totalCounts':")
		 * .append(con).append(",result:"); JSONSerializer json =
		 * JsonUtil.getJSONSerializer(); json.transform(new
		 * DateTransformer("yyyy-MM-dd HH:mm:ss"), "receiveDate", "createDate");
		 * json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		 * buff.append(json.exclude(new String[] { "class" }).serialize(list));
		 * buff.append("}");
		 * 
		 * jsonString = buff.toString();
		 * 
		 * return SUCCESS; }
		 */
		/* } */
	}

	/**
	 * 公文下载监控中监控列表显示
	 * 
	 * @H2603045
	 */
	public String listMonitor() {
		String archivesId = getRequest().getParameter("archivesId");
		String depName = getRequest().getParameter("depName");// 收文单位
		String receiveDate = getRequest().getParameter("receiveDate");// 签收日期
		String receiveFlag = getRequest().getParameter("receiveFlag");// 签收状态
		String receiveUserName = getRequest().getParameter("receiveUserName");// 签收人
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		Long receiveFlagL = null;
		Long archivesIdL = null;
		if (StringUtils.isNotBlank(receiveFlag)) {
			receiveFlagL = new Long(receiveFlag);
		}
		if (StringUtils.isNotBlank(archivesId)) {
			archivesIdL = new Long(archivesId);
		}
		int total = sysDataTransferService.getListMonitorCount(archivesIdL,
				depName, receiveDate, receiveFlagL, receiveUserName);
		List<SysDataTransfer> list = sysDataTransferService.getListMonitor(
				start, limit, archivesIdL, depName, receiveDate, receiveFlagL,
				receiveUserName);
		for (SysDataTransfer dep : list) {
			QueryFilter filter2 = new QueryFilter(getRequest());
			String depcode = dep.getReceiveDep();
			filter2.addFilter("Q_depCode_S_EQ", depcode);
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
			dep.setConfs(department);
			// add By sicen.liu
			if (dep.getSourceUser() != null && !"".equals(dep.getSourceUser())) {
				AppUser appUser = appUserService.findByUserName(
						dep.getSourceUser());
				if (appUser != null) {
					dep.setUrgentlevel(appUser.getFullname());
				} else {
					dep.setUrgentlevel(dep.getSourceUser());
				}
			}
		}
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(total).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"receiveDate", "createDate");
		json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 显示待下载公文列表
	 */
	public String display() {

		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysUserAll sysUserAll = sysUserAllService.findByUserName(user
				.getUsername());
		if (!user.getIsAdmin()) {
			filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
					.toString());
			filter.addFilter("Q_receiveDep_S_EQ", user.getDepartment()
					.getDepUnitCode());
		} else {
			filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
					.toString());
		}
		filter.addFilter("Q_receiveType_N_GE", "1");
		filter.addFilter("Q_receiveType_N_LE", "2");
		filter.addSorted("createDate", "desc");
		filter.addFilter("Q_sourceType_L_EQ", "1"); // 因为待下载公文的“更多”是跳转的单位公文下载，所以直接查
		List<SysDataTransfer> list1 = sysDataTransferService.getAll(filter);
		List<SysDataTransfer> list = new ArrayList<SysDataTransfer>();
		for (SysDataTransfer dep : list1) {
			Long schemaId = dep.getFromSchema();
			Long archivesId = dep.getArchivesId();
			SysSchemaConfig schema = sysSchemaConfigService.get(schemaId);
			String schemacode = schema.getSchemaCode();
			Long runid = archivesService.getrun(archivesId, schemacode);
			dep.setRunid(runid);
			dep.setSchemacode(schemacode);
			list.add(dep);
		}

		// 加载数据至awaitDownload
		getRequest().setAttribute("awaitDownload", list);
		return "display";
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				sysDataTransferHisService.deleteHis(new Long(id));
				sysArchivesFilesService.removeById(null, new Long(id), null);
				sysDataTransferService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		String id = getRequest().getParameter("id");
		SysDataTransfer sysDataTransfer = sysDataTransferService
				.getDep(new Long(id));

		/*
		 * Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		 * //将数据转成JSON格式 StringBuffer sb = new
		 * StringBuffer("{success:true,data:");
		 * sb.append(gson.toJson(sysDataTransfer)); sb.append("}");
		 * setJsonString(sb.toString());
		 */

		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"createDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		sb.append(serializer.exclude(new String[] { "class" })
				.include("archivesFiles").serialize(sysDataTransfer));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String saveRejectAndFile() {
		AppUser user = ContextUtil.getCurrentUser();
		SysDataTransfer orgSysDataTransfer = sysDataTransferService
				.get(sysDataTransfer.getId());
		try {
			BeanUtil.copyNotNullProperties(orgSysDataTransfer, sysDataTransfer);
		} catch (Exception e) {
			e.printStackTrace();
		}
		orgSysDataTransfer.setUpdateUser(user.getUsername());
		orgSysDataTransfer.setUpdateDate(new Date());
		sysDataTransferService.save(orgSysDataTransfer);
		if("OA".equals(user.getOwnerSchema().toUpperCase())){
			// 保存公文正文，FileType为1
			SysDataTransfer sdt = new SysDataTransfer();
			Long userId = new Long(orgSysDataTransfer.getIssuerid());
			SysSchemaConfig sysSchemaConfig = sysSchemaConfigService
					.get(orgSysDataTransfer.getFromSchema());
			AppUser appUser = appUserService.findSchemaUserByUserId(
					sysSchemaConfig.getSchemaCode(), userId);
			Long fromSchema = orgSysDataTransfer.getFromSchema();
			Long toSchema = orgSysDataTransfer.getToSchemaId();
			sdt.setReceiveFlag(new Long("0"));
			sdt.setArchivesId(orgSysDataTransfer.getArchivesId());
			sdt.setRejectMsg(orgSysDataTransfer.getRejectMsg());
			sdt.setTransferType(orgSysDataTransfer.getTransferType());
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
			Date date = new Date();
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_archivesno_S_LK", "退文通知[" + sdf.format(date) + "]");
			//filter.addFilter("Q_toSchemaId_L_EQ", toSchema + "");
			List<SysDataTransfer> list = sysDataTransferService.getAll(filter);
			sdt.setArchivesno("退文通知[" + sdf.format(date) + "]" + (list.size() + 1)
					+ "号");
			String receiveDep = appUser.getDepartment().getDepUnitCode();
			Department dep = departmentService.get(new Long(
					receiveDep.split("_")[1]));
			String sentDep = user.getDepartment().getDepUnitCode().split("_")[0];
			if (sentDep.equals(receiveDep.split("_")[0])) {
				sdt.setReceiveType(new Integer("1"));
			} else {
				sdt.setReceiveType(new Integer("0"));
			}
			if(sysSchemaConfig.getSchemaDesc().equals("委机关OA")){
				sdt.setSendDep(dep.getDepDesc());
			}else{
				sdt.setSendDep(sysSchemaConfig.getSchemaDesc().replace("OA", ""));
			}
			sdt.setSubject(orgSysDataTransfer.getSubject());
			sdt.setArchtype(orgSysDataTransfer.getArchtype());
			sdt.setIssuerid(user.getUserId());
			sdt.setIssuer(user.getFullname());
			sdt.setPrivacylevel(orgSysDataTransfer.getPrivacylevel());
			sdt.setUrgentlevel(orgSysDataTransfer.getUrgentlevel());
			sdt.setSources(orgSysDataTransfer.getSources());
			sdt.setWrittenDate(orgSysDataTransfer.getWrittenDate());
			sdt.setReceiveDep(receiveDep);
			sdt.setFromSchema(toSchema);
			sdt.setToSchemaId(fromSchema);
			sdt.setCreateUser(user.getUsername());
			sdt.setCreateDate(new Date());
			sdt.setTransactionId(orgSysDataTransfer.getId()+"");
			sdt.setDataSource(orgSysDataTransfer.getDataSource());
			sdt.setSourceType(new Long("1"));
			sysDataTransferService.save(sdt);
//			List<SysArchivesFiles> orgSysArchivesFiles = sysArchivesFilesService
//					.findByDataId(orgSysDataTransfer.getId());
//			Iterator<SysArchivesFiles> setIt = orgSysArchivesFiles.iterator();
//			while (setIt.hasNext()) {  
//				SysArchivesFiles sysArchivesFiles = new SysArchivesFiles();
//				SysArchivesFiles s = setIt.next(); 
//				sysArchivesFiles.setDataId(sdt.getId());
//				sysArchivesFiles.setFileType(s.getFileType());
//				sysArchivesFiles.setIsFinish(s.getIsFinish());
//				sysArchivesFiles.setFileName(s.getFileName());
//				sysArchivesFiles.setFilePath(s.getFilePath());
//				sysArchivesFiles.setFileSize(s.getFileSize());
//				sysArchivesFiles.setFileByteSize(s.getFileByteSize());
//				sysArchivesFiles.setFileExtType(s.getFileExtType());
//				sysArchivesFiles.setFileDate(new Date());
//				sysArchivesFilesService.save(sysArchivesFiles);
//			}  
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	public String saveReject() {
		String archivesId = getRequest().getParameter("archivesId");
		String depId = getRequest().getParameter("depId");
		String rejectMsg = getRequest().getParameter("rejectMsg");
		String rejectType = getRequest().getParameter("rejectType");
		Archives archives = archivesService.get(new Long(archivesId));
		AppUser user = ContextUtil.getCurrentUser();
		//1、保存退文记录
		SysDataTransfer sdt = new SysDataTransfer();
		Department dept = departmentService.get(new Long(depId));
		Long fromSchema = user.getOwnerSchemaId();
		SysDepartmentConfig sysDepartmentConfig = sysDepartmentConfigService
				.findByDepId(new Long(depId));
		Long toSchema = sysDepartmentConfig.getSchemaId();
		sdt.setReceiveFlag(new Long("0"));
		sdt.setArchivesId(new Long(archivesId));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		Date date = new Date();
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_archivesno_S_LK", "退文通知[" + sdf.format(date) + "]");
		//filter.addFilter("Q_toSchemaId_L_EQ", toSchema + "");
		List<SysDataTransfer> list = sysDataTransferService.getAll(filter);
		sdt.setArchivesno("退文通知[" + sdf.format(date) + "]" + (list.size() + 1)
				+ "号");
		String receiveDep = dept.getDepUnitCode();
		Department dep = departmentService.get(new Long(
				receiveDep.split("_")[1]));
		String sentDep = user.getDepartment().getDepUnitCode().split("_")[0];
		if (sentDep.equals(receiveDep.split("_")[0])) {
			sdt.setReceiveType(new Integer("1"));
		} else {
			sdt.setReceiveType(new Integer("0"));
		}
		sdt.setSendDep(dep.getDepName());
		sdt.setSubject(archives.getSubject());
		sdt.setArchtype(new Long(archives.getArchType()));
		sdt.setIssuerid(user.getUserId());
		sdt.setIssuer(user.getFullname());
		// sdt.setUpdateUser(user.getUsername());
		// sdt.setUpdateDate(new Date());
		sdt.setPrivacylevel(archives.getPrivacyLevel());
		sdt.setUrgentlevel(archives.getUrgentLevel());
		sdt.setSources(archives.getSources());
		sdt.setWrittenDate(archives.getWrittenDate());
		sdt.setReceiveDep(receiveDep);
		// sdt.setReceiveUser(""+appUser.getUserId());
		// sdt.setReceiveUserName(appUser.getUsername());
		sdt.setFromSchema(fromSchema);
		sdt.setToSchemaId(toSchema);
		sdt.setCreateUser(user.getUsername());
		sdt.setCreateDate(new Date());
		sdt.setTransactionId(null);
		sdt.setDataSource(new Long("0"));
		sdt.setSourceType(new Long("1"));
		sdt.setRejectMsg(rejectMsg);
		sdt.setTransferType(new Long(rejectType));
		sdt.setReceiveType(new Integer("0"));
		sysDataTransferService.save(sdt);
		//2、保存正文
		Set archivesDocs=archives.getArchivesDocs();
		if(archivesDocs!=null){
			Iterator docIt=archivesDocs.iterator();
			while(docIt.hasNext()){
				ArchivesDoc doc=(ArchivesDoc)docIt.next();
				FileAttach fa=doc.getFileAttach();
				SysArchivesFiles sysArchivesFiles = new SysArchivesFiles();
				sysArchivesFiles.setDataId(sdt.getId());
				sysArchivesFiles.setFileType(new Long("1"));
				sysArchivesFiles.setFileVersion(Long.valueOf(doc.getVersion()));
				sysArchivesFiles.setIsFinish(doc.getIsFinish());
				sysArchivesFiles.setFileName(fa.getFileName());
				sysArchivesFiles.setFilePath(fa.getFilePath());
				sysArchivesFiles.setFileSize(fa.getNote());
				sysArchivesFiles.setFileByteSize(fa.getTotalBytes());
				sysArchivesFiles.setFileExtType(fa.getExt());
				sysArchivesFiles.setFileDate(new Date());
				sysArchivesFilesService.save(sysArchivesFiles);
			}
		}
		//3、保存附件
		Set archivesFiles=archives.getArchivesFiles();
		if(archivesFiles!=null){
			Iterator fileIt=archivesFiles.iterator();
			while(fileIt.hasNext()){
				FileAttach fa=(FileAttach)fileIt.next();
				SysArchivesFiles sysArchivesFiles = new SysArchivesFiles();
				sysArchivesFiles.setDataId(sdt.getId());
				sysArchivesFiles.setFileType(new Long("2"));
				sysArchivesFiles.setFileVersion(null);
				sysArchivesFiles.setIsFinish(new Short("0"));
				sysArchivesFiles.setFileName(fa.getFileName());
				sysArchivesFiles.setFilePath(fa.getFilePath());
				sysArchivesFiles.setFileSize(fa.getNote());
				sysArchivesFiles.setFileByteSize(fa.getTotalBytes());
				sysArchivesFiles.setFileExtType(fa.getExt());
				sysArchivesFiles.setFileDate(new Date());
				sysArchivesFilesService.save(sysArchivesFiles);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	public String save() {
		AppUser user = ContextUtil.getCurrentUser();
		FileAttach fa = new FileAttach();
		String docs = getRequest().getParameter("docs");
		String fields = getRequest().getParameter("fileIds");
		String ids = getRequest().getParameter("ids");
		List<SysArchivesFiles> orgSysArchivesFiles = null;
		Set archivesAttachments = new HashSet();
		String depIds = getRequest().getParameter("depId");
		if (depIds != null) {
			String depid="";
			String[] depids = depIds.split(",");
			for (String depId : depids) {
				Department depart=departmentService.get(Long.valueOf(depId));
				if(depart!=null&&depart.getDepLevel()==2
						&& depart.getDepId() != 100130){ // 委机关直接发送到委机关){
					List<Department> departList=departmentService.findByParentId(depart.getDepId());
					for(Department department:departList){
						depid+=department.getDepId()+",";
					}
				}else{
					depid+=depId+",";
				}
			}
			if(depid!=""){
				depid=depid.substring(0,depid.length()-1);
				depIds=depid;
			}
		}
		String depUnitCode = null;
		Long schemaId;
		int receiveType = 0;
		if (depIds != null) {
			String[] depids = depIds.split(",");
			for (String depId : depids) {
				SysDataTransfer newSysDataTransfer = new SysDataTransfer();
				try {
					BeanUtil.copyNotNullProperties(newSysDataTransfer,
							sysDataTransfer);
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				}
				newSysDataTransfer.setId(null);
				if (null != depId && "" != depId) {
					depUnitCode = departmentService.get(new Long(depId))
							.getDepUnitCode();
					int isExternal = departmentService.get(new Long(depId))
							.getIsExternal();
					int sentIsExternal = user.getDepartment().getIsExternal();
					if (isExternal == 0) {
						if (sentIsExternal == isExternal) {
							receiveType = 1;
						} else {
							receiveType = 0;
						}
					} else if (isExternal == 1)
						receiveType = 0;
					else
						receiveType = 2;
					newSysDataTransfer.setReceiveDep(depUnitCode);
				}
				newSysDataTransfer.setReceiveType(receiveType);// 为receiveType赋值
				if (null != depUnitCode && "" != depUnitCode) {
					schemaId = sysDepartmentConfigService.findByDepCode(
							depUnitCode).getSchemaId();
					newSysDataTransfer.setToSchemaId(schemaId);
				}
				SysUserAll sysUserAll = sysUserAllService.findByUserName(user
						.getUsername());
				orgSysArchivesFiles = sysArchivesFilesService
						.findByDataId(sysDataTransfer.getId());

				// 是不同Schema 且 是他们是上下级关系，需要在待收公文里面查看
				if (newSysDataTransfer.getToSchemaId() != null
						&& sysUserAll.getSchemaId() != null
						&& newSysDataTransfer.getToSchemaId().longValue() != sysUserAll
								.getSchemaId().longValue()) {
					if (user.getDepartment()
							.getPath()
							.contains(
									departmentService.get(new Long(depId))
											.getDepId() + "")
							|| departmentService
									.get(new Long(depId))
									.getPath()
									.contains(
											user.getDepartment().getDepId()
													+ "")) {
						receiveType = 0;
						newSysDataTransfer.setReceiveType(receiveType);// 为receiveType赋值
					}
				}

				// sysDataTransfer.setSysArchivesFiless(archivesAttachments);
				newSysDataTransfer.setCreateUser(user.getUsername());
				newSysDataTransfer.setCreateDate(new Date());
				newSysDataTransfer.setUpdateUser(user.getUsername());
				newSysDataTransfer.setUpdateDate(new Date());
				newSysDataTransfer.setFromSchema(sysUserAll.getSchemaId());
				newSysDataTransfer.setArchtype(new Long(0));// 添加默认值
				sysDataTransferService.save(newSysDataTransfer);
				Long dataId = newSysDataTransfer.getId();
				// 保存公文正文，FileType为1
				if (StringUtils.isNotEmpty(docs)) {
					Gson gson = new GsonBuilder()
							.excludeFieldsWithoutExposeAnnotation()
							.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
					FileAttach[] fileAttach = gson.fromJson(docs,
							FileAttach[].class);
					if (fileAttach != null) {
						for (int i = 0; i < fileAttach.length; i++) {
							SysArchivesFiles sysArchivesFiles = new SysArchivesFiles();
							mapSysArchivesFiles(fileAttach[i].getId(),
									new Long(1), dataId, sysArchivesFiles);
							sysArchivesFilesService.save(sysArchivesFiles);
						}
					}
				}
				// 保存公文附件，FileType为2
				if (StringUtils.isNotEmpty(fields)) {
					String[] files = fields.split(",");
					if (files.length > 0) {
						for (int i = 0; i < files.length; i++) {
							SysArchivesFiles sysArchivesFiles = new SysArchivesFiles();
							mapSysArchivesFiles(Long.valueOf(files[i]),
									new Long(2), dataId, sysArchivesFiles);
							sysArchivesFilesService.save(sysArchivesFiles);
						}
					}
				}
			}
		}
		
		Long id=sysDataTransfer.getId();
		if(id!=null){//删除原有数据
			sysDataTransferHisService.deleteHis(id);
			sysArchivesFilesService.removeById(null, id, null);
			sysDataTransferService.remove(id);
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	public String reject() {
		return SUCCESS;
	}
	public String verfity(){
		String dataId = getRequest().getParameter("dataId");
		SysDataTransfer sysDataTransfer = sysDataTransferService.get(Long
				.parseLong(dataId));
		if(sysDataTransfer!=null){
			QueryFilter filter = new QueryFilter();
			PagingBean pageBean = new PagingBean(0, 100);
			filter.setPagingBean(pageBean);
			filter.getPagingBean().setPageSize(100000);
			String archivesNo=sysDataTransfer.getArchivesno();
			filter.addFilter("Q_depSignNo_S_EQ", archivesNo);
			List<Archives> list=archivesService.getAll(filter);
			if(list!=null&&list.size()>0){
				jsonString = "{success:false,\"message\":\"该公文已收文，\"}";
			}else{
				jsonString = "{success:true,\"message\":\"\"}";
			}
		}else{
			jsonString = "{success:true,\"message\":\"\"}";
		}
		return SUCCESS;
	}
	/**
	 * 接受公文
	 * 
	 * @throws IOException
	 */
	public String receive() throws IOException {
		String dataId = getRequest().getParameter("dataId");
		String defId = getRequest().getParameter("defId");
		String defName = getRequest().getParameter("defName");
		if (StringUtils.isBlank(dataId)) {
			setJsonString("{success:false}");
			return Action.ERROR;
		}
		SysDataTransfer sysDataTransfer = sysDataTransferService.get(Long
				.parseLong(dataId));
		Archives archives = new Archives();

		saveHis(sysDataTransfer);// 保存历史信息

		mapArchives(sysDataTransfer, archives);
		List<SysArchivesFiles> fileList = new ArrayList<SysArchivesFiles>();
		Set<ArchivesDoc> docSet = new HashSet<ArchivesDoc>();
		Set archivesAttendSet = new HashSet();
		Iterator<SysArchivesFiles> itr = sysDataTransfer.getSysArchivesFiless()
				.iterator();
		while (itr.hasNext()) {
			SysArchivesFiles archivefile = itr.next();
			fileList.add(archivefile);
		}
		mapArchivesDoc(archives, fileList, docSet, archivesAttendSet);
		archives.setArchivesDocs(docSet);
		archives.setArchivesFiles(archivesAttendSet);
		if (archives.getFileCounts() == null) {
			archives.setFileCounts(docSet.size());
		}
		if (archives.getArchivesNo() == null
				|| "".equals(archives.getArchivesNo())) {
			archives.setArchivesNo("0");
		}
		archives.setStatus(Archives.STATUS_ISSUE);
		archives.setRecDepIds(defId);
		archives.setRecDepNames(defName);
		archives.setIsdraft(1l);
		archives.setProcessRun(null);
		Long userId = sysDataTransfer.getIssuerid();
		AppUser user = appUserService.get(userId);
		if (user != null && user.getDepartment() != null) {
			archives.setDepId(user.getDepartment().getDepId());
		}
		archivesService.save(archives);
		sysDataTransfer.setReceiveFlag(1l);
		sysDataTransfer.setReceiveUser(ContextUtil.getCurrentUser()
				.getUsername());
		sysDataTransfer.setReceiveUserName(ContextUtil.getCurrentUser()
				.getFullname());
		sysDataTransfer.setReceiveDate(new Date());
		sysDataTransferService.save(sysDataTransfer);
		jsonString = "{success:true,\"archivesId\":" + archives.getArchivesId()
				+ "}";
		return SUCCESS;
	}

	/**
	 * 做对应关系
	 * 
	 * @param sysDataTransfer
	 * @param archives
	 */
	private void mapArchives(SysDataTransfer sysDataTransfer, Archives archives) {
		archives.setArchType(Archives.ARCHIVE_TYPE_RECEIVE);
		archives.setIssuerId(ContextUtil.getCurrentUserId());
		archives.setIssuer(ContextUtil.getCurrentUser().getFullname());
		archives.setIssueDep(sysDataTransfer.getSendDep());
		archives.setDepSignNo(sysDataTransfer.getArchivesno());
		archives.setSubject(sysDataTransfer.getSubject());
		archives.setPrivacyLevel(sysDataTransfer.getPrivacylevel());
		archives.setUrgentLevel(sysDataTransfer.getUrgentlevel());
		ArchivesType archivesType = archivesTypeService
				.findTypeByName(sysDataTransfer.getSources());
		archives.setArchivesType(archivesType);
		archives.setWrittenDate(sysDataTransfer.getWrittenDate());
		archives.setIssueDate(new Date());
		archives.setCreatetime(new Date());
		archives.setProcessRun(null);
	}

	/**
	 * mapping doc
	 * 
	 * @throws IOException
	 */
	private void mapArchivesDoc(Archives archives,
			List<SysArchivesFiles> fileList, Set docSet, Set archivesAttendSet)
			throws IOException {
		AppUser user = ContextUtil.getCurrentUser();
		for (SysArchivesFiles archFile : fileList) {
			FileAttach attach = new FileAttach();
			if (archFile.getFileType() == 1) {
				if (archFile.getIsFinish() != null) {
					if (archFile.getIsFinish() == 1) {
						attach.setFileName(archFile.getFileName());
						String filePath = getNewFileName(archFile);
						if (StringUtils.isBlank(filePath))
							continue;
						attach.setFilePath(filePath);
						attach.setFileType(archFile.getFileType() == 1 ? "others"
								: "document");
						attach.setNote(archFile.getFileSize());
						attach.setTotalBytes(archFile.getFileByteSize());
						attach.setExt(archFile.getFileExtType());
						attach.setCreatetime(new Date());
						attach.setCreator(user.getFullname());
						attach.setVersion(ArchivesDoc.ORI_VERSION);
						fileAttachService.save(attach);
					}
				}
			} else {
				attach.setFileName(archFile.getFileName());
				String filePath = getNewFileName(archFile);
				if (StringUtils.isBlank(filePath))
					continue;
				attach.setFilePath(filePath);
				attach.setFileType(archFile.getFileType() == 1 ? "others"
						: "document");
				attach.setNote(archFile.getFileSize());
				attach.setTotalBytes(archFile.getFileByteSize());
				attach.setExt(archFile.getFileExtType());
				attach.setCreatetime(new Date());
				attach.setCreator(user.getFullname());
				attach.setVersion(ArchivesDoc.ORI_VERSION);
				fileAttachService.save(attach);
			}
			if (archFile.getFileType() == 1) {
				if (archFile.getIsFinish() != null
						&& archFile.getIsFinish() == 1) {
					ArchivesDoc doc = new ArchivesDoc();
					doc.setFileAttach(attach);
					doc.setDocName(archFile.getFileName());
					doc.setDocPath(getNewFileName(archFile));
					doc.setCreator(user.getFullname());
					doc.setCreatorId(user.getUserId());
					doc.setCurVersion(1);
					doc.setDocStatus(Short.parseShort(Integer.toString(1)));// 默认修改完成保存short类型数据0：修改中，1：修改完成
					doc.setCreatetime(new Date());
					doc.setUpdatetime(new Date());
					doc.setIsFinish((short) 0);
					doc.setArchives(null);
					archivesDocService.save(doc);
					// 新增文件同时在历史表增加一历史记录
					DocHistory newHistory = new DocHistory();
					newHistory.setArchivesDoc(doc);
					newHistory.setFileAttach(attach);
					newHistory.setDocName(doc.getDocName());
					newHistory.setPath(doc.getDocPath());
					newHistory.setVersion(ArchivesDoc.ORI_VERSION);
					newHistory.setUpdatetime(new Date());
					newHistory.setMender(user.getFullname());
					newHistory.setUpdatetime(new Date());
					docHistoryService.save(newHistory);
					docSet.add(doc);
				}
			} else {
				archivesAttendSet.add(attach);
			}

		}
	}

	private String getNewFileName(SysArchivesFiles archivefile)
			throws IOException {
		if (StringUtils.isBlank(archivefile.getFilePath()))
			return null;
		String sourceRealPath = this
				.getRequest()
				.getSession()
				.getServletContext()
				.getRealPath(
						Constants.UPLOAD_ROOT_PATH + "/"
								+ archivefile.getFilePath());
		File file = new File(sourceRealPath);
		if (!file.exists())
			return null;
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMM");
		String filePath = Constants.UPLOAD_ROOT_PATH + "/"
				+ ContextUtil.getCurrentUser().getOwnerSchema().toLowerCase()
				+ (archivefile.getFileType() == 1 ? "/others" : "/document")
				+ "/" + formatter.format(new Date());
		String realPath = getRequest().getSession().getServletContext()
				.getRealPath(filePath);
		file = new File(realPath);
		if (!file.exists())
			file.mkdirs();
		filePath = filePath + "/"
				+ java.util.UUID.randomUUID().toString().replaceAll("-", "")
				+ "." + archivefile.getFileExtType();
		realPath = getRequest().getSession().getServletContext()
				.getRealPath(filePath);
		FileInputStream inputStream = null;
		FileOutputStream outStream = null;
		try {
			inputStream = new FileInputStream(sourceRealPath);

			outStream = new FileOutputStream(realPath);
			byte[] buffer = new byte[1024];
			int num = 0;
			while ((num = inputStream.read(buffer)) > 0) {
				outStream.write(buffer, 0, num);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (null != inputStream)
				inputStream.close();
			if (null != outStream)
				outStream.close();
		}
		filePath = filePath.replace(Constants.UPLOAD_ROOT_PATH + "/", "");
		return filePath;
	}

	/**
	 * 公文正文文档更新
	 */
	public String addDocFiles() {
		String doc = getRequest().getParameter("doc");
		id = Long.parseLong(getRequest().getParameter("id"));
		sysDataTransfer = sysDataTransferService.get(id);
		if (StringUtils.isNotEmpty(doc) && id != null) {
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			SysArchivesFiles sysArchivesFiles = gson.fromJson(doc,
					SysArchivesFiles.class);
			Set sysArchivesFilesSet = sysDataTransfer.getSysArchivesFiless();
			Date now = new Date();
			if (sysArchivesFiles != null) {
				if (sysArchivesFiles.getId() == null
						|| sysArchivesFiles.getId() == 0) {
					sysArchivesFiles.setId(null);
					sysArchivesFiles.setFileType(new Long(1));
					sysArchivesFiles.setFileDate(now);
					sysArchivesFiles = sysArchivesFilesService
							.save(sysArchivesFiles);
				} else {
					sysArchivesFiles = sysArchivesFilesService
							.get(sysArchivesFiles.getId());
				}
				sysArchivesFilesSet.add(sysArchivesFiles);
			}
			sysArchivesFiles = sysArchivesFilesService.save(sysArchivesFiles);
		}
		return SUCCESS;
	}

	/**
	 * 对公文附件进行map
	 * 
	 * @param id
	 *            根据id查找FileAttach表中数据
	 * @param type
	 *            区别公文正文和附件
	 * @param sysArchivesFiles
	 *            要保持的资料
	 */
	private void mapSysArchivesFiles(Long id, Long type, Long dataId,
			SysArchivesFiles sysArchivesFiles) {
		FileAttach fa = new FileAttach();
		fa = fileAttachService.get(id);
		sysArchivesFiles.setDataId(dataId);
		sysArchivesFiles.setFileType(type);
		sysArchivesFiles.setIsFinish((short) 1);
		sysArchivesFiles.setFileName(fa.getFileName());
		sysArchivesFiles.setFilePath(fa.getFilePath());
		sysArchivesFiles.setFileSize(fa.getNote());
		sysArchivesFiles.setFileByteSize(fa.getTotalBytes());
		sysArchivesFiles.setFileExtType(fa.getExt());
		sysArchivesFiles.setFileDate(new Date());
	}

	/**
	 * 将SysDataTransfer中相应的值设置到SysDataTransferHis中
	 * 
	 * @param sysDataTransfer
	 * @param sysDataTransferHis
	 */
	private void mapSysDataTransferHis(SysDataTransfer sysDataTransfer,
			SysDataTransferHis sysDataTransferHis) {
		sysDataTransferHis.setHisId(sysDataTransfer.getId());
		sysDataTransferHis.setArchivesId(sysDataTransfer.getArchivesId());
		sysDataTransferHis.setArchivesno(sysDataTransfer.getArchivesno());
		sysDataTransferHis.setSendDep(sysDataTransfer.getSendDep());
		sysDataTransferHis.setSubject(sysDataTransfer.getSubject());
		sysDataTransferHis.setArchtype(sysDataTransfer.getArchtype());
		sysDataTransferHis.setIssuerid(sysDataTransfer.getIssuerid());
		sysDataTransferHis.setIssuer(sysDataTransfer.getIssuer());
		sysDataTransferHis.setPrivacylevel(sysDataTransfer.getPrivacylevel());
		sysDataTransferHis.setUrgentlevel(sysDataTransfer.getUrgentlevel());
		sysDataTransferHis.setSources(sysDataTransfer.getSources());
		sysDataTransferHis.setWrittenDate(sysDataTransfer.getWrittenDate());
		sysDataTransferHis.setReceiveDep(sysDataTransfer.getReceiveDep());
		sysDataTransferHis.setTransferType(sysDataTransfer.getTransferType());
		sysDataTransferHis.setFromSchema(sysDataTransfer.getFromSchema());
		sysDataTransferHis.setToSchemaId(sysDataTransfer.getToSchemaId());
		sysDataTransferHis.setReceiveDate(sysDataTransfer.getReceiveDate());
		sysDataTransferHis.setReceiveFlag(sysDataTransfer.getReceiveFlag());
		sysDataTransferHis.setRejectMsg(sysDataTransfer.getRejectMsg());
		sysDataTransferHis.setCreateUser(sysDataTransfer.getCreateUser());
		sysDataTransferHis.setCreateDate(sysDataTransfer.getCreateDate());
		sysDataTransferHis.setTransactionId(sysDataTransfer.getTransactionId());
		sysDataTransferHis.setReceiveUser(sysDataTransfer.getReceiveUser());
		sysDataTransferHis.setReceiveUserName(sysDataTransfer
				.getReceiveUserName());
		sysDataTransferHis.setDataSource(sysDataTransfer.getDataSource());
		sysDataTransferHis.setUpdateUser(sysDataTransfer.getUpdateUser());
		sysDataTransferHis.setUpdateDate(sysDataTransfer.getUpdateDate());
		sysDataTransferHis.setReceiveType(sysDataTransfer.getReceiveType());
	}

	/**
	 * 将sysArchivesFiles中相应的值设置到sysArchivesFilesHis中
	 * 
	 * @param sysArchivesFiles
	 * @param sysArchivesFilesHis
	 */
	private void mapSysArchivesFilesHis(SysArchivesFiles sysArchivesFiles,
			SysArchivesFilesHis sysArchivesFilesHis) {
		sysArchivesFilesHis.setDataId(null);
		sysArchivesFilesHis.setFileType(sysArchivesFiles.getFileType());
		sysArchivesFilesHis.setFileVersion(sysArchivesFiles.getFileVersion());
		sysArchivesFilesHis.setFileName(sysArchivesFiles.getFileName());
		sysArchivesFilesHis.setFilePath(sysArchivesFiles.getFilePath());
		sysArchivesFilesHis.setFileSize(sysArchivesFiles.getFileSize());
		sysArchivesFilesHis.setFileByteSize(sysArchivesFiles.getFileByteSize());
		sysArchivesFilesHis.setFileExtType(sysArchivesFiles.getFileExtType());
		sysArchivesFilesHis.setFileDate(sysArchivesFiles.getFileDate());
	}

	/**
	 * 保存草稿
	 * 
	 * @param sysDataTransfer
	 */
	private void saveHis(SysDataTransfer sysDataTransfer) {
		SysDataTransferHis sysDataTransferHis = new SysDataTransferHis();
		mapSysDataTransferHis(sysDataTransfer, sysDataTransferHis);
		sysDataTransferHisService.save(sysDataTransferHis);
		Long dataIdHis = sysDataTransferHis.getId();
		List<SysArchivesFiles> list = sysArchivesFilesService
				.findByDataId(sysDataTransferHis.getHisId());
		for (int i = 0; i < list.size(); i++) {
			SysArchivesFilesHis sysArchivesFilesHis = new SysArchivesFilesHis();
			SysArchivesFiles sysArchivesFiles = new SysArchivesFiles();
			sysArchivesFiles = list.get(i);
			mapSysArchivesFilesHis(sysArchivesFiles, sysArchivesFilesHis);
			sysArchivesFilesHis.setDataId(dataIdHis);
			sysArchivesFilesHisService.save(sysArchivesFilesHis);
		}
	}

	/**
	 * 显示列表
	 * 
	 * @throws ParseException
	 */
	public String listReceiveDownload() throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		AppUser user = ContextUtil.getCurrentUser();
		String userame = null;
		if (!user.getIsAdmin()) {
			userame = user.getUsername();
		}
		String createtime = getRequest().getParameter("Q_createDate_D_GE");
		String endtime = getRequest().getParameter("Q_createDate_D_LE");
		Date sdt = null;
		Date edt = null;
		if (null != createtime && !"".equals(createtime))
			sdt = sdf.parse(createtime);
		if (null != endtime && !"".equals(endtime))
			edt = sdf.parse(endtime);
		String subject = getRequest().getParameter("Q_subject_S_LK");
		String archivesno = getRequest().getParameter("Q_archivesno_S_LK");
		String archtype = getRequest().getParameter("Q_archtype_L_EQ");
		List<SysDataTransfer> list = sysDataTransferService.getReceiveDownload(
				start, limit, subject, archivesno, sdt, edt, userame,archtype);
		for (SysDataTransfer dep : list) {
			Long schemaId = dep.getFromSchema();
			Long archivesId = dep.getArchivesId();
			Long runid = null;
			String schemacode = null;
			if (null != schemaId) {
				SysSchemaConfig schema = sysSchemaConfigService.get(schemaId);
				schemacode = schema.getSchemaCode();
				runid = archivesService.getrun(archivesId, schemacode);
			}
			String depcode = dep.getReceiveDep();
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
			dep.setConfs(department);
			dep.setRunid(runid);
			dep.setSchemacode(schemacode);
			String userName = dep.getCreateUser();
			if (StringUtils.isNotBlank(userName)) {
				AppUser appuser = appUserService.findByUserName(userName);
				if (null != appuser) {
					dep.setCreateUserFullName(appuser.getFullname());
				}
			}
		}
		Long count = sysDataTransferService.count(subject, archivesno, sdt,
				edt, userame,archtype);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), "receiveDate",
				"createDate");
		json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量下载
	 * 
	 * @return
	 */
	public String check() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				sysDataTransferService.updateDownload(new Long(id));
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * 调用搜索引擎显示列表
	 * 
	 * @throws ParseException
	 */
	public String listReceiveDownloadJW() throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		AppUser user = ContextUtil.getCurrentUser();
		String userame = null;
		if (!user.getIsAdmin()) {
			userame = user.getUsername();
		}
		String createtime = getRequest().getParameter("Q_createDate_D_GE");
		String endtime = getRequest().getParameter("Q_createDate_D_LE");
		Date sdt = null;
		Date edt = null;
		if (null != createtime && !"".equals(createtime))
			sdt = sdf.parse(createtime);
		if (null != endtime && !"".equals(endtime))
			edt = sdf.parse(endtime);
		String subject = getRequest().getParameter("Q_subject_S_LK");
		String archivesno = getRequest().getParameter("Q_archivesno_S_LK");
		List<SysDataTransfer> list = sysDataTransferService
				.getReceiveDownloadJW(start, limit, subject, archivesno, sdt,
						edt, userame);
		for (SysDataTransfer dep : list) {
			Long schemaId = dep.getFromSchema();
			Long archivesId = dep.getArchivesId();
			Long runid = null;
			String schemacode = null;
			if (null != schemaId) {
				SysSchemaConfig schema = sysSchemaConfigService.get(schemaId);
				schemacode = schema.getSchemaCode();
				runid = archivesService.getrun(archivesId, schemacode);
			}
			String depcode = dep.getReceiveDep();
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
			dep.setConfs(department);
			dep.setRunid(runid);
			dep.setSchemacode(schemacode);
			String userName = dep.getCreateUser();
			if (StringUtils.isNotBlank(userName)) {
				AppUser appuser = appUserService.findByUserName(userName);
				if (null != appuser) {
					dep.setCreateUserFullName(appuser.getFullname());
				}
			}
		}
		int count = sysDataTransferService.count(start, limit, subject,
				archivesno, sdt, edt, userame);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), "receiveDate",
				"createDate");
		json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String listJW() {
		String queryType = this.getRequest().getParameter("queryType");
		if (StringUtils.isBlank(queryType))
			queryType = "send";
		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysUserAll sysUserAll = sysUserAllService.findByUserName(user
				.getUsername());
		Long userdepId = user.getDepartment().getDepId();
		List<Department> deplist = departmentService.findByParentId(userdepId);
		Department deplist2 = departmentService.get(userdepId);
		deplist.add(deplist2);
		for (Department deplist3 : deplist) {
			String depcode = deplist3.getDepUnitCode();
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
		}
		if (!user.getIsAdmin()) {
			if (queryType.equals("send")) {
				filter.addFilter("Q_issuerid_L_EQ", user.getUserId().toString());
				filter.addFilter("Q_fromSchema_L_EQ", sysUserAll.getSchemaId()
						.toString());
				filter.addFilter("Q_dataSource_L_EQ", "1");
			}/*
			 * else if(user.getUserId()==100188){
			 * filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
			 * .toString()); filter.addFilter("Q_receiveDep_S_EQ",
			 * "WJGOA_100130"); }
			 */else {
				filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
						.toString());
				filter.addFilter("Q_receiveType_N_LE", "0");
			}
		}
		filter.addSorted("createDate", "desc");
		List<SysDataTransfer> list = sysDataTransferService.getAll(filter);
		List<SysDataTransfer> list1 = new ArrayList<SysDataTransfer>();
		for (SysDataTransfer dep : list) {
			Long schemaId = dep.getFromSchema();
			Long archivesId = dep.getArchivesId();
			Long runid = null;
			String schemacode = null;
			if (null != schemaId) {
				SysSchemaConfig schema = sysSchemaConfigService.get(schemaId);
				schemacode = schema.getSchemaCode();
				runid = archivesService.getrun(archivesId, schemacode);
			}
			String depcode = dep.getReceiveDep();
			SysDepartmentConfig department = sysDepartmentConfigService
					.findByDepCode(depcode);
			dep.setConfs(department);
			dep.setRunid(runid);
			dep.setSchemacode(schemacode);
			String userName = dep.getCreateUser();
			if (StringUtils.isNotBlank(userName)) {
				AppUser appuser = appUserService.findByUserName(userName);
				if (null != appuser) {
					dep.setCreateUserFullName(appuser.getFullname());
				}
			}
		}
		Type type = new TypeToken<List<SysDataTransfer>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		/*
		 * Gson gson=new Gson(); buff.append(gson.toJson(list, type));
		 * buff.append("}");
		 */
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"receiveDate", "createDate");
		json.transform(new DateTransformer("yyyy-MM-dd"), "writtenDate");
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 监控列表发送信息 add by sicen.liu 2014/12/4
	 * 
	 * @return
	 */
	public String noticeMsg() {
		AppUser currentUser = ContextUtil.getCurrentUser();
		String schemaId = this.getRequest().getParameter("schemaId");
		String sourceType = getRequest().getParameter("sourceType");
		String content = getRequest().getParameter("content");
		String archDepId = getRequest().getParameter("archDepId");
		String receiveType = getRequest().getParameter("receiveType");
		List<AppUser> appUserList = new ArrayList<AppUser>();
		SysSchemaConfig sysSchemaConfig = sysSchemaConfigService.get(new Long(
				schemaId));
		String schemacode = sysSchemaConfig.getSchemaCode();
		if (sourceType != null && "2".equals(sourceType)) {
			AppUser appUser = appUserService.findByNameAndSchema(schemacode,
					archDepId);
			appUserList.add(appUser);
		} else {
			if (receiveType != null && "0".equals(receiveType)) {
				Department depart = departmentService.get(new Long(archDepId));
				SysConfig SysConfig = sysConfigService.findDataValueByTkCkey(
						"systemRoleConfig", "ArchivesReceiveRoleID");
				appUserList = appUserService.findByDepPathAndSchema(schemacode,
						depart.getPath(), new Long(SysConfig.getDataValue()));
			} else {
				Department depart = departmentService.get(new Long(archDepId));
				appUserList = appUserService.findByDepPathAndSchema(schemacode,
						depart.getPath(), 1264102L);
			}
		}
		for (AppUser au : appUserList) {
			if (au.getMobile() != null && au.getMobile() != "") {
				SmsMobile sm = new SmsMobile();
				sm.setPhoneNumber(au.getMobile());
				sm.setRecipients(au.getFullname());
				sm.setRecipientsId(au);
				sm.setSendTime(new Date());
				sm.setSmsContent(content);
				sm.setStatus((short) 0);
				sm.setUserId(currentUser.getUserId());
				sm.setUserName(currentUser.getUsername());
				smsMobileServie.save(sm);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

}
