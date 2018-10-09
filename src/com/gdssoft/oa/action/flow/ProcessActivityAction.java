package com.gdssoft.oa.action.flow;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.log.CustomerLog;
import com.gdssoft.oa.model.flow.*;
import com.google.common.collect.Interner;
import com.google.common.collect.Interners;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.tools.generic.DateTool;
import org.dom4j.Attribute;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.jbpm.api.ProcessDefinition;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
//import org.jbpm.pvm.internal.model.Transition;
import org.jbpm.api.model.Transition;
import org.jbpm.pvm.internal.model.ProcessDefinitionImpl;
import org.jbpm.pvm.internal.task.ParticipationImpl;
import org.jbpm.pvm.internal.task.TaskImpl;
import org.springframework.ui.velocity.VelocityEngineUtils;

import com.gdssoft.core.Constants;
import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysMessage;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.CcuserProcessService;
import com.gdssoft.oa.service.flow.FormDataService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskAgentService;
import com.gdssoft.oa.service.flow.TaskService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysMessageService;
import com.gdssoft.oa.util.IMUtil;
import com.gdssoft.oa.util.SyncUtil;
import com.google.gson.Gson;

import flexjson.JSONSerializer;

/**
 * 流程的活动及任务管理
 * 
 * @author csx
 * 
 */
public class ProcessActivityAction extends BaseAction {
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private FormDataService formDataService;
	@Resource
	private ShortMessageService shortMessageService;
	@Resource
	private VelocityEngine velocityEngine;
	@Resource
	private MailEngine mailEngine;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	VelocityEngine flowVelocityEngine;
	@Resource
	CcuserProcessService ccuserProcessService;
	@Resource
	private TaskAgentService taskAgentService;
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private SysMessageService messageService;
	@Resource
	private ArchivesService archivesService;

	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

	private String activityName;

	private Long runId;

	private Long taskId;
	
	private String ccUserIds;

	public String getCcUserIds() {
		return ccUserIds;
	}

	public void setCcUserIds(String ccUserIds) {
		this.ccUserIds = ccUserIds;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	/**
	 * 流程的定义ID
	 */
	private Long defId;

	public Long getDefId() {
		return defId;
	}

	public void setDefId(Long defId) {
		this.defId = defId;
	}
	/**
	 * 显示某个流程的任务表单信息,并生成Ext的表单的信息
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String get() throws Exception {
		ProDefinition proDefinition = getProDefinition();
		String processName = proDefinition.getName();

		// 若activityName为空，则代表为开始节点，需要通过流程定义取得其对应的名称
		if (StringUtils.isEmpty(activityName)) {
			activityName = jbpmService.getStartNodeName(proDefinition);
		}
		// 取得表单的的路径配置信息
		String tempLocation = ProcessActivityAssistant.getFormPath(processName,
				activityName);

		// 准备表单的数据
		Map model = new HashMap();
		// 已经存在的表单数据,(则用户可以先存储数据，然后下次再执行下一步的操作)
		Map<String, Object> formDataMap = null;
		if (runId != null) {
			formDataMap = formDataService.getFromDataMap(runId, activityName);
		}
		// Fields Map
		Map<String, ParamField> fieldsMap = ProcessActivityAssistant
				.constructFieldMap(processName, activityName);

		Iterator<String> fieldNames = fieldsMap.keySet().iterator();
		while (fieldNames.hasNext()) {
			String fieldName = fieldNames.next();
			if (formDataMap != null) {// 如果存在数据，则需要进行数据的
				Object fieldVal = formDataMap.get(fieldName);
				model.put(fieldName, fieldVal);
			}
			if (!model.containsKey(fieldName)) {// 若model中不存存该数据，则设置为空
				model.put(fieldName, "");
			}
		}
		// 加上以前流程中的数据,显示当前任务的所有下一步的出口
		if (taskId != null) {
			ProcessRun processRun = processRunService.getByTaskId(taskId.toString());
			//Map processRunVars = processFormService.getVariables(processRun.getRunId());
			AppUser user = ContextUtil.getCurrentUser();
			String schemaCode=user.getOwnerSchema();
			Map processRunVars = processFormService.getVariables(processRun.getRunId(),schemaCode);
			List<Transition> trans = jbpmService.getTransitionsByTaskId(taskId.toString());
			/**
			 * 因为流程分支原因导致页面出现多个确认按钮
			 */
			String xml = jbpmService.getProcessDefintionXMLByPiId(processRun.getPiId()+"");
			List<Map<String, String>> xmlList = getMapListsFromXml(xml);
			List allTrans = new ArrayList();
			for (Transition tran : trans) {
				if (tran.getDestination() != null) {
					for(Map<String, String> map:xmlList){
//						System.out.println("================开始===================");
//						System.out.println(tran.getSource().getName());
//						System.out.println(map.get("name"));
//						System.out.println(tran.getName());
//						System.out.println(map.get("transition"));
//						System.out.println("=================结束==================");
						if(tran.getSource().getName().equals(map.get("name"))&&tran.getName().equals(map.get("transition"))){
							allTrans.add(new Transform(tran));
							break;
						}
					}
				}
			}
			model.putAll(processRunVars);
			// 加上下一步的所有出口，为在VM文件中直接撰写跳转带来方便
			model.put(Constants.FLOW_NEXT_TRANS, allTrans);
		}
		model.put("activityName", activityName);
		model.put("currentUser", ContextUtil.getCurrentUser());
		model.put("currentDepId", ContextUtil.getCurrentUser().getDepartment().getDepId());
		model.put("dateTool", new DateTool());
		String formUiJs = "";
		// 兼容旧V1.2的版本模板代码的写法，如开始结点均采用"开始"的节点名称
		try {
			formUiJs = VelocityEngineUtils.mergeTemplateIntoString(
					flowVelocityEngine, tempLocation, "UTF-8", model);
		} catch (Exception ex) {
			formUiJs = VelocityEngineUtils.mergeTemplateIntoString(
					flowVelocityEngine, ProcessActivityAssistant
							.getCommonFormPath(activityName), "UTF-8", model);
		}
		if (StringUtils.isEmpty(formUiJs)) {
			formUiJs = "[]";
		}
		setJsonString(formUiJs);

