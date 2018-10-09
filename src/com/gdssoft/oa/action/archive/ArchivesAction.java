package com.gdssoft.oa.action.archive;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jbpm.api.ProcessInstance;

import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.action.system.LoginAction;
import com.gdssoft.oa.model.archive.ArchHasten;
import com.gdssoft.oa.model.archive.ArchRecUser;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesAttend;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.ArchivesDocExt;
import com.gdssoft.oa.model.archive.DocExtHistory;
import com.gdssoft.oa.model.archive.DocHistory;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.model.archive.OdFlowtype;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.snconfig.FileSnConfig;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.service.archive.ArchHastenService;
import com.gdssoft.oa.service.archive.ArchRecUserService;
import com.gdssoft.oa.service.archive.ArchivesAttendService;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.archive.ArchivesDocExtService;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.DocExtHistoryService;
import com.gdssoft.oa.service.archive.DocHistoryService;
import com.gdssoft.oa.service.archive.OdArchivesccService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.FlowTaskReportService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.oa.service.snconfig.FileSnConfigService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysArchivesFilesHisService;
import com.gdssoft.oa.service.system.SysArchivesFilesService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysDataTransferHisService;
import com.gdssoft.oa.service.system.SysDataTransferService;
import com.gdssoft.oa.util.ArchiveNoGenerator;
import com.gdssoft.oa.util.StringUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class ArchivesAction extends BaseAction {
	@Resource
	private ArchivesService archivesService;
	@Resource
	private OdArchivesccService odarchivesccService;
	@Resource
	private ArchivesDocService archivesDocService;
	@Resource
	private ArchivesDocExtService archivesDocExtService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private ArchivesDepService archivesDepService;
	@Resource
	private FileSnConfigService fileSnConfigService;
	
	private Archives archives;
	private OdArchivescc odarchivescc;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private DocHistoryService docHistoryService;
	@Resource
	private DocExtHistoryService docExtHistoryService;
	@Resource
	private ArchRecUserService archRecUserService;
	@Resource
	private TaskService taskservice;
	@Resource
	private ShortMessageService messageService;
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private ArchHastenService archHastenService;
	@Resource
	private ArchivesAttendService archivesAttendService;
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private FlowTaskReportService flowTaskReportService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	private SysDataTransferService sysDataTransferService;
	@Resource
	private SysDataTransferHisService sysDataTransferHisService;
	@Resource
	private SysArchivesFilesService sysArchivesFilesService;
	private Long archivesId;
	private Log logger = LogFactory.getLog(ArchivesAction.class);

	// private Map<String,String> depIdNameMap = new HashMap<String,String>();

	public Long getArchivesId() {
		return archivesId;
	}

	public void setArchivesId(Long archivesId) {
		this.archivesId = archivesId;
	}

	public Archives getArchives() {
		return archives;
	}

	public void setArchives(Archives archives) {
		this.archives = archives;
	}

	public OdArchivescc getOdarchivescc() {
		return odarchivescc;
	}

	public void setOdarchivescc(OdArchivescc odarchivescc) {
		this.odarchivescc = odarchivescc;
	}

	/**
	 * 显示规范性发文列表
	 */
	public String listIsStandardSentStore() {
		QueryFilter filter = new QueryFilter(getRequest());
		String archiveType = getRequest().getParameter("archiveType");
		String subject = getRequest().getParameter("subject");
		String defId = getRequest().getParameter("defId");
		String issuedep = getRequest().getParameter("issuedep");
		String orgdepId = getRequest().getParameter("orgdepId");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String archiveNo = getRequest().getParameter("archiveNo");
		String privacyLevel = getRequest().getParameter("privacyLevel");
		String snConfigId = getRequest().getParameter("snConfigId");
		String urgentLevel = getRequest().getParameter("urgentLevel");
		Long defid = null;
		if (defId != null && !"".equals(defId))
			defid = new Long(defId);
		Long snConfigid = null;
		if (snConfigId != null && !"".equals(snConfigId))
			snConfigid = new Long(snConfigId);
		List<FlowTaskReport> list = archivesService.getIsStandardFinishedFlow(
				Integer.parseInt(archiveType), subject, defid, issuedep,
				orgdepId, startDate, endDate, archiveNo, privacyLevel,
				urgentLevel, snConfigid, filter.getPagingBean().getStart(), 25);
		int totalCounts = 0;
		if (null != list && list.size() > 0)
			totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"archCreateTime", "signDate", "writtenDate", "issueDate",
				"standardApproveDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}
	
	/**
	 * 交委行政、党委规范性文件列表
	 * 
	 * @return
	 */
	public String listIsStandardSentStoreJW() {
		QueryFilter filter = new QueryFilter(getRequest());
		String archiveType = getRequest().getParameter("archiveType");
		String subject = getRequest().getParameter("subject");
		String defId = getRequest().getParameter("defId");
		String issuedep = getRequest().getParameter("issuedep");
		String orgdepId = getRequest().getParameter("orgdepId");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String archiveNo = getRequest().getParameter("archiveNo");
		String privacyLevel = getRequest().getParameter("privacyLevel");
		String snConfigId = getRequest().getParameter("snConfigId");
		String urgentLevel = getRequest().getParameter("urgentLevel");
		// 是否是规范性文件0/1
		String isStandard = getRequest().getParameter("isStandard");
		//规范性文件库查询类型：10：行政、11：党委、12：文件备案
		//当是文件备份时，isStandard为空
		String keywords = getRequest().getParameter("keywords");
		Long defid = null;
		if (defId != null && !"".equals(defId))
			defid = new Long(defId);
		Long snConfigid = null;
		if (snConfigId != null && !"".equals(snConfigId))
			snConfigid = new Long(snConfigId);
		Long isstandard = null;
		if (isStandard != null && !"".equals(isStandard))
			isstandard = new Long(isStandard);
		List<FlowTaskReport> list = archivesService.getIsStandardFinishedFlowJW(
				Integer.parseInt(archiveType), subject, defid, issuedep,
				orgdepId, startDate, endDate, archiveNo, privacyLevel,
				urgentLevel, snConfigid, isstandard, 
				keywords, filter.getPagingBean().getStart(), 25);
		int totalCounts = 0;
		if (null != list && list.size() > 0)
			totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"archCreateTime", "signDate", "writtenDate", "issueDate",
				"standardApproveDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String listReceiveStore() {
		QueryFilter filter = new QueryFilter(getRequest());
		String archiveType = getRequest().getParameter("archiveType");
		String subject = getRequest().getParameter("subject");
		String defId = getRequest().getParameter("defId");
		String issuedep = getRequest().getParameter("issuedep");
		String orgdepId = getRequest().getParameter("orgdepId");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String archiveNo = getRequest().getParameter("archiveNo");
		String privacyLevel = getRequest().getParameter("privacyLevel");
		String snConfigId = getRequest().getParameter("snConfigId");
		String depSignNo = getRequest().getParameter("depSignNo");
		String issuerName = getRequest().getParameter("issuerName");
		String urgentLevel = getRequest().getParameter("urgentLevel");
		String dir = getRequest().getParameter("dir");
		String sort = getRequest().getParameter("sort");
		Long defid = null;
		if (defId != null && !"".equals(defId))
			defid = new Long(defId);
		Long snConfigid = null;
		if (snConfigId != null && !"".equals(snConfigId))
			snConfigid = new Long(snConfigId);
		List<FlowTaskReport> list = archivesService.getFinishedFlow(Integer
				.parseInt(archiveType), subject,
				ContextUtil.getCurrentUserId(), defid, issuedep, orgdepId,
				startDate, endDate, archiveNo, privacyLevel, urgentLevel,
				snConfigid, depSignNo, issuerName, filter.getPagingBean()
						.getStart(), 25, dir, sort);
		int totalCounts = 0;
		if (null != list && list.size() > 0)
			totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"archCreateTime", "signDate", "writtenDate", "issueDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<Archives> list = archivesService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		JSONSerializer serializer = new JSONSerializer();

		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");

		serializer.transform(new DateTransformer("yyyy-MM-dd"), "issueDate");
		/*
		 * Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
		 * .setDateFormat("yyyy-MM-dd").create();
		 */

		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));

		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 显示当前用户可分发的公文列表
	 */
	public String cruList() {
		PagingBean pb = getInitPagingBean();
		AppUser appUser = ContextUtil.getCurrentUser();
		List<Archives> list = archivesService.findByUserOrRole(
				appUser.getUserId(), appUser.getRoles(), pb);
		Type type = new TypeToken<List<Archives>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
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
				archivesService.remove(new Long(id));
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
		Archives archives = archivesService.get(archivesId);

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archives));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String detail() {
		Archives archives = archivesService.get(archivesId);

		JSONSerializer json = new JSONSerializer();
		json.transform(
				new DateTransformer("yyyy-MM-dd"),
				new String[] { "createtime", "updatetime", "issueDate",
						"limitedDate", "writtenDate" }).include("archivesId",
				"typeName", "archivesNo", "issueDep", "subject", "status",
				"shortContent", "fileCounts", "privacyLevel", "urgentLevel",
				"issuer", "issuerId", "keywords", "sources", "archType",
				"recDepIds", "recDepNames", "isPublic", "archPrinter",
				"archChecker", "archivesType");

		StringBuffer buff = new StringBuffer("{success:true,data:");
		buff.append(json.exclude(new String[] { "class" }).serialize(archives));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 收文添加及保存操作
	 */
	public String save() {
		String arcRecfileIds = getRequest().getParameter("archivesRecfileIds");
		String archDepId = getRequest().getParameter("archDepId");
		String refileId = getRequest().getParameter("fileIds");
		String handlerUids = getRequest().getParameter("signUserIds");
		String docs = getRequest().getParameter("docs");
		AppUser appUser = ContextUtil.getCurrentUser();
		List<ArchivesDoc> orgArchDocs = null;
		if (archives.getArchivesId() == null) {
			if (archives.getArchType() == null) {
				archives.setArchType(Archives.ARCHIVE_TYPE_RECEIVE);
			}
			archives.setIssuerId(appUser.getUserId());
			archives.setIssuer(appUser.getFullname());
			archives.setHandlerUids(handlerUids);
			archives.setIssueDate(new Date());
			archives.setCreatetime(new Date());
			archives.setProcessRun(null);
		} else {
			Archives orgArchives = archivesService
					.get(archives.getArchivesId());
			Set archivesAttachments = new HashSet();
			if (StringUtils.isNotEmpty(refileId)) {
				String[] files = refileId.split(",");
				if (files.length > 0) {
					for (int i = 0; i < files.length; i++) {
						FileAttach fa = fileAttachService.get(Long
								.valueOf(files[i]));
						archivesAttachments.add(fa);
					}
				}
				archives.setArchivesFiles(archivesAttachments);
			}
			orgArchDocs = archivesDocService.findByAid(orgArchives
					.getArchivesId());
			try {
				Set archivesDoc=orgArchives.getArchivesDocs();
				BeanUtil.copyNotNullProperties(orgArchives, archives);
				archives = orgArchives;
				if(archives.getArchivesDocs().size()==0){
					archives.setArchivesDocs(archivesDoc);
				}
				if("0".equals(archives.getArchivesNo())&&"".equals(archives.getArchivesNo())){//修改编号办法
					archives.setSnConfigId(0l);
				}else{
					QueryFilter filter=new QueryFilter(getRequest());
					System.out.println(StringUtil.getNo(archives.getArchivesNo()));
					filter.addFilter("Q_snFormat_S_LK", StringUtil.getNo(archives.getArchivesNo()));
					List<FileSnConfig> list= fileSnConfigService.getAll(filter);
					
					System.out.println(list.size());
					
					if(list.size()>0){
						archives.setSnConfigId(list.get(0).getId());
					}
				}
				
				if (archives.getArchivesType().getTypeId() == null) {
					archives.setArchivesType(null);
				}
				archivesService.save(archives);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}

		// if (StringUtils.isNotEmpty(arcRecfileIds) &&
		// archives.getFileCounts()==null) {
		// archives.setFileCounts(arcRecfileIds.split(",").length);
		// }
		archivesService.save(archives);
		if (StringUtils.isNotEmpty(arcRecfileIds)) {
			List<ArchivesDoc> list = archivesDocService.findByAid(archives
					.getArchivesId());
			for (ArchivesDoc archivesDoc : list) {
				archivesDocService.remove(archivesDoc);
			}
			String[] fileIds = arcRecfileIds.split(",");
			for (String id : fileIds) {
				FileAttach fileAttach = fileAttachService.get(new Long(id));
				ArchivesDoc archivesDoc = new ArchivesDoc();
				archivesDoc.setArchives(archives);
				archivesDoc.setFileAttach(fileAttach);
				archivesDoc.setDocName(fileAttach.getFileName());
				archivesDoc.setDocStatus((short) 1);
				archivesDoc.setCurVersion(1);
				archivesDoc.setIsMe(0l);
				if(archives.getArchType()!=null&&"1".equals(archives.getArchType().toString())){
					archivesDoc.setIsFinish((short) 1);
				}else{
					archivesDoc.setIsFinish((short) 0);
				}
				archivesDoc.setDocPath(fileAttach.getFilePath());
				archivesDoc.setCreatetime(new Date());
				archivesDoc.setUpdatetime(new Date());
				archivesDocService.save(archivesDoc);
			}
		} else {
			for (ArchivesDoc archivesDoc : orgArchDocs) {
				archivesDoc.setArchives(archives);
				archivesDocService.save(archivesDoc);
			}
		}

		// 公文签收后在部门签收公文表中作标记
		if (StringUtils.isNotEmpty(archDepId)) {
			ArchivesDep archivesDep = archivesDepService
					.get(new Long(archDepId));
			archivesDep.setStatus(ArchivesDep.STATUS_SIGNED);
			archivesDepService.save(archivesDep);
		}

		setJsonString("{success:true,archivesId:" + archives.getArchivesId()
				+ "}");
		return SUCCESS;
	}

	/**
	 * 加载公文的附件文档
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String docs() {
		StringBuffer sb = new StringBuffer("{success:true,totalCounts:");

		if (archivesId != null) {
			archives = archivesService.get(archivesId);
			Set docs = archives.getArchivesDocs();
			List docList = new ArrayList();
			docList.addAll(docs);
			Type type = new TypeToken<List<ArchivesDoc>>() {
			}.getType();
			sb.append(docs.size());
			sb.append(",results:").append(new Gson().toJson(docList, type));

		} else {
			sb.append("0,results:[]");
		}
		sb.append("}");

		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 发文显示详细信息
	 * 
	 * @return
	 */
	public String getIssue() {
		Archives archives = archivesService.get(archivesId);
		String ccIds = "";
		String ccNames = "";
		Set<AppUser> archivesCC = archives.getArchivesCCs();
		if (!(archivesCC == null || archivesCC.isEmpty())) {
			for (AppUser au : archivesCC) {
				if (au.getUsername().equals("L39999")) {
					ccIds = ccIds + au.getId();
					ccNames = ccNames + au.getFullname();
					ccIds = ccIds + ",";
					ccNames = ccNames + ",";
				}
			}
		}
		if (!(archivesCC == null || archivesCC.isEmpty())) {
			for (AppUser au : archivesCC) {
				if (au.getUsername().equals("L30025")) {
					ccIds = ccIds + au.getId();
					ccNames = ccNames + au.getFullname();
					ccIds = ccIds + ",";
					ccNames = ccNames + ",";
				}
			}
		}
		if (!(archivesCC == null || archivesCC.isEmpty())) {
			for (AppUser au : archivesCC) {
				if (au.getUsername().equals("L00097")) {
					ccIds = ccIds + au.getId();
					ccNames = ccNames + au.getFullname();
					ccIds = ccIds + ",";
					ccNames = ccNames + ",";
				}
			}

		}
		if (!(archivesCC == null || archivesCC.isEmpty())) {
			for (AppUser au : archivesCC) {
				if (au.getUsername().equals("L000086")) {
					ccIds = ccIds + au.getId();
					ccNames = ccNames + au.getFullname();
					ccIds = ccIds + ",";
					ccNames = ccNames + ",";
				}
			}

		}

		if (!(ccIds.equals("") || ccIds == "")) {
			ccIds = ccIds.substring(0, ccIds.length() - 1);
			ccNames = ccNames.substring(0, ccNames.length() - 1);
		}
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();
		// JSONSerializer json = new JSONSerializer();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		sb.append(gson.toJson(archives));
		// sb.append(json.serialize(archives));
		sb.deleteCharAt(sb.length() - 1);

		sb.append(",ccIds:'").append(ccIds).append("',ccNames:'")
				.append(ccNames);
		sb.append("'}");
		sb.append("]}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 
	 * @return
	 */
	public String getFileHuiqian() {
		Archives archives = archivesService.get(archivesId);

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		// JSONSerializer json = new JSONSerializer();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		sb.append(gson.toJson(archives));
		// sb.append(json.serialize(archives));
		// sb.deleteCharAt(sb.length() - 1);
		/*
		 * sb.append(",typeId:").append(0).append(",typeName:'").append("")
		 * .append("'}");
		 */
		sb.append("]}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 发文添加及保存操作
	 */
	@SuppressWarnings("unchecked")
	public String saveIssue() {
		// 取当前该附件的所有文档
		String docs = getRequest().getParameter("docs");
		String status = getRequest().getParameter("status");
		AppUser curUser = ContextUtil.getCurrentUser();
		Set archivesDocSet = new HashSet();
		if (StringUtils.isNotEmpty(docs)) {
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			ArchivesDoc[] archivesDocs = gson.fromJson(docs,
					ArchivesDoc[].class);
			if (archivesDocs != null) {
				for (int i = 0; i < archivesDocs.length; i++) {
					if (archivesDocs[i].getDocId() == null
							|| archivesDocs[i].getDocId() == 0) {
						archivesDocs[i].setDocId(null);
						archivesDocs[i].initUsers(curUser);
						archivesDocs[i].setDocStatus(ArchivesDoc.STATUS_MODIFY);
						archivesDocs[i].setUpdatetime(new Date());
						archivesDocs[i].setCreatetime(new Date());
						archivesDocs[i].setFileAttach(fileAttachService
								.getByPath(archivesDocs[i].getDocPath()));

						archivesDocs[i].setCurVersion(1);

						archivesDocService.save(archivesDocs[i]);

						// 新增文件同时在历史表增加一历史记录
						DocHistory newHistory = new DocHistory();
						newHistory.setArchivesDoc(archivesDocs[i]);
						newHistory.setFileAttach(archivesDocs[i]
								.getFileAttach());
						newHistory.setDocName(archivesDocs[i].getDocName());
						newHistory.setPath(archivesDocs[i].getDocPath());
						newHistory.setVersion(ArchivesDoc.ORI_VERSION);
						newHistory.setUpdatetime(new Date());
						newHistory.setMender(curUser.getFullname());
						docHistoryService.save(newHistory);
					} else {
						archivesDocs[i] = archivesDocService
								.get(archivesDocs[i].getDocId());
					}
					archivesDocSet.add(archivesDocs[i]);
				}
			}
		}

		String ccIds = getRequest().getParameter("ccIds");
		System.out.println("---------ccIds-----------" + ccIds);
		java.util.Set<AppUser> archivesCCs = new java.util.HashSet<AppUser>();
		if (!("".equals(ccIds) || null == ccIds)) {
			String[] ccIdsArray = ccIds.split(",");
			AppUser appUser = new AppUser();
			for (int i = 0; i < ccIdsArray.length; i++) {
				System.out.println("---------i-----------" + ccIdsArray[i]);
				appUser = appUserService.get(new Long(ccIdsArray[i]));
				archivesCCs.add(appUser);
			}
		}
		if (!archivesCCs.isEmpty()) {
			archives.setArchivesCCs(archivesCCs);
		}
		archives.setArchivesNo("0");
		if (archives.getArchivesId() == null) {
			// 初始化发文的数据
			archives.setIssuer(curUser.getFullname());
			archives.setIssuerId(curUser.getUserId());
			// 设置发文的分类
			// OdFlowtype odFlowtype = odFlowtypeService.get(archives
			// .getOdFlowtype().getId());
			// archives.setOdFlowtype(odFlowtype);
			// archives.setOdFlowtype3(null);
			// 发文
			archives.setArchType(Archives.ARCHIVE_TYPE_DISPATCH);
			// 草稿状态
			if (StringUtils.isNotEmpty(status)) {
				archives.setStatus(Short.parseShort(status));
			} else {
				archives.setStatus(Archives.STATUS_DRAFT);
			}
			archives.setCreatetime(new Date());
			archives.setIssueDate(new Date());

			// TODO count the files here
			archives.setFileCounts(archivesDocSet.size());
			archives.setArchivesDocs(archivesDocSet);
			archives.setProcessRun(null);
			archivesService.save(archives);

		} else {
			Archives orgArchives = archivesService
					.get(archives.getArchivesId());
			// 设置发文的分类
			archives.setOdFlowtype(orgArchives.getOdFlowtype());
			// 设置发文状态
			if (StringUtils.isNotEmpty(status)) {
				archives.setStatus(Short.parseShort(status));
			} else {
				archives.setStatus(orgArchives.getStatus());
			}
			// 设置创建时间
			archives.setCreatetime(orgArchives.getCreatetime());
			// TODO count the files here
			archives.setFileCounts(archivesDocSet.size());
			archives.setArchivesDocs(archivesDocSet);
			// 发布日期
			archives.setIssueDate(new Date());
			archives.setArchType(orgArchives.getArchType());
			if (archives.getDepId() == null) {
				archives.setDepId(orgArchives.getDepId());
			}
			if (archives.getProcessRun() == null) {
				archives.setProcessRun(orgArchives.getProcessRun());
			}
			// 设置发文人信息
			archives.setIssuer(orgArchives.getIssuer());
			archives.setIssuerId(orgArchives.getIssuerId());
			archivesService.merge(archives);
		}
		// 直接完成公文
		if (Archives.STATUS_END.equals(archives.getStatus())) {
			handOut();
		}
		setJsonString("{success:true,archivesId:'" + archives.getArchivesId()
				+ "'}");
		return SUCCESS;
	}

	/**
	 * 普通公文save
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String saveNormal() {
		// 取当前该附件的所有文档
		String docs = getRequest().getParameter("docs");
		String docExts = getRequest().getParameter("docExts");
		String status = getRequest().getParameter("status");
		String fileIds = getRequest().getParameter("fileIds");
		AppUser curUser = ContextUtil.getCurrentUser();
		Set archivesDocSet = new HashSet();
		if (StringUtils.isNotEmpty(docs)) {
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			ArchivesDoc[] archivesDocs = gson.fromJson(docs,
					ArchivesDoc[].class);
			if (archivesDocs != null) {
				for (int i = 0; i < archivesDocs.length; i++) {
					if (archivesDocs[i].getDocId() == null
							|| archivesDocs[i].getDocId() == 0) {
						archivesDocs[i].setDocId(null);
						archivesDocs[i].initUsers(curUser);
						archivesDocs[i].setDocStatus(ArchivesDoc.STATUS_MODIFY);
						archivesDocs[i].setUpdatetime(new Date());
						archivesDocs[i].setIsMe(0l);
						archivesDocs[i].setCreatetime(new Date());
						if(archives.getArchType()!=null&&"1".equals(archives.getArchType().toString())){
							archivesDocs[i].setIsFinish((short) 1);
						}else{
							archivesDocs[i].setIsFinish((short) 0);
						}
						archivesDocs[i].setFileAttach(fileAttachService
								.getByPath(archivesDocs[i].getDocPath()));

						archivesDocs[i].setCurVersion(1);

						archivesDocService.save(archivesDocs[i]);

						// 新增文件同时在历史表增加一历史记录
						DocHistory newHistory = new DocHistory();
						newHistory.setArchivesDoc(archivesDocs[i]);
						newHistory.setFileAttach(archivesDocs[i]
								.getFileAttach());
						newHistory.setDocName(archivesDocs[i].getDocName());
						newHistory.setPath(archivesDocs[i].getDocPath());
						newHistory.setVersion(ArchivesDoc.ORI_VERSION);
						newHistory.setUpdatetime(new Date());
						newHistory.setMender(curUser.getFullname());
						docHistoryService.save(newHistory);
					} else {
						archivesDocs[i] = archivesDocService
								.get(archivesDocs[i].getDocId());
					}
					archivesDocSet.add(archivesDocs[i]);
				}
			}
		}

		Set archivesAttachments = new HashSet();
		if (StringUtils.isNotEmpty(fileIds)) {
			String[] files = fileIds.split(",");
			if (files.length > 0) {
				for (int i = 0; i < files.length; i++) {
					FileAttach fa = fileAttachService.get(Long
							.valueOf(files[i]));
					archivesAttachments.add(fa);
				}
			}
		}
		String ccIds = getRequest().getParameter("ccIds");

		java.util.Set<AppUser> archivesCCs = new java.util.HashSet<AppUser>();
		if (!("".equals(ccIds) || null == ccIds)) {
			String[] ccIdsArray = ccIds.split(",");
			AppUser appUser = new AppUser();
			for (int i = 0; i < ccIdsArray.length; i++) {
				appUser = appUserService.get(new Long(ccIdsArray[i]));
				archivesCCs.add(appUser);
			}
		}
		if (!archivesCCs.isEmpty()) {
			archives.setArchivesCCs(archivesCCs);
		}
		// String archivesId = getRequest().getParameter("archives.archivesId");

		// if (null != archivesId) {
		// archives.setArchivesId(Long.valueOf(archivesId));
		// }
		if (archives.getArchivesId() == null) {
			// 初始化发文的数据
			// archives.setIssuer(curUser.getFullname());
			// archives.setIssuerId(curUser.getUserId());
			// 发文
			if (archives.getArchivesType()==null||archives.getArchivesType().getTypeId() == null) {//请假管理修改
				// archives.setArchType(Archives.ARCHIVE_TYPE_DISPATCH);
				archives.setArchivesType(null);
			}
			if (archives.getArchType() == null) {
				archives.setArchType(Archives.ARCHIVE_TYPE_DISPATCH);
			}
			// 草稿状态
			if (StringUtils.isNotEmpty(status)) {
				archives.setStatus(Short.parseShort(status));
			} else {
				archives.setStatus(Archives.STATUS_ISSUE);
			}
			archives.setCreatetime(new Date());
			archives.setIssueDate(new Date());

			// TODO count the files here
			if (archives.getFileCounts() == null) {
				archives.setFileCounts(archivesDocSet.size());
			}

			archives.setArchivesDocs(archivesDocSet);
			archives.setArchivesFiles(archivesAttachments);
			archives.setProcessRun(null);
			if (archives.getArchivesNo() == null
					|| "".equals(archives.getArchivesNo())) {
				archives.setArchivesNo("0");
			}

		} else {// 更新表单
			Archives orgArchives = archivesService
					.get(archives.getArchivesId());
			OdFlowtype flowTypeObj = orgArchives.getOdFlowtype();

			archives.setArchivesId(orgArchives.getArchivesId());
			if (flowTypeObj != null && flowTypeObj.getId().intValue() != 15) {
				if (orgArchives.getArchivesNo().equals("0")
						&& orgArchives.getParentArchId() == null) {
					String archiveNo = null;
					Long runId = archives.getProcessRun().getRunId();
					ProcessRun newProcessRun = processRunService.get(runId);
					String name = newProcessRun.getProDefinition().getName();
					archiveNo = ArchiveNoGenerator
							.getArchiveNoInsidePublicFile(
									Integer.valueOf(flowTypeObj.getFlowType()),
									flowTypeObj.getFlowLevel(),
									orgArchives.getDepId());

					archives.setArchivesNo(archiveNo);
				} else {
					archives.setArchivesNo(orgArchives.getArchivesNo());
				}
			} else {
				archives.setArchivesNo(orgArchives.getArchivesNo());
			}
			// 设置发文状态
			if (StringUtils.isNotEmpty(status)) {
				archives.setStatus(Short.parseShort(status));
			} else {
				archives.setStatus(orgArchives.getStatus());
			}
			// 设置创建时间
			archives.setCreatetime(orgArchives.getCreatetime());
			archives.setArchivesFiles(archivesAttachments);
			if (archivesDocSet.size() == 0) {
				archives.setArchivesDocs(orgArchives.getArchivesDocs());
				if (archives.getFileCounts() == null) {
					archives.setFileCounts(orgArchives.getArchivesDocs().size());
				}
			} else {
				archives.setArchivesDocs(archivesDocSet);
				if (archives.getFileCounts() == null) {
					archives.setFileCounts(archivesDocSet.size());
				}
			}
			if (archives.getShortContent() == null) {
				archives.setShortContent(orgArchives.getShortContent());
			}
			// 发布日期
			archives.setIssueDate(orgArchives.getIssueDate());
			if (archives.getIssuer() == null) {
				archives.setIssuer(orgArchives.getIssuer());
			}
			// 设置发文人信息
			if (archives.getIssuer() == null) {
				archives.setIssuer(orgArchives.getIssuer());
			}

			if (archives.getIssuerId() == null) {
				archives.setIssuer(orgArchives.getIssuer());
			}
			archives.setIssuerId(orgArchives.getIssuerId());
			archives.setIssueDep(orgArchives.getIssueDep());
			if (archives.getSubject() == null) {
				archives.setSubject(orgArchives.getSubject());
			}
			if (archives.getRecDepIds() == null) {
				archives.setRecDepIds(orgArchives.getRecDepIds());
			}
			if (archives.getRecDepNames() == null) {
				archives.setRecDepNames(orgArchives.getRecDepNames());
			}
			if (archives.getTypeName() == null) {
				archives.setTypeName(orgArchives.getTypeName());
			}
			if (archives.getDepId() == null) {
				archives.setDepId(orgArchives.getDepId());
			}
			if (archives.getProcessRun() == null) {
				archives.setProcessRun(orgArchives.getProcessRun());
			}
			if (archives.getProcessRun() != null) {
				ProcessRun processRun = processRunService.get(archives
						.getProcessRun().getRunId());
				if (archives.getSubject() == null) {
					processRun.setSubject(orgArchives.getSubject());
				} else {
					processRun.setSubject(archives.getSubject());
				}
				processRunService.save(processRun);
			}
			if (archives.getLeaders().size() == 0) {
				archives.setLeaders(orgArchives.getLeaders());
			}
			if (archives.getArchivesType() == null) {
				archives.setArchivesType(orgArchives.getArchivesType());
			}
			archives.setOdFlowtype(orgArchives.getOdFlowtype());
			// archivesService.save(archives);
		}

		archives = archivesService.save(archives);
		if(archives.getArchivesNo()=="0"&&null!=getRequest().getParameter("defId")){
			Long defId = new Long(getRequest().getParameter("defId").toString());
			Long snConfigId = new Long(getRequest().getParameter("snConfigId").toString());
			String asNO=fileSnConfigService.getFlowSnNo(defId, snConfigId);
			archives.setArchivesNo(asNO);
			archivesService.save(archives);
		}
		// 存额外的文件
		if (StringUtils.isNotEmpty(docExts)) {
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			ArchivesDocExt[] archivesDocExts = gson.fromJson(docExts,
					ArchivesDocExt[].class);
			if (archivesDocExts != null) {
				for (int i = 0; i < archivesDocExts.length; i++) {
					if (archivesDocExts[i].getDocId() == null
							|| archivesDocExts[i].getDocId() == 0) {
						archivesDocExts[i].setDocId(null);
						archivesDocExts[i].setArchivesId(archives.getArchivesId());
						archivesDocExts[i].initUsers(curUser);
						archivesDocExts[i].setDocStatus(ArchivesDoc.STATUS_MODIFY);
						archivesDocExts[i].setUpdatetime(new Date());
						archivesDocExts[i].setCreatetime(new Date());
						if(archives.getArchType()!=null&&"1".equals(archives.getArchType().toString())){
							archivesDocExts[i].setIsFinish((short) 1);
						}else{
							archivesDocExts[i].setIsFinish((short) 0);
						}
						archivesDocExts[i].setFileAttach(fileAttachService
								.getByPath(archivesDocExts[i].getDocPath()));

						archivesDocExts[i].setCurVersion(1);

						archivesDocExtService.save(archivesDocExts[i]);

						// 新增文件同时在历史表增加一历史记录
						DocExtHistory newHistory = new DocExtHistory();
						newHistory.setArchivesDocExt(archivesDocExts[i]);
						newHistory.setFileAttach(archivesDocExts[i]
								.getFileAttach());
						newHistory.setDocName(archivesDocExts[i].getDocName());
						newHistory.setPath(archivesDocExts[i].getDocPath());
						newHistory.setVersion(ArchivesDoc.ORI_VERSION);
						newHistory.setUpdatetime(new Date());
						newHistory.setMender(curUser.getFullname());
						docExtHistoryService.save(newHistory);
					} else {
						archivesDocExts[i] = archivesDocExtService
								.get(archivesDocExts[i].getDocId());
					}
				}
			}
		}
		
		setJsonString("{success:true,archivesId:'" + archives.getArchivesId()
				+ "'}");
		return SUCCESS;
	}

	/**
	 * 此方法处理文件分发后修改公文状态
	 * 
	 * @return
	 */
	public String handOut() {

		// 设置接收的部门或人员
		if (archivesId == null) {
			archivesId = archives.getArchivesId();

		}

		String recDepIds = getRequest().getParameter("recDepIds");
		String recDepNames = getRequest().getParameter("recDepNames");

		archives = archivesService.get(archivesId);

		if (StringUtils.isEmpty(recDepIds)) {
			recDepIds = archives.getRecDepIds();
			recDepNames = archives.getRecDepNames();
		} else {
			archives.setRecDepIds(recDepIds);
			archives.setRecDepNames(recDepNames);
		}

		StringBuffer msg = new StringBuffer("");
		if (StringUtils.isNotEmpty(recDepIds)) {
			String[] depIdArr = recDepIds.split("[,]");
			if (depIdArr != null) {

				StringBuffer recIds = new StringBuffer("");

				for (int i = 0; i < depIdArr.length; i++) {
					Long depId = new Long(depIdArr[i]);
					Department department = departmentService.get(depId);
					ArchRecUser archRecUser = archRecUserService
							.getByDepId(depId);

					ArchivesDep archivesDep = new ArchivesDep();
					archivesDep.setSubject(archives.getSubject());
					archivesDep.setDepartment(department);
					archivesDep.setArchives(archives);
					archivesDep.setIsMain(ArchivesDep.RECEIVE_MAIN);
					archivesDep.setStatus(ArchivesDep.STATUS_UNSIGNED);
					if (archRecUser != null && archRecUser.getUserId() != null) {
						archivesDep.setSignUserID(archRecUser.getUserId());
						archivesDep.setSignFullname(archRecUser.getFullname());

						recIds.append(archRecUser.getUserId()).append(",");
					} else {
						msg.append(department.getDepName()).append(
								" 部门还未添加收文负责人");
					}

					archivesDepService.save(archivesDep);
				}
				// 向需要签收公文的人发送信息
				if (StringUtils.isNotEmpty(recIds.toString())) {
					String content = "您有新的公文,请及时签收.";
					messageService.save(AppUser.SYSTEM_USER, recIds.toString(),
							content, ShortMessage.MSG_TYPE_TASK);
				}

			}
		}
		String archivesStatus = getRequest().getParameter("archivesStatus");
		if (StringUtils.isNotEmpty(archivesStatus)) {
			archives.setStatus(Short.parseShort(archivesStatus));
		}
		archivesService.save(archives);
		return SUCCESS;
	}

	public String hasten() {
		String activityName = getRequest().getParameter("activityName");
		String archivesId = getRequest().getParameter("archivesId");
		String content = getRequest().getParameter("content");
		if (StringUtils.isNotEmpty(activityName)
				&& StringUtils.isNotEmpty(archivesId)) {
			Long arcId = new Long(archivesId);
			Date lastCruTime = archHastenService.getLeastRecordByUser(arcId);
			if (lastCruTime != null) {
				Date now = new Date();
				long time = now.getTime() - lastCruTime.getTime();
				if (time / 60000l < 30l) {// 不得小于半个小时发一次催办信息
					jsonString = "{success:false,message:'催办过于频繁！'}";
					return SUCCESS;
				}
			}
			Archives archives = archivesService.get(arcId);
			Set<Long> userIds = taskservice
					.getHastenByActivityNameVarKeyLongVal(activityName,
							Constants.ARCHIES_ARCHIVESID, new Long(archivesId));
			StringBuffer strUsrIds = new StringBuffer();
			Iterator<Long> it = userIds.iterator();
			while (it.hasNext()) {
				ArchHasten ah = new ArchHasten();
				Long userId = it.next();
				AppUser appUser = appUserService.get(userId);
				ah.setContent(content);
				ah.setCreatetime(new Date());
				ah.setArchives(archives);
				ah.setHastenFullname(ContextUtil.getCurrentUser().getFullname());
				ah.setHandlerUserId(appUser.getUserId());
				ah.setHandlerFullname(appUser.getFullname());
				archHastenService.save(ah);
				strUsrIds.append(userId.toString()).append(",");
			}
			if (userIds.size() > 0) {
				strUsrIds.deleteCharAt(strUsrIds.length() - 1);
				messageService.save(AppUser.SYSTEM_USER, strUsrIds.toString(),
						content, ShortMessage.MSG_TYPE_TASK);
			}

		}
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * 
	 */
	public String symbol() {
		String archivesNo = getRequest().getParameter("archivesNo");
		String archivesStatus = getRequest().getParameter("archivesStatus");
		String memo = getRequest().getParameter("memo");
		String attendType = getRequest().getParameter("attendType");
		if (archivesId != null) {
			archives = archivesService.get(archivesId);
			archives.setArchivesNo(archivesNo);
			archives.setStatus(new Short(archivesStatus));
			if (StringUtils.isNotEmpty(archivesStatus)) {
				archives.setStatus(Short.parseShort(archivesStatus));
			}
			if (StringUtils.isNotEmpty(archivesNo)) {
				archives.setArchivesNo(archivesNo);
			}
			archivesService.save(archives);
		}

		ArchivesAttend archivesAttend = new ArchivesAttend();
		archivesAttend.setArchives(archives);
		archivesAttend.setAttendType(attendType);
		archivesAttend.setMemo(memo);
		archivesAttend.setUserID(ContextUtil.getCurrentUserId());
		archivesAttend.setFullname(ContextUtil.getCurrentUser().getFullname());
		archivesAttend.setExecuteTime(new Date());
		archivesAttendService.save(archivesAttend);

		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 公文手动归档
	 */
	public String arch() {
		String archivesID = getRequest().getParameter("archivesId");
		AppUser currentUser = ContextUtil.getCurrentUser();
		Long userId = currentUser.getUserId();
		Long archivesId = new Long(archivesID);
		Archives archives = archivesService.get(new Long(archivesId));
		List<ArchivesDoc> arDocList = archivesDocService.findByAid(archivesId);
		List<FileAttach> attachList = new ArrayList<FileAttach>();
		for (ArchivesDoc archivesDoc : arDocList) {
			attachList.add(archivesDoc.getFileAttach());
		}
//		RollFile rollFile = new RollFile();
//		rollFile.setFileName(archives.getSubject());
//		rollFile.setTidyName(currentUser.getFullname());
//		rollFile.setTidyTime(new Date());
//		rollFileService.handTidy(rollFile, userId.toString(), attachList);
//		archives.setStatus((short) 7);
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 生成保存子流程记录——主要为内收文子流程
	 */
	public String saveSub() {
		String archId = getRequest().getParameter("archivesId");
		Long archiveId = new Long(archId);
		Archives archives = archivesService.get(archiveId);
		List<ArchivesDoc> list = archivesDocService.findByAid(archiveId);
		Archives orgArchives = new Archives();
		try {
			BeanUtil.copyNotNullProperties(orgArchives, archives);
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		orgArchives.setParentArchId(archiveId);
		orgArchives.setArchType((short) 1);
		// OdFlowtype odFlowType=odFlowtypeService.get(new Long(25));
		// orgArchives.setTypeName(odFlowType.getFlowName());
		// orgArchives.setOdFlowtype(odFlowType);
		orgArchives.setStatus((short) 1);
		orgArchives.setArchivesId(null);
		orgArchives.setArchivesDocs(null);
		orgArchives.setArchivesDeps(null);
		orgArchives.setArchivesHandles(null);
		orgArchives.setLeaders(null);
		orgArchives.setArchivesDispatch(null);
		orgArchives.setArchivesAttends(null);
		orgArchives = archivesService.save(orgArchives);
		for (ArchivesDoc ad : list) {
			ArchivesDoc archivesDoc = new ArchivesDoc();
			try {
				BeanUtil.copyNotNullProperties(archivesDoc, ad);
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			archivesDoc.setDocId(null);
			archivesDoc.setDocHistorys(null);
			archivesDoc.setArchives(orgArchives);
			archivesDoc.setArchivesId(orgArchives.getArchivesId());
			archivesDocService.save(archivesDoc);
		}
		setJsonString("{success:true,archivesId:'"
				+ orgArchives.getArchivesId() + "'}");
		return SUCCESS;
	}

	// 更新runId
	public String updateRunId() {
		String archId = getRequest().getParameter("archivesId");
		String runId = getRequest().getParameter("runId");
		Long archiveId = new Long(archId);
		ProcessRun processRun = processRunService.get(new Long(runId));
		Archives archives = archivesService.get(archiveId);
		archives.setProcessRun(processRun);
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	// 更新文件是否共享字段
	public String updateFileShared() {
		if (null == archives)
			return SUCCESS;
		Long archiveId = archives.getArchivesId();
		Archives orgArchives = archivesService.get(archiveId);
		orgArchives.setIsShared(archives.getIsShared());
		archivesService.save(orgArchives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	// 终止公文流程
	public String updateSta() {
		String archId = getRequest().getParameter("archivesId");
		Long archiveId = new Long(archId);
		Archives archives = archivesService.get(archiveId);
		Short archType = archives.getArchType();
		if (archType == 0) {
			archives.setStatus((short) 9);
		} else {
			archives.setStatus((short) 10);
		}
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	public String satrtFileHuiQianSub2() {
		this.logger.debug("begin start 子流程satrtFileHuiQianSub2");
		// 接受执行人相关参数
		String roleIdRequest = getRequest().getParameter("roleId");
		String roleName = getRequest().getParameter("roleName");
		Long roleId = null;
		if (roleIdRequest == null) {
			roleId = LoginAction.roleMap.get(roleName);
		} else {
			roleId = Long.valueOf(roleIdRequest);
		}

		String processName = getRequest().getParameter("processName");
		ProDefinition proDefinition = proDefinitionService
				.getByName(processName);
		Long defId = proDefinition.getDefId();
		String startNodeName = getRequest().getParameter("startNodeName");

		Long createuserId = Long.valueOf(getRequest().getParameter("userId"));
		AppUser createUser = appUserService.get(createuserId);
		// 保存子流程的数据
		ArrayList<Map<String, String>> flowAssignIdList = new ArrayList<Map<String, String>>();

		String archId = getRequest().getParameter("archivesId");
		Long archiveId = new Long(archId);

		Archives archives = archivesService.get(archiveId);
		// 获取会签部门Id
		String recDepIds = archives.getRecDepIds();
		String recDepNames = archives.getRecDepNames();
		String[] recDepIdsArray = recDepIds.split(",");
		String[] recDepNamesArray = recDepNames.split(",");
		this.logger
				.debug("-------------recDepIds----------------:" + recDepIds);
		this.logger.debug("-------------recDepNamesArray----------------:"
				+ recDepNamesArray);
		Map<String, String> depIdNameMap = new HashMap<String, String>();
		for (int i = 0; i < recDepIdsArray.length; i++) {
			depIdNameMap.put(recDepIdsArray[i], recDepNamesArray[i]);
		}
		flowAssignIdList = getFlowAssignIdList(recDepIdsArray, roleId,
				depIdNameMap);
		this.logger.debug("-------------flowAssignIdList.size----------------:"
				+ flowAssignIdList.size());
		this.logger.debug("-------------预启动----------------:"
				+ flowAssignIdList.size() + "个子流程");
		System.out.println("流程签核启动的流程个数：" + flowAssignIdList.size());
		archivesService.startSubProcess(createUser, archiveId, defId, archives,
				processName, startNodeName, flowAssignIdList);

		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 启动文件会签子流程 用于产生丢失的单据
	 * 
	 * @return
	 */
	public String satrtSubProcessTemp() {
		// begin 获取启动流程相关参数
		String roleIdRequest = getRequest().getParameter("roleId");
		String roleName = getRequest().getParameter("roleName");
		Long roleId = null;
		if (roleIdRequest == null) {
			roleId = LoginAction.roleMap.get(roleName);
		} else {
			roleId = Long.valueOf(roleIdRequest);
		}
		String processName = getRequest().getParameter("processName");
		ProDefinition proDefinition = proDefinitionService
				.getByName(processName);
		Long defId = proDefinition.getDefId();
		String startNodeName = getRequest().getParameter("startNodeName");

		Long createuserId = Long.valueOf(getRequest().getParameter("userId"));
		AppUser createUser = appUserService.get(createuserId);

		String archId = getRequest().getParameter("archivesId");
		Long archiveId = new Long(archId);
		// end 获取启动流程相关参数

		// 保存子流程的数据
		ArrayList<Map<String, String>> flowAssignIdList = new ArrayList<Map<String, String>>();
		Archives archives = archivesService.get(archiveId);
		// 获取会签部门Id 修改此处用于直接从前台接收 未收到单据的部门id
		String recDepIds = getRequest().getParameter("depIds");
		String recDepNames = getRequest().getParameter("depNames");
		String[] recDepIdsArray = recDepIds.split(",");
		String[] recDepNamesArray = recDepNames.split(",");
		// this.depIdNameMap.clear();
		Map<String, String> depIdNameMap = new HashMap<String, String>();
		for (int i = 0; i < recDepIdsArray.length; i++) {
			depIdNameMap.put(recDepIdsArray[i], recDepNamesArray[i]);
		}
		// 获取子流程的接收人列表
		flowAssignIdList = getFlowAssignIdList(recDepIdsArray, roleId,
				depIdNameMap);
		this.logger.debug("-------------flowAssignIdList.size----------------:"
				+ flowAssignIdList.size());
		this.logger.debug("-------------预启动----------------:"
				+ flowAssignIdList.size() + "个子流程");

		archivesService.startSubProcess(createUser, archiveId, defId, archives,
				processName, startNodeName, flowAssignIdList);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 启动文件会签子流程
	 * 
	 * @return
	 */
	public String satrtFileHuiQianSub() {
		this.logger.debug("begin start 子流程satrtFileHuiQianSub");
		// 接受执行人相关参数
		String roleIdRequest = getRequest().getParameter("roleId");
		String roleName = getRequest().getParameter("roleName");
		Long roleId = null;
		if (roleIdRequest == null) {
			roleId = LoginAction.roleMap.get(roleName);
		} else {
			roleId = Long.valueOf(roleIdRequest);
		}
		String processName = getRequest().getParameter("processName");
		ProDefinition proDefinition = proDefinitionService
				.getByName(processName);
		Long defId = proDefinition.getDefId();
		String startNodeName = getRequest().getParameter("startNodeName");

		Long createuserId = Long.valueOf(getRequest().getParameter("userId"));
		AppUser createUser = appUserService.get(createuserId);
		// 保存子流程的数据
		ArrayList<Map<String, String>> flowAssignIdList = new ArrayList<Map<String, String>>();

		String archId = getRequest().getParameter("archivesId");
		Long archiveId = new Long(archId);

		Archives archives = archivesService.get(archiveId);
		// 获取会签部门Id
		String recDepIds = archives.getRecDepIds();
		String recDepNames = archives.getRecDepNames();
		String[] recDepIdsArray = recDepIds.split(",");
		String[] recDepNamesArray = recDepNames.split(",");
		this.logger
				.debug("-------------recDepIds----------------:" + recDepIds);
		this.logger.debug("-------------recDepNamesArray----------------:"
				+ recDepNamesArray);
		Map<String, String> depIdNameMap = new HashMap<String, String>();
		// this.depIdNameMap.clear();
		for (int i = 0; i < recDepIdsArray.length; i++) {
			depIdNameMap.put(recDepIdsArray[i], recDepNamesArray[i]);
		}
		flowAssignIdList = getFlowAssignIdList(recDepIdsArray, roleId,
				depIdNameMap);
		this.logger.debug("-------------flowAssignIdList.size----------------:"
				+ flowAssignIdList.size());
		this.logger.debug("-------------预启动----------------:"
				+ flowAssignIdList.size() + "个子流程");
		archivesService.startSubProcess(createUser, archiveId, defId, archives,
				processName, startNodeName, flowAssignIdList);

		setJsonString("{success:true}");
		return SUCCESS;
	}

	@SuppressWarnings("unchecked")
	public ArrayList<Map<String, String>> getFlowAssignIdList(
			String[] recDepIdsArray, Long roleId,
			Map<String, String> depIdNameMap) {

		String flowAssignIdTemp = "";
		ArrayList<Map<String, String>> resutList = new ArrayList<Map<String, String>>();
		Map<String, String> resultMap = null;
		for (int i = 0; i < recDepIdsArray.length; i++) {
			resultMap = new HashMap<String, String>();
			StringBuilder sb = new StringBuilder();
			List<AppUser> appUserList = appUserService.selectByDepAndRole(
					Long.valueOf(recDepIdsArray[i]), roleId);
			/*
			 * List<AppUser> appUserList =
			 * appUserService.findUserByDepandRole(roleId,Long
			 * .valueOf(recDepIdsArray[i]));
			 */
			if (appUserList.size() > 0) {
				for (AppUser au : appUserList) {
					sb.append(au.getUserId()).append(",");
				}
				if (sb.length() > 0) {
					flowAssignIdTemp = sb.toString().substring(0,
							sb.toString().length() - 1);
				}
				resultMap.put("flowAssignIds", flowAssignIdTemp);
				System.out.println("flowAssignIds:" + flowAssignIdTemp);
				resultMap
						.put("recDepName", depIdNameMap.get(recDepIdsArray[i]));
				System.out.println("recDepName:"
						+ depIdNameMap.get(recDepIdsArray[i]));
				resutList.add(resultMap);
			}

		}
		System.out.println(" resutListSize:" + resutList.size());
		depIdNameMap = null;
		return resutList;
	}

	/**
	 * 保存抄送人员
	 */
	public String saveCC() {
		String Id = getRequest().getParameter("Id");
		if (null == Id || "".equals(Id)) {
			String archId = getRequest().getParameter("archivesId");
			String ccIds = getRequest().getParameter("ccIds");
			String[] ccIdsArray = ccIds.split(",");
			AppUser user = ContextUtil.getCurrentUser();
			String radeuser = user.getUsername();
			Archives archives = new Archives();
			AppUser appUser = new AppUser();
			for (int i = 0; i < ccIdsArray.length; i++) {
				OdArchivescc archivesCCs = new OdArchivescc();
				appUser = appUserService.get(new Long(ccIdsArray[i]));
				Long archiveId = new Long(archId);
				archives = archivesService.get(archiveId);
				archivesCCs.setAppUser(appUser);
				archivesCCs.setArchives(archives);
				archivesCCs.setStatus((short) 0);
				archivesCCs.setGivemeReadUser(radeuser);
				archivesCCs.setGivemeReadTime(new Date());
				odarchivesccService.save(archivesCCs);
			}
		} else {
			Long id = new Long(Id);
			OdArchivescc archivesCCs = odarchivesccService.get(id);
			archivesCCs.setReadTime(new Date());
			archivesCCs.setStatus((short) 1);
			odarchivesccService.save(archivesCCs);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 获得抄送公文
	 */
	public String getCC() {

		String user = getRequest().getParameter("userId");
		String archivesNo = getRequest().getParameter("archivesNo");
		String depSignNo = getRequest().getParameter("depSignNo");
		String subject = getRequest().getParameter("subject");
		String stat = getRequest().getParameter("status");
		Long userId = null;
		if (null != user && !"".equals(user))
			userId = new Long(user);
		int status = 0;
		if (null != stat && !"".equals(stat))
			status = Integer.parseInt(stat);
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		List<OdArchivescc> list = archivesService.listCC(userId, archivesNo,
				depSignNo, subject, status, start, size);
		Long con = archivesService.count(userId, archivesNo, depSignNo, subject, status);
		/*
		 * List<Archives> list = archivesService.getCC(getRequest(),new
		 * Long(userId), defId, archivesNo, depName, subject);
		 */
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(con).append(",result:");

		JSONSerializer serializer = new JSONSerializer();

		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");

		/*
		 * Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
		 * .setDateFormat("yyyy-MM-dd").create();
		 */

		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));

		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;

	}

	/**
	 * 首页抄送给我的公文显示
	 * 
	 * @author F3222507
	 * @return
	 */
	public String listread() {
		// 初始化分页数据
		String user = getRequest().getParameter("userId");
		Long userId = null;
		if (null != user && !"".equals(user))
			userId = new Long(user);
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		List<OdArchivescc> list = archivesService.listCC(userId, null,
				null, null, 0, start, size);
		// 把查询结果封装到request范围内
		   for (int i = 0; i < list.size() - 1; i++) {                             //循环遍历集体中的元素
		         for (int j = list.size() - 1; j > i; j--) {                         //这里非常巧妙，这里是倒序的是比较
		              if (list.get(j).getId().compareTo(list.get(i).getId())==0) {
		              list.remove(j);
		              }
		        }
		    }
		getRequest().setAttribute("readList", list);
		// 根据display 去Struts.xml文件中找对对应的jsp文件
		return "read";
	}

	/**
	 * 保存子流程数据
	 * 
	 * @return
	 */
	public Archives saveSubData(Long archiveId, Archives archives,
			String recDepName) {

		try {
			// 取得公文ID
			// String archId = getRequest().getParameter("archivesId");
			// Long archiveId=new Long(archId);
			// Archives archives = archivesService.get(archiveId);
			List<ArchivesDoc> list = archivesDocService.findByAid(archiveId);
			Archives orgArchives = new Archives();

			BeanUtil.copyNotNullProperties(orgArchives, archives);

			orgArchives.setParentArchId(archiveId);
			orgArchives.setArchType((short) 1);
			orgArchives.setStatus((short) 1);
			orgArchives.setArchivesId(null);
			orgArchives.setArchivesDocs(null);
			orgArchives.setArchivesDeps(null);
			orgArchives.setArchivesHandles(null);
			orgArchives.setLeaders(null);
			orgArchives.setArchivesDispatch(null);
			orgArchives.setArchivesAttends(null);
			orgArchives.setArchivesCCs(null);
			orgArchives.setRecDepNames(recDepName);
			orgArchives = archivesService.save(orgArchives);
			for (ArchivesDoc ad : list) {
				ArchivesDoc archivesDoc = new ArchivesDoc();

				BeanUtil.copyNotNullProperties(archivesDoc, ad);

				archivesDoc.setDocId(null);
				archivesDoc.setDocHistorys(null);
				archivesDoc.setArchives(orgArchives);
				archivesDoc.setArchivesId(orgArchives.getArchivesId());
				archivesDocService.save(archivesDoc);
			}
			return orgArchives;
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			logger.debug("saveSubData error! " + e);
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			logger.debug("saveSubData error! " + e);
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			logger.debug("saveSubData error! " + e);
		}
		return null;
	}

	/**
	 * 更新流程实例id
	 * 
	 * @return
	 */
	public void updateRunId(Long archivesId, String runId) {
		// String archId = getRequest().getParameter("archivesId");
		// String runId= getRequest().getParameter("runId");
		ProcessRun processRun = processRunService.get(new Long(runId));
		Archives archives = archivesService.get(archivesId);
		archives.setProcessRun(processRun);
		archivesService.save(archives);
	}

	public static void main(String args[]) {
		String ccIds = "36,";
		System.out.println(ccIds.substring(0, ccIds.length() - 1));
	}

	public String getArchId() {
		Long runId = Long.parseLong(getRequest().getParameter("runId"));
		Long archId = archivesService.getArchId(runId);
		if (archId > 0) {
			jsonString = "{success:true,\"archivesId\":" + archId + "}";
		} else {
			jsonString = "{success:false,\"archivesId\":-1}";
		}
		return SUCCESS;
	}

	/**
	 * 根据公文ID，查询流程实例ID
	 * 
	 * @return
	 */
	public String getRunId() {
		Long archivesId = Long.parseLong(getRequest()
				.getParameter("archivesId"));
		Long runId = archivesService.get(archivesId).getProcessRun().getRunId();
		jsonString = "{success:true,\"runId\":" + runId + "}";
		return SUCCESS;
	}

	// 更新编号
	public String updateArchNo() {
		String archId = getRequest().getParameter("archivesId");
		String archNo = getRequest().getParameter("archivesNo");
		String configId = getRequest().getParameter("fileSnConfig");
		Long archiveId = new Long(archId);
		Archives archives = archivesService.get(archiveId);
		Long archiveConfigId = null;
		if (null != configId && "" != configId) {
			archiveConfigId = new Long(configId);
			archives.setSnConfigId(archiveConfigId);
		}
		archives.setArchivesNo(archNo);
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	public String getArchData() {
		Archives archives = archivesService.get(archivesId);
		if (archives.getArchivesType() == null) {
			archives.setArchivesType(null);
			archives.setParentArchId(null);
		} else {
			archives.setParentArchId(archives.getArchivesType().getTypeId());
		}
		if (archives.getIsStandard() == null) {
			archives.setIsStandard((short) -1);
		}
		if (archives.getIsPublic() == null) {
			archives.setIsPublic((short) -1);
		}
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		//会议通知和工作通知转换时间格式特殊处理
		if(archives.getArchType().shortValue() == 5 || archives.getArchType().shortValue() == 6){
			JSONSerializer json = new JSONSerializer();
			json.include("archivesFiles");
			json.include("archivesDocs");
			json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"issueDate", "createtime","writtenDate","signDate","receiveDate","standardApproveDate","electronicDocDate"});
			json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), new String[] {
				"limitedDate"});
			sb.append(json.exclude(new String[] { "class" }).serialize(archives));
		}else{//其他
			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd").create();
			// JSONSerializer json = new JSONSerializer();
			// 将数据转成JSON格式
			sb.append(gson.toJson(archives));
		}
		// sb.append(json.serialize(archives));
		sb.deleteCharAt(sb.length() - 1);
		sb.append("}");
		sb.append("]}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	public String getAttachFiles() {
		String fileIds = getRequest().getParameter("fileIds");
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer json = new JSONSerializer();
		if (!fileIds.trim().isEmpty() && !"_".equals(fileIds)
				&& fileIds.indexOf("$") == -1) {
			ArrayList<FileAttach> faList = new ArrayList<FileAttach>();
			for (String fileId : fileIds.split(",")) {
				FileAttach fa = fileAttachService.get(new Long(fileId));
				if (fa != null) {
					faList.add(fa);
				}
			}
			sb.append(json.exclude(new String[] { "class" }).serialize(faList));
		} else {
			sb.append("null");
		}
		sb.append("}");
		jsonString = sb.toString();
		return SUCCESS;
	}

	/**
	 * 更新签发日期,status
	 * 
	 * @return
	 */
	public String updateArchSignDate() {
		String archId = getRequest().getParameter("archivesId");
		Long archiveId = new Long(archId);
		Archives Archives = archivesService.get(archiveId);
		Archives.setStatus((short) 2);
		Archives.setSignDate(new Date());
		Archives.setSignUserId(ContextUtil.getCurrentUserId());
		archivesService.save(Archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 更新电子公文status状态
	 * 
	 * @return
	 */
	public String updateElecArchStatus() {
		String archId = getRequest().getParameter("archivesId");
		if (archId != null && StringUtils.isNotEmpty(archId)) {
			Archives arch = archivesService.get(new Long(archId));
			arch.setStatus((short) 3);
			arch.setElectronicDocDate(new Date());
			archivesService.save(arch);
			
			// 如果是发文、行政、党政、规范性文件
			// 发送手机短信，通知起草人（拟稿人）
			if (arch.getArchType() == 0
					&& ("10".equals(arch.getExamineRecordNumber()) || "11".equals(arch.getExamineRecordNumber()))
					&& arch.getIsStandard() == 1) {
				String content = arch.getSubject() + "（标题）是规范性文件，"
						+ "请在2个工作日内将正式公文、起草说明、制定依据等材料通过发起“委发规范性文件审查（备案）材料移交”流程移交法规处。";
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + arch.getIssuer());
				}
				smsMobileService.saveSms(String.valueOf(arch.getIssuerId()),
						content);
			}
			
//			if (appUser.getMobile() != null) {
//				if (logger.isDebugEnabled()) {
//					logger.info("Notice " + appUser.getFullname()
//							+ " by mobile:" + appUser.getMobile());
//				}
//
//				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
//						content);
//			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 更新archives的主办部门
	 * 
	 * @return
	 */
	public String updateOrgDepId() {
		String archId = getRequest().getParameter("archivesId");
		String orgDepId = getRequest().getParameter("orgDepId");
		String orgDepName = getRequest().getParameter("orgDepName");
		if (archId != null && StringUtils.isNotEmpty(archId)) {
			Archives arch = archivesService.get(new Long(archId));
			if (orgDepId != null && StringUtils.isNotEmpty(orgDepId)) {
				arch.setOrgDepId(orgDepId);
			}
			if (orgDepName != null && StringUtils.isNotEmpty(orgDepName)) {
				arch.setOrgDepName(orgDepName);
			}
			archivesService.save(arch);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 修改是否为规范性文件id为必传
	 */
	public String isStandard() {
		SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String isStandard = getRequest().getParameter("isStandard");
		String archivesId = getRequest().getParameter("archivesId");
		String standardApproverId = getRequest().getParameter(
				"standardApproverId");
		String standardApproveDate = getRequest().getParameter(
				"standardApproveDate");
		Archives archives = archivesService.get(Long.valueOf(archivesId));
		if (null != isStandard && !"".equals(isStandard)) {
			archives.setIsStandard(Short.valueOf(isStandard));
		}
		if (null != standardApproverId && !"".equals(standardApproverId)) {
			archives.setStandardApprover(Long.valueOf(standardApproverId));
		}
		if (null != standardApproveDate && !"".equals(standardApproveDate)) {
			try {
				archives.setStandardApproveDate(sdFormat
						.parse(standardApproveDate));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 公文正文文档更新
	 */
	public String updateArchDocs() {
		String arcRecfileIds = getRequest().getParameter("arcRecfileIds");
		if (arcRecfileIds == null || arcRecfileIds.equals("")) {
			List<ArchivesDoc> list = archivesDocService.findByAid(archives
					.getArchivesId());
			for (ArchivesDoc archivesDoc : list) {
				archivesDocService.remove(archivesDoc);
			}
		}
		if (StringUtils.isNotEmpty(arcRecfileIds)) {
			List<ArchivesDoc> list = archivesDocService.findByAid(archives
					.getArchivesId());
			for (ArchivesDoc archivesDoc : list) {
				archivesDocService.remove(archivesDoc);
			}
			Archives archs = archivesService.get(archives.getArchivesId());
			String[] fileIds = arcRecfileIds.split(",");
			// 去重
			List<String> newFileIds = new ArrayList<>();
			boolean isHave = false;
			for (String id : fileIds) {
				isHave = false;
				for (String newId : newFileIds) {
					if (StringUtils.equals(id, newId)) {
						isHave = true;
						break;
					}
				}
				if (!isHave) {
					newFileIds.add(id);
				}
			}
			for (String id : newFileIds) {
				FileAttach fileAttach = fileAttachService.get(new Long(id));
				ArchivesDoc archivesDoc = new ArchivesDoc();
				archivesDoc.setArchives(archs);
				archivesDoc.setFileAttach(fileAttach);
				archivesDoc.setDocName(fileAttach.getFileName());
				archivesDoc.setDocStatus((short) 1);
				archivesDoc.setCurVersion(1);
				archivesDoc.setDocPath(fileAttach.getFilePath());
				archivesDoc.setCreatetime(new Date());
				archivesDoc.setUpdatetime(new Date());
				archivesDocService.save(archivesDoc);
			}
		}
		return SUCCESS;
	}

	/**
	 * 公文正文文档更新
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String addDoc2Arch() {
		// 取当前该附件的所有文档
		String doc = getRequest().getParameter("doc");
		archivesId = Long.parseLong(getRequest().getParameter("archivesId"));
		archives = archivesService.get(archivesId);
		if (StringUtils.isNotEmpty(doc) && archives != null) {
			AppUser curUser = ContextUtil.getCurrentUser();

			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			ArchivesDoc archivesDoc = gson.fromJson(doc, ArchivesDoc.class);
			Set archivesDocSet = archives.getArchivesDocs();
			Date now = new Date();
			if (archivesDoc != null) {
				if (archivesDoc.getDocId() == null
						|| archivesDoc.getDocId() == 0) {
					archivesDoc.setDocId(null);
					archivesDoc.initUsers(curUser);
					archivesDoc.setDocStatus(ArchivesDoc.STATUS_MODIFY);
					archivesDoc.setUpdatetime(now);
					archivesDoc.setCreatetime(now);
					archivesDoc.setIsFinish((short) 0);
					archivesDoc.setFileAttach(fileAttachService
							.getByPath(archivesDoc.getDocPath()));
					archivesDoc.setCurVersion(1);
					archivesDoc = archivesDocService.save(archivesDoc);

					// 新增文件同时在历史表增加一历史记录
					DocHistory newHistory = new DocHistory();
					newHistory.setArchivesDoc(archivesDoc);
					newHistory.setFileAttach(archivesDoc.getFileAttach());
					newHistory.setDocName(archivesDoc.getDocName());
					newHistory.setPath(archivesDoc.getDocPath());
					newHistory.setVersion(ArchivesDoc.ORI_VERSION);
					newHistory.setUpdatetime(now);
					newHistory.setMender(curUser.getFullname());
					docHistoryService.save(newHistory);
				} else {
					archivesDoc = archivesDocService
							.get(archivesDoc.getDocId());
				}
				archivesDocSet.add(archivesDoc);
			}
			archives = archivesService.save(archives);

			setJsonString("{success:true,archivesDocId:'"
					+ archivesDoc.getDocId() + "'}");

		}

		return SUCCESS;
	}
	
	/**
	 * 公文正文文档更新
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String addDocExtArch() {
		// 取当前该附件的所有文档
		String doc = getRequest().getParameter("doc");
		archivesId = Long.parseLong(getRequest().getParameter("archivesId"));
		archives = archivesService.get(archivesId);
		if (StringUtils.isNotEmpty(doc) && archives != null) {
			AppUser curUser = ContextUtil.getCurrentUser();

			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			ArchivesDocExt archivesDocExt = gson.fromJson(doc, ArchivesDocExt.class);
//			Set archivesDocSet = archives.getArchivesDocs();
			Date now = new Date();
			if (archivesDocExt != null) {
				if (archivesDocExt.getDocId() == null
						|| archivesDocExt.getDocId() == 0) {
					archivesDocExt.setDocId(null);
					archivesDocExt.setArchivesId(archivesId);
					archivesDocExt.initUsers(curUser);
					archivesDocExt.setDocStatus(ArchivesDoc.STATUS_MODIFY);
					archivesDocExt.setUpdatetime(now);
					archivesDocExt.setCreatetime(now);
					archivesDocExt.setIsFinish((short) 0);
					archivesDocExt.setFileAttach(fileAttachService
							.getByPath(archivesDocExt.getDocPath()));
					archivesDocExt.setCurVersion(1);
					archivesDocExt = archivesDocExtService.save(archivesDocExt);

					// 新增文件同时在历史表增加一历史记录
					DocExtHistory newHistory = new DocExtHistory();
					newHistory.setArchivesDocExt(archivesDocExt);
					newHistory.setFileAttach(archivesDocExt.getFileAttach());
					newHistory.setDocName(archivesDocExt.getDocName());
					newHistory.setPath(archivesDocExt.getDocPath());
					newHistory.setVersion(ArchivesDoc.ORI_VERSION);
					newHistory.setUpdatetime(now);
					newHistory.setMender(curUser.getFullname());
					docExtHistoryService.save(newHistory);
				} else {
					archivesDocExt = archivesDocExtService
							.get(archivesDocExt.getDocId());
				}
//				archivesDocSet.add(archivesDocExt);
			}
//			archives = archivesService.save(archives);

			setJsonString("{success:true,archivesDocId:'"
					+ archivesDocExt.getDocId() + "'}");

		}

		return SUCCESS;
	}

	/**
	 * 更新公文是否接收状态
	 * 
	 * @return
	 */
	public String updateIsReceive() {
		String archId = getRequest().getParameter("archivesId");
		if (archId != null && StringUtils.isNotEmpty(archId)) {
			Archives arch = archivesService.get(new Long(archId));
			arch.setIsreceive((long) 1);
			arch.setReceiveDate(new Date());
			archivesService.save(arch);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 根据公文ID，查询流程实例ID
	 * 
	 * @return
	 */
	public String getProcessDetail() {
		Long archivesId = Long.parseLong(getRequest()
				.getParameter("archivesId"));
		Archives archives = archivesService.get(archivesId);
		if (archives.getProcessRun() != null) {
			Long runId = archives.getProcessRun().getRunId();
			Long defId = archives.getProcessRun().getProDefinition().getDefId();
			jsonString = "{success:true,\"runId\":" + runId + ",\"defId\":"
					+ defId + "}";
		} else {
			jsonString = "{success:false}";
		}
		return SUCCESS;
	}

	/**
	 * 显示发送列表
	 */
	public String listSent() {
		String depId = getRequest().getParameter("department");
		String[] deppath = null;
		if (depId != null && StringUtils.isNotEmpty(depId)) {
			Department dep = departmentService.get(new Long(depId));
			deppath = dep.getPath().split("\\.");
		}
		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysConfig isdocumentLoaderId = sysConfigService
				.findByKey("documentLoaderId");
		boolean isAdmin = false;
		Set<AppRole> roles = user.getRoles();
		boolean isarchNoAdmin = false;
		for (AppRole role : roles) {
			if ((role.getRoleId().toString().equals(isdocumentLoaderId
					.getDataValue()))) {
				isarchNoAdmin = true;
				logger.info("当前用户具有公文下载员");
				break;
			}
		}
		for (AppRole role : roles) {
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
				logger.info("当前用户具有系统超级管理员");
				break;
			}
		}
		if (isarchNoAdmin) {
			Department dep = departmentService.get(new Long(depId));
			if (dep.getDepLevel() > 3) {
				filter.addFilter("Q_department.parentId_L_EQ", (deppath[2]));
			} else {
				filter.addFilter("Q_department.depId_L_EQ",
						(deppath[deppath.length - 1]));
			}
		}
		if (!isarchNoAdmin && !isAdmin) {
			filter.addFilter("Q_issuerId_L_EQ", (user.getId()).toString());
		}
		List<Archives> list = archivesService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		for (Archives archives : list) {
			Department depart = appUserService.get(archives.getIssuerId())
					.getDepartment();
			if (depart.getDepLevel() > 3 && !isAdmin && deppath.length > 3) {
				archives.setArchChecker(departmentService.get(
						new Long(deppath[2])).getDepName());
			} else {
				archives.setArchChecker(appUserService
						.get(archives.getIssuerId()).getDepartment()
						.getDepName());
			}
		}
		JSONSerializer serializer = new JSONSerializer();

		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");

		serializer.transform(new DateTransformer("yyyy-MM-dd"), "issueDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "receiveDate");
		/*
		 * Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
		 * .setDateFormat("yyyy-MM-dd").create();
		 */

		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));

		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	public String listReceive() {
		QueryFilter filter = new QueryFilter(getRequest());
		List<Archives> list = archivesService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		for (Archives archives : list) {
			Department depart = appUserService.get(archives.getIssuerId())
					.getDepartment();
			String[] depath = depart.getPath().split("\\.");
			if (depart.getDepLevel() > 3) {
				archives.setArchChecker(departmentService.get(
						new Long(depath[2])).getDepName());
			} else {
				archives.setArchChecker(appUserService
						.get(archives.getIssuerId()).getDepartment()
						.getDepName());
			}
		}
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "issueDate");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 修改是否排版字段
	 */
	public String updateIsComSetting() {
		String archivesId = getRequest().getParameter("archivesId");
		if (archivesId != null && !archivesId.equals("")) {
			Archives archives = archivesService.get(new Long(archivesId));
			archives.setIsComSetting(new Long(1));
			archivesService.save(archives);
		}
		return SUCCESS;
	}

	// 拒收公文保存
	public String updatereject() {
		String archId = getRequest().getParameter("archives.archivesId");
		String unPublicReasons = getRequest().getParameter(
				"archives.unPublicReasons");
		String isreceive = getRequest().getParameter("archives.isreceive");
		Long archiveId = new Long(archId);
		Archives archives = archivesService.get(archiveId);
		if (null != unPublicReasons)
			archives.setUnPublicReasons(unPublicReasons);
		if (null != isreceive)
			archives.setIsreceive(new Long(isreceive));
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	// 根据流程ID查到流程名称
	public String getdefname() {
		Long defId = Long.parseLong(getRequest().getParameter("defId"));
		ProDefinition proDefinition = proDefinitionService.get(defId);
		String name = proDefinition.getName();
		jsonString = "{success:true,name:\"" + name + "\"}";
		return SUCCESS;
	}

	/**
	 * 更新公文是否转移到oa_common
	 * 
	 * @return
	 */
	public String updateSentStatus() {
		String archId = getRequest().getParameter("archivesId");
		if (archId != null && StringUtils.isNotEmpty(archId)) {
			Archives arch = archivesService.get(new Long(archId));
			arch.setTransfered(0);
			archivesService.save(arch);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * OA办公小助手搜索接口-在办件
	 * add by sicen.liu
	 * @return
	 */
	public String oaOfficeHelperList(){
		QueryFilter filter = new QueryFilter(getRequest());
		//String archId = getRequest().getParameter("archivesId");
		String taskId = getRequest().getParameter("taskId");
		ProcessInstance pis=jbpmService.getProcessInstanceByTaskId(taskId.toString());
		Long runId=processRunService.getByPiId(pis.getId()).getRunId();
		if (runId != null && StringUtils.isNotEmpty(runId.toString())) {
			Archives arch = archivesService.getArchivesByRunId(runId);;
			String docName="";
			String fileName="";
			Set archivesDocs=arch.getArchivesDocs();
			if(archivesDocs!=null){
				Iterator docIt=archivesDocs.iterator();
				int i=0;
				while(docIt.hasNext()){
					i=i+1;
					ArchivesDoc doc=(ArchivesDoc)docIt.next();
					if(i==archivesDocs.size()){
						docName+=doc.getDocName();
					}else{
						docName+=doc.getDocName()+" ";
					}
				}
			}
			Set archivesFiles=arch.getArchivesFiles();
			if(archivesFiles!=null){
				Iterator fileIt=archivesFiles.iterator();
				int j=0;
				while(fileIt.hasNext()){
					j=j+1;
					FileAttach file=(FileAttach)fileIt.next();
					if(j==archivesFiles.size()){
						fileName+=file.getFileName();
					}else{
						fileName+=file.getFileName()+" ";
					}
				}
			}
			List<Archives> list=flowTaskReportService.getSearchList(arch.getSubject(), arch.getArchivesNo(), docName, fileName,filter.getPagingBean().getStart(),25,arch.getArchType().toString());
			int page=filter.getPagingBean().getStart()+filter.getPagingBean().getPageSize();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
					.append(list.size()).append(",result:");
			if(list.size()>page){
				list=list.subList(filter.getPagingBean().getStart(), page);
			}else{
				list=list.subList(filter.getPagingBean().getStart(), list.size());
			}
			JSONSerializer json = new JSONSerializer();
			buff.append(json.exclude(new String[] { "class" }).serialize(list));
			buff.append("}");
			jsonString = buff.toString();	
		}
		return SUCCESS;
	}
	/**
	 * OA办公小助手搜索接口-拟稿/收文登记
	 * add by sicen.liu
	 * @return
	 */
	public String oaSearchList(){
		QueryFilter filter = new QueryFilter(getRequest());
		String subject = getRequest().getParameter("subject");
		String docName = getRequest().getParameter("docName");
		String fileName = getRequest().getParameter("fileName");
		String archType = getRequest().getParameter("archType");
		List<Archives> list=flowTaskReportService.getSearchList(subject, null, docName,fileName,filter.getPagingBean().getStart(),25,archType.toString());
		int page=filter.getPagingBean().getStart()+filter.getPagingBean().getPageSize();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(list.size()).append(",result:");
		if(list.size()>page){
			list=list.subList(filter.getPagingBean().getStart(), page);
		}else{
			list=list.subList(filter.getPagingBean().getStart(), list.size());
		}
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	/**
	 * OA办公小助手搜索接口-菜单输入框
	 * add by sicen.liu
	 * @return
	 */
	public String oaMenuSearchList(){
		QueryFilter filter = new QueryFilter(getRequest());
		String searchText = getRequest().getParameter("searchText");
		List<Archives> list=flowTaskReportService.getMenuSearchList(searchText, filter.getPagingBean().getStart(), 25, "0");
		int page=filter.getPagingBean().getStart()+filter.getPagingBean().getPageSize();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(list.size()).append(",result:");
		if(list.size()>page){
			list=list.subList(filter.getPagingBean().getStart(), page);
		}else{
			list=list.subList(filter.getPagingBean().getStart(), list.size());
		}
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	/**
	 * 搜索引擎获得抄送公文
	 */
	public String getCCJW() {

		String user = getRequest().getParameter("userId");
		String archivesNo = getRequest().getParameter("archivesNo");
		String depSignNo = getRequest().getParameter("depSignNo");
		String subject = getRequest().getParameter("subject");
		String stat = getRequest().getParameter("status");
		Long userId = null;
		if (null != user && !"".equals(user))
			userId = new Long(user);
		int status = 0;
		if (null != stat && !"".equals(stat))
			status = Integer.parseInt(stat);
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		List<OdArchivescc> list = archivesService.listCCJW(userId, archivesNo,
				depSignNo, subject, status, start, size);
		int con = archivesService.count(userId, archivesNo, depSignNo, subject, status, start, size);
		/*
		 * List<Archives> list = archivesService.getCC(getRequest(),new
		 * Long(userId), defId, archivesNo, depName, subject);
		 */
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(con).append(",result:");

		JSONSerializer serializer = new JSONSerializer();

		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");

		/*
		 * Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
		 * .setDateFormat("yyyy-MM-dd").create();
		 */

		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));

		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;

	}
	
	public String changeStandard() {
		String archivesId = getRequest().getParameter("archivesId");
		String isStandard = getRequest().getParameter("isStandard");
		if (StringUtils.isNotEmpty(isStandard)) {
			if (archivesId != null && !archivesId.equals("")) {
				Archives archives = archivesService.get(new Long(archivesId));
				archives.setIsStandard(Short.parseShort(isStandard));
				archivesService.save(archives);
			}
		}
		return SUCCESS;
	}
	
	public String updateDraft() {
		String archId = getRequest().getParameter("archivesId");
		String status = getRequest().getParameter("status");
		String fileCounts = getRequest().getParameter("fileCounts");
		String isDraft = getRequest().getParameter("isDraft");
		String receiveDep = getRequest().getParameter("receiveDep");
		String receiveDepNames = getRequest().getParameter("receiveDepNames");
		String shortContent = getRequest().getParameter("shortContent");
		String orgDepName = getRequest().getParameter("orgDepName");
		String orgDepId = getRequest().getParameter("orgDepId");
		if (archId != null && StringUtils.isNotEmpty(archId)) {
			Archives arch = archivesService.get(new Long(archId));
			if (isDraft != null && StringUtils.isNotEmpty(isDraft)){
				arch.setIsdraft(new Long(isDraft));
			}
			if (fileCounts != null && StringUtils.isNotEmpty(fileCounts)){
				arch.setFileCounts(new Integer(fileCounts));
			}
			if (status != null && StringUtils.isNotEmpty(status)){
				arch.setStatus(new Short(status));
			}
			if (receiveDep != null && StringUtils.isNotEmpty(receiveDep)){
				arch.setRecDepIds(receiveDep);
				arch.setRecDepNames(receiveDepNames);
			}
			if (shortContent != null && StringUtils.isNotEmpty(shortContent)){
				arch.setShortContent(shortContent);
			}
			if (orgDepName != null && StringUtils.isNotEmpty(orgDepName)){
				arch.setOrgDepName(orgDepName);
			}
			if (orgDepId != null && StringUtils.isNotEmpty(orgDepId)){
				arch.setOrgDepId(orgDepId);
			}
			archivesService.save(arch);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	public String reportArchToBack() {
		String archivesId = getRequest().getParameter("archivesId");
		//删除分发表sys_data_transfer数据
		List<SysDataTransfer> list=sysDataTransferService.getListByArchivesId(new Long(archivesId));
		for (SysDataTransfer sysDataTransfer : list) {
			sysDataTransferHisService.deleteHis(sysDataTransfer.getId());
			sysArchivesFilesService.removeById(null, sysDataTransfer.getId(), null);
			sysDataTransferService.remove(sysDataTransfer.getId());
		}
		Archives arch = archivesService.get(new Long(archivesId));
		arch.setIsdraft(new Long(3));
		//arch.setTransfered(0);
		archivesService.save(arch);
		//更新数据至待分发
		setJsonString("{success:true}");
		return SUCCESS;
	}
	public String reportArchToBackDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				List<ArchivesDep> adList=archivesDepService.getSentArchsByArchId(new Long(id));
				for(ArchivesDep ad:adList){
					archivesDepService.remove(ad.getArchDepId());
				}
				List<SysDataTransfer> list=sysDataTransferService.getListByArchivesId(new Long(id));
				for (SysDataTransfer sysDataTransfer : list) {
					sysDataTransferHisService.deleteHis(sysDataTransfer.getId());
					sysArchivesFilesService.removeById(null, sysDataTransfer.getId(), null);
					sysDataTransferService.remove(sysDataTransfer.getId());
				}
				archivesService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}
}
