package com.gdssoft.oa.util;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.action.flow.FlowStatisticsReportAction;
import com.gdssoft.oa.model.archive.OdCommonComments;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.reports.DepartmentReport;
import com.gdssoft.oa.model.reports.ReceiveReport;
import com.gdssoft.oa.model.reports.SendReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFiles;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.work.WorkContent;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.OdCommonCommentsService;
import com.gdssoft.oa.service.flow.FlowStatisticsReportService;
import com.gdssoft.oa.service.system.DocDirectoryService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysDataTransferService;
import com.gdssoft.oa.service.work.WorkContentService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class DwonLoadAction extends ActionSupport {
	@Resource
	private FlowStatisticsReportService flowStatisticsReportService;
	@Resource
	private DocFilesService docFilesService;
	@Resource
	private DocDirectoryService docDirectoryService;
	private ComPanyReport comPanyReport;
	
	@Resource
	private ArchivesService archivesService;
	
	public ArchivesService getArchivesService() {
		return archivesService;
	}

	public void setArchivesService(ArchivesService archivesService) {
		this.archivesService = archivesService;
	}

	private InputStream excelStream;  //输入流变量
	private String downloadFileName;
	
	public void setDownloadFileName(String downloadFileName) {
		this.downloadFileName = downloadFileName;
	}

	private Log logger = LogFactory.getLog(DwonLoadAction.class);
	
	/**
	 * 公司级报表导出Excel
	 * @return
	 */
	public String companyRepToExcel(){
		logger.info("----comed into companyRepToExcel method----");
		try {
			QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			System.out.println(beginDate);
			System.out.println(endDate);
			List<ComPanyReport> resultList = flowStatisticsReportService.queryReportByCompany(beginDate, endDate);
			logger.info("resultList:"+resultList);
			excelStream = flowStatisticsReportService.listToCompExcel(resultList,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	/**
	 * 部门级报表导出Excel
	 * @return
	 */
	public String departmentRepToExcel(){
		logger.info("----comed into departmentRepToExcel method----");
		try {
			QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
			String depName =ServletActionContext.getRequest().getParameter("depName");
			depName = java.net.URLDecoder.decode(depName,"UTF-8");
			if(depName.equals("全部")){
				depName="";
			}
			
		
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			System.out.println("depName:"+depName);
			System.out.println("beginDate:"+beginDate);
			System.out.println("endDate:"+endDate);
			List<DepartmentReport> resultList = flowStatisticsReportService.queryReportByDepartment(depName, beginDate, endDate);
			excelStream = flowStatisticsReportService.listToDeptExcel(resultList,depName,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	/**
	 * 收文统计报表导出Excel
	 * @return
	 */
	public String receiveRepToExcel(){
		logger.info("----comed into receiveRepToExcel method----");
		try {
			QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
			String depName =ServletActionContext.getRequest().getParameter("depName");
			depName = java.net.URLDecoder.decode(depName,"UTF-8");
			if(depName.equals("全部")){
				depName="";
			}
			String flowName = ServletActionContext.getRequest().getParameter("flowName");
			flowName = java.net.URLDecoder.decode(flowName,"UTF-8");
			if(flowName.equals("全部")){
				flowName="";
			}
			String status = ServletActionContext.getRequest().getParameter("status");
			if(status.equals("0")){
				status="";
			}
		
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			String overDateFlag = ServletActionContext.getRequest().getParameter("overDateFlag");
			logger.info("depName:"+depName);
			logger.info("beginDate:"+beginDate);
			logger.info("endDate:"+endDate);
			List<ReceiveReport> resultList = flowStatisticsReportService.queryReportByReceive(depName,flowName,status,beginDate, endDate,overDateFlag);
			logger.info("---------resultList-------"+resultList);
			excelStream = flowStatisticsReportService.listToReceiveExcel(resultList,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	/**
	 * 发文统计报表导出Excel
	 * @return
	 */
	public String sendRepToExcel(){
		logger.info("----comed into sendRepToExcel method----");
		try {
			QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
			String depName =ServletActionContext.getRequest().getParameter("depName");
			depName = java.net.URLDecoder.decode(depName,"UTF-8");
			if(depName.equals("全部")){
				depName="";
			}
			String flowName = ServletActionContext.getRequest().getParameter("flowName");
			flowName = java.net.URLDecoder.decode(flowName,"UTF-8");
			if(flowName.equals("全部")){
				flowName="";
			}
			String status = ServletActionContext.getRequest().getParameter("status");
			if(status.equals("0")){
				status="";
			}
		
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			String overDateFlag = ServletActionContext.getRequest().getParameter("overDateFlag");
			logger.info("depName:"+depName);
			logger.info("beginDate:"+beginDate);
			logger.info("endDate:"+endDate);
			List<SendReport> resultList = flowStatisticsReportService.queryReportBySend(depName,flowName,status,beginDate, endDate,overDateFlag);
			logger.info("---------resultList-------"+resultList);
			excelStream = flowStatisticsReportService.listToRSendExcel(resultList,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	
	public InputStream getExcelStream() {
		return excelStream;
	}
	 
    public void setExcelStream(InputStream excelStream) {
       this.excelStream = excelStream;
    }
    
  //处理下载时  文件名是中文的方法：
    public String getDownloadFileName() {  
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyy-MM-dd ");        
		if(StringUtils.isBlank(downloadFileName))
			downloadFileName= (sf.format(new Date()).toString())+"公文处理情况汇总表.xls";
		try{
			downloadFileName=new String(downloadFileName.getBytes(),"ISO8859-1");
		}catch(UnsupportedEncodingException  e){
			e.printStackTrace();
		}
		return downloadFileName;
    }

    /**
	 * 公司级报表导出Excel
	 * @return
	 */
	public String comStepToExcel(){
		try {
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			System.out.println(beginDate);
			System.out.println(endDate);
			List<ComPanyReport> resultList = flowStatisticsReportService.queryReportByCompanyStep(beginDate, endDate);
			logger.info("resultList:"+resultList);
			excelStream = flowStatisticsReportService.listToCompStepExcel(resultList,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	/**
	 * 发文超时统计报表导出Excel
	 * @return
	 */
	public String sendRepStepToExcel(){
		logger.info("----comed into sendRepStepToExcel method----");
		try {
			QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
			String depName =ServletActionContext.getRequest().getParameter("depName");
			depName = java.net.URLDecoder.decode(depName,"UTF-8");
			if(depName.equals("全部")){
				depName="";
			}
			String flowName = ServletActionContext.getRequest().getParameter("flowName");
			flowName = java.net.URLDecoder.decode(flowName,"UTF-8");
			if(flowName.equals("全部")){
				flowName="";
			}
			String status = ServletActionContext.getRequest().getParameter("status");
			if(status.equals("0")){
				status="";
			}
		
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			String overDateFlag = ServletActionContext.getRequest().getParameter("overDateFlag");
			logger.info("depName:"+depName);
			logger.info("beginDate:"+beginDate);
			logger.info("endDate:"+endDate);
			List<ReceiveReport> resultList = flowStatisticsReportService.queryReportStepBySend(depName,flowName,status,beginDate, endDate,overDateFlag);
			logger.info("---------resultList-------"+resultList);
			excelStream = flowStatisticsReportService.listToSendStepExcel(resultList,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	/**
	 * 收文超时统计报表导出Excel
	 * @return
	 */
	public String receiveRepStepToExcel(){
		logger.info("----comed into receiveRepStepToExcel method----");
		try {
			QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
			String depName =ServletActionContext.getRequest().getParameter("depName");
			depName = java.net.URLDecoder.decode(depName,"UTF-8");
			if(depName.equals("全部")){
				depName="";
			}
			String flowName = ServletActionContext.getRequest().getParameter("flowName");
			flowName = java.net.URLDecoder.decode(flowName,"UTF-8");
			if(flowName.equals("全部")){
				flowName="";
			}
			String status = ServletActionContext.getRequest().getParameter("status");
			if(status.equals("0")){
				status="";
			}
		
			String beginDate =ServletActionContext.getRequest().getParameter("beginDate");
			String endDate = ServletActionContext.getRequest().getParameter("endDate");
			String staticsDate = ServletActionContext.getRequest().getParameter("staticsDate");
			String overDateFlag = ServletActionContext.getRequest().getParameter("overDateFlag");
			logger.info("depName:"+depName);
			logger.info("beginDate:"+beginDate);
			logger.info("endDate:"+endDate);
			List<ReceiveReport> resultList = flowStatisticsReportService.queryReportStepByReceive(depName,flowName,status,beginDate, endDate,overDateFlag);
			logger.info("---------resultList-------"+resultList);
			excelStream = flowStatisticsReportService.listToReceiveStepExcel(resultList,beginDate,endDate,staticsDate);
			return 	SUCCESS;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
	}
	
	/**
	 * 收文导出Excel
	 * @return
	 */
	public String receiveArchivesToExcel()throws UnsupportedEncodingException{
		String archiveType=ServletActionContext.getRequest().getParameter("archiveType");
		String subject=ServletActionContext.getRequest().getParameter("subject");
		String dir = ServletActionContext.getRequest().getParameter("dir");
		String sort = ServletActionContext.getRequest().getParameter("sort");
		if(StringUtils.isNotBlank(subject))
			subject = java.net.URLDecoder.decode(subject,"UTF-8");
		String defId=ServletActionContext.getRequest().getParameter("defId");
		String  snConfigId =ServletActionContext.getRequest().getParameter("snConfigId");
		String issuedep=ServletActionContext.getRequest().getParameter("issuedep");
		if(StringUtils.isNotBlank(issuedep))
			issuedep = java.net.URLDecoder.decode(issuedep,"UTF-8");
		String orgdepId=ServletActionContext.getRequest().getParameter("orgdepId");
		String startDate=ServletActionContext.getRequest().getParameter("startDate");
		String endDate=ServletActionContext.getRequest().getParameter("endDate");
		String archiveNo=ServletActionContext.getRequest().getParameter("archiveNo");
		if(StringUtils.isNotBlank(archiveNo))
			archiveNo = java.net.URLDecoder.decode(archiveNo,"UTF-8");
		String depSignNo=ServletActionContext.getRequest().getParameter("depSignNo");
		if(StringUtils.isNotBlank(depSignNo))
			depSignNo = java.net.URLDecoder.decode(depSignNo,"UTF-8");
		String issuerName=ServletActionContext.getRequest().getParameter("issuerName");
		if(StringUtils.isNotBlank(issuerName))
			issuerName = java.net.URLDecoder.decode(issuerName,"UTF-8");
		String privacyLevel=ServletActionContext.getRequest().getParameter("privacyLevel");
		if(StringUtils.isNotBlank(privacyLevel))
			privacyLevel = java.net.URLDecoder.decode(privacyLevel,"UTF-8");
		String urgentLevel=ServletActionContext.getRequest().getParameter("urgentLevel");
		if(StringUtils.isNotBlank(urgentLevel))
			urgentLevel = java.net.URLDecoder.decode(urgentLevel,"UTF-8");
		Long defid=null;
		if(defId!=null&&!"".equals(defId)) defid=new Long(defId);
		Long snConfigid =null;
		if(snConfigId!=null&&!"".equals(snConfigId)) snConfigid=new Long(snConfigId);
		List<FlowTaskReport> list = archivesService.getFinishedFlow(Integer.parseInt(archiveType), subject, ContextUtil.getCurrentUserId(), defid, issuedep, orgdepId, startDate, endDate, archiveNo, privacyLevel, urgentLevel,snConfigid,depSignNo,issuerName, 0, -1, dir, sort);
		logger.info("resultList:"+list);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd ");   
		downloadFileName= "重庆市交通委员会收文库" + sf.format(new Date()).toString() + ".xls";
		excelStream = archivesService.receivelistToExcel(list);
		return SUCCESS;
	}
	
	/**
	 * 发文导出Excel
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	public String sentArchivesToExcel() throws UnsupportedEncodingException{
		String archiveType=ServletActionContext.getRequest().getParameter("archiveType");
		String subject=ServletActionContext.getRequest().getParameter("subject");
		String dir = ServletActionContext.getRequest().getParameter("dir");
		String sort = ServletActionContext.getRequest().getParameter("sort");
		if(StringUtils.isNotBlank(subject))
			subject = java.net.URLDecoder.decode(subject,"UTF-8");
		String defId=ServletActionContext.getRequest().getParameter("defId");
		String  snConfigId =ServletActionContext.getRequest().getParameter("snConfigId");
		String issuedep=ServletActionContext.getRequest().getParameter("issuedep");
		if(StringUtils.isNotBlank(issuedep))
			issuedep = java.net.URLDecoder.decode(issuedep,"UTF-8");
		String orgdepId=ServletActionContext.getRequest().getParameter("orgdepId");
		String startDate=ServletActionContext.getRequest().getParameter("startDate");
		String endDate=ServletActionContext.getRequest().getParameter("endDate");
		String archiveNo=ServletActionContext.getRequest().getParameter("archiveNo");
		if(StringUtils.isNotBlank(archiveNo))
			archiveNo = java.net.URLDecoder.decode(archiveNo,"UTF-8");
		String depSignNo=ServletActionContext.getRequest().getParameter("depSignNo");
		if(StringUtils.isNotBlank(depSignNo))
			depSignNo = java.net.URLDecoder.decode(depSignNo,"UTF-8");
		String issuerName=ServletActionContext.getRequest().getParameter("issuerName");
		if(StringUtils.isNotBlank(issuerName))
			issuerName = java.net.URLDecoder.decode(issuerName,"UTF-8");
		String privacyLevel=ServletActionContext.getRequest().getParameter("privacyLevel");
		if(StringUtils.isNotBlank(privacyLevel))
			privacyLevel = java.net.URLDecoder.decode(privacyLevel,"UTF-8");
		String urgentLevel=ServletActionContext.getRequest().getParameter("urgentLevel");
		if(StringUtils.isNotBlank(urgentLevel))
			urgentLevel = java.net.URLDecoder.decode(urgentLevel,"UTF-8");
		Long defid=null;
		if(defId!=null&&!"".equals(defId)) defid=new Long(defId);
		Long snConfigid =null;
		if(snConfigId!=null&&!"".equals(snConfigId)) snConfigid=new Long(snConfigId);
		List<FlowTaskReport> list = archivesService.getFinishedFlow(Integer.parseInt(archiveType), subject, ContextUtil.getCurrentUserId(), defid, issuedep, orgdepId, startDate, endDate, archiveNo, privacyLevel, urgentLevel,snConfigid,depSignNo,issuerName, 0, -1, dir, sort);
		logger.info("resultList:"+list);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd ");   
		downloadFileName= "重庆市交通委员会发文库" + sf.format(new Date()).toString() + ".xls";
		excelStream = archivesService.sentlistToExcel(list);
		return SUCCESS;
	}
	/**
	 * 档案列表导出Excel
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	public String docFilesToExcel() throws UnsupportedEncodingException{
		String docDirId=ServletActionContext.getRequest().getParameter("docDirId");
		Long dicId=null;
		if(docDirId!=null&&!"".equals(docDirId)) dicId=new Long(docDirId);
		//档案目录
		DocDirectory docDirectory=docDirectoryService.get(dicId);
		//档案文件列表
		QueryFilter filter=new QueryFilter(ServletActionContext.getRequest());
		filter.addFilter("Q_docDirectory.id_L_EQ",docDirId);
		filter.getPagingBean().setPageSize(999999);
		filter.addSorted("fileNumber", "asc");
		List<DocFiles> list= docFilesService.getAll(filter);
		logger.info("resultList:"+list);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd ");  
		downloadFileName= "档案列表" + sf.format(new Date()).toString() + ".xls";
		String user=ContextUtil.getCurrentUser().getUsername();
		excelStream = docFilesService.sentlistToExcel(docDirectory, list,user);
		return SUCCESS;
	}
	@Resource
	private SysDataTransferService sysDataTransferService;
	
	public String transferArchivesToExcel()throws UnsupportedEncodingException{
		QueryFilter filter = new QueryFilter(ServletActionContext.getRequest());
		filter.getPagingBean().setPageSize(10000);
		filter.addFilter("Q_archivesno_S_LK", "退文");
		String subject=ServletActionContext.getRequest().getParameter("subject");
		if(StringUtils.isNotBlank(subject)){
			subject = java.net.URLDecoder.decode(subject,"UTF-8");
			filter.addFilter("Q_subject_S_LK", subject);
		}
		String createDateBegin=ServletActionContext.getRequest().getParameter("createDateBegin");
		if(StringUtils.isNotBlank(createDateBegin)){
			filter.addFilter("Q_createDate_D_GE", createDateBegin);
		}
		String createDateEnd=ServletActionContext.getRequest().getParameter("createDateEnd");
		if(StringUtils.isNotBlank(createDateEnd)){
			filter.addFilter("Q_createDate_D_LE", createDateEnd);
		}
		String archiveNo=ServletActionContext.getRequest().getParameter("archiveNo");
		if(StringUtils.isNotBlank(archiveNo)){
			archiveNo = java.net.URLDecoder.decode(archiveNo,"UTF-8");
			filter.addFilter("Q_archivesno_S_LK", archiveNo);
		}
		String sendDep=ServletActionContext.getRequest().getParameter("sendDep");
		if(StringUtils.isNotBlank(sendDep)){
			sendDep = java.net.URLDecoder.decode(sendDep,"UTF-8");
			filter.addFilter("Q_subject_L_EQ", sendDep);
		}
		String transferType=ServletActionContext.getRequest().getParameter("transferType");
		if(StringUtils.isNotBlank(transferType)){
			filter.addFilter("Q_transferType_L_EQ", transferType);
		}
		filter.addSorted("createDate", "DESC");
		List<SysDataTransfer> list = sysDataTransferService.getAll(filter);
		logger.info("resultList:"+list);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd");   
		downloadFileName= "退文统计" + sf.format(new Date()).toString() + ".xls";
		excelStream = archivesService.transferlistToExcel(list);
		return SUCCESS;
	}
	
/**
	 * 交委规范性文件导出Excel
	 * 
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	public String sentIsStandardArchivesToExcel() throws UnsupportedEncodingException{
		String archiveType=ServletActionContext.getRequest().getParameter("archiveType");
		String subject=ServletActionContext.getRequest().getParameter("subject");
		if(StringUtils.isNotBlank(subject))
			subject = java.net.URLDecoder.decode(subject,"UTF-8");
		String defId=ServletActionContext.getRequest().getParameter("defId");
		String  snConfigId =ServletActionContext.getRequest().getParameter("snConfigId");
		String  isStandard =ServletActionContext.getRequest().getParameter("isStandard");
		String  keywords =ServletActionContext.getRequest().getParameter("keywords");
		String issuedep=ServletActionContext.getRequest().getParameter("issuedep");
		if(StringUtils.isNotBlank(issuedep))
			issuedep = java.net.URLDecoder.decode(issuedep,"UTF-8");
		String orgdepId=ServletActionContext.getRequest().getParameter("orgdepId");
		String startDate=ServletActionContext.getRequest().getParameter("startDate");
		String endDate=ServletActionContext.getRequest().getParameter("endDate");
		String archiveNo=ServletActionContext.getRequest().getParameter("archiveNo");
		if(StringUtils.isNotBlank(archiveNo))
			archiveNo = java.net.URLDecoder.decode(archiveNo,"UTF-8");
		String depSignNo=ServletActionContext.getRequest().getParameter("depSignNo");
		if(StringUtils.isNotBlank(depSignNo))
			depSignNo = java.net.URLDecoder.decode(depSignNo,"UTF-8");
		String issuerName=ServletActionContext.getRequest().getParameter("issuerName");
		if(StringUtils.isNotBlank(issuerName))
			issuerName = java.net.URLDecoder.decode(issuerName,"UTF-8");
		String privacyLevel=ServletActionContext.getRequest().getParameter("privacyLevel");
		if(StringUtils.isNotBlank(privacyLevel))
			privacyLevel = java.net.URLDecoder.decode(privacyLevel,"UTF-8");
		String urgentLevel=ServletActionContext.getRequest().getParameter("urgentLevel");
		if(StringUtils.isNotBlank(urgentLevel))
			urgentLevel = java.net.URLDecoder.decode(urgentLevel,"UTF-8");
		Long defid=null;
		if(defId!=null&&!"".equals(defId)) defid=new Long(defId);
		Long snConfigid =null;
		if(snConfigId!=null&&!"".equals(snConfigId)) snConfigid=new Long(snConfigId);
		Long isstandard =null;
		if(isStandard!=null&&!"".equals(isStandard)) isstandard=new Long(isStandard);

		List<FlowTaskReport> list = archivesService.getIsStandardFinishedFlowJW(
				Integer.parseInt(archiveType), subject, defid, issuedep,
				orgdepId, startDate, endDate, archiveNo, privacyLevel,
				urgentLevel, snConfigid, isstandard, 
				keywords, 0, -1);
		
		logger.info("resultList:"+list);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd ");   
		downloadFileName= "重庆市交通委员会规范性文件库" + sf.format(new Date()).toString() + ".xls";
		excelStream = archivesService.isStandardSentlistToExcel(list);
		return SUCCESS;
	}
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private WorkContentService workContentService;
	public String workContentToExcel()throws UnsupportedEncodingException{
		QueryFilter filter = new QueryFilter(ServletActionContext.getRequest());
		SysConfig isArchivesManagerID=sysConfigService.findByKey("archivesManagerID");
		boolean flag=false;
		AppUser appUser = ContextUtil.getCurrentUser();
		Set<AppRole> roles = appUser.getRoles();
		for (AppRole role : roles) {
			if (role.getRoleId() == -1L)
			{
				flag = true;
				break;
			}
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				flag = true;
				break;
			}
		}
		String processStatus=ServletActionContext.getRequest().getParameter("processStatus");
		if(!flag){//没得权限
			if(processStatus!=null&&"0".equals(processStatus)){//可以办理
				filter.addFilter("Q_userid_S_LK", appUser.getUserId().toString());
			}else if(processStatus!=null&&"1".equals(processStatus)){
				filter.addFilter("Q_userid_S_NLK", appUser.getUserId().toString());
			}
		}
		filter.addSorted("orderid", "desc");
		filter.addSorted("createtime", "desc");
		List<WorkContent> list = workContentService.getAll(filter);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd ");   
		downloadFileName= "重庆市交通委员会督查事项" + sf.format(new Date()).toString() + ".xls";
		excelStream = archivesService.workContentListToExcel(list);
		return SUCCESS;
	}
	public static void main(String[] args) {
		System.out.println("gljadmin".startsWith("glj"));
	}
}