		return SUCCESS;
	}
	private List<Map<String, String>> getMapListsFromXml(String xml) {
		List<Map<String, String>> list = new ArrayList<Map<String, String>>();
		try {
			Element root = DocumentHelper.parseText(xml).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				Map<String, String> map = new HashMap<String, String>();
				String type = elem.getQName().getName();
				map.put("type", type);
				for (Element elem2 : (List<Element>) elem.elements()) {
					if(elem2.getQName().getName().equals("transition")){
						for (Attribute attr: (List<Attribute>) elem2.attributes()){
                            if(attr.getName().equals("name"))map.put("transition", attr.getValue());
						}
					}
				}
				for (Attribute attr: (List<Attribute>) elem.attributes()) {
					map.put(attr.getName(), attr.getValue());
				}
				list.add(map);
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return list;
	}
	/**
	 * 显示当前任务的执行情况，决定是否给当前用户执行
	 * 
	 * @return
	 */
	public String check() {

		// 检查该任务是否已经执行完成
		Task task = jbpmService.getTaskById(String.valueOf(taskId));
		// 该任务存在
		if (task != null) {
			String assignId = task.getAssignee();
			Long curUserId = ContextUtil.getCurrentUserId();

			// 该任务目前是由该用户来执行
			if (curUserId.toString().equals(assignId)) {
				jsonString = "{success:true,isValid:true,msg:''}";
			} else if (StringUtils.isNotEmpty(assignId)) {// 已经被其他人员申请执行
				jsonString = "{success:true,isValid:false,msg:'该任务已经被其他成员锁定执行！'}";
			} else {// 锁定该任务
				jbpmService.assignTask(task.getId(), curUserId.toString());
				jsonString = "{success:true,isValid:true,msg:'该任务已经被您锁定执行!'}";
			}
		} else {// 该任务已经完成或删除
			jsonString = "{success:true,isValid:false,msg:'该任务已经完成了'}";
		}

		return SUCCESS;
	}

	private void sendMsg() {
		String recUserId = getRequest().getParameter("recUserId");
		String msgContent = getRequest().getParameter("msgContent");

		if (logger.isDebugEnabled()) {
			logger.debug("recUserId:" + recUserId + " content:" + msgContent);
		}

		if (StringUtils.isNotEmpty(recUserId)) {
			Long curUserId = ContextUtil.getCurrentUserId();
			shortMessageService.save(curUserId, recUserId, msgContent,
					ShortMessage.MSG_TYPE_TASK);
		}
	}

	/**
	 * 保存申请或保存同时启动流程
	 */
	public String save() {
		Long CCRunId = new Long(-1);
		FlowRunInfo flowRunInfo = getFlowRunInfo();
		String success = "{success:true";
		if (runId != null) {
			ProcessRun processRun = processRunService.get(runId);
			
			ProcessForm processForm = processFormService.getByRunIdActivityName(runId, activityName);
			if (processForm != null) {
				processRunService.saveProcessRun(processRun, processForm, flowRunInfo);
			}
			success = success + ",\"runId\":\"" + processRun.getRunId() + "\"";
			CCRunId = processRun.getRunId();
		} else {
			if (defId != null) {// 添加流程申请				
				ProcessRun processRun = initNewProcessRun();
				ProcessForm processForm = initNewProcessForm(processRun);
				ProcessFormReq processFormReq = getProcessFormReq();
				processForm.setStatus(processFormReq.getStatus());
				processForm.setComments(processFormReq.getComments());
				processRunService.saveProcessRun(processRun, processForm, flowRunInfo);
				System.out.println("processRun.getPiId:"+processRun.getPiId()); 
				//processRun=processRunService.getByPiId(pi)
				System.out.println("processRun.subject:"+processRun.getSubject());
				if (processRun.getPiId() != null) {
					ProcessInstance pi = jbpmService.getProcessInstance(processRun.getPiId());
					//睡眠防止短信和邮件标题未更新
					System.out.println("beforeSleep:"+new Date());
					try {
							   Thread.sleep(5000);			
						} catch (InterruptedException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
						}
					System.out.println("afterSleep:"+new Date());

					String content2=getRequest().getParameter("noticeText2");
					String leaderIds = getRequest().getParameter("outMeeting_leaders");
					if (content2!=null&&!"".equals(content2)&&leaderIds != null && !"".equals(leaderIds)) {
						//pushToLeaderSchedule(outMeeting,leaderIds);//
						//String content2 = "委领导"+outMeeting.getAttendLeaders()+",将于"+holdDt+"，参加由"+outMeeting.getHoldDep()+"召开的"+outMeeting.getName()+"，请知悉。委办公室。";
						SysConfig sc = sysConfigService.findDataValueByTkCkey("smsServiceConfig", "ZhuRenRoleId");
						String roleId = sc.getDataValue();
						List<AppUser> list = appUserService.findByRoleId(new Long(roleId));
						String uids = "";
						for (AppUser appUser2 : list) {
							uids += appUser2.getUserId()+",";
						}
						if(StringUtils.isNotEmpty(uids)){
							System.out.println("content2:"+content2);
							smsMobileService.saveSms(uids, content2);
						}
					}
					
					// 通知相关的处理人员
					notice(pi, processRun.getUserId().toString(), processRun.getPiId());
					success = success + ",\"runId\":\"" + processRun.getRunId() + "\"";
					CCRunId = processRun.getRunId();
				}
			}

		}
		//抄送人员
		if(ccUserIds != null && ccUserIds.trim().length()!=0){
			String[] ccUserId = ccUserIds.split(",");
			for(int i=0;i<ccUserId.length;i++){
				CcuserProcess ccuserProcess = new CcuserProcess();
				ccuserProcess.setCcUserId(Long.parseLong(ccUserId[i]));
				ccuserProcess.setProcessRunId(CCRunId);
				AppUser appUser = ContextUtil.getCurrentUser();
				ccuserProcess.setCreateUserId(appUser.getUserId());
				ccuserProcessService.save(ccuserProcess);
			}
		}
		
		success = success + "}";
		setJsonString(success);
		return SUCCESS;
	}

	/**
	 * 初始化一个新的流程
	 * 
	 * @return
	 */
	protected ProcessRun initNewProcessRun() {
		String archivesSubject=getRequest().getParameter("archivesSubject");
		String archivesId=getRequest().getParameter("archivesId");
		System.out.println("archivesSubject:"+archivesSubject);
		ProDefinition proDefinition = proDefinitionService.get(defId);
		ProcessRun processRun = processRunService.initNewProcessRun(proDefinition,archivesSubject);
		if (StringUtils.isNotBlank(archivesId)) {
			processRun.setArchivesId(Long.valueOf(archivesId));
		}
		return processRun;
	}

	protected ProcessForm initNewProcessForm(ProcessRun processRun) {
		ProcessForm processForm = new ProcessForm();
		processForm.setActivityName(activityName);
		processForm.setProcessRun(processRun);

		return processForm;
	}

	/**
	 * 下一步
	 * 
	 * @return
	 */
	public String next() {
		JbpmTask jbpmTask = getTaskByTaskId(taskId);
        String instanceId = null;
        if (jbpmTask != null) {
			instanceId = jbpmTask.getInstance();
		}
        synchronized (SyncUtil.pool.intern(SyncUtil.SYNC_NEXT_PROCESS_FLAG + instanceId)) {
			CustomerLog.customerLog(SyncUtil.customerLog, "开始处理流程------->" + taskId);
			// 完成当前任务
			ProcessRun processRun = processRunService.getByTaskId(taskId.toString());
			FlowRunInfo flowRunInfo = getFlowRunInfo();
			ProcessFormReq processFormReq = getProcessFormReq();
			String userId = flowRunInfo.getUserId();
			String piId = flowRunInfo.getPiId();
			ProcessInstance pi = processRunService.saveAndNextStep(flowRunInfo, processFormReq);
			Map variables = flowRunInfo.getVariables();
			String isForkFlow = (String) variables.get("isForkFlow");
			if ("true".equals(isForkFlow)) {//并发流程发送短信
				noticeForkFlow(variables, processRun);
			} else if (null == pi) {
				notice(processRun);
			} else {
				// 通知相关的处理人员
				notice(pi, userId, piId);
			}
			//抄送人员
			if (ccUserIds != null && ccUserIds.trim().length() != 0) {
				String[] ccUserId = ccUserIds.split(",");
				//删除所有
				ccuserProcessService.delete(processRun.getRunId());
				//新增人员
				for (int i = 0; i < ccUserId.length; i++) {
					CcuserProcess ccuserProcess = new CcuserProcess();
					ccuserProcess.setCcUserId(Long.parseLong(ccUserId[i]));
					ccuserProcess.setProcessRunId(processRun.getRunId());
					AppUser appUser = ContextUtil.getCurrentUser();
					ccuserProcess.setCreateUserId(appUser.getUserId());
					ccuserProcessService.save(ccuserProcess);
				}
			}
			taskAgentService.delTaskGrants(Long.valueOf(taskId));
			setJsonString("{\"success\":\"true\"}");
			CustomerLog.customerLog(SyncUtil.customerLog, "结束处理流程------->" + taskId);
		}
		return SUCCESS;
	}

    

	public String getProcessNum() {
        int num = 0;
		String currentUserId = String.valueOf(ContextUtil.getCurrentUser().getUserId());
        HttpServletRequest request = getRequest();
        if (StringUtils.isNotEmpty(request.getParameter("taskId"))) {
            try {
                Long taskId = Long.valueOf(request.getParameter("taskId"));
				JbpmTask jbpmTask = getTaskByTaskId(taskId);
				String instanceId = null;
				if (jbpmTask != null) {
					instanceId = jbpmTask.getInstance();
				}
                num = CurrentTaskHelper.getProcessNum(instanceId, currentUserId);
            } catch (Exception e) {

            }
        }
        setJsonString("{\"success\":\"true\", \"num\":" + num + "}");
        return SUCCESS;
    }

    /**
     * 根据taskId获得流程实例id
     *
     * @return
     */
	private JbpmTask getTaskByTaskId(Long taskId) {
        return processRunService.getByTaskId(taskId);
    }

	private void notice(ProcessInstance pi, String userId, String piId) {
		// 取得这些任务的下一步的相关参与人员，并且根据页面提交的设置决定是否发送短信及邮件
		AppUser currentUser=ContextUtil.getCurrentUser();
		if (pi != null) {
			List<Task> taskList = jbpmService.getTasksByPiId(pi.getId());
			
			for (Task task : taskList) {
				TaskImpl taskImpl = (TaskImpl) task;
				//会签发送短信
				if(taskImpl.getSuperTask()==null && taskImpl.getSubTasks().size()!=0){
					logger.info("begin 发送会签短信");
					logger.info("发送会签短信个数："+taskImpl.getSubTasks().size());
					for(Task taskTemp:taskImpl.getSubTasks()){
						AppUser appUser = appUserService.get(Long.valueOf(taskTemp.getAssignee()));
						System.out.println(appUser.getFullname());
						if(!currentUser.getUserId().equals(appUser.getUserId())){//提醒非自己的办理人
							sendMailNotice(taskImpl, appUser);
						}
					}
					
				}
				if (taskImpl.getAssignee() == null) {
					Iterator<ParticipationImpl> partIt = taskImpl
							.getAllParticipants().iterator();
					while (partIt.hasNext()) {
						ParticipationImpl part = partIt.next();
						if (part.getGroupId() != null
								&& StringUtil.isNum(part.getGroupId())) {
							// 发送邮件
							List<AppUser> appUserList = appUserService
									.findByRoleId(new Long(part.getGroupId()));
							for (AppUser user : appUserList) {
								if(!currentUser.getUserId().equals(user.getUserId())){//提醒非自己的办理人
									sendMailNotice(taskImpl, user);
								}
							}
						} else if (part.getUserId() != null
								&& StringUtil.isNum(part.getUserId())) {
							AppUser appUser = appUserService.get(new Long(part
									.getUserId()));
							if(!currentUser.getUserId().equals(appUser.getUserId())){//提醒非自己的办理人
								sendMailNotice(taskImpl, appUser);
							}
						}
					}
					
				} else if (StringUtil.isNum(taskImpl.getAssignee())) {
					//有签核人的
					System.out.println("有签核人的"+taskImpl.getAssignee());
					AppUser appUser = appUserService.get(new Long(taskImpl
							.getAssignee()));
					if(!currentUser.getUserId().equals(appUser.getUserId())){//提醒非自己的办理人
						sendMailNotice(taskImpl, appUser);
					}
				}
			}
		} else {
			if (StringUtils.isNotEmpty(userId) && StringUtils.isNotEmpty(piId)) {
				AppUser appUser = appUserService.get(Long.valueOf(userId));
				ProDefinition proDefinition = proDefinitionService.get(Long
						.valueOf(piId));
				sendNotice(proDefinition, appUser);
			}
		}
	}
	/**
	 * 借宿流程时发送短信
	 * @author F3222507
	 * @param processRun
	 */
	private void notice(ProcessRun processRun) {
		logger.info("begin 流程结束发送短信");
		System.out.println("notice:ProcessRun");
		//睡眠防止短信和邮件标题未更新
//		try {
//			Thread.sleep(5000);
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		// 去掉收文办结是提醒办理人发给登记人的短信
		Archives archives = archivesService.getArchivesByRunId(processRun.getRunId());
		if (archives != null && archives.getArchType() == 1)
			return;
		
		// 取得这些任务的下一步的相关参与人员，并且根据页面提交的设置决定是否发送短信及邮件
		AppUser appUser = appUserService.get(processRun.getUserId());
		ProDefinition proDefinition = processRun.getProDefinition();
		sendNotice(proDefinition, appUser);
		
		
	}
	
	

	/**
	 * 发送邮件及短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendMailNotice(Task task, AppUser appUser) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");
		String sendInfo = getRequest().getParameter("sendInfo");
		
		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
		String executionId = task.getExecutionId();
		if(executionId.contains("MeetingRecord") && executionId.indexOf("to")>0){
			executionId = executionId.substring(0,executionId.indexOf("to")-1);
		}
		if(executionId.split("[.]").length > 2){
			String[] executionIds=executionId.split("[.]");
			executionId=executionIds[0]+"."+executionIds[1];
		}
		ProcessRun processRun=processRunService.getByPiId(executionId);
		
		if ("true".equals(sendMail)) {	// 发送邮件
			if (appUser.getEmail() != null) {
				String tempPath = "mail/flowMail.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("appUser", appUser);
				model.put("task", task);
				String subject = "ＯＡ待办提醒:"+processRun.getSubject();
				model.put("subject", processRun.getSubject());
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);
				
			}
		}
		if ("true".equals(sendMsg)) { // 发送手机短信
			if (appUser.getMobile() != null) {
				String content = getRequest().getParameter("noticeText");
				if(content==null || "".equals(content.trim())){
					content = "待办提醒:ＯＡ系统于"+curDateStr+"给您发送了一条待办事项："+"\""+processRun.getSubject()+"\""+"，请您尽快处理。--系统自动发送";
				}
				System.out.println("content:"+content);
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),content);
			}
		}

		if ("true".equals(sendInfo)) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "ＯＡ待办提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo", "ＯＡ系统产生了一条您的待办事项：\""+processRun.getSubject()+"\"，请您尽快处理。");
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
		}
		List<Map<String, String>>list=appUserService.getChannelId(ContextUtil.getCurrentUser().getOwnerSchema() ,appUser.getUserId());
		if (list.size()>0) {//推送
			Archives archives=archivesService.getArchivesByRunId(processRun.getRunId());
			if(archives!=null){
				if(appUser.getDisturb()==0){
					Map<String, String> model =list.get(0);
					model.put("token", model.get("CHANNELID"));
					model.put("title", "ＯＡ待办提醒:");
					model.put("txt","ＯＡ系统产生了一条您的待办事项：\""+processRun.getSubject()+"\"，请您尽快处理。");
					model.put("type",model.get("DEVICETYPE"));
					model.put("taskId",task.getId());
					model.put("archType",archives.getArchType()+"");
					model.put("runId", processRun.getRunId()+"");
					try {
						IMUtil.sendPush(model);
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
				}
				SysMessage message=new SysMessage();
				message.setCreate_date(new Date());
				message.setOriginal_id(archives.getArchivesId());
				message.setOriginal_type(archives.getArchType());
				message.setRead_flag(0);
				message.setRunId(processRun.getRunId());
				message.setSubject(archives.getSubject());
				message.setTaskId(new Long(task.getId()));
				message.setTo_user(appUser.getUserId());
				messageService.save(message);
			}
		}
	}
	
	//会议通知发送短信
	public void sendMsgForMeeting() {
		String userIds = getRequest().getParameter("userIds");
		String archivesId = getRequest().getParameter("archivesId");
		String content = getRequest().getParameter("content");
		Archives archives = archivesService.get(Long.parseLong(archivesId));
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		AppUser appUser=new AppUser();
		String[] users=userIds.split(",");
		for(String id:users){
			if(StringUtil.isNum(id)){
				appUser=appUserService.get(new Long(String.valueOf(id)));
				if (appUser.getMobile() != null) {
					if(content==null || "".equals(content.trim())){
						content = "会议通知:您已确认参加由"+archives.getIssueDep()+"召集的"+"\""+archives.getSubject()+"\""+"会议，请您于" + dateFormat.format(archives.getLimitedDate()) + "准时参加。--系统自动发送";
					}else{
						content += "--系统自动发送";
					}
					System.out.println("content:"+content);
					smsMobileService.saveSms(String.valueOf(appUser.getUserId()),content);
				}
			}
		}
	}
	
	/**
	 * 根据会签人列表循环发送邮件和短信
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendMailNoticeForHuiQian(Task task, String[] signUserIdArray) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");

		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
		ProcessRun processRun=processRunService.getByPiId(task.getExecutionId());
		for (int i = 0; i < signUserIdArray.length; i++) {
			AppUser appUser = appUserService.get(new Long(signUserIdArray[i]));
			if ("true".equals(sendMail)) {
				
				// 发送邮件
				if (appUser.getEmail() != null) {
					if (logger.isDebugEnabled()) {
						logger.info("Notice " + appUser.getFullname() + " by mail:"
								+ appUser.getEmail());
					}

					String tempPath = "mail/flowMail.vm";
					Map model = new HashMap();
					model.put("curDateStr", curDateStr);
					model.put("appUser", appUser);
					model.put("task", task);
					/*String subject = "来自" + AppUtil.getCompanyName() + "办公系统的待办任务("
							+ task.getName() + ")提醒";*/
					String subject = "ＯＡ待办提醒:"+processRun.getSubject();
					model.put("subject", processRun.getSubject());
					mailEngine.sendTemplateMail(tempPath, model, subject, null,
							new String[] { appUser.getEmail() }, null, null, null,
							null, true);
					System.out.println("appUser.getEmail():"+appUser.getEmail());

				}
			}
			if ("true".equals(sendMsg)) {
				// 发送手机短信
				if (appUser.getMobile() != null) {
					if (logger.isDebugEnabled()) {
						logger.info("Notice " + appUser.getFullname()
								+ " by mobile:" + appUser.getMobile());
					}

					/*String content = AppUtil.getCompanyName() + "办公系统于"
							+ curDateStr + "产生了一项待办事项(" + task.getName()
							+ ")，请您在规定时间内完成审批~";*/
					
					String content = "待办提醒:ＯＡ系统于"+curDateStr+"给您发送了一条待办事项："+"\""+processRun.getSubject()+"\""+"，请您尽快处理。--系统自动发送";
					/*
					 * MobileMsg mobileMsg=new MobileMsg();
					 * mobileMsg.setContent(content);
					 * mobileMsg.setMobileNo(appUser.getMobile());
					 * mobileMsg.setCreatetime(curDate);
					 * mobileMsg.setStatus(MobileMsg.STATUS_INIT);
					 * mobileMsgService.save(mobileMsg);
					 */
					smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
							content);
				}
			}
		}
		
	}

	/**
	 * 
	 * 流程最后一步发送邮件和短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendNotice(ProDefinition proDefinition, AppUser appUser) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");		
		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
		String content = AppUtil.getCompanyName() + "办公管理系统于"
				+ curDateStr + "审核完成您发起的" + proDefinition.getName();
		System.out.println("---content---"+content);
		
		if ("true".equals(sendMail)) {
			// 发送邮件
			if (appUser.getEmail() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname() + " by mail:"
							+ appUser.getEmail());
				}

				String tempPath = "mail/mailNotice.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("defName", proDefinition.getName());
				String subject = "来自" + AppUtil.getCompanyName() + "办公系统的待办任务("
						+ proDefinition.getName() + ")提醒";
				System.out.println("---subject---"+subject);
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);

			}
		}
		if ("true".equals(sendMsg)) {
			// 发送手机短信
			if (appUser.getMobile() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname()
							+ " by mobile:" + appUser.getMobile());
				}

				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
						content);
			}
		}
		
		if ("true".equals(getRequest().getParameter("sendInfo"))) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "ＯＡ提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo", content);
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
		}
		
	}

	/**
	 * 显示某一节点下的分支节点情况
	 * 
	 * @return
	 */
	public String outerTrans() {
		ProcessDefinition pd = jbpmService.getProcessDefinitionByTaskId(taskId
				.toString());
		String nodeName = getRequest().getParameter("nodeName");
		List<Transition> trans = jbpmService.getNodeOuterTrans(pd, nodeName);

		Gson gson = new Gson();
		StringBuffer sb = new StringBuffer();

		sb.append("[");

		for (Transition tran : trans) {
			sb.append("[").append(gson.toJson(tran.getName())).append(",")
					.append(gson.toJson(tran.getDestination().getName()))
					.append(",").append(
							gson.toJson(tran.getDestination().getType()))
					.append("],");
		}

		if (trans.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}

		sb.append("]");

		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 自由跳转
	 * 
	 * @return
	 */
	public String freeTrans() {

		Gson gson = new Gson();
		StringBuffer sb = new StringBuffer();

		sb.append("[");

		List<Transition> trans = jbpmService.getFreeTransitionsByTaskId(taskId
				.toString());

		for (Transition tran : trans) {
			// 跳转至join节点报错，先干掉
			if ("join".equals(tran.getDestination().getType()))
				continue;
			// 石柱收文的办理和审核是在foreach节点里面，不能跳转进去
			if ("办理".equals(tran.getDestination().getName())
					|| "审核".equals(tran.getDestination().getName())) {
				continue;
			}
			
			sb.append("[").append(gson.toJson(tran.getName())).append(",")
					.append(gson.toJson(tran.getDestination().getName()))
					.append(",").append(
							gson.toJson(tran.getDestination().getType()))
					.append("],");
		}

		if (trans.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}

		sb.append("]");

		setJsonString(sb.toString());

		return SUCCESS;
	}
	/**
	 * 流程编辑跳转列表查询（新）
	 * auor ganzhy
	 * @return
	 */
	public String freeTransNew() {

		Gson gson = new Gson();
		StringBuffer sb = new StringBuffer();

		sb.append("[");

		List<Transition> trans = jbpmService.getFreeTransitionsByTaskId(taskId
				.toString());
		String isForkFlow="false";
		for (Transition tran : trans) {
			// 跳转至join节点报错，先干掉
			if ("join".equals(tran.getDestination().getType())){
				isForkFlow="true";
				break;
			}
		}
		for (Transition tran : trans) {
			// 跳转至join节点报错，先干掉
			String type=tran.getDestination().getType();
			if ("true".equals(isForkFlow)&&!"task".equals(type))
				continue;
			if ("true".equals(isForkFlow)&&tran.getName().indexOf("领导批示")!=-1)
				continue;
			sb.append("[").append(gson.toJson(tran.getName())).append(",")
					.append(gson.toJson(tran.getDestination().getName()))
					.append(",").append(gson.toJson(tran.getDestination().getType()))
					.append(",").append(gson.toJson(isForkFlow))
					.append("],");
		}

		if (trans.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}

		sb.append("]");

		setJsonString(sb.toString());

		return SUCCESS;
	}
	/**
	 * 取得当前任务所有出口
	 * 
	 * @return
	 */
	public String trans() {
		// 取得该任务对应的所有
		List allTrans = new ArrayList();

		List<Transition> trans = jbpmService.getTransitionsByTaskId(taskId
				.toString());
		// List<Transition>trans=jbpmService.getFreeTransitionsByTaskId(taskId.toString());

		for (Transition tran : trans) {
			if (tran.getDestination() != null) {
				allTrans.add(new Transform(tran));
			}
		}

		JSONSerializer serializer = JsonUtil.getJSONSerializer();
		String result = serializer.serialize(allTrans);

		setJsonString("{success:true,data:" + result + "}");
		return SUCCESS;
	}

	/**
	 * 构建提交的流程或任务对应的表单信息字段
	 * 
	 * @return
	 */
	protected Map<String, ParamField> constructFieldMap() {
		HttpServletRequest request = getRequest();
		ProDefinition proDefinition = getProDefinition();
		// 取得开始节点的任务名称
		if (StringUtils.isEmpty(activityName)) {
			activityName = jbpmService.getStartNodeName(proDefinition);
		}
		// 取得开始任务节点
		Map<String, ParamField> map = ProcessActivityAssistant
				.constructFieldMap(proDefinition.getName(), activityName);

		Iterator<String> fieldNames = map.keySet().iterator();
		while (fieldNames.hasNext()) {
			String name = fieldNames.next();
			ParamField pf = map.get(name);
			// 防止在Vm中通过.取不到值的问题，替换为_，如在提交表单时，
			// 名称为arch.docName，在VM中取值将会变成arch_docName
			pf.setName(pf.getName().replace(".", "_"));
			pf.setValue(request.getParameter(name));
		}
		return map;
	}

	/**
	 * 取得流程定义
	 * 
	 * @return
	 */
	protected ProDefinition getProDefinition() {
		ProDefinition proDefinition = null;
		if (runId != null) {
			ProcessRun processRun = processRunService.get(runId);
			proDefinition = processRun.getProDefinition();
		} else if (defId != null) {
			proDefinition = proDefinitionService.get(defId);
		} else {// if(piId!=null){
			ProcessRun processRun = processRunService.getByTaskId(taskId
					.toString());
			proDefinition = processRun.getProDefinition();
		}
		return proDefinition;
	}

	/**
	 * 取得流程运行的相关信息
	 */
	protected FlowRunInfo getFlowRunInfo() {
		FlowRunInfo info = new FlowRunInfo(getRequest());
		Map<String, ParamField> fieldMap = constructFieldMap();
		info.setParamFields(fieldMap);
		return info;
	}
	
	/**
	 * 取得流程运行的相关信息
	 */
	protected ProcessFormReq getProcessFormReq() {
		ProcessFormReq info = new ProcessFormReq(getRequest());

		return info;
	}
	/**
	 * 
	 * 流程最后一步发送邮件和短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	/**
	 * 发送邮件及短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	public  String sendMailNoticecar (){
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");
		String sendInfo = getRequest().getParameter("sendInfo");
		String content = getRequest().getParameter("content");
		String  userid=getRequest().getParameter("userId");
		AppUser appUser= appUserService.get(new Long(userid));
		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
 		if ("true".equals(sendMail)) {	// 发送邮件
			if (appUser.getEmail() != null) {
				String tempPath = "mail/flowMail.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("appUser", appUser);
				String subject = content;
				model.put("subject", content);
				System.out.println("content:"+content);
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);
			}
		}
		if ("true".equals(sendMsg)) { // 发送手机短信
			if (appUser.getMobile() != null) {
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),content);
				System.out.println("content:"+content);
			}
		}

		if ("true".equals(sendInfo)) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "ＯＡ待办提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo", content);
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
			System.out.println("content:"+content);
		}
		return SUCCESS;
	}
	/**
	 * 下一步
	 * 
	 * @return
	 */
	public String backSign() {
		ProcessRun processRun = processRunService.getByTaskId(taskId.toString());	
		FlowRunInfo flowRunInfo = getFlowRunInfo();
		ProcessFormReq processFormReq = getProcessFormReq();
		String userId = flowRunInfo.getUserId();
		ProcessInstance pi = processRunService.saveAndNextStep(flowRunInfo,processFormReq);
		String piid=pi.getId();
		taskAgentService.delTaskGrants(Long.valueOf(taskId));
		List<Task> taskList = jbpmService.getTasksByPiId(piid);
		for (Task task : taskList) {
			TaskImpl taskImpl = (TaskImpl) task;
			if(taskImpl.getSuperTask()==null && taskImpl.getSubTasks().size()!=0){
				for(Task taskTemp:taskImpl.getSubTasks()){
					flowRunInfo.setTaskId(taskTemp.getId());
					ProcessInstance pis = processRunService.saveAndNextStep(flowRunInfo,processFormReq);
					if( null == pis){
						notice(processRun);
					}else{
						//notice(pis, userId, piId);
					}
					taskAgentService.delTaskGrants(new Long(taskTemp.getId()));
				}
			}
		}
		setJsonString("{\"success\":\"true\"}");
		return SUCCESS;
	}
	/**
	 * 流程定义的任务节点
	 * 
	 * @return
	 */
	public String flowDefTasks() {
		ProcessRun processRun=processRunService.get(runId);
		Gson gson = new Gson();
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		List<Node> nodes = jbpmService.getTaskNodesByDefId(processRun.getProDefinition().getDefId());
		for (Node node : nodes) {
			sb.append("[").append(gson.toJson(node.getName())) .append("],");
		}
		if (nodes.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	public String initJbpmDbid() {
		StringBuffer sb = new StringBuffer();
		processRunService.initJbpmDbid();
		sb.append("{success: true}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	private void sendNoticeForForkFlow(ProcessRun processRun, AppUser appUser) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");
		String sendInfo = getRequest().getParameter("sendInfo");
		
		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
		if ("true".equals(sendMail)) {	// 发送邮件
			if (appUser.getEmail() != null) {
				String tempPath = "mail/flowMail.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("appUser", appUser);
				String subject = "ＯＡ待办提醒:"+processRun.getSubject();
				model.put("subject", processRun.getSubject());
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);
			}
		}
		if ("true".equals(sendMsg)) { // 发送手机短信
			if (appUser.getMobile() != null) {
				String content = getRequest().getParameter("noticeText");
				if(content==null || "".equals(content.trim())){
					content = "待办提醒:ＯＡ系统于"+curDateStr+"给您发送了一条待办事项："+"\""+processRun.getSubject()+"\""+"，请您尽快处理。--系统自动发送";
				}
				System.out.println("content:"+content);
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),content);
			}
		}
		if ("true".equals(sendInfo)) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "ＯＡ待办提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo", "ＯＡ系统产生了一条您的待办事项：\""+processRun.getSubject()+"\"，请您尽快处理。");
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
		}
	}
	public void noticeForkFlow(Map variables,ProcessRun processRun){
		String userIds=com.gdssoft.oa.util.StringUtil.nullObject2String(variables.get(Constants.FLOW_ASSIGN_ID));
		Iterator<String> iter = variables.keySet().iterator();
	    while(iter.hasNext()){
	        String key=iter.next();
	        String value = String.valueOf(variables.get(key));
	        if(key.lastIndexOf("UserIds")==key.length()-7&&value!=null&&!"".equals(value)){
	        	userIds+=value+",";
	        }
	    }
		AppUser appUser=new AppUser();
		String[] users=userIds.split(",");
		for(String id:users){
			if(StringUtil.isNum(id)){
				appUser=appUserService.get(new Long(String.valueOf(id)));
				sendNoticeForForkFlow(processRun,appUser);
			}
		}
		List<Task> taskList = jbpmService.getTasksByPiId(processRun.getPiId());
		for(Task task : taskList){
			if(StringUtils.isNotEmpty(task.getAssignee()) && userIds.indexOf(task.getAssignee()) > -1){
				List<Map<String, String>>list=appUserService.getChannelId(ContextUtil.getCurrentUser().getOwnerSchema() ,Long.parseLong(task.getAssignee()));
				if (list.size()>0) {//推送
					Archives archives=archivesService.getArchivesByRunId(processRun.getRunId());
					if(archives != null){
						if(appUser.getDisturb()==0){
							Map<String, String> model =list.get(0);
							model.put("token", model.get("CHANNELID"));
							model.put("title", "ＯＡ待办提醒:");
							model.put("txt","ＯＡ系统产生了一条您的待办事项：\""+processRun.getSubject()+"\"，请您尽快处理。");
							model.put("type",model.get("DEVICETYPE"));
							model.put("taskId",task.getId());
							model.put("archType",archives.getArchType()+"");
							model.put("runId", processRun.getRunId()+"");
							try {
								IMUtil.sendPush(model);
							} catch (UnsupportedEncodingException e) {
								e.printStackTrace();
							}
						}
						SysMessage message=new SysMessage();
						message.setCreate_date(new Date());
						message.setOriginal_id(archives.getArchivesId());
						message.setOriginal_type(archives.getArchType());
						message.setRead_flag(0);
						message.setRunId(processRun.getRunId());
						message.setSubject(archives.getSubject());
						message.setTaskId(new Long(task.getId()));
						message.setTo_user(appUser.getUserId());
						messageService.save(message);
					}
				}
			}
		}
	}

	public String queryTask() {
        StringBuffer sb = new StringBuffer();
	    try {
            HttpServletRequest request = getRequest();
            if (StringUtils.isEmpty(request.getParameter("taskId"))) {
                sb.append("{\"success\":\"false\", \"code\":\"0\", \"message\":\"任务id不能为空\"}");
                setJsonString(sb.toString());
                return SUCCESS;
            }
            Long task = Long.valueOf(request.getParameter("taskId"));
            JbpmTask jbpmTask = processRunService.getByTaskId(task);
            if (jbpmTask == null) {
                sb.append("{\"success\":\"false\", \"code\":\"-1\", \"message\":\"当前任务已被处理\"}");
                setJsonString(sb.toString());
                return SUCCESS;
            }
            JSONSerializer serializer = JsonUtil.getJSONSerializer();
            String result = serializer.serialize(jbpmTask);
            sb.append("{\"success\":\"true\", \"data\":" + result + "}");
            setJsonString(sb.toString());
        } catch (Exception e) {
            sb.append("{\"success\":\"false\", \"code\":\"0\", \"message\":\"操作出错\"}");
        }
		return SUCCESS;
	}
	
	public String getWaitingUser(){
		String taskId=getRequest().getParameter("taskId");//流程ID
		String userId=getRequest().getParameter("userIds");//用户ID，一个或者多个
		String waitUser="";
		if (StringUtils.isEmpty(taskId)||StringUtils.isEmpty(userId)) {
			return waitUser;
		}
		List<JbpmTask> tasks = null;
		try {
			tasks = processRunService.getProTasksByTaskId(Long.valueOf(taskId));
		} catch (Exception e) {

		}
		if (tasks == null || tasks.size() <= 0) {
			return waitUser;
		}
		for (JbpmTask task : tasks) {
			if (task != null && StringUtils.isNotEmpty(userId) && userId.indexOf(task.getAssignee()) >= 0
					&& !StringUtils.equals(String.valueOf(ContextUtil.getCurrentUser().getUserId()), task.getAssignee())) {
				waitUser += task.getAssigneeName() + "、";
			}
		}
		if (StringUtils.isNotEmpty(waitUser)) {
			waitUser = waitUser.substring(0, waitUser.length() - 1);
		}
		return waitUser;
	}//nibanUserIds
	public String getWaitingDept(){
		String taskId=getRequest().getParameter("taskId");//流程ID
		String deptId=getRequest().getParameter("deptIds");//用户ID，一个或者多个
		String waitDept="";
		if (StringUtils.isEmpty(taskId)||StringUtils.isEmpty(deptId)) {
			return waitDept;
		}
		List<JbpmTask> tasks = null;
		try {
			tasks = processRunService.getProTasksByTaskId(Long.valueOf(taskId));
		} catch (Exception e) {

		}
		if (tasks == null || tasks.size() <= 0) {
			return waitDept;
		}
		List<Department> deptList=processRunService.getDeptByUserIds(deptId);
		if (deptList == null || deptList.size() <= 0) {
			return waitDept;
		}
		for (JbpmTask task : tasks) {
			for(Department dept : deptList){
				if(task.getDepid().equals(dept.getDepId())&&waitDept.indexOf(dept.getDepName())==-1){
					waitDept += dept.getDepName() + "、";
				}
			}
		}
		if (StringUtils.isNotEmpty(waitDept)) {
			waitDept = waitDept.substring(0, waitDept.length() - 1);
		}
		return waitDept;
	}
	/**
     * 下一步 （同步办件）
     *
     * @return
     */
    public String nextForSync() {
		String status = getRequest().getParameter("status");
		String currentUserId = String.valueOf(ContextUtil.getCurrentUser().getUserId());
		JbpmTask jbpmTask = getTaskByTaskId(taskId);
		if (jbpmTask == null) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		if ((!StringUtils.equals(jbpmTask.getAssignee(), currentUserId) )
				&& (!StringUtils.equals("撤回", status))
				&& (!StringUtils.equals("流程编辑", status))) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件当前处理人已经变更，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		String instanceId = jbpmTask.getInstance();
        if  (StringUtils.isNotEmpty(CurrentTaskHelper.get(taskId.toString()))) {
            setJsonString("{\"success\":\"false\", \"code\":\"2\", \"message\":\"该文件正在处理，请稍后\"}");
            return SUCCESS;
        }
        CurrentTaskHelper.put(taskId.toString(), currentUserId);
        CurrentTaskHelper.addProcessNum(instanceId, currentUserId);
        // 处理会签同一流程多人同时并发处理，改成串行
        synchronized (SyncUtil.pool.intern(SyncUtil.SYNC_NEXT_PROCESS_FLAG + instanceId)) {
            CustomerLog.customerLog(SyncUtil.customerLog, "开始处理流程------->" +  instanceId + "===" + taskId);
            try {
            	String waitDept=getWaitingDept();
	           	if(StringUtils.isNotEmpty(waitDept)) {
	                 setJsonString("{\"success\":\"false\", \"code\":\"4\", \"message\":\""+waitDept+"正在处理该文件\"}");
	                 CurrentTaskHelper.remove(taskId.toString());
	                 CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
	                 return SUCCESS;
	            }
            	String waitUser=getWaitingUser();
            	if(StringUtils.isNotEmpty(waitUser)) {
                     setJsonString("{\"success\":\"false\", \"code\":\"4\", \"message\":\""+waitUser+"正在处理该文件\"}");
                     CurrentTaskHelper.remove(taskId.toString());
                     CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
                     return SUCCESS;
                }
                // 完成当前任务
                ProcessRun processRun = processRunService.getByTaskId(taskId.toString());
                if (processRun == null) {
                    setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
                    CurrentTaskHelper.remove(taskId.toString());
                    CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
                    return SUCCESS;
                }
                FlowRunInfo flowRunInfo = getFlowRunInfo();
                ProcessFormReq processFormReq = getProcessFormReq();
                String userId = flowRunInfo.getUserId();
                String piId = flowRunInfo.getPiId();
                ProcessInstance pi = processRunService.saveAndNextStep(flowRunInfo, processFormReq);
                Map variables = flowRunInfo.getVariables();
                String isForkFlow = (String) variables.get("isForkFlow");
                if ("true".equals(isForkFlow)) {//并发流程发送短信
                    noticeForkFlow(variables, processRun);
                } else if (null == pi) {
                    notice(processRun);
                } else {
                    // 通知相关的处理人员
                    notice(pi, userId, piId);
                }
                //抄送人员
                if (ccUserIds != null && ccUserIds.trim().length() != 0) {
                    String[] ccUserId = ccUserIds.split(",");
                    //删除所有
                    ccuserProcessService.delete(processRun.getRunId());
                    //新增人员
                    for (int i = 0; i < ccUserId.length; i++) {
                        CcuserProcess ccuserProcess = new CcuserProcess();
                        ccuserProcess.setCcUserId(Long.parseLong(ccUserId[i]));
                        ccuserProcess.setProcessRunId(processRun.getRunId());
                        AppUser appUser = ContextUtil.getCurrentUser();
                        ccuserProcess.setCreateUserId(appUser.getUserId());
                        ccuserProcessService.save(ccuserProcess);
                    }
                }
                taskAgentService.delTaskGrants(Long.valueOf(taskId));
				setJsonString("{\"success\":\"true\", \"code\":\"1\"}");
            } catch (Exception e) {
                CustomerLog.customerLog(SyncUtil.customerLog, e);
                setJsonString("{\"success\":\"false\", \"code\":\"0\", \"message\":\"操作出错，请联系管理员\"}");
            }
            CurrentTaskHelper.remove(taskId.toString());
            CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
            CustomerLog.customerLog(SyncUtil.customerLog, "结束处理流程------->" +  instanceId + "===" + taskId);
        }
        return SUCCESS;
    }

	/**
	 * 下一步（领导专用）
	 *
	 * @return
	 */
	public String nextForLeader() {
		String currentUserId = String.valueOf(ContextUtil.getCurrentUser().getUserId());
		String status = getRequest().getParameter("status");
		JbpmTask jbpmTask = getTaskByTaskId(taskId);
		if (jbpmTask == null) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		if ((!StringUtils.equals(jbpmTask.getAssignee(), currentUserId) )
				&& (!StringUtils.equals("撤回", status))
				&& (!StringUtils.equals("流程编辑", status))) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件当前处理人已经变更，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		String instanceId = jbpmTask.getInstance();
		if  (StringUtils.isNotEmpty(CurrentTaskHelper.get(taskId.toString()))) {
			setJsonString("{\"success\":\"false\", \"code\":\"2\", \"message\":\"该文件正在处理，请稍后\"}");
			return SUCCESS;
		}
		CurrentTaskHelper.put(taskId.toString(), currentUserId);
        CurrentTaskHelper.addProcessNum(instanceId, currentUserId);
		// 处理会签同一流程多人同时并发处理，改成串行
		synchronized (SyncUtil.pool.intern(SyncUtil.SYNC_NEXT_PROCESS_FLAG + instanceId)) {
			CustomerLog.customerLog(SyncUtil.customerLog, "开始处理流程（领导）------->" + instanceId + "===" + taskId);
			try {
				// 完成当前任务
				ProcessRun processRun = processRunService.getByTaskId(taskId.toString());
				if (processRun == null) {
					setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
					CurrentTaskHelper.remove(taskId.toString());
                    CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
					return SUCCESS;
				}
				FlowRunInfo flowRunInfo = getFlowRunInfo();
				ProcessFormReq processFormReq = getProcessFormReq();
				String userId = flowRunInfo.getUserId();
				String piId = flowRunInfo.getPiId();

				ProcessInstance pi = processRunService.saveAndNextStep(flowRunInfo,processFormReq);
				Map variables=flowRunInfo.getVariables();
				String isForkFlow = (String) variables.get("isForkFlow");
				//发送提示信息
				if("true".equals(isForkFlow)){//并发流程发送短信
					noticeForkFlow(variables,processRun);
				}else if( null == pi){
					notice(processRun);
				}else {
					// 通知相关的处理人员
					notice(pi, userId, piId);
				}
				taskAgentService.delTaskGrants(Long.valueOf(taskId));
				setJsonString("{\"success\":\"true\", \"code\":\"1\"}");
			} catch (Exception e) {
				CustomerLog.customerLog(SyncUtil.customerLog, e);
				setJsonString("{\"success\":\"false\", \"code\":\"0\", \"message\":\"操作出错，请联系管理员\"}");
			}
			CurrentTaskHelper.remove(taskId.toString());
            CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
			CustomerLog.customerLog(SyncUtil.customerLog, "结束处理流程（领导）------->" + instanceId + "===" + taskId);
		}
		return SUCCESS;
	}
	
	/**
	 * 下一步（领导代处理专用）会议通知
	 *
	 * @return
	 */
	public String nextForLeaderByMeeting() {
		String currentUserId = String.valueOf(ContextUtil.getCurrentUser().getUserId());
		String status = getRequest().getParameter("status");
		JbpmTask jbpmTask = getTaskByTaskId(taskId);
		if (jbpmTask == null) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		String instanceId = jbpmTask.getInstance();
		if  (StringUtils.isNotEmpty(CurrentTaskHelper.get(taskId.toString()))) {
			setJsonString("{\"success\":\"false\", \"code\":\"2\", \"message\":\"该文件正在处理，请稍后\"}");
			return SUCCESS;
		}
		CurrentTaskHelper.put(taskId.toString(), currentUserId);
        CurrentTaskHelper.addProcessNum(instanceId, currentUserId);
		// 处理会签同一流程多人同时并发处理，改成串行
		synchronized (SyncUtil.pool.intern(SyncUtil.SYNC_NEXT_PROCESS_FLAG + instanceId)) {
			CustomerLog.customerLog(SyncUtil.customerLog, "开始处理流程（领导）------->" + instanceId + "===" + taskId);
			try {
				// 完成当前任务
				ProcessRun processRun = processRunService.getByTaskId(taskId.toString());
				if (processRun == null) {
					setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
					CurrentTaskHelper.remove(taskId.toString());
                    CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
					return SUCCESS;
				}
				FlowRunInfo flowRunInfo = getFlowRunInfo();
				ProcessFormReq processFormReq = getProcessFormReq();
				String userId = flowRunInfo.getUserId();
				String piId = flowRunInfo.getPiId();

				String assignee = getRequest().getParameter("assignee");
				String assigneeName = getRequest().getParameter("assigneeName");
				ProcessInstance pi = processRunService.saveAndNextStepForMeeting(flowRunInfo,processFormReq,assignee,assigneeName);
				Map variables=flowRunInfo.getVariables();
				String isForkFlow = (String) variables.get("isForkFlow");
				//发送提示信息
				if("true".equals(isForkFlow)){//并发流程发送短信
					noticeForkFlow(variables,processRun);
				}else if( null == pi){
					notice(processRun);
				}else {
					// 通知相关的处理人员
					notice(pi, userId, piId);
				}
				taskAgentService.delTaskGrants(Long.valueOf(taskId));
				setJsonString("{\"success\":\"true\", \"code\":\"1\"}");
			} catch (Exception e) {
				CustomerLog.customerLog(SyncUtil.customerLog, e);
				setJsonString("{\"success\":\"false\", \"code\":\"0\", \"message\":\"操作出错，请联系管理员\"}");
			}
			CurrentTaskHelper.remove(taskId.toString());
            CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
			CustomerLog.customerLog(SyncUtil.customerLog, "结束处理流程（领导）------->" + instanceId + "===" + taskId);
		}
		return SUCCESS;
	}
}
