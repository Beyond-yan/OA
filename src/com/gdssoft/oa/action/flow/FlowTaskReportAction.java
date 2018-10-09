package com.gdssoft.oa.action.flow;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.SolrArchives;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.FlowTaskReportService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.util.BeanToMapUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class FlowTaskReportAction extends BaseAction{
	@Resource
	private FlowTaskReportService flowTaskReportService;
	private FlowTaskReport flowTaskReport;
	
	@Resource
	private ProcessFormService processFormService;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public FlowTaskReport getFlowTaskReport() {
		return flowTaskReport;
	}

	public void setFlowTaskReport(FlowTaskReport flowTaskReport) {
		this.flowTaskReport = flowTaskReport;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter=new QueryFilter(getRequest());
		String toDoType=getRequest().getParameter("toDoType");
		String archiveType=getRequest().getParameter("archiveType");
		String subject=getRequest().getParameter("subject");
		String depName=getRequest().getParameter("depName");
		String defId=getRequest().getParameter("defId");
		String startDate=getRequest().getParameter("startDate");
		String endDate=getRequest().getParameter("endDate");
		String orgDepId=getRequest().getParameter("orgDepId");
		String archiveNo=getRequest().getParameter("archiveNo");
		String snConfigId =getRequest().getParameter("snConfigId");
		String depSignNo =getRequest().getParameter("depSignNo");
		String issuerName =getRequest().getParameter("issuerName");
		String assignUserName =getRequest().getParameter("assignUserNameSearch");
		String issuerDepId =getRequest().getParameter("issuerDepId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		Long defid = null;
		if(StringUtils.isNotBlank(defId)) defid=new Long(defId);
		Long signId = null;
		if(StringUtils.isNotBlank(snConfigId)) signId=new Long(snConfigId);
		Long issuerDepid = null;
		if(StringUtils.isNotBlank(issuerDepId)) issuerDepid=new Long(issuerDepId);
		List<FlowTaskReport> list= flowTaskReportService.getNewFlowTaskList(ContextUtil.getCurrentUserId(),Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid,assignUserName);
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"archCreateTime", "sendTime","signDate"});
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), new String[] {
			"limitedDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 显示列表
	 */
	public String officeMeetinglist(){
		QueryFilter filter=new QueryFilter(getRequest());
		String toDoType=getRequest().getParameter("toDoType");
		String archiveType=getRequest().getParameter("archiveType");
		String subject=getRequest().getParameter("subject");
		String depName=getRequest().getParameter("depName");
		String defId=getRequest().getParameter("defId");
		String startDate=getRequest().getParameter("startDate");
		String endDate=getRequest().getParameter("endDate");
		String orgDepId=getRequest().getParameter("orgDepId");
		String archiveNo=getRequest().getParameter("archiveNo");
		String snConfigId =getRequest().getParameter("snConfigId");
		String depSignNo =getRequest().getParameter("depSignNo");
		String issuerName =getRequest().getParameter("issuerName");
		String assignUserName =getRequest().getParameter("assignUserNameSearch");
		String issuerDepId =getRequest().getParameter("issuerDepId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		Long defid = null;
		if(StringUtils.isNotBlank(defId)) defid=new Long(defId);
		Long signId = null;
		if(StringUtils.isNotBlank(snConfigId)) signId=new Long(snConfigId);
		Long issuerDepid = null;
		if(StringUtils.isNotBlank(issuerDepId)) issuerDepid=new Long(issuerDepId);
		List<FlowTaskReport> list= flowTaskReportService.getNewFlowTaskList(ContextUtil.getCurrentUserId(),Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid,assignUserName);
		List<Map<String, Object>> mapList = new ArrayList<Map<String,Object>>();
		try {
			mapList = BeanToMapUtil.convertListBean2ListMap(list, FlowTaskReport.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		for(Map<String, Object> object : mapList){
			Long runId = Long.parseLong(object.get("runId").toString());
			Map processRunVars = processFormService.getVariables(runId,schemaCode);
			object.putAll(processRunVars);
		}
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"archCreateTime", "sendTime","signDate"});
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), new String[] {
			"limitedDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(mapList));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 
	 * 主任办公会期数管理列表
	 * @return
	 */
	public String officeMeetingTimeslist(){
		QueryFilter filter=new QueryFilter(getRequest());
		String subject=getRequest().getParameter("subject");
		String timesId=getRequest().getParameter("timesId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		List<Map<String, Object>> list= flowTaskReportService.getOfficeMeetingTimes(subject,timesId,start,limit);
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = Integer.parseInt(list.get(0).get("totalCounts").toString());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}

	/**
	 * 
	 * 主任办公会委领导审核列表
	 * @return
	 */
	public String OfficeMeetingWleaderlist(){
		QueryFilter filter=new QueryFilter(getRequest());
		String subject=getRequest().getParameter("subject");
		String timesId=getRequest().getParameter("timesId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		List<Map<String, Object>> list= flowTaskReportService.OfficeMeetingWleaderlist(subject,timesId,start,limit);
		for(Map<String, Object> object : list){
			Long runId = Long.parseLong(object.get("RUNID").toString());
			Map processRunVars = processFormService.getVariables(runId,schemaCode);
			object.putAll(processRunVars);
		}
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = Integer.parseInt(list.get(0).get("totalCounts").toString());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}

	/**
	 * 
	 * 主任办公会办公室主任审核列表
	 * @return
	 */
	public String OfficeMeetingBGSZRlist(){
		QueryFilter filter=new QueryFilter(getRequest());
		String subject=getRequest().getParameter("subject");
		String timesId=getRequest().getParameter("timesId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		List<Map<String, Object>> list= flowTaskReportService.OfficeMeetingBGSZRlist(subject,timesId,start,limit);
		for(Map<String, Object> object : list){
			Long runId = Long.parseLong(object.get("RUNID").toString());
			Map processRunVars = processFormService.getVariables(runId,schemaCode);
			object.putAll(processRunVars);
		}
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = Integer.parseInt(list.get(0).get("totalCounts").toString());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	public String listDetail(){
		String runId = getRequest().getParameter("runId");
		String archiveType=getRequest().getParameter("archiveType");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		Long runid = null;
		int archivetype = 0;
		if (StringUtils.isNotBlank(runId)) {
			runid = new Long(runId);
		}
		if (StringUtils.isNotBlank(archiveType)) {
			archivetype = Integer.parseInt(archiveType);
		}
		List<FlowTaskReport> list= flowTaskReportService.getNewFlowTaskListDetail(runid, ContextUtil.getCurrentUserId(), archivetype, start,limit);
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"archCreateTime", "sendTime","limitedDate","signDate", "standardApproveDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 首页待下载公文显示
	 * 
	 */
	public String display(){
		QueryFilter filter=new QueryFilter(getRequest());
		String toDoType=getRequest().getParameter("toDoType");
		String archiveType=getRequest().getParameter("archiveType");
		String subject=getRequest().getParameter("subject");
		String depName=getRequest().getParameter("depName");
		String defId=getRequest().getParameter("defId");
		String startDate=getRequest().getParameter("startDate");
		String endDate=getRequest().getParameter("endDate");
		String orgDepId=getRequest().getParameter("orgDepId");
		String archiveNo=getRequest().getParameter("archiveNo");
		String snConfigId =getRequest().getParameter("snConfigId");
		String depSignNo =getRequest().getParameter("depSignNo");
		String issuerName =getRequest().getParameter("issuerName");
		String assignUserName =getRequest().getParameter("assignUserNameSearch");
		String issuerDepId =getRequest().getParameter("issuerDepId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		Long defid = null;
		if(StringUtils.isNotBlank(defId)) defid=new Long(defId);
		Long signId = null;
		if(StringUtils.isNotBlank(snConfigId)) signId=new Long(snConfigId);
		Long issuerDepid = null;
		if(StringUtils.isNotBlank(issuerDepId)) issuerDepid=new Long(issuerDepId);
		List<FlowTaskReport> list= flowTaskReportService.getNewFlowTaskList(ContextUtil.getCurrentUserId(),Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid,assignUserName);
		//加载数据至awaitDownload
		getRequest().setAttribute("awaitDownload", list);
		
		return "display";
	}
	
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				flowTaskReportService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		FlowTaskReport flowTaskReport=flowTaskReportService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(flowTaskReport));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(flowTaskReport.getDefId()==null){
			flowTaskReportService.save(flowTaskReport);
		}else{
			FlowTaskReport orgFileSnConfigHistory= flowTaskReportService.get(flowTaskReport.getDefId());
			try{
				BeanUtil.copyNotNullProperties(orgFileSnConfigHistory, flowTaskReport);
				flowTaskReportService.save(orgFileSnConfigHistory);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	/**
	 * 显示列表
	 */
	public String listJW(){
		String toDoType=getRequest().getParameter("toDoType");
		String archiveType=getRequest().getParameter("archiveType");
		String subject=getRequest().getParameter("subject");
		String depName=getRequest().getParameter("depName");
		String defId=getRequest().getParameter("defId");
		String startDate=getRequest().getParameter("startDate");
		String endDate=getRequest().getParameter("endDate");
		String orgDepId=getRequest().getParameter("orgDepId");
		String archiveNo=getRequest().getParameter("archiveNo");
		String snConfigId =getRequest().getParameter("snConfigId");
		String depSignNo =getRequest().getParameter("depSignNo");
		String issuerName =getRequest().getParameter("issuerName");
		String assignUserName =getRequest().getParameter("assignUserNameSearch");
		String issuerDepId =getRequest().getParameter("issuerDepId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		Long defid = null;
		if(StringUtils.isNotBlank(defId)) defid=new Long(defId);
		Long signId = null;
		if(StringUtils.isNotBlank(snConfigId)) signId=new Long(snConfigId);
		Long issuerDepid = null;
		if(StringUtils.isNotBlank(issuerDepId)) issuerDepid=new Long(issuerDepId);
		AppUser user = ContextUtil.getCurrentUser();
		Long SchemaId=user.getOwnerSchemaId();
		if(SchemaId==1){
			List<FlowTaskReport> list= flowTaskReportService.getnewJwArchives(ContextUtil.getCurrentUserId(),Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid);
			int totalCounts = 0;
			totalCounts=flowTaskReportService.count(ContextUtil.getCurrentUserId(),Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid);
			//if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
			.append(totalCounts).append(",result:");
			JSONSerializer json = new JSONSerializer();
			json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"archCreateTime", "sendTime","limitedDate","signDate","issueDate","writtenDate"});
			buff.append(json.exclude(new String[] { "class" }).serialize(list));
			buff.append("}");
			
			jsonString=buff.toString();
		}
		else{		
			List<FlowTaskReport> list= flowTaskReportService.getNewFlowTaskList(ContextUtil.getCurrentUserId(),Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid,assignUserName);
			int totalCounts = 0;
			if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
			.append(totalCounts).append(",result:");
			JSONSerializer json = new JSONSerializer();
			json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"archCreateTime", "sendTime","limitedDate","signDate"});
			buff.append(json.exclude(new String[] { "class" }).serialize(list));
			buff.append("}");
			
			jsonString=buff.toString();}
		
		return SUCCESS;
	}

}
