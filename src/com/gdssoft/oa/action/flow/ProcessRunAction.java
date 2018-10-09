package com.gdssoft.oa.action.flow;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.jbpm.api.ProcessInstance;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesRecycleLog;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessFormNextTask;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchivesRecycleLogService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessFormNextTaskService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.util.ListComparator;
import com.google.gson.Gson;

import flexjson.JSONSerializer;

/**
 * 
 * @author csx
 * 
 */
public class ProcessRunAction extends BaseAction {
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ProcessFormNextTaskService processFormNextTaskService;
	private ProcessRun processRun;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private ProcessFormService processFormService;

	@Resource
	private ProDefinitionService proDefinitionService;
	
	@Resource
	private ArchivesRecycleLogService recycleLogService;
	
	private Long runId;

	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}

	public ProcessRun getProcessRun() {
		return processRun;
	}

	public void setProcessRun(ProcessRun processRun) {
		this.processRun = processRun;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		String proTypeId = getRequest().getParameter("proTypeId");
		String from = getRequest().getParameter("from") + " 00:00:00";
		String to = getRequest().getParameter("to") + " 23:59:59";
		filter.addFilter("Q_createtime_D_GE", from);
		
		filter.addFilter("Q_createtime_D_LE", to);
		if(!ContextUtil.getCurrentUser().getIsAdmin()){
			filter.addFilter("Q_appUser.userId_L_EQ", ContextUtil.getCurrentUserId().toString());
		}
		filter.addFilter("Q_proDefinition.defId_L_EQ", proTypeId);
		List<ProcessRun> list = processRunService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:[");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		for (ProcessRun run : list) {
			buff.append("{runId:'").append(run.getRunId())
					.append("',subject:'").append(run.getSubject()).append(
							"',createtime:'").append(
							sdf.format(run.getCreatetime())).append(
							"',proDefName:'").append(
							run.getProDefinition().getName())
					.append("',piId:'").append(run.getPiId()).append(
							"',defId:'").append(
							run.getProDefinition().getDefId()).append(
							"',runStatus:'").append(run.getRunStatus()).append(
							"'},");
		}

		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	private List<ProDefinition> getProDefinitions(String proTypeId) {
		List<ProDefinition> proDefinitions = new ArrayList<ProDefinition>();
		if (StringUtils.isNotEmpty(proTypeId)) {
			proDefinitions = proDefinitionService.getProDefinitions(Long
					.valueOf(proTypeId));
		} else {
			proDefinitions = proDefinitionService.getAll();

		}
		return proDefinitions;
	}

	/**
	 * 浏览我参与的流程
	 * 
	 * @return
	 */
	public String my() {

		QueryFilter filter = new QueryFilter(getRequest());
		String proTypeId = getRequest().getParameter("proTypeId");

		// 加上过滤条件，表示只显示当前用户的申请

		if (StringUtils.isNotEmpty(proTypeId)) {
			// 该filterName配置在app-dao.xml中
			filter.setFilterName("MyAttendProcessRun");
			filter.addParamValue(ContextUtil.getCurrentUserId());
			filter.addParamValue(Long.valueOf(proTypeId));
		} else {
			filter.setFilterName("AttendProcessRun");
			filter.addParamValue(ContextUtil.getCurrentUserId());
		}

		List<ProcessRun> processRunList = processRunService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:[");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		for (ProcessRun run : processRunList) {
			buff.append("{runId:'").append(run.getRunId())
					.append("',subject:'").append(run.getSubject()).append(
							"',proDefName:'").append(
							run.getProDefinition().getName()).append(
							"',createtime:'").append(
							sdf.format(run.getCreatetime())).append("',piId:'")
					.append(run.getPiId()).append("',defId:'").append(
							run.getProDefinition().getDefId()).append(
							"',runStatus:'").append(run.getRunStatus()).append(
							"'},");
		}

		if (processRunList.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 删除一个尚未启动的流程
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				processRunService.remove(new Long(id));
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
		ProcessRun processRun = processRunService.get(runId);

		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(processRun));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		processRunService.save(processRun);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 终止一个流程
	 * 
	 * @author F3222507
	 * @return
	 */
	public String stop() {
		String piId = getRequest().getParameter("piId");
		ProcessRun processRun = processRunService.getByPiId(piId);
		AppUser user = ContextUtil.getCurrentUser();
		Archives archives =archivesService.getArchivesByRunId(processRun.getRunId());
		//记录操作日志
		ArchivesRecycleLog recycleLog=new ArchivesRecycleLog();  
		recycleLog.setCreateDate(new Date());
		recycleLog.setPiid(piId);
		recycleLog.setArchives(archives);
		recycleLog.setLogType(ArchivesRecycleLog.TYPE_DEL);
		recycleLog.setUser(user);
		recycleLog.setProcessRun(processRun);
		recycleLogService.save(recycleLog);
		//下面是原有的删除代码
		System.out.println("--piId--" + piId);
		//jbpmService.endProcessInstance(piId);
		processRun.setPiId(null);
		processRun.setRunStatus(ProcessRun.RUN_STATUS_STOPED);
		processRunService.stopProcessRun(processRun);
		return SUCCESS;
	}
	/**
	 * 专用于故障服务申请管理中流程的驳回
	 * @author F7400275 pfs
	 * @return
	 */
	public String stopFlow(){
		String runId = getRequest().getParameter("runId");
		Long flowId=Long.valueOf(runId);
		ProcessRun run=processRunService.get(flowId);
		run.setRunStatus(ProcessRun.RUN_STATUS_STOPED);
		processRunService.save(run);
		System.out.println("-----SUCCESS");
		
		return SUCCESS;
	}
	public String getProTaskList(){
		String taskId=getRequest().getParameter("taskId");
		//存放流程审批列表
		List<JbpmTask> taskList=new ArrayList<JbpmTask>();
		try {
			taskList = processRunService.getProTasksByTaskId(Long.valueOf(taskId));
		} catch (Exception e) {
           
		}
//		ListComparator lc=new ListComparator();
//		lc.removeDuplicate(taskList);
		getRequest().setAttribute("taskList", taskList);
		return "display";
	}
	
	//会议通知获取领导批示步骤
	public String getLeaderForMeetingTaskList(){
		String piid=getRequest().getParameter("piid");
		String archiveId=getRequest().getParameter("archiveId");
		String runId=getRequest().getParameter("runId");
		Archives archives = archivesService.get(Long.parseLong(archiveId));
		AppUser user = ContextUtil.getCurrentUser();
		String schemaCode=user.getOwnerSchema();
		Map processRunVars = processFormService.getVariables(Long.parseLong(runId),schemaCode);
		//存放流程审批列表
		List<JbpmTask> taskList=new ArrayList<JbpmTask>();
		try {
			taskList = processRunService.getLeaderForMeetingTaskByPiid(piid);
		} catch (Exception e) {
           
		}
		getRequest().setAttribute("taskList", taskList);
		getRequest().setAttribute("meetingState", archives.getSources());
		getRequest().setAttribute("piid", piid);
		getRequest().setAttribute("runId", runId);
		getRequest().setAttribute("archiveId", archiveId);
		getRequest().setAttribute("smsMsg", processRunVars.get("smsMsg"));
		return "leadDisplay";
	}
	/**
	 * 获取上一步操作
	 */
	public String getPreviousStep() {
		String taskId  = getRequest().getParameter("taskId");
		StringBuffer sb = null;
		if(StringUtils.isBlank(taskId)) {
			sb = new StringBuffer("{success:false,data:'taskId is null!'}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//获取流程信息
		ProcessInstance pis=jbpmService.getProcessInstanceByTaskId(taskId);
		if (pis == null || StringUtils.isEmpty(pis.getId())) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\", \"data\":[{}]}");
			return SUCCESS;
		}
		processRun=processRunService.getByPiId(pis.getId());
		getRequest().setAttribute("processRun", processRun);
		runId=processRun.getRunId();
		
		//获取审批列表
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(100000);
		filter.addFilter("Q_processRun.runId_L_EQ",runId.toString());
		// filter.addFilter("Q_type_L_EQ","0");
		filter.addSorted("formId", "DESC");
		List<ProcessForm> pfList=processFormService.getAll(filter);
		//List<ProcessForm> pfList=processFormService.getByRunId(runId);
		if(pfList.size()<1){
			sb = new StringBuffer("{success:false,data:'no previous step!'}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//获取最后一次签核信息，会签不适用
		List<ProcessFormNextTask> processFormNextTaskList = processFormNextTaskService.getByTaskId(new Long(taskId));
		sb = new StringBuffer();
		if(processFormNextTaskList!=null&&processFormNextTaskList.size()>0){
			ProcessFormNextTask pfnt = processFormNextTaskList.get(0);
			Long formId=pfnt.getFormId();
			ProcessForm processForm=processFormService.get(formId);
			sb.append("{success:true,data:[{activityName:'");
			sb.append(processForm.getActivityName() + "',");
			sb.append("creatorId:'" + processForm.getCreatorId() + "',");
			sb.append("status:'" + processForm.getStatus() + "',");
			sb.append("isForkFlow:'true',");
			sb.append("signalName:'to" + processForm.getActivityName() + "',");
			sb.append("processRunId:'" + processForm.getProcessRun().getRunId()+"'");
			sb.append("}]}");
		}else{
//			ProcessForm processForm = pfList.get(pfList.size()-1);
//			sb.append("{success:true,data:[{activityName:'");
//			sb.append(processForm.getActivityName() + "',");
//			sb.append("creatorId:'" + processForm.getCreatorId() + "',");
//			sb.append("status:'" + processForm.getStatus() + "',");
//			sb.append("isForkFlow:'false',");
//			sb.append("signalName:'to" + processForm.getActivityName() + "',");
//			sb.append("processRunId:'" + processForm.getProcessRun().getRunId()+"'");
//			sb.append("}]}");
			JbpmTask task = processRunService.getByTaskId(Long.valueOf(taskId));
			ProcessForm lastPr = pfList.get(0); //给个默认值，最坏的情况也是退回到上一个处理的那里，不会报错
			boolean isJump = "流程编辑".equals(lastPr.getActivityName());
			if (isBack(lastPr)) {
				// 上一步是撤回或者退回的情况，继续查找
				boolean thisStep = false;
				for (ProcessForm pr : pfList) {
					if (StringUtils.equals(pr.getActivityName(), task.getName())
							&& StringUtils.equals(pr.getCreatorId() + "", task.getAssignee())
							&& !isBack(pr)) {
						// 处理步骤名称和处理人一致
						thisStep = true;
						continue;
					} else if (isJump && StringUtils.equals(pr.getActivityName(), task.getName())) {
						// 上一步是"流程编辑"，则只需要处理步骤名称一致
						thisStep = true;
						continue;
					}
					if (thisStep && !isBack(pr)) {
						lastPr = pr;
						break;
					}
					thisStep = false;
				}
			}
			sb.append("{success:true,data:[{activityName:'");
			sb.append(lastPr.getActivityName() + "',");
			sb.append("creatorId:'" + lastPr.getCreatorId() + "',");
			sb.append("status:'" + lastPr.getStatus() + "',");
			sb.append("isForkFlow:'false',");
			sb.append("signalName:'to" + lastPr.getActivityName() + "',");
			sb.append("processRunId:'" + lastPr.getProcessRun().getRunId()+"'");
			sb.append("}]}");
		}
		setJsonString(sb.toString());
		return SUCCESS;
	}

	private boolean isBack(ProcessForm processForm) {
		return ("已办理".equals(processForm.getStatus()) && "退回".equals(processForm.getComments()))
				|| "撤回".equals(processForm.getStatus()) || "退回".equals(processForm.getActivityName())
				|| "流程编辑".equals(processForm.getActivityName()) || processForm.getType() != 0;
	}
}
